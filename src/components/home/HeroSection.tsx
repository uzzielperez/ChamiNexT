import React, { useEffect, useRef } from 'react';
import Button from '../common/Button';
import { ArrowRight, Code, Users, ShoppingBag } from 'lucide-react';
import Typed from 'typed.js';

const HeroSection: React.FC = () => {
  const typedRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        'exceptional code^1000',
        'innovative solutions^1000',
        'groundbreaking projects^1000',
        'the future of tech^1000'
      ],
      typeSpeed: 50,
      backSpeed: 30,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="relative bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black-900 to-black-950"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gold-400 rounded-full opacity-30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
              }}
            ></div>
          ))}
        </div>
        
        {/* Larger ambient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold-600 rounded-full opacity-15 blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -left-20 w-60 h-60 bg-gold-700 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-gold-500 rounded-full opacity-12 blur-3xl animate-pulse" style={{ animationDelay: '6s' }}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600" ref={typedRef}></span> meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">exceptional opportunity</span>
          </h1>
          
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            Empowering the next generation of software engineers through mentorship, growth, and the connections that drive innovation forward.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg">
              Explore Marketplace
            </Button>
          </div>
          
          {/* Stats */}
          {/* <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
              <div className="flex justify-center items-center">
                <Code className="h-7 w-7 text-purple-500 mr-3" />
                <span className="text-2xl font-bold text-white">25K+</span>
              </div>
              <p className="mt-2 text-gray-400 text-center">Active Developers</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
              <div className="flex justify-center items-center">
                <Users className="h-7 w-7 text-blue-500 mr-3" />
                <span className="text-2xl font-bold text-white">2K+</span>
              </div>
              <p className="mt-2 text-gray-400 text-center">Hiring Companies</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
              <div className="flex justify-center items-center">
                <ShoppingBag className="h-7 w-7 text-green-500 mr-3" />
                <span className="text-2xl font-bold text-white">10K+</span>
              </div>
              <p className="mt-2 text-gray-400 text-center">Digital Products</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;