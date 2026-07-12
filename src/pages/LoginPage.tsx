import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumButton from '../components/ui/PremiumButton';
import { requestMagicLink } from '../utils/authSession';
import { ArrowLeft, Mail } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [demoUrl, setDemoUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

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

  return (
    <div className="app-shell container mx-auto px-4 py-16 max-w-md">
      <button type="button" className="text-sm text-text-secondary mb-8 flex items-center gap-1" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Sign in</h1>
      <p className="text-text-secondary text-sm mb-8">
        Magic link — no password. Coach saves your profile and job matches across devices.
      </p>

      {!sent ? (
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
          <PremiumButton type="submit" variant="primary" fullWidth loading={loading} icon={<Mail className="w-4 h-4" />}>
            Send magic link
          </PremiumButton>
        </form>
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
