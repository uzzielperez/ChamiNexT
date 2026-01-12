import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, ChevronRight, BookOpen, Clock, CheckCircle } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';

interface Lesson {
  id: string;
  title: string;
  content: string;
  duration?: string;
  completed?: boolean;
}

interface LessonViewerProps {
  lessons: Lesson[];
  currentLessonId?: string;
  onLessonChange?: (lessonId: string) => void;
  onComplete?: (lessonId: string) => void;
}

const LessonViewer: React.FC<LessonViewerProps> = ({
  lessons,
  currentLessonId,
  onLessonChange,
  onComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentLessonId) {
      const index = lessons.findIndex(l => l.id === currentLessonId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [currentLessonId, lessons]);

  const currentLesson = lessons[currentIndex];
  const hasNext = currentIndex < lessons.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNext = () => {
    if (hasNext) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      if (onLessonChange) {
        onLessonChange(lessons[nextIndex].id);
      }
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      if (onLessonChange) {
        onLessonChange(lessons[prevIndex].id);
      }
    }
  };

  const handleComplete = () => {
    if (onComplete && currentLesson) {
      onComplete(currentLesson.id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Lesson Header */}
      <div className="card mb-6 border-accent-blue/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-accent-blue" />
              <h2 className="text-section-header font-bold text-text-primary">
                {currentLesson?.title || 'Lesson'}
              </h2>
              {currentLesson?.completed && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
            </div>
            {currentLesson?.duration && (
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <Clock className="w-4 h-4" />
                <span>{currentLesson.duration}</span>
              </div>
            )}
          </div>
          <div className="text-sm text-text-secondary">
            Lesson {currentIndex + 1} of {lessons.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-accent-blue to-accent-purple h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / lessons.length) * 100}%` }}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <PremiumButton
            variant="secondary"
            onClick={handlePrev}
            disabled={!hasPrev}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </PremiumButton>

          <div className="flex gap-2">
            {!currentLesson?.completed && (
              <PremiumButton
                variant="secondary"
                onClick={handleComplete}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark Complete
              </PremiumButton>
            )}
          </div>

          <PremiumButton
            variant="primary"
            onClick={handleNext}
            disabled={!hasNext}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </PremiumButton>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="card flex-1 overflow-y-auto">
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-hero-headline font-bold text-text-primary mb-6 mt-8 first:mt-0" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-section-header font-bold text-text-primary mb-4 mt-8 first:mt-0" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-text-secondary mb-4 leading-relaxed" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside mb-4 space-y-2 text-text-secondary" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-inside mb-4 space-y-2 text-text-secondary" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="ml-4" {...props} />
              ),
              code: ({ node, inline, ...props }: any) => {
                if (inline) {
                  return (
                    <code className="bg-gray-800 px-2 py-1 rounded text-accent-blue text-sm font-mono" {...props} />
                  );
                }
                return (
                  <code
                    className="block bg-gray-900 p-4 rounded-lg overflow-x-auto mb-4 text-sm font-mono text-gray-300"
                    {...props}
                  />
                );
              },
              pre: ({ node, ...props }) => (
                <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-accent-blue pl-4 italic text-text-secondary my-4" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a className="text-accent-blue hover:text-accent-purple underline" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-bold text-text-primary" {...props} />
              ),
            }}
          >
            {currentLesson?.content || 'No content available'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
