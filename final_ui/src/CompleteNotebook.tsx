import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactMarkdown from 'react-markdown';
import {
  StickyNote,
  FileText,
  ChevronRight,
  ChevronLeft,
  X,
  Upload,
  Plus,
  Search,
  BookOpen,
  ExternalLink,
  Calendar,
  User,
  Check,
  CheckSquare,
  Square,
  Filter,
  File,
  Image,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  FileCode,
  FolderOpen,
  Link,
  ArrowRight,
  MessageSquare,
  Send,
  Download,
  Trash2,
  Bot,
  Lightbulb,
  Maximize2,
  Minimize2
} from 'lucide-react';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface Source {
  id: string;
  title: string;
  authors: string[];
  year: number;
  type: 'pdf' | 'web' | 'book' | 'article';
  url?: string;
  doi?: string;
  summary?: string;
}

interface NoteSection {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isActive: boolean;
}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
  sources?: string[];
}

type PanelType = 'notes' | 'sources';

// ============================================================================
// MOCK DATA
// ============================================================================

const mockSources: Source[] = [
  {
    id: '1',
    title: 'The Future of Artificial Intelligence in Healthcare',
    authors: ['Dr. Sarah Johnson', 'Prof. Michael Chen'],
    year: 2024,
    type: 'article',
    doi: '10.1038/ai-health-2024',
    summary: 'Comprehensive analysis of AI applications in medical diagnosis and treatment.',
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    authors: ['Dr. Emily Rodriguez'],
    year: 2023,
    type: 'book',
    summary: 'Complete guide to machine learning algorithms and their practical applications.',
  },
  {
    id: '3',
    title: 'Deep Learning in Computer Vision',
    authors: ['Prof. David Kim', 'Dr. Lisa Wang'],
    year: 2024,
    type: 'pdf',
    url: 'https://example.com/deep-learning-cv.pdf',
    summary: 'Advanced techniques for image recognition and computer vision using deep neural networks.',
  },
  {
    id: '4',
    title: 'Natural Language Processing Trends 2024',
    authors: ['Dr. Alex Thompson'],
    year: 2024,
    type: 'web',
    url: 'https://example.com/nlp-trends-2024',
    summary: 'Latest developments in NLP including transformer models and language understanding.',
  },
];

// ============================================================================
// SOURCE CARD COMPONENT
// ============================================================================

