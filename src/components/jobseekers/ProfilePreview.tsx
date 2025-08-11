import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import CVTemplate from './CVTemplate';
import { ProfileData } from '../../types';

interface ProfilePreviewProps {
  data: ProfileData;
  onEdit: () => void;
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({ data, onEdit }) => {
  const [showCV, setShowCV] = useState(false);
  const navigate = useNavigate();

  const handleDownload = () => {
    navigate('/payment', { state: { data } });
  };

  return (
    <div className="p-8 bg-gray-900 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gold-400">Profile Preview</h2>
        <div>
          <Button onClick={onEdit} variant="outline" className="mr-4">Edit</Button>
          <Button onClick={handleDownload}>Download CV</Button>
        </div>
      </div>
      
      {/* Personal Info */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2 text-gold-300">Personal Information</h3>
        <p><span className="font-bold">Name:</span> {data.fullName}</p>
        <p><span className="font-bold">Email:</span> {data.email}</p>
      </div>

      {/* Work Experience */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2 text-gold-300">Work Experience</h3>
        {data.workExperience.map((exp, index) => (
          <div key={index} className="mb-4">
            <h4 className="text-xl font-bold">{exp.jobTitle}</h4>
            <p className="text-lg">{exp.company}</p>
            <p className="text-sm text-gray-400">{exp.startDate} - {exp.endDate}</p>
            <p>{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2 text-gold-300">Education</h3>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <h4 className="text-xl font-bold">{edu.institution}</h4>
            <p className="text-lg">{edu.degree} in {edu.fieldOfStudy}</p>
            <p className="text-sm text-gray-400">{edu.startDate} - {edu.endDate}</p>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div>
        <h3 className="text-2xl font-semibold mb-2 text-gold-300">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, index) => (
            <span key={index} className="bg-gold-500 text-black px-3 py-1 rounded-full text-sm">
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      {showCV && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <CVTemplate data={data} />
        </div>
      )}
    </div>
  );
};

export default ProfilePreview;
