import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import ProfilePreview from './ProfilePreview';

interface WorkExperience {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

interface Skills {
  name: string;
}

interface QuestionnaireProps {
  parsedText: string | null;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ parsedText }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('questionnaireData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      fullName: '',
      email: '',
      workExperience: [{ jobTitle: '', company: '', startDate: '', endDate: '', description: '' }],
      education: [{ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }],
      skills: [{ name: '' }],
    };
  });

  useEffect(() => {
    localStorage.setItem('questionnaireData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (parsedText) {
      const lines = parsedText.split('\n');
      
      // Very basic parsing logic, this can be greatly improved
      const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
      const email = parsedText.match(emailRegex)?.[0] || '';
      
      // Assuming the name is the first line
      const fullName = lines[0] || '';

      // Simple skills extraction
      const skillsSection = parsedText.match(/skills\s*([\s\S]*?)(experience|education)/i);
      const skills = skillsSection ? skillsSection[1].split('\n').filter(s => s.trim() !== '').map(name => ({ name })) : [];

      setFormData(prevData => ({
        ...prevData,
        fullName: fullName || prevData.fullName,
        email: email || prevData.email,
        skills: skills.length > 0 ? skills : prevData.skills,
      }));
    }
  }, [parsedText]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleWorkExperienceChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newWorkExperience = [...formData.workExperience];
    newWorkExperience[index] = { ...newWorkExperience[index], [name]: value };
    setFormData({ ...formData, workExperience: newWorkExperience });
  };

  const addWorkExperience = () => {
    setFormData({
      ...formData,
      workExperience: [
        ...formData.workExperience,
        { jobTitle: '', company: '', startDate: '', endDate: '', description: '' },
      ],
    });
  };

  const removeWorkExperience = (index: number) => {
    const newWorkExperience = [...formData.workExperience];
    newWorkExperience.splice(index, 1);
    setFormData({ ...formData, workExperience: newWorkExperience });
  };

  const handleEducationChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newEducation = [...formData.education];
    newEducation[index] = { ...newEducation[index], [name]: value };
    setFormData({ ...formData, education: newEducation });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' },
      ],
    });
  };

  const removeEducation = (index: number) => {
    const newEducation = [...formData.education];
    newEducation.splice(index, 1);
    setFormData({ ...formData, education: newEducation });
  };

  const handleSkillChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newSkills = [...formData.skills];
    newSkills[index] = { ...newSkills[index], [name]: value };
    setFormData({ ...formData, skills: newSkills });
  };

  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, { name: '' }],
    });
  };

  const removeSkill = (index: number) => {
    const newSkills = [...formData.skills];
    newSkills.splice(index, 1);
    setFormData({ ...formData, skills: newSkills });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log(formData);
    // CV generation logic will go here
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Work Experience</h2>
            {formData.workExperience.map((exp, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-700 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`jobTitle-${index}`} className="block text-sm font-medium text-gray-300">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      id={`jobTitle-${index}`}
                      value={exp.jobTitle}
                      onChange={(e) => handleWorkExperienceChange(index, e)}
                      className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor={`company-${index}`} className="block text-sm font-medium text-gray-300">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      id={`company-${index}`}
                      value={exp.company}
                      onChange={(e) => handleWorkExperienceChange(index, e)}
                      className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor={`startDate-${index}`} className="block text-sm font-medium text-gray-300">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      id={`startDate-${index}`}
                      value={exp.startDate}
                      onChange={(e) => handleWorkExperienceChange(index, e)}
                      className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor={`endDate-${index}`} className="block text-sm font-medium text-gray-300">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      id={`endDate-${index}`}
                      value={exp.endDate}
                      onChange={(e) => handleWorkExperienceChange(index, e)}
                      className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id={`description-${index}`}
                    value={exp.description}
                    onChange={(e) => handleWorkExperienceChange(index, e)}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
                  />
                </div>
                {formData.workExperience.length > 1 && (
                  <div className="mt-4 flex justify-end">
                    <Button onClick={() => removeWorkExperience(index)} variant="danger" size="sm">
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <Button onClick={addWorkExperience} variant="outline">
              Add Work Experience
            </Button>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Education</h2>
            {formData.education.map((edu, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-700 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`institution-${index}`} className="block text-sm font-medium text-gray-300">
                      Institution
                    </label>
                    <input
                      type="text"
                      name="institution"
                      id={`institution-${index}`}
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor={`degree-${index}`} className="block text-sm font-medium text-gray-300">
                      Degree
                    </label>
                    <input
                      type="text"
                      name="degree"
                      id={`degree-${index}`}
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor={`fieldOfStudy-${index}`} className="block text-sm font-medium text-gray-300">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      name="fieldOfStudy"
                      id={`fieldOfStudy-${index}`}
                      value={edu.fieldOfStudy}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor={`eduStartDate-${index}`} className="block text-sm font-medium text-gray-300">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      id={`eduStartDate-${index}`}
                      value={edu.startDate}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor={`eduEndDate-${index}`} className="block text-sm font-medium text-gray-300">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      id={`eduEndDate-${index}`}
                      value={edu.endDate}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
                    />
                  </div>
                </div>
                {formData.education.length > 1 && (
                  <div className="mt-4 flex justify-end">
                    <Button onClick={() => removeEducation(index)} variant="danger" size="sm">
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <Button onClick={addEducation} variant="outline">
              Add Education
            </Button>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Skills</h2>
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  name="name"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(index, e)}
                  className="block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm"
                  placeholder="e.g. React, Node.js, etc."
                />
                {formData.skills.length > 1 && (
                  <button
                    onClick={() => removeSkill(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <Button onClick={addSkill} variant="outline" className="mt-2">
              Add Skill
            </Button>
          </div>
        );
      default:
        return <ProfilePreview data={formData} onEdit={() => setStep(1)} />;
    }
  };

  const totalSteps = 5;

  return (
    <div className="max-w-4xl mx-auto">
      {step <= totalSteps && (
        <div className="mb-8">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gold-600 bg-gold-200">
                  Step {step} of {totalSteps}
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gold-200">
              <div style={{ width: `${(step / totalSteps) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gold-500"></div>
            </div>
          </div>
        </div>
      )}
      {renderStep()}
      {step <= totalSteps && (
        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <Button onClick={prevStep} variant="outline">
              Previous
            </Button>
          )}
          {step < totalSteps && (
            <Button onClick={nextStep}>
              Next
            </Button>
          )}
          {step === totalSteps && (
            <Button onClick={handleSubmit}>
              Preview Profile
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Questionnaire;
