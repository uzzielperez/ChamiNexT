import React from 'react';
import { ProfileData } from '../../types';

interface CVTemplateProps {
  data: ProfileData;
}

const CVTemplate: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div id="cv-template" className="p-8 bg-white text-black" style={{ width: '210mm', minHeight: '297mm' }}>
      <h1 className="text-4xl font-bold text-center mb-2">{data.fullName}</h1>
      <p className="text-center text-lg mb-8">{data.email}</p>

      <div className="mb-8">
        <h2 className="text-2xl font-bold border-b-2 border-black pb-1 mb-4">Work Experience</h2>
        {data.workExperience.map((exp, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-bold">{exp.jobTitle}</h3>
            <p className="text-lg italic">{exp.company}</p>
            <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</p>
            <p>{exp.description}</p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold border-b-2 border-black pb-1 mb-4">Education</h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-bold">{edu.institution}</h3>
            <p className="text-lg italic">{edu.degree} in {edu.fieldOfStudy}</p>
            <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold border-b-2 border-black pb-1 mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, index) => (
            <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CVTemplate;
