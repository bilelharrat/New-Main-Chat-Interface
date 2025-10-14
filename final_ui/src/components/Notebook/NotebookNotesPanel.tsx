import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  MessageSquare, 
  Send, 
  X,
  ChevronLeft,
  Plus,
  Folder,
  FileText,
  Search,
  Edit3,
  MoreVertical,
  BookOpen,
  Download,
  Trash2
} from 'lucide-react';

interface NoteSection {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isActive: boolean;
}

interface NotebookNotesPanelProps {
  className?: string;
  onInsertToWriter?: (content: string) => void;
  isLeft?: boolean;
  onClose?: () => void;
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

export const NotebookNotesPanel: React.FC<NotebookNotesPanelProps> = ({ 
  className, 
  onInsertToWriter,
  isLeft = false,
  onClose,
  initialContent = '',
  onContentChange
}) => {
  const [notes, setNotes] = useState<string>("");
  const [notesCollapsed, setNotesCollapsed] = useState(false);
  const [showNotesHistory, setShowNotesHistory] = useState(false);
  const [showTodos, setShowTodos] = useState(false);
  const [citedNotes, setCitedNotes] = useState<Array<{text: string, messageIdx: number}>>([]);
  const [notesHistory, setNotesHistory] = useState<Array<{content: string, timestamp: number}>>([]);
  const [notesTodos, setNotesTodos] = useState<Array<{id: string, text: string, completed: boolean, created: number}>>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('markdown');
  
  // Note sections management
  const [noteSections, setNoteSections] = useState<NoteSection[]>([
    {
      id: '1',
      title: 'Research Notes',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['research', 'general'],
      isActive: true
    },
    {
      id: '2',
      title: 'Meeting Notes',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['meetings', 'work'],
      isActive: false
    },
    {
      id: '3',
      title: 'Ideas & Brainstorming',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['ideas', 'creative'],
      isActive: false
    }
  ]);
  const [currentSectionId, setCurrentSectionId] = useState<string>('1');
  const [showSectionsMenu, setShowSectionsMenu] = useState(false);
  const [showNewSectionForm, setShowNewSectionForm] = useState(false);
  const [showCreateSectionModal, setShowCreateSectionModal] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Mock functions for now
  const handleQuickAction = (panel: string, action: string) => {
    console.log(`Quick action: ${action} on ${panel} panel`);
    if (action === 'cite' && onInsertToWriter) {
      onInsertToWriter(notes);
    }
  };

  const openExportModal = (panel: string) => {
    console.log(`Opening export modal for ${panel}`);
    setShowExportModal(true);
  };

  const handleCopyPanelLink = (panel: string) => {
    console.log(`Copying link for ${panel}`);
    // Implement copy to clipboard
  };

  const handleEditorRightClick = (e: React.MouseEvent, panel: string) => {
    e.preventDefault();
    console.log(`Right click on ${panel} editor`);
    // Implement context menu logic
  };

  const handleQuillDrop = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    setter(prev => prev + data);
  };

  const handleFormatClick = () => {
    // Mock formatting options
    const formats = ['Academic', 'Blog Post', 'Email', 'Report'];
    console.log('Format options:', formats);
  };

  // Note sections management functions
  const getCurrentSection = () => {
    return noteSections.find(section => section.id === currentSectionId) || noteSections[0];
  };

  const switchToSection = (sectionId: string) => {
    // Save current content before switching
    setNoteSections(prev => prev.map(section => 
      section.id === currentSectionId 
        ? { ...section, content: notes, updatedAt: new Date() }
        : section
    ));
    
    // Switch to new section
    setCurrentSectionId(sectionId);
    const newSection = noteSections.find(section => section.id === sectionId);
    setNotes(newSection?.content || '');
    setShowSectionsMenu(false);
  };

  const selectSection = (sectionId: string) => {
    switchToSection(sectionId);
  };

  const createNewSection = () => {
    if (!newSectionTitle.trim()) return;
    
    const newSection: NoteSection = {
      id: Date.now().toString(),
      title: newSectionTitle.trim(),
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      isActive: false
    };
    
    setNoteSections(prev => [...prev, newSection]);
    setNewSectionTitle('');
    setShowNewSectionForm(false);
    switchToSection(newSection.id);
  };

  const deleteSection = (sectionId: string) => {
    if (noteSections.length <= 1) return; // Don't delete the last section
    
    setNoteSections(prev => prev.filter(section => section.id !== sectionId));
    
    // If deleting current section, switch to first available
    if (sectionId === currentSectionId) {
      const remainingSections = noteSections.filter(section => section.id !== sectionId);
      if (remainingSections.length > 0) {
        switchToSection(remainingSections[0].id);
      }
    }
  };

