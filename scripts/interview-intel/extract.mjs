#!/usr/bin/env node
/**
 * Extracts structured interview intel from the raw document cache.
 *
 * Input:  scripts/interview-intel/.cache/raw-docs.json (from scrape.mjs)
 * Output: content/interview-intel/intel.json
 *
 * With GROQ_API_KEY set, uses an LLM to extract companies, process stages,
 * and exact questions. Without it, falls back to a conservative heuristic
 * extractor (high precision, lower recall).
 *
 * Usage: GROQ_API_KEY=... node scripts/interview-intel/extract.mjs [--limit N]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const rawPath = join(here, '.cache', 'raw-docs.json');
const outDir = join(root, 'content', 'interview-intel');
const outPath = join(outDir, 'intel.json');

const GROQ_KEY = process.env.GROQ_API_KEY;
const limitArg = process.argv.includes('--limit')
  ? Number(process.argv[process.argv.indexOf('--limit') + 1])
  : 120;

/* ── Shared vocab ───────────────────────────────────────────────── */
const KINDS = ['coding', 'system-design', 'behavioral', 'recruiter', 'take-home', 'domain-knowledge'];
const STAGES = ['recruiter-screen', 'technical-screen', 'take-home', 'onsite', 'system-design', 'other'];
const TRACKS = ['software', 'ai-engineer', 'quant', 'cybersecurity', 'market-engineering', 'ai-for-science'];

const KNOWN_COMPANIES = [
  'Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'Netflix', 'Stripe', 'Airbnb',
  'Uber', 'Lyft', 'DoorDash', 'Coinbase', 'OpenAI', 'Anthropic', 'DeepMind',
  'Nvidia', 'Tesla', 'Palantir', 'Databricks', 'Snowflake', 'Datadog', 'Cloudflare',
  'Shopify', 'Atlassian', 'Salesforce', 'Oracle', 'IBM', 'Intel', 'AMD', 'Qualcomm',
  'Bloomberg', 'Two Sigma', 'Jane Street', 'Citadel', 'Hudson River Trading',
  'Jump Trading', 'DE Shaw', 'DRW', 'IMC', 'Optiver', 'SIG', 'Akuna Capital',
  'Goldman Sachs', 'JPMorgan', 'Morgan Stanley', 'CrowdStrike', 'Palo Alto Networks',
  'Fortinet', 'Mandiant', 'Rapid7', 'Okta', 'Auth0', 'HubSpot', 'Klaviyo', 'Braze', 'Segment',
];

const relevanceRe = /interview|recruiter|onsite|phone screen|hiring process|offer|behavioral|take.?home/i;

function inferTrack(doc) {
  const hay = `${doc.meta?.subreddit ?? ''} ${doc.title} ${doc.text.slice(0, 1500)}`.toLowerCase();
  if (/quant|trading|hedge fund|prop shop|market maker/.test(hay)) return 'quant';
  if (/cybersecurity|infosec|appsec|security engineer|soc analyst|penetration/.test(hay)) return 'cybersecurity';
  if (/deepmind|anthropic|ai for science|drug discovery|biotech|genomic|climate model|protein structure|ai safety|alignment|research ethics|dual.?use|poverty alleviation|cancer research|frontier lab|isomorphic|recursion|insitro/.test(hay)) return 'ai-for-science';
  if (/machine.?learning|ml engineer|ai engineer|llm|deep learning|data scien|research engineer|computer vision|nlp/.test(hay)) return 'ai-engineer';
  if (/growth|marketing analytics|martech|demand gen|a\/b test/.test(hay)) return 'market-engineering';
  return 'software';
}

function classifyKind(text) {
  const t = text.toLowerCase();
  if (/tell me about a time|describe a (time|situation)|biggest (failure|conflict|challenge)|disagree(d|ment)|why (do you|did you|are you)|how do you handle|weakness|strength|proudest|conflict with/.test(t)) return 'behavioral';
  if (/salary|compensation|expectations|notice period|visa|relocat|why this (company|role)|walk me through your (resume|background)/.test(t)) return 'recruiter';
  if (/design (a|an|the)|architect|scale to|system design|high.?level design/.test(t)) return 'system-design';
  if (/take.?home|assignment|project to complete/.test(t)) return 'take-home';
  if (/implement|write (a|an|the)? ?(function|code|program|query)|algorithm|complexity|leetcode|reverse|two sum|linked list|binary (tree|search)|sql/.test(t)) return 'coding';
  return 'domain-knowledge';
}

