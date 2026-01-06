import React, { useState } from 'react';
import ProductCard from '../components/marketplace/ProductCard';
import CourseCard from '../components/marketplace/CourseCard';
import PremiumTabs from '../components/ui/PremiumTabs';
import AuroraBackground from '../components/ui/AuroraBackground';
import PremiumButton from '../components/ui/PremiumButton';
import { products, courses } from '../data/products';
import { ShoppingBag, BookOpen, Star, Filter } from 'lucide-react';

type ViewMode = 'all' | 'products' | 'courses';

const MarketplacePage: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('all');

  const tabs = [
    { id: 'all', label: 'All Items', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'products', label: 'Digital Products', icon: <Star className="w-4 h-4" /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> }
  ];

  const renderAll = () => (
    <div className="container mx-auto px-4 py-16 relative z-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-hero-headline font-bold mb-lg leading-tight text-text-primary">
          Digital Marketplace
        </h1>
        <p className="text-subheadline text-text-secondary mb-xl max-w-3xl mx-auto">
          Discover premium digital products and courses designed to accelerate your career and business growth.
        </p>
      </div>

      {/* Featured Products Section */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-section-header font-bold text-text-primary">Digital Products</h2>
          <div className="text-sm text-text-secondary">
            {products.length} products available
          </div>
        </div>
        
        {/* Highlight areuwell.org and manifest.ink */}
        <div className="card mb-8 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 border-accent-blue/20">
          <h3 className="text-lg font-semibold text-text-primary mb-2">🌟 Featured Products</h3>
          <p className="text-text-secondary text-sm mb-6">
            Check out our flagship products with real-world applications and proven results.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.filter(p => ['areuwell.org', 'Manifest.ink'].includes(p.name)).map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </div>

        {/* All Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.filter(p => !['areuwell.org', 'Manifest.ink'].includes(p.name)).map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>
      
      {/* Courses Section */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-section-header font-bold text-text-primary">Premium Courses</h2>
          <div className="text-sm text-text-secondary">
            {courses.length} courses available
          </div>
        </div>
        
        <div className="card mb-8 bg-gradient-to-r from-accent-purple/10 to-accent-blue/10 border-accent-purple/20">
          <p className="text-text-secondary text-sm">
            💡 <strong className="text-text-primary">Pro Tip:</strong> All courses include lifetime access, downloadable resources, and community support.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.name} course={course} />
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <div className="card">
          <h3 className="text-2xl font-bold text-text-primary mb-4">Ready to Level Up?</h3>
          <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have accelerated their careers with our premium content. 
            Get instant access to cutting-edge tools and knowledge.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-text-secondary mb-8">
            <div className="flex items-center">
              <span className="text-accent-blue font-bold text-lg mr-2">✓</span>
              Lifetime Access
            </div>
            <div className="flex items-center">
              <span className="text-accent-blue font-bold text-lg mr-2">✓</span>
              Expert Support
            </div>
            <div className="flex items-center">
              <span className="text-accent-blue font-bold text-lg mr-2">✓</span>
              Regular Updates
            </div>
          </div>
          <PremiumButton variant="primary" size="lg">
            Browse All Products
          </PremiumButton>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="container mx-auto px-4 py-16 relative z-10">
      <div className="text-center mb-12">
        <h1 className="text-section-header font-bold text-text-primary mb-4">Digital Products</h1>
        <p className="text-subheadline text-text-secondary">Professional tools and applications built for real-world impact</p>
      </div>

      {/* Featured Products */}
      <div className="card mb-12 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 border-accent-blue/20">
        <h3 className="text-xl font-bold text-text-primary mb-6">🌟 Featured Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.filter(p => ['areuwell.org', 'Manifest.ink'].includes(p.name)).map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>

      {/* All Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.filter(p => !['areuwell.org', 'Manifest.ink'].includes(p.name)).map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="container mx-auto px-4 py-16 relative z-10">
      <div className="text-center mb-12">
        <h1 className="text-section-header font-bold text-text-primary mb-4">Premium Courses</h1>
        <p className="text-subheadline text-text-secondary">Master cutting-edge technologies with expert-led courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <CourseCard key={course.name} course={course} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary-dark text-text-primary relative overflow-hidden">
      {/* Aurora Background */}
      <AuroraBackground opacity={0.6} speed={1.0} />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Navigation Tabs */}
        <div className="container mx-auto px-4 pt-8">
          <PremiumTabs
            tabs={tabs}
            activeTab={currentView}
            onTabChange={(tabId) => setCurrentView(tabId as ViewMode)}
          />
        </div>
        
        {currentView === 'all' && renderAll()}
        {currentView === 'products' && renderProducts()}
        {currentView === 'courses' && renderCourses()}
      </div>
    </div>
  );
};

export default MarketplacePage;
