import React, { useState, useRef } from 'react';
import { 
  Folder, 
  Plus, 
  Search, 
  Trash2, 
  ArrowRight, 
  Star, 
  Clock, 
  Users, 
  Settings, 
  MoreVertical, 
  Grid, 
  List, 
  ChevronDown,
  Calendar,
  Tag,
  Eye,
  Share2,
  Download,
  Archive,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Upload,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const mockProjects = [
  { 
    id: 1, 
    name: 'Eden Platform Redesign', 
    description: 'Complete UI/UX overhaul for the Eden platform with modern design principles and enhanced user experience', 
    date: '2024-07-10',
    status: 'active',
    progress: 75,
    team: ['Alice', 'Bob', 'Charlie'],
    tags: ['UI/UX', 'Design', 'Frontend'],
    favorite: true,
    views: 42,
    lastModified: '2024-07-15',
    priority: 'high',
    category: 'design'
  },
  { 
    id: 2, 
    name: 'AI Research Initiative', 
    description: 'Comprehensive research on LLM prompt engineering and AI model optimization techniques', 
    date: '2024-07-08',
    status: 'planning',
    progress: 25,
    team: ['David', 'Eva'],
    tags: ['AI', 'Research', 'ML'],
    favorite: false,
    views: 18,
    lastModified: '2024-07-12',
    priority: 'medium',
    category: 'research'
  },
  { 
    id: 3, 
    name: 'Client Demo Workspace', 
    description: 'Interactive demo workspace showcasing our platform capabilities for potential clients', 
    date: '2024-07-05',
    status: 'completed',
    progress: 100,
    team: ['Frank', 'Grace'],
    tags: ['Demo', 'Client', 'Presentation'],
    favorite: true,
    views: 67,
    lastModified: '2024-07-10',
    priority: 'high',
    category: 'demo'
  },
  { 
    id: 4, 
    name: 'Internal Documentation', 
    description: 'Comprehensive documentation and onboarding materials for team members', 
    date: '2024-07-01',
    status: 'active',
    progress: 60,
    team: ['Henry', 'Ivy', 'Jack'],
    tags: ['Docs', 'Onboarding', 'Internal'],
    favorite: false,
    views: 89,
    lastModified: '2024-07-14',
    priority: 'low',
    category: 'documentation'
  },
  { 
    id: 5, 
    name: 'Mobile App Development', 
    description: 'Cross-platform mobile application development for iOS and Android', 
    date: '2024-06-28',
    status: 'active',
    progress: 45,
    team: ['Kate', 'Leo', 'Mia'],
    tags: ['Mobile', 'iOS', 'Android'],
    favorite: false,
    views: 34,
    lastModified: '2024-07-13',
    priority: 'high',
    category: 'development'
  },
  { 
    id: 6, 
    name: 'Data Analytics Dashboard', 
    description: 'Real-time analytics dashboard for business intelligence and reporting', 
    date: '2024-06-25',
    status: 'planning',
    progress: 15,
    team: ['Noah', 'Olivia'],
    tags: ['Analytics', 'Dashboard', 'BI'],
    favorite: true,
    views: 23,
    lastModified: '2024-07-11',
    priority: 'medium',
    category: 'analytics'
  }
];

export default function Projects() {
  const { darkMode } = useTheme();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'from-green-500 to-green-600';
      case 'completed': return 'from-blue-500 to-blue-600';
      case 'planning': return 'from-yellow-500 to-yellow-600';
      case 'paused': return 'from-gray-500 to-gray-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-red-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      case 'low': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'design': return <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center"><Folder className="w-4 h-4 text-white" /></div>;
      case 'research': return <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center"><Search className="w-4 h-4 text-white" /></div>;
      case 'demo': return <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center"><Eye className="w-4 h-4 text-white" /></div>;
      case 'documentation': return <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center"><Tag className="w-4 h-4 text-white" /></div>;
      case 'development': return <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center"><Settings className="w-4 h-4 text-white" /></div>;
      case 'analytics': return <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center"><Eye className="w-4 h-4 text-white" /></div>;
      default: return <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center"><Folder className="w-4 h-4 text-white" /></div>;
    }
  };

  const toggleFavorite = (projectId) => {
    // In a real app, this would update the backend
    console.log('Toggle favorite for project:', projectId);
  };

  const filteredAndSortedProjects = mockProjects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase()) ||
                           project.description.toLowerCase().includes(search.toLowerCase()) ||
                           project.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      
      if (activeFilter === 'all') return matchesSearch;
      if (activeFilter === 'favorites') return matchesSearch && project.favorite;
      if (activeFilter === 'recent') return matchesSearch && (Date.now() - new Date(project.lastModified).getTime()) < 7 * 24 * 60 * 60 * 1000;
      if (activeFilter === 'active') return matchesSearch && project.status === 'active';
      if (activeFilter === 'completed') return matchesSearch && project.status === 'completed';
      if (activeFilter === 'planning') return matchesSearch && project.status === 'planning';
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date': return new Date(b.date) - new Date(a.date);
        case 'name': return a.name.localeCompare(b.name);
        case 'progress': return b.progress - a.progress;
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        case 'views': return b.views - a.views;
        default: return 0;
      }
    });

  const closeModal = () => {
    setShowAddProjectModal(false);
  };

  const handleFileUpload = (files) => {
    // Handle file upload logic
    console.log('Files uploaded:', files);
    setSuccessMessage('Project files uploaded successfully!');
    setTimeout(() => setSuccessMessage(""), 3000);
    closeModal();
  };

  const deleteProject = (projectId) => {
    // In a real app, this would call the backend
    console.log('Delete project:', projectId);
    setSuccessMessage('Project deleted successfully!');
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className={`flex flex-col h-full w-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header Section */}
      <div className={`px-8 pt-8 pb-6 ${
        darkMode ? 'bg-gray-800/50' : 'bg-white/80'
      } backdrop-blur-xl border-b ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-4xl font-light mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Projects
              </h1>
              <p className={`text-lg ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Manage and collaborate on your creative endeavors
              </p>
            </div>
            
            <button 
              onClick={() => setShowAddProjectModal(true)}
              className={`group relative px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              } transform hover:scale-105 active:scale-95`}
            >
              <Plus className="w-5 h-5 mr-2 inline" />
              New Project
        </button>
      </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 flex-wrap">
      {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} size={20} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search projects..."
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                } focus:outline-none`}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              {['all', 'favorites', 'recent', 'active', 'completed', 'planning'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-blue-600 text-white shadow-lg'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}>
                Sort by {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* View Toggle */}
          <div className="flex items-center justify-between mb-8">
            <div className={`flex items-center rounded-xl p-1 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <List size={18} />
              </button>
            </div>

            <div className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {filteredAndSortedProjects.length} of {mockProjects.length} projects
            </div>
          </div>

          {/* Projects Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProjects.length === 0 ? (
                <div className={`col-span-full text-center py-16 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No projects found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredAndSortedProjects.map(project => (
                  <div
                    key={project.id}
                    className={`group relative ${
                      darkMode ? 'bg-gray-800/50' : 'bg-white'
                    } rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border ${
                      selectedProjects.includes(project.id)
                        ? 'ring-2 ring-blue-500 shadow-blue-500/25'
                        : darkMode
                          ? 'border-gray-700 hover:border-gray-600'
                          : 'border-gray-200 hover:border-gray-300'
                    } overflow-hidden aspect-[4/3]`}
                    onClick={() => {
                      const newSelected = selectedProjects.includes(project.id)
                        ? selectedProjects.filter(id => id !== project.id)
                        : [...selectedProjects, project.id];
                      setSelectedProjects(newSelected);
                    }}
                  >
                    <div className="flex flex-col h-full p-4">
                      {/* Top section with icon and selection */}
                      <div className="flex items-start justify-between mb-3">
                        {/* Project icon */}
                        {getCategoryIcon(project.category)}

                        {/* Selection indicator */}
                        <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                          selectedProjects.includes(project.id)
                            ? 'bg-blue-500 border-blue-500 scale-110'
                            : 'bg-transparent border-gray-400 group-hover:border-gray-300'
                        }`} />
                      </div>

                      {/* Project info */}
                      <div className="flex-1">
                        <div className="mb-2">
                          <div className={`font-semibold text-sm mb-1 truncate ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {project.name}
                          </div>
                          <div className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {project.date} • {project.team.length} members
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              Progress
                            </span>
                            <span className={`text-xs font-medium ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {project.progress}%
                            </span>
                          </div>
                          <div className={`w-full h-2 rounded-full ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${getStatusColor(project.status)} transition-all duration-300`}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${
                              darkMode
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 2 && (
                            <span className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${
                              darkMode
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              +{project.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom section with actions and favorite */}
                      <div className="flex items-center justify-between">
                        {/* Action buttons */}
                        <div className="flex items-center gap-1">
                          <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <Play className="w-3 h-3" />
                          </button>
                          <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <Share2 className="w-3 h-3" />
                          </button>
                          <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <MoreVertical className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Favorite indicator */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(project.id);
                          }}
                          className={`p-1 rounded-full transition-all duration-300 ${
                            project.favorite
                              ? 'bg-yellow-500 text-white shadow-lg'
                              : 'bg-black/20 text-transparent hover:text-yellow-400 hover:bg-yellow-500/20'
                          }`}
                        >
                          <Star className="w-3 h-3" fill={project.favorite ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAndSortedProjects.length === 0 ? (
                <div className={`text-center py-16 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No projects found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredAndSortedProjects.map(project => (
            <div
              key={project.id}
                    className={`group relative ${
                      darkMode ? 'bg-gray-800/50' : 'bg-white'
                    } rounded-xl p-4 transition-all duration-300 cursor-pointer border ${
                      selectedProjects.includes(project.id)
                        ? 'ring-2 ring-blue-500 shadow-blue-500/25'
                        : darkMode
                          ? 'border-gray-700 hover:border-gray-600'
                          : 'border-gray-200 hover:border-gray-300'
                    } hover:shadow-lg`}
                    onClick={() => {
                      const newSelected = selectedProjects.includes(project.id)
                        ? selectedProjects.filter(id => id !== project.id)
                        : [...selectedProjects, project.id];
                      setSelectedProjects(newSelected);
                    }}
                  >
                    <div className="flex items-center">
                      {/* Project icon */}
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getStatusColor(project.status)} flex items-center justify-center shadow-lg flex-shrink-0 mr-6`}>
                        {getCategoryIcon(project.category)}
                      </div>

                      {/* Project details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`font-semibold text-lg truncate ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {project.name}
                          </div>
                          {project.favorite && (
                            <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                          )}
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {project.status}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium bg-gradient-to-r ${getPriorityColor(project.priority)} text-white`}>
                            {project.priority}
                          </span>
                        </div>
                        
                        <p className={`text-sm mb-3 line-clamp-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {project.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {project.team.length} members
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {project.lastModified}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {project.views} views
                          </span>
                        </div>
                      </div>

                      {/* Progress and actions */}
                      <div className="flex items-center gap-4 ml-6">
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {project.progress}%
                          </div>
                          <div className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Complete
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <Play className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selection Menu */}
      {selectedProjects.length > 0 && (
        <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
          selectedProjects.length > 0 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
        }`}>
          <div className={`${
            darkMode ? 'bg-gray-800/95' : 'bg-white/95'
          } rounded-2xl shadow-2xl border ${
            darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
          } px-6 py-3.5 flex items-center gap-4 backdrop-blur-xl`}>
            {/* Selection Count */}
            <div className={`text-base font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {selectedProjects.length} selected
            </div>

            {/* Divider */}
            <div className={`w-px h-6 ${
              darkMode ? 'bg-gray-600/50' : 'bg-gray-300/50'
            }`}></div>

            {/* Action Buttons */}
            <button 
              onClick={() => {
                setSuccessMessage(`Created new workspace with ${selectedProjects.length} project(s)`);
                setSelectedProjects([]);
              }}
              className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            >
              Create Workspace
            </button>
            
            <button 
              onClick={() => {
                setSuccessMessage(`Shared ${selectedProjects.length} project(s)`);
                setSelectedProjects([]);
              }}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                darkMode 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700 hover:text-white' 
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:text-gray-900'
              } shadow-md`}
            >
              Share Projects
            </button>
            
            <button 
              onClick={() => {
                setSuccessMessage(`Archived ${selectedProjects.length} project(s)`);
                setSelectedProjects([]);
              }}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                darkMode 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700 hover:text-white' 
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:text-gray-900'
              } shadow-md`}
            >
              Archive Projects
            </button>
            
            <button 
              onClick={() => {
                setSuccessMessage(`Started batch operations for ${selectedProjects.length} project(s)`);
                setSelectedProjects([]);
              }}
              className="px-5 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            >
              Batch Operations
            </button>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {(successMessage || errorMessage) && (
        <div className={`fixed bottom-8 right-8 z-50 transform transition-all duration-500 ${
          successMessage || errorMessage ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {successMessage && (
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl ${
              darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
            }`}>
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl ${
              darkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'
            }`}>
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-md"
          onClick={closeModal}
        >
          <div 
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-2xl shadow-2xl border ${
              darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
            } w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
            onClick={e => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Create New Project
              </h2>
              <button 
                onClick={closeModal} 
                className={`p-2 rounded-full transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Project Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter project name..."
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } focus:outline-none`}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your project..."
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } focus:outline-none`}
                  />
                </div>

                {/* Category and Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Category
                    </label>
                    <select className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } focus:outline-none`}>
                      <option>Design</option>
                      <option>Development</option>
                      <option>Research</option>
                      <option>Analytics</option>
                      <option>Documentation</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Priority
                    </label>
                    <select className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } focus:outline-none`}>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Team Members
                  </label>
                  <input
                    type="text"
                    placeholder="Add team members (comma separated)..."
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } focus:outline-none`}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Tags
                  </label>
                  <input
                    type="text"
                    placeholder="Add tags (comma separated)..."
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } focus:outline-none`}
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Project Files
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : darkMode
                          ? 'border-gray-600 hover:border-gray-500'
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-full flex flex-col items-center justify-center gap-4"
                    >
                      <div className={`w-16 h-16 rounded-full ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      } flex items-center justify-center`}>
                        <Upload className={`w-8 h-8 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                      </div>
                      <div>
                        <p className={`text-lg font-medium mb-2 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Drop files here or click to browse
                        </p>
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Supports all file types
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={closeModal}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setSuccessMessage('Project created successfully!');
                    setTimeout(() => setSuccessMessage(""), 3000);
                    closeModal();
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
    </div>
  );
} 
