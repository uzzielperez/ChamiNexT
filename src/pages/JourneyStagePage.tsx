import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CoverCard from '../components/spotify/CoverCard';
import PremiumButton from '../components/ui/PremiumButton';
import { getJourneyStage } from '../data/loadHiringJourney';

const JourneyStagePage: React.FC = () => {
  const { stageId } = useParams<{ stageId: string }>();
  const navigate = useNavigate();
  const stage = stageId ? getJourneyStage(stageId) : undefined;

  if (!stage) {
    return (
      <div className="container max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-text-secondary mb-4">Stage not found.</p>
        <Link to="/journey" className="text-accent-blue hover:underline">
          Back to hiring adventure
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 md:pb-12">
      <div className="relative px-4 pt-8 pb-10 md:px-8 overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: stage.cover.gradient }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-primary)]" aria-hidden />
        <div className="container max-w-3xl mx-auto relative">
          <button
            type="button"
            onClick={() => navigate('/journey')}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> All stages
          </button>
          <p className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">
            Step {stage.order} · {stage.duration}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">{stage.title}</h1>
          <p className="text-lg text-accent-bright font-medium mb-4">{stage.tagline}</p>
          <p className="text-text-secondary max-w-xl">{stage.description}</p>
        </div>
      </div>

      <div className="container max-w-3xl mx-auto px-4 md:px-8 -mt-6">
        <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-[var(--shadow-card)] mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-accent-blue mb-2">What you&apos;re solving</h2>
          <p className="text-text-primary text-lg leading-relaxed">{stage.problemYouSolve}</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {stage.actions.map((action) => (
            <PremiumButton
              key={action.label}
              variant={action.primary ? 'primary' : 'secondary'}
              size="md"
              onClick={() => navigate(action.href, action.state ? { state: action.state } : undefined)}
            >
              {action.label}
            </PremiumButton>
          ))}
        </div>

        {stage.id === 'soft-skills' && (
          <Link to="/coaching/ethics-soft-skills" className="block mb-8">
            <CoverCard
              size="lg"
              title="Ethics & Soft Skills Interview"
              tagline="7 episodes · sample Q&A · mock prompts"
              gradient="linear-gradient(135deg, #581c87 0%, #db2777 100%)"
              icon="shield-heart"
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default JourneyStagePage;
