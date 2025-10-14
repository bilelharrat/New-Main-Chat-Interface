import React, { useState, useEffect } from 'react';
import {
  StickyNote,
  FileText,
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react';
import PromptConsole from './Views/PromptConsole';
import { SourcesPanel } from '../app/sources/SourcesPanel';
import NotebookNotesPanel from './Notebook/NotebookNotesPanel';

type PanelType = 'notes' | 'sources';

export const StandaloneNotebook: React.FC = () => {
  const [activePanels, setActivePanels] = useState<PanelType[]>([]);
  const [sidebarWidth] = useState(400);
  const [rightPanelWidth] = useState(600);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notesContent, setNotesContent] = useState<string>('');
  const [openUploadModal, setOpenUploadModal] = useState(false);

  const panels = [
    { id: 'sources' as PanelType, label: 'Sources', icon: FileText },
    { id: 'notes' as PanelType, label: 'Notes', icon: StickyNote },
  ];

  const togglePanel = (panelId: PanelType) => {
    if (activePanels.includes(panelId)) {
      setActivePanels(activePanels.filter(p => p !== panelId));
    } else {
      setActivePanels([...activePanels, panelId]);
    }
  };

  const handleOpenUploadModal = () => {
    if (!activePanels.includes('sources')) {
      setActivePanels(prev => [...prev, 'sources']);
    }
    setOpenUploadModal(true);
  };

  const renderRightPanels = () => {
    const rightPanels = activePanels.filter(panel => panel !== 'sources');
    if (rightPanels.length === 0) return null;

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
          setView={() => {}} // No-op since we're standalone
          currentView="notebook" 
          onOpenUploadModal={handleOpenUploadModal}
        />
      </div>

      {/* Right Panels (Notes) */}
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

export default StandaloneNotebook;
