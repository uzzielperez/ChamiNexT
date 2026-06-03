import type { PracticeProblem } from '../types/interview';

export const practiceProblems: PracticeProblem[] = [
  {
    id: 'two-sum-variant',
    title: 'Two Sum with Constraints',
    domain: 'arrays',
    difficulty: 'medium',
    prompt:
      'Given an array of integers and a target, return indices of two numbers that sum to target. Then discuss: what if the array is sorted? What if duplicates exist? How would you validate input at scale?',
    hints: [
      'Start with brute force, then hash map.',
      'Clarify whether indices or values must be unique.',
    ],
    starterCode: `function twoSum(nums, target) {
  // Your approach here
}`,
    runLanguage: 'javascript',
  },
  {
    id: 'rate-limiter-design',
    title: 'Design a Rate Limiter',
    domain: 'system-design',
    difficulty: 'medium',
    prompt:
      'Design a rate limiting service for an API gateway. Cover token bucket vs sliding window, single-node vs distributed, and failure modes.',
    hints: ['Define SLAs first.', 'Discuss Redis vs in-memory tradeoffs.'],
    starterCode: `// Outline your design in comments or pseudocode
// Components:
// - API gateway
// - Rate limit service
// - Storage`,
    runLanguage: null,
  },
  {
    id: 'broken-checkout',
    title: 'Debug: Checkout Timeout',
    domain: 'debugging',
    difficulty: 'hard',
    prompt:
      'Users report checkout succeeds but orders are missing intermittently. Logs show 504s from payment service. Walk through how you would debug and mitigate.',
    hints: ['Separate symptom from root cause.', 'Consider idempotency keys.'],
    starterCode: `// Hypothesis log:
// 1.
// 2.`,
    runLanguage: null,
  },
  {
    id: 'lca-tree',
    title: 'Lowest Common Ancestor',
    domain: 'trees',
    difficulty: 'medium',
    prompt:
      'Given a binary tree and two nodes, return their lowest common ancestor. Explain time/space complexity and edge cases.',
    hints: ['Recursive post-order is natural.', 'Handle null nodes early.'],
    starterCode: `function lowestCommonAncestor(root, p, q) {
}`,
    runLanguage: 'javascript',
  },
  {
    id: 'anagram-groups',
    title: 'Group Anagrams',
    domain: 'strings',
    difficulty: 'easy',
    prompt:
      'Group strings that are anagrams. Optimize for large inputs and explain how you would test your solution.',
    hints: ['Sort or count characters as key.', 'Watch Unicode if asked.'],
    starterCode: `function groupAnagrams(strs) {
}`,
    runLanguage: 'javascript',
  },
];

export const getProblemById = (id: string) =>
  practiceProblems.find((p) => p.id === id);
