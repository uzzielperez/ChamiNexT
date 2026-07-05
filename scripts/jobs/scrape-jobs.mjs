#!/usr/bin/env node
/**
 * Job intel scraper — no partnerships required.
 *
 * Sources (all public; failures are logged and skipped):
 *   - Greenhouse board API   boards-api.greenhouse.io/v1/boards/{token}/jobs
 *   - Lever postings API     api.lever.co/v0/postings/{company}
 *   - Remotive API           remotive.com/api/remote-jobs
 *   - RemoteOK API           remoteok.com/api
 *   - HN "Who is hiring?"    hn.algolia.com (latest thread's top-level comments)
 *   - LinkedIn guest search  best-effort; frequently blocked (403/999)
 *
 * Output: content/jobs/jobs.json — every job carries a source URL, an inferred
 * track (drill/loop/skill-tree compatible), and a mission flag.
 *
 * Incremental: merges with .cache/jobs-cache.json by id; jobs older than
 * MAX_AGE_DAYS are dropped on each run so the board stays fresh.
 *
 * Usage: node scripts/jobs/scrape-jobs.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const cacheDir = join(here, '.cache');
const cachePath = join(cacheDir, 'jobs-cache.json');
const outDir = join(root, 'content', 'jobs');
const outPath = join(outDir, 'jobs.json');

const SOURCES = JSON.parse(readFileSync(join(here, 'sources.json'), 'utf8'));
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const MAX_AGE_DAYS = 45;
const MAX_JOBS = 400;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ── Helpers ────────────────────────────────────────────────────── */

