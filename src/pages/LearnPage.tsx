import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ExternalLink } from 'lucide-react';
import { courses, getDailyBite, projectStartersList } from '../data/loadCourseContent';

const LearnPage: React.FC = () => {
  const todayBite = getDailyBite();

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl pb-28">
      <h1 className="text-2xl font-bold text-text-primary mb-2">Learn</h1>
      <p className="text-text-secondary mb-8">Courses, today&apos;s bite, and project starters.</p>

      <section className="mb-10 p-5 rounded-[var(--radius-card)] border border-accent-blue/40 bg-[var(--bg-secondary)]">
        <p className="text-xs font-semibold text-accent-blue uppercase mb-2">Today&apos;s bite</p>
        <h2 className="text-lg font-bold text-text-primary">{todayBite.title}</h2>
        <p className="text-sm text-text-secondary mt-2">{todayBite.excerpt}</p>
        <Link to={todayBite.lessonLink} className="inline-block mt-4 text-sm text-accent-blue font-medium">
          Continue in course →
        </Link>
      </section>

      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-accent-blue" />
        Premium courses
      </h2>
      <div className="grid gap-3 mb-10">
        {courses.map((c) => (
          <Link
            key={c.id}
            to={c.path}
            className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-accent-blue/50 transition-colors"
          >
            <h3 className="font-bold text-text-primary">{c.title}</h3>
            <p className="text-xs text-text-secondary mt-1">{c.modules.join(' · ')}</p>
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-bold mb-4">Project starters</h2>
      <div className="space-y-3">
        {projectStartersList.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)]"
          >
            <h3 className="font-bold text-text-primary">{p.title}</h3>
            <p className="text-sm text-text-secondary mt-1">{p.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {p.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-text-secondary">
                  {t}
                </span>
              ))}
            </div>
            <a
              href={p.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-sm text-accent-blue font-medium"
            >
              Open in GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnPage;
