import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Plus, Zap } from 'lucide-react';
import { cn } from '../utils/cn';

interface TerminalPanelProps {
  logs: string[];
  setLogs: React.Dispatch<React.SetStateAction<string[]>>;
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({ logs, setLogs }) => {
  const [activeTab, setActiveTab] = useState<'bolt' | 'terminal'>('terminal');
  const [inputValue, setInputValue] = useState('');
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setLogs(prev => [...prev, `$ ${inputValue}`]);
      
      // Simulate command execution
      setTimeout(() => {
        if (inputValue.includes('npm run dev')) {
          setLogs(prev => [
            ...prev,
            '→ Local:   http://localhost:5173/',
            '→ Network: use --host to expose',
            '→ press h + enter to show help'
          ]);
        } else if (inputValue.includes('npm install')) {
          setLogs(prev => [
            ...prev,
            'added 1234 packages, and audited 1234 packages in 2s',
            '123 packages are looking for funding',
            'found 0 vulnerabilities'
          ]);
        } else {
          setLogs(prev => [...prev, `Command executed: ${inputValue}`]);
        }
      }, 500);
      
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Terminal Tabs */}
      <div className="bg-gray-900 border-b border-gray-700 flex items-center px-3">
        <button
          onClick={() => setActiveTab('bolt')}
          className={cn(
            "flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors",
            activeTab === 'bolt'
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          )}
        >
          <Zap className="h-4 w-4" />
          <span>Bolt</span>
        </button>
        <button
          onClick={() => setActiveTab('terminal')}
          className={cn(
            "flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors",
            activeTab === 'terminal'
              ? "text-green-400 border-b-2 border-green-400"
              : "text-gray-400 hover:text-gray-300"
          )}
        >
          <Terminal className="h-4 w-4" />
          <span>Terminal</span>
        </button>
        <button className="ml-auto p-1 text-gray-400 hover:text-gray-300 transition-colors">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 bg-gray-900 p-3 flex flex-col">
        {/* Logs */}
        <div className="flex-1 overflow-y-auto font-mono text-sm text-gray-300 space-y-1">
          {logs.map((log, index) => (
            <div key={index} className="whitespace-pre-wrap">
              {log}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleInputSubmit} className="mt-2">
          <div className="flex items-center space-x-2">
            <span className="text-green-400 font-mono">$</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent text-gray-300 font-mono text-sm outline-none"
              placeholder="Enter command..."
              autoFocus
            />
          </div>
        </form>
      </div>
    </div>
  );
};
