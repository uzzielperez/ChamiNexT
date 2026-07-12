import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Map, Play, ChevronRight } from 'lucide-react';
import CoverCard from '../components/spotify/CoverCard';
import HorizontalShelf from '../components/spotify/HorizontalShelf';
import PremiumButton from '../components/ui/PremiumButton';
import { getCoachingPlaylists } from '../data/loadCoachingPlaylists';
import { getHiringPipeline } from '../data/loadHiringJourney';
import { getAllLessons, hasLessonAudio } from '../data/loadLessons';
import { getLessonCover } from '../data/lessonCovers';
import { loadCoachProfile } from '../utils/coachStorage';

const HiringJourneyPage: React.FC = () => {
  const navigate = useNavigate();
  const pipeline = getHiringPipeline();
  const profile = loadCoachProfile();
  const voice = profile?.voicePreference ?? 'male';
  const softSkillsPlaylist = getCoachingPlaylists()[0];

  const featuredLessons = useMemo(() => {
    const seen = new Set<string>();
    return getAllLessons()
      .filter((l) => {
        if (seen.has(l.leafId)) return false;
        seen.add(l.leafId);
        return hasLessonAudio(l.leafId, voice);
      })
      .slice(0, 8);
  }, [voice]);

  return (
    <div className="min-h-screen pb-28 md:pb-12">
      {/* Hero — Spotify "Good afternoon" energy */}
      <div
        className="relative px-4 pt-10 pb-8 md:px-8 md:pt-14"
        style={{
          background: 'linear-gradient(180deg, rgba(59,130,246,0.15) 0%, transparent 70%)',
        }}
      >
        <div className="container max-w-5xl mx-auto">
          <p className="text-sm font-medium text-accent-bright uppercase tracking-widest flex items-center gap-2 mb-2">
            <Map className="w-4 h-4" /> Choose your adventure
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary tracking-tight mb-3">
            {pipeline.title}
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-2xl">{pipeline.subtitle}</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <PremiumButton variant="primary" size="md" onClick={() => navigate('/coaching/ethics-soft-skills')}>
              <Play className="w-4 h-4 mr-2" />
              Ethics & soft skills
            </PremiumButton>
            <Link to="/lessons">
              <PremiumButton variant="secondary" size="md">
                Voice lesson library
              </PremiumButton>
            </Link>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 md:px-8">
        {/* Pipeline map — full end-to-end picture */}
        <HorizontalShelf
          title="The hiring loop"
          subtitle="Tap a stage — see what they're testing and where to practice"
        >
          {pipeline.stages.map((stage) => (
            <CoverCard
              key={stage.id}
              size="lg"
              title={stage.title}
              tagline={stage.problemYouSolve}
              subtitle={stage.duration}
              gradient={stage.cover.gradient}
              icon={stage.cover.icon}
              badge={`Step ${stage.order}`}
              href={`/journey/${stage.id}`}
            />
          ))}
        </HorizontalShelf>

        {/* Soft skills spotlight */}
        {softSkillsPlaylist && (
          <HorizontalShelf
            title={softSkillsPlaylist.title}
            subtitle={softSkillsPlaylist.tagline}
          >
            {softSkillsPlaylist.episodes.map((ep) => (
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

        {/* Voice lessons shelf */}
        <HorizontalShelf title="Coach voice lessons" subtitle="One glance — what each skill solves in interview">
          {featuredLessons.map((lesson) => {
            const cover = getLessonCover(lesson.leafId, lesson.track);
            return (
              <CoverCard
                key={lesson.leafId}
                title={lesson.title}
                tagline={cover.problemYouSolve}
                gradient={cover.gradient}
                icon={cover.icon}
                href={`/lessons#${lesson.leafId}`}
              />
            );
          })}
          <CoverCard
            title="See all lessons"
            subtitle="Full library with audio"
            gradient="linear-gradient(135deg, #262a31 0%, #3b82f6 100%)"
            icon="book-open"
            href="/lessons"
          />
        </HorizontalShelf>

        {/* Vertical detail cards for mobile scrollers */}
        <section className="mt-4 space-y-3 md:hidden">
          <h2 className="text-lg font-bold text-text-primary px-1">Quick start by stage</h2>
          {pipeline.stages.map((stage) => (
            <Link
              key={stage.id}
              to={`/journey/${stage.id}`}
              className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]"
            >
              <div
                className="w-14 h-14 rounded-lg shrink-0 flex items-center justify-center"
                style={{ background: stage.cover.gradient }}
              >
                <span className="text-white text-xs font-bold">{stage.order}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-text-primary">{stage.title}</p>
                <p className="text-xs text-text-secondary line-clamp-1">{stage.problemYouSolve}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-text-secondary shrink-0" />
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
};

export default HiringJourneyPage;
