import React from 'react';
import CandidateCard from '../components/employers/CandidateCard';

const sampleCandidates = [
  {
    name: 'Alice Johnson',
    role: 'Frontend Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    portfolioUrl: '#',
  },
  {
    name: 'Bob Williams',
    role: 'Backend Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    skills: ['Node.js', 'Python', 'Go', 'PostgreSQL'],
    portfolioUrl: '#',
  },
  {
    name: 'Charlie Brown',
    role: 'Full Stack Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    skills: ['React', 'Node.js', 'GraphQL', 'AWS'],
    portfolioUrl: '#',
  },
];

const EmployersPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center">For Employers</h1>
      <p className="mt-4 text-center text-lg text-gray-400">
        Browse candidate profiles and their portfolio products.
      </p>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sampleCandidates.map((candidate) => (
          <CandidateCard key={candidate.name} candidate={candidate} />
        ))}
      </div>
    </div>
  );
};

export default EmployersPage;