// djb2 — stable ids across runs.
function hashId(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

const stripHtml = (s) =>
  (s ?? '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x27;|&#0?39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Same taxonomy as the intel pipeline / skill trees.
function inferTrack(text) {
  const t = text.toLowerCase();
  if (/quant|trading|hedge fund|prop shop|market mak/.test(t)) return 'quant';
  if (/security engineer|infosec|appsec|penetration|soc analyst|threat|cybersecurity/.test(t)) return 'cybersecurity';
  if (/deepmind|anthropic|drug discovery|biotech|genomic|climate model|protein structure|ai safety|alignment|oncology|conservation|poverty alleviation|scientific ml|research ethics/.test(t)) return 'ai-for-science';
  if (/machine.?learning|ml engineer|ai engineer|llm|deep learning|data scien|research engineer|computer vision|nlp/.test(t)) return 'ai-engineer';
  if (/growth engineer|marketing analytics|martech|demand gen|growth market/.test(t)) return 'market-engineering';
  return 'software';
}

const missionRe = new RegExp(SOURCES.missionKeywords, 'i');
// Boards with no description text still deserve the flag when the company
// itself is a frontier-science org.
const MISSION_COMPANIES = new Set([
  'Anthropic',
  'OpenAI',
  'Recursion',
  'Isomorphic Labs',
  'Watershed',
  'Pachama',
  'Commonwealth Fusion',
  'Tempus',
  'Insitro',
  'Benchling',
  'Scale AI',
]);
const engineerRe = /engineer|developer|scientist|research|ml |ai |data|security|quant|sre|devops|infrastructure|backend|frontend|full.?stack/i;

function makeJob({ title, company, location, url, source, postedAt, description }) {
  const hay = `${title} ${company} ${description ?? ''}`;
  if (!engineerRe.test(hay)) return null;
  const desc = stripHtml(description ?? '').slice(0, 360);
  return {
    id: `job-${hashId(url)}`,
    title: stripHtml(title).slice(0, 140),
    company: stripHtml(company).slice(0, 80) || 'Unknown',
    location: stripHtml(location ?? '').slice(0, 80) || 'Not stated',
    remote: /remote|anywhere|distributed/i.test(`${location} ${desc}`),
    url,
    source,
    postedAt: postedAt || new Date().toISOString(),
    description: desc,
    track: inferTrack(hay),
    mission: MISSION_COMPANIES.has(stripHtml(company)) || missionRe.test(hay),
  };
}

async function getJson(url, headers = {}) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json', ...headers } });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

/* ── Sources ────────────────────────────────────────────────────── */

// Greenhouse board tokens don't carry a display name in the /jobs response.
const BOARD_NAMES = {
  anthropic: 'Anthropic',
  openai: 'OpenAI',
  stripe: 'Stripe',
  databricks: 'Databricks',
  scaleai: 'Scale AI',
  benchling: 'Benchling',
  recursionpharmaceuticals: 'Recursion',
  isomorphiclabs: 'Isomorphic Labs',
  watershed: 'Watershed',
  pachama: 'Pachama',
  spanio: 'Span',
  commonwealthfusionsystems: 'Commonwealth Fusion',
  tempus: 'Tempus',
  insitro: 'Insitro',
  grammarly: 'Grammarly',
  cloudflare: 'Cloudflare',
  figma: 'Figma',
  duolingo: 'Duolingo',
  palantir: 'Palantir',
  mistral: 'Mistral AI',
  plaid: 'Plaid',
  attentive: 'Attentive',
  voltrondata: 'Voltron Data',
};

async function scrapeGreenhouse() {
  const jobs = [];
  for (const board of SOURCES.greenhouseBoards) {
    try {
      const data = await getJson(`https://boards-api.greenhouse.io/v1/boards/${board}/jobs`);
      for (const j of data.jobs ?? []) {
        const job = makeJob({
          title: j.title,
          company: BOARD_NAMES[board] ?? board,
          location: j.location?.name,
          url: j.absolute_url,
          source: 'greenhouse',
          postedAt: j.updated_at,
          description: '',
        });
        if (job) jobs.push(job);
      }
      console.log(`  greenhouse/${board}: ${data.jobs?.length ?? 0} postings`);
    } catch (err) {
      console.log(`  greenhouse/${board}: skipped (${err.message})`);
    }
    await sleep(300);
  }
  return jobs;
}

async function scrapeLever() {
  const jobs = [];
  for (const board of SOURCES.leverBoards) {
    try {
      const data = await getJson(`https://api.lever.co/v0/postings/${board}?mode=json`);
      for (const j of data ?? []) {
        const job = makeJob({
          title: j.text,
          company: BOARD_NAMES[board] ?? board,
          location: j.categories?.location,
          url: j.hostedUrl,
          source: 'lever',
          postedAt: j.createdAt ? new Date(j.createdAt).toISOString() : undefined,
          description: j.descriptionPlain?.slice(0, 500),
        });
        if (job) jobs.push(job);
      }
      console.log(`  lever/${board}: ${data?.length ?? 0} postings`);
    } catch (err) {
      console.log(`  lever/${board}: skipped (${err.message})`);
    }
    await sleep(300);
  }
  return jobs;
}

async function scrapeRemotive() {
  const jobs = [];
  for (const search of SOURCES.remotive.searches) {
    try {
      const data = await getJson(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(search)}&limit=40`);
      for (const j of data.jobs ?? []) {
        const job = makeJob({
          title: j.title,
          company: j.company_name,
          location: j.candidate_required_location || 'Remote',
          url: j.url,
          source: 'remotive',
          postedAt: j.publication_date,
          description: j.description?.slice(0, 800),
        });
        if (job) jobs.push(job);
      }
      console.log(`  remotive "${search}": ${data.jobs?.length ?? 0} postings`);
    } catch (err) {
      console.log(`  remotive "${search}": skipped (${err.message})`);
    }
    await sleep(500);
  }
  return jobs;
}

async function scrapeRemoteOk() {
  const jobs = [];
  try {
    const data = await getJson('https://remoteok.com/api');
    const tagSet = new Set(SOURCES.remoteok.tags);
    for (const j of data) {
      if (!j?.slug || !j.position) continue; // first element is a legal notice
      const tags = (j.tags ?? []).map((t) => String(t).toLowerCase());
      if (!tags.some((t) => tagSet.has(t))) continue;
      const job = makeJob({
        title: j.position,
        company: j.company,
        location: j.location || 'Remote',
        url: j.url?.startsWith('http') ? j.url : `https://remoteok.com${j.url ?? `/remote-jobs/${j.slug}`}`,
        source: 'remoteok',
        postedAt: j.date,
        description: j.description?.slice(0, 800),
      });
      if (job) jobs.push(job);
    }
    console.log(`  remoteok: ${jobs.length} matching postings`);
  } catch (err) {
    console.log(`  remoteok: skipped (${err.message})`);
  }
  return jobs;
}

