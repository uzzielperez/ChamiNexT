import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LessonViewer from '../components/courses/LessonViewer';
import PremiumTabs from '../components/ui/PremiumTabs';
import AuroraBackground from '../components/ui/AuroraBackground';
import { BookOpen, ArrowLeft, Play, CheckCircle2 } from 'lucide-react';
import PremiumButton from '../components/ui/PremiumButton';
import { courses } from '../data/products';

interface Lesson {
  id: string;
  title: string;
  content: string;
  duration?: string;
  completed?: boolean;
}

const FullstackAICoursePage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId?: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'lessons' | 'overview'>('lessons');

  const course = courses.find(c => c.name === 'Full-Stack AI Development');

  // Lesson content embedded
  const lessonContent = {
    'setup': `# Module 0 — Setup & Starter

Duration: 30–45 minutes

## Objective
Set up your development environment, understand the starter project structure, and get your first AI-powered fullstack app running locally.

## Learning outcomes
- Set up Node.js development environment
- Configure API keys securely
- Understand fullstack project structure
- Run local development server
- Make your first API call to an AI model

## Prerequisites
- Node.js 16+ and npm/yarn installed
- Basic familiarity with React
- Understanding of HTTP APIs
- Code editor (VS Code recommended)

## Project Structure

A fullstack AI app typically has:
- **Client**: React/Next.js frontend
- **Server**: Node.js/Express API
- **AI Integration**: Model API calls
- **Database**: Optional data storage
- **Deployment**: Serverless or containerized

## Starter Project Setup

\`\`\`bash
cd courses/fullstack-ai-starter
npm install
\`\`\`

## Environment Configuration

Create a \`.env\` file:

\`\`\`env
OPENAI_API_KEY=your_api_key_here
PORT=3000
NODE_ENV=development
\`\`\`

## Running the Starter

Start the server:
\`\`\`bash
npm run start-server
\`\`\`

Start the client (in another terminal):
\`\`\`bash
npm run dev
\`\`\`

## Project Structure Overview

\`\`\`
fullstack-ai-starter/
├── server/
│   ├── index.js          # Express server
│   ├── routes/           # API routes
│   └── services/          # AI service integration
├── client/
│   ├── src/
│   │   ├── App.jsx        # Main component
│   │   └── components/    # UI components
│   └── package.json
└── README.md
\`\`\`

## Exercise 0.1 — First API Call
1. Set up your API key
2. Make a test call to the AI model
3. Verify the response in the console
4. Update the frontend to display the response

## Next
Proceed to Module 1 to learn about server architecture and API design.`,
    'server-api-design': `# Module 1 — Server & API Design

Duration: 1.5–2 hours

## Objective
Design and build a robust server architecture for AI applications with proper API endpoints, authentication, and request handling.

## Learning outcomes
- Design RESTful API endpoints
- Implement authentication and authorization
- Handle request batching and rate limiting
- Structure server code for scalability
- Add error handling and logging

## Server Architecture

### Core Components
- **API Routes**: Handle HTTP requests
- **Middleware**: Auth, validation, logging
- **Services**: Business logic and AI integration
- **Models**: Data structures and validation

## Express Server Setup

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());

// API Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await aiService.chat(message);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

## Authentication

### API Key Authentication
\`\`\`javascript
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

app.use('/api', authenticate);
\`\`\`

### JWT Authentication
\`\`\`javascript
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
\`\`\`

## Request Batching

Batch multiple requests for efficiency:

\`\`\`javascript
const batchRequests = async (requests) => {
  const batch = requests.map(req => aiService.process(req));
  return Promise.all(batch);
};
\`\`\`

## Rate Limiting

\`\`\`javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
\`\`\`

## Error Handling

\`\`\`javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
\`\`\`

## Exercise 1.1 — Build API Server
1. Set up Express server with routes
2. Add authentication middleware
3. Implement rate limiting
4. Add error handling
5. Test with Postman or curl

## Next
We'll integrate AI models into your server endpoints.`,
    'model-integration': `# Module 2 — Model Integration

Duration: 1.5–2 hours

## Objective
Integrate AI models (embeddings, completions, streaming) into your server endpoints with proper error handling and response formatting.

## Learning outcomes
- Call AI model APIs from server
- Implement embeddings for search
- Handle completion requests
- Set up streaming responses
- Manage API errors and retries

## AI Service Layer

Create a service layer for AI operations:

\`\`\`javascript
const OpenAI = require('openai');

class AIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async chat(messages) {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      temperature: 0.7
    });
    return response.choices[0].message.content;
  }

  async getEmbedding(text) {
    const response = await this.client.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text
    });
    return response.data[0].embedding;
  }
}

module.exports = new AIService();
\`\`\`

## Chat Completions

\`\`\`javascript
app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  
  const messages = [
    { role: 'system', content: 'You are a helpful assistant.' },
    ...history,
    { role: 'user', content: message }
  ];

  try {
    const response = await aiService.chat(messages);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
\`\`\`

## Embeddings

\`\`\`javascript
app.post('/api/embed', async (req, res) => {
  const { text } = req.body;
  
  try {
    const embedding = await aiService.getEmbedding(text);
    res.json({ embedding });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
\`\`\`

## Streaming Responses

\`\`\`javascript
app.post('/api/chat/stream', async (req, res) => {
  const { message } = req.body;
  
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const stream = await aiService.chatStream(message);
  
  stream.on('data', (chunk) => {
    res.write(\`data: \${chunk}\\n\\n\`);
  });

  stream.on('end', () => {
    res.write('data: [DONE]\\n\\n');
    res.end();
  });
});
\`\`\`

## Error Handling & Retries

\`\`\`javascript
const retry = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
\`\`\`

## Exercise 2.1 — Integrate AI Models
1. Create AI service layer
2. Add chat completion endpoint
3. Add embedding endpoint
4. Implement streaming endpoint
5. Add error handling and retries

## Next
We'll build the frontend to consume these APIs with real-time updates.`,
    'frontend-streaming': `# Module 3 — Frontend UX & Streaming

Duration: 1.5–2 hours

## Objective
Build a responsive frontend that consumes AI APIs with real-time streaming, loading states, and excellent user experience.

## Learning outcomes
- Build React components for AI interactions
- Implement streaming UI updates
- Handle loading and error states
- Create responsive, accessible interfaces
- Optimize for performance

## Basic Chat Component

\`\`\`jsx
import { useState } from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    setLoading(true);
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });
    const data = await response.json();
    setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: data.response }]);
    setInput('');
    setLoading(false);
  };

  return (
    <div className="chat">
      {messages.map((msg, i) => (
        <div key={i} className={msg.role}>{msg.content}</div>
      ))}
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage} disabled={loading}>
        Send
      </button>
    </div>
  );
}
\`\`\`

## Streaming UI

\`\`\`jsx
const sendMessageStream = async () => {
  setLoading(true);
  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: input })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullResponse = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') {
          setLoading(false);
          return;
        }
        fullResponse += data;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = fullResponse;
          return updated;
        });
      }
    }
  }
};
\`\`\`

## Loading States

\`\`\`jsx
{loading && (
  <div className="loading">
    <div className="spinner"></div>
    <span>Thinking...</span>
  </div>
)}
\`\`\`

## Error Handling

\`\`\`jsx
const [error, setError] = useState(null);

const sendMessage = async () => {
  try {
    setError(null);
    setLoading(true);
    // ... API call
  } catch (err) {
    setError('Failed to send message. Please try again.');
  } finally {
    setLoading(false);
  }
};

{error && (
  <div className="error">
    {error}
    <button onClick={() => setError(null)}>Dismiss</button>
  </div>
)}
\`\`\`

## Exercise 3.1 — Build Chat Frontend
1. Create chat component with message history
2. Implement streaming UI updates
3. Add loading and error states
4. Style for mobile and desktop
5. Test with real API calls

## Next
We'll add security measures and cost controls to protect your application.`,
    'security-cost-controls': `# Module 4 — Security & Cost Controls

Duration: 1–1.5 hours

## Objective
Implement security measures and cost controls to protect your application and manage API usage effectively.

## Learning outcomes
- Implement input validation and sanitization
- Add cost tracking and quotas
- Set up caching strategies
- Implement security best practices
- Monitor and limit API usage

## Input Validation

\`\`\`javascript
const validateInput = (input) => {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input');
  }
  if (input.length > 10000) {
    throw new Error('Input too long');
  }
  // Sanitize
  return input.trim().slice(0, 10000);
};

app.post('/api/chat', async (req, res) => {
  try {
    const message = validateInput(req.body.message);
    // Process message
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
\`\`\`

## Cost Tracking

\`\`\`javascript
const trackCost = async (userId, tokens, costPerToken) => {
  const cost = tokens * costPerToken;
  await db.costs.create({
    userId,
    tokens,
    cost,
    timestamp: new Date()
  });
  
  // Check quota
  const monthlyCost = await db.costs.sum('cost', {
    where: {
      userId,
      timestamp: { $gte: startOfMonth() }
    }
  });
  
  if (monthlyCost > QUOTA_LIMIT) {
    throw new Error('Monthly quota exceeded');
  }
};
\`\`\`

## Caching

\`\`\`javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const cacheKey = \`chat:\${message}\`;
  
  // Check cache
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({ response: cached, cached: true });
  }
  
  // Generate response
  const response = await aiService.chat(message);
  
  // Cache response
  cache.set(cacheKey, response);
  
  res.json({ response, cached: false });
});
\`\`\`

## Rate Limiting by User

\`\`\`javascript
const userRateLimit = {};

const checkRateLimit = (userId) => {
  const now = Date.now();
  const userLimit = userRateLimit[userId] || { count: 0, reset: now };
  
  if (now > userLimit.reset) {
    userLimit.count = 0;
    userLimit.reset = now + 60000; // 1 minute
  }
  
  if (userLimit.count >= 10) {
    throw new Error('Rate limit exceeded');
  }
  
  userLimit.count++;
  userRateLimit[userId] = userLimit;
};
\`\`\`

## Security Best Practices

- **API Keys**: Never expose in client code
- **HTTPS**: Always use encrypted connections
- **CORS**: Configure properly for production
- **Input Sanitization**: Validate and sanitize all inputs
- **Error Messages**: Don't leak sensitive information

## Exercise 4.1 — Add Security & Controls
1. Implement input validation
2. Add cost tracking
3. Set up caching
4. Implement user rate limiting
5. Test security measures

## Next
We'll deploy your application to production with CI/CD and monitoring.`,
    'deploy-operate': `# Module 5 — Deploy & Operate

Duration: 1.5–2 hours

## Objective
Deploy your fullstack AI application to production with CI/CD, monitoring, and operational best practices.

## Learning outcomes
- Deploy to serverless platforms (Netlify, Vercel)
- Set up containerized deployments
- Configure CI/CD pipelines
- Implement monitoring and logging
- Handle production issues

## Serverless Deployment (Netlify)

### Netlify Functions

\`\`\`javascript
// netlify/functions/chat.js
exports.handler = async (event, context) => {
  const { message } = JSON.parse(event.body);
  
  const response = await aiService.chat(message);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ response })
  };
};
\`\`\`

### Netlify Configuration

\`\`\`toml
# netlify.toml
[build]
  command = "npm run build"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
\`\`\`

## Container Deployment (Docker)

### Dockerfile

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server/index.js"]
\`\`\`

### Docker Compose

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
\`\`\`

## CI/CD Pipeline

### GitHub Actions

\`\`\`yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}
\`\`\`

## Monitoring

### Logging

\`\`\`javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
\`\`\`

### Metrics

\`\`\`javascript
const trackMetric = (name, value) => {
  // Send to monitoring service (DataDog, New Relic, etc.)
  console.log(\`Metric: \${name} = \${value}\`);
};

// Track API calls
app.post('/api/chat', async (req, res) => {
  const start = Date.now();
  try {
    const response = await aiService.chat(req.body.message);
    trackMetric('api.chat.success', 1);
    trackMetric('api.chat.duration', Date.now() - start);
    res.json({ response });
  } catch (error) {
    trackMetric('api.chat.error', 1);
    res.status(500).json({ error: error.message });
  }
});
\`\`\`

## Health Checks

\`\`\`javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
\`\`\`

## Exercise 5.1 — Deploy Application
1. Choose deployment platform
2. Set up environment variables
3. Configure CI/CD pipeline
4. Deploy to production
5. Set up monitoring and alerts

## Best Practices
- Use environment variables for secrets
- Implement proper error handling
- Set up monitoring from day one
- Test in staging before production
- Have a rollback plan
- Document deployment process

## Congratulations!
You've built and deployed a production-ready fullstack AI application. Continue learning with advanced topics like scaling, optimization, and specialized architectures.`
  };

  // Load lesson content
  useEffect(() => {
    setLoading(true);
    
    const loadedLessons: Lesson[] = [
      {
        id: 'setup',
        title: 'Setup & Starter',
        content: lessonContent['setup'],
        duration: '30–45 minutes',
        completed: false
      },
      {
        id: 'server-api-design',
        title: 'Server & API Design',
        content: lessonContent['server-api-design'],
        duration: '1.5–2 hours',
        completed: false
      },
      {
        id: 'model-integration',
        title: 'Model Integration',
        content: lessonContent['model-integration'],
        duration: '1.5–2 hours',
        completed: false
      },
      {
        id: 'frontend-streaming',
        title: 'Frontend UX & Streaming',
        content: lessonContent['frontend-streaming'],
        duration: '1.5–2 hours',
        completed: false
      },
      {
        id: 'security-cost-controls',
        title: 'Security & Cost Controls',
        content: lessonContent['security-cost-controls'],
        duration: '1–1.5 hours',
        completed: false
      },
      {
        id: 'deploy-operate',
        title: 'Deploy & Operate',
        content: lessonContent['deploy-operate'],
        duration: '1.5–2 hours',
        completed: false
      }
    ];

    setLessons(loadedLessons);

    // Set current lesson from URL or default to first
    if (lessonId) {
      const lessonExists = loadedLessons.find(l => l.id === lessonId);
      if (lessonExists) {
        setCurrentLessonId(lessonId);
      } else {
        setCurrentLessonId(loadedLessons[0]?.id || '');
      }
    } else {
      setCurrentLessonId(loadedLessons[0]?.id || '');
    }
    
    setLoading(false);
  }, [lessonId]);

  const handleLessonChange = (id: string) => {
    setCurrentLessonId(id);
    navigate(`/courses/fullstack-ai/${id}`, { replace: true });
  };

  const handleComplete = (id: string) => {
    setLessons(prev => prev.map(lesson =>
      lesson.id === id ? { ...lesson, completed: true } : lesson
    ));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'lessons', label: 'Lessons', icon: <Play className="w-4 h-4" /> }
  ];

  const completedCount = lessons.filter(l => l.completed).length;
  const progress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-dark text-text-primary relative overflow-hidden">
        <AuroraBackground opacity={0.6} speed={1.0} />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading course content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-dark text-text-primary relative overflow-hidden">
      <AuroraBackground opacity={0.6} speed={1.0} />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <PremiumButton
            variant="secondary"
            onClick={() => navigate('/marketplace')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </PremiumButton>

          <div className="card border-accent-blue/20 mb-6">
            <h1 className="text-hero-headline font-bold text-text-primary mb-4">
              {course?.name || 'Full-Stack AI Development'}
            </h1>
            <p className="text-subheadline text-text-secondary mb-6">
              {course?.description}
            </p>

            {/* Course Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="text-sm text-text-secondary mb-1">Duration</div>
                <div className="text-xl font-bold text-text-primary">{course?.duration}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="text-sm text-text-secondary mb-1">Level</div>
                <div className="text-xl font-bold text-text-primary capitalize">{course?.level}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="text-sm text-text-secondary mb-1">Progress</div>
                <div className="text-xl font-bold text-text-primary">
                  {completedCount} / {lessons.length} lessons
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-accent-blue to-accent-purple h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <PremiumTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={(tabId) => setActiveTab(tabId as 'lessons' | 'overview')}
            />
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="card">
            <h2 className="text-section-header font-bold text-text-primary mb-6">Course Overview</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-text-primary mb-4">What You'll Learn</h3>
              <ul className="space-y-3">
                {course?.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-text-secondary">
                    <CheckCircle2 className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-text-primary mb-4">Course Modules</h3>
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-accent-blue/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setActiveTab('lessons');
                      handleLessonChange(lesson.id);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-text-primary">{lesson.title}</h4>
                          {lesson.duration && (
                            <p className="text-sm text-text-secondary">{lesson.duration}</p>
                          )}
                        </div>
                      </div>
                      {lesson.completed && (
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="min-h-[600px]">
            <LessonViewer
              lessons={lessons}
              currentLessonId={currentLessonId}
              onLessonChange={handleLessonChange}
              onComplete={handleComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FullstackAICoursePage;
