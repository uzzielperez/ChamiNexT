import React, { useState } from 'react';
import { ArrowUp, Paperclip } from 'lucide-react';
import Button from './Button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatBox: React.FC = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const newConversation: Message[] = [...conversation, { role: 'user', content: message }];
    setConversation(newConversation);
    setMessage('');

    try {
      const response = await fetch('/.netlify/functions/groq-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setConversation([...newConversation, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Error fetching from Groq API:', error);
    }
  };

  return (
    <div className="bg-black text-white p-8 rounded-lg max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-block bg-gray-800 p-4 rounded-full">
          {/* You can replace this with an actual logo */}
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mt-4">Apprie</h1>
        <p className="text-lg text-gray-400">Medical Copilot by Apprie AI</p>
      </div>

      <div className="mt-8 space-y-4">
        {conversation.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-lg max-w-lg ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-8">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="w-full bg-gray-800 border border-gray-700 rounded-full py-4 pl-12 pr-24 text-lg"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          {/* Replace with your model selector */}
          <span className="text-gray-400">Groq Allam 2-7B</span>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          <button className="text-gray-400 hover:text-white">
            <Paperclip size={24} />
          </button>
          <Button size="icon" className="rounded-full" onClick={handleSend}>
            <ArrowUp size={24} />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        {['Clinical', 'Research', 'Education', 'Administration', 'Billing', 'Products'].map((tag) => (
          <button key={tag} className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-full">
            {tag}
          </button>
        ))}
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {['Pseudogout treatment...', 'Thyroid cancer remissio...', 'Track my symptoms to...'].map((prompt) => (
          <button key={prompt} className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-full flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatBox;
