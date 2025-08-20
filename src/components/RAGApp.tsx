import React, { useState, useRef, useEffect } from 'react';
import { Upload, MessageSquare, FileText, Trash2, Plus, LogOut, Shield } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { DocumentList } from './DocumentList';
import { AuthModal } from './AuthModal';
import { BoltIDE } from './IDE/BoltIDE';
import { useAuth } from '../hooks/useAuth';
import { API_BASE_URL } from '../config/api';

interface Document {
  document_id: string;
  filename: string;
  upload_date: string;
  file_size: number;
  file_type: string;
  chunks_count: number;
}

export const RAGApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'documents' | 'upload'>('chat');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const { user, isAdmin, logout } = useAuth();

  // Load documents on mount
  useEffect(() => {
    if (isAdmin) {
      loadDocuments();
    }
  }, []);
  
  // Load documents when user becomes admin
  useEffect(() => {
    if (isAdmin) {
      loadDocuments();
    }
  }, [isAdmin]);

  const loadDocuments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents`);
      if (response.ok) {
        const docs = await response.json();
        setDocuments(docs);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        await loadDocuments();
        setUploadProgress(null);
        
        // Switch to documents tab to show the uploaded file
        setActiveTab('documents');
        
        return result;
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Upload failed');
      }
    } catch (error) {
      setUploadProgress(null);
      throw error;
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadDocuments();
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">RAG Assistant</h1>
                <p className="text-sm text-slate-600">Intelligent Document Q&A</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <FileText className="h-4 w-4" />
                  <span>{documents.length} documents</span>
                </div>
              )}
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-slate-700">{user.email}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Admin
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              ...(isAdmin ? [
                { id: 'upload', label: 'Upload', icon: Upload },
                { id: 'documents', label: 'Documents', icon: FileText },
              ] : []),
              { id: 'chat', label: 'Chat', icon: MessageSquare },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 px-3 py-4 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' && isAdmin && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Upload Documents</h2>
              <p className="text-slate-600">
                Upload your documents to start asking questions. Supported formats: PDF, DOCX, TXT, MD
              </p>
            </div>
            <FileUpload
              onUpload={handleFileUpload}
              progress={uploadProgress}
              onProgressUpdate={setUploadProgress}
            />
          </div>
        )}

        {activeTab === 'documents' && isAdmin && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Document Library</h2>
              <button
                onClick={() => setActiveTab('upload')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Document</span>
              </button>
            </div>
            <DocumentList
              documents={documents}
              onDelete={handleDeleteDocument}
            />
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="fixed inset-0 top-32 bg-white">
            <BoltIDE documents={documents} />
          </div>
        )}
      </main>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};