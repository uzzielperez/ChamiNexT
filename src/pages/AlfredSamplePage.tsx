import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumButton from '../components/ui/PremiumButton';
import { ArrowLeft } from 'lucide-react';
import Sidebar from '../components/alfred/Sidebar';
import Dashboard from '../components/alfred/Dashboard';
import Chat from '../components/alfred/Chat';
import Kanban from '../components/alfred/Kanban';
import SyncPortal from '../components/alfred/SyncPortal';
import ErrorBoundary from '../components/alfred/ErrorBoundary';
import { initialTasks } from '../components/alfred/data';
import type { ProjectTask, ProjectCategory, CalendarEvent } from '../components/alfred/data';
import '../styles/alfred.css';

const AlfredSamplePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'chat' | 'kanban' | 'sync'>('dashboard');
  const [tasks, setTasks] = useState<ProjectTask[]>(initialTasks);
  const [liveEvents] = useState<CalendarEvent[]>([]);

  const addTask = (title: string, category: ProjectCategory) => {
    const newTask: ProjectTask = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      category,
      status: 'active',
      priority: 'medium'
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (taskId: string, updates: Partial<ProjectTask>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#000814] text-[#00d2ff] font-sans relative overflow-hidden">
        {/* Back button */}
        <div className="absolute top-4 left-4 z-50">
          <PremiumButton
            variant="secondary"
            onClick={() => navigate('/marketplace')}
            className="flex items-center gap-2 bg-[#00d2ff11] border-[#00d2ff44] text-[#00d2ff] hover:bg-[#00d2ff22]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </PremiumButton>
        </div>

        {/* Background holographic grid */}
        <div className="absolute inset-0 hex-bg opacity-30 pointer-events-none"></div>
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-[#00d2ff11] -ml-4 -mt-4 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[#00d2ff11] -mr-4 -mb-4 pointer-events-none"></div>

        <div className="flex h-screen w-screen">
          <Sidebar activeView={activeView} setActiveView={setActiveView} />

          <main className="flex-1 overflow-hidden relative">
            {/* Scanning line for the whole main area */}
            <div className="scanning-line opacity-[0.03] pointer-events-none"></div>
            
            <div className="h-full overflow-auto relative z-10 custom-scrollbar">
              {activeView === 'dashboard' && <Dashboard liveEvents={liveEvents} />}
              {activeView === 'chat' && <Chat onAddTask={addTask} />}
              {activeView === 'kanban' && <Kanban tasks={tasks} onUpdateTask={updateTask} />}
              {activeView === 'sync' && <SyncPortal />}
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AlfredSamplePage;
