import React from 'react';
import { Code, Briefcase, ShoppingBag } from 'lucide-react';
import Card from '../common/Card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <Card className="h-full" hoverable>
    <Card.Body>
      <div className="p-3 rounded-lg bg-white/5 inline-flex mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </Card.Body>
  </Card>
);

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Code className="h-6 w-6 text-purple-500" />,
      title: "For Developers",
      description: "Create a stunning profile, showcase your skills, and get discovered by top companies looking for your exact talents."
    },
    {
      icon: <Briefcase className="h-6 w-6 text-blue-500" />,
      title: "For Employers",
      description: "Find pre-vetted developers with verified skills. Post jobs and connect with the perfect candidates for your needs."
    },
    {
      icon: <ShoppingBag className="h-6 w-6 text-green-500" />,
      title: "Digital Marketplace",
      description: "Sell your code, templates, tools, and digital products to a global audience of developers and companies."
    }
  ];

  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            A complete ecosystem for developers and employers
          </h2>
          <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to advance your career or build your dream team
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;