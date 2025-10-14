import React, { useState, useCallback } from 'react';
import { 
  FileText, 
  MessageSquare, 
  StickyNote, 
  PenTool,
  Download,
  Settings,
  Maximize2,
  Minimize2,
  RotateCcw,
  Save
} from 'lucide-react';
import { EdenWriter } from '../writer/EdenWriter';
import { SourcesPanel } from '../sources/SourcesPanel';
import { ChatPanel } from '../chat/ChatPanel';
import { NotesPanel } from '../notes/NotesPanel';

interface WorkspaceProps {
  className?: string;
}

export const Workspace: React.FC<WorkspaceProps> = ({ className = '' }) => {
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [writerContent, setWriterContent] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [panelLayout, setPanelLayout] = useState<'default' | 'focused' | 'minimal'>('default');

  const handlePinToNotes = useCallback((content: string) => {
    // TODO: Implement pin to notes functionality
    console.log('Pin to notes:', content);
  }, []);

  const handleInsertToWriter = useCallback((content: string) => {
    // TODO: Implement insert to writer functionality
    console.log('Insert to writer:', content);
  }, []);

  const handleExport = useCallback((format: 'md' | 'docx') => {
    // TODO: Implement export functionality
    console.log('Export as:', format);
  }, []);

  const handleSave = useCallback(() => {
    // TODO: Implement save functionality
    console.log('Save document');
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const resetLayout = useCallback(() => {
    setPanelLayout('default');
    setIsFullscreen(false);
  }, []);

  const getLayoutClasses = () => {
    if (isFullscreen) {
      return 'grid-cols-1';
    }
    
    switch (panelLayout) {
      case 'focused':
        return 'grid-cols-12';
      case 'minimal':
        return 'grid-cols-6';
      default:
        return 'grid-cols-12';
    }
  };

  const getPanelClasses = (panel: 'sources' | 'notes' | 'chat' | 'writer') => {
    if (isFullscreen) {
      return panel === 'writer' ? 'col-span-1' : 'hidden';
    }
    
    switch (panelLayout) {
      case 'focused':
        return panel === 'writer' ? 'col-span-8' : 'col-span-4';
      case 'minimal':
        return panel === 'writer' ? 'col-span-4' : 'col-span-2';
      default:
        return 'col-span-3';
    }
  };

  return (
    <div className={`h-screen bg-gray-50 dark:bg-gray-950 flex flex-col ${className}`}>
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200/60 dark:border-gray-700/60">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <PenTool size={20} className="text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Notebook Writer</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="Document title..."
            />
            <div className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-md">
              Writer
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Save"
          >
            <Save size={16} />
          </button>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
          
          <button
            onClick={() => handleExport('md')}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Export Markdown"
          >
            <Download size={16} />
          </button>
          
          <button
            onClick={() => handleExport('docx')}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Export DOCX"
          >
            <FileText size={16} />
          </button>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
          
          <button
            onClick={resetLayout}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Reset Layout"
          >
            <RotateCcw size={16} />
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className={`h-full grid ${getLayoutClasses()} gap-4 p-4`}>
          {/* Sources Panel */}
          <div className={getPanelClasses('sources')}>
            <SourcesPanel className="h-full" />
          </div>
          
          {/* Notes Panel */}
          <div className={getPanelClasses('notes')}>
            <NotesPanel 
              className="h-full" 
              onInsertToWriter={handleInsertToWriter}
            />
          </div>
          
          {/* Chat Panel */}
          <div className={getPanelClasses('chat')}>
            <ChatPanel 
              className="h-full"
              onPinToNotes={handlePinToNotes}
              onInsertToWriter={handleInsertToWriter}
            />
          </div>
          
          {/* Writer Panel */}
          <div className={getPanelClasses('writer')}>
            <EdenWriter 
              className="h-full"
              onContentChange={setWriterContent}
              initialContent={writerContent}
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-t border-gray-200/60 dark:border-gray-700/60">
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <FileText size={14} />
            <span>Sources: 3</span>
          </div>
          <div className="flex items-center gap-2">
            <StickyNote size={14} />
            <span>Notes: 3</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare size={14} />
            <span>Chat: Active</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPanelLayout(panelLayout === 'default' ? 'focused' : panelLayout === 'focused' ? 'minimal' : 'default')}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Layout: {panelLayout}
          </button>
          
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Auto-saved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
