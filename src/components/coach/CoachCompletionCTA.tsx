import React from 'react';
import { Link } from 'react-router-dom';
import PremiumButton from '../ui/PremiumButton';
import { Briefcase, GitBranch, MessageSquare } from 'lucide-react';

const CoachCompletionCTA: React.FC = () => (
  <div className="card p-6 border-accent-blue/30 mt-6">
    <h3 className="font-bold text-text-primary mb-2">You&apos;re set up</h3>
    <p className="text-sm text-text-secondary mb-4">
      Coach mapped your path. Start with matched jobs or your fundamentals belt.
    </p>
    <div className="flex flex-col sm:flex-row gap-3">
      <Link to="/jobs?tab=for-you">
        <PremiumButton variant="primary" size="md" fullWidth icon={<Briefcase className="w-4 h-4" />}>
          See your jobs
        </PremiumButton>
      </Link>
      <Link to="/skills">
        <PremiumButton variant="secondary" size="md" fullWidth icon={<GitBranch className="w-4 h-4" />}>
          Start skill path
        </PremiumButton>
      </Link>
      <Link to="/practice">
        <PremiumButton variant="ghost" size="md" fullWidth icon={<MessageSquare className="w-4 h-4" />}>
          Run mock interview
        </PremiumButton>
      </Link>
    </div>
  </div>
);

export default CoachCompletionCTA;
