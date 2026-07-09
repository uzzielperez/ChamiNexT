/** Primary nav — job seeker journey (Duolingo-style daily first). */
export const SEEKER_NAV = [
  { name: 'Daily', href: '/daily' },
  { name: 'Practice', href: '/practice' },
  { name: 'Jobs', href: '/jobs' },
  { name: 'Pricing', href: '/pricing' },
] as const;

/** Secondary links — footer & overflow, not top nav. */
export const SEEKER_MORE = [
  { name: 'Skill trees', href: '/skills' },
  { name: 'Interview loop', href: '/loop' },
  { name: '5-min drill', href: '/drill' },
  { name: 'Interview intel', href: '/intel' },
  { name: 'Frontier tests', href: '/frontier' },
  { name: 'Referrals', href: '/referrals' },
  { name: 'Learn', href: '/learn' },
  { name: 'Marketplace', href: '/marketplace' },
] as const;

/** Employer journey — minimal top nav. */
export const EMPLOYER_NAV = [
  { name: 'Interview Studio', href: '/employers' },
  { name: 'Pricing', href: '/pricing?for=companies' },
] as const;

export function isEmployerPath(pathname: string): boolean {
  return pathname === '/employers' || pathname.startsWith('/employers/');
}
