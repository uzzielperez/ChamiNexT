import { Link } from 'react-router-dom';
import { ArrowRight, Monitor, Sparkles } from 'lucide-react';
import CodingWorkspace from '../components/workspace/CodingWorkspace';
import { RATE_LIMITER_WORKSPACE } from '../data/workspaceTemplates';

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-accent-blue text-sm font-semibold mb-2">
              <Monitor className="w-4 h-4" />
              Interview Studio · Browser workspace
            </div>
            <h1 className="text-3xl font-bold text-text-primary">Coding studio</h1>
            <p className="text-text-secondary mt-2 max-w-2xl">
              VS Code–style editor, terminal, and prompt-aware coding agent in the browser. Practice
              Work Tickets without leaving ChamiNexT — your files, runs, and agent prompts are part
              of the thinking-process trail.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/practice"
              className="inline-flex items-center px-3 py-2 text-sm rounded-xl border border-white/20 text-white hover:bg-white/10"
            >
              Back to practice
            </Link>
            <Link
              to="/employers"
              className="inline-flex items-center px-3 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              Interview Studio
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="card p-4 mb-6 border-accent-blue/25 flex flex-wrap items-center gap-3">
          <Sparkles className="w-5 h-5 text-accent-bright shrink-0" />
          <p className="text-sm text-text-secondary flex-1">
            <strong className="text-text-primary">Agentic workflow:</strong> edit in Monaco →{' '}
            <code className="text-accent-bright">npm test</code> in terminal → prompt the agent with{' '}
            <code className="text-accent-bright">agent &lt;question&gt;</code> or the quick chips.
            Disclosure of AI use is scored — same rubric as real Work Tickets.
          </p>
        </div>

        <CodingWorkspace template={RATE_LIMITER_WORKSPACE} />
      </div>
    </div>
  );
}
