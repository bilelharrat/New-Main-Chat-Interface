import React, { useState, useRef } from 'react';
import { Plus, Search, Trash2, Upload, X, FileImage, FileVideo, FileAudio, FileArchive, FileCode, FileSpreadsheet, FileText, AlertCircle, CheckCircle, ChevronDown, Grid, List } from 'lucide-react';

export default function Files() {
  const [search, setSearch] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 1,
      name: 'ProjectProposal.pdf',
      size: 1258291, // 1.2 MB
      type: 'application/pdf',
      uploadedAt: new Date('2024-07-10'),
      status: 'uploaded',
      tags: ['Documents', 'work', 'proposal']
    },
    {
      id: 2,
      name: 'MeetingNotes.docx',
      size: 819200, // 800 KB
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      uploadedAt: new Date('2024-07-08'),
      status: 'uploaded',
      tags: ['Notes', 'meeting', 'notes']
    },
    {
      id: 3,
      name: 'Budget.xlsx',
      size: 512000, // 500 KB
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      uploadedAt: new Date('2024-07-05'),
      status: 'uploaded',
      tags: ['Spreadsheets', 'finance', 'budget']
    },
    {
      id: 4,
      name: 'Design.sketch',
      size: 2202009, // 2.1 MB
      type: 'application/sketch',
      uploadedAt: new Date('2024-07-01'),
      status: 'uploaded',
      tags: ['Design', 'design', 'ui']
    }
  ]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

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
      tags: ['New', 'uploaded']
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    setSuccessMessage(`${files.length} file(s) uploaded successfully`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Delete file
  const deleteFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setSuccessMessage('File deleted successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Get file icon based on type - all icons should be white
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <FileImage className="w-6 h-6 text-white" />;
    if (fileType.startsWith('video/')) return <FileVideo className="w-6 h-6 text-white" />;
    if (fileType.startsWith('audio/')) return <FileAudio className="w-6 h-6 text-white" />;
    if (fileType.includes('.zip') || fileType.includes('.rar')) return <FileArchive className="w-6 h-6 text-white" />;
    if (fileType.includes('code') || fileType.includes('script')) return <FileCode className="w-6 h-6 text-white" />;
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return <FileSpreadsheet className="w-6 h-6 text-white" />;
    if (fileType.includes('pdf')) return <FileText className="w-6 h-6 text-white" />;
    if (fileType.includes('word') || fileType.includes('doc')) return <FileText className="w-6 h-6 text-white" />;
    if (fileType.includes('sketch')) return <FileImage className="w-6 h-6 text-white" />;
    return <FileText className="w-6 h-6 text-white" />;
  };

  // Get file icon background color
  const getFileIconBg = (fileType) => {
    if (fileType.startsWith('image/')) return 'bg-blue-500';
    if (fileType.startsWith('video/')) return 'bg-purple-500';
    if (fileType.startsWith('audio/')) return 'bg-green-500';
    if (fileType.includes('.zip') || fileType.includes('.rar')) return 'bg-orange-500';
    if (fileType.includes('code') || fileType.includes('script')) return 'bg-red-500';
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'bg-green-600';
    if (fileType.includes('pdf')) return 'bg-blue-600';
    if (fileType.includes('word') || fileType.includes('doc')) return 'bg-orange-600';
    if (fileType.includes('sketch')) return 'bg-orange-500';
    return 'bg-gray-500';
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

  return (
    <div className="flex flex-col h-full w-full p-8">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">Files</h1>
        <p className="text-lg text-gray-700">Manage and organize your documents</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 text-base"
          />
        </div>
        
        <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          All Categories
          <ChevronDown size={16} />
        </button>
        
        <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          Sort by Date
          <ChevronDown size={16} />
        </button>
      </div>

      {/* View Options and Add File Button */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'grid' 
                ? 'bg-green-500 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'list' 
                ? 'bg-green-500 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <List size={16} />
          </button>
        </div>
        
        <button 
          onClick={() => setShowAddFileModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} /> Add File
        </button>
      </div>

      {/* File Display - Grid or List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {uploadedFiles.length === 0 ? (
            <div className="col-span-full text-gray-400 text-center py-12">No files uploaded yet. Click "Add File" to get started.</div>
          ) : (
            uploadedFiles
              .filter(file => file.name.toLowerCase().includes(search.toLowerCase()))
              .map(file => (
                <div
                  key={file.id}
                                  className={`group relative bg-white border border-gray-200 rounded-xl shadow-md p-5 transition-all duration-200 ${
                  selectedFiles.includes(file.id) 
                    ? 'ring-2 ring-blue-400 shadow-xl' 
                    : 'hover:shadow-lg hover:border-gray-300'
                } cursor-pointer`}
                  onClick={() => {
                    const newSelected = selectedFiles.includes(file.id) 
                      ? selectedFiles.filter(id => id !== file.id)
                      : [...selectedFiles, file.id];
                    setSelectedFiles(newSelected);
                  }}
                >
                  {/* Selection indicator */}
                  <div className={`absolute top-4 right-4 w-4 h-4 rounded-full border-2 transition-colors ${
                    selectedFiles.includes(file.id) 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'bg-gray-100 border-gray-400'
                  }`} />
                  
                  {/* File icon */}
                  <div className={`w-12 h-12 ${getFileIconBg(file.type)} rounded-lg flex items-center justify-center mb-4`}>
                    {getFileIcon(file.type)}
                  </div>
                  
                  {/* File info */}
                  <div className="mb-3">
                    <div className="font-semibold text-gray-900 text-base mb-1 truncate">{file.name}</div>
                    <div className="text-sm text-gray-500">{formatFileSize(file.size)} · {file.uploadedAt.toLocaleDateString()}</div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {file.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {uploadedFiles.length === 0 ? (
            <div className="text-gray-400 text-center py-12">No files uploaded yet. Click "Add File" to get started.</div>
          ) : (
            uploadedFiles
              .filter(file => file.name.toLowerCase().includes(search.toLowerCase()))
              .map(file => (
                <div
                  key={file.id}
                  className={`group relative bg-gray-50 border border-gray-200 rounded-xl p-4 transition-all duration-200 ${
                    selectedFiles.includes(file.id) 
                      ? 'ring-2 ring-blue-400 shadow-lg bg-white' 
                      : 'hover:bg-white hover:shadow-md hover:border-gray-300'
                  } cursor-pointer`}
                  onClick={() => {
                    const newSelected = selectedFiles.includes(file.id) 
                      ? selectedFiles.filter(id => id !== file.id)
                      : [...selectedFiles, file.id];
                    setSelectedFiles(newSelected);
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* File icon */}
                    <div className={`w-12 h-12 ${getFileIconBg(file.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      {getFileIcon(file.type)}
                    </div>
                    
                    {/* File details */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-base mb-1">{file.name}</div>
                      <div className="text-sm text-gray-500 mb-2">{formatFileSize(file.size)} · {file.uploadedAt.toLocaleDateString()}</div>
                      <div className="flex flex-wrap gap-2">
                        {file.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Selection indicator */}
                    <div className={`w-4 h-4 rounded-full border-2 transition-colors flex-shrink-0 ${
                      selectedFiles.includes(file.id) 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'bg-gray-100 border-gray-400'
                    }`} />
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* Add File Modal */}
      {showAddFileModal && (
        <div 
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={handleModalClick}
        >
          <div className="bg-white rounded-lg shadow-xl w-[32rem] max-h-[80vh] overflow-hidden transform transition-all duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Add Files</h2>
              <button 
                onClick={closeModal} 
                className="text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Upload Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Upload Files</h3>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".csv,.txt,.pdf,.doc,.docx,.xls,.xlsx,.r,.R,.jpg,.jpeg,.png,.gif,.sketch"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors flex flex-col items-center justify-center gap-3 bg-gray-50"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <div className="text-center">
                    <p className="font-medium text-gray-900">Click to upload files</p>
                    <p className="text-sm text-gray-500">CSV, TXT, PDF, DOC, XLS, R, Images, Sketch</p>
                  </div>
                </button>
              </div>
              
              {/* Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Uploaded Files ({uploadedFiles.length})</h3>
                    <button 
                      onClick={() => setUploadedFiles([])}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                            title="Use in Chat"
                          >
                            Use in Chat
                          </button>
                          <button 
                            onClick={() => deleteFile(file.id)}
                            className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                            title="Delete file"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Success/Error Messages */}
              {successMessage && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">{successMessage}</span>
                </div>
              )}
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700">{errorMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 