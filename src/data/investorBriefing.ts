/**
 * Shared investor / partner briefing copy — used by FAQ page and PDF export.
 */

import { FOUNDING, LIST_PRICES, discountedCents, formatEurFromCents } from './foundingOffer';

export const BRIEFING_META = {
  title: 'ChamiNexT — Investor & Partner Briefing',
  subtitle: 'Thinking-process evaluation for technical hiring in the AI era',
  version: 'v1.1 · August 2026',
  site: 'chaminext.com',
  contact: 'hello@chaminext.com',
} as const;

export const THINKING_PROCESS = {
  headline: 'We grade thinking process — not just final answers.',
  thesis:
    'In the AI era, output is cheap. How someone decomposes, prompts, iterates, and defends under pushback is the signal.',
  insight:
    'Their prompts give away their thinking process. Did they clarify constraints first? Ask for edge cases? Verify or paste blindly? Iterate when something failed? A prompt log is a decomposition trace — harder to fake than a green checkmark.',
  sessionStack: [
    'Reasoning transcript from live AI mocks (think-aloud, adversarial follow-up)',
    'Mandatory walkthrough / defense — claims must survive challenge',
    'AI-assisted work with disclosure — scored on how they wielded the tool, not whether they used it',
  ],
  dimensions: [
    'Prompt trail — what they asked AI, in what order, with what constraints',
    'Live reasoning — trade-offs before coding, recovery from pushback',
    'Research hygiene — look-ahead, leakage, overfitting (quant / AI-for-science)',
    'Adversarial defense — methodology that survives challenge',
    'Ship proof — deployed URL or PR with disclosed AI use',
  ],
} as const;

export const MOAT = {
  headline: "What's hard to replicate",
  layer:
    'A graded thinking-process trail on both sides of hiring — practice and Interview Studio on the same rubric.',
  flywheel:
    'Prompt / reasoning trace → live defense → ship artifact → talent profile → employer rank → hire outcome → rubric recalibration',
  today: [
    'Transcript + prompt-trail scoring on live mocks',
    'Mandatory walkthrough rubrics wired into the interview agent',
    'Field reports from real interviews linked to one-click practice',
    'Two-sided architecture: candidates build the trail; employers rank on the same dimensions',
  ],
  tomorrow: [
    'Which process signals (prompt quality, pushback recovery, iteration discipline) predict onsite pass and good hire',
    'Rubric recalibration calibrated per employer and role',
  ],
  structural:
    'Prep tools (LeetCode, getcracked) never see hire outcomes. Screening tools (HackerRank) never see daily practice or prompt trails at scale. Owning both on one eval stack is the moat.',
} as const;

export const HIREE_LOOP = {
  headline: 'Customizable hiring-loop preparation (candidates)',
  intro:
    'Candidates rehearse the full funnel before the real loop — not isolated puzzles. Stages, tracks, and coaching paths are configurable to match target companies.',
  stages: [
    {
      stage: 'CV & pre-screen',
      practice: 'Talent profile, Coach onboarding, mission-fit narrative',
      route: '/journey → cv-screen · /coach',
    },
    {
      stage: 'Recruiter / HR screen',
      practice: 'Recruiter-domain mocks, motivation and fit probing',
      route: '/loop · /practice (recruiter domain)',
    },
    {
      stage: 'Technical screen',
      practice: 'AI mocks with adversarial follow-ups; skill-tree fundamentals; 5-min drill',
      route: '/practice · /drill · /skills',
    },
    {
      stage: 'Ship test / Work Ticket',
      practice: '24h / 72h / 7d builds; 4h Work Ticket with PR submit; AI allowed + disclosure',
      route: '/practice → Ship Tests · /journey → ship-test',
    },
    {
      stage: 'Soft skills & team fit',
      practice: 'Five-phase behavioral pipeline; ethics probes; STAR coaching playlists',
      route: '/coaching/ethics-soft-skills · /journey → soft-skills',
    },
    {
      stage: 'Pairing & final loop',
      practice: 'Project walkthrough coaching; system design; full-loop simulation',
      route: '/coaching/project-walkthrough · /loop',
    },
  ],
  tracks: [
    'Software',
    'AI Engineer',
    'Quant',
    'Cybersecurity',
    'Market Engineering',
    'AI for Science',
  ],
  customization: [
    'Choose track + target companies in Coach onboarding',
    'Interview intel (/intel) — practice exact questions from real processes',
    'Full-loop simulation (/loop) — recruiter → technical → behavioral with debrief',
    'Field reports — log what you were actually asked; platform generates practice problems',
  ],
} as const;

export const HIRER_LOOP = {
  headline: 'Customizable hiring-loop preparation (employers)',
  intro:
    'Interview Studio mirrors how growth-stage teams actually hire — configurable stages, rubrics, and assessments per role. Same eval dimensions candidates practice on.',
  stages: [
    {
      stage: 'CV / profile pre-screen',
      studio: 'Talent profile with thinking + ship scores (roadmap: mission rubric)',
      status: 'Planned',
    },
    {
      stage: 'Recruiter screen',
      studio: 'Recruiter-fit rubric; ranked shortlist export',
      status: 'Live',
    },
    {
      stage: 'Work Ticket / Ship Test',
      studio: 'Assign custom or template tickets per role; PR + deploy scoring; AI disclosure required',
      status: 'Live',
    },
    {
      stage: 'Soft skills (5 phases)',
      studio: 'Configurable soft-skills pack per role — ownership, conflict, pragmatism, mentorship, ethics',
      status: 'Live',
    },
    {
      stage: 'Pairing / repo review',
      studio: 'Custom starter repos per stack; devcontainer branches (roadmap)',
      status: 'Planned',
    },
  ],
  studioFeatures: [
    'Create roles with Ship Test + soft-skills pack toggles',
    'Rank candidates on thinking, shipping, and communication',
    'CSV export for ATS handoff; Growth tier adds volume + custom Work Tickets',
    '60-day free pilot on all paid tiers',
    'Enterprise: custom rubrics calibrated to your bar, SSO, API',
  ],
  designPartnerAsk:
    'Configure your actual funnel in Interview Studio — we calibrate rubrics from your "great hire" stories.',
} as const;

