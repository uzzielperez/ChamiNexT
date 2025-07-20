export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'developer' | 'employer';
  bio?: string;
  joinedAt: Date;
}

export interface Developer extends User {
  role: 'developer';
  skills: string[];
  experience: number;
  projects: Project[];
  products: Product[];
  challenges: Challenge[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface Employer extends User {
  role: 'employer';
  company: string;
  position: string;
  industry: string;
  jobs: Job[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  postedAt: Date;
  deadline: Date;
  employerId: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  previewUrl: string;
  createdAt: Date;
  developerId: string;
  sales: number;
  rating: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  developerId: string;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  category: string;
  completedAt?: Date;
  score?: number;
}