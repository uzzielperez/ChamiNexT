import type { PracticeTrack } from '../types/interview';
import jobsData from '../../content/jobs/jobs.json';

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

export const jobsBoard = jobsData as JobsData;

export const JOB_SOURCE_LABELS: Record<string, string> = {
  greenhouse: 'Company board',
  lever: 'Company board',
  remotive: 'Remotive',
  remoteok: 'RemoteOK',
  'hn-whoishiring': 'HN Who is hiring',
  linkedin: 'LinkedIn',
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
      (!q || `${j.title} ${j.company} ${j.location}`.toLowerCase().includes(q))
  );
}

export function getJobsStats() {
  const jobs = jobsBoard.jobs;
  return {
    total: jobs.length,
    mission: jobs.filter((j) => j.mission).length,
    remote: jobs.filter((j) => j.remote).length,
    companies: new Set(jobs.map((j) => j.company)).size,
    generatedAt: jobsBoard.generatedAt,
  };
}
