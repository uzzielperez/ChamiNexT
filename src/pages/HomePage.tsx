import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import PartnersSection from '../components/home/PartnersSection';
import FeaturesSection from '../components/home/FeaturesSection';
import JobsSection from '../components/home/JobsSection';
import ProductsSection from '../components/home/ProductsSection';

import CTASection from '../components/home/CTASection';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <main>
        <HeroSection />
        <PartnersSection />
        <FeaturesSection />
        <JobsSection />
        <ProductsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;