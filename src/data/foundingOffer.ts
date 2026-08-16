/** Client-side founding cohort offer (mirrors netlify/functions/_shared/plans.js). */

export const FOUNDING = {
  code: 'FOUNDING40',
  percentOff: 40,
  maxRedemptions: 30,
  label: 'Founding 40% off — first 30 payers',
} as const;

export function discountedCents(amountCents: number, percentOff = FOUNDING.percentOff): number {
  return Math.round(amountCents * (1 - percentOff / 100));
}

export function formatEurFromCents(cents: number): string {
  const euros = cents / 100;
  return euros % 1 === 0 ? `€${euros}` : `€${euros.toFixed(2)}`;
}

/** List prices in cents for display. */
export const LIST_PRICES = {
  'interview-season': 14900,
  builder: 4900,
  'biz-small': 25000,
  'biz-growth': 90000,
} as const;

export type FoundingOfferResponse = {
  founding: {
    code: string;
    percentOff: number;
    maxRedemptions: number;
    used: number;
    remaining: number;
    open: boolean;
  };
};