function inferStage(text, kind) {
  const t = text.toLowerCase();
  if (/recruiter|hr screen|phone call with hr/.test(t)) return 'recruiter-screen';
  if (/take.?home|assignment/.test(t)) return 'take-home';
  if (/onsite|final round|loop|virtual onsite/.test(t)) return 'onsite';
  if (/phone screen|technical screen|first technical/.test(t)) return 'technical-screen';
  if (kind === 'system-design') return 'system-design';
  if (kind === 'recruiter') return 'recruiter-screen';
  if (kind === 'take-home') return 'take-home';
  return 'other';
}

const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

const decodeEntities = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#0?39;|&apos;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ');

// Meta-discussion about interviews/hiring, not questions asked in one.
const junkRe =
  /interview\w*|hiring|recruit\w*|this sub|candidates?\b|job\b|resume|cv\b|offer\b|posts?\b|thread|guys\b|folks\b|is it (normal|worth|just me)|should i\b|anyone (else|here)|does anyone|leetcode|timeline|→|->|schedule|\d{1,2}\/\d{1,2}|salary trajectory|glassdoor|blind\b/i;

// First-person = reader/candidate voice (advice threads), not an interviewer.
const firstPersonRe = /\b(i|i'm|i've|my|me|mine)\b/i;
// Dangling references need context we do not have ("this approach", "their patch level").
const deixisRe = /\b(this|that|these|those|it|its|their|them|he|she)\b/i;
// Whitelist for short "what is X?" questions: must name something technical.
const techTermRe =
  /dns|sql|api|rest|http|tcp|udp|encrypt|hash|token|oauth|xss|csrf|injection|mitm|brute force|mitre|kill chain|class|interface|regression|architecture|micro ?service|database|nosql|tuple|dictionary|agile|version control|complexity|thread|recursion|cache|index|container|kubernetes|docker|llm|embedding|transformer|gradient|bayes|distribution|volatil|const|static|pointer|garbage collect/i;

const actionVerbRe =
  /write|implement|design|build|code|solve|explain|reverse|optimi[sz]e|find|detect|debug|parse|merge|traverse|model|query|architect|analyze|prove|estimate|calculate/i;

