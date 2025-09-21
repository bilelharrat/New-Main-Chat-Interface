import React, { useState, useRef, useEffect } from 'react';
import { 
  Folder, 
  Plus, 
  Search, 
  Trash2, 
  ArrowRight, 
  Star, 
  Clock, 
  MessageSquare,
  FileText,
  Image,
  Music,
  Video,
  Archive,
  Download,
  Share2,
  Edit3,
  MoreVertical,
  Grid,
  List,
  ChevronDown,
  Calendar,
  Tag,
  Eye,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Upload,
  X
} from 'lucide-react';

export default function Folders({ setCurrentView }) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'name', 'size'
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'Computer Science', 'Mathematics', etc.
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);

  // Sample folder data organized by class/category
  const [folders, setFolders] = useState([
    // Computer Science Class
    {
      id: '1',
      name: 'CS 101 - Introduction to Programming',
      description: 'Basic programming concepts and Python fundamentals',
      category: 'Computer Science',
      classCode: 'CS 101',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      starred: true,
      chatCount: 15,
      fileCount: 12,
      size: '67.3 MB',
      color: '#007AFF',
      chats: [
        { id: 'c1', title: 'Python Variables Discussion', lastMessage: '2 hours ago', fileCount: 3 },
        { id: 'c2', title: 'Loop Structures Help', lastMessage: '1 day ago', fileCount: 2 },
        { id: 'c3', title: 'Function Definitions', lastMessage: '3 days ago', fileCount: 4 }
      ],
      files: [
        { name: 'assignment-1.py', type: 'document', size: '2.1 MB' },
        { name: 'lecture-notes.pdf', type: 'pdf', size: '8.2 MB' },
        { name: 'lab-exercises.zip', type: 'archive', size: '5.7 MB' }
      ]
    },
    {
      id: '2',
      name: 'CS 201 - Data Structures',
      description: 'Advanced data structures and algorithms',
      category: 'Computer Science',
      classCode: 'CS 201',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-19',
      starred: true,
      chatCount: 22,
      fileCount: 18,
      size: '89.5 MB',
      color: '#007AFF',
      chats: [
        { id: 'c4', title: 'Binary Trees Implementation', lastMessage: '4 hours ago', fileCount: 5 },
        { id: 'c5', title: 'Sorting Algorithms', lastMessage: '1 day ago', fileCount: 3 },
        { id: 'c6', title: 'Hash Tables Discussion', lastMessage: '2 days ago', fileCount: 7 }
      ],
      files: [
        { name: 'tree-implementation.cpp', type: 'document', size: '3.2 MB' },
        { name: 'algorithms-notes.pdf', type: 'pdf', size: '12.8 MB' },
        { name: 'project-code.zip', type: 'archive', size: '15.3 MB' }
      ]
    },
    // Mathematics Class
    {
      id: '3',
      name: 'MATH 150 - Calculus I',
      description: 'Differential and integral calculus fundamentals',
      category: 'Mathematics',
      classCode: 'MATH 150',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-18',
      starred: false,
      chatCount: 8,
      fileCount: 14,
      size: '45.7 MB',
      color: '#30D158',
      chats: [
        { id: 'c7', title: 'Derivatives Help', lastMessage: '6 hours ago', fileCount: 2 },
        { id: 'c8', title: 'Integration Techniques', lastMessage: '2 days ago', fileCount: 4 },
        { id: 'c9', title: 'Limit Problems', lastMessage: '4 days ago', fileCount: 3 }
      ],
      files: [
        { name: 'derivatives-worksheet.pdf', type: 'pdf', size: '2.8 MB' },
        { name: 'integration-examples.pdf', type: 'pdf', size: '4.1 MB' },
        { name: 'homework-solutions.pdf', type: 'pdf', size: '3.5 MB' }
      ]
    },
    {
      id: '4',
      name: 'MATH 250 - Linear Algebra',
      description: 'Vector spaces, matrices, and linear transformations',
      category: 'Mathematics',
      classCode: 'MATH 250',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-17',
      starred: true,
      chatCount: 12,
      fileCount: 9,
      size: '34.2 MB',
      color: '#30D158',
      chats: [
        { id: 'c10', title: 'Matrix Operations', lastMessage: '1 day ago', fileCount: 3 },
        { id: 'c11', title: 'Eigenvalues Discussion', lastMessage: '3 days ago', fileCount: 2 },
        { id: 'c12', title: 'Vector Spaces', lastMessage: '1 week ago', fileCount: 4 }
      ],
      files: [
        { name: 'matrix-notes.pdf', type: 'pdf', size: '5.2 MB' },
        { name: 'eigenvalue-examples.pdf', type: 'pdf', size: '3.8 MB' },
        { name: 'practice-problems.pdf', type: 'pdf', size: '2.1 MB' }
      ]
    },
    // Physics Class
    {
      id: '5',
      name: 'PHYS 101 - General Physics I',
      description: 'Mechanics, kinematics, and dynamics',
      category: 'Physics',
      classCode: 'PHYS 101',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-16',
      starred: false,
      chatCount: 6,
      fileCount: 11,
      size: '28.9 MB',
      color: '#FF9500',
      chats: [
        { id: 'c13', title: 'Newton\'s Laws', lastMessage: '2 days ago', fileCount: 2 },
        { id: 'c14', title: 'Kinematics Problems', lastMessage: '5 days ago', fileCount: 3 },
        { id: 'c15', title: 'Energy Conservation', lastMessage: '1 week ago', fileCount: 1 }
      ],
      files: [
        { name: 'physics-lab-report.pdf', type: 'pdf', size: '4.2 MB' },
        { name: 'formula-sheet.pdf', type: 'pdf', size: '1.8 MB' },
        { name: 'problem-solutions.pdf', type: 'pdf', size: '3.1 MB' }
      ]
    },
    // Literature Class
    {
      id: '6',
      name: 'ENG 201 - American Literature',
      description: 'Survey of American literary works and movements',
      category: 'Literature',
      classCode: 'ENG 201',
      createdAt: '2024-01-14',
      updatedAt: '2024-01-15',
      starred: false,
      chatCount: 4,
      fileCount: 7,
      size: '19.6 MB',
      color: '#FF3B30',
      chats: [
        { id: 'c16', title: 'Hemingway Analysis', lastMessage: '3 days ago', fileCount: 1 },
        { id: 'c17', title: 'Poetry Discussion', lastMessage: '1 week ago', fileCount: 2 },
        { id: 'c18', title: 'Essay Writing Tips', lastMessage: '2 weeks ago', fileCount: 3 }
      ],
      files: [
        { name: 'hemingway-essay.docx', type: 'document', size: '3.2 MB' },
        { name: 'poetry-analysis.pdf', type: 'pdf', size: '2.8 MB' },
        { name: 'reading-notes.pdf', type: 'pdf', size: '1.5 MB' }
      ]
    }
  ]);

  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);

  // Get unique categories
  const categories = ['all', ...new Set(folders.map(folder => folder.category))];

  // Filter folders based on search query and category
  const filteredFolders = folders.filter(folder => {
    const matchesSearch = folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         folder.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         folder.classCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || folder.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort folders based on selected criteria
  const sortedFolders = [...filteredFolders].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        return parseFloat(b.size) - parseFloat(a.size);
      case 'recent':
      default:
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
  });

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        description: 'New folder for organizing chats and files',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        starred: false,
        chatCount: 0,
        fileCount: 0,
        size: '0 MB',
        color: '#007AFF',
        chats: [],
        files: []
      };
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setShowNewFolderForm(false);
    }
  };

  const handleDeleteFolder = (folderId) => {
    setFolders(folders.filter(folder => folder.id !== folderId));
    setSelectedFolders(selectedFolders.filter(id => id !== folderId));
  };

  const handleStarFolder = (folderId) => {
    setFolders(folders.map(folder =>
      folder.id === folderId ? { ...folder, starred: !folder.starred } : folder
    ));
  };

  const handleContextMenu = (e, folderId) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, folderId });
  };

  const handleContextMenuAction = (action, folderId) => {
    switch (action) {
      case 'star':
        handleStarFolder(folderId);
        break;
      case 'delete':
        handleDeleteFolder(folderId);
        break;
      case 'rename':
        // TODO: Implement rename functionality
        break;
      default:
        break;
    }
    setContextMenu(null);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'music':
        return <Music className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'archive':
        return <Archive className="w-4 h-4" />;
      case 'folder':
        return <Folder className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getFileIconBg = (type) => {
    switch (type) {
      case 'document':
      case 'pdf':
        return 'from-[#FF3B30] to-[#FF6961]'; // Apple Red for documents
      case 'image':
        return 'from-[#007AFF] to-[#5AC8FA]'; // Apple Blue for images
      case 'music':
      case 'video':
        return 'from-[#30D158] to-[#4CAF50]'; // Apple Green for media
      case 'archive':
        return 'from-[#FF9500] to-[#FFB340]'; // Apple Orange for archives
      case 'folder':
        return 'from-gray-400 to-gray-600'; // Gray for folders
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Folders</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Organize your chats and files into folders
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* New Folder Button */}
          <button
            onClick={() => setShowNewFolderForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] text-white rounded-lg hover:from-[#0056CC] hover:to-[#4A9EFF] transition-all duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Folder
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Classes' : category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
            </select>
          </div>
        </div>
      </div>

      {/* New Folder Form */}
      {showNewFolderForm && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              autoFocus
            />
            <button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowNewFolderForm(false);
                setNewFolderName('');
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Folders Grid/List */}
      <div className="flex-1 overflow-auto p-6">
        {sortedFolders.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No folders found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery ? 'Try adjusting your search terms' : 'Create your first folder to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowNewFolderForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] text-white rounded-lg hover:from-[#0056CC] hover:to-[#4A9EFF] transition-all duration-200 shadow-sm"
              >
                Create Folder
              </button>
            )}
          </div>
        ) : selectedCategory === 'all' ? (
          // Group by category when showing all
          <div className="space-y-8">
            {categories.filter(cat => cat !== 'all').map(category => {
              const categoryFolders = sortedFolders.filter(folder => folder.category === category);
              if (categoryFolders.length === 0) return null;
              
              return (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                      <Folder className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{category}</h2>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full">
                      {categoryFolders.length} {categoryFolders.length === 1 ? 'class' : 'classes'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryFolders.map((folder) => (
                      <div
                        key={folder.id}
                        className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                        onClick={() => setCurrentView('prompt-console')}
                        onContextMenu={(e) => handleContextMenu(e, folder.id)}
                      >
                        {/* Folder Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getFileIconBg('folder')} flex items-center justify-center shadow-sm`}
                              style={{ background: `linear-gradient(135deg, ${folder.color}20, ${folder.color}40)` }}
                            >
                              <Folder className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                                  {folder.classCode}
                                </span>
                                {folder.starred && (
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                )}
                              </div>
                              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                {folder.name.replace(`${folder.classCode} - `, '')}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {folder.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Folder Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{folder.chatCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              <span>{folder.fileCount}</span>
                            </div>
                          </div>
                          <div className="text-xs">
                            {folder.size}
                          </div>
                        </div>

                        {/* Recent Chats Preview */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Chats</h4>
                          {folder.chats.slice(0, 2).map((chat) => (
                            <div key={chat.id} className="flex items-center justify-between text-xs">
                              <span className="text-gray-600 dark:text-gray-400 truncate flex-1">
                                {chat.title}
                              </span>
                              <span className="text-gray-400 dark:text-gray-500 ml-2">
                                {chat.fileCount} files
                              </span>
                            </div>
                          ))}
                          {folder.chats.length > 2 && (
                            <div className="text-xs text-gray-400 dark:text-gray-500">
                              +{folder.chats.length - 2} more chats
                            </div>
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentView('prompt-console');
                            }}
                            className="flex-1 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            Open Chat
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Implement folder management
                            }}
                            className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            <MoreVertical className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedFolders.map((folder) => (
              <div
                key={folder.id}
                className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => setCurrentView('prompt-console')}
                onContextMenu={(e) => handleContextMenu(e, folder.id)}
              >
                {/* Folder Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getFileIconBg('folder')} flex items-center justify-center shadow-sm`}
                              style={{ background: `linear-gradient(135deg, ${folder.color}20, ${folder.color}40)` }}
                            >
                              <Folder className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                                  {folder.classCode}
                                </span>
                                {folder.starred && (
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                )}
                              </div>
                              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                {folder.name.replace(`${folder.classCode} - `, '')}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {folder.description}
                              </p>
                            </div>
                          </div>
                        </div>

                {/* Folder Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{folder.chatCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{folder.fileCount}</span>
                    </div>
                  </div>
                  <div className="text-xs">
                    {folder.size}
                  </div>
                </div>

                {/* Recent Chats Preview */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Chats</h4>
                  {folder.chats.slice(0, 2).map((chat) => (
                    <div key={chat.id} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400 truncate flex-1">
                        {chat.title}
                      </span>
                      <span className="text-gray-400 dark:text-gray-500 ml-2">
                        {chat.fileCount} files
                      </span>
                    </div>
                  ))}
                  {folder.chats.length > 2 && (
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      +{folder.chats.length - 2} more chats
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentView('prompt-console');
                    }}
                    className="flex-1 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Open Chat
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement folder management
                    }}
                    className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <MoreVertical className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedFolders.map((folder) => (
              <div
                key={folder.id}
                className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => setCurrentView('prompt-console')}
                onContextMenu={(e) => handleContextMenu(e, folder.id)}
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getFileIconBg('folder')} flex items-center justify-center shadow-sm flex-shrink-0`}
                  style={{ background: `linear-gradient(135deg, ${folder.color}20, ${folder.color}40)` }}
                >
                  <Folder className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                      {folder.classCode}
                    </span>
                    {folder.starred && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {folder.name.replace(`${folder.classCode} - `, '')}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {folder.description}
                  </p>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{folder.chatCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{folder.fileCount}</span>
                  </div>
                  <span className="w-16 text-right">{folder.size}</span>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    Updated {new Date(folder.updatedAt).toLocaleDateString()}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentView('prompt-console');
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <ArrowRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
          onClick={() => setContextMenu(null)}
        >
          <button
            onClick={() => handleContextMenuAction('star', contextMenu.folderId)}
            className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Star className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Star</span>
          </button>
          <button
            onClick={() => handleContextMenuAction('rename', contextMenu.folderId)}
            className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Rename</span>
          </button>
          <button
            onClick={() => handleContextMenuAction('delete', contextMenu.folderId)}
            className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}
