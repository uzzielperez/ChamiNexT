import React from 'react';
import { Sparkles, Play, ChevronDown, Zap, Shield, TrendingUp } from 'lucide-react';
import PremiumButton from '../components/ui/PremiumButton';
import GradientBackground from '../components/ui/GradientBackground';
import ParticleEffect from '../components/ui/ParticleEffect';
import HeroSection from '../components/home/HeroSection';
import ChatBox from '../components/common/ChatBox';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <GradientBackground variant="hero" animated>
          <ParticleEffect count={100} color="#3b82f6" size="sm" direction="up" />
        </GradientBackground>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8 animate-fade-in-up">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight premium-text">
              <span className="text-gradient-hero animate-gradient-x">
                Empower Your
              </span>
              <br />
              <span className="text-white">Tech Career</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
              AI-powered CV optimization, talent pipeline management, and premium courses 
              for the next generation of software engineers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animate-delay-300">
              <PremiumButton variant="gradient" size="lg" icon={<Sparkles />}>
                Start AI Optimization
              </PremiumButton>
              <PremiumButton variant="secondary" size="lg" icon={<Play />}>
                Watch Demo
              </PremiumButton>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 animate-fade-in-up animate-delay-500">
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient-gold mb-2">10,000+</div>
                <div className="text-gray-400">CVs Optimized</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient-gold mb-2">85%</div>
                <div className="text-gray-400">Interview Rate Increase</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient-gold mb-2">24/7</div>
                <div className="text-gray-400">AI Assistant Available</div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="pt-12 animate-fade-in-up animate-delay-700">
              <p className="text-sm text-gray-400 mb-6">Trusted by developers at</p>
              <div className="flex items-center justify-center space-x-8 opacity-60">
                <div className="w-24 h-8 bg-white/10 rounded flex items-center justify-center">
                  <span className="text-xs text-white/60">Google</span>
                </div>
                <div className="w-24 h-8 bg-white/10 rounded flex items-center justify-center">
                  <span className="text-xs text-white/60">Microsoft</span>
                </div>
                <div className="w-24 h-8 bg-white/10 rounded flex items-center justify-center">
                  <span className="text-xs text-white/60">Meta</span>
                </div>
                <div className="w-24 h-8 bg-white/10 rounded flex items-center justify-center">
                  <span className="text-xs text-white/60">Netflix</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-subtle">
          <ChevronDown className="w-6 h-6 text-white/60" />
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-20 relative">
        <GradientBackground variant="section" className="absolute inset-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose ChamiNexT?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to advance your career or build your dream team
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "AI-Powered",
                description: "Advanced AI optimization for maximum impact"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast",
                description: "Get results in minutes, not hours"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Enterprise Grade",
                description: "Security and reliability you can trust"
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Proven Results",
                description: "85% increase in interview success rate"
              }
            ].map((feature, index) => (
              <div key={index} className="premium-card p-6 text-center hover-lift">
                <div className="text-gold-400 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Original Sections */}
      <main>
        <HeroSection />
        <div className="py-10 bg-black">
          <ChatBox />
        </div>
      </main>
    </div>
  );
};

export default HomePage;