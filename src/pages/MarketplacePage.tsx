import React, { useState } from 'react';
import { BookOpen, ShoppingBag, Star } from 'lucide-react';
import HubPageHeader from '../components/hub/HubPageHeader';
import HubSegment from '../components/hub/HubSegment';
import HubCatalogCard from '../components/hub/HubCatalogCard';
import { products, courses } from '../data/products';

type ViewMode = 'all' | 'products' | 'courses';

const FEATURED_PRODUCTS = ['areuwell.org', 'Manifest.ink'];

const MarketplacePage: React.FC = () => {
  const [view, setView] = useState<ViewMode>('all');

  const segments = [
    { id: 'all', label: 'All', icon: <Star className="w-4 h-4" /> },
    { id: 'products', label: 'Products', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
  ];

  const showProducts = view === 'all' || view === 'products';
  const showCourses = view === 'all' || view === 'courses';

  const featured = products.filter((p) => FEATURED_PRODUCTS.includes(p.name));
  const restProducts = products.filter((p) => !FEATURED_PRODUCTS.includes(p.name));

  return (
    <div className="hub-shell">
      <div className="hub-container">
        <HubPageHeader
          title="Marketplace"
          subtitle="Digital products and premium courses — same look and feel as the rest of ChamiNexT."
        />

        <HubSegment options={segments} value={view} onChange={(id) => setView(id as ViewMode)} />

        {showProducts && (
          <section className="mb-12">
            <div className="flex items-end justify-between gap-4 mb-4">
              <p className="hub-section-label mb-0">Digital products</p>
              <span className="text-xs text-text-secondary">{products.length} items</span>
            </div>

            {view === 'all' && featured.length > 0 && (
              <div className="hub-highlight mb-4">
                <p className="text-sm font-semibold text-text-primary mb-1">Featured</p>
                <p className="text-xs text-text-secondary mb-4">
                  Flagship products with real-world applications.
                </p>
                <div className="hub-catalog-grid">
                  {featured.map((p) => (
                    <HubCatalogCard key={p.name} item={p} kind="product" featured />
                  ))}
                </div>
              </div>
            )}

            <div className="hub-catalog-grid">
              {(view === 'products' ? products : restProducts).map((p) => (
                <HubCatalogCard key={p.name} item={p} kind="product" />
              ))}
            </div>
          </section>
        )}

        {showCourses && (
          <section>
            <div className="flex items-end justify-between gap-4 mb-4">
              <p className="hub-section-label mb-0">Premium courses</p>
              <span className="text-xs text-text-secondary">{courses.length} courses</span>
            </div>

            {view === 'all' && (
              <div className="hub-highlight mb-4 py-3 px-4">
                <p className="text-sm text-text-secondary">
                  <span className="text-text-primary font-medium">Included:</span> lifetime access,
                  downloadable resources, and community support on every course.
                </p>
              </div>
            )}

            <div className="hub-catalog-grid">
              {courses.map((c) => (
                <HubCatalogCard key={c.name} item={c} kind="course" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
