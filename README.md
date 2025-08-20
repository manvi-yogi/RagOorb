# AI Website Builder with RAG - Bolt.new Clone

A modern AI-powered website builder that creates complete websites from natural language prompts, enhanced with RAG (Retrieval-Augmented Generation) capabilities for document-based assistance.

## 🚀 Features

### AI Website Generation
- **Natural Language Prompts**: Describe your website idea and watch AI create it instantly
- **Complete File Generation**: Creates all necessary files (HTML, CSS, JavaScript, React components)
- **Modern Tech Stack**: Uses React, TypeScript, and Tailwind CSS
- **Live Preview**: See your generated website immediately in the preview panel
- **File Explorer**: Browse and edit generated files with syntax highlighting

### RAG Document Assistant
- **Document Upload**: Upload PDF, DOCX, TXT, and MD files
- **Intelligent Q&A**: Ask questions about your uploaded documents
- **Vector Search**: Powered by ChromaDB for semantic document search
- **Source Citations**: Get answers with source references

### Developer Experience
- **Monaco Editor**: VS Code-like editing experience
- **File Management**: Create, edit, and organize project files
- **Terminal Integration**: Built-in terminal for running commands
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Monaco Editor** for code editing
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **FastAPI** (Python)
- **ChromaDB** for vector storage
- **Groq API** for AI text generation
- **Sentence Transformers** for embeddings

## 📦 Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd ai-website-builder
```

2. **Install frontend dependencies:**
```bash
npm install
```

3. **Set up the backend:**
```bash
cd backend
pip install -r requirements.txt
```

4. **Configure environment variables:**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys
```

5. **Start the development servers:**
```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run dev:frontend  # Frontend only
npm run dev:backend   # Backend only
```

## 🎯 Usage

### Website Generation
1. Open the application and go to the "Chat" tab
2. Type a prompt describing your website (e.g., "Create a modern landing page for a tech startup")
3. Watch as AI generates all the necessary files
4. View your website in the preview panel
5. Edit files using the built-in code editor

### Document Q&A (Admin Only)
1. Click "Admin Login" and use the demo credentials
2. Go to the "Upload" tab and upload your documents
3. Switch to "Documents" to manage your uploaded files
4. Use the chat interface to ask questions about your documents

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
GROQ_API_KEY=your_groq_api_key_here
CHROMA_DB_PATH=./chroma_db
UPLOAD_DIR=./uploads
```

**Frontend:**
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Demo Credentials
- **Email**: admin@example.com
- **Password**: admin123

## 🏗️ Project Structure

```
src/
├── components/
│   ├── IDE/
│   │   ├── BoltIDE.tsx          # Main IDE interface
│   │   ├── ChatPanel.tsx        # AI chat interface
│   │   ├── CodeEditor.tsx       # File editor
│   │   ├── FileExplorer.tsx     # File tree
│   │   ├── PreviewPanel.tsx     # Website preview
│   │   └── Terminal.tsx         # Terminal interface
│   ├── RAGApp.tsx               # Main application
│   ├── FileUpload.tsx           # Document upload
│   ├── DocumentList.tsx         # Document management
│   └── AuthModal.tsx            # Authentication
├── hooks/
│   └── useAuth.ts               # Authentication logic
├── config/
│   └── api.ts                   # API configuration
└── types/
    └── auth.ts                  # Type definitions

backend/
├── services/
│   ├── groq_service.py          # AI text generation
│   ├── embedding_service.py     # Text embeddings
│   └── document_processor.py    # Document processing
├── database/
│   └── chroma_client.py         # Vector database
└── models/
    └── schemas.py               # Data models
```

## 🎨 Example Prompts

Try these prompts to generate different types of websites:

- "Create a modern landing page for a tech startup"
- "Build a restaurant website with menu and online ordering"
- "Make a portfolio website for a designer"
- "Create a blog website with dark theme"
- "Build a real estate website with property listings"
- "Make a fitness app landing page"
- "Create a SaaS product website"
- "Build a photography portfolio site"

## 🔄 Workflow

1. **Prompt Input**: User describes the desired website
2. **AI Processing**: Groq API generates website structure and code
3. **File Creation**: Backend creates all necessary files
4. **File Display**: Frontend updates file explorer with new files
5. **Preview**: User can immediately see the generated website
6. **Editing**: User can modify files using the built-in editor

## 🚀 Deployment

The application can be deployed to any platform that supports Node.js and Python:

- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Railway, Render, or any Python hosting service

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Known Issues

- File content is currently mocked in the frontend
- Preview requires a running development server
- Authentication is demo-only (not production-ready)

## 🔮 Future Enhancements

- [ ] Real file system integration
- [ ] GitHub integration for version control
- [ ] Custom themes and templates
- [ ] Collaborative editing
- [ ] Deployment integration
- [ ] Advanced code analysis