import React from 'react';
import type { VoicePreference } from '../../types/coach';
import { User, UserCircle } from 'lucide-react';
import VoicePreviewButton from './VoicePreviewButton';

interface VoicePreferencePickerProps {
  value: VoicePreference;
  onChange: (v: VoicePreference) => void;
}

const options: { id: VoicePreference; label: string; desc: string; icon: typeof User }[] = [
  {
    id: 'male',
    label: 'Friendly guy',
    desc: 'Deep, calm mentor tone',
    icon: User,
  },
  {
    id: 'female',
    label: 'Friendly girl',
    desc: 'Warm, grounded staff-engineer energy',
    icon: UserCircle,
  },
];

const VoicePreferencePicker: React.FC<VoicePreferencePickerProps> = ({ value, onChange }) => (
  <div className="max-w-md mx-auto">
    <h2 className="text-xl font-bold text-text-primary text-center mb-1">Meet Coach</h2>
    <p className="text-sm text-text-secondary text-center mb-6">
      Pick how Coach will sound in your lessons — deep, warm, and approachable.
    </p>
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`p-4 rounded-[var(--radius-card)] border text-left transition-colors ${
              active
                ? 'border-accent-blue bg-accent-blue/10'
                : 'border-[var(--border-color)] hover:border-accent-blue/40'
            }`}
          >
            <Icon className={`w-8 h-8 mb-2 ${active ? 'text-accent-blue' : 'text-text-secondary'}`} />
            <p className="font-semibold text-text-primary text-sm">{opt.label}</p>
            <p className="text-xs text-text-secondary mt-1">{opt.desc}</p>
            <VoicePreviewButton voice={opt.id} label="voice" />
          </button>
        );
      })}
    </div>
  </div>
);

export default VoicePreferencePicker;
