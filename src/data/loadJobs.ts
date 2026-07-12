import type { PracticeTrack } from '../types/interview';
import jobsData from '../../content/jobs/jobs.json';
import quantCurated from '../../content/jobs/quant-finance-curated.json';

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  url: string;
  source: string;
  postedAt: string;
  description: string;
  track: PracticeTrack;
  /** Frontier-science / mission-flagged org (drug discovery, climate, health…). */
  mission: boolean;
}

export interface JobsData {
  version: number;
  generatedAt: string;
  totalJobs: number;
  sources: string[];
  jobs: JobPosting[];
}

const scraped = jobsData as JobsData;
const quantJobs = (quantCurated as { jobs: JobPosting[] }).jobs;

/** Curated quant roles first, then scraped board — dedupe by URL. */
function mergeJobs(): JobPosting[] {
  const seen = new Set<string>();
  const out: JobPosting[] = [];
  for (const j of [...quantJobs, ...scraped.jobs]) {
    if (seen.has(j.url)) continue;
    seen.add(j.url);
    out.push(j);
  }
  return out;
}

const allJobs = mergeJobs();

export const jobsBoard: JobsData = {
  ...scraped,
  totalJobs: allJobs.length,
  jobs: allJobs,
};

export const JOB_SOURCE_LABELS: Record<string, string> = {
  greenhouse: 'Company board',
  lever: 'Company board',
  remotive: 'Remotive',
  remoteok: 'RemoteOK',
  'hn-whoishiring': 'HN Who is hiring',
  linkedin: 'LinkedIn',
  'curated-quant': 'Quant finance · curated',
};

export interface JobFilter {
  track?: PracticeTrack | 'all';
  missionOnly?: boolean;
  remoteOnly?: boolean;
  query?: string;
}

export function getJobs(filter: JobFilter = {}): JobPosting[] {
  const q = filter.query?.trim().toLowerCase();
  return jobsBoard.jobs.filter(
    (j) =>
      (!filter.track || filter.track === 'all' || j.track === filter.track) &&
      (!filter.missionOnly || j.mission) &&
      (!filter.remoteOnly || j.remote) &&
      (!q || `${j.title} ${j.company} ${j.location} ${j.description}`.toLowerCase().includes(q))
  );
}

export function getJobsStats() {
  const jobs = jobsBoard.jobs;
  const quantCount = jobs.filter((j) => j.track === 'quant').length;
  return {
    total: jobs.length,
    quant: quantCount,
    mission: jobs.filter((j) => j.mission).length,
    remote: jobs.filter((j) => j.remote).length,
    companies: new Set(jobs.map((j) => j.company)).size,
    generatedAt: scraped.generatedAt,
  };
}

export function getQuantCuratedCount(): number {
  return quantJobs.length;
}
