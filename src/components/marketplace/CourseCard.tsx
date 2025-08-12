import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import Button from '../common/Button';

interface Course {
  name: string;
  description: string;
  url: string;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
      <div className="flex items-center mb-4">
        <BookOpen className="w-8 h-8 mr-4 text-gold-400" />
        <h3 className="text-xl font-bold">{course.name}</h3>
      </div>
      <p className="text-gray-400 mb-4">{course.description}</p>
      <div className="mt-auto">
        <Button
          onClick={() => window.open(course.url, '_blank')}
          fullWidth
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          View Course
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;
