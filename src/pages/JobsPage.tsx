import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Briefcase, ExternalLink, Leaf, MapPin, Search, Sparkles, Zap } from 'lucide-react';
import PremiumButton from '../components/ui/PremiumButton';
import IntroDraftModal from '../components/coach/IntroDraftModal';
import { getJobs, getJobsStats, getQuantCuratedCount, JOB_SOURCE_LABELS, type JobPosting } from '../data/loadJobs';
import type { PracticeTrack } from '../types/interview';
import type { JobMatchResult } from '../types/coach';
import { loadCoachProfile, canCreateIntroDraft, toggleSavedJob, loadSavedJobIds } from '../utils/coachStorage';
import { hasCoachProfile, rankJobsForProfile } from '../utils/jobMatching';
import { generateIntroDrafts } from '../utils/introAgent';
import { buildTalentProfile, loadProfileName } from '../utils/interviewStorage';
import { getOrCreateProfileSlug } from '../utils/profileSlug';
import { loadSubscription } from '../utils/subscriptionStorage';

const TRACKS: { id: PracticeTrack | 'all'; label: string }[] = [
  { id: 'all', label: 'All tracks' },
  { id: 'software', label: 'Software' },
  { id: 'ai-engineer', label: 'AI Engineer' },
  { id: 'quant', label: 'Quant' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'market-engineering', label: 'Market Engineering' },
  { id: 'ai-for-science', label: 'AI for Science' },
];

const TRACK_LABELS: Record<string, string> = {
  software: 'Software',
  'ai-engineer': 'AI Engineer',
  quant: 'Quant',
  cybersecurity: 'Cybersecurity',
  'market-engineering': 'Market Eng',
  'ai-for-science': 'AI for Science',
};

const PAGE_SIZE = 40;

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

type JobCardProps = {
  job: JobPosting & Partial<JobMatchResult>;
  matchMode?: boolean;
  saved: boolean;
  onSave: () => void;
  onDraftIntro: () => void;
};

const JobCard: React.FC<JobCardProps> = ({ job, matchMode, saved, onSave, onDraftIntro }) => (
  <div className="p-4 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-accent-blue/40 transition-colors">
    <div className="flex items-start justify-between gap-3 mb-1">
      <div className="min-w-0">
        <h3 className="font-semibold text-text-primary text-sm leading-snug">{job.title}</h3>
        <p className="text-sm text-text-secondary">{job.company}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        {matchMode && job.score != null && (
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-accent-blue/15 text-accent-bright">
            {job.fitLabel} · {job.score}%
          </span>
        )}
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-accent-blue/10 text-accent-bright">
          {TRACK_LABELS[job.track]}
        </span>
      </div>
    </div>

    {matchMode && job.whyOneLine && (
      <p className="text-xs text-accent-blue/90 mb-2 flex items-center gap-1">
        <Sparkles className="w-3 h-3 shrink-0" />
        Coach: {job.whyOneLine}
      </p>
    )}

    <p className="flex items-center gap-3 text-xs text-text-secondary mb-2">
      <span className="flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        {job.location}
        {job.remote && ' · Remote'}
      </span>
      <span>{timeAgo(job.postedAt)}</span>
      {job.mission && (
        <span className="flex items-center gap-1 text-emerald-400">
          <Leaf className="w-3 h-3" /> Mission
        </span>
      )}
    </p>

    {job.description && (
      <p className="text-xs text-text-secondary mb-3 line-clamp-2">{job.description}</p>
    )}

    <div className="flex flex-wrap items-center gap-2">
      <a href={job.url} target="_blank" rel="noopener noreferrer">
        <PremiumButton variant="secondary" size="sm">
          View & apply
          <ExternalLink className="w-3 h-3 ml-1.5" />
        </PremiumButton>
      </a>
      <Link to={`/drill?track=${job.track}`}>
        <PremiumButton variant="ghost" size="sm">
          <Zap className="w-3 h-3 mr-1.5" />
          Prep
        </PremiumButton>
      </Link>
      {matchMode && (
        <>
          <PremiumButton variant="ghost" size="sm" onClick={onSave}>
            {saved ? 'Saved ✓' : 'Save'}
          </PremiumButton>
          <PremiumButton variant="outline" size="sm" onClick={onDraftIntro}>
            Draft intro
          </PremiumButton>
        </>
      )}
    </div>
  </div>
);

const JobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') === 'for-you' ? 'for-you' : 'all';
  const coachProfile = loadCoachProfile();
  const showForYou = hasCoachProfile(coachProfile);

  const [track, setTrack] = useState<PracticeTrack | 'all'>('all');
  const [missionOnly, setMissionOnly] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [savedIds, setSavedIds] = useState(() => loadSavedJobIds());
  const [introJob, setIntroJob] = useState<(JobPosting & JobMatchResult) | null>(null);
  const [introDrafts, setIntroDrafts] = useState<Awaited<ReturnType<typeof generateIntroDrafts>> | null>(null);
  const [introLoading, setIntroLoading] = useState(false);

  const stats = getJobsStats();
  const paid = loadSubscription().plan !== 'free';

  const allJobs = useMemo(
    () => getJobs({ track, missionOnly, remoteOnly, query }),
    [track, missionOnly, remoteOnly, query]
  );

  const forYouJobs = useMemo(() => {
    if (!coachProfile || !showForYou) return [];
    return rankJobsForProfile(allJobs, coachProfile);
  }, [allJobs, coachProfile, showForYou]);

  const jobs = tab === 'for-you' ? forYouJobs : allJobs;

  const setTab = (t: 'all' | 'for-you') => {
    setSearchParams(t === 'for-you' ? { tab: 'for-you' } : {}, { replace: true });
    setVisible(PAGE_SIZE);
  };

  const draftIntro = async (job: JobPosting & JobMatchResult) => {
    if (!coachProfile || !canCreateIntroDraft(paid)) {
      alert('Free plan: 3 intro drafts per month. Upgrade on /pricing for unlimited.');
      return;
    }
    setIntroLoading(true);
    try {
      const talent = buildTalentProfile(loadProfileName());
      const slug = getOrCreateProfileSlug();
      const drafts = await generateIntroDrafts(job, coachProfile, {
        talentSummary: `Thinking avg ${talent.thinkingScoreAvg}, ${talent.shipTestsCompleted} ships`,
        profileSlug: `${window.location.origin}/profile/${slug}`,
      });
      setIntroJob(job);
      setIntroDrafts(drafts);
    } finally {
      setIntroLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl pb-24 md:pb-12">
      <div className="text-center mb-10">
        <p className="text-sm text-accent-blue font-medium uppercase tracking-wide flex items-center justify-center gap-2">
          <Briefcase className="w-4 h-4" /> Find jobs
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mt-2 mb-4">
          Roles worth getting ready for
        </h1>
        <p className="text-subheadline text-text-secondary max-w-2xl mx-auto">
          {stats.total} live roles — {showForYou ? 'Coach ranked the best fits for you below.' : 'Complete Coach onboarding for personalized matches.'}
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium filter-pill ${tab === 'all' ? 'filter-pill-active' : ''}`}
        >
          All jobs
        </button>
        {showForYou ? (
          <button
            type="button"
            onClick={() => setTab('for-you')}
            className={`px-4 py-2 rounded-lg text-sm font-medium filter-pill ${tab === 'for-you' ? 'filter-pill-active' : ''}`}
          >
            For you
          </button>
        ) : (
          <Link to="/coach" className="px-4 py-2 rounded-lg text-sm font-medium text-accent-blue border border-accent-blue/30">
            Get matches → Coach
          </Link>
        )}
      </div>

      {tab === 'all' && track === 'quant' && (
        <div className="mb-8 p-5 rounded-2xl border border-cyan-500/30 bg-cyan-500/5">
          <h2 className="font-bold text-text-primary mb-1">Quant finance board</h2>
          <p className="text-sm text-text-secondary mb-4">
            {getQuantCuratedCount()} curated roles at SIG, Jane Street, Citadel, Two Sigma, Jump, IMC, Optiver, and
            more — {stats.quant} total quant-tagged listings.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/practice">
              <PremiumButton variant="primary" size="sm">
                Quant practice mocks
              </PremiumButton>
            </Link>
            <Link to="/coaching/quant-hm-prep">
              <PremiumButton variant="secondary" size="sm">
                HM interview prep
              </PremiumButton>
            </Link>
            <Link to="/practice" state={{ view: 'ship-lobby' }}>
              <PremiumButton variant="ghost" size="sm">
                Work tickets
              </PremiumButton>
            </Link>
          </div>
        </div>
      )}

      {tab === 'all' && (
        <div className="mb-6 space-y-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {TRACKS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTrack(t.id);
                  setVisible(PAGE_SIZE);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors filter-pill ${
                  track === t.id ? 'filter-pill-active' : ''
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={missionOnly}
                onChange={(e) => {
                  setMissionOnly(e.target.checked);
                  setVisible(PAGE_SIZE);
                }}
                className="accent-emerald-400"
              />
              Mission-driven only
            </label>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => {
                  setRemoteOnly(e.target.checked);
                  setVisible(PAGE_SIZE);
                }}
                className="accent-[var(--accent-primary)]"
              />
              Remote only
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setVisible(PAGE_SIZE);
                }}
                placeholder="Search title, company…"
                className="pl-9 pr-3 py-2 rounded-lg text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] text-text-primary w-64"
              />
            </div>
          </div>
        </div>
      )}

      {jobs.length === 0 ? (
        <p className="text-center text-sm text-text-secondary py-12">
          {tab === 'for-you' ? 'No strong matches with current filters. Try All jobs or update your Coach profile.' : 'No roles match those filters.'}
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {jobs.slice(0, visible).map((job) => (
              <JobCard
                key={job.id}
                job={job}
                matchMode={tab === 'for-you'}
                saved={savedIds.has(job.id)}
                onSave={() => setSavedIds(toggleSavedJob(job.id))}
                onDraftIntro={() => void draftIntro(job as JobPosting & JobMatchResult)}
              />
            ))}
          </div>
          {visible < jobs.length && (
            <div className="flex justify-center mt-6">
              <PremiumButton variant="ghost" size="md" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Show more ({jobs.length - visible} remaining)
              </PremiumButton>
            </div>
          )}
        </>
      )}

      {introLoading && (
        <p className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 text-sm text-text-secondary bg-[var(--bg-secondary)] px-4 py-2 rounded-lg border">
          Coach is drafting your intro…
        </p>
      )}

      {introJob && introDrafts && (
        <IntroDraftModal job={introJob} drafts={introDrafts} onClose={() => { setIntroJob(null); setIntroDrafts(null); }} />
      )}
    </div>
  );
};

export default JobsPage;
