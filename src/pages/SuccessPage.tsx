import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../components/common/Button';
import { generateCV } from '../utils/cvGenerator';
import CVTemplate from '../components/jobseekers/CVTemplate';
import { ProfileData } from '../types';

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const [data, setData] = useState<ProfileData | null>(null);
  const [showCV, setShowCV] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const dataParam = searchParams.get('data');
    if (dataParam) {
      setData(JSON.parse(decodeURIComponent(dataParam)));
    }
  }, [location.search]);

  const handleDownload = () => {
    if (data) {
      setShowCV(true);
      setTimeout(() => {
        generateCV(data);
        setShowCV(false);
      }, 100);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-lg mb-8">You can now download your CV.</p>
      <Button onClick={handleDownload} disabled={!data}>Download CV</Button>

      {showCV && data && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <CVTemplate data={data} />
        </div>
      )}
    </div>
  );
};

export default SuccessPage;
