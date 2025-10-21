import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactMarkdown from 'react-markdown';
import AppleWalkthrough from './AppleWalkthrough';
import {
  Plus,
  Search,
  FileText,
  StickyNote,
  ArrowUp,
  X,
  ChevronRight,
  Upload,
  BookOpen,
  ExternalLink,
  Calendar,
  User,
  Check,
  CheckSquare,
  Square,
  File,
  FolderOpen,
  Link,
  MessageSquare,
  Download,
  Eye,
  EyeOff,
  Trash2,
  Sparkles
} from 'lucide-react';

// ============================================================================
// APPLE-STYLED TYPES AND INTERFACES
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

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
  sources?: string[];
}

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
];

// ============================================================================
// APPLE-STYLED SOURCE CARD
// ============================================================================

const AppleSourceCard: React.FC<{
  source: Source;
  onSelect: (source: Source) => void;
  isSelected: boolean;
  onToggleSelection: (sourceId: string) => void;
  onDelete?: (sourceId: string) => void;
}> = ({ source, onSelect, isSelected, onToggleSelection, onDelete }) => {
  const getTypeIcon = () => {
    switch (source.type) {
      case 'pdf':
        return <FileText size={16} className="text-red-500" />;
      case 'web':
        return <ExternalLink size={16} className="text-[#007AFF]" />;
      case 'book':
        return <BookOpen size={16} className="text-green-500" />;
      case 'article':
        return <FileText size={16} className="text-purple-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  return (
    <div
      className={`group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border border-gray-200/20 dark:border-gray-700/20 p-6 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
        isSelected ? 'ring-2 ring-[#007AFF]/50 shadow-xl shadow-[#007AFF]/20 scale-[1.02]' : ''
      }`}
      onClick={() => onSelect(source)}
    >
      {/* Action Buttons - Enhanced Apple Style */}
      <div className="absolute top-5 right-5 flex items-center gap-2">
        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(source.id);
            }}
            className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
            title="Delete source"
          >
            <Trash2 size={14} className="text-red-500 hover:text-red-600" />
          </button>
        )}
        
        {/* Selection Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelection(source.id);
          }}
          className="p-2 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-all duration-200 hover:scale-110"
        >
          {isSelected ? (
            <div className="w-6 h-6 bg-gradient-to-r from-[#007AFF] to-[#0056CC] rounded-full flex items-center justify-center shadow-lg">
              <Check size={14} className="text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full hover:border-[#007AFF] transition-all duration-200 hover:scale-110" />
          )}
        </button>
      </div>

      {/* Source Type Badge - Enhanced Apple Style */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 mb-5 shadow-sm">
        {getTypeIcon()}
        <span className="capitalize font-semibold">{source.type}</span>
      </div>

      {/* Source Title - Enhanced Apple Typography */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 line-clamp-2 leading-tight tracking-tight">
        {source.title}
      </h3>

      {/* Authors - Clean Layout */}
      <div className="flex items-center gap-2 mb-2">
        <User size={14} className="text-gray-400 dark:text-gray-500" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {source.authors.join(', ')}
        </span>
      </div>

      {/* Year */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={14} className="text-gray-400 dark:text-gray-500" />
        <span className="text-sm text-gray-600 dark:text-gray-400">{source.year}</span>
      </div>

      {/* Summary */}
      {source.summary && (
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
          {source.summary}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// APPLE-STYLED SOURCES PANEL
// ============================================================================

const AppleSourcesPanel: React.FC<{
  className?: string;
  onClose?: () => void;
}> = ({ className = '', onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [sources, setSources] = useState<Source[]>(mockSources);
  const [selectedSourceIds, setSelectedSourceIds] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddSourcesModal, setShowAddSourcesModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [webLinks, setWebLinks] = useState<string[]>([]);
  const [newWebLink, setNewWebLink] = useState('');
  const [pastedTexts, setPastedTexts] = useState<{id: string, title: string, content: string}[]>([]);
  const [newPastedText, setNewPastedText] = useState('');
  const [newPastedTextTitle, setNewPastedTextTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter sources based on search
  const filteredSources = sources.filter(source => {
    const matchesSearch = source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         source.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         source.summary?.toLowerCase().includes(searchQuery.toLowerCase());
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

  const handleDeleteSource = (sourceId: string) => {
    setSources(prevSources => prevSources.filter(source => source.id !== sourceId));
    setSelectedSourceIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(sourceId);
      return newSet;
    });
    if (selectedSource?.id === sourceId) {
      setSelectedSource(null);
    }
  };

  return (
    <div className={`h-full flex flex-col bg-white dark:bg-gray-900 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-3xl ${className}`}>
      {/* Header - Enhanced Apple Style */}
      <div className="p-8 border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#007AFF] via-[#0056CC] to-[#003D99] rounded-2xl flex items-center justify-center shadow-lg">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-light text-gray-900 dark:text-white tracking-tight">Sources</h2>
            </div>
            {selectedSourceIds.size > 0 && (
              <div className="px-4 py-2 bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] dark:from-[#0D47A1]/40 dark:to-[#1565C0]/40 text-[#0056CC] dark:text-[#64B5F6] text-sm font-semibold rounded-full shadow-sm">
                {selectedSourceIds.size} selected
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-2xl transition-all duration-200 hover:scale-105"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar - Enhanced Apple Style */}
        <div className="relative">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white/80 dark:bg-gray-800/80 border border-gray-200/30 dark:border-gray-700/30 rounded-3xl text-base focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:bg-white dark:focus:bg-gray-800 focus:border-[#007AFF]/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
          />
        </div>

        {/* Selection Controls - Enhanced Apple Style */}
        {selectedSourceIds.size > 0 && (
          <div className="flex items-center gap-4 mt-6 p-4 bg-gradient-to-r from-[#E3F2FD]/90 to-[#BBDEFB]/90 dark:from-[#0D47A1]/30 dark:to-[#1565C0]/30 rounded-3xl border border-[#90CAF9]/30 dark:border-[#1976D2]/30 shadow-sm">
            <button
              onClick={selectAllSources}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#0056CC] dark:text-[#64B5F6] hover:bg-[#E3F2FD]/80 dark:hover:bg-[#0D47A1]/40 rounded-2xl transition-all duration-200 hover:scale-105 font-medium"
            >
              {selectedSourceIds.size === filteredSources.length ? <CheckSquare size={16} /> : <Square size={16} />}
              Select All
            </button>
            <button
              onClick={() => setSelectedSourceIds(new Set())}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-2xl transition-all duration-200 hover:scale-105 font-medium"
            >
              <X size={16} />
              Clear
            </button>
            <button
              onClick={() => {
                selectedSourceIds.forEach(sourceId => handleDeleteSource(sourceId));
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all duration-200 hover:scale-105 font-medium"
            >
              <Trash2 size={16} />
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Source List */}
      <div className="flex-1 overflow-y-auto apple-scrollbar p-8 space-y-6">
        {filteredSources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
              <Search size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No sources found</h3>
            <p className="text-gray-500 dark:text-gray-400 font-light">Try adjusting your search terms</p>
          </div>
        ) : (
          filteredSources.map((source, index) => (
            <div
              key={source.id}
              className="apple-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <AppleSourceCard
                source={source}
                onSelect={setSelectedSource}
                isSelected={selectedSourceIds.has(source.id)}
                onToggleSelection={toggleSourceSelection}
                onDelete={handleDeleteSource}
              />
            </div>
          ))
        )}
      </div>

      {/* Footer - Enhanced Apple Style */}
      <div className="p-8 border-t border-gray-200/20 dark:border-gray-700/20 space-y-6">
        {selectedSourceIds.size > 0 && (
          <div className="p-5 bg-gradient-to-r from-green-50/90 to-emerald-50/90 dark:from-green-900/30 dark:to-emerald-900/30 rounded-3xl border border-green-200/40 dark:border-green-700/40 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Check size={16} className="text-white" />
              </div>
              <span className="text-base font-semibold text-green-700 dark:text-green-300">
                {selectedSourceIds.size} source{selectedSourceIds.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="text-sm text-green-600 dark:text-green-400 font-light">
              Ready for analysis and research
            </div>
          </div>
        )}

        <button
          onClick={() => setShowAddSourcesModal(true)}
          className="group w-full flex items-center justify-center gap-4 py-4 px-6 bg-gradient-to-r from-[#007AFF] via-[#0056CC] to-[#003D99] hover:from-[#0056CC] hover:via-[#003D99] hover:to-[#002A66] text-white rounded-3xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-[#007AFF]/30 hover:scale-105 overflow-hidden"
          data-walkthrough="add-sources-button"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <Plus size={20} className="relative z-10" />
          <span className="relative z-10">Add Sources</span>
        </button>
      </div>

      {/* Upload Modal - Enhanced Apple Style */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 apple-fade-in">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden apple-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-200/20 dark:border-gray-700/20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#007AFF] via-[#0056CC] to-[#003D99] rounded-3xl flex items-center justify-center shadow-lg">
                  <Upload size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-light text-gray-900 dark:text-white tracking-tight">Add Sources</h2>
                  <p className="text-base text-gray-500 dark:text-gray-400 font-light">Upload files or add web links to your research</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-2xl transition-all duration-200 hover:scale-105"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8">
              {/* Upload Methods */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* File Upload */}
                <div
                  className={`group relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 hover:scale-105 ${
                    isDragOver
                      ? 'border-[#007AFF] bg-gradient-to-br from-[#E3F2FD]/90 to-[#BBDEFB]/90 dark:from-[#0D47A1]/30 dark:to-[#1565C0]/30'
                      : 'border-gray-300 dark:border-gray-600 hover:border-[#42A5F5] dark:hover:border-[#007AFF] hover:bg-gray-50/50 dark:hover:bg-gray-800/50'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                  onDrop={(e) => { e.preventDefault(); setIsDragOver(false); }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files) {
                        setUploadedFiles(Array.from(e.target.files));
                      }
                    }}
                  />
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#007AFF] via-[#0056CC] to-[#003D99] rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FolderOpen size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Upload Files</h3>
                      <p className="text-base text-gray-500 dark:text-gray-400 mb-6 font-light">
                        Drag and drop files here or click to browse
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-3 bg-gradient-to-r from-[#007AFF] to-[#0056CC] hover:from-[#0056CC] hover:to-[#003D99] text-white rounded-2xl text-base font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
                      >
                        Choose Files
                      </button>
                    </div>
                  </div>
                </div>

                {/* Web Link */}
                <div className="group border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-10 text-center hover:border-green-400 dark:hover:border-green-500 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Link size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Add Web Link</h3>
                      <p className="text-base text-gray-500 dark:text-gray-400 mb-6 font-light">
                        Add articles, papers, or web pages
                      </p>
                      <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl text-base font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105">
                        Add Link
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-4 p-8 border-t border-gray-200/20 dark:border-gray-700/20">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-2xl font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Uploading files:', uploadedFiles);
                  setShowUploadModal(false);
                  setUploadedFiles([]);
                }}
                disabled={uploadedFiles.length === 0}
                className="px-8 py-3 bg-gradient-to-r from-[#007AFF] to-[#0056CC] hover:from-[#0056CC] hover:to-[#003D99] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-2xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:hover:scale-100"
              >
                Add {uploadedFiles.length} Source{uploadedFiles.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Sources Modal */}
      {showAddSourcesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden my-2 sm:my-4">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#007AFF] to-[#0056CC] rounded-2xl flex items-center justify-center shadow-lg">
                  <ArrowUp size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Add Sources</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Upload files, add web links, or paste text to your sources</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddSourcesModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Upload Files Section */}
                <div
                  className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-200 ${
                    isDragOver
                      ? 'border-[#007AFF] bg-[#007AFF]/5'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    const files = Array.from(e.dataTransfer.files);
                    setUploadedFiles(prev => [...prev, ...files]);
                  }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#007AFF] to-[#0056CC] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <FolderOpen size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Upload Files</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Drag and drop files here or click to browse</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#007AFF] to-[#0056CC] text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    Choose Files
                  </button>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Supports PDF, DOC, TXT, images, and more</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files);
                        setUploadedFiles(prev => [...prev, ...files]);
                      }
                    }}
                  />
                </div>

                {/* Add Web Link Section */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Link size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Add Web Link</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Add articles, papers, or web pages</p>
                  
                  <div className="space-y-3">
                    <input
                      type="url"
                      placeholder="https://example.com/article"
                      value={newWebLink}
                      onChange={(e) => setNewWebLink(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all duration-200"
                    />
                    <button
                      onClick={() => {
                        if (newWebLink.trim()) {
                          setWebLinks(prev => [...prev, newWebLink.trim()]);
                          setNewWebLink('');
                        }
                      }}
                      disabled={!newWebLink.trim()}
                      className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      Add Link
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Paste URLs from websites and articles</p>
                </div>

                {/* Paste Text Section */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <FileText size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Paste Text</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Add text content directly</p>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter a title for this text"
                      value={newPastedTextTitle}
                      onChange={(e) => setNewPastedTextTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all duration-200"
                    />
                    <textarea
                      placeholder="Paste your text content here..."
                      value={newPastedText}
                      onChange={(e) => setNewPastedText(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all duration-200 resize-none"
                    />
                    <button
                      onClick={() => {
                        if (newPastedText.trim() && newPastedTextTitle.trim()) {
                          const newText = {
                            id: Date.now().toString(),
                            title: newPastedTextTitle.trim(),
                            content: newPastedText.trim()
                          };
                          setPastedTexts(prev => [...prev, newText]);
                          setNewPastedText('');
                          setNewPastedTextTitle('');
                        }
                      }}
                      disabled={!newPastedText.trim() || !newPastedTextTitle.trim()}
                      className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      Add Text
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Perfect for notes, quotes, or any text content</p>
                </div>
              </div>

              {/* Added Items */}
              {(uploadedFiles.length > 0 || webLinks.length > 0 || pastedTexts.length > 0) && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Added Items</h4>
                  
                  {/* Uploaded Files */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400">Files ({uploadedFiles.length})</h5>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <File size={16} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{file.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <button
                            onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                            className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Web Links */}
                  {webLinks.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400">Links ({webLinks.length})</h5>
                      {webLinks.map((link, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <Link size={16} className="text-green-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{link}</span>
                          </div>
                          <button
                            onClick={() => setWebLinks(prev => prev.filter((_, i) => i !== index))}
                            className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pasted Texts */}
                  {pastedTexts.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400">Texts ({pastedTexts.length})</h5>
                      {pastedTexts.map((text, index) => (
                        <div key={text.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <FileText size={16} className="text-purple-500" />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{text.title}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{text.content.substring(0, 50)}...</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setPastedTexts(prev => prev.filter((_, i) => i !== index))}
                            className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/50">
              <button
                onClick={() => setShowAddSourcesModal(false)}
                className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle adding sources logic here
                  setShowAddSourcesModal(false);
                  setUploadedFiles([]);
                  setWebLinks([]);
                  setPastedTexts([]);
                }}
                disabled={uploadedFiles.length === 0 && webLinks.length === 0 && pastedTexts.length === 0}
                className="px-8 py-2.5 bg-gradient-to-r from-[#007AFF] to-[#0056CC] text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Add {uploadedFiles.length + webLinks.length + pastedTexts.length} Source{(uploadedFiles.length + webLinks.length + pastedTexts.length) !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// APPLE-STYLED NOTES PANEL
// ============================================================================

interface NoteSet {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  color: string;
  isActive: boolean;
}

const AppleNotesPanel: React.FC<{
  className?: string;
  onClose?: () => void;
  initialContent?: string;
  onContentChange?: (content: string) => void;
}> = ({ className, onClose, initialContent = '', onContentChange }) => {
  const [noteSets, setNoteSets] = useState<NoteSet[]>([
    {
      id: '1',
      title: 'Research Notes',
      content: '<h1>Welcome to your Research Notes!</h1><p>Start organizing your thoughts and findings here.</p>',
      createdAt: new Date(),
      updatedAt: new Date(),
      color: 'from-[#007AFF] to-[#0056CC]',
      isActive: true
    },
    {
      id: '2',
      title: 'Meeting Notes',
      content: '<h2>Meeting with Team</h2><p>Key discussion points and action items.</p>',
      createdAt: new Date(),
      updatedAt: new Date(),
      color: 'from-green-500 to-emerald-500',
      isActive: false
    },
    {
      id: '3',
      title: 'Ideas & Brainstorming',
      content: '<ul><li>Idea 1: Develop new features</li><li>Idea 2: Improve user experience</li></ul>',
      createdAt: new Date(),
      updatedAt: new Date(),
      color: 'from-purple-500 to-pink-500',
      isActive: false
    }
  ]);
  const [currentNoteSetId, setCurrentNoteSetId] = useState<string>('1');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteColor, setNewNoteColor] = useState('from-[#007AFF] to-[#0056CC]');

  const currentNoteSet = noteSets.find(note => note.id === currentNoteSetId) || noteSets[0];

  const noteColors = [
    { name: 'Blue', value: 'from-[#007AFF] to-[#0056CC]' },
    { name: 'Green', value: 'from-green-500 to-emerald-500' },
    { name: 'Purple', value: 'from-purple-500 to-pink-500' },
    { name: 'Orange', value: 'from-orange-500 to-red-500' },
    { name: 'Teal', value: 'from-teal-500 to-cyan-500' },
    { name: 'Indigo', value: 'from-indigo-500 to-purple-500' }
  ];

  const switchToNoteSet = (noteSetId: string) => {
    setNoteSets(prev => prev.map(note => ({
      ...note,
      isActive: note.id === noteSetId
    })));
    setCurrentNoteSetId(noteSetId);
  };

  const createNewNoteSet = () => {
    if (!newNoteTitle.trim()) return;

    const newNoteSet: NoteSet = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      color: newNoteColor,
      isActive: false
    };

    setNoteSets(prev => [...prev, newNoteSet]);
    setNewNoteTitle('');
    setShowCreateModal(false);
    switchToNoteSet(newNoteSet.id);
  };

  const updateCurrentNote = (content: string) => {
    setNoteSets(prev => prev.map(note => 
      note.id === currentNoteSetId 
        ? { ...note, content, updatedAt: new Date() }
        : note
    ));
    if (onContentChange) {
      onContentChange(content);
    }
  };

  const deleteNoteSet = (noteSetId: string) => {
    if (noteSets.length <= 1) return;
    
    setNoteSets(prev => {
      const remaining = prev.filter(note => note.id !== noteSetId);
      if (currentNoteSetId === noteSetId && remaining.length > 0) {
        switchToNoteSet(remaining[0].id);
      }
      return remaining;
    });
  };

  useEffect(() => {
    if (initialContent && initialContent !== currentNoteSet?.content) {
      updateCurrentNote(currentNoteSet?.content + (currentNoteSet?.content ? '\n\n' : '') + initialContent);
    }
  }, [initialContent]);

  return (
    <div className={`h-full flex flex-col bg-white dark:bg-gray-900 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-3xl ${className}`}>
      {/* Header - Enhanced Apple Style */}
      <div className="p-8 border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-light text-gray-900 dark:text-white tracking-tight">Notes</h2>
            </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-2xl transition-all duration-200 hover:scale-105"
              title="Create new note set"
            >
              <Plus size={20} />
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-2xl transition-all duration-200 hover:scale-105"
            >
              {isCollapsed ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-2xl transition-all duration-200 hover:scale-105"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Note Sets Navigation - Apple Style */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {noteSets.map((noteSet, index) => (
            <button
              key={noteSet.id}
              onClick={() => switchToNoteSet(noteSet.id)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                noteSet.isActive
                  ? `bg-gradient-to-r ${noteSet.color} text-white shadow-lg`
                  : 'bg-gray-100/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-600/80'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${
                noteSet.isActive 
                  ? 'bg-white/80' 
                  : `bg-gradient-to-r ${noteSet.color}`
              }`} />
              <span className="text-sm font-medium truncate max-w-32">
                {noteSet.title}
              </span>
              {noteSets.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNoteSet(noteSet.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-white/20 dark:hover:bg-gray-600/50 transition-all duration-200"
                >
                  <X size={12} />
                </button>
              )}
            </button>
          ))}
        </div>
      </div>

      {!isCollapsed && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <ReactQuill
            theme="snow"
            value={currentNoteSet?.content || ''}
            onChange={updateCurrentNote}
            className="flex-1 bg-transparent apple-notes-editor"
            style={{ border: 'none' }}
            placeholder="Start writing your notes here..."
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'code-block'],
                ['clean']
              ]
            }}
            formats={[
              'header', 'bold', 'italic', 'underline',
              'list', 'bullet', 'link', 'code-block'
            ]}
          />
        </div>
      )}


      {/* Create New Note Set Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 apple-fade-in">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden apple-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/20 dark:border-gray-700/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <Plus size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">New Note Set</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Create a new collection of notes</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-xl transition-all duration-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Note Set Title
                </label>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="Enter note set title..."
                  className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-200/30 dark:border-gray-700/30 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/50 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Color Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {noteColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewNoteColor(color.value)}
                      className={`p-3 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
                        newNoteColor === color.value
                          ? 'border-gray-400 dark:border-gray-500'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-full h-8 rounded-xl bg-gradient-to-r ${color.value}`} />
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{color.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200/20 dark:border-gray-700/20">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createNewNoteSet}
                className="px-6 py-2 bg-gradient-to-r from-[#007AFF] to-[#0056CC] hover:from-[#0056CC] hover:to-[#003D99] text-white rounded-2xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
                disabled={!newNoteTitle.trim()}
              >
                Create Note Set
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// APPLE-STYLED CHAT INTERFACE
// ============================================================================

const AppleChatInterface: React.FC<{
  onOpenUploadModal?: () => void;
  onToggleNotes?: () => void;
  onToggleSources?: () => void;
  onStartWalkthrough?: () => void;
  showTakeTourButton?: boolean;
}> = ({ onOpenUploadModal, onToggleNotes, onToggleSources, onStartWalkthrough, showTakeTourButton = false }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showAddSourcesModal, setShowAddSourcesModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [webLinks, setWebLinks] = useState<string[]>([]);
  const [newWebLink, setNewWebLink] = useState('');
  const [pastedTexts, setPastedTexts] = useState<{id: string, title: string, content: string}[]>([]);
  const [newPastedText, setNewPastedText] = useState('');
  const [newPastedTextTitle, setNewPastedTextTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<{type: string, content: string} | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const generateReport = (type: string) => {
    const sampleReports = {
      'Research Summary': `# Research Summary Report

## Executive Overview
This comprehensive research summary consolidates findings from multiple sources and provides key insights for decision-making.

## Key Findings
- **Primary Insight 1**: Based on analysis of current market trends, there is significant opportunity for growth in the target demographic.
- **Primary Insight 2**: User feedback indicates strong demand for enhanced features and improved user experience.
- **Primary Insight 3**: Competitive analysis reveals gaps in the market that can be strategically addressed.

## Methodology
- Analyzed 15+ sources including academic papers, industry reports, and user surveys
- Conducted qualitative and quantitative analysis
- Cross-referenced findings with multiple data points

## Recommendations
1. **Immediate Actions**: Implement user-requested features within Q1
2. **Strategic Initiatives**: Develop long-term roadmap based on market opportunities
3. **Risk Mitigation**: Address identified competitive threats proactively

## Conclusion
The research indicates strong potential for success with proper execution of recommended strategies.`,

      'Executive Brief': `# Executive Brief

## Strategic Overview
**Objective**: Provide high-level insights for executive decision-making

## Key Metrics
- **Market Opportunity**: $2.3B addressable market
- **User Satisfaction**: 87% positive feedback
- **Competitive Position**: Top 3 in target segment

## Critical Insights
- Market timing is optimal for expansion
- User base shows strong retention (94%)
- Competitive landscape presents clear opportunities

## Recommendations
- **Approve**: Q1 feature development budget
- **Prioritize**: User experience improvements
- **Monitor**: Competitive response to our initiatives

## Next Steps
- Schedule follow-up meeting for detailed planning
- Assign project leads for each initiative
- Establish success metrics and timelines`,

      'Deep Analysis': `# Deep Analysis Report

## Data Interpretation

### Market Trends Analysis
The data reveals three distinct patterns in user behavior:

1. **Peak Usage Patterns**: 78% of activity occurs between 9 AM - 5 PM, indicating business-focused usage
2. **Feature Adoption**: New features show 65% adoption rate within 30 days
3. **Retention Metrics**: 94% monthly retention with 67% annual retention

### Statistical Insights
- **Correlation Analysis**: Strong positive correlation (r=0.82) between user engagement and satisfaction scores
- **Regression Analysis**: Feature usage predicts 89% of user satisfaction variance
- **Trend Analysis**: 23% month-over-month growth in key metrics

### Pattern Recognition
- **Seasonal Variations**: 15% increase in usage during Q4
- **User Segmentation**: Three distinct user personas identified
- **Behavioral Clusters**: Five usage patterns with distinct characteristics

## Detailed Findings
[Detailed analysis would continue with specific data points, charts, and interpretations]`,

      'Presentation': `# Presentation Report

## Slide 1: Title Slide
**Research Findings & Strategic Recommendations**
*Prepared for Executive Team*
*Date: ${new Date().toLocaleDateString()}*

## Slide 2: Executive Summary
- Market opportunity: $2.3B
- User satisfaction: 87%
- Key recommendation: Proceed with Q1 initiatives

## Slide 3: Key Findings
• **Finding 1**: Strong market demand identified
• **Finding 2**: User feedback overwhelmingly positive
• **Finding 3**: Competitive gaps present opportunities

## Slide 4: Strategic Recommendations
1. **Immediate**: Implement user-requested features
2. **Short-term**: Enhance user experience
3. **Long-term**: Develop competitive advantages

## Slide 5: Next Steps
- Approve budget allocation
- Assign project teams
- Establish success metrics
- Schedule progress reviews

## Slide 6: Questions & Discussion
*Ready for Q&A and strategic planning*`
    };

    setGeneratedReport({
      type: type,
      content: sampleReports[type as keyof typeof sampleReports] || 'Report content not available.'
    });
    setShowReportModal(false);
  };

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

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto apple-scrollbar p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center apple-spring-in">
            {/* Apple-Style Welcome - Enhanced */}
            <div className="mb-12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#007AFF]/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-[#E3F2FD] via-white to-[#BBDEFB] dark:from-[#0D47A1]/50 dark:via-gray-800 dark:to-[#1565C0]/50 rounded-3xl shadow-2xl flex items-center justify-center border border-[#90CAF9]/30 dark:border-[#1976D2]/30 apple-gentle-float">
                <div className="w-20 h-20 bg-gradient-to-br from-[#007AFF] to-[#0056CC] rounded-2xl flex items-center justify-center shadow-lg">
                  <BookOpen size={36} className="text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="apple-heading-1 text-5xl font-extralight text-gray-800 dark:text-gray-100 mb-6 tracking-tight">
              Notebook
            </h1>
            <p className="apple-body-large text-xl text-gray-500 dark:text-gray-400 font-light mb-12 max-w-lg leading-relaxed">
              Upload documents to get started with intelligent research and note-taking
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Upload Button - Enhanced Apple Style */}
              <button
                onClick={() => setShowAddSourcesModal(true)}
                className="group relative px-10 py-5 bg-gradient-to-r from-[#007AFF] via-[#0056CC] to-[#003D99] hover:from-[#0056CC] hover:via-[#003D99] hover:to-[#002A66] text-white rounded-3xl font-medium text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-4 overflow-hidden"
                data-walkthrough="upload-button"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <Upload size={22} className="relative z-10" />
                <span className="relative z-10">Upload Documents</span>
              </button>

              {/* Take Tour Button */}
              {onStartWalkthrough && showTakeTourButton && (
                <button
                  onClick={onStartWalkthrough}
                  className="group relative px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 rounded-3xl font-medium text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
                >
                  <Sparkles size={18} className="text-[#007AFF]" />
                  <span>Take Tour</span>
                </button>
              )}
            </div>
            
            {/* Subtle hint */}
            <p className="mt-8 text-sm text-gray-400 dark:text-gray-500 font-light">
              Drag and drop files anywhere to get started
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} apple-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`max-w-[80%] rounded-3xl px-6 py-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
                  message.isUser
                    ? 'bg-gradient-to-r from-[#007AFF] to-[#0056CC] text-white hover:from-[#0056CC] hover:to-[#003D99]'
                    : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl text-gray-900 dark:text-white border border-gray-200/20 dark:border-gray-700/20 hover:bg-white dark:hover:bg-gray-800'
                }`}
              >
                {message.isUser ? (
                  <p className="whitespace-pre-wrap leading-relaxed font-medium">{message.content}</p>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed">
                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator - Enhanced Apple Style */}
        {isTyping && (
          <div className="flex items-center gap-4 p-5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg apple-fade-in">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gradient-to-r from-[#007AFF] to-[#0056CC] rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-[#007AFF] to-[#0056CC] rounded-full animate-bounce shadow-sm" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-[#007AFF] to-[#0056CC] rounded-full animate-bounce shadow-sm" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Eden is thinking...</span>
          </div>
        )}
      </div>

      {/* Generated Report Display - Full Screen */}
      {generatedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 apple-fade-in">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full h-full max-w-7xl max-h-[90vh] overflow-hidden apple-scale-in flex flex-col">
            {/* Report Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-200/20 dark:border-gray-700/20 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Download size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-light text-gray-900 dark:text-white tracking-tight">{generatedReport.type} Report</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-light">Generated on {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigator.clipboard.writeText(generatedReport.content)}
                  className="p-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-2xl transition-all duration-200 hover:scale-105"
                  title="Copy to clipboard"
                >
                  <FileText size={20} />
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([generatedReport.content], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${generatedReport.type.replace(' ', '_')}_Report.md`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="p-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-2xl transition-all duration-200 hover:scale-105"
                  title="Download report"
                >
                  <Download size={20} />
                </button>
                <button
                  onClick={() => setGeneratedReport(null)}
                  className="p-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-2xl transition-all duration-200 hover:scale-105"
                  title="Close report"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Report Content */}
            <div className="flex-1 overflow-y-auto apple-scrollbar p-8">
              <div className="max-w-5xl mx-auto">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <ReactMarkdown>
                    {generatedReport.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Report Footer */}
            <div className="flex items-center justify-end gap-3 p-8 border-t border-gray-200/20 dark:border-gray-700/20 flex-shrink-0">
              <button
                onClick={() => setGeneratedReport(null)}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Form - Enhanced Apple Style */}
      <div className="p-6 border-t border-gray-200/20 dark:border-gray-700/20">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border border-gray-200/20 dark:border-gray-700/20 shadow-xl p-3 transition-all duration-300 hover:shadow-2xl"
        >
          <div className="flex items-end gap-4">
            <div className="relative flex-1">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    if (prompt.trim()) {
                      handleSubmit(e);
                    }
                  }
                }}
                className="w-full min-h-[28px] max-h-[160px] resize-none bg-transparent text-gray-900 dark:text-white px-5 py-4 text-base focus:outline-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="Ask Eden anything..."
                rows={1}
                style={{ transition: 'height 0.15s' }}
              />
            </div>
            <button
              type="submit"
              className="group relative p-4 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center h-14 w-14 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-gradient-to-r from-[#007AFF] to-[#0056CC] hover:from-[#0056CC] hover:to-[#003D99] text-white transform hover:scale-105 overflow-hidden"
              disabled={!prompt.trim()}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              {isProcessing ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10"></div>
              ) : (
                <ArrowUp size={20} className="relative z-10 transition-transform duration-200 rotate-90 group-hover:rotate-0" />
              )}
            </button>
          </div>
        </form>
        
        {/* Quick Actions - Enhanced Apple Style */}
        <div className="flex justify-center gap-6 mt-6" data-walkthrough="quick-actions">
          <button
            onClick={onToggleSources}
            className="group flex items-center gap-2.5 px-5 py-2.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/90 dark:hover:bg-gray-700/90 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm border border-gray-300/60 dark:border-gray-600/60 bg-white/70 dark:bg-gray-800/70"
          >
             <div className="w-7 h-7 bg-gradient-to-br from-[#007AFF] to-[#0056CC] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
               <FileText size={14} className="text-white" />
             </div>
            <span className="font-medium">Sources</span>
          </button>
          <button
            onClick={() => setShowReportModal(true)}
            className="group flex items-center gap-2.5 px-5 py-2.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/90 dark:hover:bg-gray-700/90 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm border border-gray-300/60 dark:border-gray-600/60 bg-white/70 dark:bg-gray-800/70"
          >
             <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
               <Download size={14} className="text-white" />
             </div>
            <span className="font-medium">Generate Report</span>
          </button>
          <button
            onClick={onToggleNotes}
            className="group flex items-center gap-2.5 px-5 py-2.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/90 dark:hover:bg-gray-700/90 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm border border-gray-300/60 dark:border-gray-600/60 bg-white/70 dark:bg-gray-800/70"
          >
             <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
               <StickyNote size={14} className="text-white" />
             </div>
            <span className="font-medium">Notes</span>
          </button>
        </div>
      </div>

      {/* Report Generation Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 apple-fade-in">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden apple-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-200/20 dark:border-gray-700/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Download size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-light text-gray-900 dark:text-white tracking-tight">Generate Report</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-light">Choose the type of report you'd like to generate</p>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-2xl transition-all duration-200 hover:scale-105"
              >
                <X size={20} />
              </button>
            </div>

            {/* Report Types Grid */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Research Summary Report */}
                <button
                  onClick={() => generateReport('Research Summary')}
                  className="group p-6 bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] dark:from-[#0D47A1]/30 dark:to-[#1565C0]/30 rounded-3xl border border-[#90CAF9]/30 dark:border-[#1976D2]/30 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#007AFF] to-[#0056CC] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                      <FileText size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Research Summary</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive overview of findings</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Generate a detailed summary of your research with key findings, insights, and conclusions from your sources and notes.
                  </p>
                </button>

                {/* Executive Brief Report */}
                <button
                  onClick={() => generateReport('Executive Brief')}
                  className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-3xl border border-purple-200/30 dark:border-purple-700/30 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                      <User size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Executive Brief</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">High-level strategic overview</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Create a concise executive summary highlighting key points, recommendations, and strategic insights for decision-makers.
                  </p>
                </button>

                {/* Analysis Report */}
                <button
                  onClick={() => generateReport('Deep Analysis')}
                  className="group p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-3xl border border-orange-200/30 dark:border-orange-700/30 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                      <Search size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Deep Analysis</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Detailed analytical breakdown</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Produce an in-depth analytical report with data interpretation, trends, patterns, and detailed insights from your research.
                  </p>
                </button>

                {/* Presentation Report */}
                <button
                  onClick={() => generateReport('Presentation')}
                  className="group p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-3xl border border-green-200/30 dark:border-green-700/30 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                      <Calendar size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Presentation</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Slide-ready format</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Generate a presentation-ready report with structured slides, bullet points, and visual elements for meetings and presentations.
                  </p>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-8 border-t border-gray-200/20 dark:border-gray-700/20">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Sources Modal */}
      {showAddSourcesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden my-2 sm:my-4">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#007AFF] to-[#0056CC] rounded-2xl flex items-center justify-center shadow-lg">
                  <ArrowUp size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Add Sources</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Upload files, add web links, or paste text to your sources</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddSourcesModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Upload Files Section */}
                <div
                  className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-200 ${
                    isDragOver
                      ? 'border-[#007AFF] bg-[#007AFF]/5'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    const files = Array.from(e.dataTransfer.files);
                    setUploadedFiles(prev => [...prev, ...files]);
                  }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#007AFF] to-[#0056CC] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <FolderOpen size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Upload Files</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Drag and drop files here or click to browse</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#007AFF] to-[#0056CC] text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    Choose Files
                  </button>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Supports PDF, DOC, TXT, images, and more</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files);
                        setUploadedFiles(prev => [...prev, ...files]);
                      }
                    }}
                  />
                </div>

                {/* Add Web Link Section */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Link size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Add Web Link</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Add articles, papers, or web pages</p>
                  
                  <div className="space-y-3">
                    <input
                      type="url"
                      placeholder="https://example.com/article"
                      value={newWebLink}
                      onChange={(e) => setNewWebLink(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all duration-200"
                    />
                    <button
                      onClick={() => {
                        if (newWebLink.trim()) {
                          setWebLinks(prev => [...prev, newWebLink.trim()]);
                          setNewWebLink('');
                        }
                      }}
                      disabled={!newWebLink.trim()}
                      className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      Add Link
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Paste URLs from websites and articles</p>
                </div>

                {/* Paste Text Section */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <FileText size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Paste Text</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Add text content directly</p>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter a title for this text"
                      value={newPastedTextTitle}
                      onChange={(e) => setNewPastedTextTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all duration-200"
                    />
                    <textarea
                      placeholder="Paste your text content here..."
                      value={newPastedText}
                      onChange={(e) => setNewPastedText(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all duration-200 resize-none"
                    />
                    <button
                      onClick={() => {
                        if (newPastedText.trim() && newPastedTextTitle.trim()) {
                          const newText = {
                            id: Date.now().toString(),
                            title: newPastedTextTitle.trim(),
                            content: newPastedText.trim()
                          };
                          setPastedTexts(prev => [...prev, newText]);
                          setNewPastedText('');
                          setNewPastedTextTitle('');
                        }
                      }}
                      disabled={!newPastedText.trim() || !newPastedTextTitle.trim()}
                      className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      Add Text
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Perfect for notes, quotes, or any text content</p>
                </div>
              </div>

              {/* Added Items */}
              {(uploadedFiles.length > 0 || webLinks.length > 0 || pastedTexts.length > 0) && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Added Items</h4>
                  
                  {/* Uploaded Files */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400">Files ({uploadedFiles.length})</h5>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <File size={16} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{file.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <button
                            onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                            className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Web Links */}
                  {webLinks.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400">Links ({webLinks.length})</h5>
                      {webLinks.map((link, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <Link size={16} className="text-green-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{link}</span>
                          </div>
                          <button
                            onClick={() => setWebLinks(prev => prev.filter((_, i) => i !== index))}
                            className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pasted Texts */}
                  {pastedTexts.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400">Texts ({pastedTexts.length})</h5>
                      {pastedTexts.map((text, index) => (
                        <div key={text.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <FileText size={16} className="text-purple-500" />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{text.title}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{text.content.substring(0, 50)}...</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setPastedTexts(prev => prev.filter((_, i) => i !== index))}
                            className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/50">
              <button
                onClick={() => setShowAddSourcesModal(false)}
                className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle adding sources logic here
                  setShowAddSourcesModal(false);
                  setUploadedFiles([]);
                  setWebLinks([]);
                  setPastedTexts([]);
                }}
                disabled={uploadedFiles.length === 0 && webLinks.length === 0 && pastedTexts.length === 0}
                className="px-8 py-2.5 bg-gradient-to-r from-[#007AFF] to-[#0056CC] text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Add {uploadedFiles.length + webLinks.length + pastedTexts.length} Source{(uploadedFiles.length + webLinks.length + pastedTexts.length) !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN APPLE NOTEBOOK COMPONENT
// ============================================================================

const AppleNotebook: React.FC = () => {
  const [activePanels, setActivePanels] = useState<string[]>(['sources', 'notes']);
  const [sidebarWidth] = useState(400);
  const [rightPanelWidth] = useState(600);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notesContent, setNotesContent] = useState<string>('');
  const [, setOpenUploadModal] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [hasSeenWalkthrough, setHasSeenWalkthrough] = useState(false);
  const [showTakeTourButton, setShowTakeTourButton] = useState(false);

  const panels = [
    { id: 'sources', label: 'Sources', icon: FileText },
    { id: 'notes', label: 'Notes', icon: StickyNote },
  ];

  const togglePanel = (panelId: string) => {
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

  // Show walkthrough for new users and manage tour button visibility
  useEffect(() => {
    const hasSeenWalkthroughBefore = localStorage.getItem('apple-notebook-walkthrough-seen');
    const isFirstVisit = !hasSeenWalkthroughBefore;
    
    setShowTakeTourButton(isFirstVisit);
    
    if (isFirstVisit) {
      // Delay showing walkthrough to let the interface load
      const timer = setTimeout(() => {
        setShowWalkthrough(true);
      }, 1500); // Increased delay to ensure everything is loaded
      return () => clearTimeout(timer);
    }
  }, []);

  const handleWalkthroughComplete = () => {
    setShowWalkthrough(false);
    setHasSeenWalkthrough(true);
    setShowTakeTourButton(false);
    localStorage.setItem('apple-notebook-walkthrough-seen', 'true');
  };

  const handleStartWalkthrough = () => {
    setShowWalkthrough(true);
  };

  // Function to reset walkthrough (for testing - can be removed in production)
  const resetWalkthrough = () => {
    localStorage.removeItem('apple-notebook-walkthrough-seen');
    setShowTakeTourButton(true);
    setHasSeenWalkthrough(false);
  };

  const renderRightPanels = () => {
    const rightPanels = activePanels.filter(panel => panel !== 'sources');
    if (rightPanels.length === 0) return null;

    if (rightPanels.includes('notes')) {
      return (
         <div
           className="transition-all duration-300 flex-shrink-0"
           style={{ width: `${rightPanelWidth}px` }}
           data-walkthrough="notes-panel"
         >
          <AppleNotesPanel
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
    <div className="apple-notebook flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black overflow-hidden">
      {/* Left Sources Panel */}
      {activePanels.includes('sources') && !isCollapsed && (
        <div
          className="transition-all duration-300 flex-shrink-0"
          style={{ width: `${sidebarWidth}px` }}
          data-walkthrough="sources-panel"
        >
          <AppleSourcesPanel 
            className="h-full" 
            onClose={() => setActivePanels(activePanels.filter(p => p !== 'sources'))} 
          />
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 min-w-0" data-walkthrough="chat-interface">
        <AppleChatInterface 
          onOpenUploadModal={handleOpenUploadModal} 
          onToggleNotes={() => togglePanel('notes')}
          onToggleSources={() => togglePanel('sources')}
          onStartWalkthrough={handleStartWalkthrough}
          showTakeTourButton={showTakeTourButton}
        />
      </div>

      {/* Right Panels (Notes) */}
      {renderRightPanels()}

      {/* Collapsed Sidebar */}
      {isCollapsed && (
        <div className="w-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/30 dark:border-gray-700/30 flex flex-col items-center py-6">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-xl transition-all duration-200 mb-6"
          >
            <ChevronRight size={18} />
          </button>

          <div className="flex flex-col gap-3">
            {panels.map((panel) => (
              <button
                key={panel.id}
                onClick={() => {
                  togglePanel(panel.id);
                  setIsCollapsed(false);
                }}
                className={`p-3 rounded-2xl transition-all duration-200 ${
                  activePanels.includes(panel.id)
                    ? 'bg-[#E3F2FD] dark:bg-[#0D47A1]/30 text-[#0056CC] dark:text-[#42A5F5]'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80'
                }`}
                title={panel.label}
              >
                <panel.icon size={18} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Panel Selector (when no panel is active) */}
      {!isCollapsed && activePanels.length === 0 && (
        <div className="w-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/30 dark:border-gray-700/30 flex flex-col items-center py-6">
          <div className="flex flex-col gap-3">
            {panels.map((panel) => (
              <button
                key={panel.id}
                onClick={() => togglePanel(panel.id)}
                className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-2xl transition-all duration-200"
                title={panel.label}
              >
                <panel.icon size={18} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Walkthrough */}
      <AppleWalkthrough
        isOpen={showWalkthrough}
        onClose={() => setShowWalkthrough(false)}
        onComplete={handleWalkthroughComplete}
      />

      {/* Temporary reset button for testing (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={resetWalkthrough}
          className="fixed bottom-4 right-4 z-[200] px-3 py-2 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors"
        >
          Reset Tour
        </button>
      )}
    </div>
  );
};

export default AppleNotebook;
