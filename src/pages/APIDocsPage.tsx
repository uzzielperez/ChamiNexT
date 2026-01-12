import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuroraBackground from '../components/ui/AuroraBackground';
import PremiumButton from '../components/ui/PremiumButton';
import { ArrowLeft, Code, Play, Copy, Check, AlertCircle, Zap, Lock, Clock } from 'lucide-react';

const APIDocsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('cv-optimizer');
  const [copied, setCopied] = useState<string | null>(null);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const endpoints = [
    {
      id: 'cv-optimizer',
      name: 'AI CV Optimizer',
      method: 'POST',
      path: '/api/ai-cv-optimizer',
      description: 'Analyze job description and CV to generate optimization suggestions',
      auth: 'API Key required',
      rateLimit: '100 requests/hour'
    },
    {
      id: 'groq-chat',
      name: 'Groq Chat',
      method: 'POST',
      path: '/api/groq-chat',
      description: 'AI-powered chat endpoint using Groq inference',
      auth: 'API Key required',
      rateLimit: '200 requests/hour'
    },
    {
      id: 'payment-intent',
      name: 'Create Payment Intent',
      method: 'POST',
      path: '/api/create-payment-intent',
      description: 'Create Stripe payment intent for course/product purchases',
      auth: 'API Key required',
      rateLimit: '50 requests/hour'
    }
  ];

  const codeExamples = {
    'cv-optimizer': {
      request: `fetch('/api/ai-cv-optimizer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    jobDescription: 'Senior React Developer...',
    cvContent: 'Your CV content here...'
  })
})
.then(res => res.json())
.then(data => console.log(data));`,
      response: `{
  "suggestions": [
    {
      "section": "Experience",
      "current": "...",
      "suggested": "...",
      "reason": "Better alignment with job requirements"
    }
  ],
  "score": 85,
  "improvements": ["Add React hooks experience", "Highlight TypeScript skills"]
}`
    },
    'groq-chat': {
      request: `fetch('/api/groq-chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    message: 'Hello, how can I help?',
    conversationId: 'optional-conversation-id'
  })
})
.then(res => res.json())
.then(data => console.log(data));`,
      response: `{
  "response": "Hello! I'm here to help...",
  "conversationId": "conv_123",
  "tokens": 45
}`
    },
    'payment-intent': {
      request: `fetch('/api/create-payment-intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    amount: 19900,
    currency: 'usd',
    productId: 'course-vibe-coding'
  })
})
.then(res => res.json())
.then(data => console.log(data));`,
      response: `{
  "clientSecret": "pi_123_secret_abc",
  "paymentIntentId": "pi_123",
  "amount": 19900,
  "currency": "usd"
}`
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const testEndpoint = async () => {
    setLoading(true);
    setTestResponse(null);
    
    // Simulate API call
    setTimeout(() => {
      setTestResponse({
        success: true,
        data: codeExamples[selectedEndpoint as keyof typeof codeExamples].response,
        status: 200,
        time: '145ms'
      });
      setLoading(false);
    }, 1000);
  };

  const currentExample = codeExamples[selectedEndpoint as keyof typeof codeExamples];
  const currentEndpoint = endpoints.find(e => e.id === selectedEndpoint);

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
                <Code className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-hero-headline font-bold text-text-primary">
                  API Development
                </h1>
                <p className="text-subheadline text-text-secondary">
                  Robust, well-documented APIs that power modern applications
                </p>
              </div>
            </div>
          </div>

          {/* API Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 border-accent-blue/30">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-6 h-6 text-accent-blue" />
                <span className="text-sm text-text-secondary">Endpoints</span>
              </div>
              <div className="text-3xl font-bold text-text-primary">{endpoints.length}</div>
              <div className="text-sm text-text-secondary mt-1">Available APIs</div>
            </div>
            <div className="card bg-gradient-to-br from-accent-purple/20 to-pink-500/20 border-accent-purple/30">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-6 h-6 text-accent-purple" />
                <span className="text-sm text-text-secondary">Response Time</span>
              </div>
              <div className="text-3xl font-bold text-text-primary">&lt;200ms</div>
              <div className="text-sm text-text-secondary mt-1">Average</div>
            </div>
            <div className="card bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <span className="text-sm text-text-secondary">Uptime</span>
              </div>
              <div className="text-3xl font-bold text-text-primary">99.9%</div>
              <div className="text-sm text-text-secondary mt-1">Reliability</div>
            </div>
            <div className="card bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
              <div className="flex items-center justify-between mb-2">
                <Lock className="w-6 h-6 text-yellow-400" />
                <span className="text-sm text-text-secondary">Security</span>
              </div>
              <div className="text-3xl font-bold text-text-primary">A+</div>
              <div className="text-sm text-text-secondary mt-1">SSL Rating</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Endpoints List */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-bold text-text-primary mb-4">API Endpoints</h2>
              <div className="space-y-2">
                {endpoints.map((endpoint) => (
                  <button
                    key={endpoint.id}
                    onClick={() => setSelectedEndpoint(endpoint.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedEndpoint === endpoint.id
                        ? 'bg-accent-blue/20 border-accent-blue text-text-primary'
                        : 'bg-gray-800/50 border-gray-700 text-text-secondary hover:border-accent-blue/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        endpoint.method === 'POST' 
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {endpoint.method}
                      </span>
                    </div>
                    <div className="font-semibold text-sm mb-1">{endpoint.name}</div>
                    <div className="text-xs opacity-75">{endpoint.path}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* API Details */}
          <div className="lg:col-span-2 space-y-6">
            {currentEndpoint && (
              <>
                {/* Endpoint Info */}
                <div className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-section-header font-bold text-text-primary mb-2">
                        {currentEndpoint.name}
                      </h2>
                      <p className="text-text-secondary mb-4">{currentEndpoint.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      currentEndpoint.method === 'POST' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {currentEndpoint.method}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-sm text-text-secondary mb-1">Path</div>
                      <code className="text-sm text-accent-blue">{currentEndpoint.path}</code>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary mb-1">Rate Limit</div>
                      <div className="text-sm text-text-primary">{currentEndpoint.rateLimit}</div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-text-primary mb-1">Authentication Required</div>
                        <div className="text-sm text-text-secondary">{currentEndpoint.auth}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Request Example */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-text-primary">Request Example</h3>
                    <button
                      onClick={() => copyToClipboard(currentExample.request, 'request')}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm"
                    >
                      {copied === 'request' ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm">
                    <code className="text-gray-300">{currentExample.request}</code>
                  </pre>
                </div>

                {/* Response Example */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-text-primary">Response Example</h3>
                    <button
                      onClick={() => copyToClipboard(currentExample.response, 'response')}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm"
                    >
                      {copied === 'response' ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm">
                    <code className="text-gray-300">{currentExample.response}</code>
                  </pre>
                </div>

                {/* Test Endpoint */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-text-primary">Test Endpoint</h3>
                    <PremiumButton
                      variant="primary"
                      onClick={testEndpoint}
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      {loading ? 'Testing...' : 'Test API'}
                    </PremiumButton>
                  </div>

                  {testResponse && (
                    <div className="bg-gray-900 rounded-lg p-4 mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-text-secondary">Response</span>
                        <span className="text-xs text-green-400">Status: {testResponse.status} • {testResponse.time}</span>
                      </div>
                      <pre className="text-sm text-gray-300 overflow-x-auto">
                        <code>{JSON.stringify(testResponse.data, null, 2)}</code>
                      </pre>
                    </div>
                  )}

                  {!testResponse && !loading && (
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center text-text-secondary">
                      Click "Test API" to see a sample response
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDocsPage;
