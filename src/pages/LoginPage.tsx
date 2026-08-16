import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PremiumButton from '../components/ui/PremiumButton';
import { requestMagicLink, startGoogleSignIn } from '../utils/authSession';
import { ArrowLeft, Mail } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [demoUrl, setDemoUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fromGoogle = params.get('error');
    if (fromGoogle) setError(fromGoogle);
  }, [params]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await requestMagicLink(email);
      if (!res.ok) throw new Error('Could not send link');
      setSent(true);
      if (res.verifyUrl) setDemoUrl(res.verifyUrl);
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = () => {
    setError('');
    setGoogleLoading(true);
    startGoogleSignIn();
  };

  return (
    <div className="app-shell container mx-auto px-4 py-16 max-w-md">
      <button
        type="button"
        className="text-sm text-text-secondary mb-8 flex items-center gap-1"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Sign in</h1>
      <p className="text-text-secondary text-sm mb-8">
        Continue with Google or a magic link — no password. Coach saves your profile across devices.
      </p>

      {!sent ? (
        <div className="space-y-4">
          <PremiumButton
            type="button"
            variant="secondary"
            fullWidth
            loading={googleLoading}
            onClick={onGoogle}
            icon={
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            }
          >
            Continue with Google
          </PremiumButton>

          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <div className="h-px flex-1 bg-gray-700" />
            or email
            <div className="h-px flex-1 bg-gray-700" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full px-4 py-3 rounded-lg bg-bg-secondary border border-gray-700 text-text-primary"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <PremiumButton
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              icon={<Mail className="w-4 h-4" />}
            >
              Send magic link
            </PremiumButton>
          </form>
        </div>
      ) : (
        <div className="card p-6">
          <p className="text-text-primary font-medium mb-2">Check your email</p>
          <p className="text-sm text-text-secondary mb-4">
            {demoUrl
              ? 'Demo mode — click below to sign in (no email sent).'
              : 'We sent a sign-in link. It expires in 15 minutes.'}
          </p>
          {demoUrl && (
            <a href={demoUrl} className="text-accent-blue text-sm break-all hover:underline">
              {demoUrl}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginPage;
