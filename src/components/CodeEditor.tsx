import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { X, File } from 'lucide-react';
import { cn } from '../utils/cn';

interface CodeEditorProps {
  openFiles: string[];
  selectedFile: string;
  onFileSelect: (filePath: string) => void;
  onFileClose: (filePath: string) => void;
  getFileContent: (filePath: string) => string;
}

const getLanguageFromPath = (filePath: string): string => {
  const extension = filePath.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'json':
      return 'json';
    case 'css':
      return 'css';
    case 'html':
      return 'html';
    case 'md':
      return 'markdown';
    case 'py':
      return 'python';
    default:
      return 'plaintext';
  }
};

const getFileName = (filePath: string): string => {
  return filePath.split('/').pop() || filePath;
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  openFiles,
  selectedFile,
  onFileSelect,
  onFileClose,
  getFileContent,
}) => {
  const [editorContent, setEditorContent] = useState<Record<string, string>>({});

  const handleEditorChange = (value: string | undefined, filePath: string) => {
    if (value !== undefined) {
      setEditorContent(prev => ({
        ...prev,
        [filePath]: value
      }));
    }
  };

  const getCurrentContent = (filePath: string): string => {
    return editorContent[filePath] || getFileContent(filePath);
  };

  return (
    <div className="flex flex-col h-full">
      {/* File Tabs */}
      <div className="bg-gray-800 border-b border-gray-700 flex items-center">
        <div className="flex-1 flex overflow-x-auto">
          {openFiles.map((filePath) => (
            <button
              key={filePath}
              onClick={() => onFileSelect(filePath)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 text-sm font-medium border-r border-gray-700 transition-colors min-w-0",
                selectedFile === filePath
                  ? "bg-gray-700 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-750 hover:text-gray-300"
              )}
            >
              <File className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{getFileName(filePath)}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFileClose(filePath);
                }}
                className="ml-2 p-1 rounded hover:bg-gray-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={getLanguageFromPath(selectedFile)}
          value={getCurrentContent(selectedFile)}
          onChange={(value) => handleEditorChange(value, selectedFile)}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Consolas, monospace',
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            renderLineHighlight: 'all',
            selectOnLineNumbers: true,
            glyphMargin: true,
            useTabStops: false,
            tabSize: 2,
            insertSpaces: true,
            detectIndentation: false,
            trimAutoWhitespace: true,
            largeFileOptimizations: true,
            suggest: {
              showKeywords: true,
              showSnippets: true,
              showClasses: true,
              showFunctions: true,
              showVariables: true,
              showModules: true,
              showProperties: true,
              showEvents: true,
              showOperators: true,
              showUnits: true,
              showValues: true,
              showConstants: true,
              showEnums: true,
              showEnumMembers: true,
              showColors: true,
              showFiles: true,
              showReferences: true,
              showFolders: true,
              showTypeParameters: true,
              showWords: true,
            },
          }}
        />
      </div>
    </div>
  );
};
