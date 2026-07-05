import React from 'react';

export interface HubSegmentOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface HubSegmentProps {
  options: HubSegmentOption[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
}

const HubSegment: React.FC<HubSegmentProps> = ({ options, value, onChange, ariaLabel }) => (
  <div className="hub-segment" role="tablist" aria-label={ariaLabel ?? 'Filter'}>
    {options.map((opt) => (
      <button
        key={opt.id}
        type="button"
        role="tab"
        aria-selected={value === opt.id}
        className={`hub-segment-btn${value === opt.id ? ' is-active' : ''}`}
        onClick={() => onChange(opt.id)}
      >
        {opt.icon}
        {opt.label}
      </button>
    ))}
  </div>
);

export default HubSegment;
