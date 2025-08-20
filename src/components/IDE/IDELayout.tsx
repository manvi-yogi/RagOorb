import React, { useState, useEffect } from 'react';
import { ChatPanel } from './ChatPanel';
import { FileExplorer } from './FileExplorer';
import { CodeEditor } from './CodeEditor';
import { PreviewPanel } from './PreviewPanel';
import { Terminal } from './Terminal';
import { TerminalIcon, Layout, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  content?: string;
  language?: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: string[];
  codeBlocks?: Array<{
    language: string;
    code: string;
    filename?: string;
  }>;
}

export const IDELayout: React.FC = () => {
  const [files, setFiles] = useState<FileNode[]>([
    {
      id: '1',
      name: 'src',
      type: 'folder',
      path: 'src',
      children: [
        {
          id: '2',
          name: 'App.tsx',
          type: 'file',
          path: 'src/App.tsx',
          content: `import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Your App
        </h1>
        <p className="text-lg text-gray-600">
          Start building something amazing!
        </p>
      </div>
    </div>
  );
}

export default App;`,
          language: 'typescript'
        },
        {
          id: '3',
          name: 'main.tsx',
          type: 'file',
          path: 'src/main.tsx',
          content: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
          language: 'typescript'
        },
        {
          id: '4',
          name: 'index.css',
          type: 'file',
          path: 'src/index.css',
          content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`,
          language: 'css'
        }
      ]
    }
  ]);

  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(message),
        timestamp: new Date(),
        files: ['src/App.tsx', 'src/components/NewComponent.tsx'],
        codeBlocks: [
          {
            language: 'typescript',
            filename: 'src/components/NewComponent.tsx',
            code: generateCodeForPrompt(message)
          }
        ]
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const generateAIResponse = (prompt: string): string => {
    if (prompt.toLowerCase().includes('landing page')) {
      return "I'll create a beautiful landing page for you with modern design and responsive layout. The page will include a hero section, features, and call-to-action buttons.";
    }
    if (prompt.toLowerCase().includes('login')) {
      return "I'll create a login form with validation, proper styling, and form handling. The form will include email and password fields with error states.";
    }
    if (prompt.toLowerCase().includes('todo')) {
      return "I'll build a complete todo application with add, edit, delete, and mark as complete functionality. It will use local storage to persist data.";
    }
    return "I'll help you build that! Let me create the necessary files and components for your request.";
  };

  const generateCodeForPrompt = (prompt: string): string => {
    if (prompt.toLowerCase().includes('landing page')) {
      return `import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Our Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Build amazing applications with our powerful tools and intuitive interface.
          </p>
          <div className="space-x-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;`;
    }

    return `import React from 'react';

const NewComponent: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">New Component</h2>
      <p>This component was generated based on your request.</p>
    </div>
  );
};

export default NewComponent;`;
  };

  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file);
    }
  };

  const handleFileSave = (path: string, content: string) => {
    setFiles(prevFiles => {
      const updateFileContent = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.path === path) {
            return { ...node, content };
          }
          if (node.children) {
            return { ...node, children: updateFileContent(node.children) };
          }
          return node;
        });
      };
      return updateFileContent(prevFiles);
    });

    // Update selected file if it's the one being saved
    if (selectedFile?.path === path) {
      setSelectedFile(prev => prev ? { ...prev, content } : null);
    }
  };

  const handleCreateFile = (filename: string, content: string) => {
    const newFile: FileNode = {
      id: Date.now().toString(),
      name: filename.split('/').pop() || filename,
      type: 'file',
      path: filename,
      content,
      language: filename.split('.').pop() || 'text'
    };

    // Add to src folder for simplicity
    setFiles(prevFiles => {
      const addToSrc = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.path === 'src' && node.children) {
            return {
              ...node,
              children: [...node.children, newFile]
            };
          }
          if (node.children) {
            return { ...node, children: addToSrc(node.children) };
          }
          return node;
        });
      };
      return addToSrc(prevFiles);
    });

    setSelectedFile(newFile);
  };

  const handleFileCreate = (path: string, type: 'file' | 'folder') => {
    // Implementation for creating new files/folders
    console.log('Create', type, 'at', path);
  };

  const handleFileDelete = (path: string) => {
    setFiles(prevFiles => {
      const removeFile = (nodes: FileNode[]): FileNode[] => {
        return nodes.filter(node => {
          if (node.path === path) {
            return false;
          }
          if (node.children) {
            node.children = removeFile(node.children);
          }
          return true;
        });
      };
      return removeFile(prevFiles);
    });

    if (selectedFile?.path === path) {
      setSelectedFile(null);
    }
  };

  const handleFileRename = (oldPath: string, newPath: string) => {
    // Implementation for renaming files
    console.log('Rename', oldPath, 'to', newPath);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      {/* Top Bar */}
      <div className="h-12 bg-slate-900 text-white flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Layout className="h-5 w-5" />
            <span className="font-semibold">Bolt IDE</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded"
            title="Toggle left panel"
          >
            {leftPanelCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
          
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`p-1.5 rounded transition-colors ${
              showTerminal 
                ? 'text-blue-400 bg-slate-700' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            title="Toggle terminal"
          >
            <TerminalIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat */}
        {!leftPanelCollapsed && (
          <div className="w-80 flex-shrink-0">
            <ChatPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onCreateFile={handleCreateFile}
            />
          </div>
        )}

        {/* Center Panel - Editor */}
        <div className="flex-1 flex flex-col">
          <div className={`flex-1 ${showTerminal ? 'h-1/2' : ''}`}>
            <CodeEditor
              file={selectedFile}
              onSave={handleFileSave}
            />
          </div>
          
          {/* Terminal */}
          <Terminal
            isVisible={showTerminal}
            onToggle={() => setShowTerminal(!showTerminal)}
          />
        </div>

        {/* Right Panel - File Explorer & Preview */}
        {!rightPanelCollapsed && (
          <div className="w-80 flex-shrink-0 flex flex-col">
            {/* File Explorer */}
            <div className="h-1/2 border-b border-slate-200">
              <FileExplorer
                files={files}
                selectedFile={selectedFile?.path}
                onFileSelect={handleFileSelect}
                onFileCreate={handleFileCreate}
                onFileDelete={handleFileDelete}
                onFileRename={handleFileRename}
              />
            </div>
            
            {/* Preview */}
            <div className="h-1/2">
              <PreviewPanel />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};