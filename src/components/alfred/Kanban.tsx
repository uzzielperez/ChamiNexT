import React, { useState } from 'react';
import { Atom, Wallet, Heart, Truck, Palette, Plus, MoreHorizontal } from 'lucide-react';
import type { ProjectCategory, ProjectTask } from './data';

interface KanbanProps {
  tasks: ProjectTask[];
  onUpdateTask: (taskId: string, updates: Partial<ProjectTask>) => void;
}

const Kanban: React.FC<KanbanProps> = ({ tasks, onUpdateTask }) => {
  const categories: ProjectCategory[] = ['PHYSICS', 'FINANCE', 'HEALTH/LOVE', 'LOGISTICS', 'CREATIVE PROJECTS'];
  const [draggedTask, setDraggedTask] = useState<ProjectTask | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<ProjectCategory | null>(null);
  
  const categoryIcons: Record<ProjectCategory, any> = {
    'PHYSICS': Atom,
    'FINANCE': Wallet,
    'HEALTH/LOVE': Heart,
    'LOGISTICS': Truck,
    'CREATIVE PROJECTS': Palette
  };

  const handleDragStart = (e: React.DragEvent, task: ProjectTask) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
  };

  const handleDragOver = (e: React.DragEvent, category: ProjectCategory) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCategory(category);
  };

  const handleDragLeave = () => {
    setDragOverCategory(null);
  };

  const handleDrop = (e: React.DragEvent, targetCategory: ProjectCategory) => {
    e.preventDefault();
    if (draggedTask && draggedTask.category !== targetCategory) {
      onUpdateTask(draggedTask.id, { category: targetCategory });
    }
    setDraggedTask(null);
    setDragOverCategory(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverCategory(null);
  };

  return (
    <div className="p-8 h-full flex flex-col space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-[#00d2ff] jarvis-glow-text tracking-tighter uppercase italic">
          Strategic Matrix
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-[#00d2ff88] uppercase tracking-[0.4em]">Multi-Vector Task Distribution</span>
          <div className="h-[1px] w-24 bg-[#00d2ff22]"></div>
          <span className="text-[10px] text-emerald-500 font-mono animate-pulse">ACTIVE_RECONNAISSANCE</span>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {categories.map((cat) => {
          const Icon = categoryIcons[cat];
          const filteredTasks = tasks.filter(t => t.category === cat);
          
          return (
            <div 
              key={cat} 
              className={`flex-shrink-0 w-80 flex flex-col jarvis-panel border-t-2 transition-all ${
                dragOverCategory === cat 
                  ? 'border-t-[#00d2ff] bg-[#00d2ff08] shadow-[0_0_20px_rgba(0,210,255,0.2)]' 
                  : 'border-t-[#00d2ff44]'
              }`}
              onDragOver={(e) => handleDragOver(e, cat)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, cat)}
            >
              <div className="p-4 flex items-center justify-between border-b border-[#00d2ff11] bg-[#00d2ff03]">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 border border-[#00d2ff33] rounded-md text-[#00d2ff]">
                    <Icon size={14} />
                  </div>
                  <h3 className="text-[11px] font-black tracking-widest text-[#00d2ff] uppercase">{cat}</h3>
                </div>
                <span className="text-[10px] font-mono text-[#00d2ff44]">[{filteredTasks.length.toString().padStart(2, '0')}]</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {filteredTasks.map((task) => (
                  <div 
                    key={task.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    className={`group relative p-4 bg-[#00d2ff05] border border-[#00d2ff11] rounded-lg hover:border-[#00d2ff44] hover:bg-[#00d2ff0a] transition-all cursor-move ${
                      draggedTask?.id === task.id ? 'opacity-50 scale-95' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-[9px] font-mono text-[#00d2ff44]">ID_{task.id.toUpperCase()}</div>
                      <MoreHorizontal size={12} className="text-[#00d2ff22] group-hover:text-[#00d2ff44]" />
                    </div>
                    <p className="text-xs font-bold text-[#00d2ffbb] leading-relaxed group-hover:text-[#00d2ff]">{task.title}</p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${task.status === 'active' ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-[#00d2ff22]'}`}></div>
                        <span className="text-[8px] font-black uppercase tracking-tighter text-[#00d2ff44]">{task.status}</span>
                      </div>
                      <div className={`text-[8px] font-black px-1.5 py-0.5 rounded border border-[#00d2ff22] text-[#00d2ff66] uppercase tracking-tighter`}>
                        {task.priority}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredTasks.length === 0 && (
                  <div className={`h-24 border border-dashed rounded-lg flex items-center justify-center transition-all ${
                    dragOverCategory === cat 
                      ? 'border-[#00d2ff] bg-[#00d2ff08] shadow-[0_0_15px_rgba(0,210,255,0.3)]' 
                      : 'border-[#00d2ff11]'
                  }`}>
                    <span className={`text-[10px] font-mono uppercase tracking-widest transition-colors ${
                      dragOverCategory === cat ? 'text-[#00d2ff]' : 'text-[#00d2ff11]'
                    }`}>
                      {dragOverCategory === cat ? 'DROP_PROTOCOL_HERE' : 'No Active Protocols'}
                    </span>
                  </div>
                )}
              </div>

              <button className="m-4 p-2 border border-[#00d2ff22] border-dashed rounded-lg text-[#00d2ff44] hover:text-[#00d2ff] hover:border-[#00d2ff44] hover:bg-[#00d2ff05] transition-all flex items-center justify-center gap-2">
                <Plus size={14} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Initialize Task</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Kanban;
