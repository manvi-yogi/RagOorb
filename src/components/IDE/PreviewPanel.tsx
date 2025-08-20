import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, ExternalLink, Smartphone, Tablet, Monitor, Eye, EyeOff } from 'lucide-react';

interface PreviewPanelProps {
  previewUrl?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  websiteGenerated?: boolean;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  previewUrl = 'http://localhost:5173',
  isLoading = false,
  onRefresh,
  websiteGenerated = false
}) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isVisible, setIsVisible] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
    onRefresh?.();
  };

  const openInNewTab = () => {
    window.open(previewUrl, '_blank');
  };

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

  const viewportSize = getViewportSize();

  if (!isVisible) {
    return (
      <div className="h-12 bg-slate-100 border-t border-slate-200 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <EyeOff className="h-4 w-4 text-slate-500" />
          <span className="text-sm text-slate-600">Preview hidden</span>
        </div>
        <button
          onClick={() => setIsVisible(true)}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
        >
          Show Preview
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border-t border-slate-200">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center space-x-3">
          <Eye className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-900">Preview</span>
          {isLoading && (
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-3 w-3 animate-spin text-blue-600" />
              <span className="text-xs text-slate-500">Loading...</span>
            </div>
          )}
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
            onClick={handleRefresh}
            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded"
            title="Refresh preview"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          
          <button
            onClick={openInNewTab}
            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded"
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setIsVisible(false)}
            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded"
            title="Hide preview"
          >
            <EyeOff className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-slate-100 flex items-center justify-center p-4">
        {websiteGenerated ? (
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
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-none"
              title="Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        ) : (
          <div className="text-center text-slate-500 max-w-md">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <Eye className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Preview Your Website
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Your generated website will appear here once you create it with AI.
              </p>
              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded border">
                💡 Tip: Ask AI to create a website in the chat panel, and it will appear here instantly!
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};