import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JobSeekersPage from './pages/JobSeekersPage';
import VibeCoursePage from './pages/VibeCoursePage';
import BuildingRagsCoursePage from './pages/BuildingRagsCoursePage';
import AIAgentsCoursePage from './pages/AIAgentsCoursePage';
import PremiumHeader from './components/layout/PremiumHeader';
import Footer from './components/layout/Footer';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';
import EmployersPage from './pages/EmployersPage';
import MarketplacePage from './pages/MarketplacePage';

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
            <Route path="/employers" element={<EmployersPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
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