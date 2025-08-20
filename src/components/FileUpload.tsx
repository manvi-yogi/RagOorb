import React, { useState, useCallback } from 'react';
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react';

interface FileUploadProps {
  onUpload: (file: File) => Promise<any>;
  progress?: number | null;
  onProgressUpdate?: (progress: number) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload, progress, onProgressUpdate }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      await onUpload(selectedFile);
      setUploadStatus('success');
      setSelectedFile(null);
      
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setUploadStatus('idle');
      }, 3000);
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setErrorMessage('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return <File className="h-8 w-8 text-slate-400" />;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drag and Drop Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : uploadStatus === 'error'
            ? 'border-red-300 bg-red-50'
            : 'border-slate-300 bg-white hover:border-slate-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploadStatus === 'success' ? (
          <div className="flex flex-col items-center space-y-3">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <p className="text-lg font-medium text-green-700">Upload successful!</p>
            <p className="text-sm text-green-600">Your document has been processed and indexed.</p>
          </div>
        ) : uploadStatus === 'error' ? (
          <div className="flex flex-col items-center space-y-3">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="text-lg font-medium text-red-700">Upload failed</p>
            <p className="text-sm text-red-600">{errorMessage}</p>
            <button
              onClick={clearSelection}
              className="text-sm text-red-600 hover:text-red-700 underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {isDragOver ? 'Drop your file here' : 'Upload your document'}
            </h3>
            <p className="text-slate-600 mb-4">
              Drag and drop your file here, or click to browse
            </p>
            <input
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.txt,.docx,.md"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Browse Files
            </label>
            <p className="text-xs text-slate-500 mt-3">
              Supported formats: PDF, DOCX, TXT, MD (Max 10MB)
            </p>
          </>
        )}
      </div>

      {/* Selected File Preview */}
      {selectedFile && uploadStatus !== 'success' && uploadStatus !== 'error' && (
        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-3">
            {getFileIcon(selectedFile.name)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{selectedFile.name}</p>
              <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              onClick={clearSelection}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {uploadStatus === 'uploading' && progress !== null && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Uploading...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {uploadStatus === 'idle' && (
            <div className="mt-3 flex space-x-2">
              <button
                onClick={handleUpload}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Upload Document
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};