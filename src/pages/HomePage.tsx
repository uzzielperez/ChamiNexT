import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Code, Zap, Shield, TrendingUp, Users, Star, ExternalLink } from 'lucide-react';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { products } from '../data/products';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const capabilityRoutes: { [key: string]: string } = {
    'Full-Stack Development': '/portfolio',
    'AI/ML Integration': '/ai-showcase',
    'Cloud Architecture': '/infrastructure',
    'Performance Optimization': '/performance',
    'API Development': '/api-docs',
    'DevOps & CI/CD': '/devops'
  };

  return (
    <div className="min-h-screen">
      {/* HERO SECTION - Following Brief Specs */}
      <section className="hero-section grid-pattern relative overflow-hidden">
        {/* Animated Shader Background */}
        <AnimatedBackground opacity={0.4} speed={1.2} />
        
        <div className="container text-center relative z-10">
          <h1 className="hero-headline">
            Exceptional Code That <span className="text-gradient">Drives Results</span>
          </h1>
          
          <p className="hero-subheadline mt-6">
            Full-stack development and AI solutions that transform ideas into scalable, 
            production-ready applications for the next generation of software engineers.
          </p>

          {/* CTA Buttons - Following Brief Specs */}
          <div className="flex gap-4 justify-center mt-12">
            <button className="btn-primary">
              <span>View Projects</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="btn-secondary">
              Contact Me
            </button>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">10,000+</div>
              <div className="text-secondary">CVs Optimized</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">85%</div>
              <div className="text-secondary">Interview Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">24/7</div>
              <div className="text-secondary">AI Assistant Available</div>
            </div>
          </div>

          {/* Trusted By Section */}
          <div className="mt-16">
            <p className="text-secondary text-sm mb-6">Trusted by developers at</p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              {['Google', 'Microsoft', 'Meta', 'Netflix', 'Amazon'].map((company) => (
                <div key={company} className="glass px-4 py-2 rounded-lg">
                  <span className="text-sm">{company}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - Following Brief Specs */}
      <section className="section relative overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        {/* Subtle Shader Background */}
        <AnimatedBackground opacity={0.15} speed={0.8} />
        
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="section-header">
              Why Choose <span className="text-gradient">ChamiNexT</span>?
            </h2>
            <p className="text-secondary mt-4 text-lg max-w-2xl mx-auto">
              Everything you need to advance your career or build your dream team
            </p>
          </div>

          <div className="grid-3">
            {[
              {
                icon: <Code className="w-12 h-12 text-blue-500" />,
                title: "Full-Stack Development",
                description: "End-to-end solutions from frontend to backend, databases, and deployment"
              },
              {
                icon: <Zap className="w-12 h-12 text-blue-500" />,
                title: "AI/ML Integration",
                description: "Cutting-edge artificial intelligence and machine learning implementations"
              },
              {
                icon: <Shield className="w-12 h-12 text-blue-500" />,
                title: "Cloud Architecture",
                description: "Scalable, secure, and reliable cloud-native applications"
              },
              {
                icon: <TrendingUp className="w-12 h-12 text-blue-500" />,
                title: "Performance Optimization",
                description: "Lightning-fast applications optimized for speed and efficiency"
              },
              {
                icon: <Users className="w-12 h-12 text-blue-500" />,
                title: "API Development",
                description: "Robust, well-documented APIs that power modern applications"
              },
              {
                icon: <Star className="w-12 h-12 text-blue-500" />,
                title: "DevOps & CI/CD",
                description: "Automated deployment pipelines and infrastructure management"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="feature-card group cursor-pointer"
                onClick={() => {
                  const route = capabilityRoutes[feature.title];
                  if (route) navigate(route);
                }}
              >
                <div className="mb-6 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-secondary mb-4">{feature.description}</p>
                <div className="text-accent-blue text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                  Learn more <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO/WORK SECTION - Scrolling Products */}
      <section className="section relative overflow-hidden">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-header">Featured Projects</h2>
            <p className="text-secondary mt-4 text-lg">
              Showcase of recent work and achievements
            </p>
          </div>

          {/* Horizontal Scrolling Container */}
          <div className="relative">
            {/* Gradient Fade Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none"></div>
            
            {/* Scrolling Products - Infinite Loop */}
            <div className="scrolling-container pb-6">
              <div className="scrolling-content">
                {/* First set of products */}
                {products.map((product, index) => (
                  <div 
                    key={`${product.name}-${index}`}
                    className="card group cursor-pointer flex-shrink-0 w-80 hover:border-accent-blue/50 transition-all duration-300"
                    onClick={() => {
                      // Handle navigation similar to ProductCard
                      if (product.url === '#crm') {
                        navigate('/products/crm');
                      } else if (product.url === '#polaris') {
                        navigate('/products/polaris');
                      } else if (product.url === '#kapwa-response') {
                        navigate('/products/kapwa-response');
                      } else if (product.url === '#eventhub') {
                        navigate('/products/eventhub');
                      } else if (product.url.startsWith('http')) {
                        window.open(product.url, '_blank');
                      } else if (product.url.startsWith('#')) {
                        navigate(`/products${product.url.replace('#', '')}`);
                      } else {
                        navigate(product.url);
                      }
                    }}
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg mb-4 flex items-center justify-center border border-gray-700 group-hover:border-accent-blue/50 transition-colors">
                      <Code className="w-12 h-12 text-accent-blue group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-blue transition-colors">
                        {product.name}
                      </h3>
                      {product.url.startsWith('http') && (
                        <ExternalLink className="w-4 h-4 text-text-secondary group-hover:text-accent-blue transition-colors flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <p className="text-secondary mb-4 text-sm" style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {product.features.slice(0, 2).map((feature, idx) => (
                          <span key={idx} className="glass px-2 py-1 rounded text-xs">
                            {feature.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                      {product.price !== undefined && (
                        <span className="text-accent-blue font-bold">
                          {product.price === 0 ? 'Free' : `€${product.price}`}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2 text-sm text-accent-blue opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {products.map((product, index) => (
                  <div 
                    key={`${product.name}-duplicate-${index}`}
                    className="card group cursor-pointer flex-shrink-0 w-80 hover:border-accent-blue/50 transition-all duration-300"
                    onClick={() => {
                      // Handle navigation similar to ProductCard
                      if (product.url === '#crm') {
                        navigate('/products/crm');
                      } else if (product.url === '#polaris') {
                        navigate('/products/polaris');
                      } else if (product.url === '#kapwa-response') {
                        navigate('/products/kapwa-response');
                      } else if (product.url === '#eventhub') {
                        navigate('/products/eventhub');
                      } else if (product.url.startsWith('http')) {
                        window.open(product.url, '_blank');
                      } else if (product.url.startsWith('#')) {
                        navigate(`/products${product.url.replace('#', '')}`);
                      } else {
                        navigate(product.url);
                      }
                    }}
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg mb-4 flex items-center justify-center border border-gray-700 group-hover:border-accent-blue/50 transition-colors">
                      <Code className="w-12 h-12 text-accent-blue group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-blue transition-colors">
                        {product.name}
                      </h3>
                      {product.url.startsWith('http') && (
                        <ExternalLink className="w-4 h-4 text-text-secondary group-hover:text-accent-blue transition-colors flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <p className="text-secondary mb-4 text-sm" style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {product.features.slice(0, 2).map((feature, idx) => (
                          <span key={idx} className="glass px-2 py-1 rounded text-xs">
                            {feature.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                      {product.price !== undefined && (
                        <span className="text-accent-blue font-bold">
                          {product.price === 0 ? 'Free' : `€${product.price}`}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2 text-sm text-accent-blue opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT/PROCESS SECTION */}
      <section className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-header mb-6">
                Building the Future of <span className="text-gradient">Tech Careers</span>
              </h2>
              <p className="text-secondary text-lg mb-6">
                Our mission is to empower the next generation of software engineers through 
                cutting-edge AI technology, comprehensive learning resources, and innovative 
                career development tools.
              </p>
              <div className="space-y-4">
                {[
                  "AI-powered career optimization",
                  "Comprehensive skill development",
                  "Industry-leading mentorship",
                  "Real-world project experience"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Our Process</h3>
              <div className="space-y-6">
                {[
                  { step: "01", title: "Analyze", desc: "AI-powered analysis of your current skills" },
                  { step: "02", title: "Optimize", desc: "Personalized recommendations and improvements" },
                  { step: "03", title: "Execute", desc: "Implementation with expert guidance" },
                  { step: "04", title: "Succeed", desc: "Land your dream job with confidence" }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="text-gradient font-bold text-lg">{item.step}</div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-secondary text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="section">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-header mb-6">
              Ready to Transform Your <span className="text-gradient">Tech Career</span>?
            </h2>
            <p className="text-secondary text-lg mb-8">
              Join thousands of developers who have accelerated their careers with our 
              AI-powered platform. Get started today and see the difference.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="btn-primary">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="btn-secondary">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="text-center py-8 border-t border-gray-800">
            <p className="text-secondary">
              © 2024 ChamiNexT. All rights reserved.
            </p>
            <div className="flex justify-center gap-6 mt-4">
              {['Privacy', 'Terms', 'Contact'].map((link) => (
                <a key={link} href="#" className="text-secondary hover:text-white transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;