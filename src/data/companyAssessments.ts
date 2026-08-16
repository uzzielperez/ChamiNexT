import type { EmployerRole } from '../types/employer';
import type { WorkspaceTemplate } from '../components/workspace/workspaceTypes';
import { RATE_LIMITER_WORKSPACE } from './workspaceTemplates';
import { workspaceForChallenge } from './workspaceTemplates';
import { shipTestChallenges } from './shipTests';

export type CompanyAssessment = {
  roleId: string;
  companyName: string;
  roleTitle: string;
  taskTitle: string;
  taskBrief: string;
  pmBrief: string;
  ticketMarkdown: string;
  workspace: WorkspaceTemplate;
};

const COMPANY_BY_SHIP_TEST: Record<string, string> = {
  'work-ticket-rate-limiter': 'Nebula Analytics',
  'work-ticket-backtest-pit': 'Meridian Quant Research',
  'work-ticket-vwap-sim': 'Lattice Capital',
  'work-ticket-orderbook-stats': 'Lattice Capital',
  'habit-tracker-24h': 'Orbit Labs',
};

export function assessmentForRole(role: EmployerRole): CompanyAssessment | null {
  const challenge = shipTestChallenges.find((c) => c.id === role.shipTestId);
  if (!challenge) return null;

  const companyName = COMPANY_BY_SHIP_TEST[role.shipTestId] ?? 'ChamiNexT Design Partner';
  const workspace =
    challenge.format === 'ticket'
      ? workspaceForChallenge(challenge)
      : {
          ...RATE_LIMITER_WORKSPACE,
          id: challenge.id,
          title: challenge.title,
          pmBrief: challenge.pmBrief,
          ticketBrief: challenge.description,
        };

  return {
    roleId: role.id,
    companyName,
    roleTitle: role.title,
    taskTitle: challenge.title,
    taskBrief: challenge.pmBrief,
    pmBrief: challenge.pmBrief,
    ticketMarkdown: challenge.ticketBrief ?? challenge.description,
    workspace: {
      ...workspace,
      title: `${companyName}: ${challenge.title}`,
      subtitle: `${role.title} · assigned assessment`,
      pmBrief: challenge.pmBrief,
      ticketBrief: challenge.ticketBrief ?? challenge.description,
    },
  };
}

export const DEMO_ASSESSMENT_ROLE_ID = 'role-demo-assessment';

export function seedAssessmentRole(): EmployerRole {
  return {
    id: DEMO_ASSESSMENT_ROLE_ID,
    title: 'Backend Engineer',
    level: 'Mid',
    shipTestId: 'work-ticket-rate-limiter',
    assessmentType: 'both',
    softSkillsPack: true,
    createdAt: new Date().toISOString(),
  };
}
