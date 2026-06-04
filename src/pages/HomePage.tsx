import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Rocket,
  MessageSquare,
  Package,
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
    icon: MessageSquare,
    title: 'AI Interview Simulator',
    line: 'Coding and reasoning with adaptive follow-ups, scored on how you think.',
    cta: 'Run mock interview',
  },
  {
    icon: Rocket,
    title: 'Ship Tests',
    line: '24h, 72h, and 7-day sprints. Build, deploy, and get reviewed like a real team.',
    cta: 'View challenges',
    highlight: true,
  },
  {
    icon: Package,
    title: 'Talent Profile',
    line: 'Thinking scores, ship history, and strengths. Proof for hiring teams.',
    cta: 'Build profile',
  },
];

const FORMATS = [
  { big: '24h', label: 'Sprint', desc: 'Ship under pressure.' },
  { big: '72h', label: 'Build', desc: 'A structured product.' },
  { big: '7d', label: 'Sprint', desc: 'MVP plus product thinking.' },
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
            AI interview practice that adapts to you, plus timed Ship Tests companies use
            to hire on real output, not trick questions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-8">
            <button type="button" className="btn-primary" onClick={() => navigate('/practice')}>
              <span>Start a Ship Test</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="text-link bg-transparent border-0 cursor-pointer p-0"
              onClick={() => navigate('/employers')}
            >
              See the Interview Studio
            </button>
          </div>

          <div className="mt-8 max-w-lg mx-auto">
            <p className="hero-testimonial-quote">
              &ldquo;This is the most realistic interview practice I&apos;ve done.&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-white/[0.08]">
              <div
                className="w-8 h-8 rounded-full shrink-0 border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-center text-xs font-medium text-[var(--text-secondary)]"
                aria-hidden
              >
                SW
              </div>
              <p className="hero-testimonial-attribution text-left">
                Senior SWE, recently hired at a growth-stage startup
              </p>
            </div>
          </div>
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
          <h2 className="section-header max-w-xl mb-14">Three ways to prove you can build.</h2>

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
                      onClick={() => navigate('/practice')}
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
        <div className="container max-w-5xl">
          <h2 className="section-header mb-3">Ship Test formats</h2>
          <p className="text-text-secondary max-w-xl mb-10">
            AI plays PM, tech lead, reviewer, and user. Requirements evolve mid sprint.
          </p>

          <div className="grid sm:grid-cols-3 border-t border-b border-[var(--border-color)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-color)]">
            {FORMATS.map((f) => (
              <div key={f.big + f.label} className="py-8 sm:px-8 first:sm:pl-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight">
                    {f.big}
                  </span>
                  <span className="text-sm font-medium text-accent-blue uppercase tracking-wide">
                    {f.label}
                  </span>
                </div>
                <p className="text-text-secondary text-sm mt-3">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="section-header mb-3">Interview Season</h2>
          <p className="text-text-secondary max-w-xl mx-auto mb-2">
            €149 for 90 days of full Builder access. One payment while you hunt a $100k–500k role.
          </p>
          <p className="text-sm text-text-secondary mb-6">
            Less than a single human mock. Unlimited AI interviews and Ship Tests included.
          </p>
          <button type="button" className="btn-primary" onClick={() => navigate('/pricing')}>
            See pricing
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
                  Define roles, assign Ship Tests, and rank candidates on shipped output, not
                  puzzle speed.
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
            <button type="button" className="btn-primary" onClick={() => navigate('/practice')}>
              Start free
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
