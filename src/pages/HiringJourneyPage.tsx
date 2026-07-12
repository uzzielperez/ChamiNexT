import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Map, Play, ChevronRight } from 'lucide-react';
import CoverCard, { CoverIcon } from '../components/spotify/CoverCard';
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
        {/* Pipeline grid — always visible, no sideways scroll required */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-text-primary tracking-tight mb-1">The hiring loop</h2>
          <p className="text-sm text-text-secondary mb-6">
            Tap a stage — see what they&apos;re testing and where to practice
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {pipeline.stages.map((stage) => (
              <Link
                key={stage.id}
                to={`/journey/${stage.id}`}
                className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
              >
                <div
                  className="aspect-square rounded-xl shadow-[var(--shadow-card)] overflow-hidden mb-3 ring-1 ring-white/10 relative flex items-center justify-center transition-transform group-hover:scale-[1.02]"
                  style={{ background: stage.cover.gradient }}
                >
                  <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wide bg-black/50 text-white px-2 py-0.5 rounded-full">
                    Step {stage.order}
                  </span>
                  <CoverIcon name={stage.cover.icon} className="w-10 h-10 sm:w-12 sm:h-12 text-white/90 drop-shadow-md" />
                </div>
                <h3 className="font-bold text-text-primary text-sm leading-snug">{stage.title}</h3>
                <p className="text-xs text-accent-bright mt-1 line-clamp-2 font-medium">{stage.problemYouSolve}</p>
                <p className="text-[10px] text-text-secondary mt-1">{stage.duration}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Soft skills spotlight */}
        {softSkillsPlaylist && (
          <>
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
            <section className="mb-12 md:hidden">
              <h2 className="text-lg font-bold text-text-primary mb-4">{softSkillsPlaylist.title}</h2>
              <div className="grid grid-cols-2 gap-3">
                {softSkillsPlaylist.episodes.map((ep) => (
                  <Link key={ep.id} to={`/coaching/ethics-soft-skills#${ep.id}`} className="block">
                    <CoverCard
                      size="sm"
                      title={ep.title}
                      tagline={ep.problemYouSolve}
                      gradient={ep.cover.gradient}
                      icon={ep.cover.icon}
                    />
                  </Link>
                ))}
              </div>
            </section>
          </>
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
                href={`/lessons#lesson-${lesson.leafId}`}
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

        <section className="mb-12 md:hidden">
          <h2 className="text-lg font-bold text-text-primary mb-4">Coach voice lessons</h2>
          <div className="grid grid-cols-2 gap-3">
            {featuredLessons.slice(0, 6).map((lesson) => {
              const cover = getLessonCover(lesson.leafId, lesson.track);
              return (
                <Link key={lesson.leafId} to={`/lessons#lesson-${lesson.leafId}`}>
                  <CoverCard
                    size="sm"
                    title={lesson.title}
                    tagline={cover.problemYouSolve}
                    gradient={cover.gradient}
                    icon={cover.icon}
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Vertical detail cards for mobile scrollers — backup list */}
        <section className="mt-8 space-y-3 lg:hidden">
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
