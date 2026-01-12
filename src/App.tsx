import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JobSeekersPage from './pages/JobSeekersPage';
import VibeCoursePage from './pages/VibeCoursePage';
import BuildingRagsCoursePage from './pages/BuildingRagsCoursePage';
import AIAgentsCoursePage from './pages/AIAgentsCoursePage';
import FullstackAICoursePage from './pages/FullstackAICoursePage';
import PremiumHeader from './components/layout/PremiumHeader';
import Footer from './components/layout/Footer';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';
import EmployersPage from './pages/EmployersPage';
import MarketplacePage from './pages/MarketplacePage';
import CRMSamplePage from './pages/CRMSamplePage';
import PolarisSamplePage from './pages/PolarisSamplePage';
import PortfolioPage from './pages/PortfolioPage';
import AIShowcasePage from './pages/AIShowcasePage';

// Import premium design system styles
import './styles/design-system.css';
import './styles/animations.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <PremiumHeader />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobseekers" element={<JobSeekersPage />} />
            <Route path="/courses/vibe-coding/:lessonId?" element={<VibeCoursePage />} />
            <Route path="/courses/building-rags/:lessonId?" element={<BuildingRagsCoursePage />} />
            <Route path="/courses/ai-agents/:lessonId?" element={<AIAgentsCoursePage />} />
            <Route path="/courses/fullstack-ai/:lessonId?" element={<FullstackAICoursePage />} />
            <Route path="/employers" element={<EmployersPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/products/crm" element={<CRMSamplePage />} />
            <Route path="/products/polaris" element={<PolarisSamplePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/ai-showcase" element={<AIShowcasePage />} />
            <Route path="/infrastructure" element={<div className="min-h-screen bg-primary-dark text-text-primary p-8"><h1 className="text-4xl font-bold">Cloud Architecture - Coming Soon</h1><p className="mt-4 text-text-secondary">This page will showcase our cloud infrastructure and architecture.</p></div>} />
            <Route path="/performance" element={<div className="min-h-screen bg-primary-dark text-text-primary p-8"><h1 className="text-4xl font-bold">Performance Optimization - Coming Soon</h1><p className="mt-4 text-text-secondary">This page will showcase our performance optimization techniques and metrics.</p></div>} />
            <Route path="/api-docs" element={<div className="min-h-screen bg-primary-dark text-text-primary p-8"><h1 className="text-4xl font-bold">API Documentation - Coming Soon</h1><p className="mt-4 text-text-secondary">This page will contain comprehensive API documentation.</p></div>} />
            <Route path="/devops" element={<div className="min-h-screen bg-primary-dark text-text-primary p-8"><h1 className="text-4xl font-bold">DevOps & CI/CD - Coming Soon</h1><p className="mt-4 text-text-secondary">This page will showcase our DevOps practices and CI/CD pipeline.</p></div>} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;