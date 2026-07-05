import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import HubQuickNav from './HubQuickNav';
import HubSegment, { type HubSegmentOption } from './HubSegment';

interface CoursePageLayoutProps {
  title: string;
  description: string;
  duration?: string;
  level?: string;
  completedCount: number;
  totalLessons: number;
  progress: number;
  tabs: HubSegmentOption[];
  activeTab: string;
  onTabChange: (id: string) => void;
  loading?: boolean;
  backTo?: string;
  children: React.ReactNode;
}

const CoursePageLayout: React.FC<CoursePageLayoutProps> = ({
  title,
  description,
  duration,
  level,
  completedCount,
  totalLessons,
  progress,
  tabs,
  activeTab,
  onTabChange,
  loading,
  backTo = '/learn',
  children,
}) => {
  if (loading) {
    return (
      <div className="hub-shell">
        <div className="hub-container">
          <HubQuickNav />
          <div className="flex flex-col items-center justify-center py-24">
            <div
              className="w-10 h-10 rounded-full border-2 border-accent-blue border-t-transparent animate-spin mb-4"
              aria-hidden
            />
            <p className="text-text-secondary text-sm">Loading course…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hub-shell">
      <div className="hub-container max-w-5xl">
        <Link to={backTo} className="hub-back-link">
          <ArrowLeft className="w-4 h-4" aria-hidden />
          Back to Learn
        </Link>
        <HubQuickNav />

        <div className="hub-highlight mb-6">
          <p className="hub-section-label mb-2">Course</p>
          <h1 className="hub-page-title">{title}</h1>
          <p className="hub-page-subtitle mb-6">{description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {duration && (
              <div className="hub-stat">
                <div className="hub-stat-label">Duration</div>
                <div className="hub-stat-value">{duration}</div>
              </div>
            )}
            {level && (
              <div className="hub-stat">
                <div className="hub-stat-label">Level</div>
                <div className="hub-stat-value capitalize">{level}</div>
              </div>
            )}
            <div className="hub-stat">
              <div className="hub-stat-label">Progress</div>
              <div className="hub-stat-value">
                {completedCount} / {totalLessons}
              </div>
            </div>
          </div>

          <div className="hub-progress-track">
            <div className="hub-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <HubSegment options={tabs} value={activeTab} onChange={onTabChange} ariaLabel="Course view" />

        {children}
      </div>
    </div>
  );
};

export default CoursePageLayout;
