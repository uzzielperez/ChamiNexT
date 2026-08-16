import type { EmployerAssessment, StudioSubmission } from '../types/studioSubmission';

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function unique(items: string[]): string[] {
  return [...new Set(items)];
}

export function buildEmployerAssessment(submission: StudioSubmission): EmployerAssessment {
  const { overallScores, gradedPrompts, promptTrail, testPassed, loopQuizScore } = submission;
  const filesChanged = Object.keys(submission.files).filter(
    (k) => submission.files[k] !== submission.starterFiles[k]
  ).length;

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const probeInInterview: string[] = [];

  const decompAvg = avg(gradedPrompts.map((g) => g.scores.decomposition));
  const verifyAvg = avg(gradedPrompts.map((g) => g.scores.verification));
  const iterateAvg = avg(gradedPrompts.map((g) => g.scores.iteration));
  const disclosureAvg = avg(gradedPrompts.map((g) => g.scores.aiDisclosure));
  const promptAvg = overallScores.promptTrail;
  const weakPromptCount = gradedPrompts.filter((g) => g.overall < 55).length;
  const strongPromptCount = gradedPrompts.filter((g) => g.overall >= 78).length;
  const allFlags = gradedPrompts.flatMap((g) => g.flags);

  if (testPassed) {
    strengths.push('Shipped a working solution — sandbox tests passed on the ticket.');
  } else if (filesChanged > 0) {
    weaknesses.push(
      'Tests did not pass — the submission shows effort but the ticket is not complete or correct.'
    );
  } else {
    weaknesses.push('Little or no code change detected — shipping signal is very weak.');
  }

  if (promptTrail.length >= 4) {
    strengths.push(
      `${promptTrail.length} agent prompts captured — enough trail to judge how they work with AI.`
    );
  } else if (promptTrail.length === 0) {
    weaknesses.push(
      'No agent prompts recorded — you cannot assess how they collaborate with AI on real work.'
    );
  } else if (promptTrail.length < 3) {
    weaknesses.push('Thin prompt trail — only a few agent interactions to judge process.');
  }

  if (strongPromptCount >= 2) {
    strengths.push(
      'Multiple strong prompts — constraints, tradeoffs, or verification show up in the trail.'
    );
  }

  if (weakPromptCount >= 2 || allFlags.some((f) => f.includes('solution'))) {
    weaknesses.push(
      'Some prompts lean output-seeking (“just give me the code”) rather than reasoning-first.'
    );
  }

  if (decompAvg >= 70) {
    strengths.push('Decomposition is solid — prompts frame scope and constraints before coding.');
  } else if (decompAvg > 0 && decompAvg < 55) {
    weaknesses.push('Weak decomposition — prompts are vague or skip problem framing.');
  }

  if (verifyAvg >= 65) {
    strengths.push('Good verification instinct — tests, edge cases, or validation appear in prompts.');
  } else if (verifyAvg > 0 && verifyAvg < 50) {
    weaknesses.push('Low verification signal — few prompts about tests, edge cases, or how to validate.');
    probeInInterview.push(
      'Walk through the edge cases you would test for this ticket and how you would know the fix is correct.'
    );
  }

  if (iterateAvg >= 60) {
    strengths.push('Shows iteration — refined approach or asked for review before going further.');
  }

  if (disclosureAvg >= 65) {
    strengths.push('Disclosed or discussed AI use — aligns with transparent collaboration norms.');
  } else if (promptTrail.length > 0 && disclosureAvg < 50) {
    weaknesses.push('Little AI disclosure in prompts — unclear how they verified model-generated code.');
    probeInInterview.push(
      'Where did you use AI on this ticket, what did you accept vs rewrite, and how did you verify it?'
    );
  }

  if (loopQuizScore != null) {
    if (loopQuizScore >= 85) {
      strengths.push(`Technical foundations quiz: ${loopQuizScore}% — async gate cleared confidently.`);
    } else if (loopQuizScore >= 65) {
      strengths.push(`Technical foundations quiz: ${loopQuizScore}% — acceptable but not standout.`);
    } else {
      weaknesses.push(
        `Technical foundations quiz: ${loopQuizScore}% — gaps in baseline knowledge for this loop.`
      );
      probeInInterview.push(
        'Revisit the quiz topics live — where were you unsure, and how would you close that gap on the job?'
      );
    }
  }

  if (testPassed === false && filesChanged > 0) {
    probeInInterview.push(
      'Open their submitted code live — what is the first bug you would fix, and how would you prove the fix?'
    );
  }

  if (probeInInterview.length < 2) {
    probeInInterview.push(
      'Defend the design tradeoff you chose (e.g. token bucket vs sliding window) under pushback from a senior engineer.'
    );
  }
  if (probeInInterview.length < 3) {
    probeInInterview.push(
      'Describe what you would ship in the next hour if this ticket were due today — scope and cut lines.'
    );
  }

  let recommendation: EmployerAssessment['recommendation'] = 'mixed';
  let confidence: EmployerAssessment['confidence'] = 'medium';

  const sparse =
    promptTrail.length === 0 && filesChanged === 0 && testPassed !== true;

  if (sparse) {
    recommendation = 'insufficient';
    confidence = 'low';
  } else if (
    overallScores.overall >= 80 &&
    testPassed &&
    promptAvg >= 68 &&
    weakPromptCount <= 1
  ) {
    recommendation = 'strong_yes';
    confidence = promptTrail.length >= 3 ? 'high' : 'medium';
  } else if (
    overallScores.overall >= 72 &&
    (testPassed || filesChanged >= 2) &&
    promptAvg >= 55
  ) {
    recommendation = 'proceed';
    confidence = promptTrail.length >= 2 ? 'medium' : 'low';
  } else if (overallScores.overall < 52 || (testPassed === false && filesChanged === 0)) {
    recommendation = 'no';
    confidence = 'medium';
  } else {
    recommendation = 'mixed';
    confidence = promptTrail.length >= 2 ? 'medium' : 'low';
  }

  if (loopQuizScore != null && loopQuizScore < 60 && recommendation === 'strong_yes') {
    recommendation = 'proceed';
    weaknesses.push('Strong work ticket, but quiz score tempers confidence on fundamentals.');
  }

  const headlineByRec: Record<EmployerAssessment['recommendation'], string> = {
    strong_yes: 'Strong hire signal — advance to final round or offer panel.',
    proceed: 'Good signal — schedule a live defense before final decision.',
    mixed: 'Borderline — invest in one more live round; do not auto-reject or auto-advance.',
    no: 'Weak signal on this submission — likely pass unless live interview overturns it.',
    insufficient: 'Not enough data — request resubmit or a short live screen.',
  };

  const summaryParagraph = buildSummaryParagraph(
    submission,
    recommendation,
    strengths,
    weaknesses,
    filesChanged
  );

  return {
    recommendation,
    headline: headlineByRec[recommendation],
    summaryParagraph,
    strengths: unique(strengths).slice(0, 5),
    weaknesses: unique(weaknesses).slice(0, 5),
    probeInInterview: unique(probeInInterview).slice(0, 4),
    confidence,
  };
}

