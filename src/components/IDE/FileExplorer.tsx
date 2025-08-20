import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  File, 
  FileText, 
  Image, 
  Code, 
  Settings,
  Plus,
  MoreHorizontal,
  Trash2,
  Edit3
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

interface FileExplorerProps {
  files: FileNode[];
  selectedFile?: string;
  onFileSelect: (file: FileNode) => void;
  onFileCreate: (path: string, type: 'file' | 'folder') => void;
  onFileDelete: (path: string) => void;
  onFileRename: (oldPath: string, newPath: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  selectedFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; file: FileNode } | null>(null);

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

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleContextMenu = (e: React.MouseEvent, file: FileNode) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file });
  };

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => {
      const Icon = getFileIcon(node);
      const isSelected = selectedFile === node.path;
      const isExpanded = expandedFolders.has(node.path);

      return (
        <div key={node.id}>
          <div
            className={`flex items-center space-x-2 px-2 py-1 cursor-pointer hover:bg-slate-100 rounded text-sm ${
              isSelected ? 'bg-blue-100 text-blue-700' : 'text-slate-700'
            }`}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => {
              if (node.type === 'folder') {
                toggleFolder(node.path);
              } else {
                onFileSelect(node);
              }
            }}
            onContextMenu={(e) => handleContextMenu(e, node)}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{node.name}</span>
          </div>
          
          {node.type === 'folder' && isExpanded && node.children && (
            <div>
              {renderFileTree(node.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="h-full bg-white border-l border-slate-200">
      {/* Header */}
      <div className="p-3 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-slate-900 text-sm">Explorer</h3>
          <button
            onClick={() => onFileCreate('', 'file')}
            className="p-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded"
          >
            <Plus className="h-4 w-4" />
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
          renderFileTree(files)
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <button
            className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center space-x-2"
            onClick={() => {
              // Handle rename
              setContextMenu(null);
            }}
          >
            <Edit3 className="h-4 w-4" />
            <span>Rename</span>
          </button>
          <button
            className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 text-red-600 flex items-center space-x-2"
            onClick={() => {
              onFileDelete(contextMenu.file.path);
              setContextMenu(null);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};