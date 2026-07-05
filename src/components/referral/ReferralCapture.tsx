import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  captureReferralCode,
  getOrCreateReferralProfile,
} from '../../utils/referralStorage';
import { trackReferralCapture } from '../../utils/referralApi';

const REF_WELCOME_KEY = 'chaminext_ref_welcome';

/**
 * Reads ?ref= on any routed page and applies referee welcome bonus once.
 */
const ReferralCapture: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (!ref) return;

    const captured = captureReferralCode(ref);
    if (captured) {
      trackReferralCapture(ref);
      sessionStorage.setItem(REF_WELCOME_KEY, '1');
      const next = new URLSearchParams(searchParams);
      next.delete('ref');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    getOrCreateReferralProfile();
  }, []);

  return null;
};

export function consumeReferralWelcome(): boolean {
  if (sessionStorage.getItem(REF_WELCOME_KEY) !== '1') return false;
  sessionStorage.removeItem(REF_WELCOME_KEY);
  return true;
}

export default ReferralCapture;
