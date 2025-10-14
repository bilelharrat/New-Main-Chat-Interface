import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  X, 
  PenTool,
  Edit,
  MoreVertical,
  Star,
  Clock,
  Tag,
  Share2,
  Eye,
  BookOpen,
  FileText,
  StickyNote
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function NotebookManager({ setView }) {
  const { darkMode } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedNotebooks, setSelectedNotebooks] = useState([]);
  const [showCreateNotebookModal, setShowCreateNotebookModal] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [openMoreMenu, setOpenMoreMenu] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Mock notebooks data
  const [notebooks, setNotebooks] = useState([
    {
      id: 1,
      name: "Research Project Alpha",
      description: "AI and machine learning research notes",
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      tags: ['research', 'AI', 'ML'],
      isStarred: true,
      sourcesCount: 12,
      notesCount: 8,
      writeCount: 3
    },
    {
      id: 2,
      name: "Meeting Notes Q1",
      description: "Quarterly planning and strategy meetings",
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      tags: ['meetings', 'planning', 'Q1'],
      isStarred: false,
      sourcesCount: 5,
      notesCount: 15,
      writeCount: 2
    },
    {
      id: 3,
      name: "Product Development",
      description: "New feature ideas and development notes",
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-19'),
      tags: ['product', 'development', 'features'],
      isStarred: true,
      sourcesCount: 8,
      notesCount: 12,
      writeCount: 5
    }
  ]);

  // Filter notebooks based on search
  const filteredNotebooks = notebooks.filter(notebook =>
    notebook.name.toLowerCase().includes(search.toLowerCase()) ||
    notebook.description.toLowerCase().includes(search.toLowerCase()) ||
    notebook.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  // Handle notebook selection
  const handleNotebookClick = (notebookId) => {
    if (selectedNotebooks.includes(notebookId)) {
      setSelectedNotebooks(selectedNotebooks.filter(id => id !== notebookId));
    } else {
      setSelectedNotebooks([...selectedNotebooks, notebookId]);
    }
  };

  // Handle dot click for selection
  const handleDotClick = (e, notebookId) => {
    e.stopPropagation();
    handleNotebookClick(notebookId);
  };

  // Handle more menu click
  const handleMoreMenuClick = (notebookId, e) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX
    });
    setOpenMoreMenu(openMoreMenu === notebookId ? null : notebookId);
  };

  // Create new notebook
  const handleCreateNotebook = () => {
    if (newNotebookName.trim()) {
      const newNotebook = {
        id: Date.now(),
        name: newNotebookName.trim(),
        description: "New notebook",
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
        isStarred: false,
        sourcesCount: 0,
        notesCount: 0,
        writeCount: 0
      };
      setNotebooks([newNotebook, ...notebooks]);
      setNewNotebookName('');
      setShowCreateNotebookModal(false);
    }
  };

  // Delete notebook
  const handleDeleteNotebook = (notebookId) => {
    setNotebooks(notebooks.filter(notebook => notebook.id !== notebookId));
    setSelectedNotebooks(selectedNotebooks.filter(id => id !== notebookId));
    setOpenMoreMenu(null);
  };

  // Toggle star
  const handleToggleStar = (notebookId) => {
    setNotebooks(notebooks.map(notebook =>
      notebook.id === notebookId
        ? { ...notebook, isStarred: !notebook.isStarred }
        : notebook
    ));
    setOpenMoreMenu(null);
  };

  // Open notebook
  const handleOpenNotebook = (notebookId) => {
    // Navigate to the notebook layout - this will show the notebook interface we designed
    setView('notebook');
    // TODO: Pass notebook context to the notebook layout
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className={`p-6 border-b ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Notebooks
            </h1>
            <p className={`text-sm mt-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Manage your research notebooks and documents
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowCreateNotebookModal(true)}
              className={`group relative px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              } transform hover:scale-105 active:scale-95`}
            >
              <Plus className="w-5 h-5 mr-2 inline" />
              New Notebook
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search notebooks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            }`}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Notebooks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* New Notebook Card */}
          <div
            onClick={() => setShowCreateNotebookModal(true)}
            className={`group relative ${
              darkMode ? 'bg-gray-800/50' : 'bg-white'
            } rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border ${
              darkMode
                ? 'border-gray-700 hover:border-gray-600'
                : 'border-gray-200 hover:border-gray-300'
            } overflow-visible aspect-[4/3] border-dashed`}
          >
            <div className="flex flex-col h-full p-4 items-center justify-center">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center shadow-md mb-4`}>
                <Plus className="w-8 h-8 text-white" />
              </div>
              <div className={`text-center`}>
                <div className={`font-semibold text-sm mb-1 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  New Notebook
                </div>
                <div className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Create a new research notebook
                </div>
              </div>
            </div>
          </div>

          {/* Existing Notebooks */}
          {filteredNotebooks.map((notebook) => (
            <div
              key={notebook.id}
              className={`group relative ${
                darkMode ? 'bg-gray-800/50' : 'bg-white'
              } rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border ${
                selectedNotebooks.includes(notebook.id)
                  ? 'ring-2 ring-blue-500 shadow-blue-500/25'
                  : darkMode
                    ? 'border-gray-700 hover:border-gray-600'
                    : 'border-gray-200 hover:border-gray-300'
              } overflow-visible aspect-[4/3]`}
              onClick={() => handleOpenNotebook(notebook.id)}
            >
              <div className="flex flex-col h-full p-4">
                {/* Top section with icon and selection */}
                <div className="flex items-start justify-between mb-3">
                  {/* Notebook icon */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center shadow-md`}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>

                  {/* Selection indicator */}
                  <button 
                    onClick={(e) => handleDotClick(e, notebook.id)}
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                      selectedNotebooks.includes(notebook.id)
                        ? 'bg-blue-500 border-blue-500 scale-110'
                        : 'bg-transparent border-gray-400 group-hover:border-gray-300 hover:border-blue-400'
                    }`}
                    title="Select notebook"
                  />
                </div>

                {/* Notebook info */}
                <div className="flex-1">
                  <div className="mb-2">
                    <div className={`font-semibold text-sm mb-1 truncate ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {notebook.name}
                    </div>
                    <div className={`text-xs mb-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {notebook.description}
                    </div>
                    <div className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Updated {notebook.updatedAt.toLocaleDateString()}
                    </div>
                  </div>

                </div>

                {/* Bottom section with actions */}
                <div className="flex items-center justify-between">
                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handleToggleStar(notebook.id)}
                      className={`p-2 rounded-lg transition-colors relative z-10 ${
                        notebook.isStarred
                          ? 'text-yellow-500 hover:bg-yellow-500/10'
                          : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10'
                      }`}
                      title={notebook.isStarred ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`w-4 h-4 ${notebook.isStarred ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative z-10"
                      onClick={(e) => handleMoreMenuClick(notebook.id, e)}
                      title="More Options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Notebook indicator */}
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Notebook
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotebooks.length === 0 && search && (
          <div className={`col-span-full text-center py-16 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No notebooks found</p>
            <p className="text-sm">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* Create Notebook Modal */}
      {showCreateNotebookModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateNotebookModal(false);
              setNewNotebookName('');
            }
          }}
        >
          <div className={`${
            darkMode ? 'bg-gray-800/95' : 'bg-white/95'
          } rounded-3xl shadow-2xl w-[32rem] max-h-[85vh] overflow-hidden transform transition-all duration-500 scale-100 backdrop-blur-xl border ${
            darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
          }`}>
            <div className={`flex items-center justify-between p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Create New Notebook
              </h2>
              <button 
                onClick={() => {
                  setShowCreateNotebookModal(false);
                  setNewNotebookName('');
                }}
                className={`p-2 rounded-full transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Notebook Name
                </label>
                <input
                  type="text"
                  value={newNotebookName}
                  onChange={(e) => setNewNotebookName(e.target.value)}
                  placeholder="Enter notebook name..."
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  }`}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateNotebook();
                    }
                  }}
                />
              </div>
            </div>
            
            <div className={`flex items-center justify-end gap-3 p-6 border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                onClick={() => {
                  setShowCreateNotebookModal(false);
                  setNewNotebookName('');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNotebook}
                disabled={!newNotebookName.trim()}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  newNotebookName.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Create Notebook
              </button>
            </div>
          </div>
        </div>
      )}

      {/* More Menu Dropdown */}
      {openMoreMenu && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 min-w-[160px]"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
          }}
        >
          <button
            onClick={() => {
              handleOpenNotebook(openMoreMenu);
              setOpenMoreMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Open
          </button>
          <button
            onClick={() => {
              // TODO: Implement edit functionality
              setOpenMoreMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => {
              // TODO: Implement share functionality
              setOpenMoreMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
          <button
            onClick={() => handleDeleteNotebook(openMoreMenu)}
            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
