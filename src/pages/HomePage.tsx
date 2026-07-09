import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Rocket,
  MessageSquare,
  Package,
  Calendar,
  Briefcase,
} from 'lucide-react';
import HeroCodeBackground from '../components/landing/HeroCodeBackground';
import HeroProductPreview from '../components/landing/HeroProductPreview';

const PRINCIPLES = [
  'Shipping > Solving',
  'Reasoning > Memorization',
  'Simulation > Questions',
  'AI in the workflow',
  'Output is the signal',
];

const FEATURES = [
  {
    icon: Calendar,
    title: 'Daily loop',
    line: 'One bite, one problem, one micro-ship — free every day. Build the habit before the hunt.',
    cta: 'Start Daily',
    href: '/daily',
  },
  {
    icon: MessageSquare,
    title: 'AI Interview Simulator',
    line: 'Coding and reasoning with adaptive follow-ups, scored on how you think.',
    cta: 'Run mock interview',
    href: '/practice',
  },
  {
    icon: Rocket,
    title: 'Ship Tests',
    line: '24h, 72h, and 7-day sprints. Build, deploy, and get reviewed like a real team.',
    cta: 'View challenges',
    href: '/practice',
    highlight: true,
  },
  {
    icon: Package,
    title: 'Talent Profile',
    line: 'Thinking scores, ship history, and strengths. Proof for hiring teams.',
    cta: 'Build profile',
    href: '/practice',
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <section className="hero-section relative overflow-hidden min-h-screen flex items-center justify-center">
        <HeroCodeBackground />

        <div className="container relative z-10 max-w-3xl text-center px-4 py-6 pb-44 md:pb-52">
          <h1 className="hero-display">Stop memorizing. Start shipping.</h1>

          <p className="hero-subheadline mt-5 max-w-xl mx-auto text-[var(--text-secondary)]">
            Daily practice for job seekers. Ship Tests and Interview Studio for teams hiring on
            real output — not trick questions.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mt-10 max-w-2xl mx-auto text-left">
            <button
              type="button"
              className="card p-6 border-accent-blue/30 hover:border-accent-blue/60 transition-colors text-left group"
              onClick={() => navigate('/daily')}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-accent-blue/10">
                  <Briefcase className="w-5 h-5 text-accent-blue" />
                </div>
                <span className="text-xs font-semibold text-accent-blue uppercase tracking-wide">
                  Job seeker
                </span>
              </div>
              <h2 className="text-lg font-bold text-text-primary mb-1">I&apos;m job hunting</h2>
              <p className="text-sm text-text-secondary mb-4">
                Free Daily loop → Sprint or Season when you&apos;re in active search.
              </p>
              <span className="text-accent-blue text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Start Daily <ArrowRight className="w-4 h-4" />
              </span>
            </button>

            <button
              type="button"
              className="card p-6 border-[var(--border-color)] hover:border-white/20 transition-colors text-left group"
              onClick={() => navigate('/employers')}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-white/5">
                  <Building2 className="w-5 h-5 text-text-secondary" />
                </div>
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                  Hiring team
                </span>
              </div>
              <h2 className="text-lg font-bold text-text-primary mb-1">I&apos;m hiring</h2>
              <p className="text-sm text-text-secondary mb-4">
                Map your pipeline: mocks, Work Tickets, soft-skill rubrics, ranked shortlists.
              </p>
              <span className="text-text-primary text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Interview Studio <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>

          <button
            type="button"
            className="text-link bg-transparent border-0 cursor-pointer p-0 mt-6 text-sm"
            onClick={() => navigate('/pricing')}
          >
            Compare Daily, Sprint &amp; Season plans →
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <HeroProductPreview />
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-20 md:py-24"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <h2 className="md:col-span-7 text-2xl md:text-4xl font-bold leading-tight">
              The evaluation layer for engineering in the AI era.
            </h2>
            <p className="md:col-span-5 text-text-secondary md:pb-1">
              From isolated puzzles to thinking, building, and shipping real products.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-12">
            {PRINCIPLES.map((p, i) => (
              <span key={p} className="text-sm text-text-secondary inline-flex items-center gap-6">
                {i > 0 && <span className="text-[var(--border-color)]">/</span>}
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container max-w-5xl">
          <h2 className="section-header max-w-xl mb-14">Four ways to prove you can build.</h2>

          <div className="border-t border-[var(--border-color)]">
            {FEATURES.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="grid md:grid-cols-12 gap-4 md:gap-8 py-9 items-start border-b border-[var(--border-color)]"
                >
                  <div className="md:col-span-1 flex items-center gap-3">
                    <span className="text-xl font-bold text-text-secondary tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="md:col-span-7">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-3">
                      <Icon className="w-5 h-5 text-accent-blue shrink-0" />
                      {item.title}
                      {item.highlight && (
                        <span className="text-[11px] font-semibold text-accent-blue uppercase tracking-wide px-2 py-0.5 rounded-full border border-accent-blue/30">
                          Core
                        </span>
                      )}
                    </h3>
                    <p className="text-text-secondary max-w-xl">{item.line}</p>
                  </div>
                  <div className="md:col-span-4 md:text-right">
                    <button
                      type="button"
                      onClick={() => navigate(item.href)}
                      className="text-accent-blue text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      {item.cta} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="section-header mb-3">Sprint Accelerator</h2>
          <p className="text-text-secondary max-w-xl mx-auto mb-2">
            2–3 weeks of intense prep: Daily loop, drills, Ship Tests, and unlimited mocks.
          </p>
          <p className="text-sm text-text-secondary mb-6">
            Season covers 3–4 months if you&apos;re building depth across skill trees.
          </p>
          <button type="button" className="btn-primary" onClick={() => navigate('/pricing')}>
            Daily · Sprint · Season
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section className="py-24">
        <div className="container">
          <div className="card border-accent-blue/20 max-w-4xl mx-auto p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex gap-4">
              <div className="p-3 rounded-lg bg-accent-blue/10 h-fit">
                <Building2 className="w-8 h-8 text-accent-blue" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Company Interview Studio</h2>
                <p className="text-text-secondary max-w-md">
                  Define roles, assign Ship Tests and Work Tickets, and rank candidates on shipped
                  output — not puzzle speed.
                </p>
              </div>
            </div>
            <button type="button" className="btn-primary shrink-0" onClick={() => navigate('/employers')}>
              Hire with Ship Tests
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 pb-28" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container max-w-3xl">
          <h2 className="section-header mb-10">Why not another grind site?</h2>
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-text-secondary">
                <th className="py-3 pr-4 font-medium">Platform</th>
                <th className="py-3 pr-4 font-medium">Focus</th>
                <th className="py-3 font-medium">Limit</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--border-color)] text-text-secondary">
                <td className="py-4 pr-4">LeetCode</td>
                <td className="py-4 pr-4">Algorithms</td>
                <td className="py-4">Rewards memorization</td>
              </tr>
              <tr className="border-b border-[var(--border-color)] text-text-secondary">
                <td className="py-4 pr-4">HackerRank</td>
                <td className="py-4 pr-4">Static tests</td>
                <td className="py-4">No real shipping</td>
              </tr>
              <tr className="border-b border-[var(--border-color)]">
                <td className="py-4 pr-4 font-semibold text-accent-blue">ChamiNext</td>
                <td className="py-4 pr-4 font-medium text-text-primary">Thinking and shipping</td>
                <td className="py-4 text-text-primary">No memorization wall</td>
              </tr>
            </tbody>
          </table>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <button type="button" className="btn-primary" onClick={() => navigate('/daily')}>
              Start Daily free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/pricing')}>
              View pricing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
