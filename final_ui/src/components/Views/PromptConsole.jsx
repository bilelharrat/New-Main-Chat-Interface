import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, FileText, MessageSquare, Sliders, Maximize2, Minimize2, StickyNote, Copy, Pencil, Clock, Clipboard, CheckSquare, Download, ChevronLeft, ChevronRight, User, X, Search, Inbox, GripVertical, Settings, PanelLeftClose, PanelRightClose, Sun, Moon, Bot, Upload, Star, Sparkles, Send, Trash2, Lightbulb, Zap, Target, Brain } from 'lucide-react';
import { cardClass } from '../../utils/classNames';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactMarkdown from 'react-markdown';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTheme } from '../../context/ThemeContext';
import { useSearch } from '../../context/SearchContext';
import SmartSearchModal from '../SmartSearchModal';

import ThemePresets from '../ThemePresets';


// Helper function to identify hierarchical summarizer modes
const isHierarchicalSummarizerMode = (mode) => {
  const hierarchicalModes = [
    "EVES",
    "Large Document Analysis",
    "Academic Research",
    "Finance",
    "General",
    "Enterprise Model"
  ];
  return hierarchicalModes.includes(mode);
};

// AI Action Handlers
const handleAIAction = (panel, action) => {
  console.log(`AI Action: ${action} on ${panel} panel`);
  // TODO: Implement AI actions
  // This would integrate with your AI service to perform the requested action
};


// Clear editor content
const clearEditorContent = (panel) => {
  if (panel === 'notes') {
    // This will be called from within the component
    console.log('Clearing notes content');
  } else if (panel === 'write') {
    // This will be called from within the component
    console.log('Clearing write content');
  }
};

