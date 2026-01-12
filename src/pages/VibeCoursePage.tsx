import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LessonViewer from '../components/courses/LessonViewer';
import PremiumTabs from '../components/ui/PremiumTabs';
import AuroraBackground from '../components/ui/AuroraBackground';
import { BookOpen, ArrowLeft, Play, CheckCircle2 } from 'lucide-react';
import PremiumButton from '../components/ui/PremiumButton';
import { courses } from '../data/products';

interface Lesson {
  id: string;
  title: string;
  content: string;
  duration?: string;
  completed?: boolean;
}

const VibeCoursePage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId?: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'lessons' | 'overview'>('lessons');

  const course = courses.find(c => c.name === 'Vibe Coding: Intuitive Development');

  // Lesson content embedded
  const lessonContent = {
    'module-0': `# Module 0 — Setup & Foundations

Duration: 30–45 minutes

## Objective
Get the environment ready, learn the starter repo layout, and ship the first static visual so learners can iterate quickly.

## Learning outcomes
- Install dependencies and run the dev server
- Understand project structure and where to add components
- Create a simple, responsive hero section as the first visual

## Prerequisites
- Node.js (16+) and npm or yarn
- Basic familiarity with React

## Starter options
- Option A: Use the course starter in \`courses/vibe-starter\` (recommended for quick start)
- Option B: Use the main repo (ChamiNexT) and add a lesson page under \`src/pages/\`

## Setup (using the starter)

\`\`\`bash
cd courses/vibe-starter
npm install
npm run dev
\`\`\`

Open \`http://localhost:5173\` (default Vite port).

## Starter repo layout (what to look for)
- \`index.html\` — app entry
- \`src/main.jsx\` — client bootstrap
- \`src/App.jsx\` — top-level demo component
- \`src/styles.css\` — simple styles

## Exercise 0.1 — Create the static hero
1. Open \`src/App.jsx\` and replace placeholder text with a full-bleed hero.
2. Add a centered title, short subtitle, and a CTA button.
3. Make it responsive using simple CSS (flexbox + min-height: 100vh).

Deliverable: a static hero that renders in the browser and commits to Git.

## Exercise 0.2 — Commit & prepare for Day 1
- Create a short README entry describing the chosen project scope (Interactive Hero / Particle Playground / Shader Banner).
- Push commits and open a PR if using GitHub.

## Troubleshooting
- If port conflicts occur, change the \`vite\` port by setting \`PORT\` or using \`npm run dev -- --port 5174\`.
- If using the main repo, run \`npm install\` in the workspace root.

## Next
Proceed to Module 1 to add motion, easing, and accessible animation patterns.`,
    'module-1': `# Module 1 — Visuals & Motion Basics

Duration: 1.5–2 hours

## Objective
Introduce motion techniques to give UI a clear "vibe": CSS transforms, transitions, keyframe animations, easing, and accessible motion.

## Learning outcomes
- Use transforms and transitions for smooth state changes
- Build keyframe animations and control timing functions
- Respect \`prefers-reduced-motion\` and optimize for performance
- Integrate simple motion into React components

## Concepts
- Transform vs. layout: use \`transform\` (translate/scale/rotate) for performant motion
- Transition properties: \`transition-property\`, \`duration\`, \`timing-function\`, \`delay\`
- Easing: \`ease\`, \`ease-in-out\`, cubic-bezier, and custom curves
- Keyframes for sequenced animations
- Motion preferences: \`@media (prefers-reduced-motion: reduce)\`

## Quick examples

### CSS transition (hover scale)

\`\`\`css
.card {
  transition: transform 240ms cubic-bezier(.22,.9,.29,1), box-shadow 240ms;
}
.card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 30px rgba(2,6,23,0.6);
}
\`\`\`

### Keyframe pulse

\`\`\`css
@keyframes pulse { to { transform: scale(1.05); opacity: .95 } }
.pulse { animation: pulse 950ms ease-in-out infinite alternate; }
\`\`\`

### Prefers-reduced-motion

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  .pulse, .animated { animation: none !important; transition: none !important; }
}
\`\`\`

### React example — subtle button press

\`\`\`jsx
import React from 'react'
import './motion.css'

export default function PressableButton({ children }) {
  return (
    <button className="pressable" onMouseDown={() => {}}>{children}</button>
  )
}
\`\`\`

motion.css

\`\`\`css
.pressable { transition: transform 160ms cubic-bezier(.2,.8,.2,1); }
.pressable:active { transform: translateY(2px) scale(.995); }
\`\`\`

## Exercise 1.1 — Convert a static hero to animated
- Add a subtle entrance animation to the hero title: fade in + slide up using keyframes or CSS transition triggered by a \`mounted\` class.
- Respect \`prefers-reduced-motion\`.

Hints:
- Use \`opacity\` + \`transform: translateY(18px)\` to avoid layout thrashing.
- Toggle a \`mounted\` class from a small \`useEffect\` in React.

## Exercise 1.2 — Build a motion utility
- Create a small utility CSS file (\`src/courses/vibe/examples/motion-utils.css\`) with a set of reusable classes: \`.fade-up\`, \`.stagger-child\`, \`.scale-on-hover\`, and \`.reduced-motion-safe\`.
- Apply them to components in \`courses/vibe-starter/src/App.jsx\` and commit.

## Mini-challenge (30–45 min)
- Implement a small animated card grid: cards lift on hover, have subtle entrance staggering, and pause animations when \`prefers-reduced-motion\` is set.

## Deliverables
- Updated \`courses/vibe-starter\` with motion utilities
- A short notes file in \`tasks/lessons/vibe/notes-module-1.md\` describing choices and accessibility considerations

## Next
We'll cover Canvas basics and a simple particle system in Module 2. If you'd like, I can implement the motion utilities in the starter now and update \`courses/vibe-starter/src/App.jsx\` with examples.`,
    'sprint-plan': `# Vibe Course — 1–3 Day Sprint Plan

## Purpose
A compact project plan a learner can complete in 1–3 days to build and deploy a small interactive web piece demonstrating the "vibe" techniques taught in the course.

## Project Choices (pick one)
- Interactive Hero (recommended): animated hero section with pointer-reactive effects and CTA
- Particle Playground: canvas-based particle system with controls (count, color, gravity)
- Shader Banner: single fragment shader integrated in a React component with fallback

## Day-by-day Milestones
- Day 1 — Setup & Core Visuals (3–5 hrs)
  - Clone starter repo and install dependencies
  - Scaffold page and layout
  - Implement base visuals (static hero, canvas, or shader integration)
  - Commit progress and open PR
- Day 2 — Interaction & Polish (3–6 hrs)
  - Add pointer/touch interactions and UI controls
  - Improve timing, easing, and accessibility (motion preference)
  - Add responsive styles and basic performance tuning
- Day 3 — Finalize & Deploy (2–4 hrs)
  - Prepare production build and README
  - Deploy to Netlify (or chosen host) and configure domain/SSL
  - Record a short demo (20–60s) or take screenshots

## Quick start (assumes repo uses npm)

\`\`\`bash
npm install
npm run dev
\`\`\`

- Build for production:

\`\`\`bash
npm run build
\`\`\`

- Deploy: connect repo to Netlify or run \`netlify deploy\` as preferred.

## Checklist
- [ ] Pick project scope and create issue
- [ ] Complete Day 1 tasks and push code
- [ ] Complete Day 2 tasks and add README usage instructions
- [ ] Deploy and capture demo
- [ ] Submit final repo + deployed URL

## Deliverables
- Git repo with commits and README
- Deployed URL
- Demo screenshot or short video`
  };

  // Load lesson content
  useEffect(() => {
    setLoading(true);
    
    const loadedLessons: Lesson[] = [
      {
        id: 'module-0',
        title: 'Module 0 — Setup & Foundations',
        content: lessonContent['module-0'],
        duration: '30–45 minutes',
        completed: false
      },
      {
        id: 'module-1',
        title: 'Module 1 — Visuals & Motion Basics',
        content: lessonContent['module-1'],
        duration: '1.5–2 hours',
        completed: false
      },
      {
        id: 'sprint-plan',
        title: '1–3 Day Sprint: Build & Deploy',
        content: lessonContent['sprint-plan'],
        duration: '1–3 days',
        completed: false
      }
    ];

    setLessons(loadedLessons);

    // Set current lesson from URL or default to first
    if (lessonId) {
      const lessonExists = loadedLessons.find(l => l.id === lessonId);
      if (lessonExists) {
        setCurrentLessonId(lessonId);
      } else {
        setCurrentLessonId(loadedLessons[0]?.id || '');
      }
    } else {
      setCurrentLessonId(loadedLessons[0]?.id || '');
    }
    
    setLoading(false);
  }, [lessonId]);

  const handleLessonChange = (id: string) => {
    setCurrentLessonId(id);
    navigate(`/courses/vibe-coding/${id}`, { replace: true });
  };

  const handleComplete = (id: string) => {
    setLessons(prev => prev.map(lesson =>
      lesson.id === id ? { ...lesson, completed: true } : lesson
    ));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'lessons', label: 'Lessons', icon: <Play className="w-4 h-4" /> }
  ];

  const completedCount = lessons.filter(l => l.completed).length;
  const progress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-dark text-text-primary relative overflow-hidden">
        <AuroraBackground opacity={0.6} speed={1.0} />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading course content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-dark text-text-primary relative overflow-hidden">
      <AuroraBackground opacity={0.6} speed={1.0} />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <PremiumButton
            variant="secondary"
            onClick={() => navigate('/marketplace')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </PremiumButton>

          <div className="card border-accent-blue/20 mb-6">
            <h1 className="text-hero-headline font-bold text-text-primary mb-4">
              {course?.name || 'Vibe Coding: Intuitive Development'}
            </h1>
            <p className="text-subheadline text-text-secondary mb-6">
              {course?.description}
            </p>

            {/* Course Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="text-sm text-text-secondary mb-1">Duration</div>
                <div className="text-xl font-bold text-text-primary">{course?.duration}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="text-sm text-text-secondary mb-1">Level</div>
                <div className="text-xl font-bold text-text-primary capitalize">{course?.level}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="text-sm text-text-secondary mb-1">Progress</div>
                <div className="text-xl font-bold text-text-primary">
                  {completedCount} / {lessons.length} lessons
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-accent-blue to-accent-purple h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <PremiumTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={(tabId) => setActiveTab(tabId as 'lessons' | 'overview')}
            />
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="card">
            <h2 className="text-section-header font-bold text-text-primary mb-6">Course Overview</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-text-primary mb-4">What You'll Learn</h3>
              <ul className="space-y-3">
                {course?.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-text-secondary">
                    <CheckCircle2 className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-text-primary mb-4">Course Modules</h3>
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-accent-blue/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setActiveTab('lessons');
                      handleLessonChange(lesson.id);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-text-primary">{lesson.title}</h4>
                          {lesson.duration && (
                            <p className="text-sm text-text-secondary">{lesson.duration}</p>
                          )}
                        </div>
                      </div>
                      {lesson.completed && (
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="min-h-[600px]">
            <LessonViewer
              lessons={lessons}
              currentLessonId={currentLessonId}
              onLessonChange={handleLessonChange}
              onComplete={handleComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VibeCoursePage;
