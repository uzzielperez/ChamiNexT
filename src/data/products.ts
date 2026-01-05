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
    description: 'Advanced project management and development toolkit designed for modern software teams, featuring AI-assisted planning and workflow optimization.',
    url: '#polaris',
    price: 149,
    category: 'development',
    features: [
      'AI-assisted project planning',
      'Team collaboration tools',
      'Workflow automation',
      'Performance analytics',
      'Integration ecosystem'
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