import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Sparkles,
  Rocket,
  MessageSquare,
  Package,
} from 'lucide-react';
import AnimatedBackground from '../components/ui/AnimatedBackground';

const PRINCIPLES = [
  'Shipping > Solving',
  'Reasoning > Memorization',
  'Simulation > Questions',
  'AI in the workflow',
  'Output is the signal',
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <section className="hero-section grid-pattern relative overflow-hidden">
        <AnimatedBackground opacity={0.4} speed={1.2} />

        <div className="container text-center relative z-10 max-w-4xl">
          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border border-accent-blue/30 bg-accent-blue/10 text-accent-blue mb-8">
            <Sparkles className="w-4 h-4" />
            ChamiNext
          </p>

          <h1 className="hero-headline">
            Interview prep and{' '}
            <span className="text-gradient">ship tests</span> for the AI era.
          </h1>

          <p className="hero-subheadline mt-6 max-w-2xl mx-auto">
            Think, build, and deploy—not memorize. AI interviews, adaptive practice,
            and timed Ship Tests. Companies hire on what you shipped.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <button className="btn-primary" onClick={() => navigate('/practice')}>
              <span>Start a Ship Test</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="btn-secondary" onClick={() => navigate('/employers')}>
              Interview Studio
            </button>
          </div>
        </div>
      </section>

      <section className="section py-12" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container max-w-4xl text-center">
          <p className="text-lg md:text-xl font-medium text-text-primary">
            The evaluation layer for engineering in the AI era.
          </p>
          <p className="text-secondary mt-3">
            Isolated puzzles → thinking, building, shipping real products.
          </p>
        </div>
      </section>

      <section className="section py-8">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-3">
            {PRINCIPLES.map((p) => (
              <span
                key={p}
                className="glass px-4 py-2 rounded-full text-sm text-text-secondary border border-gray-700"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section relative overflow-hidden">
        <AnimatedBackground opacity={0.12} speed={0.8} />
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <MessageSquare className="w-10 h-10 text-accent-blue" />,
                title: 'AI Interview Simulator',
                line: 'Coding + reasoning. Adaptive follow-ups. Scored on how you think.',
                action: () => navigate('/practice'),
                cta: 'Run mock interview',
              },
              {
                icon: <Rocket className="w-10 h-10 text-accent-blue" />,
                title: 'Ship Tests',
                line: '24h, 72h, or 7-day sprints. Build, deploy, get reviewed like a real team.',
                action: () => navigate('/practice'),
                cta: 'View challenges',
                highlight: true,
              },
              {
                icon: <Package className="w-10 h-10 text-accent-blue" />,
                title: 'Talent Profile',
                line: 'Thinking scores, ship history, strengths—proof for hiring teams.',
                action: () => navigate('/practice'),
                cta: 'Build profile',
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`feature-card text-center ${item.highlight ? 'border-accent-blue/40' : ''}`}
              >
                {item.highlight && (
                  <span className="text-xs font-semibold text-accent-blue uppercase tracking-wide mb-2 block">
                    Core differentiator
                  </span>
                )}
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-secondary text-sm mb-6">{item.line}</p>
                <button
                  type="button"
                  onClick={item.action}
                  className="text-accent-blue text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                >
                  {item.cta} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container max-w-3xl text-center">
          <h2 className="section-header mb-4">Ship Test formats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              { label: '24h Sprint', desc: 'Ship under pressure' },
              { label: '72h Build', desc: 'Structured product' },
              { label: '7-Day Sprint', desc: 'MVP + product thinking' },
            ].map((f) => (
              <div key={f.label} className="card p-6">
                <div className="text-xl font-bold text-gradient mb-1">{f.label}</div>
                <p className="text-secondary text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-secondary text-sm mt-6">
            AI plays PM, Tech Lead, reviewer, and user—requirements evolve mid-sprint.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card border-accent-blue/20 max-w-4xl mx-auto p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex gap-4">
              <div className="p-3 rounded-lg bg-accent-blue/10 h-fit">
                <Building2 className="w-8 h-8 text-accent-blue" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Company Interview Studio</h2>
                <p className="text-secondary max-w-md">
                  Define roles, assign Ship Tests, rank candidates on shipped output—not puzzle speed.
                </p>
              </div>
            </div>
            <button className="btn-primary shrink-0" onClick={() => navigate('/employers')}>
              Hire with Ship Tests
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container max-w-4xl text-center">
          <h2 className="section-header mb-4">Plans for engineers & teams</h2>
          <p className="text-text-secondary mb-6">Free to start · Builder unlocks Ship Tests · B2B Interview Studio</p>
          <button className="btn-secondary" onClick={() => navigate('/pricing')}>
            View pricing
          </button>
        </div>
      </section>

      <section className="section pb-24">
        <div className="container max-w-3xl">
          <h2 className="section-header text-center mb-8">Why not another grind site?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700 text-text-secondary">
                  <th className="py-3 pr-4">Platform</th>
                  <th className="py-3 pr-4">Focus</th>
                  <th className="py-3">Limit</th>
                </tr>
              </thead>
              <tbody className="text-secondary">
                <tr className="border-b border-gray-800">
                  <td className="py-3 pr-4">LeetCode</td>
                  <td className="py-3 pr-4">Algorithms</td>
                  <td className="py-3">Memorization</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 pr-4">HackerRank</td>
                  <td className="py-3 pr-4">Static tests</td>
                  <td className="py-3">No real shipping</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-accent-blue">ChamiNext</td>
                  <td className="py-3 pr-4 font-medium text-text-primary">Thinking + Shipping</td>
                  <td className="py-3">—</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center mt-10">
            <button className="btn-primary" onClick={() => navigate('/practice')}>
              Start free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
