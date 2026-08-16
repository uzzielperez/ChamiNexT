import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  ChevronDown,
  Target,
  Sparkles,
  Scale,
  Building2,
  ArrowRight,
  Download,
  Route,
  CreditCard,
} from 'lucide-react';
import PremiumButton from '../components/ui/PremiumButton';
import {
  THINKING_PROCESS,
  MOAT,
  HIREE_LOOP,
  HIRER_LOOP,
  PRICING_NOTES,
} from '../data/investorBriefing';

type FaqItem = {
  q: string;
  a: React.ReactNode;
};

type FaqSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  intro?: string;
  items: FaqItem[];
};

const SECTIONS: FaqSection[] = [
  {
    id: 'pitch',
    title: 'The pitch',
    icon: <Target className="w-5 h-5 text-accent-blue" aria-hidden />,
    intro: THINKING_PROCESS.thesis,
    items: [
      {
        q: 'What problem are we solving?',
        a: (
          <>
            <p className="mb-3">
              Interview prep and hiring screens still optimize for recall. LeetCode-style gates
              broke when AI can pass them trivially — even model-makers cannot build a take-home
              their own models won&apos;t ace.
            </p>
            <p>
              Candidates have no portable proof of readiness. Employers burn senior time on loops
              that predict performance poorly. ChamiNexT closes the loop:{' '}
              <strong className="text-text-primary">practice → talent profile → hire</strong>.
            </p>
          </>
        ),
      },
      {
        q: 'What is the strong signal we produce?',
        a: (
          <>
            <p className="mb-3">
              <strong className="text-text-primary">We grade thinking process, not just output.</strong>{' '}
              A polished answer can be copied or AI-generated. How someone got there cannot be
              faked as easily — their prompts, iterations, and reasoning under adversarial
              follow-up reveal decomposition, judgment, and verification habits.
            </p>
            <p className="mb-3">
              The core question: can this person go from an ambiguous claim → validated,
              defensible reasoning → something shippable — while an interviewer probes their
              assumptions, with AI as co-pilot rather than crutch?
            </p>
            <ul className="list-disc pl-5 space-y-1 text-text-secondary">
              <li>
                <strong className="text-text-primary">Prompt trail</strong> — what they asked AI,
                in what order, with what constraints (their prompts give away their thinking)
              </li>
              <li>
                <strong className="text-text-primary">Live reasoning</strong> — think-aloud,
                trade-offs named before coding, recovery from pushback
              </li>
              <li>Research hygiene (look-ahead, leakage, overfitting)</li>
              <li>Adversarial defense — claims that survive challenge</li>
              <li>Ship proof (deployed URL or PR) with disclosed AI use</li>
            </ul>
          </>
        ),
      },
      {
        q: 'Why grade thinking process, not just output?',
        a: (
          <>
            <p className="mb-3">
              Async screens and take-homes broke because you can pass them with AI you never
              understand. Even Anthropic cannot build a take-home their own model won&apos;t ace.
              Grading only the final artifact is a losing game.
            </p>
            <p className="mb-3">
              <strong className="text-text-primary">Their prompts give away their thinking process.</strong>{' '}
              Did they clarify constraints first? Did they ask for edge cases? Did they verify the
              answer or paste blindly? Did they iterate when something failed? A prompt log is a
              decomposition trace — harder to fake than a green checkmark.
            </p>
            <p>
              That is why every ChamiNexT session combines: (1) a reasoning transcript from live
              mocks, (2) mandatory walkthrough / defense, and (3) AI-assisted work with disclosure
              — scored on <em>how</em> they wielded the tool, not whether they used it.
            </p>
          </>
        ),
      },
      {
        q: 'Who is it for?',
        a: (
          <>
            <p className="mb-3">
              <strong className="text-text-primary">B2C:</strong> junior–mid engineers, career
              switchers, and AI/ML engineers preparing for modern interviews.
            </p>
            <p>
              <strong className="text-text-primary">B2B:</strong> startups and scale-ups hiring
              1–20 engineers per quarter — too small for HackerRank Enterprise, too serious for
              ad-hoc take-homes. Also quant funds and AI labs that care about research hygiene.
            </p>
          </>
        ),
      },
      {
        q: 'What is the business model?',
        a: (
          <>
            <p className="mb-3 text-text-secondary">
              See the <a href="#pricing" className="text-accent-bright hover:underline">Pricing notes</a>{' '}
              section for full tiers. Summary:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-text-secondary">
              <li>Free Daily loop + paid Sprint (€149 / 90 days) and Season (€49/mo)</li>
              <li>B2B Interview Studio from €250/mo (Small) / €900/mo (Growth)</li>
              <li>{PRICING_NOTES.founding.label}</li>
            </ul>
            <p className="mt-3">
              <Link to="/pricing" className="text-accent-bright hover:underline inline-flex items-center gap-1">
                View live pricing <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </>
        ),
      },
      {
        q: "What's hard to replicate?",
        a: (
          <>
            <p className="mb-3">
              <strong className="text-text-primary">{MOAT.layer}</strong>
            </p>
            <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-4 mb-3 font-mono text-xs text-text-secondary leading-relaxed">
              {MOAT.flywheel}
            </div>
            <p className="mb-2">
              <strong className="text-text-primary">Today:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1 text-text-secondary mb-3">
              {MOAT.today.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="mb-2">
              <strong className="text-text-primary">Tomorrow:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1 text-text-secondary mb-3">
              {MOAT.tomorrow.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p>{MOAT.structural}</p>
          </>
        ),
      },
    ],
  },
  {
    id: 'hiring-loop',
    title: 'Customizable hiring loop',
    icon: <Route className="w-5 h-5 text-accent-blue" aria-hidden />,
    intro:
      'Same eval dimensions on both sides. Candidates rehearse your funnel before the real loop; employers configure stages and rubrics in Interview Studio.',
    items: [
      {
        q: 'For candidates (hirees) — stage-by-stage prep',
        a: (
          <>
            <p className="mb-3">{HIREE_LOOP.intro}</p>
            <div className="overflow-x-auto -mx-1 mb-3">
              <table className="w-full min-w-[520px] text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-left text-text-secondary">
                    <th className="py-2 pr-3 font-medium">Stage</th>
                    <th className="py-2 pr-3 font-medium">How you prepare</th>
                  </tr>
                </thead>
                <tbody className="text-text-secondary">
                  {HIREE_LOOP.stages.map((s) => (
                    <tr key={s.stage} className="border-b border-[var(--border-color)]/60">
                      <td className="py-2 pr-3 font-semibold text-text-primary align-top">{s.stage}</td>
                      <td className="py-2 pr-3">{s.practice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mb-2">
              <strong className="text-text-primary">Tracks:</strong>{' '}
              {HIREE_LOOP.tracks.join(' · ')}
            </p>
            <ul className="list-disc pl-5 space-y-1 text-text-secondary">
              {HIREE_LOOP.customization.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="mt-3">
              <Link to="/journey" className="text-accent-bright hover:underline inline-flex items-center gap-1">
                Open hiring journey <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </>
        ),
      },
      {
        q: 'For employers (hirers) — Interview Studio pipeline',
        a: (
          <>
            <p className="mb-3">{HIRER_LOOP.intro}</p>
            <div className="overflow-x-auto -mx-1 mb-3">
              <table className="w-full min-w-[520px] text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-left text-text-secondary">
                    <th className="py-2 pr-3 font-medium">Stage</th>
                    <th className="py-2 pr-3 font-medium">Interview Studio</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-text-secondary">
                  {HIRER_LOOP.stages.map((s) => (
                    <tr key={s.stage} className="border-b border-[var(--border-color)]/60">
                      <td className="py-2 pr-3 font-semibold text-text-primary align-top">{s.stage}</td>
                      <td className="py-2 pr-3">{s.studio}</td>
                      <td className="py-2 pr-3 text-xs">{s.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-text-secondary mb-3">
              {HIRER_LOOP.studioFeatures.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p className="italic text-text-primary">{HIRER_LOOP.designPartnerAsk}</p>
            <p className="mt-3">
              <Link to="/employers" className="text-accent-bright hover:underline inline-flex items-center gap-1">
                Open Interview Studio <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </>
        ),
      },
      {
        q: 'Why customize the loop on both sides?',
        a: (
          <p>
            Candidates fail from <em>stage unpreparedness</em>, not just hard problems. Employers
            hire on day-to-day work — CV → recruiter → Work Ticket → soft skills → pairing — not
            LeetCode theater. When both sides use the same stage map and rubric, practice builds a
            portable profile employers actually rank on. That closed loop is the product — and the
            moat.
          </p>
        ),
      },
    ],
  },
  {
    id: 'pricing',
    title: 'Pricing notes',
    icon: <CreditCard className="w-5 h-5 text-accent-blue" aria-hidden />,
    intro: `${PRICING_NOTES.founding.label}. Code ${PRICING_NOTES.founding.code} — ${PRICING_NOTES.founding.percentOff}% off for the first ${PRICING_NOTES.founding.maxRedemptions} payers.`,
    items: [
      {
        q: 'Individuals (job seekers)',
        a: (
          <div className="space-y-4">
            {PRICING_NOTES.individuals.map((tier) => (
              <div key={tier.name} className="border-l-2 border-accent-blue/40 pl-4">
                <p className="font-semibold text-text-primary">
                  {tier.name}
                  {tier.foundingPrice ? (
                    <>
                      {' '}
                      <span className="text-accent-bright">{tier.foundingPrice}</span>
                      <span className="text-text-secondary font-normal line-through ml-2">
                        {tier.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-accent-bright ml-1">{tier.price}</span>
                  )}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">{tier.detail}</p>
                <ul className="list-disc pl-5 mt-2 space-y-0.5 text-sm text-text-secondary">
                  {tier.includes.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="text-sm text-text-secondary">{PRICING_NOTES.trial}</p>
          </div>
        ),
      },
      {
        q: 'Companies (Interview Studio)',
        a: (
          <div className="space-y-4">
            {PRICING_NOTES.companies.map((tier) => (
              <div key={tier.name} className="border-l-2 border-accent-blue/40 pl-4">
                <p className="font-semibold text-text-primary">
                  {tier.name}
                  <span className="text-text-secondary font-normal ml-2 text-sm">({tier.size})</span>
                </p>
                <p className="text-accent-bright mt-0.5">
                  {tier.foundingPrice ? (
                    <>
                      {tier.foundingPrice} founding
                      <span className="text-text-secondary line-through ml-2 text-sm">{tier.price}</span>
                    </>
                  ) : (
                    tier.price
                  )}
                </p>
                <p className="text-xs text-text-secondary">{tier.detail}</p>
                <ul className="list-disc pl-5 mt-2 space-y-0.5 text-sm text-text-secondary">
                  {tier.includes.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ),
      },
      {
        q: 'Investor / partner pricing context',
        a: (
          <ul className="list-disc pl-5 space-y-1 text-text-secondary">
            {PRICING_NOTES.investorNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        ),
      },
    ],
  },
  {
    id: 'whats-new',
    title: "What's new in this version",
    icon: <Sparkles className="w-5 h-5 text-accent-blue" aria-hidden />,
    intro: 'v1.1 — July/August 2026. Product unchanged at the core; positioning and practice depth expanded.',
    items: [
      {
        q: 'Candidate experience',
        a: (
          <ul className="list-disc pl-5 space-y-1.5 text-text-secondary">
            <li>
              <Link to="/journey" className="text-accent-bright hover:underline">Hiring journey</Link>{' '}
              — choose-your-adventure through CV screen → technical → ship test → soft skills
            </li>
            <li>
              <Link to="/loop" className="text-accent-bright hover:underline">Full-loop simulation</Link>{' '}
              — recruiter screen → technical → behavioral with per-stage debrief
            </li>
            <li>
              <Link to="/drill" className="text-accent-bright hover:underline">5-min rapid-fire drill</Link>{' '}
              — domain fundamentals warm-up
            </li>
            <li>
              <Link to="/intel" className="text-accent-bright hover:underline">Interview intel</Link>{' '}
              — real processes and exact questions, one-click practice
            </li>
            <li>
              <Link to="/coaching/quant-hm-prep" className="text-accent-bright hover:underline">Quant HM prep</Link>{' '}
              and project-walkthrough coaching playlists
            </li>
            <li>Work Tickets — 4h scoped PR tasks with AI allowed and mandatory disclosure</li>
            <li>Soft-skills pipeline — five structured behavioral phases with dedicated rubrics</li>
            <li>Voice lessons + AI Coach onboarding (Jack &amp; Jill lineage, IP-safe)</li>
            <li>Google sign-in, Stripe checkout, founding 40% cohort offer</li>
          </ul>
        ),
      },
      {
        q: 'Employer experience',
        a: (
          <ul className="list-disc pl-5 space-y-1.5 text-text-secondary">
            <li>
              <Link to="/employers" className="text-accent-bright hover:underline">Interview Studio</Link>{' '}
              — assign Ship Tests, rank candidates on thinking + shipping
            </li>
            <li>Soft-skills pack configurable per role</li>
            <li>Company-tier pricing by headcount with free 60-day pilot</li>
            <li>Demo seed for design-partner conversations</li>
          </ul>
        ),
      },
      {
        q: 'Positioning evolution (v1.1)',
        a: (
          <p>
            Mission connector added: route misallocated technical talent toward work that matters
            — frontier science, drug discovery, climate — with proof, not credentials. Same
            evaluation engine serves mission-driven and revenue-first employers. Lead with mission;
            sell to whoever has pain and budget.
          </p>
        ),
      },
    ],
  },
  {
    id: 'landscape',
    title: 'Competitive landscape',
    icon: <Scale className="w-5 h-5 text-accent-blue" aria-hidden />,
    intro:
      'We are not "LeetCode but better." We grade how candidates think — prompts, reasoning, defense — not just whether the final answer passes.',
    items: [
      {
        q: 'How we compare',
        a: (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full min-w-[640px] text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-left text-text-secondary">
                  <th className="py-2 pr-3 font-medium">Platform</th>
                  <th className="py-2 pr-3 font-medium">What they optimize</th>
                  <th className="py-2 pr-3 font-medium">Gap ChamiNexT fills</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                <tr className="border-b border-[var(--border-color)]/60">
                  <td className="py-3 pr-3 font-semibold text-text-primary">LeetCode</td>
                  <td className="py-3 pr-3">Algorithm recall, puzzle throughput — grades final answer only</td>
                  <td className="py-3 pr-3">No thinking-process trail, no live defense, no prompt grading; signal dead under AI</td>
                </tr>
                <tr className="border-b border-[var(--border-color)]/60">
                  <td className="py-3 pr-3 font-semibold text-text-primary">HackerRank</td>
                  <td className="py-3 pr-3">Async pass/fail on test cases — output, not process</td>
                  <td className="py-3 pr-3">No prompt trail, no mandatory walkthrough; too heavy for 1–20 hire/quarter startups</td>
                </tr>
                <tr className="border-b border-[var(--border-color)]/60">
                  <td className="py-3 pr-3 font-semibold text-text-primary">getcracked</td>
                  <td className="py-3 pr-3">Quant prep — trading/dev/systems question bank + Discord community intel</td>
                  <td className="py-3 pr-3">Prep-only, no AI interviewer, no Ship Tests, no employer-side ranked shortlist or portable profile</td>
                </tr>
                <tr className="border-b border-[var(--border-color)]/60">
                  <td className="py-3 pr-3 font-semibold text-text-primary">AIcrowd</td>
                  <td className="py-3 pr-3">Crowdsourced ML competitions and classroom assignments</td>
                  <td className="py-3 pr-3">Research/challenge hosting, not hiring evaluation — no interview simulation or hire-ready rubric</td>
                </tr>
                <tr>
                  <td className="py-3 pr-3 font-semibold text-accent-bright">ChamiNexT</td>
                  <td className="py-3 pr-3">Thinking process graded — prompts, reasoning trace, live defense, ship proof</td>
                  <td className="py-3 pr-3">Two-sided eval stack: practice builds the trail; Interview Studio ranks on it</td>
                </tr>
              </tbody>
            </table>
          </div>
        ),
      },
      {
        q: 'Why not just use getcracked for quant?',
        a: (
          <p>
            getcracked is strong community intel and firm-specific quant content — valuable for
            knowing what was asked. ChamiNexT adds what they cannot: live AI mocks with adversarial
            follow-ups, research-hygiene rubrics (look-ahead, capacity, attribution), full-loop
            simulation, Work Tickets, and an employer-facing ranked shortlist. Complementary for
            candidates; we own the evaluation layer for hiring teams.
          </p>
        ),
      },
      {
        q: 'Why not just run an AIcrowd challenge?',
        a: (
          <p>
            AIcrowd excels at ML competition logistics — submissions, leaderboards, grading code.
            Hiring needs stage-aware simulation (recruiter → technical → behavioral), mandatory
            walkthroughs, soft-skill rubrics, and a portable talent profile employers trust.
            ChamiNexT borrows the &quot;prove it on real work&quot; instinct but builds for the
            full interview funnel, not Kaggle-style leaderboard-only signal.
          </p>
        ),
      },
      {
        q: 'One-line vs HackerRank',
        a: (
          <p className="italic text-text-primary">
            &quot;They&apos;re optimized for async volume screening — which is exactly what&apos;s
            broken under AI cheating. We&apos;re the walkthrough + defense + optional Work Ticket
            layer on the shortlist. Complementary.&quot;
          </p>
        ),
      },
    ],
  },
  {
    id: 'b2b',
    title: 'What B2B interviews taught us',
    icon: <Building2 className="w-5 h-5 text-accent-blue" aria-hidden />,
    intro:
      'Synthesized from design-partner and hiring-manager conversations (quant funds, growth-stage engineering, AI labs) — June–August 2026.',
    items: [
      {
        q: 'The AI-cheating crisis is the wedge',
        a: (
          <>
            <p className="mb-3">
              ~60–80% fraud rates on async take-homes. ~59% of hiring managers suspect AI
              misrepresentation. Detection is an arms race you lose — Cluely-style overlays beat
              proctoring.
            </p>
            <p>
              <strong className="text-text-primary">Lesson:</strong> don&apos;t pitch surveillance.
              Pitch assessment redesign — assume AI is present and measure how well they wield it.
            </p>
          </>
        ),
      },
      {
        q: 'Real interviews are mostly not algorithms',
        a: (
          <p>
            Field data (238 scraped reports + user field reports): domain rapid-fire, behavioral,
            and recruiter questions dominate. Candidates fail from <em>stage unpreparedness</em>,
            not just hard problems. Employers confirmed: growth-stage pipelines are CV → recruiter
            → work ticket (AI allowed) → soft skills → pairing — not whiteboard theater.
          </p>
        ),
      },
      {
        q: 'Quant HMs test research hygiene, not puzzles',
        a: (
          <p>
            Options-MM and systematic-fund hiring managers evaluate intellectual honesty,
            adversarial reasoning, production instinct, and team fit. Vocabulary that lands:
            point-in-time, look-ahead, survivorship, capacity, alpha decay, kill switch. LeetCode
            war stories actively hurt credibility.
          </p>
        ),
      },
      {
        q: 'Pain is quantifiable — and pricing holds',
        a: (
          <ul className="list-disc pl-5 space-y-1 text-text-secondary">
            <li>Bad engineering hire ≈ 1.5–2× annual salary ($150k–300k+ at senior)</li>
            <li>~35 interviews per engineering hire; 8–15 senior hours per hire</li>
            <li>50–62 day time-to-fill = ongoing opportunity cost</li>
            <li>B2B at €250–900/mo maps to problems costing €15–50k/yr — math works if signal is proven</li>
          </ul>
        ),
      },
      {
        q: 'Buyers want their funnel, not ours',
        a: (
          <p>
            Design partners asked to configure stages in Interview Studio — soft-skills pack, Work
            Ticket per stack, quant rubric critique. The Mom Test gold: &quot;When someone turned
            out great, what did they <em>do</em> that the interview should&apos;ve caught?&quot;
            That feeds our eval engine directly.
          </p>
        ),
      },
      {
        q: 'Segment urgency (still resolving)',
        a: (
          <ul className="list-disc pl-5 space-y-1 text-text-secondary">
            <li>
              <strong className="text-text-primary">AI startups (Series A–C):</strong> fastest pain,
              too small for enterprise suites
            </li>
            <li>
              <strong className="text-text-primary">Quant / prop:</strong> deepest rubric fit,
              longer sales cycle, highest credibility bar for founder
            </li>
            <li>
              <strong className="text-text-primary">AI labs:</strong> work-trials already trusted;
              we slot before senior onsite as hygiene screen
            </li>
          </ul>
        ),
      },
      {
        q: 'How to help (what we ask design partners)',
        a: (
          <ol className="list-decimal pl-5 space-y-2 text-text-secondary">
            <li>
              <strong className="text-text-primary">Design partner (no cash):</strong> 30 min quant
              rubric critique → free 60-day pilot on one role
            </li>
            <li>
              <strong className="text-text-primary">Referral / champion:</strong> intro to one fund
              or team → free Interview Season for candidates + firm pilot
            </li>
            <li>
              <strong className="text-text-primary">Angel ($20–50k):</strong> SAFE ($2M cap) or
              1.5× payback on attributed B2B revenue over 24 months
            </li>
          </ol>
        ),
      },
    ],
  },
];

const Accordion: React.FC<{ item: FaqItem; defaultOpen?: boolean }> = ({
  item,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[var(--border-color)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-start gap-3 py-4 text-left group"
      >
        <ChevronDown
          className={`w-5 h-5 shrink-0 mt-0.5 text-text-secondary transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
        <span className="font-semibold text-text-primary group-hover:text-accent-bright transition-colors">
          {item.q}
        </span>
      </button>
      {open && (
        <div className="pb-4 pl-8 text-sm text-text-secondary leading-relaxed">{item.a}</div>
      )}
    </div>
  );
};

const FAQPage: React.FC = () => {
  const [pdfLoading, setPdfLoading] = useState(false);

  const handlePdfDownload = async () => {
    setPdfLoading(true);
    try {
      const { downloadInvestorBriefingPdf } = await import('../utils/investorBriefingPdf');
      downloadInvestorBriefingPdf();
    } finally {
      setTimeout(() => setPdfLoading(false), 400);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 rounded-xl bg-accent-blue/10 shrink-0">
            <HelpCircle className="w-8 h-8 text-accent-blue" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-bright mb-1">
              Investor &amp; partner briefing
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">FAQs</h1>
            <p className="mt-2 text-text-secondary max-w-xl">
              Thinking-process grading, moat, customizable hiring loops for hirees and hirers, and
              pricing — plus competitive landscape and B2B learnings.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <PremiumButton
                variant="outline"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={handlePdfDownload}
                disabled={pdfLoading}
              >
                {pdfLoading ? 'Generating…' : 'Download PDF'}
              </PremiumButton>
              <a
                href="/ChamiNexT-investor-briefing.pdf"
                download
                className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent-bright px-3 py-2 rounded-lg border border-[var(--border-color)] transition-colors"
              >
                Static PDF
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-xs font-medium px-3 py-1.5 rounded-full border border-[var(--border-color)] text-text-secondary hover:text-accent-bright hover:border-accent-blue/40 transition-colors"
            >
              {s.title}
            </a>
          ))}
        </div>

        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden"
            >
              <div className="p-5 md:p-6 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-3 mb-2">
                  {section.icon}
                  <h2 className="text-xl font-bold text-text-primary">{section.title}</h2>
                </div>
                {section.intro && (
                  <p className="text-sm text-text-secondary leading-relaxed pl-8">{section.intro}</p>
                )}
              </div>
              <div className="px-5 md:px-6">
                {section.items.map((item, i) => (
                  <Accordion key={item.q} item={item} defaultOpen={i === 0} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-[var(--radius-card)] border border-accent-blue/30 bg-accent-blue/5 text-center">
          <p className="text-sm text-text-secondary mb-4">
            Want the full deck, a live demo, or a design-partner pilot?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/employers">
              <PremiumButton variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                Interview Studio
              </PremiumButton>
            </Link>
            <Link to="/journey">
              <PremiumButton variant="outline" size="sm">
                Try the product
              </PremiumButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
