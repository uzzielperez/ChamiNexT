export interface SpendingItem {
  category: string;
  amount: number;
  color: string;
}

export interface CalendarDensityItem {
  day: string;
  meetings: number;
  hours: number;
}

export interface CashFlowItem {
  month: string;
  income: number;
  expenses: number;
}

export interface HabitItem {
  name: string;
  streak: number;
  target: number;
  completion: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  source: 'google' | 'icloud';
  isAllDay: boolean;
}

export type ProjectCategory = 'PHYSICS' | 'FINANCE' | 'HEALTH/LOVE' | 'LOGISTICS' | 'CREATIVE PROJECTS';

export interface ProjectTask {
  id: string;
  title: string;
  category: ProjectCategory;
  status: 'active' | 'completed' | 'pending';
  priority: 'low' | 'medium' | 'high';
}

export const initialTasks: ProjectTask[] = [
  { id: '1', title: 'Quantum Field Simulation Analysis', category: 'PHYSICS', status: 'active', priority: 'high' },
  { id: '2', title: 'Quarterly Portfolio Rebalancing', category: 'FINANCE', status: 'pending', priority: 'medium' },
  { id: '3', title: 'Morning Heart Rate Variability Sync', category: 'HEALTH/LOVE', status: 'active', priority: 'medium' },
  { id: '4', title: 'Route Optimization for Supply Run', category: 'LOGISTICS', status: 'completed', priority: 'low' },
  { id: '5', title: 'Holographic Interface Sketching', category: 'CREATIVE PROJECTS', status: 'active', priority: 'high' }
];

export const spendingData: SpendingItem[] = [
  { category: 'Dining', amount: 890, color: '#3b82f6' },
  { category: 'Travel', amount: 1240, color: '#8b5cf6' },
  { category: 'Shopping', amount: 450, color: '#ec4899' },
  { category: 'Utilities', amount: 320, color: '#10b981' },
  { category: 'Other', amount: 440, color: '#f59e0b' }
];

export const calendarDensity: CalendarDensityItem[] = [
  { day: 'Mon', meetings: 4, hours: 3.5 },
  { day: 'Tue', meetings: 2, hours: 1.5 },
  { day: 'Wed', meetings: 7, hours: 5.5 },
  { day: 'Thu', meetings: 3, hours: 2.0 },
  { day: 'Fri', meetings: 5, hours: 4.0 }
];

export const cashFlow: CashFlowItem[] = [
  { month: 'Oct', income: 15000, expenses: 8200 },
  { month: 'Nov', income: 15000, expenses: 9100 },
  { month: 'Dec', income: 15000, expenses: 11200 },
  { month: 'Jan', income: 15000, expenses: 8900 }
];

export const habits: HabitItem[] = [
  { name: 'Workout', streak: 5, target: 20, completion: 60 },
  { name: 'Reading', streak: 12, target: 20, completion: 85 },
  { name: 'Meditation', streak: 3, target: 20, completion: 45 }
];