  const filteredSections = noteSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Close sections menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSectionsMenu) {
        const target = event.target as Element;
        if (!target.closest('.sections-menu')) {
          setShowSectionsMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSectionsMenu]);

  // Effect to handle initial content from parent
  useEffect(() => {
    if (initialContent && initialContent !== notes) {
      setNotes(prev => prev + (prev ? '\n\n' : '') + initialContent);
      if (onContentChange) {
        onContentChange(notes + (notes ? '\n\n' : '') + initialContent);
      }
    }
  }, [initialContent]);

  return (
    <div className={`h-full flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl relative overflow-visible ${className}`}>
      {/* Browser-style Tabs Header */}
      <div className="flex flex-col border-b border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm">
        {/* Tabs Container */}
        {!notesCollapsed && (
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-1 min-w-max">
                {noteSections.map((section, index) => (
                  <div
                    key={section.id}
                    className={`group relative flex items-center gap-2 px-3 py-2 rounded-t-lg border-b-2 transition-all duration-200 cursor-pointer min-w-0 ${
                      section.isActive
                        ? 'bg-white dark:bg-gray-800 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'bg-gray-100/50 dark:bg-gray-700/50 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-600/50'
                    }`}
                    onClick={() => selectSection(section.id)}
                    style={{ maxWidth: '200px' }}
                  >
                    {/* Tab Icon */}
                    <BookOpen size={12} className="flex-shrink-0 text-gray-500 dark:text-gray-400" />
                    
                    {/* Tab Title */}
                    <span className="text-xs font-medium truncate flex-1">
                      {section.title}
                    </span>
                    
                    {/* Close Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSection(section.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 flex-shrink-0"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                
                {/* Add New Tab Button */}
                <button
                  onClick={() => setShowCreateSectionModal(true)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 flex-shrink-0"
                  title="Add new note section"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1 ml-2">
              <button
                className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
                onClick={() => setNotesCollapsed(!notesCollapsed)}
                title={notesCollapsed ? 'Expand' : 'Collapse'}
              >
                <ChevronLeft size={16} />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-[#FF3B30]/10 dark:hover:bg-[#FF3B30]/20 hover:text-[#FF3B30] dark:hover:text-[#FF6961] transition-all duration-200 hover:scale-105"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {!notesCollapsed && (
        <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm"
          onDragOver={e => e.preventDefault()}
          onDrop={handleQuillDrop(setNotes)}
        >
          {/* Enhanced Notes Editor with AI Features */}
          <div className="flex-1 flex flex-col">
            {/* Enhanced Rich Text Editor */}
            <div className="flex-1 relative">
              <div
                onContextMenu={(e) => handleEditorRightClick(e, 'notes')}
                className="h-full"
              >
                <ReactQuill
                  theme="snow"
                  value={notes}
                  onChange={setNotes}
                  className="flex-1 bg-transparent apple-notes-editor h-full"
                  style={{ border: 'none' }}
                  placeholder="Start writing your notes here..."
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }, 'bold', 'italic', 'underline', 'strike', { 'color': [] }, { 'background': [] }, { 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }, { 'align': [] }, 'link', 'clean']
                    ]
                  }}
                  formats={[
                    'header', 'bold', 'italic', 'underline', 'strike',
                    'color', 'background', 'list', 'bullet', 'indent',
                    'align', 'link'
                  ]}
                />
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Cited Notes List */}
      {!notesCollapsed && citedNotes.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
          <div className="font-semibold text-xs text-gray-500 mb-2">Cited Outputs</div>
          <ul className="space-y-2">
            {citedNotes.map((note, i) => (
              <li key={i}>
                <button
                  className="text-left text-xs text-blue-600 hover:underline focus:outline-none"
                  onClick={() => console.log('Cited note clicked:', note.messageIdx)}
                >
                  {note.text.length > 60 ? note.text.slice(0, 60) + '...' : note.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* New Section Creation Modal */}
      {showNewSectionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-[90vw]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Section</h3>
              <button
                onClick={() => {
                  setShowNewSectionForm(false);
                  setNewSectionTitle('');
                }}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="Enter section title..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      createNewSection();
                    } else if (e.key === 'Escape') {
                      setShowNewSectionForm(false);
                      setNewSectionTitle('');
                    }
                  }}
                />
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={createNewSection}
                  disabled={!newSectionTitle.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Create Section
                </button>
                <button
                  onClick={() => {
                    setShowNewSectionForm(false);
                    setNewSectionTitle('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sections Dropdown Menu - Portal */}
      {showSectionsMenu && createPortal(
        <div 
          className="sections-menu fixed w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[9999]"
          style={{
            top: `${buttonPosition.top}px`,
            left: `${buttonPosition.left}px`
          }}
        >
          {/* Debug indicator */}
          <div className="absolute -top-2 left-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-200 dark:border-b-gray-700"></div>
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Search size={14} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-xs bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
            <button
              onClick={() => setShowNewSectionForm(true)}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            >
              <Plus size={12} />
              New Section
            </button>
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {filteredSections.map(section => (
              <div
                key={section.id}
                className={`flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                  section.id === currentSectionId ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => switchToSection(section.id)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText size={14} className="text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {section.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {section.tags.length > 0 ? section.tags.join(', ') : 'No tags'}
                    </div>
                  </div>
                </div>
                {noteSections.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSection(section.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default NotebookNotesPanel;