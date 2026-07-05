import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ExternalLink, Leaf, MapPin, Search, Zap } from 'lucide-react';
import PremiumButton from '../components/ui/PremiumButton';
import { getJobs, getJobsStats, JOB_SOURCE_LABELS, type JobPosting } from '../data/loadJobs';
import type { PracticeTrack } from '../types/interview';

const TRACKS: { id: PracticeTrack | 'all'; label: string }[] = [
  { id: 'all', label: 'All tracks' },
  { id: 'software', label: 'Software' },
  { id: 'ai-engineer', label: 'AI Engineer' },
  { id: 'quant', label: 'Quant' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'market-engineering', label: 'Market Engineering' },
];

const TRACK_LABELS: Record<string, string> = {
  software: 'Software',
  'ai-engineer': 'AI Engineer',
  quant: 'Quant',
  cybersecurity: 'Cybersecurity',
  'market-engineering': 'Market Eng',
};

const PAGE_SIZE = 40;

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const JobCard: React.FC<{ job: JobPosting }> = ({ job }) => (
  <div className="p-4 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-accent-blue/40 transition-colors">
    <div className="flex items-start justify-between gap-3 mb-1">
      <div className="min-w-0">
        <h3 className="font-semibold text-text-primary text-sm leading-snug">{job.title}</h3>
        <p className="text-sm text-text-secondary">{job.company}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {job.mission && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-400/15 text-emerald-400">
            <Leaf className="w-3 h-3" />
            Mission
          </span>
        )}
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-accent-blue/10 text-accent-bright">
          {TRACK_LABELS[job.track]}
        </span>
      </div>
    </div>

    <p className="flex items-center gap-3 text-xs text-text-secondary mb-2">
      <span className="flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        {job.location}
        {job.remote && ' · Remote'}
      </span>
      <span>{timeAgo(job.postedAt)}</span>
      <span>{JOB_SOURCE_LABELS[job.source] ?? job.source}</span>
    </p>

    {job.description && (
      <p className="text-xs text-text-secondary mb-3 line-clamp-2">{job.description}</p>
    )}

    <div className="flex items-center gap-2">
      <a href={job.url} target="_blank" rel="noopener noreferrer">
        <PremiumButton variant="secondary" size="sm">
          View & apply
          <ExternalLink className="w-3 h-3 ml-1.5" />
        </PremiumButton>
      </a>
      <Link to={`/drill?track=${job.track}`}>
        <PremiumButton variant="ghost" size="sm">
          <Zap className="w-3 h-3 mr-1.5" />
          Prep for this role
        </PremiumButton>
      </Link>
    </div>
  </div>
);

const JobsPage: React.FC = () => {
  const [track, setTrack] = useState<PracticeTrack | 'all'>('all');
  const [missionOnly, setMissionOnly] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const stats = getJobsStats();

  const jobs = useMemo(
    () => getJobs({ track, missionOnly, remoteOnly, query }),
    [track, missionOnly, remoteOnly, query]
  );

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
          {stats.total} live engineering roles from company boards, HN, and remote job APIs —
          refreshed on a loop, every one mapped to a practice track.{' '}
          <span className="text-emerald-400 font-medium">{stats.mission} at mission-driven orgs</span>{' '}
          in drug discovery, climate, and frontier science.
        </p>
        <p className="text-xs text-text-secondary mt-3">
          {stats.companies} companies · {stats.remote} remote-friendly · updated{' '}
          {new Date(stats.generatedAt).toLocaleDateString()}
        </p>
      </div>

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
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
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
              placeholder="Search title, company, location…"
              className="pl-9 pr-3 py-2 rounded-lg text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] text-text-primary focus:outline-none focus:border-accent-blue/50 w-64"
            />
          </div>
        </div>
      </div>

      <Link
        to="/loop"
        className="flex items-center gap-3 p-4 mb-6 rounded-[var(--radius-card)] border border-accent-blue/30 bg-accent-blue/5 hover:bg-accent-blue/10 transition-colors"
      >
        <Zap className="w-5 h-5 text-accent-blue shrink-0" />
        <p className="text-sm text-text-secondary">
          <span className="font-semibold text-text-primary">Applying to one of these?</span> Run a
          full interview loop first — recruiter, technical, behavioral — and get a readiness score
          before the real thing.
        </p>
      </Link>

      {jobs.length === 0 ? (
        <p className="text-center text-sm text-text-secondary py-12">
          No roles match those filters. Try widening the track or clearing the search.
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {jobs.slice(0, visible).map((job) => (
              <JobCard key={job.id} job={job} />
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
    </div>
  );
};

export default JobsPage;
