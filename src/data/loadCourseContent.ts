import courseMap from '../../content/course-map.json';
import projectStarters from '../../content/projects/starters.json';

export interface DailyBite {
  id: string;
  courseId: string;
  title: string;
  excerpt: string;
  lessonLink: string;
}

export interface CourseEntry {
  id: string;
  title: string;
  path: string;
  modules: string[];
}

export interface ProjectStarter {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  shipTestId: string;
  tags: string[];
}

const map = courseMap as {
  courses: CourseEntry[];
  dailyBites: DailyBite[];
};

export const courses = map.courses;
export const dailyBites = map.dailyBites;
export const projectStartersList = projectStarters as ProjectStarter[];

export function getDailyBite(dateKey?: string): DailyBite {
  const key = dateKey ?? new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return dailyBites[hash % dailyBites.length];
}
