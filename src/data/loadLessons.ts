import lessonManifest from '../../content/lessons/manifest.json';
import audioManifest from '../../content/lessons/audio-manifest.json';
import coachVoices from '../../content/voice/coach-voices.json';
import type { VoicePreference } from '../types/coach';

export interface LeafLesson {
  leafId: string;
  track: string;
  title: string;
  script: string;
  scriptVersion: number;
}

export interface LeafAudio {
  audioUrlMale?: string;
  audioUrlFemale?: string;
  title?: string;
  scriptVersion?: number;
  generatedAt?: string;
}

const lessons = (lessonManifest as { lessons: LeafLesson[] }).lessons;
const audio = audioManifest as {
  previews: Record<VoicePreference, { url: string; script?: string } | undefined>;
  leaves: Record<string, LeafAudio>;
};

export const coachVoiceConfig = coachVoices;

export function getAllLessons(): LeafLesson[] {
  return lessons;
}

export function getLessonByLeafId(leafId: string): LeafLesson | undefined {
  return lessons.find((l) => l.leafId === leafId);
}

export function getLeafAudio(leafId: string): LeafAudio | undefined {
  return audio.leaves[leafId];
}

export function getLessonAudioUrl(leafId: string, voice: VoicePreference): string | undefined {
  const leaf = audio.leaves[leafId];
  if (!leaf) return undefined;
  return voice === 'male' ? leaf.audioUrlMale : leaf.audioUrlFemale;
}

export function getVoicePreviewUrl(voice: VoicePreference): string | undefined {
  return audio.previews[voice]?.url;
}

export function hasLessonAudio(leafId: string, voice: VoicePreference): boolean {
  return Boolean(getLessonAudioUrl(leafId, voice));
}

export function getLessonTranscript(leafId: string): string {
  return getLessonByLeafId(leafId)?.script ?? '';
}
