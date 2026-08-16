import { Play } from 'lucide-react';
import {
  PLATFORM_DEMO_VIDEO_DURATION_SEC,
  PLATFORM_DEMO_VIDEO_SRC,
} from '../../constants/demoVideo';

type Props = {
  title?: string;
  description?: string;
  variant?: 'default' | 'compact';
  className?: string;
};

export default function DemoVideoEmbed({
  title = 'See ChamiNext in action',
  description = 'Ship Tests, AI interview practice, and hiring signal — not another grind loop.',
  variant = 'default',
  className = '',
}: Props) {
  const compact = variant === 'compact';

  return (
    <div className={className}>
      {!compact && (
        <div className="text-center mb-6 max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-blue mb-2 flex items-center justify-center gap-2">
            <Play className="w-3.5 h-3.5" />
            {PLATFORM_DEMO_VIDEO_DURATION_SEC}s demo
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">{title}</h2>
          {description && (
            <p className="text-text-secondary text-sm mt-2 leading-relaxed">{description}</p>
          )}
        </div>
      )}

      <div
        className={`rounded-xl border border-[var(--border-color)] overflow-hidden shadow-2xl ${
          compact ? '' : 'max-w-3xl mx-auto'
        }`}
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2">ChamiNext · platform demo</span>
        </div>
        <div className="relative bg-black aspect-video">
          <video
            className="w-full h-full object-contain"
            controls
            playsInline
            preload="metadata"
            src={PLATFORM_DEMO_VIDEO_SRC}
            title={title}
          >
            Your browser does not support embedded video.{' '}
            <a href={PLATFORM_DEMO_VIDEO_SRC} className="text-accent-blue">
              Download the demo
            </a>
          </video>
        </div>
      </div>

      {compact && description && (
        <p className="text-xs text-text-secondary mt-3 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
