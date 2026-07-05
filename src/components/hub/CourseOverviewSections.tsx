import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import LessonViewer from '../courses/LessonViewer';
import type { Course } from '../../data/products';

export interface CourseLesson {
  id: string;
  title: string;
  content: string;
  duration?: string;
  completed?: boolean;
}

interface CourseOverviewSectionsProps {
  course: Course | undefined;
  lessons: CourseLesson[];
  activeTab: 'lessons' | 'overview';
  currentLessonId: string;
  onSelectLesson: (id: string) => void;
  onGoToLessons: () => void;
  onLessonChange: (id: string) => void;
  onComplete: (id: string) => void;
}

const CourseOverviewSections: React.FC<CourseOverviewSectionsProps> = ({
  course,
  lessons,
  activeTab,
  currentLessonId,
  onSelectLesson,
  onGoToLessons,
  onLessonChange,
  onComplete,
}) => (
  <>
    {activeTab === 'overview' && (
      <div className="hub-catalog-card">
        <h2 className="text-lg font-bold text-text-primary mb-6">Course overview</h2>

        <div className="mb-8">
          <p className="hub-section-label">What you&apos;ll learn</p>
          <ul className="space-y-3">
            {course?.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-text-secondary text-sm">
                <CheckCircle2 className="w-5 h-5 text-accent-bright shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="hub-section-label">Modules</p>
          <div className="space-y-2">
            {lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                type="button"
                className="hub-row w-full text-left border-0 cursor-pointer"
                onClick={() => {
                  onGoToLessons();
                  onSelectLesson(lesson.id);
                }}
              >
                <div className="hub-icon-tile text-sm font-bold">{index + 1}</div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-text-primary text-sm">{lesson.title}</h4>
                  {lesson.duration && (
                    <p className="text-xs text-text-secondary mt-0.5">{lesson.duration}</p>
                  )}
                </div>
                {lesson.completed && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    )}

    {activeTab === 'lessons' && (
      <div className="min-h-[480px]">
        <LessonViewer
          lessons={lessons}
          currentLessonId={currentLessonId}
          onLessonChange={onLessonChange}
          onComplete={onComplete}
        />
      </div>
    )}
  </>
);

export default CourseOverviewSections;
