const DISMISS_KEY = 'chaminext_trial_banner_dismissed';

export function isTrialBannerDismissed(): boolean {
  return localStorage.getItem(DISMISS_KEY) === '1';
}

export function dismissTrialBanner(): void {
  localStorage.setItem(DISMISS_KEY, '1');
}
