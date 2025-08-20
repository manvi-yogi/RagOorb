import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, File, Folder, CheckCircle, Circle, Play, Terminal, Code, Eye, GitBranch, Settings, Zap } from 'lucide-react';
import { WorkflowPanel } from './WorkflowPanel';
import { CodeEditor } from './CodeEditor';
import { FileExplorer } from './FileExplorer';
import { TerminalPanel } from './TerminalPanel';
import { CommandPalette } from './CommandPalette';
import { cn } from '../utils/cn';

interface WorkflowStep {
  id: string;
  title: string;
  completed: boolean;
  command?: string;
  description?: string;
}

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  content?: string;
  language?: string;
}

export const DeveloperWorkspace: React.FC = () => {
  const [activeView, setActiveView] = useState<'code' | 'preview'>('code');
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    { id: '1', title: 'Create initial files', completed: true },
    { id: '2', title: 'Install dependencies', completed: true, command: 'npm install' },
    { id: '3', title: 'Update src/App.tsx', completed: true },
    { id: '4', title: 'Create src/components/TypingTest.tsx', completed: true },
    { id: '5', title: 'Create src/components/TextDisplay.tsx', completed: true },
    { id: '6', title: 'Create src/components/StatsDisplay.tsx', completed: true },
    { id: '7', title: 'Create src/utils/textGenerator.ts', completed: false },
    { id: '8', title: 'Start application', completed: false, command: 'npm run dev' },
  ]);

  const [fileTree, setFileTree] = useState<FileNode[]>([
    {
      id: '1',
      name: 'src',
      type: 'folder',
      path: 'src',
      children: [
        {
          id: '2',
          name: 'components',
          type: 'folder',
          path: 'src/components',
          children: [
            { id: '3', name: 'StatsDisplay.tsx', type: 'file', path: 'src/components/StatsDisplay.tsx', language: 'typescript' },
            { id: '4', name: 'TextDisplay.tsx', type: 'file', path: 'src/components/TextDisplay.tsx', language: 'typescript' },
            { id: '5', name: 'TypingTest.tsx', type: 'file', path: 'src/components/TypingTest.tsx', language: 'typescript' },
          ]
        },
        {
          id: '6',
          name: 'utils',
          type: 'folder',
          path: 'src/utils',
          children: [
            { id: '7', name: 'textGenerator.ts', type: 'file', path: 'src/utils/textGenerator.ts', language: 'typescript' },
          ]
        },
        { id: '8', name: 'App.tsx', type: 'file', path: 'src/App.tsx', language: 'typescript' },
        { id: '9', name: 'index.css', type: 'file', path: 'src/index.css', language: 'css' },
        { id: '10', name: 'main.tsx', type: 'file', path: 'src/main.tsx', language: 'typescript' },
      ]
    },
    { id: '11', name: 'package.json', type: 'file', path: 'package.json', language: 'json' },
    { id: '12', name: 'vite.config.ts', type: 'file', path: 'vite.config.ts', language: 'typescript' },
    { id: '13', name: 'tailwind.config.js', type: 'file', path: 'tailwind.config.js', language: 'javascript' },
  ]);

  const [selectedFile, setSelectedFile] = useState<string>('src/utils/textGenerator.ts');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '→ Network: use --host to expose',
    '→ press h + enter to show help',
    'Browserslist: caniuse-lite is outdated. Please run: npx update-browserslist-db@latest',
    'Why you should do it regularly: https://github.com/browserslist/update-db#readme'
  ]);

  const [openFiles, setOpenFiles] = useState<string[]>([selectedFile]);

  const handleFileSelect = (filePath: string) => {
    setSelectedFile(filePath);
    if (!openFiles.includes(filePath)) {
      setOpenFiles([...openFiles, filePath]);
    }
  };

  const handleFileClose = (filePath: string) => {
    setOpenFiles(openFiles.filter(f => f !== filePath));
    if (selectedFile === filePath && openFiles.length > 1) {
      const remainingFiles = openFiles.filter(f => f !== filePath);
      setSelectedFile(remainingFiles[remainingFiles.length - 1]);
    }
  };

  const getFileContent = (filePath: string): string => {
    // Mock file contents - in a real app, this would fetch from the file system
    const fileContents: Record<string, string> = {
      'src/utils/textGenerator.ts': `const SYMBOLS = [
  '{}', '[]', '()', '+-', '*/', '&&', '||', '==', '!=', '===', '!==',
  '<=', '>=', '++', '--', '+=', '-=', '*=', '/=', '%=', '<<', '>>'
];

const KEYWORDS = [
  'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'return',
  'function', 'const', 'let', 'var', 'class', 'def', 'import', 'from',
  'export', 'default', 'async', 'await', 'try', 'catch', 'finally',
  'throw', 'new', 'this', 'super', 'extends', 'implements', 'interface',
  'type', 'boolean', 'string', 'number', 'array', 'object'
];

const CODE_SNIPPETS = [
  'for (let i = 0; i < arr.length; i++) { console.log(arr[i]); }',
  'const sum = (a, b) => { return a + b; }',
  'if (condition) { doSomething(); } else { doSomethingElse(); }',
  'class MyClass { constructor() { this.value = 0; } }',
  'async function fetchData() { const response = await fetch(url); return response.json(); }'
];

export const generateRandomText = (type: 'symbols' | 'keywords' | 'snippets' | 'mixed'): string => {
  switch (type) {
    case 'symbols':
      return Array.from({ length: 50 }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]).join(' ');
    case 'keywords':
      return Array.from({ length: 30 }, () => KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)]).join(' ');
    case 'snippets':
      return CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
    case 'mixed':
      const allItems = [...SYMBOLS, ...KEYWORDS, ...CODE_SNIPPETS];
      return Array.from({ length: 20 }, () => allItems[Math.floor(Math.random() * allItems.length)]).join(' ');
    default:
      return '';
  }
};`,
      'src/App.tsx': `import React from 'react';
import { TypingTest } from './components/TypingTest';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">CodeTyper</h1>
        <TypingTest />
      </div>
    </div>
  );
}

export default App;`,
      'src/components/TypingTest.tsx': `import React, { useState, useEffect, useRef } from 'react';
import { TextDisplay } from './TextDisplay';
import { StatsDisplay } from './StatsDisplay';
import { generateRandomText } from '../utils/textGenerator';

export const TypingTest: React.FC = () => {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [errors, setErrors] = useState<number[]>([]);
  const [textType, setTextType] = useState<'symbols' | 'keywords' | 'snippets' | 'mixed'>('mixed');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    generateNewText();
  }, [textType]);

  const generateNewText = () => {
    const newText = generateRandomText(textType);
    setText(newText);
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsActive(false);
    setErrors([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    if (!isActive && value.length > 0) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    // Check for errors
    const newErrors: number[] = [];
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) {
        newErrors.push(i);
      }
    }
    setErrors(newErrors);

    // Check if completed
    if (value.length === text.length) {
      setEndTime(Date.now());
      setIsActive(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && endTime) {
      generateNewText();
    }
  };

  const accuracy = text.length > 0 ? ((text.length - errors.length) / text.length) * 100 : 100;
  const wpm = startTime && endTime ? Math.round((text.split(' ').length / ((endTime - startTime) / 60000))) : 0;
  const timeElapsed = startTime && endTime ? (endTime - startTime) / 1000 : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-center space-x-4 mb-4">
          {(['symbols', 'keywords', 'snippets', 'mixed'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTextType(type)}
              className={\`px-4 py-2 rounded-lg font-medium transition-colors \${
                textType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }\`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={generateNewText}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          New Text
        </button>
      </div>

      <TextDisplay text={text} userInput={userInput} errors={errors} />

      <div className="mt-6">
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={endTime !== null}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          placeholder="Start typing here..."
          autoFocus
        />
      </div>

      <StatsDisplay
        wpm={wpm}
        accuracy={accuracy}
        timeElapsed={timeElapsed}
        isActive={isActive}
        completed={endTime !== null}
      />
    </div>
  );
};`,
    };

    return fileContents[filePath] || '// File content not available';
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-400" />
            <span className="font-semibold">Programming Typing Speed Tester</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveView('code')}
            className={cn(
              "flex items-center space-x-2 px-3 py-1 rounded text-sm transition-colors",
              activeView === 'code' 
                ? "bg-gray-700 text-white" 
                : "text-gray-400 hover:text-white"
            )}
          >
            <Code className="h-4 w-4" />
            <span>Code</span>
          </button>
          <button
            onClick={() => setActiveView('preview')}
            className={cn(
              "flex items-center space-x-2 px-3 py-1 rounded text-sm transition-colors",
              activeView === 'preview' 
                ? "bg-gray-700 text-white" 
                : "text-gray-400 hover:text-white"
            )}
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Workflow */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          <WorkflowPanel 
            steps={workflowSteps} 
            setSteps={setWorkflowSteps}
            onStepComplete={(stepId) => {
              setWorkflowSteps(steps => 
                steps.map(step => 
                  step.id === stepId 
                    ? { ...step, completed: true }
                    : step
                )
              );
            }}
          />
        </div>

        {/* Right Panel - Editor/Preview */}
        <div className="flex-1 flex flex-col">
          {/* File Explorer and Editor */}
          <div className="flex-1 flex">
            {/* File Explorer Sidebar */}
            <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
              <div className="p-3 border-b border-gray-700">
                <div className="flex items-center space-x-2 text-sm font-medium">
                  <File className="h-4 w-4" />
                  <span>Files</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <FileExplorer 
                  files={fileTree}
                  selectedFile={selectedFile}
                  onFileSelect={handleFileSelect}
                  openFiles={openFiles}
                  onFileClose={handleFileClose}
                />
              </div>
            </div>

            {/* Code Editor or Preview */}
            <div className="flex-1 flex flex-col">
              {activeView === 'code' ? (
                <CodeEditor
                  openFiles={openFiles}
                  selectedFile={selectedFile}
                  onFileSelect={setSelectedFile}
                  onFileClose={handleFileClose}
                  getFileContent={getFileContent}
                />
              ) : (
                <div className="flex-1 bg-white">
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Play className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>Preview mode - Run the app to see live changes</p>
                      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Run App
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Terminal */}
          <div className="h-48 bg-gray-800 border-t border-gray-700">
            <TerminalPanel logs={terminalLogs} setLogs={setTerminalLogs} />
          </div>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette />
    </div>
  );
};
