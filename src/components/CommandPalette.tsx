import React, { useState, useEffect } from 'react';
import { MessageSquare, Zap, Bot, User, Lightbulb, Send } from 'lucide-react';
import { cn } from '../utils/cn';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isCommand?: boolean;
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      isCommand: inputValue.startsWith('/'),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      let response = '';
      
      if (inputValue.startsWith('/new')) {
        response = '✅ Created new file: src/components/NewComponent.tsx';
      } else if (inputValue.startsWith('/deploy')) {
        response = '🚀 Deploying to production...\n✅ Build successful\n✅ Deployed to https://your-app.vercel.app';
      } else if (inputValue.startsWith('/run')) {
        response = '▶️ Running npm run dev...\n✅ Server started on http://localhost:5173';
      } else if (inputValue.includes('typing test')) {
        response = 'I can help you create a typing speed tester! Here\'s what we need to do:\n\n1. ✅ Create initial files\n2. ✅ Install dependencies\n3. ✅ Update src/App.tsx\n4. ✅ Create TypingTest component\n5. 🔄 Create text generator utility\n6. ⏳ Start application';
      } else {
        response = 'I\'m here to help you with your development workflow! Try commands like:\n\n• /new file - Create a new file\n• /deploy - Deploy your application\n• /run - Start the development server\n\nOr ask me about your code or project setup.';
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '/' && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-left text-gray-400 hover:text-gray-300 hover:border-gray-500 transition-colors flex items-center space-x-3"
          >
            <MessageSquare className="h-5 w-5" />
            <span>How can Bolt help you today? (or /command)</span>
            <div className="ml-auto flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span className="text-xs">G</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">G</span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-lg border border-gray-700 shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="h-5 w-5 text-blue-400" />
            <span className="font-semibold text-white">Bolt Assistant</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Bot className="h-12 w-12 mx-auto mb-4" />
              <p>I'm here to help you with your development workflow!</p>
              <p className="text-sm mt-2">Try commands like /new, /deploy, /run or ask me anything.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex space-x-3",
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    "max-w-3xl p-3 rounded-lg",
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300'
                  )}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {message.type === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                    <span className="text-xs opacity-75">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 p-3 rounded-lg flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span className="text-gray-400 text-sm">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="How can I help you today? (or /command)"
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
