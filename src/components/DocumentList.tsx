import React from 'react';
import { FileText, Trash2, Calendar, FileType, Hash } from 'lucide-react';

interface Document {
  document_id: string;
  filename: string;
  upload_date: string;
  file_size: number;
  file_type: string;
  chunks_count: number;
}

interface DocumentListProps {
  documents: Document[];
  onDelete: (documentId: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents, onDelete }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const getFileTypeColor = (fileType: string) => {
    const colors: { [key: string]: string } = {
      '.pdf': 'bg-red-100 text-red-700',
      '.docx': 'bg-blue-100 text-blue-700',
      '.txt': 'bg-green-100 text-green-700',
      '.md': 'bg-purple-100 text-purple-700',
    };
    return colors[fileType] || 'bg-slate-100 text-slate-700';
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">No documents yet</h3>
        <p className="text-slate-600">Upload your first document to get started</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <div
          key={doc.document_id}
          className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-all duration-200"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <FileText className="h-6 w-6 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-slate-900 truncate" title={doc.filename}>
                  {doc.filename}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getFileTypeColor(
                    doc.file_type
                  )}`}
                >
                  {doc.file_type.replace('.', '').toUpperCase()}
                </span>
              </div>
            </div>
            <button
              onClick={() => onDelete(doc.document_id)}
              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
              title="Delete document"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Metadata */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(doc.upload_date)}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <FileType className="h-4 w-4" />
              <span>{formatFileSize(doc.file_size)}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Hash className="h-4 w-4" />
              <span>{doc.chunks_count} chunks</span>
            </div>
          </div>

          {/* Status */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-slate-600">Ready for querying</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};