async function scrapeHackerNews() {
  const jobs = [];
  if (!SOURCES.hackerNews.whoIsHiring) return jobs;
  try {
    const search = await getJson(
      'https://hn.algolia.com/api/v1/search_by_date?tags=story,author_whoishiring&query=%22who%20is%20hiring%22&hitsPerPage=1'
    );
    const story = search.hits?.[0];
    if (!story) throw new Error('no thread found');
    console.log(`  hn: thread "${story.title}"`);
    const thread = await getJson(`https://hn.algolia.com/api/v1/items/${story.objectID}`);
    let n = 0;
    for (const c of thread.children ?? []) {
      if (n >= SOURCES.hackerNews.maxComments) break;
      const text = stripHtml(c.text ?? '');
      if (text.length < 60) continue;
      n += 1;
      // Convention: "Company | Role | Location | ..." in the first line.
      const firstLine = text.split(/(?<=[.!?])\s/)[0] ?? text.slice(0, 120);
      const parts = firstLine.split('|').map((s) => s.trim());
      const job = makeJob({
        title: parts[1] || firstLine.slice(0, 100),
        company: parts[0]?.slice(0, 60) || 'HN poster',
        location: parts[2] || (/remote/i.test(text) ? 'Remote' : 'Not stated'),
        url: `https://news.ycombinator.com/item?id=${c.id}`,
        source: 'hn-whoishiring',
        postedAt: c.created_at,
        description: text.slice(0, 800),
      });
      if (job) jobs.push(job);
    }
    console.log(`  hn: ${jobs.length} postings from ${n} comments`);
  } catch (err) {
    console.log(`  hn: skipped (${err.message})`);
  }
  return jobs;
}

async function scrapeLinkedIn() {
  const jobs = [];
  if (!SOURCES.linkedin.enabled) return jobs;
  for (const { keywords, location } of SOURCES.linkedin.searches) {
    try {
      const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location)}&start=0`;
      const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'text/html' } });
      if (!res.ok) throw new Error(`${res.status}`);
      const html = await res.text();
      const cards = html.split('<li').slice(1);
      let n = 0;
      for (const card of cards.slice(0, 25)) {
        const title = card.match(/base-search-card__title[^>]*>([\s\S]*?)</)?.[1];
        const company = card.match(/base-search-card__subtitle[^>]*>[\s\S]*?>([\s\S]*?)</)?.[1];
        const loc = card.match(/job-search-card__location[^>]*>([\s\S]*?)</)?.[1];
        const link = card.match(/href="(https:\/\/[^"]*linkedin\.com\/jobs\/view\/[^"?]+)/)?.[1];
        if (!title || !link) continue;
        const job = makeJob({
          title,
          company: company ?? 'Unknown',
          location: loc ?? location,
          url: link,
          source: 'linkedin',
          description: '',
        });
        if (job) {
          jobs.push(job);
          n += 1;
        }
      }
      console.log(`  linkedin "${keywords}" @ ${location}: ${n} postings`);
    } catch (err) {
      console.log(`  linkedin "${keywords}": blocked/skipped (${err.message}) — expected without partnership`);
    }
    await sleep(1500);
  }
  return jobs;
}

/* ── Main ───────────────────────────────────────────────────────── */

async function main() {
  console.log('Scraping job sources…');
  const batches = [];
  batches.push(await scrapeGreenhouse());
  batches.push(await scrapeLever());
  batches.push(await scrapeRemotive());
  batches.push(await scrapeRemoteOk());
  batches.push(await scrapeHackerNews());
  batches.push(await scrapeLinkedIn());

  const fresh = batches.flat();

  // Merge with cache (incremental across runs), then age out stale jobs.
  let cached = [];
  if (existsSync(cachePath)) {
    try {
      cached = JSON.parse(readFileSync(cachePath, 'utf8'));
    } catch {
      cached = [];
    }
  }
  const byId = new Map(cached.map((j) => [j.id, j]));
  for (const j of fresh) byId.set(j.id, j);

  const cutoff = Date.now() - MAX_AGE_DAYS * 86400_000;
  const alive = [...byId.values()]
    .filter((j) => new Date(j.postedAt).getTime() > cutoff)
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  // Mission jobs are the point of the board — never let volume sources crowd
  // them out of the cap.
  const missionJobs = alive.filter((j) => j.mission);
  const rest = alive.filter((j) => !j.mission).slice(0, Math.max(0, MAX_JOBS - missionJobs.length));
  const merged = [...missionJobs, ...rest].sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );

  if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });
  writeFileSync(cachePath, JSON.stringify(merged, null, 2));

  const output = {
    version: 1,
    generatedAt: new Date().toISOString(),
    totalJobs: merged.length,
    sources: [...new Set(merged.map((j) => j.source))],
    jobs: merged,
  };
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, JSON.stringify(output, null, 2));

  const missions = merged.filter((j) => j.mission).length;
  console.log(
    `\nWrote ${merged.length} jobs (${fresh.length} fresh this run, ${missions} mission-flagged) to ${outPath}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
