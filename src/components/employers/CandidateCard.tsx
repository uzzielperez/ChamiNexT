import React from 'react';
import { Briefcase, Code, ExternalLink } from 'lucide-react';
import Button from '../common/Button';

interface Candidate {
  name: string;
  role: string;
  avatarUrl: string;
  skills: string[];
  portfolioUrl: string;
}

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
      <div className="flex items-center mb-4">
        <img src={candidate.avatarUrl} alt={candidate.name} className="w-16 h-16 rounded-full mr-4" />
        <div>
          <h3 className="text-xl font-bold">{candidate.name}</h3>
          <p className="text-gray-400">{candidate.role}</p>
        </div>
      </div>
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2 flex items-center">
          <Code className="w-5 h-5 mr-2" />
          Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {candidate.skills.map((skill) => (
            <span key={skill} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-auto">
        <Button
          onClick={() => window.open(candidate.portfolioUrl, '_blank')}
          fullWidth
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          View Portfolio
        </Button>
      </div>
    </div>
  );
};

export default CandidateCard;
