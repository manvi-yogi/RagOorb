# Programming Typing Speed Tester - Developer Workspace

A modern developer workspace inspired by Bolt.new, featuring a comprehensive typing speed tester optimized for developers.

## 🚀 Features

### Modern Developer Workspace UI
- **Dark Theme**: Optimized for developers with syntax highlighting
- **Two-Panel Layout**: Left panel for workflow steps, right panel for code editor
- **File Explorer**: Collapsible file tree with project structure
- **Code Editor**: Monaco Editor with syntax highlighting for multiple languages
- **Terminal Integration**: Real-time terminal with command execution
- **Preview Mode**: Toggle between code and preview views

### Typing Speed Tester
- **Multiple Practice Modes**: Symbols, keywords, code snippets, and mixed content
- **Real-time Feedback**: Visual error highlighting and progress tracking
- **Comprehensive Statistics**: WPM, accuracy, time elapsed, and status
- **Programming-Focused**: Content specifically designed for developers

### Chat-Assisted Development
- **Command Palette**: Chat input styled like a command palette
- **Slash Commands**: Support for `/new`, `/deploy`, `/run` commands
- **AI Integration**: Contextual assistance for development workflow
- **Keyboard Shortcuts**: Press `/` to open command palette

### Developer Experience (DX)
- **Workflow Steps**: Visual progress tracking with checkmarks
- **File Management**: Open multiple files with tabbed interface
- **Terminal Logs**: Real-time command output and logs
- **Hot Reloading**: Live preview of application changes

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Tailwind CSS
- **Code Editor**: Monaco Editor (VS Code's editor)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd programming-typing-tester
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 Usage

### Workspace Navigation
- **Left Panel**: View workflow steps and project description
- **File Explorer**: Navigate project files and folders
- **Code Editor**: Edit files with syntax highlighting
- **Terminal**: Execute commands and view logs
- **Command Palette**: Press `/` or click the chat input

### Typing Test
1. Select a practice mode (Symbols, Keywords, Snippets, Mixed)
2. Start typing in the input field
3. View real-time feedback and statistics
4. Complete the test to see your results

### Development Commands
- `/new file` - Create a new file
- `/deploy` - Deploy your application
- `/run` - Start the development server
- Ask questions about your code or project setup

## 🎨 UI Components

### WorkflowPanel
Displays development steps with progress indicators and project description.

### FileExplorer
Collapsible file tree with file selection and tab management.

### CodeEditor
Monaco Editor integration with syntax highlighting and multiple file tabs.

### TerminalPanel
Terminal interface with command execution and real-time logs.

### CommandPalette
Chat interface with slash commands and AI assistance.

### TypingTest
Main typing test component with multiple practice modes.

### TextDisplay
Visual text display with error highlighting and cursor position.

### StatsDisplay
Statistics dashboard showing WPM, accuracy, time, and status.

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── DeveloperWorkspace.tsx    # Main workspace component
│   ├── WorkflowPanel.tsx         # Workflow steps panel
│   ├── FileExplorer.tsx          # File tree explorer
│   ├── CodeEditor.tsx            # Monaco editor integration
│   ├── TerminalPanel.tsx         # Terminal interface
│   ├── CommandPalette.tsx        # Chat command palette
│   ├── TypingTest.tsx            # Main typing test
│   ├── TextDisplay.tsx           # Text display component
│   └── StatsDisplay.tsx          # Statistics display
├── utils/
│   ├── cn.ts                     # Class name utility
│   └── textGenerator.ts          # Text generation utilities
└── App.tsx                       # Main app component
```

### Adding New Features
1. Create new components in `src/components/`
2. Update the workspace layout in `DeveloperWorkspace.tsx`
3. Add new file types to the file tree
4. Extend the command palette with new slash commands

## 🎯 Future Enhancements

- [ ] GitHub integration for version control
- [ ] Real file system integration
- [ ] Advanced code analysis and suggestions
- [ ] Custom themes and color schemes
- [ ] Collaborative editing features
- [ ] Performance analytics and insights
- [ ] Integration with external development tools

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.