import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, Target, Zap, Lightbulb, TrendingUp, Calendar, Bookmark, Share2,
  Milestone, Paperclip, CheckCircle, AlertCircle, Edit3, Brain, Sparkles as SparklesIcon,
  Settings, Send, X, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, Highlighter, Link, Quote, Code, Type, List, ListOrdered,
  Save, BookOpen, BarChart3, Clock, Plus, Pencil, ChevronDown, FileText, Download, File, Search,
  Table, Image, AlignJustify as Justify, Indent, Outdent, Superscript, Subscript,
  Palette, MoreHorizontal, Eye, EyeOff, Users, MessageSquare, History, Copy, Scissors,
  RotateCcw, RotateCw, ZoomIn, ZoomOut, Maximize2, Minimize2, Grid, Columns, Rows
} from 'lucide-react';

const ResearchMode = () => {
  console.log('ResearchMode component initialized');
  const [notes, setNotes] = useState('');
  const [researchContent, setResearchContent] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('Chicago');
  const [viewMode, setViewMode] = useState('Hide'); // Default to Hide mode - no sidebar
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
  const [aiSidebarWidth, setAiSidebarWidth] = useState(320);
  const [isResizingAi, setIsResizingAi] = useState(false);
  const [isAiSidebarCollapsed, setIsAiSidebarCollapsed] = useState(false);
  const [isAiSidebarMinimized, setIsAiSidebarMinimized] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [currentAiMessage, setCurrentAiMessage] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [outlineSections, setOutlineSections] = useState([
    {
      id: 1,
      title: 'Introduction',
      description: 'Background, problem statement, research questions',
      order: 1
    },
    {
      id: 2,
      title: 'Literature Review',
      description: 'Existing research, theoretical framework',
      order: 2
    },
    {
      id: 3,
      title: 'Methodology',
      description: 'Research design, data collection, analysis methods',
      order: 3
    }
  ]);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionDescription, setNewSectionDescription] = useState('');
  const [papers, setPapers] = useState([
    {
      id: 1,
      title: 'Smith et al. (2023) - "Advances in Research Methodology"',
      description: 'This study presents innovative approaches to qualitative research design, particularly focusing on ethnographic methods in digital environments.',
      journal: 'Journal of Research Methods',
      citations: 45,
      impactFactor: 3.2,
      authors: 'Smith, J., Johnson, A., & Brown, M.',
      year: 2023
    },
    {
      id: 2,
      title: 'Johnson & Lee (2022) - "Digital Transformation in Academia"',
      description: 'A comprehensive analysis of how digital technologies are reshaping academic research practices and collaboration patterns.',
      journal: 'Digital Research Quarterly',
      citations: 32,
      impactFactor: 2.8,
      authors: 'Johnson, R. & Lee, S.',
      year: 2022
    }
  ]);
  const [showAddPaperModal, setShowAddPaperModal] = useState(false);
  const [newPaper, setNewPaper] = useState({
    title: '',
    authors: '',
    year: '',
    journal: '',
    description: '',
    citations: '',
    impactFactor: ''
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showScholarSearch, setShowScholarSearch] = useState(false);
  const [scholarQuery, setScholarQuery] = useState('');
  const [scholarResults, setScholarResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Rich text editor states
  const editorRef = useRef(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [currentFormat, setCurrentFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    fontSize: '16px',
    fontFamily: 'Inter, sans-serif',
    textAlign: 'left',
    textColor: '#000000',
    backgroundColor: 'transparent'
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerType, setColorPickerType] = useState('text');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [documentHistory, setDocumentHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showOutline, setShowOutline] = useState(true);
  const [documentOutline, setDocumentOutline] = useState([]);
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Advanced academic features
  const [showCitationManager, setShowCitationManager] = useState(false);
  const [showFootnotes, setShowFootnotes] = useState(false);
  const [showTrackChanges, setShowTrackChanges] = useState(false);
  const [showSpellCheck, setShowSpellCheck] = useState(true);
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [showWordStats, setShowWordStats] = useState(false);
  const [citations, setCitations] = useState([]);
  const [footnotes, setFootnotes] = useState([]);
  const [trackChanges, setTrackChanges] = useState([]);
  const [spellErrors, setSpellErrors] = useState([]);
  const [writingStats, setWritingStats] = useState({
    words: 0,
    characters: 0,
    paragraphs: 0,
    readingTime: 0,
    gradeLevel: 0
  });

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

  const handleAiResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizingAi(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleAiResizeMove = (e) => {
    if (!isResizingAi) return;
    
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 280 && newWidth <= 600) {
      setAiSidebarWidth(newWidth);
    }
  };

  const handleAiResizeEnd = () => {
    setIsResizingAi(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    if (isResizingAi) {
      const handleMouseMove = (e) => {
        // Resize from left side - calculate width from left edge
        const newWidth = e.clientX;
        if (newWidth >= 280 && newWidth <= 600) {
          setAiSidebarWidth(newWidth);
        }
      };

      const handleMouseUp = () => {
        setIsResizingAi(false);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizingAi]);

  // Rich text editor functions
  const execCommand = (command, value = null) => {
    try {
      if (document.execCommand) {
        document.execCommand(command, false, value);
        updateFormatState();
      } else {
        console.warn('execCommand not supported');
      }
    } catch (error) {
      console.error('Error executing command:', command, error);
    }
  };

  const updateFormatState = () => {
    try {
      if (editorRef.current) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const container = range.commonAncestorContainer;
          const element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
          
          setCurrentFormat(prev => ({
            ...prev,
            bold: document.queryCommandState ? document.queryCommandState('bold') : false,
            italic: document.queryCommandState ? document.queryCommandState('italic') : false,
            underline: document.queryCommandState ? document.queryCommandState('underline') : false,
            strikethrough: document.queryCommandState ? document.queryCommandState('strikeThrough') : false,
            textAlign: element && element.style ? element.style.textAlign || 'left' : 'left'
          }));
        }
      }
    } catch (error) {
      console.error('Error updating format state:', error);
    }
  };

  const handleEditorInput = (e) => {
    try {
      if (e && e.target) {
        setResearchContent(e.target.innerHTML || '');
        updateFormatState();
      }
    } catch (error) {
      console.error('Error handling editor input:', error);
    }
  };

  const handleEditorFocus = () => {
    setIsEditorFocused(true);
  };

  const handleEditorBlur = () => {
    setIsEditorFocused(false);
  };


  const insertTable = (rows, cols) => {
    try {
      if (rows && cols && rows > 0 && cols > 0) {
        let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">';
        for (let i = 0; i < rows; i++) {
          tableHTML += '<tr>';
          for (let j = 0; j < cols; j++) {
            tableHTML += `<td style="border: 1px solid #ddd; padding: 8px; min-width: 100px;">&nbsp;</td>`;
          }
          tableHTML += '</tr>';
        }
        tableHTML += '</table>';
        
        execCommand('insertHTML', tableHTML);
        setShowTableMenu(false);
      }
    } catch (error) {
      console.error('Error inserting table:', error);
    }
  };

  const insertImage = (file) => {
    try {
      if (file && file.type && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            const imgHTML = `<img src="${e.target.result}" style="max-width: 100%; height: auto; margin: 10px 0;" alt="Inserted image" />`;
            execCommand('insertHTML', imgHTML);
          }
        };
        reader.onerror = (error) => {
          console.error('Error reading file:', error);
        };
        reader.readAsDataURL(file);
        setShowImageUpload(false);
      } else {
        console.warn('Invalid file type for image insertion');
      }
    } catch (error) {
      console.error('Error inserting image:', error);
    }
  };

  const addComment = (text, position) => {
    const newComment = {
      id: Date.now(),
      text,
      position,
      author: 'You',
      timestamp: new Date().toLocaleTimeString(),
      resolved: false
    };
    setComments(prev => [...prev, newComment]);
  };

  // Advanced academic functions
  const calculateWritingStats = () => {
    try {
      const text = researchContent.replace(/<[^>]*>/g, '');
      const words = text.split(/\s+/).filter(word => word.length > 0).length;
      const characters = text.length;
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
      const readingTime = Math.ceil(words / 200); // Average reading speed
      const gradeLevel = Math.max(1, Math.min(20, Math.ceil(words / 100) + 5)); // Simple grade level calculation
      
      setWritingStats({
        words,
        characters,
        paragraphs,
        readingTime,
        gradeLevel
      });
    } catch (error) {
      console.error('Error calculating writing stats:', error);
    }
  };

  const insertCitation = (citation) => {
    try {
      const citationHTML = `<span class="citation" data-id="${citation.id}" style="background-color: #e3f2fd; padding: 2px 4px; border-radius: 3px; font-size: 0.9em;">[${citation.id}]</span>`;
      execCommand('insertHTML', citationHTML);
      setCitations(prev => [...prev, citation]);
    } catch (error) {
      console.error('Error inserting citation:', error);
    }
  };

  const insertFootnote = (text) => {
    try {
      const footnoteId = footnotes.length + 1;
      const footnoteHTML = `<sup class="footnote" data-id="${footnoteId}" style="color: #1976d2; cursor: pointer;">${footnoteId}</sup>`;
      execCommand('insertHTML', footnoteHTML);
      setFootnotes(prev => [...prev, { id: footnoteId, text, timestamp: new Date().toISOString() }]);
    } catch (error) {
      console.error('Error inserting footnote:', error);
    }
  };

  const toggleTrackChanges = () => {
    setShowTrackChanges(!showTrackChanges);
    if (!showTrackChanges) {
      // Enable track changes mode
      document.addEventListener('input', handleTrackChanges);
    } else {
      // Disable track changes mode
      document.removeEventListener('input', handleTrackChanges);
    }
  };

  const handleTrackChanges = (e) => {
    if (showTrackChanges && e.target === editorRef.current) {
      const change = {
        id: Date.now(),
        type: 'insertion',
        content: e.data,
        timestamp: new Date().toISOString(),
        author: 'You'
      };
      setTrackChanges(prev => [...prev, change]);
    }
  };

  const checkSpelling = () => {
    // Simple spell check implementation
    const text = researchContent.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/);
    const errors = [];
    
    // This is a simplified example - in production, you'd use a proper spell check library
    words.forEach((word, index) => {
      if (word.length > 3 && !word.match(/^[a-zA-Z]+$/) && !word.match(/^\d+$/)) {
        errors.push({
          word,
          position: index,
          suggestions: ['suggestion1', 'suggestion2']
        });
      }
    });
    
    setSpellErrors(errors);
  };

  const updateDocumentOutline = () => {
    try {
      if (editorRef.current) {
        const headings = editorRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const outline = Array.from(headings).map((heading, index) => ({
          id: index,
          level: parseInt(heading.tagName.charAt(1)) || 1,
          text: heading.textContent || '',
          element: heading
        }));
        setDocumentOutline(outline);
      }
    } catch (error) {
      console.error('Error updating document outline:', error);
    }
  };

  const scrollToHeading = (element) => {
    try {
      if (element && element.scrollIntoView) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      console.error('Error scrolling to heading:', error);
    }
  };

  const calculatePages = () => {
    try {
      if (editorRef.current) {
        const contentHeight = editorRef.current.scrollHeight || 0;
        const pageHeight = 800; // Approximate page height in pixels
        const pages = Math.ceil(contentHeight / pageHeight);
        setTotalPages(Math.max(1, pages));
      }
    } catch (error) {
      console.error('Error calculating pages:', error);
    }
  };

  useEffect(() => {
    calculatePages();
    updateDocumentOutline();
    calculateWritingStats();
    if (showSpellCheck) {
      checkSpelling();
    }
  }, [researchContent]);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current) {
      if (!researchContent) {
        editorRef.current.innerHTML = '<p>Begin your research paper with clarity and purpose. Let your ideas flow naturally...</p>';
      } else {
        editorRef.current.innerHTML = researchContent;
      }
    }
  }, [researchContent]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            execCommand('bold');
            break;
          case 'i':
            e.preventDefault();
            execCommand('italic');
            break;
          case 'u':
            e.preventDefault();
            execCommand('underline');
            break;
          case 's':
            e.preventDefault();
            // Auto-save is already handled
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              execCommand('redo');
            } else {
              execCommand('undo');
            }
            break;
          case 'y':
            e.preventDefault();
            execCommand('redo');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  // AI Chat functionality
  const handleAiMessageSend = () => {
    if (!currentAiMessage.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: currentAiMessage,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setAiChatHistory(prev => [...prev, newMessage]);
    setCurrentAiMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: `I understand you're asking about "${currentAiMessage}". Let me help you with that. This is a simulated response that would normally come from an AI service.`,
        timestamp: new Date().toLocaleTimeString()
      };
      setAiChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const toggleAiSidebar = () => {
    setIsAiSidebarCollapsed(!isAiSidebarCollapsed);
  };

  const minimizeAiSidebar = () => {
    setIsAiSidebarMinimized(!isAiSidebarMinimized);
  };

  // Export handlers
  const handleExport = (format) => {
    const content = researchContent || notes;
    const filename = `research-${new Date().toISOString().split('T')[0]}`;
    
    switch (format) {
      case 'pdf':
        const pdfContent = `Research Document\n\n${content}`;
        downloadFile(pdfContent, `${filename}.txt`, 'text/plain');
        break;
      case 'docx':
        downloadFile(content, `${filename}.txt`, 'text/plain');
        break;
      case 'txt':
        downloadFile(content, `${filename}.txt`, 'text/plain');
        break;
      case 'md':
        downloadFile(content, `${filename}.md`, 'text/markdown');
        break;
      default:
        break;
    }
    
    setShowExportModal(false);
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Outline section handlers
  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      const newSection = {
        id: Date.now(),
        title: newSectionTitle.trim(),
        description: newSectionDescription.trim() || 'Add description...',
        order: outlineSections.length + 1
      };
      setOutlineSections([...outlineSections, newSection]);
      setNewSectionTitle('');
      setNewSectionDescription('');
      setShowAddSectionModal(false);
    }
  };

  const handleDeleteSection = (id) => {
    setOutlineSections(outlineSections.filter(section => section.id !== id));
  };

  const handleEditSection = (id, newTitle, newDescription) => {
    setOutlineSections(outlineSections.map(section => 
      section.id === id 
        ? { ...section, title: newTitle, description: newDescription }
        : section
    ));
  };

  // Paper handlers
  const handleAddPaper = () => {
    if (newPaper.title.trim() && newPaper.authors.trim()) {
      const paper = {
        id: Date.now(),
        title: newPaper.title.trim(),
        authors: newPaper.authors.trim(),
        year: newPaper.year || new Date().getFullYear(),
        journal: newPaper.journal.trim() || 'Unknown Journal',
        description: newPaper.description.trim() || 'No description provided',
        citations: parseInt(newPaper.citations) || 0,
        impactFactor: parseFloat(newPaper.impactFactor) || 0,
        pdfFile: uploadedFile ? {
          name: uploadedFile.name,
          size: uploadedFile.size,
          type: uploadedFile.type,
          lastModified: uploadedFile.lastModified
        } : null
      };
      setPapers([...papers, paper]);
      setNewPaper({
        title: '',
        authors: '',
        year: '',
        journal: '',
        description: '',
        citations: '',
        impactFactor: ''
      });
      setUploadedFile(null);
      setShowAddPaperModal(false);
    }
  };

  const handleDeletePaper = (id) => {
    setPapers(papers.filter(paper => paper.id !== id));
  };

  const handleEditPaper = (id, updatedPaper) => {
    setPapers(papers.map(paper => 
      paper.id === id ? { ...paper, ...updatedPaper } : paper
    ));
  };

  const handlePaperInputChange = (field, value) => {
    setNewPaper(prev => ({ ...prev, [field]: value }));
  };

  // File handling functions
  const handleFileUpload = (file) => {
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      if (!newPaper.title) {
        setNewPaper(prev => ({ ...prev, title: file.name.replace('.pdf', '') }));
      }
    } else {
      alert('Please upload a PDF file only.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
  };

  // Google Scholar search functions
  const handleScholarSearch = async () => {
    if (!scholarQuery.trim()) return;
    
    setIsSearching(true);
    setScholarResults([]);
    
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: `${scholarQuery} - A Comprehensive Study`,
          authors: 'Smith, J., Johnson, A., & Brown, M.',
          year: 2023,
          journal: 'Journal of Academic Research',
          citations: Math.floor(Math.random() * 100) + 10,
          impactFactor: (Math.random() * 3 + 1).toFixed(1),
          description: `This study explores various aspects of ${scholarQuery.toLowerCase()} and provides insights into current research trends and methodologies.`,
          url: 'https://scholar.google.com/scholar?q=' + encodeURIComponent(scholarQuery)
        },
        {
          id: 2,
          title: `Recent Advances in ${scholarQuery}`,
          authors: 'Wilson, R. & Davis, S.',
          year: 2022,
          journal: 'Research Quarterly',
          citations: Math.floor(Math.random() * 80) + 5,
          impactFactor: (Math.random() * 2.5 + 0.5).toFixed(1),
          description: `A detailed analysis of recent developments in ${scholarQuery.toLowerCase()} with focus on practical applications and future directions.`,
          url: 'https://scholar.google.com/scholar?q=' + encodeURIComponent(scholarQuery)
        },
        {
          id: 3,
          title: `${scholarQuery}: Theoretical Framework and Applications`,
          authors: 'Garcia, M., Lee, K., & Thompson, P.',
          year: 2023,
          journal: 'Academic Studies Journal',
          citations: Math.floor(Math.random() * 60) + 8,
          impactFactor: (Math.random() * 2 + 1).toFixed(1),
          description: `This paper presents a comprehensive theoretical framework for understanding ${scholarQuery.toLowerCase()} and its various applications in modern research.`,
          url: 'https://scholar.google.com/scholar?q=' + encodeURIComponent(scholarQuery)
        }
      ];
      
      setScholarResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  const importPaperFromScholar = (result) => {
    const newPaper = {
      id: Date.now(),
      title: result.title,
      authors: result.authors,
      year: result.year.toString(),
      journal: result.journal,
      description: result.description,
      citations: result.citations.toString(),
      impactFactor: result.impactFactor.toString(),
      pdfFile: null,
      isBookmarked: false,
      addedDate: new Date().toISOString().split('T')[0]
    };
    
    setPapers(prev => [...prev, newPaper]);
    setScholarQuery('');
    setScholarResults([]);
  };

  const openScholarInNewTab = (url) => {
    window.open(url, '_blank');
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Writing':
        return (
          <div className="flex-1 flex flex-col">
                         {/* Comprehensive Google Docs-like Toolbar - Compact */}
             <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
              {/* Document Title */}
              <div className="flex items-center gap-3 mr-6">
                <input 
                  type="text" 
                  placeholder="Untitled Document" 
                  className="text-lg font-semibold bg-transparent border-0 focus:outline-none text-gray-900 placeholder-gray-400 min-w-[200px]"
                />
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>•</span>
                  <span>Last saved {lastSaved}</span>
                </div>
              </div>

              <div className="flex-1 flex items-center gap-1">
                {/* Format Dropdown */}
                <select 
                  className="text-sm border-0 bg-transparent focus:outline-none text-gray-700 font-medium pr-8 cursor-pointer hover:text-gray-900 transition-colors"
                  onChange={(e) => {
                    if (e.target.value === 'h1') execCommand('formatBlock', 'h1');
                    else if (e.target.value === 'h2') execCommand('formatBlock', 'h2');
                    else if (e.target.value === 'h3') execCommand('formatBlock', 'h3');
                    else if (e.target.value === 'p') execCommand('formatBlock', 'p');
                  }}
                >
                  <option value="p">Normal text</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                </select>

                <div className="h-6 w-px bg-gray-300 mx-2"></div>

                {/* Text Formatting */}
                <button 
                  onClick={() => execCommand('bold')}
                  className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 ${
                    currentFormat.bold ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                  }`}
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => execCommand('italic')}
                  className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 ${
                    currentFormat.italic ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                  }`}
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => execCommand('underline')}
                  className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 ${
                    currentFormat.underline ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                  }`}
                  title="Underline (Ctrl+U)"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => execCommand('strikeThrough')}
                  className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 ${
                    currentFormat.strikethrough ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                  }`}
                  title="Strikethrough"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>

                <div className="h-6 w-px bg-gray-300 mx-2"></div>

                {/* Text Color */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setColorPickerType('text');
                      setShowColorPicker(!showColorPicker);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 text-gray-600"
                    title="Text color"
                  >
                    <Type className="w-4 h-4" />
                </button>
                  {showColorPicker && colorPickerType === 'text' && (
                    <div className="absolute top-10 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20">
                      <div className="grid grid-cols-6 gap-1">
                        {['#000000', '#5f6368', '#ea4335', '#fbbc04', '#34a853', '#4285f4'].map(color => (
                          <button
                            key={color}
                            onClick={() => {
                              try {
                                execCommand('foreColor', color);
                                setShowColorPicker(false);
                              } catch (error) {
                                console.error('Error setting text color:', error);
                              }
                            }}
                            className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            title={`Set text color to ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Highlight Color */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setColorPickerType('highlight');
                      setShowColorPicker(!showColorPicker);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 text-gray-600"
                    title="Highlight color"
                  >
                    <Highlighter className="w-4 h-4" />
                </button>
                </div>

                <div className="h-6 w-px bg-gray-300 mx-2"></div>

                {/* Alignment */}
                <button 
                  onClick={() => execCommand('justifyLeft')}
                  className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 ${
                    currentFormat.textAlign === 'left' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                  }`}
                  title="Align left"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => execCommand('justifyCenter')}
                  className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 ${
                    currentFormat.textAlign === 'center' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                  }`}
                  title="Align center"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => execCommand('justifyRight')}
                  className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 ${
                    currentFormat.textAlign === 'right' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                  }`}
                  title="Align right"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => execCommand('justifyFull')}
                  className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 ${
                    currentFormat.textAlign === 'justify' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                  }`}
                  title="Justify"
                >
                  <Justify className="w-4 h-4" />
                </button>

                <div className="h-6 w-px bg-gray-300 mx-2"></div>

                {/* Lists */}
                <button 
                  onClick={() => execCommand('insertUnorderedList')}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 text-gray-600"
                  title="Bullet list"
                >
                  <List className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => execCommand('insertOrderedList')}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 text-gray-600"
                  title="Numbered list"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>

                <div className="h-6 w-px bg-gray-300 mx-2"></div>

                {/* Indentation */}
                <button 
                  onClick={() => execCommand('outdent')}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 text-gray-600"
                  title="Decrease indent"
                >
                  <Outdent className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => execCommand('indent')}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 text-gray-600"
                  title="Increase indent"
                >
                  <Indent className="w-4 h-4" />
                </button>

                <div className="h-6 w-px bg-gray-300 mx-2"></div>

                {/* Insert Elements */}
                <div className="relative">
                  <button 
                    onClick={() => setShowTableMenu(!showTableMenu)}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 text-gray-600"
                    title="Insert table"
                  >
                    <Table className="w-4 h-4" />
                </button>
                  {showTableMenu && (
                    <div className="absolute top-10 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20">
                      <div className="grid grid-cols-5 gap-1">
                        {Array.from({ length: 25 }, (_, i) => {
                          const row = Math.floor(i / 5) + 1;
                          const col = (i % 5) + 1;
                          return (
                            <button
                              key={i}
                              onClick={() => {
                                try {
                                  insertTable(row, col);
                                } catch (error) {
                                  console.error('Error inserting table:', error);
                                }
                              }}
                              className="w-6 h-6 border border-gray-300 hover:bg-blue-100 hover:border-blue-400 transition-colors"
                              title={`${row}×${col} table`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 text-gray-600"
                  title="Insert image"
                >
                  <Image className="w-4 h-4" />
                </button>

                <div className="h-6 w-px bg-gray-300 mx-2"></div>

                {/* Academic Tools */}
                <button 
                  onClick={() => setShowCitationManager(!showCitationManager)}
                  className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 ${
                    showCitationManager ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                  }`}
                  title="Citation Manager"
                >
                  <BookOpen className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => insertFootnote('')}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 text-gray-600"
                  title="Insert Footnote"
                >
                  <Superscript className="w-4 h-4" />
                </button>

                <button 
                  onClick={toggleTrackChanges}
                  className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 ${
                    showTrackChanges ? 'bg-green-100 text-green-700' : 'text-gray-600'
                  }`}
                  title="Track Changes"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => setShowSpellCheck(!showSpellCheck)}
                  className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 ${
                    showSpellCheck ? 'bg-yellow-100 text-yellow-700' : 'text-gray-600'
                  }`}
                  title="Spell Check"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => setShowFocusMode(!showFocusMode)}
                  className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 ${
                    showFocusMode ? 'bg-purple-100 text-purple-700' : 'text-gray-600'
                  }`}
                  title="Focus Mode"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {/* More Tools */}
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 text-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              
              {/* Right Side Tools */}
              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 text-gray-600"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600 min-w-[3rem] text-center">{zoomLevel}%</span>
                  <button 
                    onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 text-gray-600"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <div className="h-6 w-px bg-gray-300 mx-2"></div>

                {/* Collaboration & Comments */}
                <button 
                  onClick={() => setShowComments(!showComments)}
                  className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 ${
                    showComments ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                  }`}
                  title="Comments"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 ${
                    showHistory ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                  }`}
                  title="Version history"
                >
                  <History className="w-4 h-4" />
                </button>

                {/* Share */}
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-all duration-200 text-gray-600">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
              
              {/* Main Content Area with Sidebar */}
              <div className="flex-1 flex">
                                 {/* Document Outline Sidebar - Compact */}
                 {showOutline && (
                   <div className="w-56 border-r border-gray-200 bg-gray-50/50 p-3">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">Document Outline</h3>
                      <button 
                        onClick={() => setShowOutline(false)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      {documentOutline.length > 0 ? (
                        documentOutline.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => scrollToHeading(item.element)}
                            className={`w-full text-left px-2 py-1 rounded text-sm hover:bg-gray-100 transition-colors ${
                              item.level === 1 ? 'font-semibold text-gray-900' :
                              item.level === 2 ? 'text-gray-800 ml-2' :
                              'text-gray-600 ml-4'
                            }`}
                          >
                            {item.text}
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No headings found. Add headings to see them here.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Document Editor Area */}
                <div className="flex-1 flex flex-col">
                                     {/* Page-based Editor */}
                   <div className="flex-1 p-6 bg-gray-100/30" style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}>
                     <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                      {/* Page Header - Compact */}
                      <div className="h-12 border-b border-gray-200 flex items-center justify-between px-6">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronDown className="w-4 h-4 rotate-90" />
                            </button>
                            <button 
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              disabled={currentPage === totalPages}
                              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronDown className="w-4 h-4 -rotate-90" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setShowOutline(!showOutline)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"
                            title="Toggle outline"
                          >
                            <Grid className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Document Content - Expanded with Focus Mode */}
                      <div className={`min-h-[900px] p-6 transition-all duration-300 ${showFocusMode ? 'bg-gray-900' : ''}`}>
                        <div 
                          ref={editorRef}
                          contentEditable
                          onInput={handleEditorInput}
                          onFocus={handleEditorFocus}
                          onBlur={handleEditorBlur}
                  onContextMenu={handleContextMenu}
                          className={`editor-content w-full min-h-[800px] border-0 bg-transparent text-gray-900 resize-none focus:outline-none text-base leading-relaxed placeholder-gray-400 transition-all duration-200 prose prose-lg max-w-none focus:ring-0 ${
                            showFocusMode ? 'text-white' : ''
                          }`}
                          style={{
                            fontFamily: currentFormat.fontFamily,
                            fontSize: currentFormat.fontSize,
                            color: currentFormat.textColor,
                            backgroundColor: currentFormat.backgroundColor,
                            textAlign: currentFormat.textAlign,
                            lineHeight: '1.6'
                          }}
                          suppressContentEditableWarning={true}
                        />
                      </div>

                      {/* Advanced Status Bar - Academic Features */}
                      <div className="h-12 border-t border-gray-200 flex items-center justify-between px-6 text-sm text-gray-500 bg-gray-50/50">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">{writingStats.words}</span>
                            <span className="text-gray-500">words</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">{writingStats.characters}</span>
                            <span className="text-gray-500">characters</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">{writingStats.paragraphs}</span>
                            <span className="text-gray-500">paragraphs</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">{writingStats.readingTime}</span>
                            <span className="text-gray-500">min read</span>
                          </div>
                          {citations.length > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-blue-600">{citations.length}</span>
                              <span className="text-gray-500">citations</span>
                            </div>
                          )}
                          {footnotes.length > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-purple-600">{footnotes.length}</span>
                              <span className="text-gray-500">footnotes</span>
                            </div>
                          )}
                          {spellErrors.length > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-red-600">{spellErrors.length}</span>
                              <span className="text-gray-500">errors</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Grade level:</span>
                            <span className="font-medium text-gray-700">{writingStats.gradeLevel}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Last saved:</span>
                            <span className="font-medium text-gray-700">{lastSaved}</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* Floating Action Button - Fixed positioning */}
               <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto">
                <div className="flex flex-col gap-2">
                  {/* Quick Format Menu */}
                  <div className="bg-white rounded-full shadow-xl border border-gray-200 p-1.5 flex flex-col gap-1">
                    <button 
                      onClick={() => execCommand('bold')}
                      className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
                        currentFormat.bold ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title="Bold (Ctrl+B)"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => execCommand('italic')}
                      className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
                        currentFormat.italic ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title="Italic (Ctrl+I)"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => execCommand('underline')}
                      className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
                        currentFormat.underline ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title="Underline (Ctrl+U)"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Main FAB */}
                  <button className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
              </div>
          </div>
        );
      
      case 'Outline':
  return (
          <div className="flex-1 p-8">
            <div className="w-full">
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
            <div className="w-full">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Literature Review</h2>
                <button 
                  onClick={() => setShowAddPaperModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Paper
                </button>
              </div>

              {/* Google Scholar Search Section */}
              <div className="mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Search className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Search Google Scholar</h3>
                      <p className="text-sm text-gray-600">Find and import academic papers directly</p>
                    </div>
                  </div>
                  
                  {/* Search Input */}
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={scholarQuery}
                      onChange={(e) => setScholarQuery(e.target.value)}
                      placeholder="Search for papers on Google Scholar..."
                      className="flex-1 px-4 py-3 border border-gray-200/50 rounded-xl bg-white/80 backdrop-blur-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent text-base placeholder-gray-400 transition-all duration-200"
                      onKeyPress={(e) => e.key === 'Enter' && handleScholarSearch()}
                    />
                    <button
                      onClick={handleScholarSearch}
                      disabled={!scholarQuery.trim() || isSearching}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSearching ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          Search
                        </>
                      )}
                    </button>
                  </div>

                  {/* Search Results */}
                  {scholarResults.length > 0 && (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      <h4 className="text-sm font-semibold text-gray-700">Search Results</h4>
                      {scholarResults.map((result) => (
                        <div key={result.id} className="bg-white/80 border border-gray-200/50 rounded-xl p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 mb-1">{result.title}</h5>
                              <p className="text-sm text-gray-600 mb-2">{result.authors} ({result.year})</p>
                              <p className="text-sm text-gray-500 mb-2">{result.journal}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Citations: {result.citations}</span>
                                <span>•</span>
                                <span>Impact Factor: {result.impactFactor}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => importPaperFromScholar(result)}
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-all duration-200"
                              >
                                Add to Library
                              </button>
                              <button
                                onClick={() => openScholarInNewTab(result.url)}
                                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition-all duration-200"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No Results */}
                  {scholarQuery && !isSearching && scholarResults.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500">No results found. Try a different search term.</p>
                    </div>
                  )}
                </div>
              </div>
        
              <div className="grid gap-6">
                {papers.map((paper) => (
                  <div key={paper.id} className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{paper.title}</h3>
                        <p className="text-gray-600 mb-3">{paper.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{paper.journal}</span>
                          <span>•</span>
                          <span>Citations: {paper.citations}</span>
                          <span>•</span>
                          <span>Impact Factor: {paper.impactFactor}</span>
                          <span>•</span>
                          <span>{paper.year}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          <span className="font-medium">Authors:</span> {paper.authors}
                        </div>
                        {paper.pdfFile && (
                          <div className="mt-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600 font-medium">PDF attached</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50/80 rounded-lg transition-all duration-200">
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            const newTitle = prompt('Edit paper title:', paper.title);
                            const newAuthors = prompt('Edit authors:', paper.authors);
                            const newDescription = prompt('Edit description:', paper.description);
                            if (newTitle !== null && newAuthors !== null && newDescription !== null) {
                              handleEditPaper(paper.id, {
                                title: newTitle,
                                authors: newAuthors,
                                description: newDescription
                              });
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50/80 rounded-lg transition-all duration-200"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${paper.title}"?`)) {
                              handleDeletePaper(paper.id);
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50/80 rounded-lg transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {papers.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No papers yet</h3>
                    <p className="text-gray-500 mb-4">Start building your literature review by adding research papers</p>
                    <button 
                      onClick={() => setShowAddPaperModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 mx-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Add First Paper
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'Timeline':
        return (
          <div className="flex-1 p-8">
            <div className="w-full">
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
            <div className="w-full">
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
                  <p className="text-gray-600 mb-4">Eden-powered analysis of your research content for clarity, coherence, and academic standards.</p>
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
                  <p className="text-gray-600 mb-4">Get Eden-powered suggestions for improving your writing style and structure.</p>
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
          <div className="flex-1">
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

  // Add CSS styles to document head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .editor-content h1 {
        font-size: 2rem;
        font-weight: 700;
        margin: 1.5rem 0 1rem 0;
        line-height: 1.2;
      }
      .editor-content h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 1.25rem 0 0.75rem 0;
        line-height: 1.3;
      }
      .editor-content h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 1rem 0 0.5rem 0;
        line-height: 1.4;
      }
      .editor-content p {
        margin: 0.75rem 0;
        line-height: 1.6;
      }
      .editor-content ul, .editor-content ol {
        margin: 0.75rem 0;
        padding-left: 1.5rem;
      }
      .editor-content li {
        margin: 0.25rem 0;
        line-height: 1.6;
      }
      .editor-content blockquote {
        border-left: 4px solid #e5e7eb;
        padding-left: 1rem;
        margin: 1rem 0;
        font-style: italic;
        color: #6b7280;
      }
      .editor-content table {
        border-collapse: collapse;
        width: 100%;
        margin: 1rem 0;
      }
      .editor-content td, .editor-content th {
        border: 1px solid #d1d5db;
        padding: 0.5rem;
        text-align: left;
      }
      .editor-content th {
        background-color: #f9fafb;
        font-weight: 600;
      }
      .editor-content img {
        max-width: 100%;
        height: auto;
        margin: 1rem 0;
        border-radius: 0.375rem;
      }
      .editor-content:focus {
        outline: none;
      }
      .editor-content:empty:before {
        content: attr(placeholder);
        color: #9ca3af;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="flex h-screen bg-[#fafafa] overflow-hidden" onClick={() => setShowContextMenu(false)}>
      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Panel - Notes with Apple Precision */}
        <div className={`${viewMode === 'Side' ? 'w-80' : 'w-0'} bg-white/90 backdrop-blur-xl border-r border-gray-100/50 flex flex-col transition-all duration-500 ease-out overflow-hidden flex-shrink-0`}>
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
        <div className="flex-1 bg-white/90 backdrop-blur-xl flex flex-col min-w-0">
                     {/* Header - Ultra compact design */}
           <div className="px-6 py-2 border-b border-gray-100/50 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              {/* Left side - Compact icon and title */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Pencil className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Research Writing</h1>
                  <p className="text-gray-500 text-sm">Eden-powered academic writing assistant</p>
                </div>
              </div>
              
                            {/* Right side - Compact controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Notes:</span>
                  <div className="flex items-center gap-1">
                    <button 
                        className={`px-2 py-1 rounded text-xs font-medium transition-all duration-300 ${viewMode === 'Side' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        onClick={() => setViewMode('Side')}
                    >
                        Side
                    </button>
                    <button 
                        className={`px-2 py-1 rounded text-xs font-medium transition-all duration-300 ${viewMode === 'Popup' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        onClick={() => setViewMode('Popup')}
                    >
                        Popup
                    </button>
                    <button 
                        className={`px-2 py-1 rounded text-xs font-medium transition-all duration-300 ${viewMode === 'Hide' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        onClick={() => setViewMode('Hide')}
                    >
                      Hide
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={toggleAiSidebar}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-2 ${
                      isAiSidebarCollapsed 
                        ? 'bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200/50 text-emerald-700 hover:from-emerald-100 hover:to-cyan-100' 
                        : 'bg-gradient-to-r from-emerald-600 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30'
                    }`}
                  >
                    <Brain className="w-3 h-3" />
                    {isAiSidebarCollapsed ? 'Show AI' : 'Hide AI'}
                  </button>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">1 words</span>
                  <button 
                  onClick={() => setShowFormatModal(true)}
                  className="group relative px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded flex items-center justify-center">
                      <Type className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{selectedFormat}</span>
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

                     {/* Top Bar - Ultra compact floating design */}
           <div className="px-6 py-3 border-b border-gray-100/50 bg-white/60 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              {/* Action buttons with premium feel */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowExportModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                >
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
                <button 
                  onClick={() => setShowNotesModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30"
                >
                  <BookOpen className="w-4 h-4" />
                  Notes
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

        {/* Right AI Sidebar - Enhanced Chat Interface */}
        <div 
          className={`bg-gradient-to-br from-slate-50 to-slate-100/80 backdrop-blur-xl border-l border-slate-200/60 flex flex-col shadow-xl shadow-slate-900/10 relative group flex-shrink-0 transition-all duration-300 ${
            isAiSidebarCollapsed ? 'w-0 overflow-hidden' : ''
          }`}
          style={{ width: isAiSidebarCollapsed ? '0px' : `${aiSidebarWidth}px` }}
        >
          {/* Resize Handle */}
          {!isAiSidebarCollapsed && (
            <div 
              className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-200 z-10 ${
                isResizingAi 
                  ? 'bg-slate-500 w-1.5' 
                  : 'hover:bg-slate-400/80 group-hover:bg-slate-500/80'
              }`}
              onMouseDown={handleAiResizeStart}
              style={{ cursor: 'col-resize' }}
            ></div>
          )}
          
          {/* Header - Enhanced with Controls */}
          <div className="p-6 border-b border-slate-200/50 bg-white/60 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20"></div>
                  <div className="relative z-10 w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-sm"></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Eden AI</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-emerald-600 font-medium">Intelligent Assistant</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={minimizeAiSidebar}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-xl transition-all duration-200"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-xl transition-all duration-200">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* AI Status - Enhanced */}
            <div className="bg-gradient-to-r from-emerald-50/80 to-cyan-50/80 rounded-xl p-3 border border-emerald-100/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700">Ready to enhance your research</span>
              </div>
            </div>
          </div>
          
          {/* AI Chat Interface */}
          <div className="flex-1 flex flex-col">
            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {aiChatHistory.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Start a conversation</h3>
                  <p className="text-sm text-slate-600 mb-4">Ask me anything about your research or writing</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button className="px-3 py-1.5 text-xs text-slate-600 bg-white/80 border border-slate-200/50 rounded-lg hover:bg-white hover:border-slate-300 transition-all duration-200">
                      Improve clarity
                    </button>
                    <button className="px-3 py-1.5 text-xs text-slate-600 bg-white/80 border border-slate-200/50 rounded-lg hover:bg-white hover:border-slate-300 transition-all duration-200">
                      Add citations
                    </button>
                    <button className="px-3 py-1.5 text-xs text-slate-600 bg-white/80 border border-slate-200/50 rounded-lg hover:bg-white hover:border-slate-300 transition-all duration-200">
                      Research ideas
                    </button>
                  </div>
                </div>
              ) : (
                aiChatHistory.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white' 
                        : 'bg-white/80 border border-slate-200/50 text-slate-900'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-emerald-100' : 'text-slate-500'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Quick Actions */}
            <div className="p-4 border-t border-slate-200/50 bg-white/40 backdrop-blur-sm">
              <div className="flex flex-wrap gap-2 mb-3">
                <button className="px-3 py-1.5 text-xs text-slate-600 bg-white/80 border border-slate-200/50 rounded-lg hover:bg-white hover:border-slate-300 transition-all duration-200">
                  <Zap className="w-3 h-3 inline mr-1" />
                  Analyze
                </button>
                <button className="px-3 py-1.5 text-xs text-slate-600 bg-white/80 border border-slate-200/50 rounded-lg hover:bg-white hover:border-slate-300 transition-all duration-200">
                  <Target className="w-3 h-3 inline mr-1" />
                  Research
                </button>
                <button className="px-3 py-1.5 text-xs text-slate-600 bg-white/80 border border-slate-200/50 rounded-lg hover:bg-white hover:border-slate-300 transition-all duration-200">
                  <Lightbulb className="w-3 h-3 inline mr-1" />
                  Ideas
                </button>
                <button className="px-3 py-1.5 text-xs text-slate-600 bg-white/80 border border-slate-200/50 rounded-lg hover:bg-white hover:border-slate-300 transition-all duration-200">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  Citations
                </button>
              </div>
            </div>
          </div>
          
          {/* AI Input - Enhanced Chat Input */}
          <div className="p-6 border-t border-slate-200/50 bg-white/40 backdrop-blur-sm">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-3 h-3 text-white" />
                </div>
              </div>
              <input
                type="text"
                value={currentAiMessage}
                onChange={(e) => setCurrentAiMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAiMessageSend()}
                placeholder="Ask Eden for research insights..."
                className="w-full pl-12 pr-16 py-4 border border-slate-200/50 rounded-2xl bg-white/80 backdrop-blur-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-transparent text-sm shadow-sm placeholder-slate-400 transition-all duration-200"
              />
              <button 
                onClick={handleAiMessageSend}
                disabled={!currentAiMessage.trim()}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-emerald-600 to-cyan-500 text-white rounded-xl hover:from-emerald-700 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            {/* Quick Prompts - Enhanced */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button 
                onClick={() => setCurrentAiMessage("Improve the clarity of my writing")}
                className="px-3 py-1.5 text-xs text-slate-600 bg-white/80 border border-slate-200/50 rounded-lg hover:bg-white hover:border-slate-300 transition-all duration-200"
              >
                Improve clarity
              </button>
              <button 
                onClick={() => setCurrentAiMessage("Help me expand on these ideas")}
                className="px-3 py-1.5 text-xs text-slate-600 bg-white/80 border border-slate-200/50 rounded-lg hover:bg-white hover:border-slate-300 transition-all duration-200"
              >
                Expand ideas
              </button>
              <button 
                onClick={() => setCurrentAiMessage("Check the logic and flow of my argument")}
                className="px-3 py-1.5 text-xs text-slate-600 bg-white/80 border border-slate-200/50 rounded-lg hover:bg-white hover:border-slate-300 transition-all duration-200"
              >
                Check logic
              </button>
            </div>
          </div>
        </div>
      </div>



      {/* Floating Notes Button for Popup Mode */}
      {viewMode === 'Popup' && (
        <button 
          onClick={() => setShowNotesModal(true)}
          className="fixed bottom-6 left-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-500/30 hover:shadow-3xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center group"
          title="Open Notes"
        >
          <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        </button>
      )}

      {/* Floating Notes Button for Quick Access (when sidebar is visible) */}
      {viewMode === 'Side' && (
        <button 
          onClick={() => setShowNotesModal(true)}
          className="fixed bottom-6 left-6 w-12 h-12 bg-orange-600 text-white rounded-full shadow-2xl shadow-orange-500/30 hover:shadow-3xl hover:shadow-orange-500/40 transition-all duration-300 flex items-center justify-center group z-40"
          title="Open Notes in Full Screen"
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Start writing your research notes... Capture ideas, insights, and track your research progress..."
                className="w-full h-full border-0 outline-none resize-none text-gray-900 text-base leading-relaxed placeholder-gray-400 bg-transparent"
              />
            </div>

            {/* Footer */}
            <div className="bg-gray-50/80 backdrop-blur-sm border-t border-gray-200/50 px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span>Last saved: {lastSaved}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all duration-300 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Auto-save ON
                  </button>
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
                  >
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

      {/* Floating Notes Button for Hide Mode */}
      {viewMode === 'Hide' && (
        <button 
          onClick={() => setViewMode('Side')}
          className="fixed bottom-6 left-6 w-12 h-12 bg-gray-600 text-white rounded-full shadow-2xl shadow-gray-500/30 hover:shadow-3xl hover:shadow-gray-500/40 transition-all duration-300 flex items-center justify-center group z-40"
          title="Show Notes Sidebar"
        >
          <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        </button>
      )}

      {/* Floating Notes Button for Full Screen Access */}
      <button 
        onClick={() => setShowNotesModal(true)}
        className={`fixed bottom-6 ${viewMode === 'Hide' ? 'left-20' : 'left-6'} w-12 h-12 bg-orange-600 text-white rounded-full shadow-2xl shadow-orange-500/25 hover:shadow-3xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center group z-40`}
        title="Open Notes in Full Screen"
      >
        <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
      </button>

      {/* Export Modal - Eden Design */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 max-w-2xl w-full max-h-[85vh] overflow-hidden border border-white/20">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-100/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Export Document</h2>
                  <p className="text-gray-500 mt-1">Choose your preferred format</p>
                </div>
              </div>
              <button 
                onClick={() => setShowExportModal(false)}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-2xl transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              {/* Export Options Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* PDF Export */}
                <button
                  onClick={() => handleExport('pdf')}
                  className="group p-6 text-left rounded-2xl border border-gray-200/50 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors duration-200">
                      <File className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">PDF Document</h3>
                      <p className="text-sm text-gray-500">Portable Document Format</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">Export as a professional PDF document with proper formatting</p>
                </button>

                {/* DOCX Export */}
                <button
                  onClick={() => handleExport('docx')}
                  className="group p-6 text-left rounded-2xl border border-gray-200/50 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">Word Document</h3>
                      <p className="text-sm text-gray-500">Microsoft Word Format</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">Export as a Word document for easy editing and collaboration</p>
                </button>

                {/* TXT Export */}
                <button
                  onClick={() => handleExport('txt')}
                  className="group p-6 text-left rounded-2xl border border-gray-200/50 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
                      <FileText className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">Plain Text</h3>
                      <p className="text-sm text-gray-500">Simple text file</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">Export as a plain text file for maximum compatibility</p>
                </button>

                {/* Markdown Export */}
                <button
                  onClick={() => handleExport('md')}
                  className="group p-6 text-left rounded-2xl border border-gray-200/50 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                      <Code className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">Markdown</h3>
                      <p className="text-sm text-gray-500">Markdown format</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">Export as Markdown for web publishing and documentation</p>
                </button>
              </div>

              {/* Document Info */}
              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Document Preview</span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {researchContent ? `${researchContent.length} characters` : 'No content to export'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-between p-8 border-t border-gray-100/50 bg-gray-50/30">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Format: <span className="font-semibold text-gray-900">{selectedFormat}</span>
                </span>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Paper Modal - Eden Design */}
      {showAddPaperModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-100/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Add Research Paper</h2>
                  <p className="text-gray-500 mt-1">Add a new paper to your literature review</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowAddPaperModal(false);
                  setNewPaper({
                    title: '',
                    authors: '',
                    year: '',
                    journal: '',
                    description: '',
                    citations: '',
                    impactFactor: ''
                  });
                  setUploadedFile(null);
                }}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-2xl transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Paper Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Paper Title *</label>
                  <input
                    type="text"
                    value={newPaper.title}
                    onChange={(e) => handlePaperInputChange('title', e.target.value)}
                    placeholder="e.g., Advances in Research Methodology"
                    className="w-full px-4 py-3 border border-gray-200/50 rounded-xl bg-white/80 backdrop-blur-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent text-base placeholder-gray-400 transition-all duration-200"
                    autoFocus
                  />
                </div>

                {/* Authors */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Authors *</label>
                  <input
                    type="text"
                    value={newPaper.authors}
                    onChange={(e) => handlePaperInputChange('authors', e.target.value)}
                    placeholder="e.g., Smith, J., Johnson, A., & Brown, M."
                    className="w-full px-4 py-3 border border-gray-200/50 rounded-xl bg-white/80 backdrop-blur-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent text-base placeholder-gray-400 transition-all duration-200"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Publication Year</label>
                  <input
                    type="number"
                    value={newPaper.year}
                    onChange={(e) => handlePaperInputChange('year', e.target.value)}
                    placeholder="2023"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-4 py-3 border border-gray-200/50 rounded-xl bg-white/80 backdrop-blur-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent text-base placeholder-gray-400 transition-all duration-200"
                  />
                </div>

                {/* Journal */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Journal/Publication</label>
                  <input
                    type="text"
                    value={newPaper.journal}
                    onChange={(e) => handlePaperInputChange('journal', e.target.value)}
                    placeholder="e.g., Journal of Research Methods"
                    className="w-full px-4 py-3 border border-gray-200/50 rounded-xl bg-white/80 backdrop-blur-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent text-base placeholder-gray-400 transition-all duration-200"
                  />
                </div>

                {/* Citations */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Citation Count</label>
                  <input
                    type="number"
                    value={newPaper.citations}
                    onChange={(e) => handlePaperInputChange('citations', e.target.value)}
                    placeholder="45"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-200/50 rounded-xl bg-white/80 backdrop-blur-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent text-base placeholder-gray-400 transition-all duration-200"
                  />
                </div>

                {/* Impact Factor */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Impact Factor</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPaper.impactFactor}
                    onChange={(e) => handlePaperInputChange('impactFactor', e.target.value)}
                    placeholder="3.2"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-200/50 rounded-xl bg-white/80 backdrop-blur-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent text-base placeholder-gray-400 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Description/Abstract</label>
                <textarea
                  value={newPaper.description}
                  onChange={(e) => handlePaperInputChange('description', e.target.value)}
                  placeholder="Brief description of the paper's content, methodology, and findings..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200/50 rounded-xl bg-white/80 backdrop-blur-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent text-base placeholder-gray-400 transition-all duration-200 resize-none"
                />
              </div>

              {/* PDF Upload Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">PDF Document (Optional)</label>
                
                {!uploadedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      isDragOver 
                        ? 'border-blue-400 bg-blue-50/50' 
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          Drop your PDF here, or <span className="text-blue-600 hover:text-blue-700 cursor-pointer">browse</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports PDF files up to 10MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileInputChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50/80 border border-green-200/50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-green-800">{uploadedFile.name}</p>
                          <p className="text-sm text-green-600">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeUploadedFile}
                        className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-red-600 hover:bg-red-50/80 rounded-lg transition-all duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Paper Preview */}
              {(newPaper.title || newPaper.authors) && (
                <div className="bg-blue-50/80 rounded-xl p-4 border border-blue-100/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-blue-700">Paper Preview</span>
                  </div>
                  <div className="text-sm text-blue-600">
                    <p className="font-medium">{newPaper.title || 'Untitled Paper'}</p>
                    <p className="text-blue-500">{newPaper.authors || 'Unknown Authors'} ({newPaper.year || new Date().getFullYear()})</p>
                    <p className="text-blue-500">{newPaper.journal || 'Unknown Journal'}</p>
                    {uploadedFile && (
                      <div className="flex items-center gap-2 mt-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-medium">PDF attached: {uploadedFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-between p-8 border-t border-gray-100/50 bg-gray-50/30">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Total Papers: <span className="font-semibold text-gray-900">{papers.length}</span>
                </span>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowAddPaperModal(false);
                    setNewPaper({
                      title: '',
                      authors: '',
                      year: '',
                      journal: '',
                      description: '',
                      citations: '',
                      impactFactor: ''
                    });
                    setUploadedFile(null);
                  }}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPaper}
                  disabled={!newPaper.title.trim() || !newPaper.authors.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:hover:shadow-blue-500/25"
                >
                  Add Paper
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Citation Manager Panel */}
      {showCitationManager && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-40">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Citation Manager</h3>
              <button 
                onClick={() => setShowCitationManager(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex gap-2">
              <button 
                onClick={() => insertCitation({ id: citations.length + 1, title: 'New Citation', author: 'Unknown', year: new Date().getFullYear() })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Add Citation
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Import from Zotero
              </button>
            </div>
            
            <div className="space-y-3">
              {citations.length > 0 ? (
                citations.map((citation) => (
                  <div key={citation.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">[{citation.id}]</span>
                      <button className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{citation.title}</p>
                    <p className="text-xs text-gray-500">{citation.author} ({citation.year})</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No citations yet</p>
                  <p className="text-xs text-gray-400 mt-1">Add your first citation to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footnotes Panel */}
      {showFootnotes && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl z-40">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Footnotes</h3>
              <button 
                onClick={() => setShowFootnotes(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {footnotes.length > 0 ? (
              footnotes.map((footnote) => (
                <div key={footnote.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-blue-600">[{footnote.id}]</span>
                    <span className="text-xs text-gray-500">{new Date(footnote.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-gray-700">{footnote.text || 'Click to edit footnote...'}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Superscript className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No footnotes yet</p>
                <p className="text-xs text-gray-400 mt-1">Add footnotes to provide additional context</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Insert Image</h3>
              <button 
                onClick={() => setShowImageUpload(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
    </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    try {
                      if (e.target && e.target.files && e.target.files[0]) {
                        insertImage(e.target.files[0]);
                      }
                    } catch (error) {
                      console.error('Error handling file upload:', error);
                    }
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label 
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Image className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">Click to select image</span>
                  <span className="text-xs text-gray-400">or drag and drop</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments Panel */}
      {showComments && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl z-40">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
              <button 
                onClick={() => setShowComments(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {comment.author.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button className="text-xs text-blue-600 hover:text-blue-700">Reply</button>
                    <button className="text-xs text-gray-500 hover:text-gray-700">Resolve</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No comments yet</p>
                <p className="text-xs text-gray-400 mt-1">Select text and add a comment</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Version History Panel */}
      {showHistory && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl z-40">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Version History</h3>
              <button 
                onClick={() => setShowHistory(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {documentHistory.length > 0 ? (
              documentHistory.map((version) => (
                <div key={version.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <History className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{version.action}</span>
                  </div>
                  <p className="text-xs text-gray-500">{version.timestamp}</p>
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    {version.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No version history yet</p>
                <p className="text-xs text-gray-400 mt-1">Changes will appear here</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchMode; 