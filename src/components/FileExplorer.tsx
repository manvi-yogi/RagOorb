import React, { useState } from 'react';
import { ChevronDown, ChevronRight, File, Folder, X } from 'lucide-react';
import { cn } from '../utils/cn';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  content?: string;
  language?: string;
}

interface FileExplorerProps {
  files: FileNode[];
  selectedFile: string;
  onFileSelect: (filePath: string) => void;
  openFiles: string[];
  onFileClose: (filePath: string) => void;
}

const FileTreeItem: React.FC<{
  node: FileNode;
  level: number;
  selectedFile: string;
  onFileSelect: (filePath: string) => void;
  openFiles: string[];
  onFileClose: (filePath: string) => void;
}> = ({ node, level, selectedFile, onFileSelect, openFiles, onFileClose }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(node.path);
    }
  };

  const isSelected = selectedFile === node.path;
  const isOpen = openFiles.includes(node.path);

  return (
    <div>
      <div
        className={cn(
          "flex items-center space-x-2 px-2 py-1 rounded text-sm cursor-pointer transition-colors group",
          isSelected 
            ? "bg-blue-600 text-white" 
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === 'folder' ? (
          <>
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-3 w-3 flex-shrink-0" />
            )}
            <Folder className="h-4 w-4 flex-shrink-0 text-blue-400" />
          </>
        ) : (
          <>
            <div className="w-3 flex-shrink-0" />
            <File className="h-4 w-4 flex-shrink-0 text-gray-400" />
          </>
        )}
        <span className="flex-1 truncate">{node.name}</span>
        {node.type === 'file' && isOpen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFileClose(node.path);
            }}
            className="opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white rounded p-0.5 transition-all"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              openFiles={openFiles}
              onFileClose={onFileClose}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  selectedFile,
  onFileSelect,
  openFiles,
  onFileClose,
}) => {
  return (
    <div className="p-2">
      {files.map((file) => (
        <FileTreeItem
          key={file.id}
          node={file}
          level={0}
          selectedFile={selectedFile}
          onFileSelect={onFileSelect}
          openFiles={openFiles}
          onFileClose={onFileClose}
        />
      ))}
    </div>
  );
};
