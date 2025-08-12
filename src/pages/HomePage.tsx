import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import ChatBox from '../components/common/ChatBox';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <main>
        <HeroSection />
        <div className="py-10 bg-black">
          <ChatBox />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;