const SourceCard: React.FC<{
  source: Source;
  onSelect: (source: Source) => void;
  isSelected: boolean;
  onToggleSelection: (sourceId: string) => void;
}> = ({ source, onSelect, isSelected, onToggleSelection }) => {
  const getTypeIcon = () => {
    switch (source.type) {
      case 'pdf':
        return <FileText size={16} className="text-red-500" />;
      case 'web':
        return <ExternalLink size={16} className="text-blue-500" />;
      case 'book':
        return <BookOpen size={16} className="text-green-500" />;
      case 'article':
        return <FileText size={16} className="text-purple-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  const getTypeColor = () => {
    switch (source.type) {
      case 'pdf':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700';
      case 'web':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700';
      case 'book':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700';
      case 'article':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-700';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700';
    }
  };

  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-4 hover:shadow-md transition-all duration-200 cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 shadow-md' : ''
      }`}
      onClick={() => onSelect(source)}
    >
      {/* Selection Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelection(source.id);
        }}
        className="absolute top-3 right-3 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {isSelected ? (
          <CheckSquare size={16} className="text-blue-600 dark:text-blue-400" />
        ) : (
          <Square size={16} className="text-gray-400 dark:text-gray-500" />
        )}
      </button>

      {/* Source Type Badge */}
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border mb-3 ${getTypeColor()}`}>
        {getTypeIcon()}
        <span className="capitalize">{source.type}</span>
      </div>

      {/* Source Title */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {source.title}
      </h3>

      {/* Authors */}
      <div className="flex items-center gap-2 mb-2">
        <User size={14} className="text-gray-400 dark:text-gray-500" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {source.authors.join(', ')}
        </span>
      </div>

      {/* Year */}
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={14} className="text-gray-400 dark:text-gray-500" />
        <span className="text-sm text-gray-600 dark:text-gray-400">{source.year}</span>
      </div>

      {/* Summary */}
      {source.summary && (
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
          {source.summary}
        </p>
      )}

      {/* DOI or URL */}
      {(source.doi || source.url) && (
        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
          <ExternalLink size={12} />
          <span className="truncate">
            {source.doi || source.url}
          </span>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SOURCES PANEL COMPONENT
// ============================================================================

const SourcesPanel: React.FC<{
  className?: string;
  onClose?: () => void;
  openUploadModal?: boolean;
  onUploadModalClose?: () => void;
}> = ({ className = '', onClose, openUploadModal = false, onUploadModalClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [sources] = useState<Source[]>(mockSources);
  const [selectedSourceIds, setSelectedSourceIds] = useState<Set<string>>(new Set());
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter sources based on search and selection
  const filteredSources = sources.filter(source => {
    const matchesSearch = source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         source.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         source.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (showOnlySelected) {
      return matchesSearch && selectedSourceIds.has(source.id);
    }
    
    return matchesSearch;
  });

  const toggleSourceSelection = (sourceId: string) => {
    setSelectedSourceIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sourceId)) {
        newSet.delete(sourceId);
      } else {
        newSet.add(sourceId);
      }
      return newSet;
    });
  };

  const selectAllSources = () => {
    if (selectedSourceIds.size === filteredSources.length) {
      setSelectedSourceIds(new Set());
    } else {
      setSelectedSourceIds(new Set(filteredSources.map(s => s.id)));
    }
  };

  const clearSelection = () => {
    setSelectedSourceIds(new Set());
  };

  // File upload handlers
  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return <Image size={20} className="text-blue-500" />;
    if (type === 'application/pdf') return <FileText size={20} className="text-red-500" />;
    if (type.startsWith('video/')) return <FileVideo size={20} className="text-purple-500" />;
    if (type.startsWith('audio/')) return <FileAudio size={20} className="text-green-500" />;
    if (type.includes('spreadsheet') || type.includes('excel')) return <FileSpreadsheet size={20} className="text-green-600" />;
    if (type.includes('text/') || type.includes('code')) return <FileCode size={20} className="text-orange-500" />;
    return <File size={20} className="text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle external upload modal trigger
  useEffect(() => {
    if (openUploadModal) {
      setShowUploadModal(true);
    }
  }, [openUploadModal]);

  return (
    <div className={`bg-white dark:bg-gray-900 flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200/60 dark:border-gray-700/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sources</h2>
            {selectedSourceIds.size > 0 && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                {selectedSourceIds.size} selected
              </span>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Selection Controls */}
        {selectedSourceIds.size > 0 && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <button
                onClick={clearSelection}
                className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
              >
                <X size={12} />
                Clear
              </button>
              <button
                onClick={() => setShowOnlySelected(!showOnlySelected)}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                  showOnlySelected
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                }`}
              >
                <Filter size={12} />
                {showOnlySelected ? 'Showing Selected' : 'Filter Selected'}
              </button>
            </div>
            <button
              onClick={selectAllSources}
              className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
            >
              {selectedSourceIds.size === filteredSources.length ? <CheckSquare size={12} /> : <Square size={12} />}
              Select All
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Source List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredSources.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">No sources found.</p>
        )}
        {filteredSources.map((source) => (
          <SourceCard
            key={source.id}
            source={source}
            onSelect={setSelectedSource}
            isSelected={selectedSourceIds.has(source.id)}
            onToggleSelection={toggleSourceSelection}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/60 dark:border-gray-700/60 space-y-3">
        {/* Selected Sources Summary */}
        {selectedSourceIds.size > 0 && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700/60">
            <div className="flex items-center gap-2 mb-2">
              <Check size={16} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                {selectedSourceIds.size} source{selectedSourceIds.size !== 1 ? 's' : ''} selected for analysis
              </span>
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              These sources will be used by Eden to generate responses and insights.
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Upload size={16} />
            <span className="text-sm font-medium">Upload Document</span>
          </button>

          {selectedSourceIds.size > 0 && (
            <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <Search size={16} />
              <span className="text-sm font-medium">Analyze Selected Sources</span>
            </button>
          )}
        </div>
      </div>

      {/* File Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/60 dark:border-gray-700/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Upload size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add Sources</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Upload files or add web links to your sources</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  onUploadModalClose?.();
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Upload Methods */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File Upload */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    isDragOver
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                      <FolderOpen size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Upload Files</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Drag and drop files here or click to browse
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Choose Files
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      Supports PDF, DOC, TXT, images, and more
                    </div>
                  </div>
                </div>

                {/* Web Link */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto">
                      <Link size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Add Web Link</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Add articles, papers, or web pages
                      </p>
                      <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors">
                        Add Link
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      Paste URLs from websites and articles
                    </div>
                  </div>
                </div>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Selected Files</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        {getFileIcon(file)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200/60 dark:border-gray-700/60">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  onUploadModalClose?.();
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Uploading files:', uploadedFiles);
                  setShowUploadModal(false);
                  setUploadedFiles([]);
                  onUploadModalClose?.();
                }}
                disabled={uploadedFiles.length === 0}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                Add {uploadedFiles.length} Source{uploadedFiles.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// NOTES PANEL COMPONENT
// ============================================================================

const NotesPanel: React.FC<{
  className?: string;
  onClose?: () => void;
  initialContent?: string;
  onContentChange?: (content: string) => void;
}> = ({ className, onClose, initialContent = '', onContentChange }) => {
  const [notes, setNotes] = useState<string>("");
  const [notesCollapsed, setNotesCollapsed] = useState(false);
  const [noteSections, setNoteSections] = useState<NoteSection[]>([
    {
      id: '1',
      title: 'Research Notes',
      content: '<h1>Welcome to your Research Notes!</h1><p>Start organizing your thoughts and findings here.</p>',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['research', 'general'],
      isActive: true
    },
    {
      id: '2',
      title: 'Meeting Minutes',
      content: '<h2>Meeting with John Doe</h2><p>Discussed project timelines and deliverables.</p>',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['meeting', 'project'],
      isActive: false
    },
    {
      id: '3',
      title: 'Ideas & Brainstorming',
      content: '<ul><li>Idea 1: Develop a new AI feature.</li><li>Idea 2: Improve user onboarding.</li></ul>',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['ideas', 'creative'],
      isActive: false
    }
  ]);
  const [currentSectionId, setCurrentSectionId] = useState<string>('1');
  const [showCreateSectionModal, setShowCreateSectionModal] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const getCurrentSection = () => {
    return noteSections.find(section => section.id === currentSectionId) || noteSections[0];
  };

  const switchToSection = (sectionId: string) => {
    setNoteSections(prev => prev.map(section =>
      section.id === currentSectionId
        ? { ...section, content: notes, updatedAt: new Date(), isActive: false }
        : { ...section, isActive: section.id === sectionId }
    ));

    setCurrentSectionId(sectionId);
    const newSection = noteSections.find(section => section.id === sectionId);
    setNotes(newSection?.content || '');
  };

  const selectSection = (sectionId: string) => {
    switchToSection(sectionId);
  };

  const createNewSection = () => {
    if (!newSectionTitle.trim()) return;

    const newSection: NoteSection = {
      id: String(noteSections.length + 1),
      title: newSectionTitle,
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      isActive: false
    };
    setNoteSections(prev => [...prev, newSection]);
    setNewSectionTitle('');
    setShowCreateSectionModal(false);
    switchToSection(newSection.id);
  };

  const deleteSection = (sectionId: string) => {
    if (noteSections.length <= 1) return;

    setNoteSections(prev => {
      const remainingSections = prev.filter(section => section.id !== sectionId);
      if (remainingSections.length > 0) {
        if (currentSectionId === sectionId) {
          switchToSection(remainingSections[0].id);
        }
      } else {
        setNotes('');
        setCurrentSectionId('');
      }
      return remainingSections;
    });
  };

  // Effect to update notes content when currentSectionId changes
  useEffect(() => {
    const current = noteSections.find(section => section.id === currentSectionId);
    if (current) {
      setNotes(current.content);
    }
  }, [currentSectionId, noteSections]);

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
                    <BookOpen size={12} className="flex-shrink-0 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs font-medium truncate flex-1">
                      {section.title}
                    </span>
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

                <button
                  onClick={() => setShowCreateSectionModal(true)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 flex-shrink-0"
                  title="Add new note section"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>

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
        <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm">
          <div className="flex-1 flex flex-col">
            <ReactQuill
              theme="snow"
              value={notes}
              onChange={setNotes}
              className="flex-1 bg-transparent apple-notes-editor h-full"
              style={{ border: 'none' }}
              placeholder="Start writing your notes here..."
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'indent': '-1'}, { 'indent': '+1' }],
                  [{ 'align': [] }],
                  ['link', 'image', 'code-block'],
                  ['clean']
                ]
              }}
              formats={[
                'header', 'bold', 'italic', 'underline', 'strike',
                'color', 'background', 'list', 'bullet', 'indent',
                'align', 'link', 'image', 'code-block'
              ]}
            />
          </div>

          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <button
              onClick={() => console.log('Cite Notes')}
              className="w-12 h-12 bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center"
              title="Cite Notes"
            >
              <MessageSquare size={20} />
            </button>
            <button
              onClick={() => console.log('Export Notes')}
              className="w-12 h-12 bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center"
              title="Export Notes"
            >
              <Download size={20} />
            </button>
            <button
              onClick={() => console.log('Share Notes')}
              className="w-12 h-12 bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center"
              title="Share Notes"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Create New Section Modal */}
      {createPortal(
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] transition-opacity duration-300 ${
            showCreateSectionModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setShowCreateSectionModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-transform duration-300 scale-95"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Note Section</h3>
            <input
              type="text"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="Enter section title"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreateSectionModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createNewSection}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                disabled={!newSectionTitle.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// ============================================================================
// CHAT INTERFACE COMPONENT
// ============================================================================

const ChatInterface: React.FC<{
  onOpenUploadModal?: () => void;
}> = ({ onOpenUploadModal }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: prompt,
      isUser: true,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsProcessing(true);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about: "${prompt}". This is a simulated response. In a real implementation, this would connect to your AI backend.`,
        isUser: false,
        timestamp: Date.now() + 1
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
      setIsTyping(false);
    }, 2000);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500">
            {/* Notebook Mode Welcome */}
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-200/50 dark:border-blue-700/50">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500 dark:text-blue-400">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M16 13H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M16 17H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            
            <h2 className="text-3xl font-light text-gray-700 dark:text-gray-300 mb-4 tracking-tight">
              Notebook Mode
            </h2>
            <p className="mt-2 max-w-md text-base leading-relaxed text-gray-500 dark:text-gray-400 font-light mb-8">
              Upload documents now to get started
            </p>
            
            {/* Upload Button */}
            <button
              onClick={() => {
                if (typeof onOpenUploadModal === 'function') {
                  onOpenUploadModal();
                }
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M12 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M9 15L12 12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Upload Files & Links
            </button>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.isUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}
              >
                {message.isUser ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl animate-fade-in">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] rounded-full animate-blink" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-[#0277BD] to-[#10b981] rounded-full animate-blink" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-[#7B1FA2] to-[#4527A0] rounded-full animate-blink" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Eden is thinking...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="mt-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-2 transition-all duration-300"
        >
          <div className={`flex items-center gap-2 transition-all duration-200 ${fullscreen ? 'min-h-[200px]' : ''}`}>
            <div className="relative flex-1 flex flex-col">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onInput={handleInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                      e.preventDefault();
                      if (prompt.trim()) {
                        handleSubmit(e);
                      }
                    }
                  }}
                  className={`w-full ${fullscreen ? 'min-h-[200px] max-h-[400px]' : 'min-h-[24px] max-h-[160px]'} resize-none bg-transparent text-gray-900 dark:text-white px-4 py-2 text-base font-mono focus:outline-none transition-all duration-200 border border-blue-500 dark:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500`}
                  placeholder="Ask Eden... (Enter to send)"
                  rows={1}
                  style={{ transition: 'height 0.15s' }}
                />

                {/* Smart Prompt Indicator */}
                {prompt.length >= 3 && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                    <Lightbulb size={14} className="text-blue-500 dark:text-blue-400" />
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="relative p-2 rounded-full shadow-lg shadow-[#007AFF]/25 hover:shadow-xl hover:shadow-[#007AFF]/30 flex items-center justify-center h-10 w-10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-white dark:bg-gray-800 border border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF] hover:text-white transform hover:scale-105 group overflow-hidden"
              disabled={!prompt.trim()}
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-full"></div>
              <div className="relative z-10">
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ArrowRight size={18} className="transition-all duration-300 group-hover:-translate-y-2 group-hover:-rotate-90" style={{ color: '#4285F4' }}/>
                )}
              </div>
            </button>
          </div>

          {/* Notebook Navigation Menu */}
          <div className="w-full flex justify-between items-center mt-2 pt-2">
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FileText size={14} />
              <span>Sources</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <StickyNote size={14} />
              <span>Notes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPLETE NOTEBOOK COMPONENT
// ============================================================================

const CompleteNotebook: React.FC = () => {
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
          <NotesPanel
            className="h-full"
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
        <ChatInterface onOpenUploadModal={handleOpenUploadModal} />
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

export default CompleteNotebook;