export const PRICING_NOTES = {
  headline: 'Pricing',
  founding: {
    code: FOUNDING.code,
    percentOff: FOUNDING.percentOff,
    maxRedemptions: FOUNDING.maxRedemptions,
    label: FOUNDING.label,
  },
  individuals: [
    {
      name: 'Daily',
      price: '€0 forever',
      foundingPrice: null,
      detail: 'Duolingo-style daily loop — free front door',
      includes: [
        'Daily loop + streak tracking',
        '2 AI interviews / day',
        '1 Ship Test / month',
        'Basic talent profile',
      ],
    },
    {
      name: 'Sprint',
      price: formatEurFromCents(LIST_PRICES['interview-season']),
      foundingPrice: formatEurFromCents(discountedCents(LIST_PRICES['interview-season'])),
      detail: 'One payment · 90-day access · active job hunt',
      includes: [
        'Unlimited AI interviews + all Ship Tests',
        'Work Ticket practice (PR submit)',
        'Portfolio export · talent profile visible to employers',
      ],
    },
    {
      name: 'Season',
      price: `${formatEurFromCents(LIST_PRICES.builder)}/mo`,
      foundingPrice: `${formatEurFromCents(discountedCents(LIST_PRICES.builder))}/mo`,
      detail: 'Cancel anytime · 3–4 month typical runway',
      includes: [
        'Unlimited AI interviews',
        'All Ship Test + Work Ticket formats',
        'Skill tree tracks + drill paths',
        'Portfolio export + coaching notes',
      ],
    },
  ],
  trial: '30-day Builder trial (one per device until server-backed accounts)',
  companies: [
    {
      name: 'Small Business',
      size: 'Up to 50 employees',
      price: `${formatEurFromCents(LIST_PRICES['biz-small'])}/mo`,
      foundingPrice: `${formatEurFromCents(discountedCents(LIST_PRICES['biz-small']))}/mo`,
      detail: 'Annual = 2 months free · 60-day free pilot',
      includes: [
        '2 open roles · 25 assessments / month',
        'AI interviews + one custom Ship Test',
        'Soft-skills rubric pack · ranked shortlists · CSV export',
      ],
    },
    {
      name: 'Growth',
      size: '50–500 employees',
      price: `${formatEurFromCents(LIST_PRICES['biz-growth'])}/mo`,
      foundingPrice: `${formatEurFromCents(discountedCents(LIST_PRICES['biz-growth']))}/mo`,
      detail: 'Annual = 2 months free · 60-day free pilot',
      includes: [
        '10 open roles · 150 assessments / month',
        'Custom Ship Tests + Work Tickets per role',
        'Soft-skills rubric packs · priority support',
      ],
    },
    {
      name: 'Enterprise',
      size: '500+ employees',
      price: 'Custom annual contract',
      foundingPrice: null,
      detail: 'Mission pricing available for nonprofits / research labs',
      includes: [
        'Unlimited roles · SSO / SAML · API + ATS integrations',
        'Custom rubrics calibrated to your bar',
        'Dedicated support + security review',
      ],
    },
  ],
  investorNotes: [
    'B2B WTP maps to problems costing €15–50k/yr; bad hire ≈ $150k–300k+ at senior',
    'Base case revenue path (deck): ~€230k Y1 → ~€1.15M Y2 with B2B design partners',
    'Angel structures: $20–50k SAFE ($2M cap) or 1.5× payback on attributed B2B over 24 months',
  ],
} as const;

export const MARKET_INTEL = {
  headline: 'Early conversations & field intel',
  note: 'Interview-loop intel from real processes powers the practice loops; employer conversations validate the category.',
  entries: [
    {
      company: 'Susquehanna (SIG)',
      status: 'intel',
      detail: 'Quant interview-loop intel gathered — powers the quant practice track',
    },
    {
      company: 'Verve',
      status: 'intel',
      detail: 'Interview-loop intel gathered from their hiring process',
    },
    {
      company: 'AICrowd',
      status: 'talks',
      detail: 'In talks — exploring building their own evaluation product',
    },
    { company: 'Revolut', status: 'pending', detail: 'Conversation pending' },
    { company: 'Google', status: 'pending', detail: 'Conversation pending' },
  ],
} as const;

export type MarketIntelStatus = (typeof MARKET_INTEL.entries)[number]['status'];

export const COMPETITIVE_ONE_LINERS = {
  leetcode: 'Grades final answer only — no thinking-process trail; signal dead under AI',
  hackerrank: 'Async pass/fail on output — no prompt trail or mandatory walkthrough',
  getcracked: 'Strong quant prep intel — no live process grading or employer-side eval',
  aicrowd: 'ML competitions — not stage-aware hiring simulation',
  chaminext:
    'Thinking process graded on both sides — practice builds the trail; Interview Studio ranks on it',
} as const;
