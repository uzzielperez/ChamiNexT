import React from 'react';
import ProductCard from '../components/marketplace/ProductCard';
import CourseCard from '../components/marketplace/CourseCard';

const products = [
  {
    name: 'Manifest.ink',
    description: 'A white-label solution for entrepreneurs and enterprises.',
    url: '#',
  },
  {
    name: 'areuwell.org',
    description: 'A white-label solution for entrepreneurs and enterprises.',
    url: '#',
  },
  {
    name: 'Example CRM System',
    description: 'A white-label CRM system for your business.',
    url: '#',
  },
];

const courses = [
  {
    name: 'RAGs',
    description: 'Learn how to build Retrieval-Augmented Generation systems.',
    url: '#',
  },
  {
    name: 'AI Agents',
    description: 'Master the art of building autonomous AI agents.',
    url: '#',
  },
  {
    name: 'Vibe Coding',
    description: 'A new way to code, powered by vibes.',
    url: '#',
  },
];

const MarketplacePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center">Marketplace</h1>
      <p className="mt-4 text-center text-lg text-gray-400">
        Browse our digital products and courses.
      </p>
      
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-8">Digital Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.name} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
