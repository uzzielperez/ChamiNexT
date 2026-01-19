export interface Product {
  name: string;
  description: string;
  url: string;
  price?: number;
  category: 'health-tech' | 'wellness' | 'crm' | 'development' | 'ai';
  features: string[];
  image?: string;
  isPremium: boolean;
}

export interface Course {
  name: string;
  description: string;
  url: string;
  price?: number;
  duration?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  features: string[];
  isPremium: boolean;
}

export const products: Product[] = [
  {
    name: 'areuwell.org',
    description: 'Augmented healthcare intelligence platform that empowers patients with AI-driven insights and advocacy tools for better healthcare communication.',
    url: 'https://areuwell.org',
    price: 99,
    category: 'health-tech',
    features: [
      'AI-powered health advocacy',
      'Patient-provider communication tools',
      'Health journey tracking',
      'Personalized health insights',
      'Secure health data management'
    ],
    isPremium: true
  },
  {
    name: 'Manifest.ink',
    description: 'Meditation and mindfulness platform providing guided meditations, wellness resources, and tools for enhanced mental well-being and productivity.',
    url: 'https://manifest.ink',
    price: 79,
    category: 'wellness',
    features: [
      'Guided meditation sessions',
      'Mindfulness exercises',
      'Progress tracking',
      'Personalized wellness plans',
      'Community support'
    ],
    isPremium: true
  },
  {
    name: 'Polaris',
    description: 'A comprehensive travel companion that encourages exploration both near and far. Seamlessly book flights and hotels while discovering local adventures and finding the best public transportation routes to get you there.',
    url: '#polaris',
    price: 149,
    category: 'development',
    features: [
      'Unified flight and hotel booking',
      'Local travel discovery and recommendations',
      'Public transportation route optimization',
      'Real-time transit schedules and updates',
      'Explore nearby attractions and events',
      'Encourages local and global exploration',
      'Integrated itinerary management'
    ],
    isPremium: true
  },
  {
    name: 'ChamiNexT CRM',
    description: 'White-label customer relationship management system tailored for tech companies and startups, with built-in talent pipeline features.',
    url: '#crm',
    price: 199,
    category: 'crm',
    features: [
      'Contact management',
      'Sales pipeline tracking',
      'Automated workflows',
      'Analytics dashboard',
      'White-label customization'
    ],
    isPremium: true
  },
  {
    name: 'Kapwa Response',
    description: 'Socially-responsible disaster response and mapping platform for the Philippines, with integrated support for sustainable eco villages, conservation efforts, and community resilience.',
    url: '#kapwa-response',
    price: 0,
    category: 'development',
    features: [
      'Real-time disaster mapping',
      'Emergency response coordination',
      'Eco village support network',
      'Conservation project donations',
      'Community resource sharing',
      'Sustainable development tracking',
      'Multi-language support (Tagalog, English)'
    ],
    isPremium: false
  },
  {
    name: 'EventHub',
    description: 'Event management platform for organizing and joining local events like Sunday football matches, board game nights, and community gatherings. Reserve spots, pay securely, and connect with your community.',
    url: '#eventhub',
    price: 179,
    category: 'development',
    features: [
      'Event creation and management',
      'Spot reservation system',
      'Multi-location support (Madrid, Barcelona, Paris, Dubai, Turkey, etc.)',
      'Payment integration (Bizum, Credit Card, Debit Card)',
      'Event discovery and filtering',
      'Community building features'
    ],
    isPremium: true
  },
  {
    name: 'Alfred - AI Executive Assistant',
    description: 'Your intelligent executive assistant powered by AI. Manage your calendar, track spending, organize tasks with Kanban boards, and sync seamlessly with Google Calendar and iCloud. Features voice recognition, analytics dashboard, and strategic project management.',
    url: '#alfred',
    price: 249,
    category: 'ai',
    features: [
      'AI-powered chat interface with voice recognition',
      'Calendar integration (Google Calendar & iCloud)',
      'Kanban board for task management',
      'Analytics dashboard with spending tracking',
      'Multi-category project organization',
      'Real-time calendar sync portal',
      'Strategic decision support'
    ],
    isPremium: true
  }
];

export const courses: Course[] = [
  {
    name: 'Building RAGs (Retrieval-Augmented Generation)',
    description: 'Master the art of building Retrieval-Augmented Generation systems. Learn to combine large language models with external knowledge bases for enhanced AI applications.',
    url: '#rags-course',
    price: 299,
    duration: '8 weeks',
    level: 'intermediate',
    features: [
      'Hands-on RAG implementation',
      'Vector database integration',
      'Performance optimization',
      'Real-world case studies',
      'Code templates and examples'
    ],
    isPremium: true
  },
  {
    name: 'AI Agents Mastery',
    description: 'Comprehensive course on building autonomous AI agents. From basic chatbots to complex multi-agent systems that can perform real-world tasks.',
    url: '#ai-agents-course',
    price: 399,
    duration: '12 weeks',
    level: 'advanced',
    features: [
      'Multi-agent architectures',
      'Tool integration',
      'Decision-making algorithms',
      'Deployment strategies',
      'Industry best practices'
    ],
    isPremium: true
  },
  {
    name: 'Vibe Coding: Intuitive Development',
    description: 'A revolutionary approach to coding that emphasizes intuition, flow state, and natural problem-solving patterns for more enjoyable and productive development.',
    url: '#vibe-coding-course',
    price: 199,
    duration: '6 weeks',
    level: 'beginner',
    features: [
      'Flow state techniques',
      'Intuitive problem solving',
      'Productivity methods',
      'Mindful coding practices',
      'Community challenges'
    ],
    isPremium: true
  },
  {
    name: 'Full-Stack AI Development',
    description: 'End-to-end course covering AI application development from concept to deployment, including frontend, backend, and AI model integration.',
    url: '#fullstack-ai-course',
    price: 499,
    duration: '16 weeks',
    level: 'intermediate',
    features: [
      'Complete project builds',
      'AI model deployment',
      'Scalable architectures',
      'Production best practices',
      'Career guidance'
    ],
    isPremium: true
  }
];

// Utility functions
export const getProductsByCategory = (category: Product['category']) => {
  return products.filter(product => product.category === category);
};

export const getCoursesByLevel = (level: Course['level']) => {
  return courses.filter(course => course.level === level);
};

export const getPremiumProducts = () => {
  return products.filter(product => product.isPremium);
};

export const getPremiumCourses = () => {
  return courses.filter(course => course.isPremium);
};

export const getAllPremiumContent = () => {
  return {
    products: getPremiumProducts(),
    courses: getPremiumCourses()
  };
};