import type { FrontierProblemTest, PracticeProblem } from '../types/interview';

/** Turn a frontier deep test into a runnable AI interview problem. */
export function practiceProblemFromFrontierTest(test: FrontierProblemTest): PracticeProblem {
  const ethicsBlock = test.ethicsPrompts.length
    ? `\n\nEthics probes the interviewer may use:\n${test.ethicsPrompts.map((e) => `• ${e}`).join('\n')}`
    : '';
  return {
    id: `frontier-${test.id}`,
    title: test.title,
    domain:
      test.mission === 'ethics'
        ? 'research-ethics'
        : test.mission === 'science'
          ? 'scientific-methods'
          : 'mission-problems',
    track: 'ai-for-science',
    difficulty: 'hard',
    estimatedMinutes: (test.estimatedMinutes <= 20 ? 20 : test.estimatedMinutes <= 30 ? 30 : 45) as PracticeProblem['estimatedMinutes'],
    prompt: `${test.prompt}\n\nContext: questions in this style are reported from interviews at orgs like ${test.orgExamples.join(', ')}.${ethicsBlock}\n\nThink out loud. The interviewer will probe research hygiene, ethics, and whether your solution survives adversarial follow-ups.`,
    hints: [
      'State assumptions and what would falsify your approach.',
      'Name who is harmed if you are wrong — not just model error.',
      'Separate what you would ship now vs what needs more evidence.',
    ],
    starterCode: '# Notes, equations, or pseudo-code welcome',
    runLanguage: null,
    source: `frontier-problems:${test.mission}`,
  };
}
