import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Mic, Lightbulb } from 'lucide-react';
import CoverCard from '../components/spotify/CoverCard';
import HorizontalShelf from '../components/spotify/HorizontalShelf';
import PremiumButton from '../components/ui/PremiumButton';
import { getCoachingPlaylist } from '../data/loadCoachingPlaylists';

const CoachingPlaylistPage: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const playlist = playlistId ? getCoachingPlaylist(playlistId) : undefined;

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [playlistId]);

  if (!playlist) {
    return (
      <div className="container max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-text-secondary mb-4">Playlist not found.</p>
        <Link to="/journey" className="text-accent-blue hover:underline">
          Back to journey
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 md:pb-12">
      <div className="relative px-4 pt-10 pb-12 md:px-8 md:pt-14 overflow-hidden">
        <div className="absolute inset-0 opacity-35" style={{ background: playlist.cover.gradient }} aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-primary)]" aria-hidden />
        <div className="container max-w-4xl mx-auto relative">
          <button
            type="button"
            onClick={() => navigate('/journey')}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Hiring adventure
          </button>
          <p className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">Coach playlist</p>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-3">{playlist.title}</h1>
          <p className="text-lg text-accent-bright font-medium mb-2">{playlist.tagline}</p>
          <p className="text-text-secondary max-w-2xl text-sm md:text-base">{playlist.description}</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <PremiumButton
              variant="primary"
              size="md"
              onClick={() => {
                const first = playlist.episodes[0];
                if (first) navigate('/practice', { state: { problemId: first.practiceProblemId } });
              }}
            >
              <Mic className="w-4 h-4 mr-2" />
              Start mock interview
            </PremiumButton>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 md:px-8">
        <HorizontalShelf title="Episodes" subtitle="Sample questions · answer frameworks · live practice">
          {playlist.episodes.map((ep) => (
            <CoverCard
              key={ep.id}
              title={ep.title}
              tagline={ep.problemYouSolve}
              duration={ep.duration}
              gradient={ep.cover.gradient}
              icon={ep.cover.icon}
              onClick={() => document.getElementById(ep.id)?.scrollIntoView({ behavior: 'smooth' })}
            />
          ))}
        </HorizontalShelf>

        <div className="space-y-8 mt-4">
          {playlist.episodes.map((ep) => (
            <article
              key={ep.id}
              id={ep.id}
              className="scroll-mt-24 p-6 md:p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]"
            >
              <div className="flex flex-wrap items-start gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-lg shrink-0 flex items-center justify-center shadow-lg"
                  style={{ background: ep.cover.gradient }}
                >
                  <span className="text-white font-bold text-lg">{ep.phase}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-text-primary">{ep.title}</h2>
                  <p className="text-accent-bright font-medium text-sm mt-1">{ep.problemYouSolve}</p>
                </div>
                <PremiumButton
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/practice', { state: { problemId: ep.practiceProblemId } })}
                >
                  Practice this round
                </PremiumButton>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-3">
                  Questions they ask
                </h3>
                <ul className="space-y-2">
                  {ep.sampleQuestions.map((q) => (
                    <li key={q} className="text-sm text-text-primary pl-4 border-l-2 border-accent-blue/40">
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-accent-blue/5 border border-accent-blue/20 mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wide text-accent-blue mb-2 flex items-center gap-2">
                  <Lightbulb className="w-3.5 h-3.5" /> Strong answer framework
                </h3>
                <p className="text-sm text-text-primary leading-relaxed">{ep.strongAnswerFramework}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-emerald-400 mb-2 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Strong signals
                  </h3>
                  <ul className="space-y-1.5">
                    {ep.strongSignals.map((s) => (
                      <li key={s} className="text-xs text-text-secondary">
                        · {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-red-400 mb-2 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Weak patterns
                  </h3>
                  <ul className="space-y-1.5">
                    {ep.weakPatterns.map((w) => (
                      <li key={w} className="text-xs text-text-secondary">
                        · {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="text-sm text-text-secondary italic border-t border-[var(--border-color)] pt-4">
                <span className="text-text-primary font-medium not-italic">Coach tip: </span>
                {ep.coachTip}
              </p>
            </article>
          ))}
        </div>

        {playlist.notebookLmSources && playlist.notebookLmSources.length > 0 && (
          <p className="text-center text-xs text-text-secondary mt-10 pb-8">
            Deep-dive audio coming via NotebookLM · sources: {playlist.notebookLmSources.length} rubric files
          </p>
        )}
      </div>
    </div>
  );
};

export default CoachingPlaylistPage;
