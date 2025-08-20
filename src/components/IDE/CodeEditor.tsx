import React, { useState, useEffect } from 'react';
import { Save, Copy, Download, FileText, Code } from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  language?: string;
}

interface CodeEditorProps {
  file: FileNode | null;
  onSave: (path: string, content: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ file, onSave }) => {
  const [content, setContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (file) {
      setContent(file.content || '');
      setHasChanges(false);
    }
  }, [file]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(newContent !== (file?.content || ''));
  };

  const handleSave = () => {
    if (file && hasChanges) {
      onSave(file.path, content);
      setHasChanges(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
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

  if (!file) {
    return (
      <div className="h-full bg-slate-50 flex items-center justify-center">
        <div className="text-center text-slate-500">
          <Code className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No file selected</h3>
          <p className="text-sm">Select a file from the explorer to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center space-x-3">
          <FileText className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-900">{file.name}</span>
          {hasChanges && (
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded"
            title="Copy content"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleSave}
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
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full h-full p-4 font-mono text-sm resize-none border-none outline-none bg-white"
          placeholder="Start typing..."
          spellCheck={false}
          style={{
            lineHeight: '1.5',
            tabSize: 2,
          }}
        />
        
        {/* Line numbers could be added here */}
        <div className="absolute bottom-3 right-3 text-xs text-slate-400 bg-white px-2 py-1 rounded border">
          {getLanguageFromFile(file.name)}
        </div>
      </div>
    </div>
  );
};