import React from 'react';
import { Code, Timer, Trophy, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

interface ChallengeCardProps {
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeEstimate: string;
  description: string;
  category: string;
  participants: number;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  title,
  difficulty,
  timeEstimate,
  description,
  category,
  participants,
}) => {
  const difficultyMap = {
    easy: { color: 'success', label: 'Easy' },
    medium: { color: 'warning', label: 'Medium' },
    hard: { color: 'error', label: 'Hard' },
  };

  return (
    <Card className="h-full transition-all duration-300 hover:border-purple-500/50" hoverable>
      <Card.Body>
        <div className="flex justify-between items-start mb-4">
          <Badge variant={difficultyMap[difficulty].color as any}>
            {difficultyMap[difficulty].label}
          </Badge>
          <div className="flex items-center text-gray-400 text-sm">
            <Timer size={16} className="mr-1" />
            {timeEstimate}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center text-gray-400">
            <Code size={16} className="mr-1 text-purple-500" />
            {category}
          </div>
          <div className="flex items-center text-gray-400">
            <Trophy size={16} className="mr-1 text-amber-500" />
            {participants} participants
          </div>
        </div>
      </Card.Body>
      <Card.Footer>
        <Button variant="primary" fullWidth>
          Start Challenge
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </Card.Footer>
    </Card>
  );
};

const ChallengesSection: React.FC = () => {
  const challenges = [
    {
      title: "Build a Real-time Chat Application",
      difficulty: "medium" as const,
      timeEstimate: "2-4 hours",
      description: "Create a real-time chat application using WebSockets with features like user authentication, message history, and typing indicators.",
      category: "Full Stack",
      participants: 1245
    },
    {
      title: "Optimize SQL Database Queries",
      difficulty: "hard" as const,
      timeEstimate: "1-2 hours",
      description: "Optimize a set of complex SQL queries for a large database to improve performance by at least 50%.",
      category: "Database",
      participants: 867
    },
    {
      title: "Build a Responsive Landing Page",
      difficulty: "easy" as const,
      timeEstimate: "1-2 hours",
      description: "Create a responsive landing page from a design mockup using HTML, CSS, and minimal JavaScript.",
      category: "Frontend",
      participants: 2134
    },
    {
      title: "Implement a Sorting Algorithm",
      difficulty: "medium" as const,
      timeEstimate: "1-2 hours",
      description: "Implement and optimize a custom sorting algorithm for a specific data structure with O(n log n) time complexity.",
      category: "Algorithms",
      participants: 1756
    }
  ];

  return (
    <section className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Challenge yourself, prove your skills
          </h2>
          <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">
            Tackle real-world coding challenges and showcase your abilities to employers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {challenges.map((challenge, index) => (
            <ChallengeCard key={index} {...challenge} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg">
            View All Challenges
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;