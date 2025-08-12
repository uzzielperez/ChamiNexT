import React, { useState } from 'react';
import { ArrowUp, Paperclip, Code, Search } from 'lucide-react';
import Button from './Button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatBox: React.FC = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);

  const handleSend = async (prompt?: string) => {
    const messageToSend = prompt || message;
    if (!messageToSend.trim()) return;

    const newConversation: Message[] = [...conversation, { role: 'user', content: messageToSend }];
    setConversation(newConversation);
    setMessage('');

    try {
      const response = await fetch('/.netlify/functions/groq-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await response.json();
      setConversation([...newConversation, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Error fetching from Groq API:', error);
    }
  };

  const samplePrompts = [
    'Find remote React jobs',
    'Most in-demand backend skills?',
    'Compare Senior vs. Junior salaries',
  ];

  return (
    <div className="bg-black text-white p-8 rounded-lg max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-block bg-gray-800 p-4 rounded-full">
          <Code className="w-12 h-12 text-gold-400" />
        </div>
        <h1 className="text-4xl font-bold mt-4">ChamiNexT</h1>
        <p className="text-lg text-gray-400">Your AI Assistant</p>
      </div>
      
      <div className="mt-8 space-y-4 min-h-[100px]">
        {conversation.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-lg max-w-lg ${msg.role === 'user' ? 'bg-gold-600' : 'bg-gray-700'}`}>
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
          className="w-full bg-gray-800 border border-gray-700 rounded-full py-4 pl-6 pr-24 text-lg"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          <Button size="icon" className="rounded-full" onClick={() => handleSend()}>
            <ArrowUp size={24} />
          </Button>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
        {samplePrompts.map((prompt) => (
          <button 
            key={prompt} 
            onClick={() => handleSend(prompt)}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-full flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatBox;