/* ── Heuristic extractor ────────────────────────────────────────── */
function heuristicExtract(doc) {
  const text = doc.text;
  const companies = KNOWN_COMPANIES.filter((c) =>
    new RegExp(`\\b${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text)
  );
  const track = inferTrack(doc);

  const candidates = new Set();
  // Question-mark sentences and "asked me to ..." phrasings.
  for (const m of text.match(/[A-Z"'][^.!?\n]{15,240}\?/g) ?? []) candidates.add(m.trim());
  for (const m of text.match(/asked (?:me )?to ([^.!?\n]{15,200})[.!?\n]/gi) ?? []) {
    candidates.add(m.replace(/^asked (?:me )?to /i, 'You are asked to ').trim());
  }

  // Heuristic mode optimizes for precision: keep only strings that read like
  // questions an interviewer would actually ask, not discussion about hiring.
  const behavioralTemplateRe =
    /^(tell me about a time|describe a (time|situation|project)|give (me )?an example|how (do|would) you (handle|deal|approach|prioritize|resolve)|what would you do if|why (do you want|did you (leave|choose))|what (is|are) your (greatest|biggest)|walk me through a (project|decision))/i;
  const recruiterTemplateRe =
    /salary|compensation|expectations|notice period|visa|relocat|why (this|our) (company|role|team)|walk me through your (resume|background)|when (can|could) you start/i;
  const techTemplateRe =
    /^(what is|what are|what's|explain|how does|how would you (build|design|implement|scale|test|debug|detect|secure)|can [a-z]+ be|what happens when|difference between)/i;

  const lightJunkRe =
    /https?:\/\/|reddit|upvote|downvote|thanks|op\b|this (post|thread|sub)|guys\b|folks\b|interview(s|ers?|ing)? (are|is|were|into|process|story|experience)/i;

  const questions = [];
  for (const raw of candidates) {
    const q = decodeEntities(raw).replace(/^["'*\s]+|["'*\s]+$/g, '').replace(/\*+/g, '');
    const norm = normalize(q);
    if (norm.length < 15 || q.length > 220) continue;
    if (lightJunkRe.test(q)) continue;

    let keep = false;
    let kind = classifyKind(q);
    const firstPerson = firstPersonRe.test(q.replace(/you are asked/i, ''));
    // Context-free or process-note phrasings that survive the templates.
    if (/^you are asked to (explain your approach|solve (three|\d+)|do (a|an|some)? ?\w+ (question|problem)s?\.?$)/i.test(q)) continue;
    if (/questions?\b.*\b(match|asked|needed)\b/i.test(q)) continue;
    if (behavioralTemplateRe.test(q) && !firstPerson) {
      keep = true;
      kind = 'behavioral';
    } else if (recruiterTemplateRe.test(q) && !firstPerson && /^(why|walk me|what are your|when)/i.test(q)) {
      keep = true;
      kind = 'recruiter';
    } else if (junkRe.test(q) || firstPerson || deixisRe.test(q)) {
      keep = false;
    } else if (q.startsWith('You are asked to ')) {
      keep = actionVerbRe.test(q);
    } else if (techTemplateRe.test(q) && q.endsWith('?')) {
      // "What is X?" style needs a recognizable technical subject.
      keep = techTermRe.test(q);
      if (kind === 'domain-knowledge' && actionVerbRe.test(q)) kind = classifyKind(q);
    }
    if (!keep) continue;

    questions.push({
      text: q,
      kind,
      stage: inferStage(q, kind),
    });
    if (questions.length >= 8) break;
  }

  if (questions.length === 0) return null;
  return {
    company: companies[0] ?? null,
    role: null,
    track,
    stages: [],
    processNotes: null,
    questions,
  };
}

/* ── LLM extractor ──────────────────────────────────────────────── */
async function llmExtract(doc) {
  const system = `You extract interview intelligence from web content. Given a document (Reddit thread, blog post, or video transcript), decide whether it describes one or more REAL interview experiences or processes. If not, return {"relevant":false}.

If relevant, return ONLY JSON:
{
  "relevant": true,
  "company": "Company name or null if not stated",
  "role": "role title or null",
  "track": one of ${JSON.stringify(TRACKS)},
  "stages": [{"stage": one of ${JSON.stringify(STAGES)}, "notes": "1-2 sentence summary of what happens in this stage per the source"}],
  "processNotes": "1-3 sentences on timeline, number of rounds, or process quirks, or null",
  "questions": [{"text": "the exact question as asked (verbatim or faithful paraphrase)", "kind": one of ${JSON.stringify(KINDS)}, "stage": one of ${JSON.stringify(STAGES)}}]
}

RULES:
- Only include questions the source says were actually asked. Never invent questions.
- Include behavioral, recruiter, and process questions, not just technical ones.
- Max 10 questions. Skip vague ones ("they asked about my experience").
- Company null is fine; general questions are still valuable.`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: `SOURCE (${doc.source}): ${doc.title}\n\n${doc.text.slice(0, 9000)}` },
      ],
    }),
  });
  if (!res.ok) throw new Error(`groq ${res.status}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? '{}';
  const m = content.match(/\{[\s\S]*\}/);
  if (!m) return null;
  const parsed = JSON.parse(m[0]);
  if (!parsed.relevant) return null;
  parsed.questions = (parsed.questions ?? []).filter(
    (q) => q?.text && KINDS.includes(q.kind) && STAGES.includes(q.stage)
  );
  if (!TRACKS.includes(parsed.track)) parsed.track = inferTrack(doc);
  return parsed.questions.length || parsed.stages?.length ? parsed : null;
}

/* ── Aggregate ──────────────────────────────────────────────────── */
const slug = (s) => normalize(s).replace(/ /g, '-');

async function main() {
  if (!existsSync(rawPath)) {
    console.error('No raw docs. Run scrape.mjs first.');
    process.exit(1);
  }
  const rawDocs = JSON.parse(readFileSync(rawPath, 'utf8'));
  const relevant = rawDocs.filter((d) => relevanceRe.test(`${d.title} ${d.text}`)).slice(0, limitArg);
  console.log(`${rawDocs.length} raw docs, ${relevant.length} relevant (limit ${limitArg})`);
  console.log(GROQ_KEY ? 'Using Groq LLM extraction.' : 'No GROQ_API_KEY: heuristic extraction.');

  const companies = new Map(); // slug -> company record
  const general = []; // questions without a company
  const seenQuestions = new Set();
  let qid = 0;

  const addExtraction = (doc, ex) => {
    if (!ex) return;
    const sourceRef = { type: doc.source, title: doc.title.slice(0, 120), url: doc.url };
    const makeQuestion = (q) => ({
      id: `iq-${++qid}`,
      text: q.text.trim(),
      kind: q.kind,
      stage: q.stage,
      track: ex.track,
      sourceUrl: doc.url,
      sourceType: doc.source,
    });

    const fresh = ex.questions.filter((q) => {
      const key = normalize(q.text);
      if (key.length < 12 || seenQuestions.has(key)) return false;
      seenQuestions.add(key);
      return true;
    });

    if (ex.company) {
      const key = slug(ex.company);
      if (!companies.has(key)) {
        companies.set(key, {
          id: key,
          company: ex.company,
          tracks: [],
          roles: [],
          stages: [],
          processNotes: [],
          questions: [],
          sources: [],
        });
      }
      const rec = companies.get(key);
      if (!rec.tracks.includes(ex.track)) rec.tracks.push(ex.track);
      if (ex.role && !rec.roles.includes(ex.role)) rec.roles.push(ex.role);
      for (const st of ex.stages ?? []) {
        if (!rec.stages.some((s) => s.stage === st.stage)) rec.stages.push(st);
      }
      if (ex.processNotes) rec.processNotes.push(ex.processNotes);
      rec.questions.push(...fresh.map(makeQuestion));
      rec.sources.push(sourceRef);
    } else {
      general.push(...fresh.map(makeQuestion));
    }
  };

  let done = 0;
  for (const doc of relevant) {
    try {
      const ex = GROQ_KEY ? await llmExtract(doc) : heuristicExtract(doc);
      addExtraction(doc, ex);
    } catch (err) {
      console.warn(`  extract ${doc.id}: ${err.message}`);
    }
    done += 1;
    if (done % 20 === 0) console.log(`  ${done}/${relevant.length}…`);
    if (GROQ_KEY) await new Promise((r) => setTimeout(r, 400));
  }

  // Order the stage timeline sensibly and trim noise.
  const stageOrder = STAGES.reduce((acc, s, i) => ((acc[s] = i), acc), {});
  const companyList = [...companies.values()]
    .map((c) => ({
      ...c,
      stages: c.stages.sort((a, b) => stageOrder[a.stage] - stageOrder[b.stage]),
      processNotes: c.processNotes.slice(0, 3),
      questions: c.questions.slice(0, 25),
      sources: c.sources.slice(0, 10),
    }))
    .filter((c) => c.questions.length > 0 || c.stages.length > 0)
    .sort((a, b) => b.questions.length - a.questions.length);

  const output = {
    version: 1,
    generatedAt: new Date().toISOString(),
    extraction: GROQ_KEY ? 'llm' : 'heuristic',
    totalSourceDocs: relevant.length,
    companies: companyList,
    generalQuestions: general.slice(0, 150),
  };

  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, JSON.stringify(output, null, 2));
  const totalQ = companyList.reduce((n, c) => n + c.questions.length, 0) + output.generalQuestions.length;
  console.log(
    `\nWrote ${companyList.length} companies, ${totalQ} questions to ${outPath}`
  );
}

// Exported for research/eval-extract.mjs (Scout loop harness).
export { heuristicExtract, classifyKind, inferStage, inferTrack };

// Only run the pipeline when invoked directly, so the eval harness can
// import the extractor without side effects.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