// Smart Prompt Suggestor Component
const SmartPromptSuggestor = ({ prompt, onSuggestionSelect, onClose, visible }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Generate smart prompt suggestions based on input
  useEffect(() => {
    if (!visible || prompt.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    
    // Simulate API call delay for better UX
    const timer = setTimeout(() => {
      const newSuggestions = generateSmartSuggestions(prompt);
      setSuggestions(newSuggestions);
      setLoading(false);
      setSelectedIndex(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [prompt, visible]);

  const generateSmartSuggestions = (input) => {
    const suggestions = [];
    const lowerInput = input.toLowerCase();
    
    // Simple smart suggestions based on input content
    if (lowerInput.includes('create') || lowerInput.includes('build')) {
      suggestions.push('Create a responsive component');
      suggestions.push('Build a landing page');
      suggestions.push('Create an API endpoint');
    }
    
    if (lowerInput.includes('explain') || lowerInput.includes('how')) {
      suggestions.push('Explain this code');
      suggestions.push('How does this work?');
      suggestions.push('Explain the concept');
    }
    
    if (lowerInput.includes('fix') || lowerInput.includes('error')) {
      suggestions.push('Fix this error');
      suggestions.push('Debug this issue');
      suggestions.push('Optimize this code');
    }
    
    if (lowerInput.includes('analyze') || lowerInput.includes('review')) {
      suggestions.push('Analyze this data');
      suggestions.push('Review this code');
      suggestions.push('Evaluate this approach');
    }
    
    // Default suggestions if no specific pattern matches
    if (suggestions.length === 0) {
      suggestions.push('Explain this code');
      suggestions.push('How does this work?');
      suggestions.push('Explain the concept');
    }
    
    return suggestions.slice(0, 3);
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!visible) return;
    
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % suggestions.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (suggestions[selectedIndex]) {
            onSuggestionSelect(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible, suggestions, selectedIndex, onSuggestionSelect, onClose]);

  if (!visible || suggestions.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl overflow-hidden">
        {/* Header - Light gray background like in the picture */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-[#007AFF] dark:text-[#5AC8FA]" />
            <span className="text-base font-medium text-gray-900 dark:text-gray-100">
              Smart Suggestions
            </span>
            <button
              onClick={onClose}
              className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        {/* Suggestions List - Pure white background, no borders, minimal design */}
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-[#007AFF] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#30D158] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-[#FF9500] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Eden is thinking...</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className={`w-full px-6 py-4 text-left text-base text-gray-800 dark:text-gray-200 transition-all duration-200 ${
                    index === selectedIndex 
                      ? 'bg-[#007AFF]/10 dark:bg-[#007AFF]/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}
                  onClick={() => onSuggestionSelect(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default function PromptConsole({ setView, embedded = false }) {
  const {
    searchQuery,
    searchResults,
    searchFilters,
    semanticSearch,
    setSemanticSearch,
    semanticLoading,
    activeResultIdx,
    setActiveResultIdx,
    highlightedMsgIdx,
    highlightedQuery,
    highlightedNotes,
    highlightedWrite,
    highlightedTodo,
    performSmartSearch,
    clearSearch,
    navigateResults,
    fuzzyMatch,
    getAllMatchIndices,
  } = useSearch();

  const { darkMode, toggleDarkMode } = useTheme();

  // State declarations - moved to top to fix initialization order
  const [prompt, setPrompt] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState({ notes: false, write: false });
  
  // Smart prompt suggestor state
  const [showPromptSuggestor, setShowPromptSuggestor] = useState(false);
  const [promptSuggestorDebounce, setPromptSuggestorDebounce] = useState(null);
  
  // Right-click context menu state
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, target: null });
  
  // Load messages from sessionStorage for session persistence (not localStorage for refresh clearing)
  const [messages, setMessages] = useState(() => {
    // Clear sessionStorage on page load/refresh to start fresh
    const isRefresh = performance.getEntriesByType('navigation')[0]?.type === 'reload';
    if (isRefresh) {
      sessionStorage.clear();
    }
    
    const savedMessages = sessionStorage.getItem('eden-messages');
    if (savedMessages) {
      try {
        return JSON.parse(savedMessages);
      } catch (error) {
        console.error('Error loading saved messages:', error);
      }
    }
    // Default messages if no saved data - with demo multiple responses
    return [
    { role: "user", content: "What is Ask Eden?" },
    { role: "ai", content: "I'm Eden — your agentic reasoning partner for high-stakes work. I don't just answer questions; I orchestrate the world's most advanced AI models, route your query to the best one for the task, and then process every response through EVES — the Eden Verification and Encryption System. EVES checks answers for accuracy, consistency, and evidence, eliminating hallucinations at the root. Crucially, it also keeps your data private by applying end-to-end encryption to all your conversations, ensuring they are secure and for your eyes only. What you get isn't just fast — it's trusted, auditable, and private intelligence, designed for professionals who can't afford uncertainty." }
    ];
  });

  // Demo multiple responses for testing - simulating what happens in Auto Selection mode
  const [multipleResponses, setMultipleResponses] = useState({
    1: {
      allResponses: {
        "GPT-4": "I'm Eden — your agentic reasoning partner for high-stakes work. I don't just answer questions; I orchestrate the world's most advanced AI models, route your query to the best one for the task, and then process every response through EVES — the Eden Verification and Encryption System. EVES checks answers for accuracy, consistency, and evidence, eliminating hallucinations at the root. Crucially, it also keeps your data private by applying end-to-end encryption to all your conversations, ensuring they are secure and for your eyes only. What you get isn't just fast — it's trusted, auditable, and private intelligence, designed for professionals who can't afford uncertainty.",
        "Claude-3": "Eden is your intelligent AI companion designed for professional work. I leverage multiple advanced language models to provide comprehensive, accurate responses. My EVES system ensures verification and encryption, giving you reliable, private intelligence. I'm built for professionals who need trustworthy AI assistance without compromising on data security or accuracy.",
        "Gemini Pro": "Ask Eden is an AI platform that combines multiple language models for optimal responses. I use cross-model verification through EVES to eliminate hallucinations and ensure accuracy. Your conversations are encrypted end-to-end for privacy. I'm designed for high-stakes professional work where reliability and security matter most.",
        "Anthropic Claude": "I'm Eden, a multi-model AI system built for professional use. I route queries to the most appropriate AI models and use EVES verification to ensure response quality. Your data stays private with end-to-end encryption. I'm perfect for professionals who need accurate, verified AI assistance they can trust."
      },
      similarities: {
        "GPT-4": 0.95,
        "Claude-3": 0.87,
        "Gemini Pro": 0.82,
        "Anthropic Claude": 0.79
      },
      bestModel: "GPT-4"
    }
  });

  // Set initial selected response to best model
  const [selectedResponseModel, setSelectedResponseModel] = useState({
    1: "GPT-4"
  });

  // Multi-response view state
  const [showMultiResponseView, setShowMultiResponseView] = useState(false);
  const [activeMultiResponseMessage, setActiveMultiResponseMessage] = useState(null);
  const [compareWindowExpanded, setCompareWindowExpanded] = useState(false);

  // Backend connection state
  const [backendStatus, setBackendStatus] = useState('checking');

  // Mode state - moved up to fix initialization order
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState(() => {
    // Clear sessionStorage on page load/refresh to start fresh
    const isRefresh = performance.getEntriesByType('navigation')[0]?.type === 'reload';
    if (isRefresh) {
      sessionStorage.clear();
    }
    
    const savedMode = sessionStorage.getItem('eden-selected-mode');
    return savedMode || "Auto Selection";
  });

  const modeOptions = [
    "Auto Selection",
    "EVES",
    "Large Document Analysis",
    "Coding",
    "Academic Research",
    "Finance",
    "General",
    "Enterprise Model"
  ];

  // Debug logging
  useEffect(() => {
    console.log('🔍 Debug - Multiple Responses State:', multipleResponses);
    console.log('🔍 Debug - Selected Response Model:', selectedResponseModel);
    console.log('🔍 Debug - Messages:', messages);
    console.log('🔍 Debug - Selected Mode:', selectedMode);
  }, [multipleResponses, selectedResponseModel, messages, selectedMode]);

  // Multi-response view functions
  const openMultiResponseView = (messageIdx) => {
    setActiveMultiResponseMessage(messageIdx);
    setShowMultiResponseView(true);
  };

  const handleResponseSelection = (messageIdx, modelName) => {
    setSelectedResponseModel(prev => ({
      ...prev,
      [messageIdx]: modelName
    }));
    
    // Update the message content with the selected model's response
    setMessages(prev => prev.map((m, i) => 
      i === messageIdx 
        ? { ...m, content: multipleResponses[messageIdx].allResponses[modelName] }
        : m
    ));
  };

  // Test backend connection on component mount
  useEffect(() => {
    // Note: sessionStorage persists during the session but clears on page refresh
    // This gives us the best of both worlds - persistence during navigation, fresh start on refresh
    
    const testConnection = async () => {
      try {
        const { api } = await import('../../utils/api');
        const result = await api.testConnection();
        console.log('Backend connection test:', result);
        
        if (result.status === 'connected') {
          console.log('✅ Backend connected successfully');
          setBackendStatus('connected');
        } else {
          console.warn('⚠️ Backend connection issue:', result.message);
          setBackendStatus('disconnected');
        }
      } catch (error) {
        console.error('❌ Backend connection test failed:', error);
        setBackendStatus('error');
      }
    };
    
    testConnection();
  }, []);

  // Simple keyboard shortcuts for essential navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle shortcuts when not typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true') {
        return;
      }

      // Find the currently focused message (last AI message with multiple responses)
      const aiMessages = messages.filter((msg, idx) => msg.role === 'ai' && multipleResponses[idx]);
      if (aiMessages.length === 0) return;

      const lastAiMessageIdx = messages.findLastIndex(msg => msg.role === 'ai' && multipleResponses[messages.indexOf(msg)]);
      if (lastAiMessageIdx === -1) return;

      const currentResponses = multipleResponses[lastAiMessageIdx];
      const currentModel = selectedResponseModel[lastAiMessageIdx] || currentResponses.bestModel;
      const models = Object.keys(currentResponses.allResponses);
      const currentIndex = models.indexOf(currentModel);

      switch (e.key) {
        case 'ArrowLeft':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            // Previous response
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : models.length - 1;
            const prevModel = models[prevIndex];
            
            setSelectedResponseModel(prev => ({
              ...prev,
              [lastAiMessageIdx]: prevModel
            }));
            
            setMessages(prev => prev.map((m, i) => 
              i === lastAiMessageIdx 
                ? { ...m, content: currentResponses.allResponses[prevModel] }
                : m
            ));
          }
          break;
          
        case 'ArrowRight':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            // Next response
            const nextIndex = (currentIndex + 1) % models.length;
            const nextModel = models[nextIndex];
            
            setSelectedResponseModel(prev => ({
              ...prev,
              [lastAiMessageIdx]: nextModel
            }));
            
            setMessages(prev => prev.map((m, i) => 
              i === lastAiMessageIdx 
                ? { ...m, content: currentResponses.allResponses[nextModel] }
                : m
            ));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [messages, multipleResponses, selectedResponseModel]);

  const [fullscreen, setFullscreen] = useState(false);
  const [showScrollToggle, setShowScrollToggle] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [citedNotes, setCitedNotes] = useState([]); // {text, messageIdx}
  const messageRefs = useRef([]);
  const [selection, setSelection] = useState({ text: '', messageIdx: null, rect: null });
  const [notesWidth, setNotesWidth] = useState(384); // default 24rem (w-96)
  const minNotesWidth = 320; // px
  const maxNotesWidth = 700; // px
  const dragHandleRef = useRef();
  const [writeOpen, setWriteOpen] = useState(false);
  const [writeContent, setWriteContent] = useState("");
  const [writeWidth, setWriteWidth] = useState(480); // default 30rem
  const minWriteWidth = 320;
  const maxWriteWidth = 900;
  const writeDragHandleRef = useRef();
  const notesDragHandleRef = useRef();
  const [notesBottomLeftSize, setNotesBottomLeftSize] = useState({ width: 360, height: 320 });
  const notesBottomLeftMin = { width: 220, height: 120 };
  const notesBottomLeftMax = { width: 600, height: 600 };
  const notesResizeHandleRef = useRef();
  const [writeFormat, setWriteFormat] = useState('');
  const [showFormatInput, setShowFormatInput] = useState(false);
  const [formatButtonRef, setFormatButtonRef] = useState(null);
  const [formatPopupPosition, setFormatPopupPosition] = useState({ top: 0, left: 0 });

  // Handle format button click with position calculation
  const handleFormatClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setFormatPopupPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.right + window.scrollX - 200 // Position to the right of button
    });
    setShowFormatInput(f => !f);
  };

  // Format popup component using portal
  const FormatPopup = () => {
    if (!showFormatInput) return null;

    return createPortal(
      <div 
        className="fixed bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-4 z-[9999] flex items-center gap-3 animate-in slide-in-from-top-2"
        style={{
          top: `${formatPopupPosition.top}px`,
          left: `${formatPopupPosition.left}px`
        }}
      >
        <input
          type="text"
          className="px-3 py-2 rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#30D158]/30 focus:border-[#30D158] transition-all duration-200"
          placeholder="e.g. MLA, APA"
          value={writeFormat}
          onChange={e => setWriteFormat(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') setShowFormatInput(false); }}
          autoFocus
        />
        <button
          className="text-sm px-4 py-2 rounded-xl bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] text-white font-medium hover:from-[#007AFF] hover:to-[#5AC8FA] transition-all duration-200 hover:scale-105 shadow-lg"
          onClick={() => setShowFormatInput(false)}
        >OK</button>
      </div>,
      document.body
    );
  };
  // Version history for Notes
  const [notesHistory, setNotesHistory] = useState([]); // {content, timestamp}
  const [showNotesHistory, setShowNotesHistory] = useState(false);
  // Version history for Write-in Canvas
  const [writeHistory, setWriteHistory] = useState([]); // {content, timestamp}
  const [showWriteHistory, setShowWriteHistory] = useState(false);
  // Linking/backlinking state
  const [backlinks, setBacklinks] = useState({}); // {msgIdx: [locations]}
  
  // To-Do Lists state
  const [notesTodos, setNotesTodos] = useState([]); // [{id, text, completed, created}]
  const [writeTodos, setWriteTodos] = useState([]); // [{id, text, completed, created}]
  const [showTodos, setShowTodos] = useState({ notes: false, write: false }); // Show/hide todo lists
  
  // Export state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportPanel, setExportPanel] = useState(null); // 'notes' or 'write'
  const [exportFormat, setExportFormat] = useState('markdown');
  
  // File upload state - session persistence
  const [uploadedFile, setUploadedFile] = useState(() => {
    // Clear sessionStorage on page load/refresh to start fresh
    const isRefresh = performance.getEntriesByType('navigation')[0]?.type === 'reload';
    if (isRefresh) {
      sessionStorage.clear();
    }
    
    const savedFile = sessionStorage.getItem('eden-uploaded-file');
    if (savedFile) {
      try {
        const fileData = JSON.parse(savedFile);
        // Note: We can't fully restore File objects from sessionStorage
        // So we'll just restore the file name for display purposes
        return { name: fileData.name, size: fileData.size };
      } catch (error) {
        console.error('Error loading saved file:', error);
      }
    }
    return null;
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState('');
  
  
  // Action menu state
  const [openActionMenu, setOpenActionMenu] = useState(null); // messageIdx of open action menu
  
  // Helper to check if hierarchical summarizer will be triggered
  const willTriggerHierarchicalSummarizer = uploadedFile && isHierarchicalSummarizerMode(selectedMode);
  
  // Auto-scroll ref for messages
  const messagesEndRef = useRef(null);
  
  // Click outside handler for action menu and response filter
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openActionMenu !== null) {
        setOpenActionMenu(null);
      }
      // Close context menu when clicking outside
      if (contextMenu.show) {
        setContextMenu({ show: false, x: 0, y: 0, target: null });
      }
      // Close smart prompt suggestor when clicking outside
      if (showPromptSuggestor) {
        setShowPromptSuggestor(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openActionMenu, contextMenu.show, showPromptSuggestor]);
  
  // Export settings
  const [exportSettings, setExportSettings] = useState({
    includeTodos: true,
    includeMetadata: true,
    includeImages: true,
    includeLinks: true,
    includeTimestamp: true
  });
  
  // Export preview
  const [showExportPreview, setShowExportPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  
  // Template system
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  
  // Smart Search state
  const [showSearchModal, setShowSearchModal] = useState(false);
  // Fuzzy & Semantic toggles
  const [fuzzySearch, setFuzzySearch] = useState(false);
  
  // Next/Previous navigation state for multiple matches
  const [activeMatchIdx, setActiveMatchIdx] = useState(0);
  const resultRefs = useRef([]);
  
  // Theming state
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [accentColor, setAccentColor] = useState('199 78% 60%'); // Default: baby blue

  // Edit message state
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageContent, setEditMessageContent] = useState('');

  // Edit message functions
  const handleEditMessage = (messageId, content) => {
    setEditingMessageId(messageId);
    setEditMessageContent(content);
  };

  const handleSaveEdit = () => {
    if (editingMessageId !== null && editMessageContent.trim()) {
      setMessages(prev => prev.map(msg => 
        msg.id === editingMessageId 
          ? { ...msg, content: editMessageContent.trim() }
          : msg
      ));
      setEditingMessageId(null);
      setEditMessageContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditMessageContent('');
  };

  // New layout state
  const [panelLayout, setPanelLayout] = useState('right'); // 'right', 'split', 'left'
  const [notesCollapsed, setNotesCollapsed] = useState(false);
  const [writeCollapsed, setWriteCollapsed] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [currentPreset, setCurrentPreset] = useState(null);


  // Enhanced smooth transitions and progressive disclosure
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize editors properly
  useEffect(() => {
    // Ensure editors start with clean content
    if (notes && notes.trim() === '') {
      setNotes('');
    }
    if (writeContent && writeContent.trim() === '') {
      setWriteContent('');
    }
  }, [notes, writeContent]);

  // Right-click context menu handlers
  const handleEditorRightClick = (e, panel) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      target: panel
    });
  };

  const handleContextMenuAction = (action, panel) => {
    switch (action) {
      case 'ai-assistant':
        // TODO: Implement AI writing assistant
        console.log(`AI Writing Assistant for ${panel} panel`);
        break;
      case 'improve-text':
        // TODO: Implement text improvement
        console.log(`Improve text in ${panel} panel`);
        break;
      case 'rewrite-selection':
        // TODO: Implement text rewriting
        console.log(`Rewrite selection in ${panel} panel`);
        break;
      case 'cite-sources':
        // TODO: Implement source citation
        console.log(`Cite sources for ${panel} panel`);
        break;
      case 'check-grammar':
        // TODO: Implement grammar checking
        console.log(`Check grammar for ${panel} panel`);
        break;
      case 'export':
        openExportModal(panel);
        break;
      case 'clear':
        if (panel === 'notes') {
          setNotes('');
        } else if (panel === 'write') {
          setWriteContent('');
        }
        break;
      case 'copy':
        const content = panel === 'notes' ? notes : writeContent;
        navigator.clipboard.writeText(content);
        break;
      case 'paste':
        navigator.clipboard.readText().then(text => {
          if (panel === 'notes') {
            setNotes(prev => prev + text);
          } else if (panel === 'write') {
            setWriteContent(prev => prev + text);
          }
        });
        break;
      default:
        break;
    }
    
    setContextMenu({ show: false, x: 0, y: 0, target: null });
  };

  // Quick Action Handlers
  const handleQuickAction = (panel, action) => {
    console.log(`Quick Action: ${action} on ${panel} panel`);
    
    const getContent = () => {
      if (panel === 'notes') {
        return notes;
      } else if (panel === 'write') {
        return writeContent;
      }
      return '';
    };

    const content = getContent();
    
    if (!content.trim()) {
      alert(`${panel === 'notes' ? 'Notes' : 'Write'} panel is empty. Add some content first.`);
      return;
    }

    switch (action) {
      case 'cite':
        // Add content to chat as a user message
        const citeMessage = {
          role: 'user',
          content: `[Cited from ${panel} panel]\n\n${content}`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, citeMessage]);
        
        // Scroll to bottom of chat
        setTimeout(() => {
          const chatContainer = document.querySelector('.overflow-y-auto');
          if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
          }
        }, 100);
        
        // Show success feedback
        console.log(`Content cited from ${panel} panel to chat`);
        break;
        
      case 'export':
        // Export content as a file
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `${panel}_content_${timestamp}.txt`;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`Content exported from ${panel} panel as ${filename}`);
        break;
        
      case 'share':
        // Share content via Web Share API or copy to clipboard
        if (navigator.share) {
          navigator.share({
            title: `Eden AI ${panel === 'notes' ? 'Notes' : 'Writing'}`,
            text: content,
          }).catch(err => {
            console.log('Error sharing:', err);
            // Fallback to clipboard
            navigator.clipboard.writeText(content).then(() => {
              alert('Content copied to clipboard!');
            });
          });
        } else {
          // Fallback to clipboard
          navigator.clipboard.writeText(content).then(() => {
            alert('Content copied to clipboard!');
          }).catch(() => {
            // Final fallback - create a temporary textarea
            const textarea = document.createElement('textarea');
            textarea.value = content;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Content copied to clipboard!');
          });
        }
        
        console.log(`Content shared from ${panel} panel`);
        break;
        
      default:
        break;
    }
  };

  // Progressive disclosure - show more options as user becomes more proficient
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length > 2) {
        setShowAdvancedOptions(true);
      }
    }, 30000); // Show advanced options after 30 seconds of use

    return () => clearTimeout(timer);
  }, [messages.length]);

  // Smooth typing indicator
  useEffect(() => {
    if (isProcessing) {
      setIsTyping(true);
    } else {
      const timer = setTimeout(() => setIsTyping(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isProcessing]);

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ⌘K for search
      if (e.metaKey && e.key === 'k') {
        e.preventDefault();
        // Trigger search
      }
      
      // ⌘Enter for quick send
      if (e.metaKey && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
      
      // Escape to clear input
      if (e.key === 'Escape') {
        setPrompt('');
      }
      
      // ⌘/ for smart prompt suggestions
      if (e.metaKey && e.key === '/') {
        e.preventDefault();
        if (prompt.length >= 3) {
          setShowPromptSuggestor(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [prompt]);

  
  // Smart prompt suggestor logic
  useEffect(() => {
    if (promptSuggestorDebounce) {
      clearTimeout(promptSuggestorDebounce);
    }
    
    if (prompt.length >= 3) {
      const timer = setTimeout(() => {
        setShowPromptSuggestor(true);
      }, 500); // Show after 500ms of typing
      setPromptSuggestorDebounce(timer);
    } else {
      setShowPromptSuggestor(false);
    }
    
    return () => {
      if (promptSuggestorDebounce) {
        clearTimeout(promptSuggestorDebounce);
      }
    };
  }, [prompt, promptSuggestorDebounce]);
  


  useEffect(() => {
    const savedAccent = localStorage.getItem('eden-accent-color');
    if (savedAccent) {
      setAccentColor(savedAccent);
    }
    
    // Load saved preset
    const savedPreset = localStorage.getItem('eden-current-preset');
    if (savedPreset) {
      setCurrentPreset(savedPreset);
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accentColor);
    localStorage.setItem('eden-accent-color', accentColor);
  }, [accentColor]);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle clicking outside response filter dropdown

  // Save messages to sessionStorage for session persistence
  useEffect(() => {
    sessionStorage.setItem('eden-messages', JSON.stringify(messages));
  }, [messages]);

  // Save uploaded file info to sessionStorage for session persistence
  useEffect(() => {
    if (uploadedFile) {
      sessionStorage.setItem('eden-uploaded-file', JSON.stringify({
        name: uploadedFile.name,
        size: uploadedFile.size
      }));
    } else {
      sessionStorage.removeItem('eden-uploaded-file');
    }
  }, [uploadedFile]);

  // Save selected mode to sessionStorage for session persistence
  useEffect(() => {
    sessionStorage.setItem('eden-selected-mode', selectedMode);
  }, [selectedMode]);







  const predefinedAccents = [
    { name: 'Apple Blue', value: '210 100% 50%' },
    { name: 'Apple Green', value: '142 76% 45%' },
    { name: 'Apple Orange', value: '38 100% 50%' },
    { name: 'Apple Red', value: '0 84% 50%' }
  ];

  const exportTemplates = {
    default: {
      name: 'Default',
      description: 'Clean, professional formatting',
      pdf: { headerColor: [0, 122, 204], fontSize: 11, spacing: 1.4 },
      docx: { titleSize: 32, bodySize: 24, spacing: 200 }
    },
    academic: {
      name: 'Academic',
      description: 'Formal academic paper style',
      pdf: { headerColor: [51, 51, 51], fontSize: 12, spacing: 2.0 },
      docx: { titleSize: 28, bodySize: 24, spacing: 240 }
    },
    business: {
      name: 'Business',
      description: 'Professional business document',
      pdf: { headerColor: [34, 139, 34], fontSize: 11, spacing: 1.6 },
      docx: { titleSize: 36, bodySize: 24, spacing: 180 }
    },
    creative: {
      name: 'Creative',
      description: 'Modern, creative layout',
      pdf: { headerColor: [138, 43, 226], fontSize: 10, spacing: 1.3 },
      docx: { titleSize: 40, bodySize: 20, spacing: 160 }
    },
    minimal: {
      name: 'Minimal',
      description: 'Clean, minimal design',
      pdf: { headerColor: [128, 128, 128], fontSize: 11, spacing: 1.5 },
      docx: { titleSize: 24, bodySize: 24, spacing: 200 }
    }
  };
  
  // Helper to copy message link
  const handleCopyMsgLink = (idx) => {
    navigator.clipboard.writeText(`[Message #${idx + 1}]`);
  };
  
  // Helper to find all match indices in text
  
  // Helper to handle link click in notes/writing
  const handleMsgLinkClick = (idx) => {
    if (messageRefs.current[idx]) {
      messageRefs.current[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageRefs.current[idx].classList.add('ring-4', 'ring-accent', 'bg-[#FF9500]/10', 'animate-cited-glow');
      setTimeout(() => {
        if (messageRefs.current[idx]) {
          messageRefs.current[idx].classList.remove('ring-4', 'ring-accent', 'bg-[#FF9500]/10', 'animate-cited-glow');
        }
      }, 1800);
    }
  };
  // Helper to copy Notes/Writing link
  const handleCopyPanelLink = (panel) => {
    navigator.clipboard.writeText(panel === 'note' ? '[Note]' : '[Writing]');
  };
  
  // Helper to copy content to clipboard
  const handleCopyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };
  
  // Helper to download response content
  const handleDownloadResponse = (content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eden-response-${new Date().toISOString().slice(0, 19)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  // Helper to handle panel link click
  const handlePanelLinkClick = (panel) => {
    if (panel === 'note') {
      const el = document.getElementById('notes-panel-link-target');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-accent', 'bg-[#FF9500]/10', 'animate-cited-glow');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-accent', 'bg-[#FF9500]/10', 'animate-cited-glow');
        }, 1800);
      }
    } else if (panel === 'writing') {
      const el = document.getElementById('writing-panel-link-target');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-accent', 'bg-[#FF9500]/10', 'animate-cited-glow');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-accent', 'bg-[#FF9500]/10', 'animate-cited-glow');
        }, 1800);
      }
    }
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId, type } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const todoList = type === 'notes-todos' ? notesTodos : writeTodos;
    const setTodoList = type === 'notes-todos' ? setNotesTodos : setWriteTodos;
    
    const newTodos = Array.from(todoList);
    const [reorderedItem] = newTodos.splice(source.index, 1);
    newTodos.splice(destination.index, 0, reorderedItem);

    setTodoList(newTodos);
  };

  // To-Do Lists management functions
  const addTodo = (panel, text) => {
    const newTodo = {
      id: Date.now() + Math.random(),
      text: text.trim(),
      completed: false,
      created: new Date().toISOString()
    };
    
    if (panel === 'notes') {
      setNotesTodos(prev => [...prev, newTodo]);
    } else if (panel === 'write') {
      setWriteTodos(prev => [...prev, newTodo]);
    }
  };

  const toggleTodo = (panel, todoId) => {
    if (panel === 'notes') {
      setNotesTodos(prev => prev.map(todo => 
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      ));
    } else if (panel === 'write') {
      setWriteTodos(prev => prev.map(todo => 
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      ));
    }
  };

  const deleteTodo = (panel, todoId) => {
    if (panel === 'notes') {
      setNotesTodos(prev => prev.filter(todo => todo.id !== todoId));
    } else if (panel === 'write') {
      setWriteTodos(prev => prev.filter(todo => todo.id !== todoId));
    }
  };

  const getTodoStats = (todos) => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  // Export functionality
  const openExportModal = (panel) => {
    setExportPanel(panel);
    setShowExportModal(true);
  };

  const exportToMarkdown = (content, todos, panelName) => {
    let markdown = `# ${panelName}\n\n`;
    
    if (exportSettings.includeTimestamp) {
      markdown += `Generated on: ${new Date().toLocaleString()}\n\n`;
    }
    
    // Add content
    if (content.trim()) {
      markdown += `## Content\n\n${content}\n\n`;
    }
    
    // Add todos if any
    if (exportSettings.includeTodos && todos && todos.length > 0) {
      markdown += `## To-Do List\n\n`;
      const stats = getTodoStats(todos);
      markdown += `**Progress:** ${stats.completed}/${stats.total} completed\n\n`;
      
      todos.forEach(todo => {
        const checkbox = todo.completed ? '[x]' : '[ ]';
        markdown += `${checkbox} ${todo.text}\n`;
      });
      markdown += '\n';
    }
    
    return markdown;
  };

  const exportToPlainText = (content, todos, panelName) => {
    const text = `${panelName}\n\n${content}\n\n${todos.map(todo => `- [${todo.completed ? 'x' : ' '}] ${todo.text}`).join('\n')}`;
    downloadFile(text, `${panelName.toLowerCase().replace(/\s+/g, '_')}.txt`, 'text/plain');
  };

  const exportToHTML = (content, todos, panelName) => {
    const html = `
      <!DOCTYPE html>
      <html>
<head>
    <title>${panelName}</title>
    <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 2rem; }
            .todo { margin: 0.5rem 0; }
            .completed { text-decoration: line-through; color: #666; }
    </style>
</head>
<body>
          <h1>${panelName}</h1>
          <div>${content.replace(/\n/g, '<br>')}</div>
          <h2>To-Dos</h2>
          ${todos.map(todo => `<div class="todo ${todo.completed ? 'completed' : ''}">- ${todo.text}</div>`).join('')}
</body>
      </html>
    `;
    downloadFile(html, `${panelName.toLowerCase().replace(/\s+/g, '_')}.html`, 'text/html');
  };

  const exportToPDF = (content, todos, panelName) => {
    // PDF export disabled - would require jsPDF library
    console.log('PDF export not available');
    return null;
  };

  const exportToDocx = async (content, todos, panelName) => {
    // DOCX export disabled - would require docx library
    console.log('DOCX export not available');
    return null;
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    const content = exportPanel === 'notes' ? notes : writeContent;
    const todos = exportPanel === 'notes' ? notesTodos : writeTodos;
    const panelName = exportPanel === 'notes' ? 'Notes' : 'Writing';
    
    let exportContent = '';
    let filename = '';
    let mimeType = '';
    
    switch (exportFormat) {
      case 'markdown':
        exportContent = exportToMarkdown(content, todos, panelName);
        filename = `${panelName.toLowerCase()}-${new Date().toISOString().split('T')[0]}.md`;
        mimeType = 'text/markdown';
        downloadFile(exportContent, filename, mimeType);
        break;
      case 'plaintext':
        exportContent = exportToPlainText(content, todos, panelName);
        filename = `${panelName.toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
        mimeType = 'text/plain';
        downloadFile(exportContent, filename, mimeType);
        break;
      case 'html':
        exportContent = exportToHTML(content, todos, panelName);
        filename = `${panelName.toLowerCase()}-${new Date().toISOString().split('T')[0]}.html`;
        mimeType = 'text/html';
        downloadFile(exportContent, filename, mimeType);
        break;
      default:
        return;
    }
    setShowExportModal(false);
  };

  const generatePreview = () => {
    const content = exportPanel === 'notes' ? notes : writeContent;
    const todos = exportPanel === 'notes' ? notesTodos : writeTodos;
    const panelName = exportPanel === 'notes' ? 'Notes' : 'Writing';
    
    let preview = '';
    
    switch (exportFormat) {
      case 'markdown':
        preview = exportToMarkdown(content, todos, panelName);
        break;
      case 'plaintext':
        preview = exportToPlainText(content, todos, panelName);
        break;
      case 'html':
        preview = exportToHTML(content, todos, panelName);
        break;
      default:
        preview = 'Preview not available for this format.';
    }
    
    setPreviewContent(preview);
    setShowExportPreview(true);
  };

  // Extended renderWithMsgLinks to support [Note] and [Writing]
  const renderWithMsgLinks = (text) => {
    const regex = /\[(Message #(\d+)|Note|Writing)\]/g;
    const parts = [];
    let lastIdx = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match[2]) { // Message link
        const idx = parseInt(match[2], 10) - 1;
        if (match.index > lastIdx) {
          parts.push(text.slice(lastIdx, match.index));
        }
        parts.push(
          <button
            key={match.index}
            className="text-accent underline hover:brightness-90 px-1"
            onClick={() => handleMsgLinkClick(idx)}
            type="button"
          >
            {match[0]}
          </button>
        );
        // Track backlink
        if (!backlinks[idx]) backlinks[idx] = [];
        lastIdx = regex.lastIndex;
      } else if (match[1] === 'Note') {
        if (match.index > lastIdx) {
          parts.push(text.slice(lastIdx, match.index));
        }
        parts.push(
          <button
            key={match.index}
            className="text-accent underline hover:brightness-90 px-1"
            onClick={() => handlePanelLinkClick('note')}
            type="button"
          >
            [Note]
          </button>
        );
        lastIdx = regex.lastIndex;
      } else if (match[1] === 'Writing') {
        if (match.index > lastIdx) {
          parts.push(text.slice(lastIdx, match.index));
        }
        parts.push(
          <button
            key={match.index}
            className="text-accent underline hover:brightness-90 px-1"
            onClick={() => handlePanelLinkClick('writing')}
            type="button"
          >
            [Writing]
          </button>
        );
        lastIdx = regex.lastIndex;
      }
    }
    if (lastIdx < text.length) {
      parts.push(text.slice(lastIdx));
    }
    return parts;
  };

  useEffect(() => {
    const handleMouseUp = (e) => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        setSelection({ text: '', messageIdx: null, rect: null });
        return;
      }
      const selectedText = sel.toString();
      if (!selectedText) {
        setSelection({ text: '', messageIdx: null, rect: null });
        return;
      }
      // Find the message index by traversing up the DOM
      let node = sel.anchorNode;
      while (node && node.nodeType !== 1) node = node.parentElement;
      let msgDiv = node;
      while (msgDiv && (!msgDiv.dataset || !msgDiv.dataset.msgIdx)) {
        msgDiv = msgDiv.parentElement;
      }
      if (msgDiv && msgDiv.dataset && msgDiv.dataset.msgIdx) {
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        setSelection({ text: selectedText, messageIdx: parseInt(msgDiv.dataset.msgIdx), rect });
      } else {
        setSelection({ text: '', messageIdx: null, rect: null });
      }
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const textareaRef = useRef(null);

  // Auto-resize textarea
  const handleInput = (e) => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
    setPrompt(e.target.value);
    if (e.target.value === '') {
      setFullscreen(false);
      if (textarea) {
        textarea.style.height = '';
      }
    }
    // Check if scroll toggle should be shown
    setTimeout(checkScrollToggle, 0);
  };

  // Smart prompt suggestor handlers
  const handlePromptSuggestionSelect = (suggestion) => {
    setPrompt(suggestion);
    setShowPromptSuggestor(false);
    // Focus back to the input
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handlePromptSuggestorClose = () => {
    setShowPromptSuggestor(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt && !uploadedFile) return;

    setIsProcessing(true);
    setProcessingError(null);
    
    // Add user message
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: trimmedPrompt || `Processing ${uploadedFile?.name || 'document'}...`
    }]);

    // Add loading indicator for AI response
    setMessages(prev => [...prev, { 
      role: 'ai', 
      content: '🤔 Processing your request...',
      loading: true
    }]);

    try {
      let responseContent = '';

      if (uploadedFile) {
        // Use hierarchical summarizer for PDF processing
        const { api } = await import('../../utils/api');
        
        const result = await api.hierarchicalSummarize(
          uploadedFile, 
          trimmedPrompt || "Please provide a comprehensive summary of this document.",
          selectedMode,
          true, // enableBookMode
          false // chapterDetection
        );
        
        if (result.response) {
          responseContent = result.response;
        } else {
          throw new Error('No response received from hierarchical summarizer');
        }
      } else {
        // Handle text-only prompts
        const { api } = await import('../../utils/api');
        
        if (selectedMode === "Auto Selection") {
          // Use query endpoint to get responses from all LLM models
          const result = await api.queryMultipleLLMs(trimmedPrompt);
          
          if (result.best_response) {
            responseContent = result.best_response;
            
            // Store multiple responses for filtering
            const currentMessageIdx = messages.length + 1; // +1 because we just added the user message
            setMultipleResponses(prev => ({
              ...prev,
              [currentMessageIdx]: {
                allResponses: result.all_responses,
                similarities: result.similarities,
                bestModel: result.best_model
              }
            }));
            
            // Set the best model as the initially selected one
            setSelectedResponseModel(prev => ({
              ...prev,
              [currentMessageIdx]: result.best_model
            }));
          } else {
            throw new Error('No response received from query API');
          }
        } else {
          // Use regular chat for other modes
          const result = await api.chat(trimmedPrompt);
          
          if (result.response) {
            responseContent = result.response;
          } else {
            throw new Error('No response received from chat API');
          }
        }
      }

      setMessages(prev => {
        const updatedMessages = prev.filter(m => !m.loading);
          return [...updatedMessages, { 
            role: 'ai', 
            content: responseContent
          }];
        });

    } catch (error) {
      console.error('Processing error:', error);
      setProcessingError(error.message || 'An error occurred while processing your request.');
      
      let errorMessage = 'An error occurred while processing your request.';
      if (error.message.includes('timeout')) {
        errorMessage = 'The request timed out. Please try again with a smaller document or shorter prompt.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('API key')) {
        errorMessage = 'API key configuration error. Please check your environment variables.';
      } else {
        errorMessage = error.message || 'An error occurred while processing your request.';
      }
      
      setMessages(prev => {
        const updatedMessages = prev.filter(m => !m.loading);
        return [...updatedMessages, { 
          role: 'ai', 
          content: `❌ **Error:** ${errorMessage}\n\nPlease try again or contact support if the problem persists.`
        }];
      });
    } finally {
      setIsProcessing(false);
      setPrompt('');
    }
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    setModeMenuOpen(false);
    
    // Special handling for different modes that connect to hierarchical summarizer
    if (mode === "Coding") {
      // Apply coding preset instead of manual settings
      applyPreset('coding');
      console.log('Coding mode activated');
    } else if (mode === "EVES") {
      // EVES mode - Eden Verification and Encryption System
      console.log('EVES mode activated - Enhanced verification and encryption enabled');
      applyPreset('professional');
    } else if (mode === "Large Document Analysis") {
      // Large Document Analysis mode - Optimized for large documents
      console.log('Large Document Analysis mode activated - Optimized for comprehensive document processing');
      applyPreset('document');
    } else if (mode === "Academic Research") {
      // Academic Research mode - Research-focused analysis
      console.log('Academic Research mode activated - Research and citation-focused processing');
      applyPreset('academic');
    } else if (mode === "Finance") {
      // Finance mode - Financial document analysis
      console.log('Finance mode activated - Financial analysis and risk assessment enabled');
      applyPreset('finance');
    } else if (mode === "General") {
      // General mode - General-purpose analysis
      console.log('General mode activated - Balanced analysis for general use');
      applyPreset('general');
    } else if (mode === "Enterprise Model") {
      // Enterprise Model mode - Enterprise-level insights
      console.log('Enterprise Model mode activated - Enterprise-level analysis and insights');
      applyPreset('enterprise');
    } else {
      // Auto Selection and other modes - Default handling
      if (!currentPreset) {
        setAccentColor('199 78% 60%'); // Default baby blue
        setPanelLayout('right');
        setNotesCollapsed(false);
        setWriteCollapsed(false);

      }
    }
    
    // Log mode selection for hierarchical summarizer
    console.log(`Mode selected: ${mode} - Will use hierarchical summarizer when file is uploaded`);
  };





  const handleRemoveFile = () => {
    setUploadedFile(null);
    setProcessingError('');
  };

  const handleCiteToNotes = (msg, idx) => {
    setCitedNotes(prev => [...prev, { text: msg.content, messageIdx: idx }]);
    setNotes(n => n + (n ? '\n\n' : '') + msg.content);
    setNotesOpen(true);
  };

  const handleCiteSelectionToNotes = () => {
    if (selection.text && selection.messageIdx !== null) {
      setCitedNotes(prev => [...prev, { text: selection.text, messageIdx: selection.messageIdx }]);
      setNotes(n => n + (n ? '\n\n' : '') + selection.text);
      setNotesOpen(true);
      setSelection({ text: '', messageIdx: null, rect: null });
      window.getSelection().removeAllRanges();
    }
  };

  // Track which messages have been cited
  const citedMessageIndices = Array.from(new Set(citedNotes.map(n => n.messageIdx)));

  const handleCitedNoteClick = (idx) => {
    if (messageRefs.current[idx]) {
      messageRefs.current[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageRefs.current[idx].classList.add('ring-4', 'ring-accent', 'bg-[#FF9500]/10', 'animate-cited-glow');
      setTimeout(() => {
        if (messageRefs.current[idx]) {
          messageRefs.current[idx].classList.remove('ring-4', 'ring-accent', 'bg-[#FF9500]/10', 'animate-cited-glow');
        }
      }, 1800);
    }
  };

  // Helper to determine if prompt is multiline
  const isMultiline = prompt.includes('\n') || (textareaRef.current && textareaRef.current.scrollHeight > 56);

  // Helper to check if scroll toggle should be shown
  const checkScrollToggle = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const shouldShow = textarea.scrollHeight > textarea.clientHeight + 10; // 10px buffer
      setShowScrollToggle(shouldShow);
    }
  };

  // Check scroll toggle when fullscreen changes
  useEffect(() => {
    setTimeout(checkScrollToggle, 100);
  }, [fullscreen]);



  // Drag logic for resizing notes panel
  const startDrag = useCallback((e) => {
    if (notesCollapsed) {
      setNotesCollapsed(false);
      return;
    }
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = notesWidth;
    const notesIsLeft = panelLayout === 'left' || panelLayout === 'split';

    const onMouseMove = (moveEvent) => {
      const delta = startX - moveEvent.clientX;
      let newWidth = notesIsLeft ? startWidth - delta : startWidth + delta;
      newWidth = Math.max(minNotesWidth, Math.min(maxNotesWidth, newWidth));
      setNotesWidth(newWidth);
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [notesWidth, notesCollapsed, panelLayout]);

  // Drag logic for Write-in Canvas
  const startWriteDrag = useCallback((e) => {
    if (writeCollapsed) {
      setWriteCollapsed(false);
      return;
    }
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = writeWidth;
    const writeIsLeft = panelLayout === 'left';

    const onMouseMove = (moveEvent) => {
      const delta = startX - moveEvent.clientX;
      let newWidth = writeIsLeft ? startWidth - delta : startWidth + delta;
      newWidth = Math.max(minWriteWidth, Math.min(maxWriteWidth, newWidth));
      setWriteWidth(newWidth);
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [writeWidth, writeCollapsed, panelLayout]);

  // Diagonal resize logic for bottom-left Notes panel (top-right handle)
  const startNotesDiagonalResize = useCallback((e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = notesBottomLeftSize.width;
    const startHeight = notesBottomLeftSize.height;
    const onMouseMove = (moveEvent) => {
      let newWidth = startWidth + (moveEvent.clientX - startX);
      let newHeight = startHeight - (moveEvent.clientY - startY);
      newWidth = Math.max(notesBottomLeftMin.width, Math.min(notesBottomLeftMax.width, newWidth));
      newHeight = Math.max(notesBottomLeftMin.height, Math.min(notesBottomLeftMax.height, newHeight));
      setNotesBottomLeftSize({ width: newWidth, height: newHeight });
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [notesBottomLeftSize]);

  // Auto-open Write-in Canvas for long AI outputs
  useEffect(() => {
    if (!messages.length) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === 'ai' && lastMsg.content && lastMsg.content.length > 500) {
      setWriteContent(lastMsg.content);
      // Removed auto-opening of write panel - only opens when user clicks
    }
  }, [messages]);

  // Add useEffect to trigger search when data changes
  useEffect(() => {
    if (searchQuery.trim()) {
      performSmartSearch(searchQuery, {
        messages,
        notes,
        writeContent,
        notesTodos,
        writeTodos,
      });
      } else {
      clearSearch();
    }
  }, [searchQuery, messages, notes, writeContent, notesTodos, writeTodos, searchFilters, semanticSearch]);

  // Add useEffect for highlighting
  useEffect(() => {
    if (highlightedMsgIdx !== null && messageRefs.current[highlightedMsgIdx]) {
      messageRefs.current[highlightedMsgIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageRefs.current[highlightedMsgIdx].classList.add('ring-4', 'ring-accent', 'bg-[#FF9500]/10', 'animate-cited-glow');
              setTimeout(() => {
        if (messageRefs.current[highlightedMsgIdx]) {
          messageRefs.current[highlightedMsgIdx].classList.remove('ring-4', 'ring-accent', 'bg-[#FF9500]/10', 'animate-cited-glow');
                }
              }, 1800);
            }
    
    if (highlightedNotes) {
          const el = document.getElementById('notes-panel-link-target');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-4', 'ring-accent', 'bg-[#FF9500]/10', 'animate-cited-glow');
            setTimeout(() => {
              el.classList.remove('ring-4', 'ring-accent', 'bg-[#FF9500]/10', 'animate-cited-glow');
            }, 1800);
          }
    }

    if (highlightedWrite) {
          const el = document.getElementById('writing-panel-link-target');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-4', 'ring-accent', 'bg-[#FF9500]/10', 'animate-cited-glow');
            setTimeout(() => {
              el.classList.remove('ring-4', 'ring-accent', 'bg-[#FF9500]/10', 'animate-cited-glow');
            }, 1800);
          }
    }

    if (highlightedTodo.id) {
      const todoEl = document.getElementById(`todo-${highlightedTodo.panel}-${highlightedTodo.id}`);
      if (todoEl) {
        todoEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        todoEl.classList.add('ring-4', 'ring-accent', 'bg-[#FF9500]/10', 'animate-cited-glow');
                setTimeout(() => {
          todoEl.classList.remove('ring-4', 'ring-accent', 'bg-[#FF9500]/10', 'animate-cited-glow');
                }, 1800);
              }
            }
  }, [highlightedMsgIdx, highlightedNotes, highlightedWrite, highlightedTodo]);

  // Scroll active search result into view
  useEffect(() => {
    if (activeResultIdx >= 0 && resultRefs.current[activeResultIdx]) {
      resultRefs.current[activeResultIdx].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }
  }, [activeResultIdx]);

  // Reset active result index when search modal opens
  useEffect(() => {
    if (showSearchModal) {
      console.log('Search modal opened, resetting activeResultIdx to 0');
      setActiveResultIdx(0);
      setActiveMatchIdx(0);
    }
  }, [showSearchModal]);

  // Scroll active search result into view
  useEffect(() => {
    if (showSearchModal && resultRefs.current[activeResultIdx]) {
      resultRefs.current[activeResultIdx].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeResultIdx, showSearchModal]);

  // Send to Write handler
  const handleSendToWrite = (msg) => {
    setWriteContent(msg.content);
    setWriteOpen(true);
  };

  // Save version on notes change
  useEffect(() => {
    if (notes !== '' && (notesHistory.length === 0 || notes !== notesHistory[notesHistory.length - 1].content)) {
      setNotesHistory((prev) => [...prev, { content: notes, timestamp: new Date().toLocaleString() }]);
    }
    // eslint-disable-next-line
  }, [notes]);

  // Save version on writeContent change
  useEffect(() => {
    if (writeContent !== '' && (writeHistory.length === 0 || writeContent !== writeHistory[writeHistory.length - 1].content)) {
      setWriteHistory((prev) => [...prev, { content: writeContent, timestamp: new Date().toLocaleString() }]);
    }
    // eslint-disable-next-line
  }, [writeContent]);

  // Handle image/file drop for ReactQuill editors
  const handleQuillDrop = (editorSetter) => (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          editorSetter((prev) => prev + `\n<img src="${ev.target.result}" alt="dropped image" style="max-width:100%;border-radius:8px;margin:8px 0;" />\n`);
        };
        reader.readAsDataURL(file);
      } else {
        editorSetter((prev) => prev + `\n<a href="#" style="color:var(--accent-color);text-decoration:underline;">${file.name}</a>\n`);
      }
    });
  };

  // Simple fuzzy match (Levenshtein distance, returns true if close match)

  // Placeholder for semantic search API
  async function fetchSemanticResults(query) {
    // TODO: Replace with real API call to OpenAI/embeddings
    // Return: [{ type, location, snippet, onClick }]
    return new Promise(resolve => setTimeout(() => resolve([]), 1200));
  }


  // Keyboard navigation for search modal
  useEffect(() => {
    if (!showSearchModal) return;

    const handleKeyDown = (e) => {
      console.log('Key pressed:', e.key, 'Search results length:', searchResults.length);
      
      if (searchResults.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          console.log('ArrowDown pressed, current activeResultIdx:', activeResultIdx);
          setActiveResultIdx(prev => {
            const newIdx = Math.min(prev + 1, searchResults.length - 1);
            console.log('Setting activeResultIdx to:', newIdx);
            return newIdx;
          });
          setActiveMatchIdx(0);
          break;
        case 'ArrowUp':
          e.preventDefault();
          console.log('ArrowUp pressed, current activeResultIdx:', activeResultIdx);
          setActiveResultIdx(prev => {
            const newIdx = Math.max(prev - 1, 0);
            console.log('Setting activeResultIdx to:', newIdx);
            return newIdx;
          });
          setActiveMatchIdx(0);
          break;
        case 'ArrowRight': {
          const currentResult = searchResults[activeResultIdx];
          if (currentResult && currentResult.matchIndices && currentResult.matchIndices.length > 1) {
            e.preventDefault();
            setActiveMatchIdx(prev => (prev + 1) % currentResult.matchIndices.length);
          }
          break;
        }
        case 'ArrowLeft': {
          const currentResult = searchResults[activeResultIdx];
          if (currentResult && currentResult.matchIndices && currentResult.matchIndices.length > 1) {
            e.preventDefault();
            setActiveMatchIdx(prev => (prev - 1 + currentResult.matchIndices.length) % currentResult.matchIndices.length);
          }
          break;
        }
        case 'Enter':
          e.preventDefault();
          if (searchResults[activeResultIdx]) {
            searchResults[activeResultIdx].onClick();
            setShowSearchModal(false);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setShowSearchModal(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearchModal, searchResults, activeResultIdx]);



  // Scroll active search result into view
  useEffect(() => {
    if (showSearchModal && resultRefs.current[activeResultIdx]) {
      resultRefs.current[activeResultIdx].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeResultIdx, showSearchModal]);

  // Helper to highlight query in a string
  function highlightQuery(text, query, matchIndices = [], activeIdx = 0) {
    if (!query) return text;
    
    // If no match indices provided, fallback to simple highlight
    if (matchIndices.length === 0) {
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const parts = text.split(regex);
      return parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} className="bg-accent/10 text-accent px-0.5 rounded-sm">{part}</mark>
          : part
      );
    }
    
    // Highlight all matches, emphasize active one
    const parts = [];
    let lastIdx = 0;
    matchIndices.forEach((idx, i) => {
      if (idx > lastIdx) parts.push(text.slice(lastIdx, idx));
      const matchText = text.slice(idx, idx + query.length);
      const isActive = i === activeIdx;
      parts.push(
        <mark
          key={idx}
          className={`px-0.5 rounded-sm transition-all duration-200 ${
            isActive 
              ? "ring-2 ring-accent bg-accent/30 font-semibold" 
              : "bg-accent/10"
          } text-accent`}
          id={isActive ? "active-search-match" : undefined}
        >
          {matchText}
        </mark>
      );
      lastIdx = idx + query.length;
    });
    if (lastIdx < text.length) parts.push(text.slice(lastIdx));
    return parts;
  }

  const togglePanelLayout = () => {
    const layouts = ['right', 'split', 'left', 'notes-left-write-right'];
    const currentIndex = layouts.indexOf(panelLayout);
    const nextIndex = (currentIndex + 1) % layouts.length;
    setPanelLayout(layouts[nextIndex]);
  };

  const applyPreset = (presetKey) => {
    const { presets } = require('../ThemePresets');
    const preset = presets[presetKey];
    
    if (preset) {
      // Apply theme settings
      setAccentColor(preset.theme.accentColor);
      localStorage.setItem('eden-accent-color', preset.theme.accentColor);
      
      // Apply dark mode
      // Note: Dark mode is now managed by theme context
      
      // Apply layout settings
      setPanelLayout(preset.theme.panelLayout);
      setNotesCollapsed(preset.theme.notesCollapsed);
      setWriteCollapsed(preset.theme.writeCollapsed);
      setNotesWidth(preset.theme.notesWidth);
      setWriteWidth(preset.theme.writeWidth);
      

      
      // Set current preset
      setCurrentPreset(presetKey);
      localStorage.setItem('eden-current-preset', presetKey);
      
      // Show success message with visual feedback
      console.log(`Applied ${preset.name} preset`);
      
      // Add visual feedback - briefly highlight the preset button
      const presetButton = document.querySelector(`[data-preset="${presetKey}"]`);
      if (presetButton) {
        presetButton.classList.add('ring-4', 'ring-accent', 'animate-pulse');
        setTimeout(() => {
          presetButton.classList.remove('ring-4', 'ring-accent', 'animate-pulse');
        }, 2000);
      }
    }
  };

  const getCurrentTheme = () => {
    return {
      accentColor,
      background: darkMode ? 'dark' : 'light',
      panelLayout,
      notesCollapsed,
      writeCollapsed,
      notesWidth,
      writeWidth
    };
  };

  const getCurrentPresetName = () => {
    if (!currentPreset) return null;
    const { presets } = require('../ThemePresets');
    return presets[currentPreset]?.name || null;
  };

  const renderWritePanel = () => {
    if (!writeOpen) return null;
    const writeIsLeft = panelLayout === 'left';

  return (
        <div
          id="writing-panel-link-target"
          className={`h-full flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-100/50 dark:border-gray-800/50 shadow-2xl relative transition-all duration-500 ease-out`}
          style={{ width: writeCollapsed ? 56 : writeWidth }}
        >
          {/* Drag handle */}
          {!writeCollapsed && (
            <div
              ref={writeDragHandleRef}
              onMouseDown={startWriteDrag}
              className={`absolute top-0 h-full w-1 cursor-ew-resize z-50 group ${writeIsLeft ? 'right-0' : 'left-0'}`}
            >
              <div className="w-full h-full bg-transparent group-hover:bg-gradient-to-y group-hover:from-[#007AFF] group-hover:to-[#5AC8FA] transition-all duration-300 group-hover:w-1.5" />
              </div>
          )}
          
          {/* Elegant Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/60 dark:border-gray-800/60 bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm">
            {!writeCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Write Panel</span>
                {/* Layout Toggle Button */}
                <button
                  onClick={togglePanelLayout}
                  className="ml-3 px-3 py-1.5 text-xs bg-gradient-to-r from-slate-100/80 to-slate-200/80 dark:from-slate-700/80 dark:to-slate-600/80 hover:from-slate-200/80 hover:to-slate-300/80 dark:hover:from-slate-600/80 dark:hover:from-slate-500/80 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all duration-200 hover:scale-105 border border-slate-200/60 dark:border-slate-600/60"
                  title={`Current: ${panelLayout} - Click to cycle layouts`}
                >
                  Layout: {panelLayout === 'right' ? 'Right' : panelLayout === 'split' ? 'Split' : panelLayout === 'left' ? 'Left' : 'Notes-Left'}
                </button>
              </div>
            )}
            <div className="flex items-center gap-1">
              <button
                className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
                onClick={() => setWriteCollapsed(!writeCollapsed)}
                title={writeCollapsed ? 'Expand' : 'Collapse'}
              >
                {writeIsLeft ? <PanelRightClose size={16} /> : <PanelLeftClose size={16} />}
              </button>
              {!writeCollapsed && (
                <>
                  <button
                    className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
                    onClick={() => setShowWriteHistory(true)}
                    title="View version history"
                  > <Clock size={16} /> </button>
                  <button
                    className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
                    onClick={() => handleCopyPanelLink('writing')}
                    title="Copy Writing Link"
                  > <Clipboard size={16} /> </button>
                  <button
                    className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
                    onClick={() => setShowTodos(prev => ({ ...prev, write: !prev.write }))}
                    title="Toggle To-Do List"
                  > <CheckSquare size={16} /> </button>
                  <button
                    className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
                    onClick={() => openExportModal('write')}
                    title="Export Content"
                  > <Download size={16} /> </button>
                    <button
                    className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-[#FF3B30]/10 dark:hover:bg-[#FF3B30]/20 hover:text-[#FF3B30] dark:hover:text-[#FF6961] transition-all duration-200 hover:scale-105"
                    onClick={() => setWriteContent('')}
                    title="Clear Writing"
                  > <Trash2 size={16} /> </button>
                  <button
                    className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
                    onClick={handleFormatClick}
                      title="Request a writing format"
                    >
                      {writeFormat ? `Format: ${writeFormat}` : 'Format'}
                    </button>
                </>
              )}
              <button 
                onClick={() => setWriteOpen(false)} 
                className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-[#FF3B30]/10 dark:hover:bg-[#FF3B30]/20 hover:text-[#FF3B30] dark:hover:text-[#FF6961] transition-all duration-200 hover:scale-105"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          {!writeCollapsed && (
              <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm"
                onDragOver={e => e.preventDefault()}
                onDrop={handleQuillDrop(setWriteContent)}
              >
              {/* Enhanced Writing Editor with AI Features */}
              <div className="flex-1 flex flex-col">


                {/* Enhanced Rich Text Editor */}
                <div className="flex-1 relative">
                  <div 
                    onContextMenu={(e) => handleEditorRightClick(e, 'write')}
                    className="h-full"
              >
              <ReactQuill
                theme="snow"
                value={writeContent}
                onChange={setWriteContent}
                      className="flex-1 bg-transparent apple-writing-editor h-full"
                style={{ border: 'none' }}
                      placeholder="Start writing your document here..."
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'color': [] }, { 'background': [] }],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          [{ 'indent': '-1'}, { 'indent': '+1' }],
                          [{ 'align': [] }],
                          ['link', 'image', 'code-block', 'blockquote'],
                          [{ 'script': 'sub'}, { 'script': 'super' }],
                          [{ 'direction': 'rtl' }],
                          ['clean']
                        ]
                      }}
                      formats={[
                        'header', 'bold', 'italic', 'underline', 'strike',
                        'color', 'background', 'list', 'bullet', 'indent',
                        'align', 'link', 'image', 'code-block', 'blockquote',
                        'script', 'direction'
                      ]}
                    />
              </div>
              
                  {/* Floating Action Menu */}
                  <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                    <button
                      onClick={() => handleQuickAction('write', 'cite')}
                      className="relative w-12 h-12 bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center group overflow-hidden"
                      title="Cite to Chat"
                    >
                      {/* Dynamic hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <MessageSquare size={20} />
                    </button>
                                  <button
                      onClick={() => handleQuickAction('write', 'export')}
                      className="relative w-12 h-12 bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center group overflow-hidden"
                      title="Export Writing"
                    >
                      {/* Dynamic hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Download size={20} />
                                  </button>
                                  <button
                      onClick={() => handleQuickAction('write', 'share')}
                      className="relative w-12 h-12 bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center group overflow-hidden"
                      title="Share Document"
                    >
                      {/* Dynamic hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Send size={20} />
                                  </button>
                                </div>
                        </div>
                </div>
            </div>
          )}
        </div>
    );
  };

  const renderNotesPanel = () => {
    if (!notesOpen) return null;
    const notesIsLeft = panelLayout === 'left' || panelLayout === 'split';

    return (
      <div
        id="notes-panel-link-target"
        className={`h-full flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-100/50 dark:border-gray-800/50 shadow-2xl relative transition-all duration-500 ease-out`}
        style={{ width: notesCollapsed ? 56 : notesWidth }}
      >
        {/* Drag handle */}
        {!notesCollapsed && (
          <div
            ref={notesDragHandleRef}
            onMouseDown={startDrag}
            className={`absolute top-0 h-full w-1 cursor-ew-resize z-40 group ${notesIsLeft ? 'right-0' : 'left-0'}`}
          >
             <div className="w-full h-full bg-transparent group-hover:bg-gradient-to-y group-hover:from-[#30D158] group-hover:to-[#007AFF] transition-all duration-300 group-hover:w-1.5" />
          </div>
        )}
        
        {/* Elegant Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/60 dark:border-gray-800/60 bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm">
          {!notesCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes Panel</span>
              {/* Layout Toggle Button */}
              <button
                onClick={togglePanelLayout}
                className="ml-3 px-3 py-1.5 text-xs bg-gradient-to-r from-slate-100/80 to-slate-200/80 dark:from-slate-700/80 dark:to-slate-600/80 hover:from-slate-200/80 hover:to-slate-300/80 dark:hover:from-slate-600/80 dark:hover:from-slate-500/80 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all duration-200 hover:scale-105 border border-slate-200/60 dark:border-slate-600/60"
                title={`Current: ${panelLayout} - Click to cycle layouts`}
              >
                Layout: {panelLayout === 'right' ? 'Right' : panelLayout === 'split' ? 'Split' : panelLayout === 'left' ? 'Left' : 'Notes-Left'}
              </button>
            </div>
          )}
          <div className="flex items-center gap-1">
            <button
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
              onClick={() => setNotesCollapsed(!notesCollapsed)}
              title={notesCollapsed ? 'Expand' : 'Collapse'}
            >
              {notesIsLeft ? <PanelRightClose size={16} /> : <PanelLeftClose size={16} />}
            </button>
            {!notesCollapsed && (
              <>
                <button
                  className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
                  onClick={() => setShowNotesHistory(true)}
                  title="View version history"
                > <Clock size={16} /> </button>
                <button
                  className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
                  onClick={() => handleCopyPanelLink('note')}
                  title="Copy Notes Link"
                > <Clipboard size={16} /> </button>
                <button
                  className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
                  onClick={() => setShowTodos(prev => ({ ...prev, notes: !prev.notes }))}
                  title="Toggle To-Do List"
                > <CheckSquare size={16} /> </button>
                <button
                  className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
                  onClick={() => openExportModal('notes')}
                  title="Export Content"
                > <Download size={16} /> </button>
                <button
                  className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-[#FF3B30]/10 dark:hover:bg-[#FF3B30]/20 hover:text-[#FF3B30] dark:hover:text-[#FF6961] transition-all duration-200 hover:scale-105"
                  onClick={() => setNotes('')}
                  title="Clear Notes"
                > <Trash2 size={16} /> </button>
              </>
            )}
            <button 
              onClick={() => setNotesOpen(false)} 
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-[#FF3B30]/10 dark:hover:bg-[#FF3B30]/20 hover:text-[#FF3B30] dark:hover:text-[#FF6961] transition-all duration-200 hover:scale-105"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        {!notesCollapsed && (
          <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm"
            onDragOver={e => e.preventDefault()}
            onDrop={handleQuillDrop(setNotes)}
          >
            {/* Enhanced Notes Editor with AI Features */}
            <div className="flex-1 flex flex-col">


              {/* Enhanced Rich Text Editor */}
              <div className="flex-1 relative">
                <div 
                  onContextMenu={(e) => handleEditorRightClick(e, 'notes')}
                  className="h-full"
          >
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
            
                {/* Floating Action Menu */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                  <button
                    onClick={() => handleQuickAction('notes', 'cite')}
                    className="w-12 h-12 bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center"
                    title="Cite to Chat"
                  >
                    <MessageSquare size={20} />
                  </button>
                                <button
                    onClick={() => handleQuickAction('notes', 'export')}
                    className="w-12 h-12 bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center"
                    title="Export Notes"
                  >
                    <Download size={20} />
                                </button>
                                <button
                    onClick={() => handleQuickAction('notes', 'share')}
                    className="w-12 h-12 bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center"
                    title="Share Notes"
                  >
                    <Send size={20} />
                                </button>
              </div>
            </div>
              </div>
        {/* Cited Notes List */}
        {!notesCollapsed && citedNotes.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
            <div className="font-semibold text-xs text-gray-500 mb-2">Cited Outputs</div>
            <ul className="space-y-2">
              {citedNotes.map((note, i) => (
                <li key={i}>
                  <button
                    className="text-left text-xs text-accent hover:underline focus:outline-none"
                    onClick={() => handleCitedNoteClick(note.messageIdx)}
                  >
                    {note.text.length > 60 ? note.text.slice(0, 60) + '...' : note.text}
                  </button>
                </li>
              ))}
            </ul>
              </div>
            )}
      </div>
        )}
      </div>
    );
  };

  if (embedded) {
    return (
      <div className="flex flex-col h-full w-full bg-white dark:bg-black">
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
          <div className="w-full max-w-4xl mx-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex my-6 ${msg.role === 'user' ? 'justify-end' : 'justify-center'}`}
              >
                <div className="flex flex-col max-w-2xl group">
                  <div className={`relative px-4 py-3 rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg group message-bubble ${
                    msg.role === 'user'
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-[#007AFF]/20/50' 
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-[#007AFF]/20/50'
                  }`}>
                    {/* Avatar/Icon */}
                    <div className="absolute -left-10 top-2">
                      {msg.role === 'user' ? (
                        <div className="w-6 h-6 bg-gradient-to-br from-[#007AFF] to-[#5AC8FA] rounded-full p-1 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-gradient-to-br from-[#007AFF] to-[#5AC8FA] rounded-full p-1 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    {/* Content with selection styling */}
                    <div className="relative z-10">
                      <div className={`whitespace-pre-line text-base font-mono ${msg.role === 'ai' ? 'ai-response-text' : ''}`}>{msg.content}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Auto-scroll anchor for embedded version */}
            <div ref={messagesEndRef} />
          </div>
        </div>
        {/* Input Bar */}
          <form
          className="w-full max-w-2xl mx-auto flex items-center gap-2 px-4 pb-4 pt-2 relative"
            onSubmit={e => {
              e.preventDefault();
              if (!prompt.trim()) return;
              setMessages(prev => [...prev, { role: 'user', content: prompt }]);
              setPrompt("");
              setTimeout(() => {
                setMessages(prev => [...prev, { role: 'ai', content: 'I understand your request. Let me help you with that.' }]);
              }, 1000);
            }}
          >
          <div className="flex-1 relative">
              <input
                type="text"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  // Handle arrow key (up arrow) to submit like Enter
                  if (e.key === 'ArrowUp' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    if (prompt.trim()) {
                      e.target.form?.requestSubmit();
                    }
                  }
                  // Handle return/enter key
                  if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    if (prompt.trim()) {
                      e.target.form?.requestSubmit();
                    }
                  }
                }}
                placeholder="Ask Eden..."
              className="w-full px-3 py-2 border border-[#10b981] dark:border-[#10b981] rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:border-[#10b981] text-sm transition-all duration-200"
            />
            
            {/* Smart Prompt Suggestor */}
            <SmartPromptSuggestor
              prompt={prompt}
              onSuggestionSelect={handlePromptSuggestionSelect}
              onClose={handlePromptSuggestorClose}
              visible={showPromptSuggestor}
            />
          </div>
            <button
              type="submit"
            className="relative px-4 py-2 bg-white dark:bg-gray-800 border border-[#007AFF] text-[#007AFF] rounded-lg hover:bg-[#007AFF] hover:text-white transition-all duration-300 flex items-center gap-1 shadow-lg shadow-[#007AFF]/25 hover:shadow-xl hover:shadow-[#007AFF]/30 transform hover:scale-105 group overflow-hidden"
              disabled={!prompt.trim()}
            >
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
            {/* Content with relative positioning */}
            <div className="relative z-10 flex items-center gap-1">
              <ArrowRight size={18} className="transition-all duration-300 group-hover:-translate-y-2 group-hover:-rotate-90" style={{ color: '#4285F4' }} />
            </div>
            </button>
          </form>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-full bg-white dark:bg-black">
      {panelLayout === 'left' && (
        <>
          {renderNotesPanel()}
          {renderWritePanel()}
        </>
      )}
      {panelLayout === 'split' && renderNotesPanel()}
      {panelLayout === 'notes-left-write-right' && (
        <>
          {renderNotesPanel()}
          {renderWritePanel()}
        </>
      )}
      <div className="flex flex-col flex-1 h-full p-6 min-w-0 bg-white dark:bg-black">
        <div className="flex-1 min-h-[200px] max-h-[calc(100vh-220px)] overflow-y-auto px-6 flex flex-col bg-white dark:bg-black">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500">
              {/* Elegant Icon with Subtle Glow */}
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl flex items-center justify-center border border-gray-200/50 dark:border-gray-700/50">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400 dark:text-gray-500">
                    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M2 7L12 12M12 22V12M22 7L12 12M17 4.5L7 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              {/* Refined Typography with Better Hierarchy */}
              <h2 className="text-3xl font-light text-gray-700 dark:text-gray-300 mb-4 tracking-tight">
                Welcome to Eden
              </h2>
              <p className="mt-2 max-w-md text-base leading-relaxed text-gray-500 dark:text-gray-400 font-light">
                Your intelligent reasoning partner for high-stakes work. Start a conversation below to begin.
              </p>
              
              {/* Enhanced Coding Mode Indicator */}
              {selectedMode === "Coding" && (
                <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200/50 dark:border-red-800/50 rounded-2xl max-w-md backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg">
                      <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-red-600 text-sm font-bold">C</div>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-red-800 dark:text-red-200 text-lg">Coding Mode Active</h3>
                      <p className="text-sm text-red-600 dark:text-red-300 leading-relaxed">
                        Coding mode is active. Ask coding questions or use the available tools.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full max-w-4xl mx-auto space-y-8">
              {/* Enhanced Coding Mode Banner */}
              {selectedMode === "Coding" && (
                <div className="flex justify-center mb-8">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl shadow-lg border border-red-400/20">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <span className="text-sm font-medium">Coding Mode Active</span>
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
              
              {messages.map((msg, idx) => {
                if (msg.loading) {
                  return (
                    <div key="skeleton" className="flex justify-center my-8">
                      <div className="flex flex-col w-full max-w-2xl">
                        <div className="relative px-6 py-4 rounded-2xl shadow-sm bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                          {msg.isHierarchicalSummarizer ? (
                            <div className="flex items-center justify-center space-x-3 py-6">
                              <div className="flex space-x-2">
                                <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce shadow-lg"></div>
                                <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2.5 h-2.5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400 ml-4 font-medium">
                                Summarization in progress...
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-4 animate-pulse">
                              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-5/6"></div>
                              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-full"></div>
                              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-4/6"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={idx}
                    ref={msg.role === 'ai' ? (el => messageRefs.current[idx] = el) : null}
                    className={`flex my-8 ${msg.role === 'user' ? 'justify-end' : 'justify-center'} animate-fade-in`}
                    data-msg-idx={msg.role === 'ai' ? idx : undefined}
                  >
                    {/* Enhanced Message Container */}
                    <div className={`flex flex-col max-w-4xl group transition-all duration-300 hover:scale-[1.01]`}>
                        <div 
                            className={`relative px-6 py-5 rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg group message-bubble ${
                                msg.role === 'user' 
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-[#007AFF]/20/50' 
                                    : 'bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-200 border border-[#10b981]/50 dark:border-gray-700/50 shadow-apple backdrop-blur-sm'
                            } ${citedMessageIndices.includes(idx) ? 'ring-2 ring-[#10b981] animate-cited-glow' : ''}`}
                        >
                            {/* AI Message Icons (top-right) */}
                            {msg.role === 'ai' && (
                              <>
                                {citedMessageIndices.includes(idx) && (
                                  <div className="absolute top-2 right-12 text-accent z-10" title="Cited in Notes">
                                      <StickyNote size={14} />
                                  </div>
                                )}
                                    <button
                                      type="button"
                                    className="absolute top-1.5 right-1.5 bg-black/5 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-full p-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200 focus-ring"
                                    onClick={() => handleCopyMsgLink(idx)}
                                    title="Copy Message Link"
                                >
                                    <Clipboard size={14} />
                                    </button>
                              </>
                            )}
                            
                            {/* Content with selection styling */}
                            <div className="relative z-10">
                            {msg.role === 'user' ? (
                                <div className="prose prose-base dark:prose-invert max-w-none">
                                  {editingMessageId === idx ? (
                                    <div className="space-y-3">
                                      <textarea
                                        value={editMessageContent}
                                        onChange={(e) => setEditMessageContent(e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        rows={3}
                                        autoFocus
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          onClick={handleSaveEdit}
                                          className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={handleCancelEdit}
                                          className="px-3 py-1.5 bg-gray-500 text-white text-xs rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="whitespace-pre-line text-base font-mono">{msg.content}</div>
                                  )}
                                </div>
                            ) : (
                                <div className="prose prose-base dark:prose-invert max-w-none ai-response-text">
                                  {highlightedMsgIdx === idx
                                    ? highlightQuery(msg.content, highlightedQuery)
                                    : (
                                        <ReactMarkdown
                                          components={{
                                            // Custom styling for different elements
                                            h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-3 mt-5 first:mt-0 text-gradient-primary" {...props} />,
                                            h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3 mt-4 first:mt-0 text-gradient-primary" {...props} />,
                                            h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2 mt-3 first:mt-0" {...props} />,
                                            p: ({node, ...props}) => <p className="mb-3 last:mb-0 text-base" {...props} />,
                                            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 space-y-2" {...props} />,
                                            ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 space-y-2" {...props} />,
                                            li: ({node, ...props}) => <li className="ml-2 text-base" {...props} />,
                                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#007AFF]/30 dark:border-[#007AFF]/60 pl-4 italic my-3 bg-[#007AFF]/10 dark:bg-[#007AFF]/20 rounded-r-lg text-base" {...props} />,
                                            code: ({node, inline, ...props}) => inline ? 
                                              <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-1 rounded text-base font-mono" {...props} /> :
                                              <code className="block bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-base font-mono overflow-x-auto border border-gray-200 dark:border-gray-600" {...props} />,
                                            pre: ({node, ...props}) => <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-base font-mono overflow-x-auto mb-3 border border-gray-200 dark:border-gray-600" {...props} />,
                                            strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                                            em: ({node, ...props}) => <em className="italic" {...props} />,
                                            a: ({node, ...props}) => <a className="text-[#007AFF] dark:text-[#5AC8FA] underline hover:no-underline transition-colors duration-200" {...props} />,
                                            hr: ({node, ...props}) => <hr className="border-gray-300 dark:border-gray-600 my-4" {...props} />
                                          }}
                                        >
                                          {msg.content}
                                        </ReactMarkdown>
                                    )
                                  }
                                </div>
                              )}
                            </div>
                        </div>

                        {/* AI message footer with actions */}
                        {msg.role === 'ai' && (
                            <div className="mt-3 flex justify-between items-center w-full text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 dark:border-emerald-400/30 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm">
                                    <span className="h-1 w-1 rounded-full bg-emerald-500"/>
                                    Verified by EVES™
                                  </span>
                                  {backlinks[idx] && backlinks[idx].length > 0 && (
                                    <div className="text-accent bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] text-white rounded-full px-4 py-1.5 text-base shadow-sm">
                                      Backlinked from: {backlinks[idx].join(', ')}
                                    </div>
                                  )}
                                </div>

                                {/* Center: Response navigation arrows for Auto Selection mode */}
                                {msg.role === 'ai' && multipleResponses[idx] && selectedMode === "Auto Selection" && (
                                  <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-lg px-2 py-1 border border-gray-200 dark:border-gray-700">
                                      <button
                                        type="button"
                                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                                            onClick={() => {
                                              const models = Object.keys(multipleResponses[idx].allResponses);
                                              const currentModel = selectedResponseModel[idx] || multipleResponses[idx].bestModel;
                                              const currentIndex = models.indexOf(currentModel);
                                              const prevIndex = currentIndex > 0 ? currentIndex - 1 : models.length - 1;
                                              const prevModel = models[prevIndex];
                                              
                                              setSelectedResponseModel(prev => ({
                                                ...prev,
                                                [idx]: prevModel
                                              }));
                                              
                                              setMessages(prev => prev.map((m, i) => 
                                                i === idx 
                                                  ? { ...m, content: multipleResponses[idx].allResponses[prevModel] }
                                                  : m
                                              ));
                                            }}
                                            title="Previous Response"
                                          >
                                            <ChevronLeft size={12} className="text-gray-600 dark:text-gray-400" />
                                      </button>
                                          
                                          <div className="flex items-center gap-1 px-2">
                                            <div className="w-1.5 h-1.5 bg-[#007AFF] rounded-full"></div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                              {selectedResponseModel[idx] || multipleResponses[idx].bestModel}
                                            </span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                              {Object.keys(multipleResponses[idx].allResponses).indexOf(selectedResponseModel[idx] || multipleResponses[idx].bestModel) + 1}/{Object.keys(multipleResponses[idx].allResponses).length}
                                            </span>
                                          </div>
                                          
                                          <button
                                            type="button"
                                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                                            onClick={() => {
                                              const models = Object.keys(multipleResponses[idx].allResponses);
                                              const currentModel = selectedResponseModel[idx] || multipleResponses[idx].bestModel;
                                              const currentIndex = models.indexOf(currentModel);
                                              const nextIndex = (currentIndex + 1) % models.length;
                                              const nextModel = models[nextIndex];
                                              
                                              setSelectedResponseModel(prev => ({
                                                ...prev,
                                                [idx]: nextModel
                                              }));
                                              
                                              setMessages(prev => prev.map((m, i) => 
                                                i === idx 
                                                  ? { ...m, content: multipleResponses[idx].allResponses[nextModel] }
                                                  : m
                                              ));
                                            }}
                                            title="Next Response"
                                          >
                                            <ChevronRight size={12} className="text-gray-600 dark:text-gray-400" />
                                          </button>
                                        </div>
                                )}

                                <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {/* Compare Button */}
                                    {msg.role === 'ai' && multipleResponses[idx] && (
                                    <button
                                      type="button"
                                        className="flex items-center gap-1 px-3 py-1.5 bg-[#007AFF] text-white rounded-lg shadow-sm hover:bg-[#007AFF] transition-all duration-200 text-sm font-medium"
                                          onClick={() => openMultiResponseView(idx)}
                                        title="Compare All Responses"
                                        >
                                        <Sparkles size={12} />
                                        Compare
                                        </button>
                                    )}
                                    {/* Compact Action Menu - Apple-style design */}
                                    <div className="flex items-center gap-1">
                                      {/* Primary Actions - Only show essential ones */}
                                    <button
                                        type="button"
                                        className="group relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                      onClick={() => handleCiteToNotes(msg, idx)}
                                      title="Cite to Notes"
                                    >
                                        <Copy size={16} className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                    </button>
                                    
                                    <button
                                      type="button"
                                        className="group relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                      onClick={() => handleSendToWrite(msg)}
                                      title="Send to Write"
                                    >
                                        <Pencil size={16} className="text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400" />
                                    </button>
                                    
                                      {/* More Actions Menu - Contextual and compact */}
                                    <div className="relative">
                                      <button
                                        type="button"
                                          className="group relative p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                        onClick={() => setOpenActionMenu(openActionMenu === idx ? null : idx)}
                                        title="More Actions"
                                      >
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200">
                                          <circle cx="12" cy="12" r="1" fill="currentColor"/>
                                          <circle cx="19" cy="12" r="1" fill="currentColor"/>
                                          <circle cx="5" cy="12" r="1" fill="currentColor"/>
                                        </svg>
                                      </button>
                                      
                                        {/* Dropdown Menu */}
                                      {openActionMenu === idx && (
                                          <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 py-1">
                                          <button
                                            onClick={() => setNotesOpen(true)}
                                              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                                          >
                                              <StickyNote size={14} />
                                              Notes
                                          </button>
                                          <button
                                            onClick={() => handleCopyToClipboard(msg.content)}
                                              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                                          >
                                              <Clipboard size={14} />
                                              Copy
                                          </button>
                                          <button
                                            onClick={() => handleDownloadResponse(msg.content)}
                                              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                                          >
                                              <Download size={14} />
                                              Download
                                          </button>
                                        </div>
                                      )}
                                      </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* User Message Edit Button (bottom right) */}
                        {msg.role === 'user' && editingMessageId !== idx && (
                          <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={() => handleEditMessage(idx, msg.content)}
                              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                              title="Edit message"
                            >
                              <Pencil size={14} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
                            </button>
                          </div>
                        )}
              </div>
            </div>
          );
              })}
              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
      </div>
          )}
          {/* Floating Cite Selection Button */}
          {selection.text && selection.messageIdx !== null && selection.rect && (
            <button
              style={{
                position: 'fixed',
                top: selection.rect.top - 40,
                left: selection.rect.left + (selection.rect.width / 2) - 60,
                zIndex: 50
              }}
              className="bg-gray-900 dark:bg-gray-50 text-white dark:text-black px-3 py-1 rounded-lg shadow-lg text-xs flex items-center gap-2 animate-fade-in"
              onClick={handleCiteSelectionToNotes}
            >
              <Copy size={14} /> Cite to Notes
            </button>
          )}

          {/* AI Writing Assistant Modal */}
          {contextMenu.show && (
            <div
              style={{
                position: 'fixed',
                top: contextMenu.y,
                left: contextMenu.x,
                zIndex: 1000
              }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-2xl p-6 min-w-[320px] max-w-[400px]"
            >
              {/* AI Writing Assistant Section */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                     onClick={() => handleContextMenuAction('ai-assistant', contextMenu.target)}>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">AI Writing Assistant</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Get writing help and suggestions</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                     onClick={() => handleContextMenuAction('improve-text', contextMenu.target)}>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Improve Text</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Enhance clarity and flow</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                     onClick={() => handleContextMenuAction('rewrite-selection', contextMenu.target)}>
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Rewrite Selection</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Alternative phrasing options</div>
                  </div>
                </div>

              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-600 mb-4"></div>

              {/* Quick Actions Section */}
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Quick Actions</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleContextMenuAction('cite-sources', contextMenu.target)}
                    className="flex-1 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cite Sources
                  </button>
                  <button
                    onClick={() => handleContextMenuAction('check-grammar', contextMenu.target)}
                    className="flex-1 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Check Grammar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4">
          


          <form 
            onSubmit={handleSubmit} 
            className={`w-full ${fullscreen ? 'max-w-6xl' : 'max-w-3xl'} mx-auto card-modern glass rounded-2xl border border-gray-200 dark:border-gray-700 shadow-apple p-3 transition-all duration-300`}
          >
            {/* Main input row */}
            <div className={`flex items-center gap-3 transition-all duration-200 ${fullscreen ? 'min-h-[200px]' : ''}`}>
              <div className="relative flex-1 flex flex-col">
                

                {/* Smart Prompt Suggestor */}
                <SmartPromptSuggestor
                  prompt={prompt}
                  onSuggestionSelect={handlePromptSuggestionSelect}
                  onClose={handlePromptSuggestorClose}
                  visible={showPromptSuggestor}
                />

                <div className="relative">
                <textarea
                  ref={textareaRef}
            value={prompt}
                  onInput={handleInput}
                    onFocus={() => {
                      if (prompt.length >= 3) {
                        setShowPromptSuggestor(true);
                      }
                    }}
                  onKeyDown={(e) => {
                    // Handle arrow key (up arrow) to submit like Enter
                    if (e.key === 'ArrowUp' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                      e.preventDefault();
                      if (prompt.trim()) {
                        handleSubmit(e);
                      }
                    }
                    // Handle return/enter key
                    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                      e.preventDefault();
                      if (prompt.trim()) {
                        handleSubmit(e);
                      }
                    }
                  }}
                  className={`w-full input-modern ${fullscreen ? 'min-h-[200px] max-h-[400px]' : 'min-h-[24px] max-h-[160px]'} resize-none bg-transparent text-gray-900 dark:text-white px-4 py-2 text-base font-mono focus:outline-none transition-all duration-200 border border-blue-500 dark:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500`}
                    placeholder="Ask Eden... (⌘Enter to send, ⌘/ for suggestions)"
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
                {/* Scroll Toggle - only show when there's too much text */}
                {showScrollToggle && !fullscreen && (
                  <button
                    type="button"
                    className="absolute top-1 right-10 z-10 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-gray-700 dark:text-gray-300 transition-all duration-150 focus-ring"
                    aria-label="Toggle scroll"
                    onClick={() => {
                      if (textareaRef.current) {
                        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
                      }
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
                
                {(isMultiline || fullscreen) && (
                  <button
                    type="button"
                    className="absolute top-1 right-1 z-10 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-gray-700 dark:text-gray-300 transition-all duration-150 focus-ring"
                    aria-label={fullscreen ? "Collapse" : "Fullscreen"}
                    onClick={() => setFullscreen(f => !f)}
                  >
                    {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
                )}
        </div>
              <button 
                type="submit" 
                className="relative p-2 rounded-full shadow-lg shadow-[#007AFF]/25 hover:shadow-xl hover:shadow-[#007AFF]/30 flex items-center justify-center h-10 w-10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-white dark:bg-gray-800 border border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF] hover:text-white transform hover:scale-105 group overflow-hidden"
                disabled={!prompt.trim()}
              >
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-full"></div>
                {/* Content with relative positioning */}
                <div className="relative z-10">
                  {isProcessing ? (
                    <div className="apple-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <ArrowRight size={18} className="transition-all duration-300 group-hover:-translate-y-2 group-hover:-rotate-90" style={{ color: '#4285F4' }}/>
                  )}
                </div>
              </button>
            </div>
            
            {/* Enhanced Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3 p-3 mt-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl animate-fade-in">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] rounded-full animate-blink" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-[#0277BD] to-[#10b981] rounded-full animate-blink" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-[#7B1FA2] to-[#4527A0] rounded-full animate-blink" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Eden is thinking...</span>
                <div className="flex items-center gap-1 ml-auto">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Using {selectedMode || 'GPT-4'}</span>
                  <div className="w-2 h-2 bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
            {/* Pills row - Streamlined */}
            <div className="w-full flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
              {/* Smart Suggestions Hint */}
              {prompt.length >= 3 && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Lightbulb size={12} className="text-blue-500" />
                  <span>Smart suggestions available</span>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">⌘/</kbd>
                  <span>to show</span>
                </div>
              )}
              
              {/* Mode Selector - Essential Only */}
          <div className="relative">
            <button
              type="button"
                  className={`flex items-center gap-2 text-sm transition px-3 py-1.5 rounded-xl ${
                    selectedMode === "Coding" 
                      ? 'text-white bg-gradient-to-r from-[#FF5722] to-[#FF9800] shadow-sm' 
                      : isHierarchicalSummarizerMode(selectedMode)
                      ? 'text-white bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent-foreground hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              onClick={() => setModeMenuOpen((open) => !open)}
            >
                  {selectedMode === "Coding" ? <div className="w-3.5 h-3.5 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">C</div> : <Sliders size={14} />}
                  <span className="text-xs font-medium">{selectedMode}</span>
                  {isHierarchicalSummarizerMode(selectedMode) && (
                    <div className="w-2 h-2 bg-white rounded-full shadow-sm" title="Hierarchical Summarizer Mode" />
                  )}
            </button>
            {modeMenuOpen && (
                  <div className="absolute left-0 bottom-full mb-2 w-64 card-modern glass border border-gray-200 dark:border-gray-700 rounded-xl shadow-apple z-10">
                {modeOptions.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleModeSelect(mode)}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700/50 transition flex items-center justify-between rounded-lg ${
                          selectedMode === mode ? 'font-semibold text-accent bg-accent/10' : 'text-black dark:text-white'
                        }`}
                  >
                    <span>{mode}</span>
                    {isHierarchicalSummarizerMode(mode) && (
                      <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#007AFF] rounded-full shadow-sm" title="Hierarchical Summarizer Mode" />
                            <span className="text-xs text-[#007AFF] dark:text-[#5AC8FA] font-medium">HS</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
              
              {/* File Upload - Only show when file is uploaded */}
              {uploadedFile && (
              <button
                type="button"
            className="flex items-center gap-1.5 text-sm transition px-3 py-1.5 rounded-xl text-white bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] shadow-sm"
            title={`Uploaded: ${uploadedFile.name}`}
          >
            <Upload size={14}/>
                    <span className="text-xs font-medium">
                    {uploadedFile.name.substring(0, 15) + (uploadedFile.name.length > 15 ? '...' : '')}
                    </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                    className="ml-1 text-white/80 hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
          </button>
              )}

              <div className="flex-grow" />

              {/* Essential Actions Only */}
              <button
                type="button"
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl transition ${writeOpen ? 'text-white bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                onClick={() => setWriteOpen((open) => !open)}
              >
                <Pencil size={14} /> <span className="text-xs font-medium">Write</span>
              </button>
              <button
                type="button"
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl transition ${notesOpen && !writeOpen ? 'text-white bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                onClick={() => setNotesOpen((open) => !open)}
              >
                <StickyNote size={14} /> <span className="text-xs font-medium">Notes</span>
              </button>

              {/* Subtle Upload Button - Only when no file is uploaded */}

        </div>
      </form>
        </div>
      </div>
      {panelLayout === 'right' && (
        <>
          {renderNotesPanel()}
          {renderWritePanel()}
        </>
      )}
      {panelLayout === 'split' && renderWritePanel()}
      {panelLayout === 'notes-left-write-right' && (
        <>
          {renderNotesPanel()}
          {renderWritePanel()}
        </>
      )}

      {/* Theme Presets Modal */}
      <ThemePresets
        isOpen={showPresets}
        onClose={() => setShowPresets(false)}
        onApplyPreset={applyPreset}
        currentPreset={currentPreset}
        currentTheme={getCurrentTheme()}
      />



      {/* Version History Modals, correctly placed outside the flex layout */}
      {showNotesHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-lg w-full p-6 relative">
            <button onClick={() => setShowNotesHistory(false)} className="absolute top-3 right-3 text-gray-400 hover:text-accent p-1 rounded-full"><Minimize2 size={18} /></button>
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Notes Version History</h2>
            <div className="max-h-80 overflow-y-auto space-y-4">
              {notesHistory.length === 0 && <div className="text-gray-500 text-sm">No history yet.</div>}
              {notesHistory.map((ver, i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded p-3 flex flex-col gap-2 bg-gray-50 dark:bg-gray-800">
                  <div className="text-xs text-gray-500">{ver.timestamp}</div>
                  <div className="text-sm text-gray-900 dark:text-gray-100 break-words whitespace-pre-line max-h-24 overflow-y-auto">{ver.content}</div>
                  <button
                    className="self-end text-xs px-2 py-1 rounded bg-accent text-accent-foreground font-semibold hover:brightness-90"
                    onClick={() => { setNotes(ver.content); setShowNotesHistory(false); }}
                  >Restore</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {showWriteHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-lg w-full p-6 relative">
            <button onClick={() => setShowWriteHistory(false)} className="absolute top-3 right-3 text-gray-400 hover:text-accent p-1 rounded-full"><Minimize2 size={18} /></button>
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Write Version History</h2>
            <div className="max-h-80 overflow-y-auto space-y-4">
              {writeHistory.length === 0 && <div className="text-gray-500 text-sm">No history yet.</div>}
              {writeHistory.map((ver, i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded p-3 flex flex-col gap-2 bg-gray-50 dark:bg-gray-800">
                  <div className="text-xs text-gray-500">{ver.timestamp}</div>
                  <div className="text-sm text-gray-900 dark:text-gray-100 break-words whitespace-pre-line max-h-24 overflow-y-auto">{ver.content}</div>
                  <button
                    className="self-end text-xs px-2 py-1 rounded bg-accent text-accent-foreground font-semibold hover:brightness-90"
                    onClick={() => { setWriteContent(ver.content); setShowWriteHistory(false); }}
                  >Restore</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full p-6 relative border border-gray-200 dark:border-gray-700">
            <button onClick={() => setShowExportModal(false)} className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full"><X size={18} /></button>
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Export {exportPanel === 'notes' ? 'Notes' : 'Writing'}</h2>
            
            {/* Format Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Format</label>
              <select
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                value={exportFormat}
                onChange={e => setExportFormat(e.target.value)}
              >
                <option value="markdown">Markdown (.md)</option>
                <option value="plaintext">Plain Text (.txt)</option>
                <option value="html">HTML (.html)</option>
                <option value="pdf">PDF (.pdf)</option>
                <option value="docx">Word (.docx)</option>
              </select>
            </div>
            
            {/* Template Selection */}
            {(exportFormat === 'pdf' || exportFormat === 'docx') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Template</label>
                <select
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  value={selectedTemplate}
                  onChange={e => setSelectedTemplate(e.target.value)}
                >
                  {Object.entries(exportTemplates).map(([key, template]) => (
                    <option key={key} value={key}>
                      {template.name} - {template.description}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Export Settings */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Include in Export</label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={exportSettings.includeTodos} 
                    onChange={e => setExportSettings(prev => ({ ...prev, includeTodos: e.target.checked }))}
                    className="rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">To-Do Lists</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={exportSettings.includeMetadata} 
                    onChange={e => setExportSettings(prev => ({ ...prev, includeMetadata: e.target.checked }))}
                    className="rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Metadata (message links, citations)</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={exportSettings.includeImages} 
                    onChange={e => setExportSettings(prev => ({ ...prev, includeImages: e.target.checked }))}
                    className="rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Images</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={exportSettings.includeTimestamp} 
                    onChange={e => setExportSettings(prev => ({ ...prev, includeTimestamp: e.target.checked }))}
                    className="rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Generation Timestamp</span>
                </label>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                className="flex-1 py-2 px-4 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                onClick={() => setShowExportModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2 px-4 rounded border border-accent text-accent font-medium hover:bg-accent/10 transition"
                onClick={generatePreview}
              >
                Preview
              </button>
              <button
                className="flex-1 py-2 px-4 rounded bg-accent text-accent-foreground font-semibold hover:brightness-90 transition"
                onClick={handleExport}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Export Preview Modal */}
      {showExportPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-4xl w-full max-h-[80vh] p-6 relative">
            <button onClick={() => setShowExportPreview(false)} className="absolute top-3 right-3 text-gray-400 hover:text-accent p-1 rounded-full"><Minimize2 size={18} /></button>
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Export Preview</h2>
            <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              {exportFormat === 'html' ? (
                <div 
                  className="prose max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: previewContent }}
                />
              ) : (
                <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100 font-mono">
                  {previewContent}
                </pre>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="py-2 px-4 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                onClick={() => setShowExportPreview(false)}
              >
                Close
              </button>
              <button
                className="py-2 px-4 rounded bg-accent text-accent-foreground font-semibold hover:brightness-90 transition"
                onClick={() => {
                  setShowExportPreview(false);
                  handleExport();
                }}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}





      {/* Theme Customization Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 relative border border-gray-200 dark:border-gray-700">
            <button onClick={() => setShowThemeModal(false)} className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full"><X size={18} /></button>
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Customize Theme</h2>
            
            <div className="space-y-6">
              {/* Dark Mode Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme Mode</label>
                <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <button
                    onClick={() => toggleDarkMode()}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      !darkMode 
                        ? 'bg-white shadow-md text-gray-900' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/50'
                    }`}
                  >
                    <Sun size={16} />
                    <span className="text-sm font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => toggleDarkMode()}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      darkMode 
                        ? 'bg-gray-800 shadow-md text-white' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-800/50'
                    }`}
                  >
                    <Moon size={16} />
                    <span className="text-sm font-medium">Dark</span>
                  </button>
                </div>
              </div>

              {/* Accent Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Accent Color</label>
                <div className="grid grid-cols-6 gap-3">
                  {predefinedAccents.map(color => (
                    <button
                      key={color.name}
                      title={color.name}
                      onClick={() => setAccentColor(color.value)}
                      className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                        accentColor === color.value 
                          ? 'border-accent ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-accent shadow-lg' 
                          : 'border-transparent hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: `hsl(${color.value})` }}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Current: {predefinedAccents.find(c => c.value === accentColor)?.name || 'Custom'}
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Presets</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(require('../ThemePresets').presets).slice(0, 4).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => {
                        applyPreset(key);
                        setShowThemeModal(false);
                      }}
                      className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: `hsl(${preset.theme.accentColor})` }}
                      />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex gap-3">
              <button
                className="flex-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                onClick={() => setShowThemeModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2 px-4 rounded-lg bg-accent text-accent-foreground font-semibold hover:brightness-110 transition"
                onClick={() => setShowThemeModal(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Smart Search Modal */}
      {showSearchModal && (
        <SmartSearchModal
          open={showSearchModal}
          onClose={() => setShowSearchModal(false)}
        />
      )}

      {/* Multi-Response Compare Window */}
      {showMultiResponseView && activeMultiResponseMessage !== null && (
        <div className={`fixed inset-0 z-50 bg-black/20 backdrop-blur-xl flex items-center justify-center transition-all duration-500 ${
          compareWindowExpanded ? 'p-0' : 'p-8'
        }`}>
          <div 
            className={`compare-window relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden transition-all duration-500 ${
              compareWindowExpanded 
                ? 'w-full h-full rounded-none' 
                : 'rounded-3xl min-w-[800px] min-h-[600px] h-[80vh] max-h-[900px]'
            }`}
            style={{
              width: compareWindowExpanded ? '100vw' : '90vw',
              height: compareWindowExpanded ? '100vh' : '80vh',
              maxWidth: compareWindowExpanded ? '100vw' : '1200px',
              maxHeight: compareWindowExpanded ? '100vh' : '900px'
            }}
          >
            {/* Resizable Container */}
            <div className="absolute inset-0">
              {/* Header Bar */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 bg-red-500 rounded-full cursor-pointer hover:bg-red-600 transition-colors"
                    onClick={() => {
                      setShowMultiResponseView(false);
                      setActiveMultiResponseMessage(null);
                      setCompareWindowExpanded(false);
                    }}
                    title="Close compare panel"
                  ></div>
                  <div 
                    className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-200 ${
                      compareWindowExpanded 
                        ? 'bg-green-600 scale-110 shadow-lg' 
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                    onClick={() => {
                      console.log('Green button clicked! Current state:', compareWindowExpanded);
                      setCompareWindowExpanded(!compareWindowExpanded);
                      console.log('New state will be:', !compareWindowExpanded);
                    }}
                    title="Click to toggle fullscreen mode"
                  ></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Compare AI Responses
                  <span className="ml-2 text-xs text-gray-500">
                    {compareWindowExpanded ? '(FULLSCREEN)' : '(NORMAL)'}
                      </span>
                </h3>
                      <button
                  onClick={() => {
                    setShowMultiResponseView(false);
                    setActiveMultiResponseMessage(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-2 grid-rows-2 gap-6 p-6 h-full">
                {Object.entries(multipleResponses[activeMultiResponseMessage].allResponses).map(([modelName, content]) => (
                  <div
                    key={modelName}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedResponseModel(prev => ({
                        ...prev,
                        [activeMultiResponseMessage]: modelName
                      }));
                      setMessages(prev => prev.map((m, i) => 
                        i === activeMultiResponseMessage 
                          ? { ...m, content: multipleResponses[activeMultiResponseMessage].allResponses[modelName] }
                          : m
                      ));
                      setShowMultiResponseView(false);
                      setActiveMultiResponseMessage(null);
                    }}
                  >
                    {/* Chat Bubble */}
                    <div className="relative px-4 py-3 rounded-2xl bg-white text-gray-900 border border-gray-200 shadow-sm overflow-hidden h-48">
                      {/* Model Name Header */}
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                        <span className="text-sm font-semibold text-gray-700">{modelName}</span>
                        {modelName === multipleResponses[activeMultiResponseMessage].bestModel && (
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-500 fill-current" />
                            <span className="text-xs text-yellow-600">Best</span>
                    </div>
                  )}
                </div>
                      
                      {/* Content with scrolling */}
                      <div className="h-full overflow-y-auto prose prose-sm max-w-none pr-2">
                        <div className="whitespace-pre-line text-sm leading-relaxed">
                          {content}
            </div>
          </div>
        </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resize Handles */}
            <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 hover:opacity-100 transition-opacity">
              <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 22H20V20H22V22ZM22 20H20V18H22V20ZM20 22H18V20H20V22ZM18 22H16V20H18V22Z"/>
              </svg>
        </div>
      </div>
        </div>
      )}

      {/* Format Popup Portal */}
      <FormatPopup />

    </div>
  );
} 