import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PremiumTabs from '../components/ui/PremiumTabs';
import PremiumButton from '../components/ui/PremiumButton';
import {
  Briefcase,
  Rocket,
  BarChart3,
  Plus,
  Link2,
  ArrowRight,
  Download,
  Shield,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  loadRoles,
  addRole,
  loadApplications,
  updateApplicationStatus,
  applicationsToCsv,
} from '../utils/employerStorage';
import { shipTestChallenges } from '../data/shipTests';
import { seedEmployerDemoData, type EmployerDemoSeedResult } from '../utils/seedDemo';
import { loadSubmissions } from '../utils/studioSubmissionStorage';
import softSkillsPipeline from '../../content/employers/soft-skills-pipeline.json';
import {
  hasCompanyAccess,
  loadSubscription,
} from '../utils/subscriptionStorage';
import type { CandidateApplication } from '../types/employer';
import { FOUNDING } from '../data/foundingOffer';
import { getCompanyLoops, formatSalaryRange } from '../data/loadCompanyLoops';

type ViewMode = 'roles' | 'assessments' | 'candidates';

const STATUS_LABELS: Record<CandidateApplication['status'], string> = {
  new: 'New',
  review: 'Reviewing',
  strong: 'Shortlisted',
  hold: 'On hold',
};

const statusSelectClass = (status: CandidateApplication['status']) =>
  `status-badge status-${status} min-w-[7.5rem] text-center`;

const softPhases = (softSkillsPipeline as { phases: { phase: number; title: string; id: string }[] })
  .phases;

const EmployersPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('candidates');
  const [roles, setRoles] = useState(loadRoles());
  const [applications, setApplications] = useState(loadApplications());
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('Full Stack Engineer');
  const [softSkillsPack, setSoftSkillsPack] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [demoSeedResult, setDemoSeedResult] = useState<EmployerDemoSeedResult | null>(null);
  const [demoSeedError, setDemoSeedError] = useState<string | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);

  const sub = loadSubscription();
  const companyAccess = hasCompanyAccess();
  const pilotActive = Boolean(sub.trialEndsAt || sub.workspaceId || companyAccess);

  const refresh = () => {
    setRoles(loadRoles());
    setApplications(loadApplications());
  };

  const loadDemoData = () => {
    setDemoLoading(true);
    setDemoSeedError(null);
    try {
      const result = seedEmployerDemoData();
      setDemoSeedResult(result);
      refresh();
      setCurrentView('candidates');
      window.setTimeout(() => {
        document.getElementById('employer-studio-panel')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 80);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : 'Could not save demo data (browser storage may be blocked).';
      setDemoSeedError(msg);
      console.error('Employer demo seed failed', e);
    } finally {
      setDemoLoading(false);
    }
  };

  const submissionCount = loadSubmissions().length;

  const tabs = [
    { id: 'roles', label: 'Roles', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'assessments', label: 'Assessments', icon: <Rocket className="w-4 h-4" /> },
    { id: 'candidates', label: 'Candidates', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const createRole = () => {
    addRole({
      title: newTitle,
      level: 'Mid',
      shipTestId: 'habit-tracker-24h',
      assessmentType: 'both',
      softSkillsPack,
    });
    refresh();
    setShowCreate(false);
  };

  const copyInvite = (roleId: string) => {
    const url = `${window.location.origin}/apply?role=${roleId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(roleId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportCsv = () => {
    const csv = applicationsToCsv(loadApplications(), loadRoles());
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chaminext-candidates-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sortedApps = useMemo(
    () => [...applications].sort((a, b) => b.shipping - a.shipping),
    [applications]
  );

  return (
    <div className="app-shell text-text-primary">
      <div>
        <div className="container mx-auto px-4 pt-8 max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-accent-blue font-medium mb-1">Company Interview Studio</p>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
                Hire on output. Skip the whiteboard theater.
              </h1>
              <p className="text-text-secondary text-sm mt-2 max-w-2xl">
                Load demo data, then open <strong className="text-text-primary">Candidates</strong> or{' '}
                <strong className="text-text-primary">Assessments</strong> to review hiring recommendations.
              </p>
            </div>
            <PremiumButton
              variant="primary"
              size="md"
              loading={demoLoading}
              onClick={loadDemoData}
              className="shrink-0"
            >
              Load employer demo data
            </PremiumButton>
          </div>

          {demoSeedResult && (
            <div
              className="card p-4 mb-6 border-emerald-500/40 bg-emerald-500/10 flex flex-wrap items-start gap-3"
              role="status"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-emerald-200">Demo data loaded</p>
                <p className="text-text-secondary mt-1">
                  {demoSeedResult.applications} candidates · {demoSeedResult.loopCandidates} company-loop
                  submissions · {demoSeedResult.submissions} total packages with hire recommendations.
                  You are on the <strong className="text-text-primary">Candidates</strong> tab — scroll down
                  for the table, or switch to <strong className="text-text-primary">Assessments</strong> for
                  per-company loops.
                </p>
              </div>
            </div>
          )}

          {demoSeedError && (
            <div
              className="card p-4 mb-6 border-red-500/40 bg-red-500/10 flex gap-3"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-200">{demoSeedError}</p>
            </div>
          )}

          {applications.length > 0 && !demoSeedResult && (
            <p className="text-sm text-text-secondary mb-6">
              Studio has <strong className="text-text-primary">{applications.length}</strong> candidate
              {applications.length === 1 ? '' : 's'} and{' '}
              <strong className="text-text-primary">{submissionCount}</strong> submission package
              {submissionCount === 1 ? '' : 's'} in this browser.
            </p>
          )}

          <PremiumTabs
            tabs={tabs}
            activeTab={currentView}
            onTabChange={(id) => setCurrentView(id as ViewMode)}
            className="mb-6"
          />
        </div>

        <div className="container mx-auto px-4 pb-24 md:pb-12 max-w-6xl">
          <div id="employer-studio-panel" className="scroll-mt-24">

          {!companyAccess && (
            <div className="card p-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-accent-blue/30">
              <div className="text-left">
                <p className="font-semibold text-text-primary flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent-blue" />
                  Founding company pilot
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  60-day free trial on Stripe · {FOUNDING.percentOff}% off with{' '}
                  <span className="font-mono text-accent-blue">{FOUNDING.code}</span> for the first{' '}
                  {FOUNDING.maxRedemptions} payers. Soft-skills packs + CSV export included.
                </p>
              </div>
              <Link to="/pricing?for=companies" className="shrink-0">
                <PremiumButton variant="primary" size="md">
                  Start company pilot
                </PremiumButton>
              </Link>
            </div>
          )}

          {pilotActive && (
            <div className="mb-6 text-sm text-text-secondary flex flex-wrap gap-3 items-center">
              <span className="px-2 py-1 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                {sub.companyPlan || sub.plan} active
              </span>
              {sub.workspaceId && (
                <span className="font-mono text-xs">workspace {sub.workspaceId}</span>
              )}
              {sub.trialEndsAt && (
                <span>
                  trial through{' '}
                  {new Date(sub.trialEndsAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>
          )}

          {currentView === 'roles' && (
            <>
              <div className="flex justify-end mb-6 gap-2">
                <PremiumButton variant="primary" size="md" onClick={() => setShowCreate(!showCreate)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Create role
                </PremiumButton>
              </div>
              {showCreate && (
                <div className="card p-6 mb-6 flex flex-wrap gap-4 items-end">
                  <div className="flex-grow min-w-[200px]">
                    <label className="text-sm text-text-secondary">Role title</label>
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full mt-1 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-text-primary"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-text-secondary pb-2">
                    <input
                      type="checkbox"
                      checked={softSkillsPack}
                      onChange={(e) => setSoftSkillsPack(e.target.checked)}
                    />
                    Soft-skills rubric pack
                  </label>
                  <PremiumButton variant="primary" onClick={createRole}>
                    Save
                  </PremiumButton>
                </div>
              )}
              {roles.length === 0 ? (
                <p className="text-text-secondary text-center">
                  No roles yet. Load demo data or create one.
                </p>
              ) : (
                roles.map((role) => (
                  <div
                    key={role.id}
                    className="card p-6 mb-4 flex flex-wrap justify-between gap-4 items-center"
                  >
                    <div>
                      <h3 className="text-xl font-bold">{role.title}</h3>
                      <p className="text-text-secondary text-sm">
                        {role.level} · {role.assessmentType}
                        {role.softSkillsPack ? ' · soft-skills pack' : ''}
                      </p>
                    </div>
                    <PremiumButton variant="outline" size="sm" onClick={() => copyInvite(role.id)}>
                      <Link2 className="w-4 h-4 mr-1" />
                      {copiedId === role.id ? 'Copied!' : 'Copy invite link'}
                    </PremiumButton>
                  </div>
                ))
              )}
            </>
          )}

          {currentView === 'assessments' && (
            <>
              <div className="card p-6 mb-6 border-accent-blue/30">
                <h3 className="font-bold text-text-primary">Company interview loops</h3>
                <p className="text-text-secondary text-sm mt-2 mb-4">
                  Each landing-page loop (Pulse, Meridian, SearchCo, …) has its own employer dashboard:
                  assigned stages, candidate pipeline, and per-candidate prompt review.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getCompanyLoops().map((loop) => (
                    <Link
                      key={loop.id}
                      to={`/employers/loops/${loop.id}`}
                      className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-accent-blue/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: loop.logoGradient }}
                        >
                          {loop.logoAbbr}
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary text-sm">{loop.placeholderName}</p>
                          <p className="text-xs text-text-secondary">{loop.roleTitle}</p>
                        </div>
                      </div>
                      <p className="text-xs text-accent-bright">{formatSalaryRange(loop.salaryMin, loop.salaryMax)}</p>
                      <p className="text-xs text-accent-blue mt-2 flex items-center gap-1">
                        View employer loop
                        <ArrowRight className="w-3 h-3" />
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="card p-6 mb-6 border-accent-blue/30">
                <h3 className="font-bold text-text-primary">Prompt trail demo</h3>
                <p className="text-text-secondary text-sm mt-2 mb-4">
                  Full loop: company task → candidate studio → auto submission package → raw + graded
                  prompts in Studio.
                </p>
                <Link to="/demo">
                  <PremiumButton variant="primary" size="sm">
                    Run end-to-end demo
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </PremiumButton>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shipTestChallenges.map((c) => (
                <div key={c.id} className="card p-6">
                  <h3 className="font-bold">{c.title}</h3>
                  <p className="text-sm text-accent-blue mt-1">{c.format}</p>
                  <p className="text-text-secondary text-sm mt-2">{c.description}</p>
                </div>
              ))}
              <div className="card p-6 border-accent-blue/30 md:col-span-2">
                <h3 className="font-bold">Soft-skills rubric pack</h3>
                <p className="text-text-secondary text-sm mt-2 mb-4">
                  Five behavioral phases wired into the AI interviewer — assign per role when you
                  create one.
                </p>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {softPhases.map((p) => (
                    <li
                      key={p.id}
                      className="text-sm text-text-secondary flex gap-2 items-start"
                    >
                      <span className="text-accent-blue font-mono text-xs mt-0.5">P{p.phase}</span>
                      {p.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            </>
          )}

          {currentView === 'candidates' && (
            <>
              <div className="flex justify-end mb-4">
                <PremiumButton
                  variant="secondary"
                  size="sm"
                  onClick={exportCsv}
                  disabled={sortedApps.length === 0}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export CSV
                </PremiumButton>
              </div>
              <div className="card overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-text-secondary text-left">
                      <th className="p-4">Candidate</th>
                      <th className="p-4">Thinking</th>
                      <th className="p-4">Shipping</th>
                      <th className="p-4">Signal</th>
                      <th className="p-4">Status</th>
                      <th className="p-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {sortedApps.map((c) => (
                      <tr key={c.id} className="border-b border-[var(--border-color)]">
                        <td className="p-4 font-medium">{c.displayName}</td>
                        <td className="p-4">{c.thinking}</td>
                        <td className="p-4 font-bold text-accent-blue">{c.shipping}</td>
                        <td className="p-4 text-text-secondary">{c.shipTestTitle}</td>
                        <td className="p-4">
                          <select
                            value={c.status}
                            onChange={(e) => {
                              updateApplicationStatus(
                                c.id,
                                e.target.value as CandidateApplication['status']
                              );
                              refresh();
                            }}
                            className={statusSelectClass(c.status)}
                            aria-label={`Status for ${c.displayName}`}
                          >
                            {(Object.keys(STATUS_LABELS) as CandidateApplication['status'][]).map(
                              (s) => (
                                <option key={s} value={s} className="bg-[#0a0b0d] text-white">
                                  {STATUS_LABELS[s]}
                                </option>
                              )
                            )}
                          </select>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-3">
                            {c.submissionId && (
                              <Link
                                to={`/employers/review/${c.submissionId}`}
                                className="text-accent-bright hover:underline font-medium"
                              >
                                Full assessment
                              </Link>
                            )}
                            <a
                              href={`/profile/${c.profileSlug}`}
                              className="text-accent-blue hover:underline"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Profile
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {sortedApps.length === 0 && (
                  <div className="p-8 text-center text-text-secondary space-y-4">
                    <p>No candidates yet. Load demo data to populate the pipeline with sample applications.</p>
                    <PremiumButton variant="primary" size="sm" loading={demoLoading} onClick={loadDemoData}>
                      Load employer demo data
                    </PremiumButton>
                  </div>
                )}
              </div>
            </>
          )}

          </div>

          <div className="studio-cta-card mt-12 p-8 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Ready to hire on real output?</h3>
              <p className="text-text-secondary text-sm">
                Founding {FOUNDING.percentOff}% off · 60-day free trial · Soft-skills packs in Studio
              </p>
            </div>
            <Link to="/pricing?for=companies" className="shrink-0">
              <PremiumButton variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                View pricing
              </PremiumButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployersPage;
