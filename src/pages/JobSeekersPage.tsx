import React from 'react';
import Questionnaire from '../components/jobseekers/Questionnaire';

const JobSeekersPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-gold-400 sm:text-6xl">Build Your Profile</h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
          Answer a few questions to generate a professional profile and CV that stands out.
        </p>
      </div>
      <Questionnaire />
    </div>
  );
};

export default JobSeekersPage;
