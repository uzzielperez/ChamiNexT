import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface PremiumTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const PremiumTabs: React.FC<PremiumTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = ''
}) => {
  return (
    <div className={`premium-tabs ${className}`}>
      <div className="premium-tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`premium-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon && (
              <span className="premium-tab-icon">
                {tab.icon}
              </span>
            )}
            <span className="premium-tab-label">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="premium-tab-indicator" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PremiumTabs;