import React from 'react';
import ProductCard from '../components/marketplace/ProductCard';
import CourseCard from '../components/marketplace/CourseCard';
import { products, courses } from '../data/products';

const MarketplacePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white">Digital Marketplace</h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          Discover premium digital products and courses designed to accelerate your career and business growth.
        </p>
      </div>

      {/* Featured Products Section */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Digital Products</h2>
          <div className="text-sm text-gray-400">
            {products.length} products available
          </div>
        </div>
        
        {/* Highlight areuwell.org and manifest.ink */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/20">
          <h3 className="text-lg font-semibold text-white mb-2">🌟 Featured Products</h3>
          <p className="text-gray-300 text-sm mb-4">
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
          <h2 className="text-3xl font-bold text-white">Premium Courses</h2>
          <div className="text-sm text-gray-400">
            {courses.length} courses available
          </div>
        </div>
        
        <div className="mb-6 p-4 bg-gold-900/20 rounded-lg border border-gold-500/20">
          <p className="text-gold-200 text-sm">
            💡 <strong>Pro Tip:</strong> All courses include lifetime access, downloadable resources, and community support.
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
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Level Up?</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Join thousands of professionals who have accelerated their careers with our premium content. 
            Get instant access to cutting-edge tools and knowledge.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center">
              <span className="text-gold-400 font-bold text-lg mr-2">✓</span>
              Lifetime Access
            </div>
            <div className="flex items-center">
              <span className="text-gold-400 font-bold text-lg mr-2">✓</span>
              Expert Support
            </div>
            <div className="flex items-center">
              <span className="text-gold-400 font-bold text-lg mr-2">✓</span>
              Regular Updates
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
