import React from 'react';
import { MapPin, DollarSign, Clock } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  postedAt: string;
  logo: string;
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  location,
  salary,
  tags,
  postedAt,
  logo,
}) => (
  <Card className="h-full transition-all duration-300 hover:border-purple-500/50" hoverable>
    <Card.Body>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-md flex items-center justify-center bg-white/10">
          <img src={logo} alt={company} className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-gray-400 mt-1">{company}</p>
          
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
            <div className="flex items-center">
              <MapPin size={16} className="mr-1" />
              {location}
            </div>
            <div className="flex items-center">
              <DollarSign size={16} className="mr-1" />
              {salary}
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              {postedAt}
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" size="sm">{tag}</Badge>
            ))}
          </div>
        </div>
      </div>
    </Card.Body>
    <Card.Footer className="flex justify-between items-center">
      <Button variant="ghost" size="sm">Save</Button>
      <Button variant="primary" size="sm">Apply Now</Button>
    </Card.Footer>
  </Card>
);

const JobsSection: React.FC = () => {
  const jobs = [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp",
      location: "Remote",
      salary: "$120k - $150k",
      tags: ["React", "TypeScript", "Redux", "Next.js"],
      postedAt: "2 days ago",
      logo: "https://via.placeholder.com/40"
    },
    {
      title: "Full Stack Engineer",
      company: "InnovateX",
      location: "San Francisco, CA",
      salary: "$130k - $160k",
      tags: ["Node.js", "React", "PostgreSQL", "AWS"],
      postedAt: "1 week ago",
      logo: "https://via.placeholder.com/40"
    },
    {
      title: "DevOps Engineer",
      company: "CloudScale",
      location: "Remote",
      salary: "$140k - $170k",
      tags: ["Kubernetes", "Docker", "CI/CD", "Terraform"],
      postedAt: "3 days ago",
      logo: "https://via.placeholder.com/40"
    }
  ];

  return (
    <section className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Featured job opportunities
          </h2>
          <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">
            Connect with top companies looking for talented developers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job, index) => (
            <JobCard key={index} {...job} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg">
            View All Jobs
          </Button>
        </div>
      </div>
    </section>
  );
};

export default JobsSection;