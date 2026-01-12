import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuroraBackground from '../components/ui/AuroraBackground';
import PremiumButton from '../components/ui/PremiumButton';
import { ArrowLeft, TrendingUp, Zap, Gauge, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

const PerformancePage: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    lighthouse: 95,
    loadTime: 1.8,
    firstContentfulPaint: 1.2,
    largestContentfulPaint: 2.1,
    timeToInteractive: 2.5,
    cumulativeLayoutShift: 0.05
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        loadTime: Math.max(1.5, Math.min(2.5, prev.loadTime + (Math.random() - 0.5) * 0.2)),
        lighthouse: Math.max(90, Math.min(100, prev.lighthouse + (Math.random() - 0.5) * 2))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const webVitals = [
    {
      name: 'Largest Contentful Paint (LCP)',
      value: `${metrics.largestContentfulPaint.toFixed(1)}s`,
      target: '<2.5s',
      status: metrics.largestContentfulPaint < 2.5 ? 'good' : 'needs-improvement',
      description: 'Time to render the largest content element'
    },
    {
      name: 'First Input Delay (FID)',
      value: '<100ms',
      target: '<100ms',
      status: 'good',
      description: 'Time from first user interaction to browser response'
    },
    {
      name: 'Cumulative Layout Shift (CLS)',
      value: metrics.cumulativeLayoutShift.toFixed(3),
      target: '<0.1',
      status: metrics.cumulativeLayoutShift < 0.1 ? 'good' : 'needs-improvement',
      description: 'Visual stability during page load'
    },
    {
      name: 'First Contentful Paint (FCP)',
      value: `${metrics.firstContentfulPaint.toFixed(1)}s`,
      target: '<1.8s',
      status: metrics.firstContentfulPaint < 1.8 ? 'good' : 'needs-improvement',
      description: 'Time to first content render'
    },
    {
      name: 'Time to Interactive (TTI)',
      value: `${metrics.timeToInteractive.toFixed(1)}s`,
      target: '<3.8s',
      status: metrics.timeToInteractive < 3.8 ? 'good' : 'needs-improvement',
      description: 'Time until page is fully interactive'
    }
  ];

  const optimizations = [
    {
      technique: 'Code Splitting',
      impact: 'High',
      description: 'Lazy loading routes and components reduces initial bundle size',
      improvement: '40% smaller initial load'
    },
    {
      technique: 'Image Optimization',
      impact: 'High',
      description: 'WebP format, lazy loading, and responsive images',
      improvement: '60% faster image load'
    },
    {
      technique: 'CDN Caching',
      impact: 'Medium',
      description: 'Static assets served from edge locations worldwide',
      improvement: '80% faster repeat visits'
    },
    {
      technique: 'Bundle Optimization',
      impact: 'High',
      description: 'Tree shaking, minification, and compression',
      improvement: '35% smaller bundles'
    },
    {
      technique: 'Serverless Functions',
      impact: 'Medium',
      description: 'Ultra-fast cold starts and auto-scaling',
      improvement: '<200ms response time'
    },
    {
      technique: 'Prefetching',
      impact: 'Low',
      description: 'Predictive prefetching of likely next pages',
      improvement: 'Instant navigation'
    }
  ];

  const getStatusColor = (status: string) => {
    return status === 'good' ? 'text-green-400' : 'text-yellow-400';
  };

  const getStatusIcon = (status: string) => {
    return status === 'good' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-primary-dark text-text-primary relative overflow-hidden">
      <AuroraBackground opacity={0.6} speed={1.0} />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <PremiumButton
            variant="secondary"
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </PremiumButton>

          <div className="card border-accent-blue/20 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-hero-headline font-bold text-text-primary">
                  Performance Optimization
                </h1>
                <p className="text-subheadline text-text-secondary">
                  Lightning-fast applications optimized for speed and efficiency
                </p>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 border-accent-blue/30">
              <div className="flex items-center justify-between mb-2">
                <Gauge className="w-6 h-6 text-accent-blue" />
                <span className="text-sm text-text-secondary">Lighthouse</span>
              </div>
              <div className="text-3xl font-bold text-text-primary">{Math.round(metrics.lighthouse)}</div>
              <div className="text-sm text-text-secondary mt-1">Performance Score</div>
            </div>
            <div className="card bg-gradient-to-br from-accent-purple/20 to-pink-500/20 border-accent-purple/30">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-6 h-6 text-accent-purple" />
                <span className="text-sm text-text-secondary">Load Time</span>
              </div>
              <div className="text-3xl font-bold text-text-primary">{metrics.loadTime.toFixed(1)}s</div>
              <div className="text-sm text-text-secondary mt-1">Average</div>
            </div>
            <div className="card bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <span className="text-sm text-text-secondary">Bundle Size</span>
              </div>
              <div className="text-3xl font-bold text-text-primary">250KB</div>
              <div className="text-sm text-text-secondary mt-1">Gzipped</div>
            </div>
            <div className="card bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                <span className="text-sm text-text-secondary">TTFB</span>
              </div>
              <div className="text-3xl font-bold text-text-primary">&lt;200ms</div>
              <div className="text-sm text-text-secondary mt-1">Time to First Byte</div>
            </div>
          </div>
        </div>

        {/* Web Vitals */}
        <div className="card mb-6">
          <h2 className="text-section-header font-bold text-text-primary mb-6">Core Web Vitals</h2>
          <div className="space-y-4">
            {webVitals.map((vital, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-text-primary">{vital.name}</h3>
                      <span className={`flex items-center gap-1 ${getStatusColor(vital.status)}`}>
                        {getStatusIcon(vital.status)}
                        {vital.status === 'good' ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-3">{vital.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-accent-blue mb-1">{vital.value}</div>
                    <div className="text-xs text-text-secondary">Target: {vital.target}</div>
                  </div>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      vital.status === 'good' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{
                      width: vital.status === 'good' ? '100%' : '75%'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimization Techniques */}
        <div className="card">
          <h2 className="text-section-header font-bold text-text-primary mb-6">Optimization Techniques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {optimizations.map((opt, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-accent-blue/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-text-primary">{opt.technique}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    opt.impact === 'High' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : opt.impact === 'Medium'
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {opt.impact} Impact
                  </span>
                </div>
                <p className="text-text-secondary mb-4">{opt.description}</p>
                <div className="pt-4 border-t border-gray-700">
                  <div className="text-sm">
                    <span className="text-text-secondary">Improvement: </span>
                    <span className="text-accent-blue font-semibold">{opt.improvement}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Before/After Comparison */}
        <div className="card mt-6 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 border-accent-blue/20">
          <h2 className="text-section-header font-bold text-text-primary mb-6">Performance Improvements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Before Optimization</h3>
              <div className="space-y-2 text-text-secondary">
                <div>Load Time: <span className="text-red-400">4.2s</span></div>
                <div>Bundle Size: <span className="text-red-400">850KB</span></div>
                <div>Lighthouse: <span className="text-red-400">72</span></div>
                <div>FCP: <span className="text-red-400">3.1s</span></div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">After Optimization</h3>
              <div className="space-y-2 text-text-secondary">
                <div>Load Time: <span className="text-green-400">{metrics.loadTime.toFixed(1)}s</span></div>
                <div>Bundle Size: <span className="text-green-400">250KB</span></div>
                <div>Lighthouse: <span className="text-green-400">{Math.round(metrics.lighthouse)}</span></div>
                <div>FCP: <span className="text-green-400">{metrics.firstContentfulPaint.toFixed(1)}s</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
