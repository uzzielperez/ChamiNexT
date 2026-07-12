import pipeline from '../../content/journey/hiring-pipeline.json';

export interface JourneyAction {
  label: string;
  href: string;
  primary?: boolean;
  state?: Record<string, unknown>;
}

export interface JourneyStage {
  id: string;
  order: number;
  title: string;
  tagline: string;
  problemYouSolve: string;
  description: string;
  duration: string;
  cover: { gradient: string; icon: string };
  actions: JourneyAction[];
}

export interface HiringPipeline {
  version: number;
  title: string;
  subtitle: string;
  stages: JourneyStage[];
}

const data = pipeline as HiringPipeline;

export function getHiringPipeline(): HiringPipeline {
  return data;
}

export function getJourneyStage(id: string): JourneyStage | undefined {
  return data.stages.find((s) => s.id === id);
}
