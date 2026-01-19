import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, User, Sparkles, Cpu, Mic, MicOff } from 'lucide-react';
import type { ProjectCategory } from './data';

interface Message {
  role: 'alfred' | 'user';
  text: string;
}

interface ChatProps {
  onAddTask: (title: string, category: ProjectCategory) => void;
}

const Chat: React.FC<ChatProps> = ({ onAddTask }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: 'alfred', text: "NEURAL_LINK_ESTABLISHED. System Alfred online. Ready for strategic inquiries, Sir." }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice Recognition Setup
  const recognitionRef = useRef<any>(null);

  const handleVoiceSend = (text: string) => {
    if (!text.trim()) return;
    processMessage(text);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'speechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
        // Automatically send after voice capture
        handleVoiceSend(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const handleSend = () => {
    if (!message.trim()) return;
    processMessage(message);
    setMessage('');
  };

  const processMessage = (text: string) => {
    setChatHistory(prev => [...prev, { role: 'user', text }]);
    setIsTyping(true);

    setTimeout(() => {
      let response = '';
      const lower = text.toLowerCase();
      
      // Weekly Alignment Review Detection
      if (lower.includes('weekly alignment') || lower.includes('alignment review') || lower.includes('weekly review')) {
        const defaultAlignmentTasks = [
          { title: 'Review Physics Research Progress', category: 'PHYSICS' as ProjectCategory },
          { title: 'Financial Portfolio Assessment', category: 'FINANCE' as ProjectCategory },
          { title: 'Health Metrics & Relationship Check-in', category: 'HEALTH/LOVE' as ProjectCategory },
          { title: 'Logistics & Schedule Optimization', category: 'LOGISTICS' as ProjectCategory },
          { title: 'Creative Projects Status Update', category: 'CREATIVE PROJECTS' as ProjectCategory }
        ];

        // Check if user provided custom tasks after "weekly alignment review"
        const customTasksMatch = text.match(/(?:weekly alignment|alignment review|weekly review)[:\s-]+(.+)/i);
        if (customTasksMatch && customTasksMatch[1].trim()) {
          // Parse custom tasks - split by commas, semicolons, or newlines
          const customTasks = customTasksMatch[1]
            .split(/[,;\n]/)
            .map(t => t.trim())
            .filter(t => t.length > 0)
            .slice(0, 5); // Limit to 5 tasks

          // Try to match categories from custom task text
          const categories: ProjectCategory[] = ['PHYSICS', 'FINANCE', 'HEALTH/LOVE', 'LOGISTICS', 'CREATIVE PROJECTS'];
          customTasks.forEach((taskText, idx) => {
            const foundCategory = categories.find(cat => 
              taskText.toLowerCase().includes(cat.toLowerCase().replace('/', ' '))
            ) || defaultAlignmentTasks[idx]?.category || categories[idx % categories.length];
            
            onAddTask(taskText, foundCategory);
          });

          response = `ALIGNMENT_PROTOCOL_INITIATED: ${customTasks.length} strategic vectors logged across matrix sectors. Tasks are now movable in Strategic Matrix.`;
        } else {
          // Use default alignment tasks
          defaultAlignmentTasks.forEach(({ title, category }) => {
            onAddTask(title, category);
          });
          response = `ALIGNMENT_PROTOCOL_INITIATED: 5 default strategic vectors logged across all matrix sectors. Tasks are now movable in Strategic Matrix. Type "weekly alignment review: [your custom tasks]" to customize.`;
        }
      } else if (lower.includes('task') || lower.includes('add')) {
        const categories: ProjectCategory[] = ['PHYSICS', 'FINANCE', 'HEALTH/LOVE', 'LOGISTICS', 'CREATIVE PROJECTS'];
        const foundCategory = categories.find(cat => lower.includes(cat.toLowerCase()));
        
        if (foundCategory) {
          // Extract task title - everything after the category or after "add task to [cat]"
          let taskTitle = text;
          const catLower = foundCategory.toLowerCase();
          const splitIdx = lower.indexOf(catLower);
          if (splitIdx !== -1) {
            taskTitle = text.substring(splitIdx + catLower.length).replace(/^[:\s-]+/, '');
          }
          
          if (!taskTitle || taskTitle.length < 2) {
            taskTitle = "New Protocol Initiative";
          }

          onAddTask(taskTitle, foundCategory);
          response = `PROTOCOL_UPDATE: New initiative logged in [${foundCategory}] vector: "${taskTitle}". Processing task parameters now.`;
        } else {
          response = "AWAITING_CATEGORY_SPECIFICATION. Please designate task sector: PHYSICS, FINANCE, HEALTH/LOVE, LOGISTICS, or CREATIVE PROJECTS.";
        }
      } else if (lower.includes('spending') || lower.includes('spent')) {
        response = 'EXPENDITURE_REPORT: Current monthly allocation stands at $3,340.00. Primary sector: TRAVEL ($1,240.00 / 37%). Variance analysis indicates a 15.2% increase against historical 3-month baseline.';
      } else if (lower.includes('calendar') || lower.includes('meeting')) {
        response = 'TEMPORAL_QUERY: 21 engagements detected for current cycle. Cumulative duration: 16.5 hours. WEDNESDAY identified as peak density point (07 engagements).';
      } else if (lower.includes('habit') || lower.includes('goal')) {
        response = "BIO_METRIC_UPDATE: Workout consistency maintained (05-day streak / 60% of objective). Reading protocol active (85% completion / 12-day streak).";
      } else {
        response = "AWAITING_INPUT. I can provide analysis on schedule density, financial trajectories, or bio-efficiency tracking. Voice commands active.";
      }

      setChatHistory(prev => [...prev, { role: 'alfred', text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#000814] relative overflow-hidden">
      <div className="absolute inset-0 hex-bg opacity-20 pointer-events-none"></div>
      
      <div className="flex-1 overflow-auto p-8 relative">
        <div className="max-w-4xl mx-auto space-y-12">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-12 h-12 rounded-none border flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,210,255,0.1)] transition-colors duration-500 ${
                msg.role === 'user' ? 'bg-[#00d2ff11] border-[#00d2ff44] text-[#00d2ff]' : 'bg-[#000814] border-[#00d2ff22] text-[#00d2ff88]'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Cpu size={20} className="animate-spin-slow" />}
              </div>
              <div
                className={`max-w-[80%] px-8 py-5 relative border-l-2 leading-relaxed tracking-wide ${
                  msg.role === 'user'
                    ? 'border-[#00d2ff] bg-[#00d2ff08] text-[#00d2ff] font-bold'
                    : 'border-[#00d2ff44] bg-[#00d2ff03] text-[#00d2ffbb] font-mono text-sm'
                }`}
              >
                <div className="absolute top-0 left-0 w-4 h-[1px] bg-[#00d2ff44]"></div>
                <div className="absolute bottom-0 right-0 w-4 h-[1px] bg-[#00d2ff44]"></div>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-6">
              <div className="w-12 h-12 border border-[#00d2ff22] flex items-center justify-center shrink-0">
                <Cpu size={20} className="text-[#00d2ff44] animate-spin" />
              </div>
              <div className="text-[10px] font-mono text-[#00d2ff44] flex items-center gap-2">
                <span className="animate-pulse">PROCESSING_NEURAL_NODES...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-8 border-t border-[#00d2ff11] bg-[#000814]">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4">
            <button
              onClick={toggleListening}
              className={`jarvis-panel p-4 flex items-center justify-center transition-all duration-300 ${
                isListening ? 'bg-[#ff005511] border-[#ff0055] text-[#ff0055] shadow-[0_0_20px_rgba(255,0,85,0.4)]' : 'text-[#00d2ff44] hover:text-[#00d2ff]'
              }`}
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <div className="relative flex-1 jarvis-panel overflow-hidden">
              <div className="scanning-line opacity-5"></div>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00d2ff44]">
                <Terminal size={18} />
              </div>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "LISTENING..." : "INPUT_COMMAND_STRING_HERE..."}
                className="w-full bg-transparent border-none pl-14 pr-14 py-5 focus:outline-none text-[#00d2ff] placeholder:text-[#00d2ff22] font-mono tracking-widest text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || isTyping}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00d2ff44] hover:text-[#00d2ff] transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-6 px-4">
            <span className="text-[9px] font-black text-[#00d2ff22] uppercase tracking-[0.3em]">Quick_Sectors:</span>
            {['PHYSICS', 'FINANCE', 'HEALTH/LOVE', 'LOGISTICS', 'CREATIVE PROJECTS'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setMessage(`Add task to ${suggestion.toLowerCase()}: `)}
                className="text-[9px] font-bold text-[#00d2ff44] hover:text-[#00d2ff] transition-all hover:tracking-[0.2em] uppercase tracking-widest flex items-center gap-2 bg-[#00d2ff05] px-2 py-1 border border-[#00d2ff11] rounded"
              >
                <Sparkles size={10} />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
