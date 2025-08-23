import React, { useState } from 'react';
import { 
  Sparkles, Target, Zap, Lightbulb, TrendingUp, Calendar, Bookmark, Share2,
  Milestone, Paperclip, CheckCircle, AlertCircle, Edit3, Brain, Sparkles as SparklesIcon,
  Settings, Send, X, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, Highlighter, Link, Quote, Code, Type, List, ListOrdered,
  Save, BookOpen, BarChart3, Clock, Plus, Pencil, ChevronDown, FileText
} from 'lucide-react';

const ResearchMode = () => {
  const [notes, setNotes] = useState('');
  const [researchContent, setResearchContent] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('Chicago');
  const [viewMode, setViewMode] = useState('Side');
  const [activeTab, setActiveTab] = useState('Writing');
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [customFormat, setCustomFormat] = useState('');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notesContent, setNotesContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState('12:22:45 PM');

  const formatOptions = [
    { id: 'Academic', name: 'Academic', description: 'Formal, scholarly writing' },
    { id: 'APA', name: 'APA Style', description: 'American Psychological Association' },
    { id: 'MLA', name: 'MLA Style', description: 'Modern Language Association' },
    { id: 'Chicago', name: 'Chicago', description: 'Chicago Manual of Style' },
    { id: 'Business', name: 'Business', description: 'Professional, concise' },
    { id: 'Creative', name: 'Creative', description: 'Expressive, engaging' },
    { id: 'Technical', name: 'Technical', description: 'Precise, detailed' },
    { id: 'Casual', name: 'Casual', description: 'Informal, friendly' },
    { id: 'Journalistic', name: 'Journalistic', description: 'Clear, objective' }
  ];

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleFormatChange = (format) => {
    setSelectedFormat(format);
    setShowFormatModal(false);
  };

  const applyCustomFormat = () => {
    setSelectedFormat(customFormat);
    setShowFormatModal(false);
  };

  const handleNotesChange = (e) => {
    const content = e.target.value;
    setNotesContent(content);
    
    // Calculate word and character count
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const chars = content.length;
    setWordCount(words);
    setCharCount(chars);
    
    // Auto-save timestamp update
    const now = new Date();
    setLastSaved(now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    }));
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Writing':
        return (
          <div className="flex-1 p-8">
            <div className="w-full h-full bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Toolbar integrated into text editor */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gray-50">
                <select className="text-sm border-0 bg-transparent focus:outline-none text-gray-700 font-semibold pr-10 cursor-pointer hover:text-gray-900 transition-colors">
                  <option>Normal</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                </select>
                <div className="h-5 w-px bg-gray-300 mx-4"></div>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all duration-200 group">
                  <Bold className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all duration-200 group">
                  <Italic className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all duration-200 group">
                  <Underline className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all duration-200 group">
                  <Strikethrough className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                </button>
                <div className="h-5 w-px bg-gray-300 mx-4"></div>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all duration-200 group">
                  <AlignLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all duration-200 group">
                  <AlignCenter className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all duration-200 group">
                  <AlignRight className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all duration-200 group">
                  <AlignJustify className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                </button>
                <div className="h-5 w-px bg-gray-300 mx-4"></div>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all duration-200 group">
                  <List className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all duration-200 group">
                  <ListOrdered className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                </button>
                <div className="h-5 w-px bg-gray-300 mx-4"></div>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all duration-200 group">
                  <Type className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all duration-200 group">
                  <Highlighter className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all duration-200 group">
                  <Link className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all duration-200 group">
                  <Quote className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all duration-200 group">
                  <Code className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all duration-200 group">
                  <X className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                </button>
              </div>
              
              {/* Text Editor - Integrated with toolbar */}
              <div className="flex-1 p-6">
                <textarea
                  value={researchContent}
                  onChange={(e) => setResearchContent(e.target.value)}
                  onContextMenu={handleContextMenu}
                  placeholder="Begin your research paper with clarity and purpose. Let your ideas flow naturally..."
                  className="w-full h-full border-0 bg-transparent text-gray-900 resize-none focus:outline-none text-base leading-relaxed placeholder-gray-400 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        );
      
      case 'Outline':
  return (
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Research Outline</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Section
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">1. Introduction</h3>
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50/80 rounded-lg transition-all duration-200">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50/80 rounded-lg transition-all duration-200">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">Background, problem statement, research questions</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">2. Literature Review</h3>
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50/80 rounded-lg transition-all duration-200">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50/80 rounded-lg transition-all duration-200">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">Existing research, theoretical framework</p>
        </div>
        
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">3. Methodology</h3>
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50/80 rounded-lg transition-all duration-200">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50/80 rounded-lg transition-all duration-200">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">Research design, data collection, analysis methods</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'Literature':
        return (
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Literature Review</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Paper
                </button>
        </div>
        
              <div className="grid gap-6">
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Smith et al. (2023) - "Advances in Research Methodology"</h3>
                      <p className="text-gray-600 mb-3">This study presents innovative approaches to qualitative research design, particularly focusing on ethnographic methods in digital environments.</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Journal of Research Methods</span>
                        <span>•</span>
                        <span>Citations: 45</span>
                        <span>•</span>
                        <span>Impact Factor: 3.2</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50/80 rounded-lg transition-all duration-200">
                        <Bookmark className="w-4 h-4" />
          </button>
                      <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50/80 rounded-lg transition-all duration-200">
                        <Pencil className="w-4 h-4" />
          </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Johnson & Lee (2022) - "Digital Transformation in Academia"</h3>
                      <p className="text-gray-600 mb-3">A comprehensive analysis of how digital technologies are reshaping academic research practices and collaboration patterns.</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Digital Research Quarterly</span>
                        <span>•</span>
                        <span>Citations: 32</span>
                        <span>•</span>
                        <span>Impact Factor: 2.8</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50/80 rounded-lg transition-all duration-200">
                        <Bookmark className="w-4 h-4" />
          </button>
                      <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50/80 rounded-lg transition-all duration-200">
                        <Pencil className="w-4 h-4" />
          </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'Timeline':
        return (
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Research Timeline</h2>
                <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Milestone
          </button>
              </div>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-8">
                  <div className="relative flex items-start">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/25 z-10">
                      1
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">Research Proposal Submission</h3>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Completed</span>
                        </div>
                        <p className="text-gray-600 mb-3">Submit initial research proposal to committee for approval</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Due: March 15, 2024
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/25 z-10">
                      2
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">Literature Review Completion</h3>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">In Progress</span>
                        </div>
                        <p className="text-gray-600 mb-3">Complete comprehensive review of existing research</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Due: May 30, 2024
                          </span>
                          <span className="flex items-center gap-1">
                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                            In Progress
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                      3
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">Data Collection</h3>
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">Pending</span>
                        </div>
                        <p className="text-gray-600 mb-3">Begin primary data collection and analysis</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Due: July 15, 2024
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            Pending
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'Analysis':
        return (
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Research Analysis</h2>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Run Analysis
          </button>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Content Analysis</h3>
                  </div>
                  <p className="text-gray-600 mb-4">AI-powered analysis of your research content for clarity, coherence, and academic standards.</p>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300">
                    Analyze Content
          </button>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Research Gaps</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Identify potential research gaps and opportunities in your field of study.</p>
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all duration-300">
                    Find Gaps
          </button>
        </div>
        
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Citation Analysis</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Review and optimize your citation patterns and reference management.</p>
                  <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-all duration-300">
                    Analyze Citations
        </button>
      </div>

                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Writing Insights</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Get AI-powered suggestions for improving your writing style and structure.</p>
                  <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-all duration-300">
                    Get Insights
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex-1 p-8">
            <textarea
              value={researchContent}
              onChange={(e) => setResearchContent(e.target.value)}
              placeholder="Begin your research paper with clarity and purpose. Let your ideas flow naturally..."
              className="w-full h-full p-6 border border-gray-200/50 rounded-xl bg-white/80 backdrop-blur-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent text-base leading-relaxed placeholder-gray-400 transition-all duration-200"
            />
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#fafafa] overflow-hidden" onClick={() => setShowContextMenu(false)}>
      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Panel - Notes with Apple Precision */}
        <div className={`${viewMode === 'Side' ? 'w-80' : 'w-0'} bg-white/90 backdrop-blur-xl border-r border-gray-100/50 flex flex-col transition-all duration-500 ease-out overflow-hidden`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-100/50">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Research Notes</h2>
              <span className="px-2.5 py-1 bg-green-100/80 text-green-700 text-xs font-medium rounded-full backdrop-blur-sm">Auto-save</span>
            </div>
            <button 
              onClick={() => setViewMode('Hide')}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50/80 rounded-lg transition-all duration-200"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          
          {/* Toolbar - Floating design with perfect spacing */}
          <div className="flex items-center gap-2 p-4 border-b border-gray-100/50 bg-white/50 backdrop-blur-sm">
            <select className="text-sm border-0 bg-transparent focus:outline-none text-gray-700 font-medium pr-6 cursor-pointer">
              <option>Normal</option>
              <option>Heading 1</option>
              <option>Heading 2</option>
            </select>
            <div className="h-3 w-px bg-gray-200/50 mx-2"></div>
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-50/80 rounded-lg transition-all duration-200 group">
              <Bold className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-800" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-50/80 rounded-lg transition-all duration-200 group">
              <Italic className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-800" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-50/80 rounded-lg transition-all duration-200 group">
              <Underline className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-800" />
            </button>
            <div className="h-3 w-px bg-gray-200/50 mx-2"></div>
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-50/80 rounded-lg transition-all duration-200 group">
              <List className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-800" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-50/80 rounded-lg transition-all duration-200 group">
              <ListOrdered className="w-3.5 h-3.5 text-gray-800" />
            </button>
            <div className="h-3 w-px bg-gray-200/50 mx-2"></div>
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-50/80 rounded-lg transition-all duration-200 group">
              <Link className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-800" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-50/80 rounded-lg transition-all duration-200 group">
              <Quote className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-800" />
            </button>
          </div>
          
          {/* Notes Content - Clean, focused writing area */}
          <div className="flex-1 p-6">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Capture your research insights, ideas, and observations..."
              className="w-full h-full p-4 border border-gray-200/50 rounded-xl bg-white/80 backdrop-blur-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-sm leading-relaxed placeholder-gray-400 transition-all duration-200"
            />
          </div>
        </div>

        {/* Main Research Writing Panel - Apple Design Excellence */}
        <div className="flex-1 bg-white/90 backdrop-blur-xl flex flex-col">
          {/* Header - Elegant, spacious design */}
          <div className="p-8 border-b border-gray-100/50 bg-white/80 backdrop-blur-sm">
            <div className="flex items-start justify-between">
              {/* Left side - Icon and title with perfect typography */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                  <Pencil className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-tight">Research Writing</h1>
                  <p className="text-gray-500 mt-2 text-base font-medium">AI-powered academic writing assistant</p>
                </div>
              </div>
              
              {/* Right side - Controls with elegant spacing */}
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-600 mb-2 font-medium">Notes View:</span>
                  <div className="flex items-center gap-2">
                    <button 
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${viewMode === 'Popup' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80'}`}
                      onClick={() => setViewMode('Popup')}
                    >
                      Popup
                    </button>
                    <button 
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${viewMode === 'Side' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80'}`}
                      onClick={() => setViewMode('Side')}
                    >
                      Side
                    </button>
                    <button 
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${viewMode === 'Show' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80'}`}
                      onClick={() => setViewMode('Show')}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-sm"></div>
                  <span className="text-sm text-gray-600 font-medium">1 words</span>
                  <button 
                  onClick={() => setShowFormatModal(true)}
                  className="group relative px-6 py-3 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-gray-200/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm shadow-green-500/20 group-hover:shadow-md group-hover:shadow-green-500/30 transition-all duration-300">
                      <Type className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-900">{selectedFormat}</div>
                      <div className="text-xs text-gray-500">Format</div>
                    </div>
                    <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
                      <ChevronDown className="w-3 h-3 text-gray-600" />
                    </div>
                  </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Top Bar - Floating design with perfect proportions */}
          <div className="px-8 py-6 border-b border-gray-100/50 bg-white/60 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              {/* Left Section - Statistics with elegant typography */}
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">1</div>
                  <div className="text-sm text-gray-600 font-medium">Words</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">5</div>
                  <div className="text-sm text-gray-600 font-medium">Characters</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">1</div>
                  <div className="text-sm text-gray-600 font-medium">Sentences</div>
                </div>
              </div>
              
              {/* Middle Section - Action buttons with premium feel */}
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30">
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30">
                  <BarChart3 className="w-4 h-4" />
                  Analyze
                </button>
                <button 
                  onClick={() => setShowFormatModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30"
                >
                  <Type className="w-4 h-4" />
                  Format
                </button>

              </div>
              
              {/* Right Section - Navigation tabs with floating design */}
              <div className="flex items-center bg-gray-100/80 backdrop-blur-sm rounded-xl p-1 shadow-sm">
                <button 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'Writing' ? 'bg-white text-blue-600 shadow-sm border border-blue-200/50' : 'text-gray-700 hover:bg-white/50'}`}
                  onClick={() => setActiveTab('Writing')}
                >
                  <Pencil className="w-4 h-4" />
                  Writing
                </button>
                <button 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'Outline' ? 'bg-white text-blue-600 shadow-sm border border-blue-200/50' : 'text-gray-700 hover:bg-white/50'}`}
                  onClick={() => setActiveTab('Outline')}
                >
                  <FileText className="w-4 h-4" />
                  Outline
                </button>
                <button 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'Literature' ? 'bg-white text-blue-600 shadow-sm border border-blue-200/50' : 'text-gray-700 hover:bg-white/50'}`}
                  onClick={() => setActiveTab('Literature')}
                >
                  <BookOpen className="w-4 h-4" />
                  Literature
                </button>
                <button 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'Timeline' ? 'bg-white text-blue-600 shadow-sm border border-blue-200/50' : 'text-gray-700 hover:bg-white/50'}`}
                  onClick={() => setActiveTab('Timeline')}
                >
                  <Clock className="w-4 h-4" />
                  Timeline
                </button>
                <button 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'Analysis' ? 'bg-white text-blue-600 shadow-sm border border-blue-200/50' : 'text-gray-700 hover:bg-white/50'}`}
                  onClick={() => setActiveTab('Analysis')}
                >
                  <BarChart3 className="w-4 h-4" />
                  Analysis
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Tab Content */}
          {renderTabContent()}
        </div>

        {/* Right AI Sidebar - Apple Design Excellence */}
        <div className="w-80 bg-white/95 backdrop-blur-xl border-l border-gray-100/50 flex flex-col shadow-lg shadow-gray-900/5">
          {/* Header - Elegant and purposeful */}
          <div className="p-6 border-b border-gray-100/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 tracking-tight">AI Assistant</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                </div>
              </div>
              <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-xl transition-all duration-200">
                <Settings className="w-4 h-4" />
              </button>
            </div>
            
            {/* AI Status */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100/50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-purple-700">Ready to assist with your research</span>
              </div>
            </div>
          </div>
          
          {/* AI Tools - Refined and purposeful */}
          <div className="flex-1 p-6 space-y-4">
            <button className="group w-full p-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl hover:from-purple-700 hover:to-pink-600 transition-all duration-300 text-left shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="font-semibold">Analyze & Improve</span>
              </div>
              <p className="text-sm text-purple-100 leading-relaxed">AI-powered analysis of your research content for clarity and academic standards</p>
            </button>
            
            <button className="group w-full p-4 bg-white border border-gray-200/50 rounded-2xl hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-300 text-left shadow-sm hover:shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-900">Research Gaps</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">Identify potential research opportunities and unexplored areas</p>
            </button>
            
            <button className="group w-full p-4 bg-white border border-gray-200/50 rounded-2xl hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-300 text-left shadow-sm hover:shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                  <Lightbulb className="w-4 h-4 text-green-600" />
                </div>
                <span className="font-semibold text-gray-900">Generate Ideas</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">Explore new research directions and creative approaches</p>
            </button>
            
            <button className="group w-full p-4 bg-white border border-gray-200/50 rounded-2xl hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-300 text-left shadow-sm hover:shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                </div>
                <span className="font-semibold text-gray-900">Citation Help</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">Optimize citations and reference management</p>
            </button>
          </div>
          
          {/* AI Input - Floating design with perfect proportions */}
          <div className="p-6 border-t border-gray-100/50 bg-gray-50/30">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-3 h-3 text-white" />
                </div>
              </div>
              <input
                type="text"
                placeholder="Ask for multiple approaches or insights..."
                className="w-full pl-12 pr-16 py-4 border border-gray-200/50 rounded-2xl bg-white/80 backdrop-blur-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-transparent text-sm shadow-sm placeholder-gray-400 transition-all duration-200"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all duration-300 flex items-center justify-center shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30">
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            {/* Quick Prompts */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="px-3 py-1.5 text-xs text-gray-600 bg-white/80 border border-gray-200/50 rounded-lg hover:bg-white hover:border-gray-300 transition-all duration-200">
                Improve clarity
              </button>
              <button className="px-3 py-1.5 text-xs text-gray-600 bg-white/80 border border-gray-200/50 rounded-lg hover:bg-white hover:border-gray-300 transition-all duration-200">
                Expand ideas
              </button>
              <button className="px-3 py-1.5 text-xs text-gray-600 bg-white/80 border border-gray-200/50 rounded-lg hover:bg-white hover:border-gray-300 transition-all duration-200">
                Check logic
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notes Button for Popup Mode */}
      {viewMode === 'Popup' && (
        <button 
          onClick={() => setViewMode('Side')}
          className="fixed bottom-6 left-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-500/30 hover:shadow-3xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center group"
        >
          <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        </button>
      )}

      {/* Floating Notes Button for Hide Mode */}
      {viewMode === 'Hide' && (
        <button 
          onClick={() => setViewMode('Side')}
          className="fixed bottom-6 left-6 w-12 h-12 bg-gray-600 text-white rounded-full shadow-2xl shadow-gray-500/30 hover:shadow-3xl hover:shadow-gray-500/40 transition-all duration-300 flex items-center justify-center group"
        >
          <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        </button>
      )}

            {/* Research Notes Modal - Apple Design Excellence */}
      {showNotesModal && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xl flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl shadow-2xl shadow-black/10 border border-white/20 w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/50 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Research Notes</h1>
                    <p className="text-gray-600 mt-1">Capture ideas, insights, and research progress</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 border border-green-200 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">Auto-save ON</span>
                  </div>
                  <button 
                    onClick={() => setShowNotesModal(false)}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-xl transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Comprehensive Formatting Toolbar */}
            <div className="bg-white border-b border-gray-200/50 px-8 py-4">
              <div className="flex items-center gap-4">
                {/* Font/Style Selector */}
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 pr-10">
                  <option>Normal</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                  <option>Heading 3</option>
                  <option>Quote</option>
                  <option>Code</option>
                </select>

                <div className="w-px h-6 bg-gray-300"></div>

                {/* Basic Formatting */}
                <div className="flex items-center gap-1">
                  <button className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                    <Bold className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                    <Italic className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                    <Underline className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                    <Strikethrough className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-px h-6 bg-gray-300"></div>

                {/* Alignment */}
                <div className="flex items-center gap-1">
                  <button className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                    <AlignRight className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                    <AlignJustify className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-px h-6 bg-gray-300"></div>

                {/* Colors and Highlighting */}
                <div className="flex items-center gap-1">
                  <button className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                    <Type className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                    <Highlighter className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-px h-6 bg-gray-300"></div>

                {/* Lists */}
                <div className="flex items-center gap-1">
                  <button className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                    <List className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                    <ListOrdered className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-px h-6 bg-gray-300"></div>

                {/* Advanced Formatting */}
                <div className="flex items-center gap-1">
                  <button className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                    <Link className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                    <Quote className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                    <Code className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-px h-6 bg-gray-300"></div>

                {/* Clear Formatting */}
                <button className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                  <Type className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Text Editor */}
            <div className="flex-1 px-8 py-6">
              <textarea
                value={notesContent}
                onChange={handleNotesChange}
                placeholder="Start writing your research notes... Capture ideas, insights, and track your research progress..."
                className="w-full h-full border-0 outline-none resize-none text-gray-900 text-base leading-relaxed placeholder-gray-400 bg-transparent"
              />
            </div>

            {/* Footer */}
            <div className="bg-gray-50/80 backdrop-blur-sm border-t border-gray-200/50 px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span>Words: {wordCount}</span>
                  <span>Characters: {charCount}</span>
                  <span>Last saved: {lastSaved}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all duration-300 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Auto-save ON
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300 flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Format Modal - Apple Design */}
      {showFormatModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 max-w-4xl w-full max-h-[85vh] overflow-hidden border border-white/20">
            {/* Modal Header - Elegant and minimal */}
            <div className="flex items-center justify-between p-8 border-b border-gray-100/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                  <Type className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Writing Format</h2>
                  <p className="text-gray-500 mt-1">Choose your writing style and tone</p>
                </div>
              </div>
              <button 
                onClick={() => setShowFormatModal(false)}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-2xl transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Spacious and elegant */}
            <div className="p-8 space-y-8">
              {/* Quick Presets - Refined grid layout */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Presets</h3>
                <div className="grid grid-cols-3 gap-4">
                  {formatOptions.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => handleFormatChange(format.id)}
                      className={`group p-5 text-left rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                        selectedFormat === format.id
                          ? 'border-green-500 bg-green-50/80 text-green-700 shadow-lg shadow-green-500/20'
                          : 'border-gray-200/50 hover:border-gray-300 hover:bg-gray-50/50 hover:shadow-md'
                      }`}
                    >
                      <div className="font-semibold text-base mb-1">{format.name}</div>
                      <div className="text-sm text-gray-500 leading-relaxed">{format.description}</div>
                      {selectedFormat === format.id && (
                        <div className="mt-3 flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Active</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Format - Enhanced input */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Custom Format</h3>
                <div className="relative">
                  <textarea
                    value={customFormat}
                    onChange={(e) => setCustomFormat(e.target.value)}
                    placeholder="Describe your desired writing format (e.g., 'Write in APA style with academic tone, use active voice, include citations, maintain formal language...')"
                    className="w-full h-28 p-5 border border-gray-200/50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent text-sm leading-relaxed placeholder-gray-400 transition-all duration-200"
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                    {customFormat.length}/500
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Refined actions */}
            <div className="flex items-center justify-between p-8 border-t border-gray-100/50 bg-gray-50/30">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Current: <span className="font-semibold text-gray-900">{selectedFormat}</span>
                </span>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowFormatModal(false)}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={applyCustomFormat}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30"
                >
                  Apply Format
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu - Apple Design */}
      {showContextMenu && (
        <div 
          className="fixed z-50 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-white/20 py-3 min-w-56"
          style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* AI Writing Assistant */}
          <button 
            onClick={() => setShowContextMenu(false)}
            className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 flex items-center gap-3 group transition-all duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-blue-500/20 group-hover:shadow-md group-hover:shadow-blue-500/30 transition-all duration-200">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">AI Writing Assistant</div>
              <div className="text-xs text-gray-500">Get writing help and suggestions</div>
            </div>
          </button>

          {/* Improve Text */}
          <button 
            onClick={() => setShowContextMenu(false)}
            className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 flex items-center gap-3 group transition-all duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-sm shadow-purple-500/20 group-hover:shadow-md group-hover:shadow-purple-500/30 transition-all duration-200">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Improve Text</div>
              <div className="text-xs text-gray-500">Enhance clarity and flow</div>
            </div>
          </button>

          {/* Rewrite Selection */}
          <button 
            onClick={() => setShowContextMenu(false)}
            className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 flex items-center gap-3 group transition-all duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm shadow-green-500/20 group-hover:shadow-md group-hover:shadow-green-500/30 transition-all duration-200">
              <Edit3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Rewrite Selection</div>
              <div className="text-xs text-gray-500">Alternative phrasing options</div>
            </div>
          </button>

          {/* Research Topic */}
          <button 
            onClick={() => setShowContextMenu(false)}
            className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 flex items-center gap-3 group transition-all duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm shadow-orange-500/20 group-hover:shadow-md group-hover:shadow-orange-500/30 transition-all duration-200">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Research Topic</div>
              <div className="text-xs text-gray-500">Explore and expand ideas</div>
            </div>
          </button>

          {/* Divider */}
          <div className="h-px bg-gray-200/50 mx-4 my-2"></div>

          {/* Quick Actions */}
          <div className="px-5 py-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Quick Actions</div>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 text-xs text-gray-600 bg-gray-100/50 rounded-lg hover:bg-gray-200/50 transition-colors duration-200">
                Cite Sources
              </button>
              <button className="flex-1 px-3 py-2 text-xs text-gray-600 bg-gray-100/50 rounded-lg hover:bg-gray-200/50 transition-colors duration-200">
                Check Grammar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchMode; 