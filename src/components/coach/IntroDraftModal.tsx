import React, { useState } from 'react';
import { Copy, ExternalLink, Mail } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import type { IntroAgentResponse } from '../types/coach';
import type { JobPosting } from '../data/loadJobs';
import { saveIntroDraftLocal } from '../../utils/coachStorage';

interface IntroDraftModalProps {
  job: JobPosting;
  drafts: IntroAgentResponse;
  onClose: () => void;
}

const IntroDraftModal: React.FC<IntroDraftModalProps> = ({ job, drafts, onClose }) => {
  const [tab, setTab] = useState<'email' | 'linkedin'>('email');
  const [copied, setCopied] = useState(false);

  const copyText =
    tab === 'email'
      ? `Subject: ${drafts.email.subject}\n\n${drafts.email.body}`
      : `${drafts.linkedin.connectionNote}\n\n---\n\n${drafts.linkedin.followUp}`;

  const copy = async () => {
    await navigator.clipboard.writeText(copyText);
    saveIntroDraftLocal({
      jobId: job.id,
      channel: tab,
      subject: tab === 'email' ? drafts.email.subject : undefined,
      body: tab === 'email' ? drafts.email.body : drafts.linkedin.connectionNote,
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailto = `mailto:?subject=${encodeURIComponent(drafts.email.subject)}&body=${encodeURIComponent(drafts.email.body)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60">
      <div className="card w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-text-primary">Warm intro draft</h3>
            <p className="text-sm text-text-secondary">
              {job.title} · {job.company}
            </p>
          </div>
          <button type="button" className="text-text-secondary text-sm" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          {(['email', 'linkedin'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-sm capitalize ${
                tab === t ? 'bg-accent-blue/20 text-accent-blue' : 'text-text-secondary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'email' ? (
          <div className="space-y-3 text-sm">
            <p className="font-medium text-text-primary">Subject: {drafts.email.subject}</p>
            <pre className="whitespace-pre-wrap text-text-secondary font-sans">{drafts.email.body}</pre>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-text-secondary mb-1">Connection note (≤300 chars)</p>
              <pre className="whitespace-pre-wrap text-text-secondary font-sans">
                {drafts.linkedin.connectionNote}
              </pre>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">Follow-up</p>
              <pre className="whitespace-pre-wrap text-text-secondary font-sans">
                {drafts.linkedin.followUp}
              </pre>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-6">
          <PremiumButton variant="primary" size="sm" onClick={copy}>
            <Copy className="w-4 h-4 mr-1" />
            {copied ? 'Copied' : 'Copy'}
          </PremiumButton>
          {tab === 'email' && (
            <a href={mailto}>
              <PremiumButton variant="secondary" size="sm">
                <Mail className="w-4 h-4 mr-1" />
                Open mail
              </PremiumButton>
            </a>
          )}
          {tab === 'linkedin' && (
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
              <PremiumButton variant="secondary" size="sm">
                <ExternalLink className="w-4 h-4 mr-1" />
                Open LinkedIn
              </PremiumButton>
            </a>
          )}
        </div>
        <p className="text-xs text-text-secondary mt-4">You send manually — Coach drafts, you edit and ship.</p>
      </div>
    </div>
  );
};

export default IntroDraftModal;
