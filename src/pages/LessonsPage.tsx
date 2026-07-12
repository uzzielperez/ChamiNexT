import React, { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Headphones } from 'lucide-react';
import CoverCard from '../components/spotify/CoverCard';
import HorizontalShelf from '../components/spotify/HorizontalShelf';
import LessonAudioPlayer from '../components/skills/LessonAudioPlayer';
import { getAllLessons, hasLessonAudio, type LeafLesson } from '../data/loadLessons';
import { getLessonCover } from '../data/lessonCovers';
import { getCoachingPlaylists } from '../data/loadCoachingPlaylists';
import { loadCoachProfile } from '../utils/coachStorage';
import {
  fundamentalsPath,
  getCurrentDailyLeaf,
  leafUnlockState,
  loadCompletedLeafIds,
} from '../utils/skillProgress';
import type { PracticeTrack } from '../types/interview';

const TRACK_LABELS: Record<string, string> = {
  software: 'Software Engineering',
  'ai-engineer': 'AI / ML Engineering',
  quant: 'Quant',
  cybersecurity: 'Cybersecurity',
  'market-engineering': 'Market Engineering',
  'ai-for-science': 'AI for Science',
};

function dedupeLessons(lessons: LeafLesson[]): LeafLesson[] {
  const seen = new Set<string>();
  return lessons.filter((l) => {
    if (seen.has(l.leafId)) return false;
    seen.add(l.leafId);
    return true;
  });
}

const LessonsPage: React.FC = () => {
  const profile = loadCoachProfile();
  const voice = profile?.voicePreference ?? 'male';
  const dailyLeaf = getCurrentDailyLeaf();
  const completed = loadCompletedLeafIds();
  const softSkills = getCoachingPlaylists()[0];

  const { fundamentals, byTrack, audioCount, allDeduped } = useMemo(() => {
    const all = dedupeLessons(getAllLessons());
    const fundIds = new Set(fundamentalsPath.map((f) => f.leafId));
    const fundamentals = fundamentalsPath
      .map((f) => all.find((l) => l.leafId === f.leafId))
      .filter(Boolean) as LeafLesson[];

    const byTrack = new Map<string, LeafLesson[]>();
    for (const lesson of all) {
      if (fundIds.has(lesson.leafId)) continue;
      const list = byTrack.get(lesson.track) ?? [];
      list.push(lesson);
      byTrack.set(lesson.track, list);
    }

    const audioCount = all.filter((l) => hasLessonAudio(l.leafId, voice)).length;
    return { fundamentals, byTrack, audioCount, allDeduped: all };
  }, [voice]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      document.getElementById(`lesson-${hash}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="min-h-screen pb-28 md:pb-12">
      <div
        className="px-4 pt-10 pb-8 md:px-8"
        style={{ background: 'linear-gradient(180deg, rgba(59,130,246,0.12) 0%, transparent 100%)' }}
      >
        <div className="container max-w-5xl mx-auto text-center md:text-left">
          <p className="text-sm text-accent-blue font-medium uppercase tracking-wide flex items-center justify-center md:justify-start gap-2">
            <Headphones className="w-4 h-4" /> Coach audio
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mt-2 mb-2">Lesson library</h1>
          <p className="text-text-secondary text-sm max-w-lg mx-auto md:mx-0">
            {audioCount} voice lessons · each card shows what interview problem it solves
          </p>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 md:px-8">
        {softSkills && (
          <HorizontalShelf title="Ethics & soft skills" subtitle="Deep Q&A coaching — not just voice drills">
            <Link to="/coaching/ethics-soft-skills" className="shrink-0">
              <CoverCard
                size="md"
                title={softSkills.title}
                tagline={softSkills.tagline}
                gradient={softSkills.cover.gradient}
                icon={softSkills.cover.icon}
                badge={`${softSkills.episodes.length} episodes`}
              />
            </Link>
            {softSkills.episodes.slice(0, 5).map((ep) => (
              <CoverCard
                key={ep.id}
                title={ep.title}
                tagline={ep.problemYouSolve}
                duration={ep.duration}
                gradient={ep.cover.gradient}
                icon={ep.cover.icon}
                href={`/coaching/ethics-soft-skills#${ep.id}`}
              />
            ))}
          </HorizontalShelf>
        )}

        <section className="mb-12">
          <h2 className="text-xl font-bold text-text-primary mb-1">White belt · Fundamentals</h2>
          <p className="text-sm text-text-secondary mb-4">Complete in order on your hiring journey</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {fundamentals.map((lesson) => {
              const cover = getLessonCover(lesson.leafId, lesson.track);
              return (
                <CoverCard
                  key={lesson.leafId}
                  size="sm"
                  title={lesson.title}
                  tagline={cover.problemYouSolve}
                  gradient={cover.gradient}
                  icon={cover.icon}
                  badge={dailyLeaf?.leafId === lesson.leafId ? 'Current' : completed.has(lesson.leafId) ? 'Done' : undefined}
                  onClick={() =>
                    document.getElementById(`lesson-${lesson.leafId}`)?.scrollIntoView({ behavior: 'smooth' })
                  }
                />
              );
            })}
          </div>
        </section>

        <HorizontalShelf title="All tracks" subtitle="Swipe for role-specific skills">
          {[...byTrack.entries()].flatMap(([, lessons]) => lessons).map((lesson) => {
            const cover = getLessonCover(lesson.leafId, lesson.track);
            return (
              <CoverCard
                key={lesson.leafId}
                title={lesson.title}
                tagline={cover.problemYouSolve}
                gradient={cover.gradient}
                icon={cover.icon}
                onClick={() =>
                  document.getElementById(`lesson-${lesson.leafId}`)?.scrollIntoView({ behavior: 'smooth' })
                }
              />
            );
          })}
        </HorizontalShelf>

        <section className="mt-12 mb-8">
          <h2 className="text-xl font-bold text-text-primary mb-2">Play & practice</h2>
          <p className="text-sm text-text-secondary mb-6">Tap a card above, or expand any lesson below.</p>
          <div className="space-y-4">
            {allDeduped.map((lesson) => {
              const cover = getLessonCover(lesson.leafId, lesson.track);
              const unlock = leafUnlockState(lesson.leafId, lesson.track as PracticeTrack);
              return (
                <div
                  key={lesson.leafId}
                  id={`lesson-${lesson.leafId}`}
                  className="scroll-mt-24 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]"
                >
                  <div className="flex gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-lg shrink-0 shadow-md"
                      style={{ background: cover.gradient }}
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-text-primary">{lesson.title}</h3>
                      <p className="text-sm text-accent-bright font-medium">{cover.problemYouSolve}</p>
                      {unlock === 'locked' && (
                        <p className="text-xs text-text-secondary mt-1">Practice locked · listen anytime</p>
                      )}
                    </div>
                  </div>
                  <LessonAudioPlayer leafId={lesson.leafId} title={lesson.title} voicePreference={voice} />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LessonsPage;
