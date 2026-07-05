import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import HubQuickNav from './HubQuickNav';

interface HubPageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  showQuickNav?: boolean;
  children?: React.ReactNode;
}

const HubPageHeader: React.FC<HubPageHeaderProps> = ({
  title,
  subtitle,
  backTo,
  backLabel = 'Back',
  showQuickNav = true,
  children,
}) => (
  <header className="mb-6">
    {backTo && (
      <Link to={backTo} className="hub-back-link">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        {backLabel}
      </Link>
    )}
    {showQuickNav && <HubQuickNav />}
    <h1 className="hub-page-title">{title}</h1>
    {subtitle && <p className="hub-page-subtitle">{subtitle}</p>}
    {children}
  </header>
);

export default HubPageHeader;
