import React, { useState } from 'react';
import Questionnaire from '../components/jobseekers/Questionnaire';
import { Document, Page } from 'react-pdf';
import { parseCV } from '../utils/cvParser';


const JobSeekersPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedText, setParsedText] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const text = await parseCV(file);
        setParsedText(text);
      } catch (error) {
        console.error('Error parsing CV:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-gold-400 sm:text-6xl">Build Your Profile</h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
          Answer a few questions to generate a professional profile and CV that stands out.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-4">Upload Your CV</h2>
        <div className="flex items-center">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold-500 file:text-black hover:file:bg-gold-600"
          />
          <Button onClick={handleUpload} disabled={!file} className="ml-4">
            Upload
          </Button>
        </div>
      </div>

      <Questionnaire parsedText={parsedText} />
    </div>
  );
};

export default JobSeekersPage;