function buildSummaryParagraph(
  submission: StudioSubmission,
  recommendation: EmployerAssessment['recommendation'],
  strengths: string[],
  weaknesses: string[],
  filesChanged: number
): string {
  const { overallScores, promptTrail, testPassed, candidateName } = submission;
  const shipNote = testPassed
    ? 'they shipped passing code'
    : filesChanged > 0
      ? 'they submitted code changes but tests did not pass'
      : 'shipping evidence is minimal';

  const promptNote =
    promptTrail.length === 0
      ? 'with no agent prompt trail'
      : `with ${promptTrail.length} logged prompts (avg quality ${overallScores.promptTrail}/100)`;

  const balance =
    strengths.length && weaknesses.length
      ? 'Strengths and gaps are both visible — use the live round to resolve ambiguity.'
      : strengths.length
        ? 'Upside is clearer than downside on this package.'
        : 'Concerns dominate on this package.';

  const action =
    recommendation === 'strong_yes'
      ? 'Our read: prioritize this candidate in your pipeline.'
      : recommendation === 'proceed'
        ? 'Our read: worth a focused live session on defense and gaps.'
        : recommendation === 'mixed'
          ? 'Our read: neither auto-advance nor auto-reject — one more structured signal needed.'
          : recommendation === 'no'
            ? 'Our read: pass unless something exceptional shows up live.'
            : 'Our read: do not score this submission as representative yet.';

  return `${candidateName} ${shipNote}, ${promptNote}. Overall composite ${overallScores.overall}/100 (thinking ${overallScores.thinking}, shipping ${overallScores.shipping}). ${balance} ${action}`;
}

export const RECOMMENDATION_LABELS: Record<
  EmployerAssessment['recommendation'],
  { badge: string; tone: 'emerald' | 'blue' | 'amber' | 'red' | 'slate' }
> = {
  strong_yes: { badge: 'Strong advance', tone: 'emerald' },
  proceed: { badge: 'Proceed', tone: 'blue' },
  mixed: { badge: 'Borderline', tone: 'amber' },
  no: { badge: 'Do not advance', tone: 'red' },
  insufficient: { badge: 'Insufficient data', tone: 'slate' },
};
