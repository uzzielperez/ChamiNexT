import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import HubQuickNav from './HubQuickNav';

interface ProductSampleLayoutProps {
  title: string;
  description: string;
  sampleLabel?: string;
  backTo?: string;
  backLabel?: string;
  children: React.ReactNode;
}

/** Consistent shell for digital product demos (CRM, Polaris, etc.). */
const ProductSampleLayout: React.FC<ProductSampleLayoutProps> = ({
  title,
  description,
  sampleLabel = 'Sample preview',
  backTo = '/marketplace',
  backLabel = 'Back to Marketplace',
  children,
}) => (
  <div className="hub-shell">
    <div className="hub-container max-w-6xl">
      <Link to={backTo} className="hub-back-link">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        {backLabel}
      </Link>
      <HubQuickNav />

      <div className="hub-highlight mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <p className="hub-section-label mb-0">Digital product</p>
          <span className="hub-sample-banner">{sampleLabel}</span>
        </div>
        <h1 className="hub-page-title">{title}</h1>
        <p className="hub-page-subtitle">{description}</p>
      </div>

      {children}
    </div>
  </div>
);

export default ProductSampleLayout;
