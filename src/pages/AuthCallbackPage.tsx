import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyMagicToken } from '../utils/authSession';
import { fetchCoachProfileFromServer, loadCoachProfile } from '../utils/coachStorage';

const AuthCallbackPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      setError('Missing token');
      return;
    }
    verifyMagicToken(token)
      .then(async () => {
        await fetchCoachProfileFromServer();
        const profile = loadCoachProfile();
        if (profile?.onboardingComplete) navigate('/journey', { replace: true });
        else navigate('/coach', { replace: true });
      })
      .catch(() => setError('Link expired or invalid. Request a new one from /login.'));
  }, [params, navigate]);

  return (
    <div className="container mx-auto px-4 py-24 text-center">
      {error ? (
        <>
          <p className="text-red-400 mb-4">{error}</p>
          <a href="/login" className="text-accent-blue hover:underline">
            Back to sign in
          </a>
        </>
      ) : (
        <p className="text-text-secondary animate-pulse">Signing you in…</p>
      )}
    </div>
  );
};

export default AuthCallbackPage;
