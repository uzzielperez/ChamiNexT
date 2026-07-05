import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import HubPageHeader from '../components/hub/HubPageHeader';
import { courses, getDailyBite, projectStartersList } from '../data/loadCourseContent';

const LearnPage: React.FC = () => {
  const todayBite = getDailyBite();

  return (
    <div className="hub-shell">
      <div className="hub-container max-w-3xl">
        <HubPageHeader
          title="Learn"
          subtitle="Daily bites, premium courses, and project starters — pick up where you left off."
        />

        <section className="hub-highlight mb-8">
          <p className="hub-section-label flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-accent-bright" />
            Today&apos;s bite
          </p>
          <h2 className="text-lg font-bold text-text-primary">{todayBite.title}</h2>
          <p className="text-sm text-text-secondary mt-2">{todayBite.excerpt}</p>
          <Link
            to={todayBite.lessonLink}
            className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-accent-bright hover:text-text-primary transition-colors"
          >
            Continue in course
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>

        <section className="mb-10">
          <p className="hub-section-label flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" />
            Premium courses
          </p>
          <div className="space-y-2">
            {courses.map((c) => (
              <Link key={c.id} to={c.path} className="hub-row">
                <div className="hub-icon-tile">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-text-primary text-sm">{c.title}</h3>
                  <p className="text-xs text-text-secondary mt-0.5">{c.modules.join(' · ')}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary shrink-0" aria-hidden />
              </Link>
            ))}
          </div>
          <Link
            to="/marketplace"
            className="inline-block mt-4 text-sm text-accent-bright font-medium hover:underline"
          >
            Browse all in Marketplace →
          </Link>
        </section>

        <section>
          <p className="hub-section-label">Project starters</p>
          <div className="space-y-2">
            {projectStartersList.map((p) => (
              <div key={p.id} className="hub-catalog-card">
                <h3 className="font-semibold text-text-primary">{p.title}</h3>
                <p className="text-sm text-text-secondary mt-1">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.tags.map((t) => (
                    <span key={t} className="hub-badge hub-badge-muted">
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-accent-bright"
                >
                  Open in GitHub <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LearnPage;
