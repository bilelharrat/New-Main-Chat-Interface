import React, { useState } from 'react';
import { 
  Plus, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Workflow, 
  PenTool, 
  Search,
  Grid3X3,
  List,
  Calendar,
  User,
  Star,
  MoreHorizontal,
  Trash2,
  Edit3,
  Copy,
  Share2,
  X
} from 'lucide-react';

// ============================================================================
// APPLE-STYLED FRONT PAGE
// ============================================================================

interface Notebook {
  id: string;
  title: string;
  description: string;
  type: 'apple-notebook' | 'complete-notebook' | 'chat' | 'writer' | 'flow';
  createdAt: Date;
  updatedAt: Date;
  isStarred: boolean;
  color: string;
  icon: React.ComponentType<any>;
}

const AppleFrontPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotebookTitle, setNewNotebookTitle] = useState('');
  const [newNotebookColor, setNewNotebookColor] = useState('from-[#007AFF] to-[#0056CC]');
  const [editingNotebook, setEditingNotebook] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Mock notebooks data
  const [notebooks, setNotebooks] = useState<Notebook[]>([
    {
      id: '1',
      title: 'Research & Analysis',
      description: 'AI research findings and market analysis',
      type: 'apple-notebook',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      isStarred: true,
      color: 'from-[#007AFF] to-[#0056CC]',
      icon: BookOpen
    },
    {
      id: '2',
      title: 'Meeting Notes',
      description: 'Weekly team meetings and action items',
      type: 'complete-notebook',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-19'),
      isStarred: false,
      color: 'from-green-500 to-emerald-500',
      icon: MessageSquare
    },
    {
      id: '3',
      title: 'Creative Writing',
      description: 'Story ideas and character development',
      type: 'writer',
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-18'),
      isStarred: true,
      color: 'from-purple-500 to-pink-500',
      icon: PenTool
    },
    {
      id: '4',
      title: 'Project Flow',
      description: 'Workflow diagrams and process mapping',
      type: 'flow',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-17'),
      isStarred: false,
      color: 'from-orange-500 to-red-500',
      icon: Workflow
    },
    {
      id: '5',
      title: 'Documentation',
      description: 'Technical documentation and guides',
      type: 'complete-notebook',
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-16'),
      isStarred: false,
      color: 'from-blue-500 to-indigo-500',
      icon: FileText
    }
  ]);


  const colorOptions = [
    { name: 'Apple Blue', value: 'from-[#007AFF] to-[#0056CC]' },
    { name: 'Green', value: 'from-green-500 to-emerald-500' },
    { name: 'Purple', value: 'from-purple-500 to-pink-500' },
    { name: 'Orange', value: 'from-orange-500 to-red-500' },
    { name: 'Indigo', value: 'from-indigo-500 to-purple-500' },
    { name: 'Teal', value: 'from-teal-500 to-cyan-500' }
  ];

  const filteredNotebooks = notebooks.filter(notebook =>
    notebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notebook.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNotebook = () => {
    if (!newNotebookTitle.trim()) return;

    const newNotebook: Notebook = {
      id: Date.now().toString(),
      title: newNotebookTitle,
      description: 'A new Apple notebook',
      type: 'apple-notebook',
      createdAt: new Date(),
      updatedAt: new Date(),
      isStarred: false,
      color: newNotebookColor,
      icon: BookOpen
    };

    setNotebooks([newNotebook, ...notebooks]);
    setNewNotebookTitle('');
    setShowCreateModal(false);
  };

  const handleDeleteNotebook = (id: string) => {
    setNotebooks(notebooks.filter(notebook => notebook.id !== id));
  };

  const handleToggleStar = (id: string) => {
    setNotebooks(notebooks.map(notebook => 
      notebook.id === id ? { ...notebook, isStarred: !notebook.isStarred } : notebook
    ));
  };

  const handleStartEdit = (notebook: Notebook) => {
    setEditingNotebook(notebook.id);
    setEditTitle(notebook.title);
    setEditDescription(notebook.description);
  };

  const handleSaveEdit = () => {
    if (!editingNotebook || !editTitle.trim()) return;
    
    setNotebooks(notebooks.map(notebook => 
      notebook.id === editingNotebook 
        ? { ...notebook, title: editTitle.trim(), description: editDescription.trim(), updatedAt: new Date() }
        : notebook
    ));
    
    setEditingNotebook(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleCancelEdit = () => {
    setEditingNotebook(null);
    setEditTitle('');
    setEditDescription('');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#007AFF] to-[#0056CC] rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Notebooks</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Organize your thoughts and ideas</p>
              </div>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notebooks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-80 bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/50 transition-all duration-200"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-[#007AFF] text-white shadow-lg' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-[#007AFF] text-white shadow-lg' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <List size={16} />
                </button>
              </div>

              {/* Create Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#007AFF] to-[#0056CC] text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Plus size={16} />
                <span>New Notebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredNotebooks.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
              <BookOpen size={48} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">No notebooks found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
              {searchQuery ? 'Try adjusting your search terms' : 'Create your first notebook to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#007AFF] to-[#0056CC] text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Plus size={18} />
                <span>Create Your First Notebook</span>
              </button>
            )}
          </div>
        ) : (
          /* Notebook Grid/List */
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
            : 'space-y-4'
          }>
            {/* Add New Notebook Card - First Position */}
            <div
              className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] apple-fade-in cursor-pointer"
              onClick={() => setShowCreateModal(true)}
              style={{ animationDelay: '0s' }}
            >
              <div className="p-8 h-full flex flex-col items-center justify-center text-center min-h-[280px]">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <Plus size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  New Notebook
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create a new notebook to get started
                </p>
              </div>
            </div>

            {filteredNotebooks.map((notebook, index) => (
              <div
                key={notebook.id}
                className={`group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] apple-fade-in ${
                  viewMode === 'list' ? 'flex items-center p-6' : 'p-8 min-h-[280px]'
                }`}
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                {/* Star Button */}
                <button
                  onClick={() => handleToggleStar(notebook.id)}
                  className={`absolute top-4 right-4 p-2 rounded-xl transition-all duration-200 ${
                    notebook.isStarred 
                      ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                      : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                  }`}
                >
                  <Star size={16} className={notebook.isStarred ? 'fill-current' : ''} />
                </button>

                {viewMode === 'grid' ? (
                  /* Grid View */
                  <>
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${notebook.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <notebook.icon size={20} className="text-white" />
                    </div>

                    {/* Content */}
                    <div className="mb-4 flex-1">
                      {editingNotebook === notebook.id ? (
                        /* Edit Mode */
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/50 transition-all duration-200"
                            autoFocus
                          />
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/50 transition-all duration-200 resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="px-3 py-1.5 bg-[#007AFF] text-white text-xs rounded-lg hover:bg-[#0056CC] transition-colors duration-200"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* View Mode */
                        <>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {notebook.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {notebook.description}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                      <span>Updated {formatDate(notebook.updatedAt)}</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Active</span>
                      </div>
                    </div>
                  </>
                ) : (
                  /* List View */
                  <>
                    <div className={`w-10 h-10 bg-gradient-to-br ${notebook.color} rounded-xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <notebook.icon size={16} className="text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {editingNotebook === notebook.id ? (
                        /* Edit Mode */
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/50 transition-all duration-200"
                            autoFocus
                          />
                          <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/50 transition-all duration-200"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="px-2 py-1 bg-[#007AFF] text-white text-xs rounded hover:bg-[#0056CC] transition-colors duration-200"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* View Mode */
                        <>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                            {notebook.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">
                            {notebook.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                            <span>Updated {formatDate(notebook.updatedAt)}</span>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Active</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}

                {/* Actions Menu */}
                <div className="absolute top-4 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleStartEdit(notebook)}
                      className="p-2 text-gray-400 hover:text-[#007AFF] rounded-xl hover:bg-[#007AFF]/10 transition-all duration-200"
                      title="Edit notebook"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteNotebook(notebook.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                      title="Delete notebook"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Notebook Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Create New Notebook</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notebook Title
                </label>
                <input
                  type="text"
                  value={newNotebookTitle}
                  onChange={(e) => setNewNotebookTitle(e.target.value)}
                  placeholder="Enter notebook title..."
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/50 transition-all duration-200"
                />
              </div>


              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Color Theme
                </label>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewNotebookColor(color.value)}
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color.value} border-2 transition-all duration-200 ${
                        newNotebookColor === color.value
                          ? 'border-gray-900 dark:border-white scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/50">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNotebook}
                disabled={!newNotebookTitle.trim()}
                className="px-8 py-2.5 bg-gradient-to-r from-[#007AFF] to-[#0056CC] text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Create Notebook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppleFrontPage;
