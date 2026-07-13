import softSkillsData from '../../content/coaching/soft-skills-playlists.json';
import quantHmData from '../../content/coaching/quant-hm-playlists.json';
import projectWalkthroughData from '../../content/coaching/project-walkthrough-playlists.json';

export interface CoachingEpisode {
  id: string;
  phase: number;
  title: string;
  problemYouSolve: string;
  duration: string;
  cover: { gradient: string; icon: string };
  sampleQuestions: string[];
  strongAnswerFramework: string;
  strongSignals: string[];
  weakPatterns: string[];
  coachTip: string;
  practiceProblemId: string;
}

export interface CoachingPlaylist {
  id: string;
  title: string;
  tagline: string;
  description: string;
  cover: { gradient: string; icon: string };
  notebookLmSources?: string[];
  episodes: CoachingEpisode[];
}

const data = {
  playlists: [
    ...(softSkillsData as { playlists: CoachingPlaylist[] }).playlists,
    ...(quantHmData as { playlists: CoachingPlaylist[] }).playlists,
    ...(projectWalkthroughData as { playlists: CoachingPlaylist[] }).playlists,
  ],
};

export function getCoachingPlaylists(): CoachingPlaylist[] {
  return data.playlists;
}

export function getCoachingPlaylist(id: string): CoachingPlaylist | undefined {
  return data.playlists.find((p) => p.id === id);
}

export function getCoachingEpisode(playlistId: string, episodeId: string): CoachingEpisode | undefined {
  return getCoachingPlaylist(playlistId)?.episodes.find((e) => e.id === episodeId);
}
