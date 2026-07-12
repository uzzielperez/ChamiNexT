import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, Flame, BookOpen, Code2, Rocket } from 'lucide-react';
import PremiumButton from '../components/ui/PremiumButton';
import LessonAudioPlayer from '../components/skills/LessonAudioPlayer';
import { getDailyProblem } from '../data/loadQuestionBank';
import { getLessonByLeafId } from '../data/loadLessons';
import { shipTestChallenges } from '../data/shipTests';
import { loadCoachProfile } from '../utils/coachStorage';
import { getCurrentDailyLeaf } from '../utils/skillProgress';
import {
  completeDailyStep,
  dailyProgressPercent,
  loadDailyState,
  type DailySteps,
} from '../utils/dailyStorage';

const DailyPracticePage: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState(loadDailyState);
  const profile = loadCoachProfile();
  const voice = profile?.voicePreference ?? 'male';
  const dailyLeaf = useMemo(() => getCurrentDailyLeaf(), [state.steps.warm]);
  const lesson = dailyLeaf ? getLessonByLeafId(dailyLeaf.leafId) : null;
  const problem = useMemo(() => getDailyProblem(), []);
  const microShip = useMemo(
    () => shipTestChallenges.find((c) => c.format === '24h') ?? shipTestChallenges[0],
    []
  );

  const progress = dailyProgressPercent(state.steps);

  const mark = (step: keyof DailySteps) => {
    setState(completeDailyStep(step));
  };

  const StepRow = ({
    done,
    icon,
    title,
    children,
    onComplete,
    cta,
  }: {
    done: boolean;
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    onComplete: () => void;
    cta?: React.ReactNode;
  }) => (
    <div
      className={`p-5 rounded-[var(--radius-card)] border ${
        done ? 'border-accent-blue/50 bg-accent-blue/5' : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'
      }`}
    >
      <div className="flex items-start gap-3">
        {done ? (
          <CheckCircle className="w-6 h-6 text-accent-blue shrink-0" />
        ) : (
          <Circle className="w-6 h-6 text-text-secondary shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold flex items-center gap-2 text-text-primary">
            {icon}
            {title}
          </h3>
          <div className="text-text-secondary text-sm mt-2">{children}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {cta}
            {!done && (
              <PremiumButton variant="outline" size="sm" onClick={onComplete}>
                Mark done
              </PremiumButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg pb-28">
      <div className="text-center mb-8">
        <p className="text-sm text-accent-blue font-medium uppercase tracking-wide">Daily practice</p>
        <h1 className="text-2xl font-bold text-text-primary mt-1">~15 minutes</h1>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div
            className="relative w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(var(--accent-blue) ${progress * 3.6}deg, var(--bg-tertiary) 0)`,
            }}
          >
            <div className="absolute inset-2 rounded-full bg-[var(--bg-primary)] flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-text-primary">{progress}%</span>
              <span className="text-xs text-text-secondary">today</span>
            </div>
          </div>
          <div className="text-left">
            <p className="flex items-center gap-2 text-lg font-bold text-text-primary">
              <Flame className="w-5 h-5 text-orange-400" />
              {state.streak} day streak
            </p>
            <p className="text-sm text-text-secondary">Listen → Problem → Ship micro</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <StepRow
          done={state.steps.warm}
          icon={<BookOpen className="w-4 h-4" />}
          title="Coach lesson"
          onComplete={() => mark('warm')}
          cta={
            dailyLeaf && lesson ? (
              <Link to="/skills">
                <PremiumButton variant="secondary" size="sm">
                  Full skill tree
                </PremiumButton>
              </Link>
            ) : (
              <Link to="/coach">
                <PremiumButton variant="secondary" size="sm">
                  Set up with Coach
                </PremiumButton>
              </Link>
            )
          }
        >
          {dailyLeaf && lesson ? (
            <>
              <p className="font-medium text-text-primary mb-3">{lesson.title}</p>
              <LessonAudioPlayer
                leafId={dailyLeaf.leafId}
                title={lesson.title}
                voicePreference={voice}
                compact
                onListenComplete={() => !state.steps.warm && mark('warm')}
              />
            </>
          ) : (
            <>
              <p className="font-medium text-text-primary">No skill path yet</p>
              <p className="mt-1">Talk to Coach to unlock your daily voice lesson.</p>
            </>
          )}
        </StepRow>

        <StepRow
          done={state.steps.problem}
          icon={<Code2 className="w-4 h-4" />}
          title="Today's problem"
          onComplete={() => mark('problem')}
          cta={
            <PremiumButton
              variant="primary"
              size="sm"
              onClick={() => navigate('/practice', { state: { problemId: problem.id } })}
            >
              Start interview
            </PremiumButton>
          }
        >
          <p className="font-medium text-text-primary">{problem.title}</p>
          <p className="capitalize text-xs text-accent-blue">
            {problem.track} · {problem.domain} · ~{problem.estimatedMinutes}m
          </p>
          <p className="mt-1 line-clamp-3">{problem.prompt}</p>
        </StepRow>

        <StepRow
          done={state.steps.ship}
          icon={<Rocket className="w-4 h-4" />}
          title="Ship micro-task"
          onComplete={() => mark('ship')}
          cta={
            <PremiumButton
              variant="secondary"
              size="sm"
              onClick={() => navigate('/practice', { state: { view: 'ship-lobby' } })}
            >
              Ship Tests
            </PremiumButton>
          }
        >
          <p className="font-medium text-text-primary">{microShip?.title}</p>
          <p className="mt-1">{microShip?.description}</p>
        </StepRow>
      </div>

      <p className="text-center text-xs text-text-secondary mt-8">
        Run <code className="text-accent-blue">npm run lessons:generate</code> with ELEVENLABS_API_KEY to
        batch voice audio for all leaves.
      </p>
    </div>
  );
};

export default DailyPracticePage;
