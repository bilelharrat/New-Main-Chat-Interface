import React, { useState, useRef, useEffect } from 'react';
import { 
  StickyNote, 
  FileText, 
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react';
import PromptConsole from '../Views/PromptConsole';
import { SourcesPanel } from '../../app/sources/SourcesPanel';
import NotebookNotesPanel from './NotebookNotesPanel';

interface NotebookLayoutProps {
  setView: (view: string) => void;
  currentView?: string;
}

type PanelType = 'notes' | 'sources';

export const NotebookLayout: React.FC<NotebookLayoutProps> = ({ setView, currentView }) => {
  const [activePanel, setActivePanel] = useState<PanelType | null>(null);
  const [activePanels, setActivePanels] = useState<PanelType[]>([]);
  const [sidebarWidth] = useState(400);
  const [rightPanelWidth] = useState(600);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [panelLayout, setPanelLayout] = useState<'notes-left' | 'notes-right'>('notes-right');
  const [notesContent, setNotesContent] = useState<string>('');
  const [openUploadModal, setOpenUploadModal] = useState(false);

  const panels = [
    { id: 'sources' as PanelType, label: 'Sources', icon: FileText },
    { id: 'notes' as PanelType, label: 'Notes', icon: StickyNote },
  ];

  // Auto-set panels based on current view
  useEffect(() => {
    if (currentView) {
      switch (currentView) {
        case 'notebook-sources':
          setActivePanel(null);
          setActivePanels(prev => prev.includes('sources') ? prev : [...prev, 'sources']);
          break;
        case 'notebook-notes':
          setActivePanel(null);
          setActivePanels(prev => prev.includes('notes') ? prev : [...prev, 'notes']);
          break;
        case 'notebook-writer':
        case 'notebook':
          // Default notebook layout - no specific panel selected
          setActivePanel(null);
          setActivePanels([]);
          break;
      }
    }
  }, [currentView]);



  const togglePanel = (panelId: PanelType) => {
    if (activePanels.includes(panelId)) {
      // Remove panel if it's already active
      setActivePanels(activePanels.filter(p => p !== panelId));
    } else {
      // Add panel to active panels
      setActivePanels([...activePanels, panelId]);
    }
    setActivePanel(null);
  };

  const togglePanelLayout = () => {
    setPanelLayout(prev => 
      prev === 'notes-left' 
        ? 'notes-right' 
        : 'notes-left'
    );
  };

  const handleOpenUploadModal = () => {
    // Ensure Sources panel is open
    if (!activePanels.includes('sources')) {
      setActivePanels(prev => [...prev, 'sources']);
    }
    // Open the upload modal
    setOpenUploadModal(true);
  };


  const renderPanel = (panelId: PanelType) => {
    if (panelId === 'sources') {
      return <SourcesPanel className="h-full" onClose={() => setIsCollapsed(true)} />;
    }
    return null;
  };

  const renderRightPanels = () => {
    // Filter out sources from right panels since it will be rendered on the left
    const rightPanels = activePanels.filter(panel => panel !== 'sources');
    if (rightPanels.length === 0) return null;

    // Only notes panel can be on the right now
    if (rightPanels.includes('notes')) {
      return (
        <div 
          className={`bg-white dark:bg-gray-900 border-l border-gray-200/60 dark:border-gray-700/60 transition-all duration-300 flex-shrink-0`}
          style={{ width: `${rightPanelWidth}px` }}
        >
              <NotebookNotesPanel
                className="h-full"
                onInsertToWriter={(content: string) => console.log('Insert to writer:', content)}
                onClose={() => setActivePanels(activePanels.filter(p => p !== 'notes'))}
                initialContent={notesContent}
                onContentChange={setNotesContent}
              />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black overflow-hidden">
      {/* Left Sources Panel */}
      {activePanels.includes('sources') && !isCollapsed && (
        <div 
          className="bg-white dark:bg-gray-900 border-r border-gray-200/60 dark:border-gray-700/60 transition-all duration-300 flex-shrink-0 rounded-r-2xl"
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200/60 dark:border-gray-700/60">
            <div className="flex items-center gap-2">
              {React.createElement(panels.find(p => p.id === 'sources')?.icon || FileText, { size: 20 })}
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {panels.find(p => p.id === 'sources')?.label}
              </h2>
            </div>
          </div>

          {/* Panel Content */}
          <div className="h-[calc(100vh-73px)]">
            <SourcesPanel 
              className="h-full" 
              onClose={() => setActivePanels(activePanels.filter(p => p !== 'sources'))} 
              openUploadModal={openUploadModal}
              onUploadModalClose={() => setOpenUploadModal(false)}
            />
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 min-w-0">
        <PromptConsole 
          setView={setView} 
          currentView={currentView} 
          onOpenUploadModal={handleOpenUploadModal}
        />
      </div>

      {/* Right Panels (Notes/Write) */}
      {renderRightPanels()}

      {/* Collapsed Sidebar */}
      {isCollapsed && (
        <div className="w-12 bg-white dark:bg-gray-900 border-r border-gray-200/60 dark:border-gray-700/60 flex flex-col items-center py-4">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors mb-4"
          >
            <ChevronRight size={16} />
          </button>
          
          <div className="flex flex-col gap-2">
            {panels.map((panel) => (
              <button
                key={panel.id}
                onClick={() => {
                  togglePanel(panel.id);
                  setIsCollapsed(false);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  activePanels.includes(panel.id)
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={panel.label}
              >
                <panel.icon size={16} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Panel Selector (when no panel is active) */}
      {!isCollapsed && activePanels.length === 0 && (
        <div className="w-16 bg-white dark:bg-gray-900 border-r border-gray-200/60 dark:border-gray-700/60 flex flex-col items-center py-4">
          <div className="flex flex-col gap-2">
            {panels.map((panel) => (
              <button
                key={panel.id}
                onClick={() => togglePanel(panel.id)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={panel.label}
              >
                <panel.icon size={16} />
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default NotebookLayout;