import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Minus, Square, Play } from 'lucide-react';

interface TerminalProps {
  isVisible: boolean;
  onToggle: () => void;
}

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

export const Terminal: React.FC<TerminalProps> = ({ isVisible, onToggle }) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'output',
      content: 'Welcome to Bolt Terminal! Type commands to interact with your project.',
      timestamp: new Date()
    }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [lines]);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  const addLine = (type: TerminalLine['type'], content: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setLines(prev => [...prev, newLine]);
  };

  const executeCommand = async (command: string) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    // Add command to history
    setCommandHistory(prev => [...prev, trimmedCommand]);
    setHistoryIndex(-1);

    // Add command line
    addLine('command', `$ ${trimmedCommand}`);

    // Simulate command execution
    try {
      const output = await simulateCommand(trimmedCommand);
      if (output) {
        addLine('output', output);
      }
    } catch (error) {
      addLine('error', `Error: ${error}`);
    }
  };

  const simulateCommand = async (command: string): Promise<string> => {
    const [cmd, ...args] = command.split(' ');
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (cmd.toLowerCase()) {
      case 'help':
        return `Available commands:
  help          - Show this help message
  ls            - List files and directories
  pwd           - Show current directory
  clear         - Clear terminal
  npm           - Run npm commands
  git           - Run git commands
  echo          - Echo text
  date          - Show current date
  whoami        - Show current user`;

      case 'ls':
        return `src/
  components/
    IDE/
      ChatPanel.tsx
      CodeEditor.tsx
      FileExplorer.tsx
      PreviewPanel.tsx
      Terminal.tsx
    RAGApp.tsx
  App.tsx
  main.tsx
  index.css
package.json
vite.config.ts
README.md`;

      case 'pwd':
        return '/home/project';

      case 'clear':
        setLines([]);
        return '';

      case 'date':
        return new Date().toString();

      case 'whoami':
        return 'developer';

      case 'echo':
        return args.join(' ');

      case 'npm':
        if (args[0] === 'install' || args[0] === 'i') {
          return `Installing ${args.slice(1).join(' ')}...
✓ Package installed successfully`;
        }
        if (args[0] === 'run') {
          return `Running script: ${args[1]}...
✓ Script executed successfully`;
        }
        return 'npm command executed';

      case 'git':
        if (args[0] === 'status') {
          return `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   src/components/RAGApp.tsx

no changes added to commit`;
        }
        if (args[0] === 'add') {
          return `Added ${args.slice(1).join(' ')} to staging area`;
        }
        return 'git command executed';

      default:
        throw new Error(`Command not found: ${cmd}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
      setCurrentCommand('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        }
      }
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="h-80 bg-slate-900 text-slate-100 flex flex-col border-t border-slate-700">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <TerminalIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Terminal</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLines([])}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded"
            title="Clear terminal"
          >
            <Square className="h-3 w-3" />
          </button>
          <button
            onClick={onToggle}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded"
            title="Close terminal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm"
      >
        {lines.map((line) => (
          <div
            key={line.id}
            className={`mb-1 ${
              line.type === 'command' 
                ? 'text-green-400' 
                : line.type === 'error' 
                ? 'text-red-400' 
                : 'text-slate-300'
            }`}
          >
            {line.content}
          </div>
        ))}
        
        {/* Current Input Line */}
        <div className="flex items-center space-x-2">
          <span className="text-green-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-slate-100"
            placeholder="Type a command..."
          />
        </div>
      </div>
    </div>
  );
};