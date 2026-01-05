import React from 'react';
import { BookOpen, ExternalLink, Clock, TrendingUp, Lock, Star } from 'lucide-react';
import Button from '../common/Button';
import { Course } from '../../data/products';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const levelColors = {
    'beginner': 'text-green-400 bg-green-400/10 border-green-400/20',
    'intermediate': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    'advanced': 'text-red-400 bg-red-400/10 border-red-400/20'
  };

  const levelColor = levelColors[course.level];

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col border border-gray-700 hover:border-gold-500/50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-gold-400" />
          <div>
            <h3 className="text-xl font-bold text-white">{course.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${levelColor}`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {course.level}
              </div>
              {course.duration && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-gray-400 bg-gray-700 border border-gray-600">
                  <Clock className="w-3 h-3 mr-1" />
                  {course.duration}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {course.isPremium && (
          <div className="flex items-center space-x-1">
            <Lock className="w-4 h-4 text-gold-400" />
            <span className="text-xs text-gold-400 font-medium">PREMIUM</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-400 mb-4 flex-grow">{course.description}</p>

      {/* Features */}
      {course.features && course.features.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">What You'll Learn:</h4>
          <ul className="space-y-1">
            {course.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="text-xs text-gray-400 flex items-center">
                <Star className="w-3 h-3 mr-2 text-gold-400 flex-shrink-0" />
                {feature}
              </li>
            ))}
            {course.features.length > 3 && (
              <li className="text-xs text-gray-500">
                +{course.features.length - 3} more topics
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Price and Action */}
      <div className="mt-auto">
        {course.price && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-gold-400">${course.price}</span>
            <span className="text-sm text-gray-400">lifetime access</span>
          </div>
        )}
        
        <Button
          onClick={() => {
            if (course.url.startsWith('http')) {
              window.open(course.url, '_blank');
            } else {
              // Handle internal links or show coming soon
              console.log('Navigate to:', course.url);
            }
          }}
          fullWidth
          className={course.isPremium ? 'bg-gold-600 hover:bg-gold-700' : ''}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          {course.url.startsWith('http') ? 'Enroll Now' : 'Coming Soon'}
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;
