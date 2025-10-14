import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
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
  X,
  ChevronLeft,
  File,
  Image,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  FileCode,
  FolderOpen,
  Link
} from 'lucide-react';

interface Source {
  id: string;
  title: string;
  authors: string[];
  year: number;
  type: 'pdf' | 'web' | 'book' | 'article';
  url?: string;
  doi?: string;
  summary?: string;
  outline?: string[];
}

const mockSources: Source[] = [
  {
    id: '1',
    title: 'The Future of Artificial Intelligence in Healthcare',
    authors: ['Dr. Sarah Johnson', 'Prof. Michael Chen'],
    year: 2024,
    type: 'article',
    doi: '10.1038/ai-health-2024',
    summary: 'Comprehensive analysis of AI applications in medical diagnosis and treatment.',
    outline: [
      'Introduction to AI in Healthcare',
      'Current Applications',
      'Challenges and Limitations',
      'Future Prospects',
      'Ethical Considerations'
    ]
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    authors: ['Dr. Emily Rodriguez'],
    year: 2023,
    type: 'book',
    summary: 'Essential concepts and algorithms in machine learning.',
    outline: [
      'Supervised Learning',
      'Unsupervised Learning',
      'Neural Networks',
      'Deep Learning',
      'Practical Applications'
    ]
  },
  {
    id: '3',
    title: 'Web3 and Decentralized Systems',
    authors: ['Alex Thompson', 'Maria Garcia'],
    year: 2024,
    type: 'web',
    url: 'https://example.com/web3-research',
    summary: 'Analysis of decentralized technologies and their impact on society.',
    outline: [
      'Blockchain Technology',
      'Smart Contracts',
      'Decentralized Finance',
      'Governance Models',
      'Future Implications'
    ]
  }
];

const SourceCard: React.FC<{ 
  source: Source; 
  onSelect: (source: Source) => void;
  isSelected: boolean;
  onToggleSelection: (sourceId: string) => void;
}> = ({ source, onSelect, isSelected, onToggleSelection }) => {
  const getTypeIcon = () => {
    switch (source.type) {
      case 'pdf': return FileText;
      case 'web': return ExternalLink;
      case 'book': return BookOpen;
      case 'article': return FileText;
      default: return FileText;
    }
  };

  const TypeIcon = getTypeIcon();

  return (
    <div 
      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer group ${
        isSelected 
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/60' 
          : 'bg-white dark:bg-gray-800 border-gray-200/60 dark:border-gray-700/60 hover:shadow-md'
      }`}
      onClick={() => onSelect(source)}
    >
      <div className="flex items-start gap-3">
        {/* Selection Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelection(source.id);
          }}
          className={`mt-1 p-1 rounded transition-colors ${
            isSelected 
              ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30' 
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
        </button>
        
        <div className={`p-2 rounded-lg ${
          isSelected 
            ? 'bg-blue-100 dark:bg-blue-900/30' 
            : 'bg-blue-50 dark:bg-blue-900/20'
        }`}>
          <TypeIcon size={16} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white text-sm leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {source.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <User size={12} />
            <span>{source.authors.join(', ')}</span>
            <Calendar size={12} />
            <span>{source.year}</span>
          </div>
          {source.summary && (
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
              {source.summary}
            </p>
          )}
        </div>
      </div>
      
    </div>
  );
};

interface SourcesPanelProps {
  className?: string;
  onClose?: () => void;
  openUploadModal?: boolean;
  onUploadModalClose?: () => void;
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({ className = '', onClose, openUploadModal = false, onUploadModalClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [sources] = useState<Source[]>(mockSources);
  const [selectedSourceIds, setSelectedSourceIds] = useState<Set<string>>(new Set());
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setSelectedSourceIds(new Set(filteredSources.map(s => s.id)));
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
                Show Selected Only
              </button>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={selectAllSources}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <CheckSquare size={12} />
            Select All
          </button>
          {selectedSourceIds.size > 0 && (
            <button
              onClick={clearSelection}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Square size={12} />
              Clear All
            </button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredSources.length > 0 ? (
            filteredSources.map(source => (
              <SourceCard 
                key={source.id} 
                source={source} 
                onSelect={setSelectedSource}
                isSelected={selectedSourceIds.has(source.id)}
                onToggleSelection={toggleSourceSelection}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FileText size={32} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">No sources found</p>
              {searchQuery && (
                <p className="text-xs mt-1">Try adjusting your search terms</p>
              )}
            </div>
          )}
        </div>
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
              These sources will be used for AI analysis and citation generation
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
                  // TODO: Process uploaded files
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

export default SourcesPanel;
