import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PremiumTabs from '../components/ui/PremiumTabs';
import PremiumButton from '../components/ui/PremiumButton';
import { Briefcase, Rocket, BarChart3, Plus, Link2, ArrowRight } from 'lucide-react';
import {
  loadRoles,
  addRole,
  loadApplications,
  updateApplicationStatus,
} from '../utils/employerStorage';
import { shipTestChallenges } from '../data/shipTests';
import { seedDemoPresentation } from '../utils/seedDemo';
import type { CandidateApplication } from '../types/employer';

type ViewMode = 'roles' | 'assessments' | 'candidates';

const STATUS_LABELS: Record<CandidateApplication['status'], string> = {
  new: 'New',
  review: 'Reviewing',
  strong: 'Shortlisted',
  hold: 'On hold',
};

const statusSelectClass = (status: CandidateApplication['status']) =>
  `status-badge status-${status} min-w-[7.5rem] text-center`;

const EmployersPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('candidates');
  const [roles, setRoles] = useState(loadRoles());
  const [applications, setApplications] = useState(loadApplications());
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('Full Stack Engineer');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const refresh = () => {
    setRoles(loadRoles());
    setApplications(loadApplications());
  };

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

  const sortedApps = [...applications].sort((a, b) => b.shipping - a.shipping);

  return (
    <div className="app-shell text-text-primary">
      <div>
        <div className="w-full px-4 pt-8">
          <div className="container mx-auto max-w-5xl">
            <PremiumTabs
              tabs={tabs}
              activeTab={currentView}
              onTabChange={(id) => setCurrentView(id as ViewMode)}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-6xl pb-24 md:pb-12">
          <div className="text-center mb-10">
            <p className="text-sm text-accent-blue font-medium mb-2">Company Interview Studio</p>
            <h1 className="text-hero-headline font-bold text-text-primary mb-4">
              Hire on output. Skip the whiteboard theater.
            </h1>
            <p className="text-subheadline text-text-secondary max-w-2xl mx-auto">
              Send a real project challenge. Get thinking scores, shipping scores, and a ranked
              shortlist — in 24–72 hours.
            </p>
            <div className="mt-8 flex flex-col items-center gap-2">
              <PremiumButton
                variant="primary"
                size="lg"
                onClick={() => {
                  seedDemoPresentation();
                  refresh();
                }}
              >
                Load employer demo data
              </PremiumButton>
              <p className="text-text-secondary text-sm max-w-md">
                Populates sample roles, Ship Test assignments, and ranked candidates so you can
                explore the studio in one click.
              </p>
            </div>
          </div>

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
                  <div className="flex-grow">
                    <label className="text-sm text-text-secondary">Role title</label>
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full mt-1 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-text-primary"
                    />
                  </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shipTestChallenges.map((c) => (
                <div key={c.id} className="card p-6">
                  <h3 className="font-bold">{c.title}</h3>
                  <p className="text-sm text-accent-blue mt-1">{c.format}</p>
                  <p className="text-text-secondary text-sm mt-2">{c.description}</p>
                </div>
              ))}
              <div className="card p-6 border-accent-blue/30">
                <h3 className="font-bold">AI Interview Pack</h3>
                <p className="text-text-secondary text-sm mt-2">
                  All practice domains with adaptive follow-ups.
                </p>
              </div>
            </div>
          )}

          {currentView === 'candidates' && (
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
                        <a
                          href={`/profile/${c.profileSlug}`}
                          className="text-accent-blue hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Profile
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {sortedApps.length === 0 && (
                <p className="p-8 text-center text-text-secondary">
                  No applications. Candidates apply via invite link or Profile → Apply to demo
                  role.
                </p>
              )}
            </div>
          )}

          <div className="studio-cta-card mt-12 p-8 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Ready to hire on real output?</h3>
              <p className="text-text-secondary text-sm">
                Priced by company size — small business from €250/mo · Free 60-day pilot · No setup fees
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
