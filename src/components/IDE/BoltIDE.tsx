import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Loader2, 
  MessageSquare, 
  Code, 
  FileText, 
  Sparkles,
  Play,
  Square,
  RefreshCw,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  Terminal as TerminalIcon,
  Folder,
  FolderOpen,
  File,
  Image,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Save,
  Copy,
  X,
  Eye,
  EyeOff,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

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

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

export const BoltIDE: React.FC = () => {
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // File system state
  const [files, setFiles] = useState<FileNode[]>([
    {
      id: '1',
      name: 'index.html',
      type: 'file',
      path: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="app">
        <div class="min-h-screen bg-gray-100 flex items-center justify-center">
            <h1 class="text-4xl font-bold text-gray-900">Welcome to Your App</h1>
        </div>
    </div>
</body>
</html>`,
      language: 'html'
    }
  ]);
  
  // Editor state
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Terminal state
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
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
  
  // Preview state
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewContent, setPreviewContent] = useState('');
  
  // Layout state
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [showTerminal, setShowTerminal] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [leftPanelWidth, setLeftPanelWidth] = useState(320);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  // Initialize with first file selected
  useEffect(() => {
    if (files.length > 0 && !selectedFile) {
      setSelectedFile(files[0]);
    }
  }, [files, selectedFile]);

  // Update preview when files change
  useEffect(() => {
    const htmlFile = findFileByPath(files, 'index.html');
    if (htmlFile && htmlFile.content) {
      setPreviewContent(htmlFile.content);
    }
  }, [files]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  // Utility functions
  const findFileByPath = (fileList: FileNode[], path: string): FileNode | null => {
    for (const file of fileList) {
      if (file.path === path) return file;
      if (file.children) {
        const found = findFileByPath(file.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  const getFileIcon = (file: FileNode) => {
    if (file.type === 'folder') {
      return expandedFolders.has(file.path) ? FolderOpen : Folder;
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return Code;
      case 'json':
      case 'html':
      case 'css':
        return FileText;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return Image;
      default:
        return File;
    }
  };

  const getLanguageFromFile = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'text';
    }
  };

  // Chat functions
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response with code generation
    setTimeout(() => {
      const response = generateAIResponse(userMessage.content);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.message,
        timestamp: new Date(),
        files: response.files,
        codeBlocks: response.codeBlocks
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Create/update files based on response
      if (response.codeBlocks) {
        response.codeBlocks.forEach(block => {
          if (block.filename) {
            createOrUpdateFile(block.filename, block.code);
          }
        });
      }
      
      setIsLoading(false);
    }, 2000);
  };

  const generateAIResponse = (prompt: string) => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('landing page') || lowerPrompt.includes('homepage')) {
      return {
        message: "I'll create a beautiful landing page for you with modern design and responsive layout. The page will include a hero section, features, and call-to-action buttons.",
        files: ['index.html', 'styles.css'],
        codeBlocks: [
          {
            language: 'html',
            filename: 'index.html',
            code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Landing Page</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <!-- Header -->
        <header class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-6">
                    <div class="flex items-center">
                        <h1 class="text-2xl font-bold text-gray-900">YourBrand</h1>
                    </div>
                    <nav class="hidden md:flex space-x-8">
                        <a href="#" class="text-gray-500 hover:text-gray-900">Home</a>
                        <a href="#" class="text-gray-500 hover:text-gray-900">About</a>
                        <a href="#" class="text-gray-500 hover:text-gray-900">Services</a>
                        <a href="#" class="text-gray-500 hover:text-gray-900">Contact</a>
                    </nav>
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Get Started
                    </button>
                </div>
            </div>
        </header>

        <!-- Hero Section -->
        <section class="py-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 class="text-5xl font-bold text-gray-900 mb-6">
                    Build Amazing Products
                </h1>
                <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    Create stunning websites and applications with our powerful tools and intuitive interface. 
                    Join thousands of developers who trust our platform.
                </p>
                <div class="space-x-4">
                    <button class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg">
                        Start Building
                    </button>
                    <button class="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors text-lg">
                        Learn More
                    </button>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
                    <p class="text-lg text-gray-600">Everything you need to build amazing products</p>
                </div>
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="text-center p-6">
                        <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                        <p class="text-gray-600">Built for speed and performance with modern technologies</p>
                    </div>
                    <div class="text-center p-6">
                        <div class="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Reliable</h3>
                        <p class="text-gray-600">99.9% uptime with enterprise-grade infrastructure</p>
                    </div>
                    <div class="text-center p-6">
                        <div class="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Easy to Use</h3>
                        <p class="text-gray-600">Intuitive interface designed for developers of all levels</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-20 bg-blue-600">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 class="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
                <p class="text-xl text-blue-100 mb-8">Join thousands of developers building amazing products</p>
                <button class="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold">
                    Start Your Free Trial
                </button>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h3 class="text-2xl font-bold mb-4">YourBrand</h3>
                    <p class="text-gray-400 mb-8">Building the future, one line of code at a time.</p>
                    <div class="flex justify-center space-x-6">
                        <a href="#" class="text-gray-400 hover:text-white">Privacy</a>
                        <a href="#" class="text-gray-400 hover:text-white">Terms</a>
                        <a href="#" class="text-gray-400 hover:text-white">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</body>
</html>`
          },
          {
            language: 'css',
            filename: 'styles.css',
            code: `/* Custom styles for enhanced animations */
.fade-in {
    animation: fadeIn 0.6s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.hover-scale {
    transition: transform 0.2s ease;
}

.hover-scale:hover {
    transform: scale(1.05);
}

/* Smooth scrolling */
html {
    scroll-behavior: smooth;
}

/* Custom button hover effects */
button {
    transition: all 0.2s ease;
}

button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}`
          }
        ]
      };
    }
    
    if (lowerPrompt.includes('login') || lowerPrompt.includes('auth')) {
      return {
        message: "I'll create a beautiful login form with validation and modern styling.",
        files: ['login.html', 'login.js'],
        codeBlocks: [
          {
            language: 'html',
            filename: 'login.html',
            code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Your App</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Or
                    <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                        create a new account
                    </a>
                </p>
            </div>
            <form class="mt-8 space-y-6" id="loginForm">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="email" class="sr-only">Email address</label>
                        <input id="email" name="email" type="email" required 
                               class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                               placeholder="Email address">
                    </div>
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <input id="password" name="password" type="password" required 
                               class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                               placeholder="Password">
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" 
                               class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                        <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                            Remember me
                        </label>
                    </div>

                    <div class="text-sm">
                        <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                            Forgot your password?
                        </a>
                    </div>
                </div>

                <div>
                    <button type="submit" 
                            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Sign in
                    </button>
                </div>
            </form>
        </div>
    </div>
    <script src="login.js"></script>
</body>
</html>`
          },
          {
            language: 'javascript',
            filename: 'login.js',
            code: `// Login form validation and handling
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Simulate login process
    const button = e.target.querySelector('button[type="submit"]');
    button.textContent = 'Signing in...';
    button.disabled = true;
    
    setTimeout(() => {
        alert('Login successful!');
        button.textContent = 'Sign in';
        button.disabled = false;
        // Redirect or handle successful login
    }, 1500);
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add some interactive effects
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('ring-2', 'ring-indigo-500');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('ring-2', 'ring-indigo-500');
    });
});`
          }
        ]
      };
    }
    
    if (lowerPrompt.includes('todo') || lowerPrompt.includes('task')) {
      return {
        message: "I'll create a complete todo application with add, edit, delete, and mark as complete functionality using local storage.",
        files: ['todo.html', 'todo.js', 'todo.css'],
        codeBlocks: [
          {
            language: 'html',
            filename: 'todo.html',
            code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="todo.css">
</head>
<body class="bg-gray-100 min-h-screen py-8">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Todo App</h1>
        
        <!-- Add Todo Form -->
        <form id="todoForm" class="mb-6">
            <div class="flex gap-2">
                <input type="text" id="todoInput" placeholder="Add a new task..." 
                       class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Add
                </button>
            </div>
        </form>
        
        <!-- Filter Buttons -->
        <div class="flex gap-2 mb-4">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="active">Active</button>
            <button class="filter-btn" data-filter="completed">Completed</button>
        </div>
        
        <!-- Todo List -->
        <ul id="todoList" class="space-y-2">
            <!-- Todos will be inserted here -->
        </ul>
        
        <!-- Stats -->
        <div class="mt-6 text-center text-sm text-gray-600">
            <span id="todoCount">0 tasks remaining</span>
        </div>
    </div>
    
    <script src="todo.js"></script>
</body>
</html>`
          },
          {
            language: 'javascript',
            filename: 'todo.js',
            code: `class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.render();
    }
    
    bindEvents() {
        document.getElementById('todoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
    }
    
    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();
        
        if (text) {
            const todo = {
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            this.todos.push(todo);
            this.saveTodos();
            this.render();
            input.value = '';
        }
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }
    
    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }
    
    editTodo(id, newText) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.text = newText;
            this.saveTodos();
            this.render();
        }
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }
    
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }
    
    render() {
        const todoList = document.getElementById('todoList');
        const filteredTodos = this.getFilteredTodos();
        
        todoList.innerHTML = '';
        
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = \`todo-item \${todo.completed ? 'completed' : ''}\`;
            li.innerHTML = \`
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <input type="checkbox" \${todo.completed ? 'checked' : ''} 
                           onchange="app.toggleTodo(\${todo.id})"
                           class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                    <span class="flex-1 \${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}" 
                          ondblclick="app.startEdit(\${todo.id}, this)">\${todo.text}</span>
                    <button onclick="app.deleteTodo(\${todo.id})" 
                            class="text-red-500 hover:text-red-700 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            \`;
            todoList.appendChild(li);
        });
        
        this.updateStats();
    }
    
    startEdit(id, element) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo || todo.completed) return;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = todo.text;
        input.className = 'flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500';
        
        input.addEventListener('blur', () => {
            this.editTodo(id, input.value.trim() || todo.text);
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
        
        element.parentNode.replaceChild(input, element);
        input.focus();
        input.select();
    }
    
    updateStats() {
        const activeTodos = this.todos.filter(t => !t.completed).length;
        const countElement = document.getElementById('todoCount');
        countElement.textContent = \`\${activeTodos} task\${activeTodos !== 1 ? 's' : ''} remaining\`;
    }
    
    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
}

// Initialize the app
const app = new TodoApp();`
          },
          {
            language: 'css',
            filename: 'todo.css',
            code: `.filter-btn {
    @apply px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors;
}

.filter-btn.active {
    @apply bg-blue-500 text-white border-blue-500;
}

.todo-item {
    @apply transition-all duration-200;
}

.todo-item:hover {
    @apply transform scale-105;
}

.todo-item.completed {
    @apply opacity-75;
}

/* Custom checkbox styling */
input[type="checkbox"] {
    @apply cursor-pointer;
}

/* Smooth animations */
.todo-item {
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}`
          }
        ]
      };
    }
    
    // Default response
    return {
      message: "I'll help you build that! Let me create the necessary files and components for your request.",
      files: ['index.html'],
      codeBlocks: [
        {
          language: 'html',
          filename: 'index.html',
          code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Project</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">
                Your Project
            </h1>
            <p class="text-lg text-gray-600">
                Built with AI assistance
            </p>
        </div>
    </div>
</body>
</html>`
        }
      ]
    };
  };

  // File functions
  const createOrUpdateFile = (filename: string, content: string) => {
    const existingFileIndex = files.findIndex(f => f.path === filename);
    
    if (existingFileIndex >= 0) {
      // Update existing file
      const updatedFiles = [...files];
      updatedFiles[existingFileIndex] = {
        ...updatedFiles[existingFileIndex],
        content
      };
      setFiles(updatedFiles);
    } else {
      // Create new file
      const newFile: FileNode = {
        id: Date.now().toString(),
        name: filename,
        type: 'file',
        path: filename,
        content,
        language: getLanguageFromFile(filename)
      };
      setFiles(prev => [...prev, newFile]);
    }
  };

  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file);
      setHasChanges(false);
    }
  };

  const handleFileSave = () => {
    if (selectedFile && hasChanges) {
      const updatedFiles = files.map(f => 
        f.path === selectedFile.path 
          ? { ...f, content: selectedFile.content }
          : f
      );
      setFiles(updatedFiles);
      setHasChanges(false);
    }
  };

  const handleFileContentChange = (content: string) => {
    if (selectedFile) {
      setSelectedFile({ ...selectedFile, content });
      setHasChanges(content !== (files.find(f => f.path === selectedFile.path)?.content || ''));
    }
  };

  const handleDeleteFile = (path: string) => {
    setFiles(prev => prev.filter(f => f.path !== path));
    if (selectedFile?.path === path) {
      setSelectedFile(files.find(f => f.path !== path) || null);
    }
  };

  // Terminal functions
  const addTerminalLine = (type: TerminalLine['type'], content: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setTerminalLines(prev => [...prev, newLine]);
  };

  const executeCommand = async (command: string) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    setCommandHistory(prev => [...prev, trimmedCommand]);
    setHistoryIndex(-1);
    addTerminalLine('command', `$ ${trimmedCommand}`);

    try {
      const output = await simulateCommand(trimmedCommand);
      if (output) {
        addTerminalLine('output', output);
      }
    } catch (error) {
      addTerminalLine('error', `Error: ${error}`);
    }
  };

  const simulateCommand = async (command: string): Promise<string> => {
    const [cmd, ...args] = command.split(' ');
    
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
        return files.map(f => f.name).join('\n');

      case 'pwd':
        return '/home/project';

      case 'clear':
        setTerminalLines([]);
        return '';

      case 'date':
        return new Date().toString();

      case 'whoami':
        return 'developer';

      case 'echo':
        return args.join(' ');

      case 'npm':
        if (args[0] === 'install' || args[0] === 'i') {
          return `Installing ${args.slice(1).join(' ')}...\n✓ Package installed successfully`;
        }
        if (args[0] === 'run') {
          return `Running script: ${args[1]}...\n✓ Script executed successfully`;
        }
        return 'npm command executed';

      case 'git':
        if (args[0] === 'status') {
          return `On branch main\nYour branch is up to date with 'origin/main'.\n\nChanges not staged for commit:\n  modified:   ${files[0]?.name || 'index.html'}\n\nno changes added to commit`;
        }
        if (args[0] === 'add') {
          return `Added ${args.slice(1).join(' ')} to staging area`;
        }
        return 'git command executed';

      default:
        throw new Error(`Command not found: ${cmd}`);
    }
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent) => {
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

  // Preview functions
  const getViewportSize = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const refreshPreview = () => {
    const htmlFile = findFileByPath(files, 'index.html');
    if (htmlFile && htmlFile.content) {
      setPreviewContent(htmlFile.content);
    }
  };

  const suggestedPrompts = [
    "Create a React landing page with Tailwind CSS",
    "Add a login form with validation",
    "Build a todo app with local storage",
    "Create a dashboard with charts",
    "Add a contact form with email integration"
  ];

  const viewportSize = getViewportSize();

  return (
    <div className="h-full flex bg-slate-100">
      {/* Left Panel - Chat */}
      <div className="w-80 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">AI Assistant</h2>
              <p className="text-sm text-slate-600">Build anything with AI</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Start Building
                </h3>
                <p className="text-slate-600 mb-6">
                  Describe what you want to build and I'll create it for you
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700 mb-3">Try these prompts:</p>
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(prompt)}
                    className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 transition-colors border border-slate-200"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    
                    {message.codeBlocks?.map((codeBlock, index) => (
                      <div key={index} className="mt-3 bg-slate-900 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 text-slate-300 text-sm">
                          <div className="flex items-center space-x-2">
                            <Code className="h-4 w-4" />
                            <span>{codeBlock.filename || codeBlock.language}</span>
                          </div>
                          {codeBlock.filename && (
                            <button
                              onClick={() => createOrUpdateFile(codeBlock.filename!, codeBlock.code)}
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                            >
                              Create File
                            </button>
                          )}
                        </div>
                        <pre className="p-4 text-sm text-slate-100 overflow-x-auto max-h-40">
                          <code>{codeBlock.code}</code>
                        </pre>
                      </div>
                    ))}
                    
                    {message.files && message.files.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-300/30">
                        <p className="text-xs opacity-75 mb-2">Files created/modified:</p>
                        <div className="flex flex-wrap gap-1">
                          {message.files.map((file, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 bg-black/10 rounded-full flex items-center space-x-1"
                            >
                              <FileText className="h-3 w-3" />
                              <span>{file}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 p-3 rounded-lg flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-slate-600 text-sm">Generating code...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describe what you want to build..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-400 text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Center Panel - Code Editor */}
      <div className="flex-1 flex flex-col">
        <div className={`flex-1 ${showTerminal ? 'h-1/2' : ''}`}>
          {selectedFile ? (
            <div className="h-full flex flex-col bg-white">
              {/* Editor Header */}
              <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-900">{selectedFile.name}</span>
                  {hasChanges && (
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedFile.content || '')}
                    className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded"
                    title="Copy content"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleFileSave}
                    disabled={!hasChanges}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              {/* Editor Content */}
              <div className="flex-1 relative">
                <textarea
                  value={selectedFile.content || ''}
                  onChange={(e) => handleFileContentChange(e.target.value)}
                  className="w-full h-full p-4 font-mono text-sm resize-none border-none outline-none bg-white"
                  placeholder="Start typing..."
                  spellCheck={false}
                  style={{
                    lineHeight: '1.5',
                    tabSize: 2,
                  }}
                />
                
                <div className="absolute bottom-3 right-3 text-xs text-slate-400 bg-white px-2 py-1 rounded border">
                  {getLanguageFromFile(selectedFile.name)}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50 flex items-center justify-center">
              <div className="text-center text-slate-500">
                <Code className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No file selected</h3>
                <p className="text-sm">Select a file from the explorer to start editing</p>
              </div>
            </div>
          )}
        </div>

        {/* Terminal */}
        {showTerminal && (
          <div className="h-80 bg-slate-900 text-slate-100 flex flex-col border-t border-slate-700">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <TerminalIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Terminal</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setTerminalLines([])}
                  className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded"
                  title="Clear terminal"
                >
                  <Square className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setShowTerminal(false)}
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
              {terminalLines.map((line) => (
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
                  ref={terminalInputRef}
                  type="text"
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyDown={handleTerminalKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-slate-100"
                  placeholder="Type a command..."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - File Explorer & Preview */}
      <div className="w-80 flex-shrink-0 flex flex-col">
        {/* File Explorer */}
        <div className="h-1/2 bg-white border-l border-slate-200">
          {/* Explorer Header */}
          <div className="p-3 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-slate-900 text-sm">Explorer</h3>
              <button
                onClick={() => setShowTerminal(!showTerminal)}
                className={`p-1 rounded transition-colors ${
                  showTerminal 
                    ? 'text-blue-600 bg-blue-100' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title="Toggle terminal"
              >
                <TerminalIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* File Tree */}
          <div className="p-2 overflow-y-auto">
            {files.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No files yet</p>
                <p className="text-xs mt-1">Ask AI to create files</p>
              </div>
            ) : (
              files.map((file) => {
                const Icon = getFileIcon(file);
                const isSelected = selectedFile?.path === file.path;

                return (
                  <div
                    key={file.id}
                    className={`flex items-center space-x-2 px-2 py-1 cursor-pointer hover:bg-slate-100 rounded text-sm ${
                      isSelected ? 'bg-blue-100 text-blue-700' : 'text-slate-700'
                    }`}
                    onClick={() => handleFileSelect(file)}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(file.path);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="h-1/2 bg-white border-l border-t border-slate-200 flex flex-col">
            {/* Preview Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center space-x-3">
                <Eye className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-900">Preview</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Viewport Controls */}
                <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('desktop')}
                    className={`p-1.5 rounded ${
                      viewMode === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:text-slate-700'
                    }`}
                    title="Desktop view"
                  >
                    <Monitor className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('tablet')}
                    className={`p-1.5 rounded ${
                      viewMode === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:text-slate-700'
                    }`}
                    title="Tablet view"
                  >
                    <Tablet className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('mobile')}
                    className={`p-1.5 rounded ${
                      viewMode === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:text-slate-700'
                    }`}
                    title="Mobile view"
                  >
                    <Smartphone className="h-4 w-4" />
                  </button>
                </div>
                
                <button
                  onClick={refreshPreview}
                  className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded"
                  title="Refresh preview"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded"
                  title="Hide preview"
                >
                  <EyeOff className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 bg-slate-100 flex items-center justify-center p-4">
              <div
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                style={{
                  width: viewportSize.width,
                  height: viewportSize.height,
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
              >
                <iframe
                  srcDoc={previewContent}
                  className="w-full h-full border-none"
                  title="Preview"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            </div>
          </div>
        )}

        {!showPreview && (
          <div className="h-12 bg-slate-100 border-l border-t border-slate-200 flex items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <EyeOff className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-600">Preview hidden</span>
            </div>
            <button
              onClick={() => setShowPreview(true)}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              Show Preview
            </button>
          </div>
        )}
      </div>
    </div>
  );
};