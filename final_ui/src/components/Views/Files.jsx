import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Plus, 
  Search, 
  Trash2, 
  Upload, 
  X, 
  FileImage, 
  FileVideo, 
  FileAudio, 
  FileArchive, 
  FileCode, 
  FileSpreadsheet, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  ChevronDown, 
  Grid, 
  List,
  Folder,
  FolderOpen,
  Edit,
  MoreVertical,
  Star,
  Clock,
  Tag,
  Download,
  Share2,
  Eye
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ShareModal from '../ShareModal';

export default function Files() {
  const { darkMode } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedFile, setDraggedFile] = useState(null);
  const [dragOverFolder, setDragOverFolder] = useState(null);
  const [openMoreMenu, setOpenMoreMenu] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [currentFileId, setCurrentFileId] = useState(null);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showAddToFolderModal, setShowAddToFolderModal] = useState(false);
  const [fileToMove, setFileToMove] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderHistory, setFolderHistory] = useState([]);
  const [folders, setFolders] = useState([
    {
      id: 1,
      name: 'Documents',
      createdAt: new Date('2024-07-01'),
      files: []
    },
    {
      id: 2,
      name: 'Images',
      createdAt: new Date('2024-07-02'),
      files: []
    }
  ]);
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 1,
      name: 'ProjectProposal.pdf',
      size: 1258291,
      type: 'application/pdf',
      uploadedAt: new Date('2024-07-10'),
      status: 'uploaded',
      tags: ['Documents', 'Work', 'Proposal'],
      favorite: true,
      views: 24
    },
    {
      id: 2,
      name: 'MeetingNotes.docx',
      size: 819200,
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      uploadedAt: new Date('2024-07-08'),
      status: 'uploaded',
      tags: ['Notes', 'Meeting'],
      favorite: false,
      views: 12
    },
    {
      id: 3,
      name: 'Budget.xlsx',
      size: 512000,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      uploadedAt: new Date('2024-07-05'),
      status: 'uploaded',
      tags: ['Spreadsheets', 'Finance'],
      favorite: true,
      views: 18
    },
    {
      id: 4,
      name: 'Design.sketch',
      size: 2202009,
      type: 'application/sketch',
      uploadedAt: new Date('2024-07-01'),
      status: 'uploaded',
      tags: ['Design', 'UI'],
      favorite: false,
      views: 31
    },
    {
      id: 5,
      name: 'ResearchData.csv',
      size: 156000,
      type: 'text/csv',
      uploadedAt: new Date('2024-06-28'),
      status: 'uploaded',
      tags: ['Data', 'Research'],
      favorite: true,
      views: 45
    },
    {
      id: 6,
      name: 'Presentation.pptx',
      size: 3100000,
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      uploadedAt: new Date('2024-06-25'),
      status: 'uploaded',
      tags: ['Presentations', 'Business'],
      favorite: false,
      views: 22
    }
  ]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Dropdown component that renders in a portal
  const DropdownMenu = () => {
    if (!openMoreMenu || !currentFileId) return null;

    const file = uploadedFiles.find(f => f.id === currentFileId);
    const folder = folders.find(f => f.id === currentFileId);
    
    if (!file && !folder) return null;

    return createPortal(
      <div 
        className="fixed w-48 rounded-2xl z-[9999]" 
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          background: darkMode 
            ? 'rgba(0, 0, 0, 0.3)' 
            : 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: darkMode 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: darkMode 
            ? '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
            : '0 8px 32px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
        }}
      >
        <div className="py-2">
          {file ? (
            // File actions
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadFile(file.id);
                  setOpenMoreMenu(null);
                }}
                className={`w-full px-4 py-3 text-left text-sm ${darkMode ? 'text-white' : 'text-gray-800'} hover:bg-white/20 transition-all duration-200 flex items-center gap-3 rounded-lg mx-1`}
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <Download className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                Download
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShareFile(file.id);
                  setOpenMoreMenu(null);
                }}
                className={`w-full px-4 py-3 text-left text-sm ${darkMode ? 'text-white' : 'text-gray-800'} hover:bg-white/20 transition-all duration-200 flex items-center gap-3 rounded-lg mx-1`}
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <Share2 className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                Share
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(file.id);
                  setOpenMoreMenu(null);
                }}
                className={`w-full px-4 py-3 text-left text-sm ${darkMode ? 'text-white' : 'text-gray-800'} hover:bg-white/20 transition-all duration-200 flex items-center gap-3 rounded-lg mx-1`}
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <Star className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                {file.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFileToMove(file.id);
                  setShowAddToFolderModal(true);
                  setOpenMoreMenu(null);
                }}
                className={`w-full px-4 py-3 text-left text-sm ${darkMode ? 'text-white' : 'text-gray-800'} hover:bg-white/20 transition-all duration-200 flex items-center gap-3 rounded-lg mx-1`}
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <Folder className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                Move to Folder
              </button>
              <div className={`border-t ${darkMode ? 'border-white/10' : 'border-white/20'} my-2 mx-2`}></div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(file.id);
                  setOpenMoreMenu(null);
                }}
                className={`w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50/30 transition-all duration-200 flex items-center gap-3 rounded-lg mx-1`}
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
                Delete
              </button>
            </>
          ) : folder ? (
            // Folder actions
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openFolder(folder.id);
                  setOpenMoreMenu(null);
                }}
                className={`w-full px-4 py-3 text-left text-sm ${darkMode ? 'text-white' : 'text-gray-800'} hover:bg-white/20 transition-all duration-200 flex items-center gap-3 rounded-lg mx-1`}
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <FolderOpen className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                Open Folder
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Rename folder (you can implement this functionality)
                  setOpenMoreMenu(null);
                }}
                className={`w-full px-4 py-3 text-left text-sm ${darkMode ? 'text-white' : 'text-gray-800'} hover:bg-white/20 transition-all duration-200 flex items-center gap-3 rounded-lg mx-1`}
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <Edit className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                Rename
              </button>
              <div className={`border-t ${darkMode ? 'border-white/10' : 'border-white/20'} my-2 mx-2`}></div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFolder(folder.id);
                  setOpenMoreMenu(null);
                }}
                className={`w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50/30 transition-all duration-200 flex items-center gap-3 rounded-lg mx-1`}
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
                Delete Folder
              </button>
            </>
          ) : null}
        </div>
      </div>,
      document.body
    );
  };

  // File upload handler
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      uploadedAt: new Date(),
      status: 'uploaded',
      tags: ['New', 'Uploaded'],
      favorite: false,
      views: 0
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    setSuccessMessage(`${files.length} file(s) uploaded successfully`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // Delete file
  const deleteFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setSelectedFiles(prev => prev.filter(id => id !== fileId));
    setSuccessMessage('File deleted successfully');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // Toggle favorite
  const toggleFavorite = (fileId) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, favorite: !f.favorite } : f
    ));
  };

  // Create new folder
  const createFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now(),
        name: newFolderName.trim(),
        createdAt: new Date(),
        files: []
      };
      setFolders(prev => [...prev, newFolder]);
      setNewFolderName('');
      setShowCreateFolderModal(false);
      setSuccessMessage('Folder created successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Move file to folder
  const moveFileToFolder = (fileId, folderId) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file) {
      // Remove from uploaded files
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      // Add to folder
      setFolders(prev => prev.map(folder => 
        folder.id === folderId 
          ? { ...folder, files: [...folder.files, file] }
          : folder
      ));
      setShowAddToFolderModal(false);
      setFileToMove(null);
      setSuccessMessage(`File moved to folder successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Remove file from folder
  const removeFileFromFolder = (fileId, folderId) => {
    const folder = folders.find(f => f.id === folderId);
    const file = folder?.files.find(f => f.id === fileId);
    if (file) {
      // Add back to uploaded files
      setUploadedFiles(prev => [...prev, file]);
      // Remove from folder
      setFolders(prev => prev.map(f => 
        f.id === folderId 
          ? { ...f, files: f.files.filter(file => file.id !== fileId) }
          : f
      ));
      setSuccessMessage('File removed from folder');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Delete folder
  const deleteFolder = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      // Move all files back to uploaded files
      setUploadedFiles(prev => [...prev, ...folder.files]);
      // Remove folder
      setFolders(prev => prev.filter(f => f.id !== folderId));
      setSuccessMessage('Folder deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Drag and drop handlers for files
  const handleFileDragStart = (e, fileId) => {
    setDraggedFile(fileId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleFileDragEnd = (e) => {
    setDraggedFile(null);
    setDragOverFolder(null);
  };

  const handleFolderDragOver = (e, folderId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverFolder(folderId);
  };

  const handleFolderDragLeave = (e) => {
    setDragOverFolder(null);
  };

  const handleFolderDrop = (e, folderId) => {
    e.preventDefault();
    if (draggedFile) {
      moveFileToFolder(draggedFile, folderId);
    }
    setDraggedFile(null);
    setDragOverFolder(null);
  };

  // Folder navigation functions
  const openFolder = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      setCurrentFolder(folder);
      setFolderHistory(prev => [...prev, folder]);
      setSelectedFiles([]);
    }
  };

  const goBackToParent = () => {
    if (folderHistory.length > 0) {
      const newHistory = [...folderHistory];
      newHistory.pop();
      setFolderHistory(newHistory);
      
      if (newHistory.length === 0) {
        setCurrentFolder(null);
      } else {
        setCurrentFolder(newHistory[newHistory.length - 1]);
      }
      setSelectedFiles([]);
    }
  };

  const goToRoot = () => {
    setCurrentFolder(null);
    setFolderHistory([]);
    setSelectedFiles([]);
  };

  // Handle dot click for selection
  const handleDotClick = (e, itemId) => {
    e.stopPropagation();
    const newSelected = selectedFiles.includes(itemId)
      ? selectedFiles.filter(id => id !== itemId)
      : [...selectedFiles, itemId];
    setSelectedFiles(newSelected);
  };

  // File action handlers
  const handleDownloadFile = (fileId) => {
    console.log('Downloading file:', fileId);
    setSuccessMessage('File downloaded successfully!');
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleShareFile = (fileId) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    setSelectedFile(file);
    setShowShareModal(true);
  };

  const handleDeleteFile = (fileId) => {
    console.log('Deleting file:', fileId);
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setSuccessMessage('File deleted successfully!');
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Handle dropdown positioning
  const handleMoreMenuClick = (fileId, event) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 8,
      left: rect.right - 192
    });
    setCurrentFileId(fileId);
    setOpenMoreMenu(openMoreMenu === fileId ? null : fileId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMoreMenu !== null) {
        setOpenMoreMenu(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMoreMenu]);

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <FileImage className="w-5 h-5" />;
    if (fileType.startsWith('video/')) return <FileVideo className="w-5 h-5" />;
    if (fileType.startsWith('audio/')) return <FileAudio className="w-5 h-5" />;
    if (fileType.includes('.zip') || fileType.includes('.rar')) return <FileArchive className="w-5 h-5" />;
    if (fileType.includes('code') || fileType.includes('script') || fileType.includes('csv')) return <FileCode className="w-5 h-5" />;
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return <FileSpreadsheet className="w-5 h-5" />;
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5" />;
    if (fileType.includes('word') || fileType.includes('doc')) return <FileText className="w-5 h-5" />;
    if (fileType.includes('sketch')) return <FileImage className="w-5 h-5" />;
    if (fileType.includes('presentation')) return <FileText className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  // Get file icon background color with enhanced gradients
  const getFileIconBg = (fileType) => {
    if (fileType.startsWith('image/')) return 'from-[#007AFF] to-[#5AC8FA]'; // Apple Blue for images
    if (fileType.startsWith('video/')) return 'from-[#30D158] to-[#4CAF50]'; // Apple Green for videos
    if (fileType.startsWith('audio/')) return 'from-[#007AFF] to-[#5AC8FA]'; // Apple Blue for audio
    if (fileType.includes('.zip') || fileType.includes('.rar')) return 'from-[#FF9500] to-[#FFB340]'; // Apple Orange for archives
    if (fileType.includes('code') || fileType.includes('script') || fileType.includes('csv')) return 'from-[#007AFF] to-[#5AC8FA]'; // Apple Blue for code
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'from-[#30D158] to-[#4CAF50]'; // Apple Green for spreadsheets
    if (fileType.includes('pdf')) return 'from-[#FF3B30] to-[#FF6961]'; // Apple Red for PDFs
    if (fileType.includes('word') || fileType.includes('doc')) return 'from-[#007AFF] to-[#5AC8FA]'; // Apple Blue for documents
    if (fileType.includes('sketch')) return 'from-[#FF9500] to-[#FFB340]'; // Apple Orange for design files
    if (fileType.includes('presentation')) return 'from-[#30D158] to-[#4CAF50]'; // Apple Green for presentations
    return 'from-gray-400 to-gray-600'; // Gray for unknown types
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Close modal
  const closeModal = () => {
    setShowAddFileModal(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Handle click outside modal
  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        file,
        uploadedAt: new Date(),
        status: 'uploaded',
        tags: ['New', 'Uploaded'],
        favorite: false,
        views: 0
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setSuccessMessage(`${files.length} file(s) uploaded successfully`);
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  // Get files to display (either from current folder or all files)
  const filesToDisplay = currentFolder ? currentFolder.files : uploadedFiles;

  // Filter and sort files
  const filteredAndSortedFiles = filesToDisplay
    .filter(file => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'favorites') return file.favorite;
      if (activeFilter === 'recent') return (Date.now() - file.uploadedAt.getTime()) < 7 * 24 * 60 * 60 * 1000;
      return file.tags.some(tag => tag.toLowerCase().includes(activeFilter.toLowerCase()));
    })
    .filter(file => file.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') return b.uploadedAt - a.uploadedAt;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'size') return b.size - a.size;
      if (sortBy === 'views') return b.views - a.views;
      return 0;
    });

  // Filter and sort folders (only show in root view)
  const filteredAndSortedFolders = currentFolder ? [] : folders
    .filter(folder => folder.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') return b.createdAt - a.createdAt;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className={`flex flex-col h-full w-full transition-all duration-500 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header Section */}
      <div className={`px-8 pt-8 pb-6 ${
        darkMode ? 'bg-gray-800/50' : 'bg-white/80'
      } backdrop-blur-xl border-b ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {currentFolder && (
                <button
                  onClick={goBackToParent}
                  className={`p-2 rounded-xl transition-colors ${
                    darkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title="Go back"
                >
                  <ChevronDown className="w-6 h-6 transform rotate-90" />
                </button>
              )}
            <div>
              <h1 className={`text-4xl font-light mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                  {currentFolder ? currentFolder.name : 'Files'}
              </h1>
              <p className={`text-lg ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                  {currentFolder 
                    ? `Files in ${currentFolder.name} folder`
                    : 'Organize and access your documents with elegance'
                  }
              </p>
              </div>
      </div>

            <div className="flex items-center gap-3">
              {/* Selection Actions - Only show when items are selected */}
              {selectedFiles.length > 0 && (
                <>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                    darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'
                  }`}>
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {selectedFiles.length} selected
                    </span>
                    <button
                      onClick={() => {
                        setSelectedFiles([]);
                      }}
                      className={`text-xs ${
                        darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      } transition-colors`}
                    >
                      Clear
                    </button>
                  </div>
                  
                  <button
                    onClick={() => {
                      console.log('Downloading selected files:', selectedFiles);
                      setSuccessMessage(`${selectedFiles.length} file(s) downloaded successfully!`);
                      setTimeout(() => setSuccessMessage(''), 3000);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  
                  <button
                    onClick={() => {
                      console.log('Sharing selected files:', selectedFiles);
                      setSuccessMessage(`${selectedFiles.length} file(s) shared successfully!`);
                      setTimeout(() => setSuccessMessage(''), 3000);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  
                  <button
                    onClick={() => {
                      const confirmed = window.confirm(`Are you sure you want to delete ${selectedFiles.length} item(s)?`);
                      if (confirmed) {
                        setUploadedFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
                        setFolders(prev => prev.map(folder => ({
                          ...folder,
                          files: folder.files.filter(file => !selectedFiles.includes(file.id))
                        })));
                        setSelectedFiles([]);
                        setSuccessMessage(`${selectedFiles.length} item(s) deleted successfully!`);
                        setTimeout(() => setSuccessMessage(''), 3000);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </>
              )}
              
              <button 
                onClick={() => setShowCreateFolderModal(true)}
                className={`group relative px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-lg hover:shadow-xl'
                } transform hover:scale-105 active:scale-95`}
              >
                <Folder className="w-5 h-5 mr-2 inline" />
                New Folder
              </button>
              <button 
                onClick={() => setShowAddFileModal(true)}
                className={`group relative px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                } transform hover:scale-105 active:scale-95`}
              >
                <Plus className="w-5 h-5 mr-2 inline" />
                Add Files
              </button>
            </div>
          </div>

          {/* Breadcrumb Navigation */}
          {currentFolder && (
            <div className={`mb-6 p-4 rounded-xl ${
              darkMode ? 'bg-gray-800/50' : 'bg-white/50'
            } border ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={goToRoot}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Folder className="w-4 h-4" />
                  All Files
                </button>
                {folderHistory.map((folder, index) => (
                  <React.Fragment key={folder.id}>
                    <ChevronDown className={`w-4 h-4 transform rotate-90 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <button
                      onClick={() => {
                        const newHistory = folderHistory.slice(0, index + 1);
                        setFolderHistory(newHistory);
                        setCurrentFolder(folder);
                        setSelectedFiles([]);
                      }}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                        index === folderHistory.length - 1
                          ? darkMode 
                            ? 'text-white bg-gray-700' 
                            : 'text-gray-900 bg-gray-100'
                          : darkMode 
                            ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Folder className="w-4 h-4" />
                      {folder.name}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

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
            placeholder="Search files..."
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                } focus:outline-none`}
          />
        </div>
        
            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              {['all', 'favorites', 'recent', 'documents', 'images', 'spreadsheets'].map((filter) => (
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
      <div className="flex-1 px-8 py-6">
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
              {filteredAndSortedFiles.length} of {filesToDisplay.length} files
              {currentFolder && ` in "${currentFolder.name}"`}
            </div>
          </div>

          {/* Files Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-visible">
              {/* Folders */}
              {filteredAndSortedFolders.map((folder) => (
                <div
                  key={folder.id}
                  className={`group relative ${
                    darkMode ? 'bg-gray-800/50' : 'bg-white'
                  } rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border ${
                    selectedFiles.includes(folder.id)
                      ? 'ring-2 ring-blue-500 shadow-blue-500/25'
                      : dragOverFolder === folder.id
                        ? 'ring-2 ring-green-500 shadow-green-500/25 scale-105'
                        : darkMode
                          ? 'border-gray-700 hover:border-gray-600'
                          : 'border-gray-200 hover:border-gray-300'
                  } overflow-visible aspect-[4/3]`}
                  onClick={() => openFolder(folder.id)}
                  onDragOver={(e) => handleFolderDragOver(e, folder.id)}
                  onDragLeave={handleFolderDragLeave}
                  onDrop={(e) => handleFolderDrop(e, folder.id)}
                >
                  <div className="flex flex-col h-full p-4">
                    {/* Top section with icon and selection */}
                    <div className="flex items-start justify-between mb-3">
                      {/* Folder icon */}
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center shadow-md`}>
                        <Folder className="w-6 h-6 text-white" />
                      </div>

                      {/* Selection indicator */}
        <button 
                        onClick={(e) => handleDotClick(e, folder.id)}
                        className={`w-4 h-4 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                          selectedFiles.includes(folder.id)
                            ? 'bg-blue-500 border-blue-500 scale-110'
                            : 'bg-transparent border-gray-400 group-hover:border-gray-300 hover:border-blue-400'
                        }`}
                        title="Select folder"
                      />
                    </div>

                    {/* Folder info */}
                    <div className="flex-1">
                      <div className="mb-2">
                        <div className={`font-semibold text-sm mb-1 truncate ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {folder.name}
                        </div>
                        <div className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {folder.files.length} files • {folder.createdAt.toLocaleDateString()}
                        </div>
                        {dragOverFolder === folder.id && (
                          <div className="mt-2 px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 text-xs rounded-lg border border-green-500/30">
                            Drop file here
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom section with actions */}
                    <div className="flex items-center justify-between">
                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative z-10"
                          onClick={(e) => handleMoreMenuClick(folder.id, e)}
                          title="More Options"
                        >
                          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

                      {/* Folder indicator */}
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Folder
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Files */}
              {filteredAndSortedFiles.length === 0 && filteredAndSortedFolders.length === 0 ? (
                <div className={`col-span-full text-center py-16 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">
                    {currentFolder ? `No files in "${currentFolder.name}"` : 'No files found'}
                  </p>
                  <p className="text-sm">
                    {currentFolder 
                      ? 'This folder is empty. Drag files here or use the menu to add files.'
                      : 'Try adjusting your search or filters'
                    }
                  </p>
                </div>
              ) : (
                filteredAndSortedFiles.map((file) => (
                <div
                  key={file.id}
                  data-file-id={file.id}
                  draggable
                  onDragStart={(e) => handleFileDragStart(e, file.id)}
                  onDragEnd={handleFileDragEnd}
                  className={`group relative ${
                    darkMode ? 'bg-gray-800/50' : 'bg-white'
                  } rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border ${
                  selectedFiles.includes(file.id) 
                      ? 'ring-2 ring-blue-500 shadow-blue-500/25'
                      : draggedFile === file.id
                        ? 'opacity-50 scale-95'
                      : darkMode
                        ? 'border-gray-700 hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                  } overflow-visible aspect-[4/3]`}
                  onClick={() => {
                    const newSelected = selectedFiles.includes(file.id) 
                      ? selectedFiles.filter(id => id !== file.id)
                      : [...selectedFiles, file.id];
                    setSelectedFiles(newSelected);
                  }}
                >
                  <div className="flex flex-col h-full p-4">
                    {/* Top section with icon and selection */}
                    <div className="flex items-start justify-between mb-3">
                  {/* File icon */}
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getFileIconBg(file.type)} flex items-center justify-center shadow-md`}>
                    {getFileIcon(file.type)}
                      </div>

                      {/* Selection indicator */}
                      <button
                        onClick={(e) => handleDotClick(e, file.id)}
                        className={`w-4 h-4 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                        selectedFiles.includes(file.id)
                          ? 'bg-blue-500 border-blue-500 scale-110'
                            : 'bg-transparent border-gray-400 group-hover:border-gray-300 hover:border-blue-400'
                        }`}
                        title="Select file"
                      />
                  </div>
                  
                  {/* File info */}
                    <div className="flex-1">
                      <div className="mb-2">
                        <div className={`font-semibold text-sm mb-1 truncate ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {file.name}
                        </div>
                        <div className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                        </div>
                  </div>
                  
                  {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {file.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${
                            darkMode
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                        {tag}
                      </span>
                    ))}
                        {file.tags.length > 3 && (
                          <span className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${
                            darkMode
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            +{file.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom section with actions and favorite */}
                    <div className="flex items-center justify-between">
                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadFile(file.id);
                          }}
                          title="Download File"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareFile(file.id);
                          }}
                          title="Share File"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative z-10"
                          onClick={(e) => handleMoreMenuClick(file.id, e)}
                          title="More Options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Favorite indicator */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(file.id);
                        }}
                        className={`p-1 rounded-full transition-all duration-300 ${
                          file.favorite
                            ? 'bg-yellow-500 text-white shadow-lg'
                            : 'bg-black/20 text-transparent hover:text-yellow-400 hover:bg-yellow-500/20'
                        }`}
                      >
                        <Star className="w-3 h-3" fill={file.favorite ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
              {filteredAndSortedFiles.length === 0 ? (
                <div className={`text-center py-16 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No files found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredAndSortedFiles.map((file) => (
                <div
                  key={file.id}
                  data-file-id={file.id}
                  className={`group relative ${
                    darkMode ? 'bg-gray-800/50' : 'bg-white'
                  } rounded-xl p-4 transition-all duration-300 cursor-pointer border ${
                    selectedFiles.includes(file.id) 
                      ? 'ring-2 ring-blue-500 shadow-blue-500/25'
                      : darkMode
                        ? 'border-gray-700 hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                  } hover:shadow-lg`}
                  onClick={() => {
                    const newSelected = selectedFiles.includes(file.id) 
                      ? selectedFiles.filter(id => id !== file.id)
                      : [...selectedFiles, file.id];
                    setSelectedFiles(newSelected);
                  }}
                >
                  <div className="flex items-center">
                    {/* File icon */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getFileIconBg(file.type)} flex items-center justify-center shadow-lg flex-shrink-0 mr-6`}>
                      {getFileIcon(file.type)}
                    </div>
                    
                    {/* File details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`font-semibold text-lg truncate ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {file.name}
                        </div>
                        {file.favorite && (
                          <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
                        )}
                      </div>
                      <div className={`text-base mb-3 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()} • {file.views} views
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {file.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className={`px-3 py-1.5 text-sm rounded-full font-medium ${
                            darkMode
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {tag}
                          </span>
                        ))}
                        {file.tags.length > 3 && (
                          <span className={`px-3 py-1.5 text-sm rounded-full font-medium ${
                            darkMode
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            +{file.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0 mr-4">
                      <button 
                        className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadFile(file.id);
                        }}
                        title="Download File"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button 
                        className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareFile(file.id);
                        }}
                        title="Share File"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                      <button 
                        className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative z-10"
                        onClick={(e) => handleMoreMenuClick(file.id, e)}
                        title="More Options"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Selection indicator */}
                    <button
                      onClick={(e) => handleDotClick(e, file.id)}
                      className={`w-6 h-6 rounded-full border-2 transition-all duration-300 flex-shrink-0 mr-4 hover:scale-110 ${
                      selectedFiles.includes(file.id) 
                        ? 'bg-blue-500 border-blue-500 scale-110'
                          : 'bg-transparent border-gray-400 group-hover:border-gray-300 hover:border-blue-400'
                      }`}
                      title="Select file"
                    />

                    {/* Favorite indicator */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(file.id);
                      }}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        file.favorite
                          ? 'bg-yellow-500 text-white shadow-lg'
                          : 'bg-black/20 text-transparent hover:text-yellow-400 hover:bg-yellow-500/20'
                      }`}
                    >
                      <Star className="w-5 h-5" fill={file.favorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              ))
              )}
            </div>
          )}
        </div>
      </div>

              {/* Selection Menu */}
        {selectedFiles.length > 0 && (
          <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
            selectedFiles.length > 0 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
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
                {selectedFiles.length} selected
              </div>

              {/* Divider */}
              <div className={`w-px h-6 ${
                darkMode ? 'bg-gray-600/50' : 'bg-gray-300/50'
              }`}></div>

              {/* Action Buttons */}
              <button 
                onClick={() => {
                  setSuccessMessage(`Created new project with ${selectedFiles.length} file(s)`);
                  setSelectedFiles([]);
                }}
                className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              >
                Create New Project
              </button>
              
              <button 
                onClick={() => {
                  setSuccessMessage(`Imported ${selectedFiles.length} file(s) to existing chat`);
                  setSelectedFiles([]);
                }}
                className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700 hover:text-white' 
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:text-gray-900'
                } shadow-md`}
              >
                Import to Existing Chat
              </button>
              
              <button 
                onClick={() => {
                  setSuccessMessage(`Exported ${selectedFiles.length} file(s) to new chat`);
                  setSelectedFiles([]);
                }}
                className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700 hover:text-white' 
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:text-gray-900'
                } shadow-md`}
              >
                Export to New Chat
              </button>
              
              <button 
                onClick={() => {
                  setSuccessMessage(`Started document analysis for ${selectedFiles.length} file(s)`);
                  setSelectedFiles([]);
                }}
                className="px-5 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              >
                Run Document Analysis
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
              darkMode ? 'bg-[#2196F3] text-white' : 'bg-[#2196F3] text-white'
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

      {/* Add File Modal */}
      {showAddFileModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-md"
          onClick={handleModalClick}
        >
          <div className={`${
            darkMode ? 'bg-gray-800/95' : 'bg-white/95'
          } rounded-3xl shadow-2xl w-[42rem] max-h-[85vh] overflow-hidden transform transition-all duration-500 scale-100 backdrop-blur-xl border ${
            darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
          }`}>
            <div className={`flex items-center justify-between p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Add Files
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
            
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Drag & Drop Zone */}
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
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
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".csv,.txt,.pdf,.doc,.docx,.xls,.xlsx,.r,.R,.jpg,.jpeg,.png,.gif,.sketch,.pptx"
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
                      Supports PDF, DOC, XLS, CSV, Images, and more
                    </p>
                  </div>
                </button>
              </div>
              
              {/* Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Recent Files ({uploadedFiles.length})
                    </h3>
                    <button 
                      onClick={() => setUploadedFiles([])}
                      className={`text-sm ${
                        darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'
                      } hover:underline`}
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {uploadedFiles.slice(-5).map((file) => (
                      <div key={file.id} className={`flex items-center gap-4 p-4 rounded-xl border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getFileIconBg(file.type)} flex items-center justify-center`}>
                        {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {file.name}
                          </p>
                          <p className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                              darkMode
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                            title="Use in Chat"
                          >
                            Use in Chat
                          </button>
                          <button 
                            onClick={() => deleteFile(file.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              darkMode
                                ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                                : 'text-red-600 hover:text-red-700 hover:bg-red-100'
                            }`}
                            title="Delete file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
                  </div>
                </div>
              )}
              
      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        itemName={selectedFile?.name || ''}
        itemType="file"
      />

      {/* Dropdown Menu Portal */}
      <DropdownMenu />


      {/* Create Folder Modal */}
      {showCreateFolderModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && setShowCreateFolderModal(false)}
        >
          <div className={`${
            darkMode ? 'bg-gray-800/95' : 'bg-white/95'
          } rounded-3xl shadow-2xl w-96 max-h-[85vh] overflow-hidden transform transition-all duration-500 scale-100 backdrop-blur-xl border ${
            darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
          }`}>
            <div className={`flex items-center justify-between p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Create New Folder
              </h2>
              <button 
                onClick={() => setShowCreateFolderModal(false)} 
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
                  Folder Name
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name..."
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  } focus:outline-none`}
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && createFolder()}
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCreateFolderModal(false)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={createFolder}
                  disabled={!newFolderName.trim()}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    newFolderName.trim()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                >
                  Create Folder
                </button>
              </div>
            </div>
          </div>
                </div>
              )}

      {/* Add to Folder Modal */}
      {showAddToFolderModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && setShowAddToFolderModal(false)}
        >
          <div className={`${
            darkMode ? 'bg-gray-800/95' : 'bg-white/95'
          } rounded-3xl shadow-2xl w-96 max-h-[85vh] overflow-hidden transform transition-all duration-500 scale-100 backdrop-blur-xl border ${
            darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
          }`}>
            <div className={`flex items-center justify-between p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Move to Folder
              </h2>
              <button 
                onClick={() => setShowAddToFolderModal(false)} 
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
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => moveFileToFolder(fileToMove, folder.id)}
                    className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Folder className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <div>
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {folder.name}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {folder.files.length} files
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
                {folders.length === 0 && (
                  <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No folders available. Create a folder first.
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 