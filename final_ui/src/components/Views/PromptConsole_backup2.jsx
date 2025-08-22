import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight, FileText, MessageSquare, Sliders, Maximize2, Minimize2, StickyNote, Copy, Pencil, Clock, Clipboard, CheckSquare, Download, ArrowLeft, ChevronLeft, ChevronRight, User, Cpu, X, Search, Inbox, GripVertical, Settings, ChevronsLeftRight, PanelLeftClose, PanelRightClose, Palette, Code, Sun, Moon, Bot } from 'lucide-react';
import { cardClass } from '../../utils/classNames';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../quill-custom.css'; // Import custom Quill styles
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ThemePresets from '../ThemePresets';
import CodeExecution from '../CodeExecution';
import CodingMode from './CodingMode';

export default function PromptConsole({ setView, embedded = false, researchMode = false }) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    { role: "user", content: "What is Ask Eden?" },
    { role: "ai", content: "I'm Eden — your agentic reasoning partner for high-stakes work. I don't just answer questions; I orchestrate the world's most advanced AI models, route your query to the best one for the task, and then process every response through EVES — the Eden Verification and Encryption System. EVES checks answers for accuracy, consistency, and evidence, eliminating hallucinations at the root. Crucially, it also keeps your data private by applying end-to-end encryption to all your conversations, ensuring they are secure and for your eyes only. What you get isn't just fast — it's trusted, auditable, and private intelligence, designed for professionals who can't afford uncertainty." }
  ]);
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState("Auto Selection");
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
  const [fullscreen, setFullscreen] = useState(false);
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
  const [notesBottomLeftSize, setNotesBottomLeftSize] = useState({ width: 360, height: 320 });
  const notesBottomLeftMin = { width: 220, height: 120 };
  const notesBottomLeftMax = { width: 600, height: 600 };
  const notesResizeHandleRef = useRef();
  const [writeFormat, setWriteFormat] = useState('');
  const [showFormatInput, setShowFormatInput] = useState(false);
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // Search filters
  const [searchFilters, setSearchFilters] = useState({
    user: true,
    ai: true,
    notes: true,
    write: true,
    todos: true,
    // dateFrom: '',
    // dateTo: ''
  });
  // Fuzzy & Semantic toggles
  const [fuzzySearch, setFuzzySearch] = useState(false);
  const [semanticSearch, setSemanticSearch] = useState(false);
  const [semanticLoading, setSemanticLoading] = useState(false);
  
  // Highlight state for search result jumps
  const [highlightedMsgIdx, setHighlightedMsgIdx] = useState(null);
  const [highlightedQuery, setHighlightedQuery] = useState('');
  const [highlightedNotes, setHighlightedNotes] = useState(false);
  const [highlightedWrite, setHighlightedWrite] = useState(false);
  const [highlightedTodo, setHighlightedTodo] = useState({ panel: null, id: null });
  
  // Next/Previous navigation state for multiple matches
  const [activeResultIdx, setActiveResultIdx] = useState(0);
  const [activeMatchIdx, setActiveMatchIdx] = useState(0);
  const resultRefs = useRef([]);
  
  // Theming state
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [accentColor, setAccentColor] = useState('199 78% 60%'); // Default: baby blue
  const [isDarkMode, setIsDarkMode] = useState(false); // Add dark mode state

  // New layout state
  const [panelLayout, setPanelLayout] = useState('right'); // 'right', 'split', 'left'
  const [notesCollapsed, setNotesCollapsed] = useState(false);
  const [writeCollapsed, setWriteCollapsed] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [currentPreset, setCurrentPreset] = useState(null);
  const [showCodeExecution, setShowCodeExecution] = useState(false);
  const [codeExecutionInitial, setCodeExecutionInitial] = useState({ language: 'javascript', code: null });

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

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('eden-dark-mode');
    if (savedDarkMode) {
      setIsDarkMode(savedDarkMode === 'true');
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accentColor);
    localStorage.setItem('eden-accent-color', accentColor);
  }, [accentColor]);

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('eden-dark-mode', isDarkMode.toString());
  }, [isDarkMode]);

  const predefinedAccents = [
    { name: 'Baby Blue', value: '199 78% 60%' },
    { name: 'Crimson Red', value: '0 84% 60%' },
    { name: 'Forest Green', value: '142 76% 36%' },
    { name: 'Royal Purple', value: '262 80% 58%' },
    { name: 'Goldenrod', value: '45 93% 47%' },
    { name: 'Slate Gray', value: '215 14% 34%' }
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
  function getAllMatchIndices(text, query) {
    if (!query) return [];
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const indices = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      indices.push(match.index);
      // Prevent infinite loop for zero-length matches
      if (regex.lastIndex === match.index) regex.lastIndex++;
    }
    return indices;
  }
  
  // Helper to handle link click in notes/writing
  const handleMsgLinkClick = (idx) => {
    if (messageRefs.current[idx]) {
      messageRefs.current[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageRefs.current[idx].classList.add('ring-4', 'ring-accent', 'bg-yellow-100', 'animate-cited-glow');
      setTimeout(() => {
        if (messageRefs.current[idx]) {
          messageRefs.current[idx].classList.remove('ring-4', 'ring-accent', 'bg-yellow-100', 'animate-cited-glow');
        }
      }, 1800);
    }
  };
  // Helper to copy Notes/Writing link
  const handleCopyPanelLink = (panel) => {
    navigator.clipboard.writeText(panel === 'note' ? '[Note]' : '[Writing]');
  };
  // Helper to handle panel link click
  const handlePanelLinkClick = (panel) => {
    if (panel === 'note') {
      const el = document.getElementById('notes-panel-link-target');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-accent', 'bg-yellow-100', 'animate-cited-glow');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-accent', 'bg-yellow-100', 'animate-cited-glow');
        }, 1800);
      }
    } else if (panel === 'writing') {
      const el = document.getElementById('writing-panel-link-target');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-accent', 'bg-yellow-100', 'animate-cited-glow');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-accent', 'bg-yellow-100', 'animate-cited-glow');
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
    let text = `${panelName.toUpperCase()}\n`;
    text += `${'='.repeat(panelName.length)}\n\n`;
    
    if (exportSettings.includeTimestamp) {
      text += `Generated on: ${new Date().toLocaleString()}\n\n`;
    }
    
    // Add content
    if (content.trim()) {
      text += `CONTENT:\n${'-'.repeat(8)}\n${content}\n\n`;
    }
    
    // Add todos if any
    if (exportSettings.includeTodos && todos && todos.length > 0) {
      text += `TO-DO LIST:\n${'-'.repeat(12)}\n`;
      const stats = getTodoStats(todos);
      text += `Progress: ${stats.completed}/${stats.total} completed\n\n`;
      
      todos.forEach(todo => {
        const status = todo.completed ? '[COMPLETED]' : '[PENDING]';
        text += `${status} ${todo.text}\n`;
      });
      text += '\n';
    }
    
    return text;
  };

  const exportToHTML = (content, todos, panelName) => {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${panelName}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
        .content { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .todo-item { margin: 8px 0; padding: 8px; background: #fff; border: 1px solid #ddd; border-radius: 3px; }
        .todo-completed { text-decoration: line-through; color: #888; }
        .progress { font-weight: bold; color: #007acc; }
    </style>
</head>
<body>
    <h1>${panelName}</h1>`;
    
    if (exportSettings.includeTimestamp) {
      html += `
    <div class="meta">Generated on: ${new Date().toLocaleString()}</div>`;
    }
    
    // Add content
    if (content.trim()) {
      html += `
    <h2>Content</h2>
    <div class="content">${content.replace(/\n/g, '<br>')}</div>`;
    }
    
    // Add todos if any
    if (exportSettings.includeTodos && todos && todos.length > 0) {
      const stats = getTodoStats(todos);
      html += `
    <h2>To-Do List</h2>
    <div class="progress">Progress: ${stats.completed}/${stats.total} completed</div>`;
      
      todos.forEach(todo => {
        const completedClass = todo.completed ? ' todo-completed' : '';
        html += `
    <div class="todo-item${completedClass}">
        ${todo.completed ? '✓' : '○'} ${todo.text}
    </div>`;
      });
    }
    
    html += `
</body>
</html>`;
    
    return html;
  };

  const exportToPDF = (content, todos, panelName) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    
    // Get template settings
    const template = exportTemplates[selectedTemplate];
    const { headerColor, fontSize, spacing } = template.pdf;
    
    // Set up colors and fonts
    const primaryColor = headerColor;
    const secondaryColor = [64, 64, 64]; // Dark gray
    const lightGray = [128, 128, 128]; // Light gray
    
    // Page dimensions
    const pageWidth = doc.internal.pageSize.width;
    const margin = 40;
    const contentWidth = pageWidth - (margin * 2);
    
    let y = margin;
    
    // Header with template color
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(panelName, margin, 35);
    
    // Reset text color for content
    doc.setTextColor(...secondaryColor);
    y = 80;
    
    // Timestamp
    if (exportSettings.includeTimestamp) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...lightGray);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, y);
      y += 20;
    }
    
    // Content section
    if (content.trim()) {
      // Section header
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('Content', margin, y);
      y += 25;
      
      // Content text
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...secondaryColor);
      doc.setLineHeightFactor(spacing);
      
      // Process content with better formatting
      const processedContent = content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\n\n/g, '\n') // Clean up double line breaks
        .trim();
      
      const lines = doc.splitTextToSize(processedContent, contentWidth);
      doc.text(lines, margin, y);
      y += lines.length * (fontSize * spacing) + 20;
    }
    
    // To-Do section
    if (exportSettings.includeTodos && todos && todos.length > 0) {
      // Section header
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('To-Do List', margin, y);
      y += 25;
      
      // Progress stats
      const stats = getTodoStats(todos);
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...lightGray);
      doc.text(`Progress: ${stats.completed}/${stats.total} completed`, margin, y);
      y += 20;
      
      // To-do items
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');
      todos.forEach(todo => {
        const checkbox = todo.completed ? '☑' : '☐';
        const textColor = todo.completed ? lightGray : secondaryColor;
        
        doc.setTextColor(...textColor);
        doc.text(`${checkbox} ${todo.text}`, margin + 10, y);
        
        if (todo.completed) {
          // Add strikethrough line
          const textWidth = doc.getTextWidth(`${checkbox} ${todo.text}`);
          doc.setDrawColor(...lightGray);
          doc.line(margin + 10, y - 2, margin + 10 + textWidth, y - 2);
        }
        
        y += fontSize * spacing;
      });
    }
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...lightGray);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 60, doc.internal.pageSize.height - 20);
    }
    
    return doc;
  };

  const exportToDocx = async (content, todos, panelName) => {
    const children = [
      new Paragraph({
        children: [new TextRun({ text: panelName, bold: true, size: 32 })],
      }),
      new Paragraph({ text: `Generated on: ${new Date().toLocaleString()}`, spacing: { after: 200 } }),
    ];
    if (content.trim()) {
      children.push(new Paragraph({ text: 'Content:', bold: true, spacing: { after: 100 } }));
      content.split('\n').forEach(line => {
        children.push(new Paragraph(line));
      });
    }
    if (todos && todos.length > 0) {
      children.push(new Paragraph({ text: 'To-Do List:', bold: true, spacing: { after: 100 } }));
      const stats = getTodoStats(todos);
      children.push(new Paragraph(`Progress: ${stats.completed}/${stats.total} completed`));
      todos.forEach(todo => {
        const status = todo.completed ? '[x]' : '[ ]';
        children.push(new Paragraph(`${status} ${todo.text}`));
      });
    }
    const doc = new Document({
      sections: [{ properties: {}, children }],
    });
    const blob = await Packer.toBlob(doc);
    return blob;
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
      case 'pdf': {
        const doc = exportToPDF(content, todos, panelName);
        filename = `${panelName.toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
        break;
      }
      case 'docx': {
        filename = `${panelName.toLowerCase()}-${new Date().toISOString().split('T')[0]}.docx`;
        const blob = await exportToDocx(content, todos, panelName);
        saveAs(blob, filename);
        break;
      }
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
      case 'pdf':
        preview = `PDF Preview (${panelName})\n\nThis will generate a professionally formatted PDF with:\n• Header with accent color\n• Clean typography and spacing\n• To-do lists with checkboxes\n• Page numbers and footer\n• Professional layout`;
        break;
      case 'docx':
        preview = `Word Document Preview (${panelName})\n\nThis will generate a Microsoft Word document with:\n• Proper headings and structure\n• Formatted content sections\n• Interactive to-do lists\n• Professional styling\n• Compatible with Word, Google Docs, etc.`;
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
  };

  const handleSend = (e) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt) {
      // Add user message and AI loading skeleton
      setMessages(prev => [
        ...prev, 
        { role: "user", content: trimmedPrompt },
        { role: 'ai', content: '', loading: true }
      ]);
      
      // Clear prompt and reset textarea height
    setPrompt("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => {
          // Replace the loading message with the actual response
          const updatedMessages = prev.filter(m => !m.loading);
          
          let responseContent;
          if (selectedMode === "Coding") {
            // Coding-specific responses
            responseContent = `Here's a coding solution for: "${trimmedPrompt}"

\`\`\`javascript
// Example implementation
function solveProblem(input) {
  // Your solution here
  return result;
}

// Usage
const result = solveProblem("example");
console.log(result);
\`\`\`

**Key Points:**
- Consider edge cases
- Optimize for performance
- Add proper error handling
- Include unit tests

Would you like me to explain any part of this solution or help you implement it in the code execution environment?`;
          } else {
            responseContent = `This is a simulated, beautifully-designed AI response to your query: "${trimmedPrompt}".\n\nI can include multiple paragraphs and other formatting to demonstrate how the new UI handles various content structures.`;
          }
          
          return [...updatedMessages, { 
            role: 'ai', 
            content: responseContent
          }];
        });
      }, 2000);
    }
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    setModeMenuOpen(false);
    
    // Special handling for Coding mode - apply coding preset
    if (mode === "Coding") {
      // Apply coding preset instead of manual settings
      applyPreset('coding');
      
      // Show coding mode indicator
      console.log('Coding mode activated - Code execution environment opened');
    } else {
      // For other modes, reset to default theme if no preset is active
      if (!currentPreset) {
        setAccentColor('199 78% 60%'); // Default baby blue
        setIsDarkMode(false);
        setPanelLayout('right');
        setNotesCollapsed(false);
        setWriteCollapsed(false);
        setShowCodeExecution(false);
      }
    }
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
      messageRefs.current[idx].classList.add('ring-4', 'ring-accent', 'bg-yellow-100', 'animate-cited-glow');
      setTimeout(() => {
        if (messageRefs.current[idx]) {
          messageRefs.current[idx].classList.remove('ring-4', 'ring-accent', 'bg-yellow-100', 'animate-cited-glow');
        }
      }, 1800);
    }
  };

  // Helper to determine if prompt is multiline
  const isMultiline = prompt.includes('\n') || (textareaRef.current && textareaRef.current.scrollHeight > 56);

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
      setWriteOpen(true);
    }
  }, [messages]);

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
          editorSetter((prev) => prev + `\n<img src=\"${ev.target.result}\" alt=\"dropped image\" style=\"max-width:100%;border-radius:8px;margin:8px 0;\" />\n`);
        };
        reader.readAsDataURL(file);
      } else {
        editorSetter((prev) => prev + `\n<a href=\"#\" style=\"color:var(--accent-color);text-decoration:underline;\">${file.name}</a>\n`);
      }
    });
  };

  // Simple fuzzy match (Levenshtein distance, returns true if close match)
  function fuzzyMatch(a, b) {
    if (!a || !b) return false;
    a = a.toLowerCase();
    b = b.toLowerCase();
    if (a.includes(b) || b.includes(a)) return true;
    if (b.length < 3) return false;
    // Simple: allow 1 typo for short, 2 for longer
    let mismatches = 0;
    let i = 0, j = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) {
        i++; j++;
      } else {
        mismatches++;
        if (mismatches > (b.length > 5 ? 2 : 1)) return false;
        if (a.length > b.length) i++;
        else if (b.length > a.length) j++;
        else { i++; j++; }
      }
    }
    return true;
  }

  // Placeholder for semantic search API
  async function fetchSemanticResults(query) {
    // TODO: Replace with real API call to OpenAI/embeddings
    // Return: [{ type, location, snippet, onClick }]
    return new Promise(resolve => setTimeout(() => resolve([]), 1200));
  }

  // Smart Search logic
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setActiveResultIdx(0);
      setActiveMatchIdx(0);
      return;
    }
    
    const q = searchQuery.toLowerCase();
    const results = [];

    // Fuzzy or normal match function
    const matchFn = fuzzySearch ? fuzzyMatch : (a, b) => a.toLowerCase().includes(b.toLowerCase());

    // Search chat messages
    messages.forEach((msg, idx) => {
      if (
        ((msg.role === 'user' && searchFilters.user) || (msg.role === 'ai' && searchFilters.ai)) &&
        matchFn(msg.content, q)
      ) {
        const matchIndices = getAllMatchIndices(msg.content, searchQuery);
        results.push({
          type: msg.role === 'user' ? 'User Message' : 'AI Message',
          location: `Message #${idx + 1}`,
          snippet: msg.content.length > 120 ? msg.content.slice(0, 120) + '...' : msg.content,
          matchIndices,
          onClick: () => {
            if (messageRefs.current[idx]) {
              messageRefs.current[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
              setHighlightedMsgIdx(idx);
              setHighlightedQuery(searchQuery);
              setTimeout(() => {
                if (messageRefs.current[idx]) {
                  messageRefs.current[idx].classList.remove('ring-4', 'ring-accent', 'bg-yellow-100', 'animate-cited-glow');
                }
              }, 1800);
            }
          }
        });
      }
    });

    // Search notes
    if (searchFilters.notes && matchFn(notes, q)) {
      const matchIndices = getAllMatchIndices(notes, searchQuery);
      results.push({
        type: 'Notes',
        location: 'Notes Panel',
        snippet: notes.length > 120 ? notes.slice(0, 120) + '...' : notes,
        matchIndices,
        onClick: () => {
          const el = document.getElementById('notes-panel-link-target');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setHighlightedNotes(true);
            setHighlightedQuery(searchQuery);
            setTimeout(() => {
              setHighlightedNotes(false);
              setHighlightedQuery('');
            }, 2000);
            el.classList.add('ring-4', 'ring-accent', 'bg-yellow-100', 'animate-cited-glow');
            setTimeout(() => {
              el.classList.remove('ring-4', 'ring-accent', 'bg-yellow-100', 'animate-cited-glow');
            }, 1800);
          }
        }
      });
    }

    // Search write
    if (searchFilters.write && matchFn(writeContent, q)) {
      const matchIndices = getAllMatchIndices(writeContent, searchQuery);
      results.push({
        type: 'Write',
        location: 'Write Panel',
        snippet: writeContent.length > 120 ? writeContent.slice(0, 120) + '...' : writeContent,
        matchIndices,
        onClick: () => {
          const el = document.getElementById('writing-panel-link-target');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setHighlightedWrite(true);
            setHighlightedQuery(searchQuery);
            setTimeout(() => {
              setHighlightedWrite(false);
              setHighlightedQuery('');
            }, 2000);
            el.classList.add('ring-4', 'ring-accent', 'bg-yellow-100', 'animate-cited-glow');
            setTimeout(() => {
              el.classList.remove('ring-4', 'ring-accent', 'bg-yellow-100', 'animate-cited-glow');
            }, 1800);
          }
        }
      });
    }

    // Search todos (notes)
    if (searchFilters.todos) {
      notesTodos.forEach((todo, idx) => {
        if (matchFn(todo.text, q)) {
          const matchIndices = getAllMatchIndices(todo.text, searchQuery);
          results.push({
            type: 'To-Do',
            location: 'Notes',
            snippet: todo.text.length > 120 ? todo.text.slice(0, 120) + '...' : todo.text,
            matchIndices,
            onClick: () => {
              const el = document.getElementById('notes-panel-link-target');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setHighlightedTodo({ panel: 'notes', id: todo.id });
                setHighlightedQuery(searchQuery);
                setTimeout(() => {
                  setHighlightedTodo({ panel: null, id: null });
                  setHighlightedQuery('');
                }, 2000);
                el.classList.add('ring-4', 'ring-accent', 'bg-yellow-100', 'animate-cited-glow');
                setTimeout(() => {
                  el.classList.remove('ring-4', 'ring-accent', 'bg-yellow-100', 'animate-cited-glow');
                }, 1800);
              }
            }
          });
        }
      });
    }

    // Search todos (write)
    if (searchFilters.todos) {
      writeTodos.forEach((todo, idx) => {
        if (matchFn(todo.text, q)) {
          const matchIndices = getAllMatchIndices(todo.text, searchQuery);
          results.push({
            type: 'To-Do',
            location: 'Write',
            snippet: todo.text.length > 120 ? todo.text.slice(0, 120) + '...' : todo.text,
            matchIndices,
            onClick: () => {
              const el = document.getElementById('writing-panel-link-target');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setHighlightedTodo({ panel: 'write', id: todo.id });
                setHighlightedQuery(searchQuery);
                setTimeout(() => {
                  setHighlightedTodo({ panel: null, id: null });
                  setHighlightedQuery('');
                }, 2000);
                el.classList.add('ring-4', 'ring-accent', 'bg-yellow-100', 'animate-cited-glow');
                setTimeout(() => {
                  el.classList.remove('ring-4', 'ring-accent', 'bg-yellow-100', 'animate-cited-glow');
                }, 1800);
              }
            }
          });
        }
      });
    }

    setSearchResults(results);
    setActiveResultIdx(0);
    setActiveMatchIdx(0);

    // Semantic search (AI)
    if (semanticSearch && searchQuery) {
      setSemanticLoading(true);
      fetchSemanticResults(searchQuery).then(aiResults => {
        setSemanticLoading(false);
        if (aiResults && aiResults.length > 0) {
          setSearchResults(prev => [
            ...prev,
            ...aiResults.map(r => ({ ...r, type: r.type + ' (Semantic)', semantic: true }))
          ]);
        }
      });
    }
  }, [searchQuery, messages, notes, writeContent, notesTodos, writeTodos, searchFilters, fuzzySearch, semanticSearch]);

  // Keyboard navigation for search modal
  useEffect(() => {
    if (!showSearchModal) return;

    const handleKeyDown = (e) => {
      if (searchResults.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveResultIdx(prev => (prev + 1) % searchResults.length);
          setActiveMatchIdx(0);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveResultIdx(prev => (prev - 1 + searchResults.length) % searchResults.length);
          setActiveMatchIdx(0);
          break;
        case 'ArrowRight': {
          const currentResult = searchResults[activeResultIdx];
          if (currentResult && currentResult.matchIndices && currentResult.matchIndices.length > 1) {
            e.preventDefault();
            setActiveMatchIdx(prev => Math.min(prev + 1, currentResult.matchIndices.length - 1));
          }
          break;
        }
        case 'ArrowLeft': {
          const currentResult = searchResults[activeResultIdx];
          if (currentResult && currentResult.matchIndices && currentResult.matchIndices.length > 1) {
            e.preventDefault();
            setActiveMatchIdx(prev => Math.max(prev - 1, 0));
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
        // Escape is already handled by the input's onKeyDown
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearchModal, searchResults, activeResultIdx]);

  // Keyboard shortcuts for coding mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + E to open code execution in coding mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'e' && selectedMode === "Coding") {
        e.preventDefault();
        setShowCodeExecution(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedMode]);

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
    const layouts = ['right', 'split', 'left'];
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
      setIsDarkMode(preset.theme.background === 'dark');
      
      // Apply layout settings
      setPanelLayout(preset.theme.panelLayout);
      setNotesCollapsed(preset.theme.notesCollapsed);
      setWriteCollapsed(preset.theme.writeCollapsed);
      setNotesWidth(preset.theme.notesWidth);
      setWriteWidth(preset.theme.writeWidth);
      
      // Special handling for coding mode to open/close code execution
      setShowCodeExecution(!!preset.theme.showCodeExecution);
      
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
      // If research mode, switch view
      if (presetKey === 'research' && setView) {
        setView('research');
      }
    }
  };

  const getCurrentTheme = () => {
    return {
      accentColor,
      background: isDarkMode ? 'dark' : 'light',
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
          className={`h-full flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-lg relative transition-all duration-300`}
          style={{ width: writeCollapsed ? 56 : writeWidth }}
        >
          {/* Drag handle */}
          {!writeCollapsed && (
            <div
              ref={writeDragHandleRef}
              onMouseDown={startWriteDrag}
              className={`absolute top-0 h-full w-2 cursor-ew-resize z-50 group ${writeIsLeft ? 'right-0' : 'left-0'}`}
            >
              <div className="w-full h-full bg-transparent group-hover:bg-accent/20 transition-colors duration-300" />
              </div>
          )}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700/80 bg-gray-50 dark:bg-gray-800/60">
            {!writeCollapsed && <span className="font-semibold text-gray-900 dark:text-white">Write</span>}
            <div className="flex items-center gap-1">
              <button
                className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => setWriteCollapsed(!writeCollapsed)}
                title={writeCollapsed ? 'Expand' : 'Collapse'}
              >
                {writeIsLeft ? <PanelRightClose size={16} /> : <PanelLeftClose size={16} />}
              </button>
              {!writeCollapsed && (
                <>
                  <button
                    className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition"
                    onClick={() => setShowWriteHistory(true)}
                    title="View version history"
                  > <Clock size={16} /> </button>
                  <button
                    className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition"
                    onClick={() => handleCopyPanelLink('writing')}
                    title="Copy Writing Link"
                  > <Clipboard size={16} /> </button>
                  <button
                    className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition"
                    onClick={() => setShowTodos(prev => ({ ...prev, write: !prev.write }))}
                    title="Toggle To-Do List"
                  > <CheckSquare size={16} /> </button>
                  <button
                    className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition"
                    onClick={() => openExportModal('write')}
                    title="Export Content"
                  > <Download size={16} /> </button>
                  <div className="relative">
                    <button
                      className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition"
                      onClick={() => setShowFormatInput(f => !f)}
                      title="Request a writing format"
                    >
                      {writeFormat ? `Format: ${writeFormat}` : 'Format'}
                    </button>
                    {showFormatInput && (
                      <div className="absolute right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-50 flex items-center gap-2">
                        <input
                          type="text"
                          className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none"
                          placeholder="e.g. MLA, APA"
                          value={writeFormat}
                          onChange={e => setWriteFormat(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') setShowFormatInput(false); }}
                          autoFocus
                        />
                        <button
                          className="text-sm px-2.5 py-1 rounded bg-accent text-accent-foreground font-semibold hover:brightness-90"
                          onClick={() => setShowFormatInput(false)}
                        >OK</button>
            </div>
                    )}
                  </div>
                </>
              )}
              <button onClick={() => setWriteOpen(false)} className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition"><X size={18} /></button>
            </div>
          </div>
          {!writeCollapsed && (
              <div className="flex-1 flex flex-col overflow-y-auto bg-white dark:bg-gray-800/80"
                onDragOver={e => e.preventDefault()}
                onDrop={handleQuillDrop(setWriteContent)}
              >
              <ReactQuill
                theme="snow"
                value={writeContent}
                onChange={setWriteContent}
                className="flex-1 bg-transparent"
                style={{ border: 'none' }}
                placeholder="Write essays, long answers, or brainstorm in real time..."
              />
              {/* Render message links in writing preview */}
              <div className="mt-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded text-sm border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 mb-1">Preview:</div>
                {renderWithMsgLinks(writeContent)}
              </div>
              
              {/* To-Do List for Write Panel */}
              {showTodos.write && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">To-Do List</div>
                    <div className="text-xs text-gray-500">
                      {getTodoStats(writeTodos).completed}/{getTodoStats(writeTodos).total} completed
                    </div>
                  </div>
                  
                  {/* Add new todo */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Add a new task..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          addTodo('write', e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      className="px-3 py-2 text-sm bg-accent text-accent-foreground rounded hover:brightness-90 transition"
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        if (input.value.trim()) {
                          addTodo('write', input.value);
                          input.value = '';
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Todo items */}
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="write-todos-list" type="write-todos">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 max-h-40 overflow-y-auto">
                          {writeTodos.length === 0 && (
                            <div className="text-xs text-gray-500 text-center py-4 flex flex-col items-center">
                              <Inbox size={24} className="mb-2 text-gray-400 dark:text-gray-600" />
                              No tasks yet. Add one above!
                            </div>
                          )}
                          {writeTodos.map((todo, index) => (
                            <Draggable key={todo.id} draggableId={String(todo.id)} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`flex items-center gap-2 p-2 rounded border transition-shadow ${
                                    snapshot.isDragging
                                      ? 'shadow-lg bg-white dark:bg-gray-700'
                                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                                  }`}
                                >
                                  <GripVertical size={16} className="text-gray-400 dark:text-gray-500" />
                                  <button
                                    onClick={() => toggleTodo('write', todo.id)}
                                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${
                                      todo.completed 
                                        ? 'bg-accent border-accent text-white' 
                                        : 'border-gray-300 dark:border-gray-500 hover:border-accent'
                                    }`}
                                  >
                                    {todo.completed && <CheckSquare size={12} />}
                                  </button>
                                  <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'} ${highlightedTodo.panel === 'write' && highlightedTodo.id === todo.id ? 'bg-yellow-200' : ''}`}>
                                    {highlightedTodo.panel === 'write' && highlightedTodo.id === todo.id ? highlightQuery(todo.text, highlightedQuery) : todo.text}
                                  </span>
                                  <button
                                    onClick={() => deleteTodo('write', todo.id)}
                                    className="text-gray-400 hover:text-red-500 text-xs px-1"
                                    title="Delete task"
                                  >
                                    ×
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              )}
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
        className={`h-full flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-lg relative transition-all duration-300`}
        style={{ width: notesCollapsed ? 56 : notesWidth }}
      >
        {/* Drag handle */}
        {!notesCollapsed && (
          <div
            ref={dragHandleRef}
            onMouseDown={startDrag}
            className={`absolute top-0 h-full w-2 cursor-ew-resize z-40 group ${notesIsLeft ? 'right-0' : 'left-0'}`}
          >
             <div className="w-full h-full bg-transparent group-hover:bg-accent/20 transition-colors duration-300" />
          </div>
        )}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700/80 bg-gray-50 dark:bg-gray-800/60">
          {!notesCollapsed && <span className="font-semibold text-gray-900 dark:text-white">Notes</span>}
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setNotesCollapsed(!notesCollapsed)}
              title={notesCollapsed ? 'Expand' : 'Collapse'}
            >
              {notesIsLeft ? <PanelRightClose size={16} /> : <PanelLeftClose size={16} />}
            </button>
            {!notesCollapsed && (
              <>
                <button
                  className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition"
                  onClick={() => setShowNotesHistory(true)}
                  title="View version history"
                > <Clock size={16} /> </button>
                <button
                  className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition"
                  onClick={() => handleCopyPanelLink('note')}
                  title="Copy Notes Link"
                > <Clipboard size={16} /> </button>
                <button
                  className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition"
                  onClick={() => setShowTodos(prev => ({ ...prev, notes: !prev.notes }))}
                  title="Toggle To-Do List"
                > <CheckSquare size={16} /> </button>
                <button
                  className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition"
                  onClick={() => openExportModal('notes')}
                  title="Export Content"
                > <Download size={16} /> </button>
              </>
            )}
            <button onClick={() => setNotesOpen(false)} className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition"><X size={18} /></button>
          </div>
        </div>
        {!notesCollapsed && (
          <div className="flex-1 flex flex-col overflow-y-auto bg-white dark:bg-gray-800/80"
            onDragOver={e => e.preventDefault()}
            onDrop={handleQuillDrop(setNotes)}
          >
            <ReactQuill
              theme="snow"
              value={notes}
              onChange={setNotes}
              className="flex-1 bg-transparent"
              style={{ border: 'none' }}
              placeholder="Jot down notes, cite outputs, or take class notes..."
            />
            {/* Render message links in notes preview */}
            <div className="mt-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded text-sm border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 mb-1">Preview:</div>
              {renderWithMsgLinks(notes)}
            </div>
            
            {/* To-Do List for Notes Panel */}
            {showTodos.notes && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">To-Do List</div>
                  <div className="text-xs text-gray-500">
                    {getTodoStats(notesTodos).completed}/{getTodoStats(notesTodos).total} completed
                  </div>
                </div>
                
                {/* Add new todo */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add a new task..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        addTodo('notes', e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    className="px-3 py-2 text-sm bg-accent text-accent-foreground rounded hover:brightness-90 transition"
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      if (input.value.trim()) {
                        addTodo('notes', input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
                
                {/* Todo items */}
                 <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="notes-todos-list" type="notes-todos">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 max-h-40 overflow-y-auto">
                        {notesTodos.length === 0 && (
                          <div className="text-xs text-gray-500 text-center py-4 flex flex-col items-center">
                            <Inbox size={24} className="mb-2 text-gray-400 dark:text-gray-600" />
                            No tasks yet. Add one above!
                          </div>
                        )}
                        {notesTodos.map((todo, index) => (
                          <Draggable key={todo.id} draggableId={String(todo.id)} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`flex items-center gap-2 p-2 rounded border transition-shadow ${
                                  snapshot.isDragging
                                    ? 'shadow-lg bg-white dark:bg-gray-700'
                                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                                }`}
                              >
                                <GripVertical size={16} className="text-gray-400 dark:text-gray-500" />
                                <button
                                  onClick={() => toggleTodo('notes', todo.id)}
                                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${
                                    todo.completed 
                                      ? 'bg-accent border-accent text-white' 
                                      : 'border-gray-300 dark:border-gray-500 hover:border-accent'
                                  }`}
                                >
                                  {todo.completed && <CheckSquare size={12} />}
                                </button>
                                <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'} ${highlightedTodo.panel === 'notes' && highlightedTodo.id === todo.id ? 'bg-yellow-200' : ''}`}>
                                  {highlightedTodo.panel === 'notes' && highlightedTodo.id === todo.id ? highlightQuery(todo.text, highlightedQuery) : todo.text}
                </span>
                                <button
                                  onClick={() => deleteTodo('notes', todo.id)}
                                  className="text-gray-400 hover:text-red-500 text-xs px-1"
                                  title="Delete task"
                                >
                                  ×
                                </button>
              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
            </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            )}
          </div>
        )}
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
    );
  };

  if (embedded) {
    return (
      <div className="flex flex-col h-full w-full bg-white dark:bg-gray-900">
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
          <div className="w-full max-w-2xl mx-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex my-6 ${msg.role === 'user' ? 'justify-end' : 'justify-center'}`}
              >
                <div className="flex flex-col max-w-2xl group">
                  <div className={`relative px-4 py-3 rounded-xl shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200'
                  }`}>
                    {/* Avatar/Icon */}
                    <div className="absolute -left-10 top-2">
                      {msg.role === 'user' ? (
                        <User className="w-6 h-6 text-blue-500 bg-blue-100 rounded-full p-1" />
                      ) : (
                        <Bot className="w-6 h-6 text-accent bg-accent/10 rounded-full p-1" />
                      )}
                    </div>
                    {/* Content */}
                    <div className="whitespace-pre-line">
                      {msg.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Input Bar */}
        <form
          className="w-full max-w-2xl mx-auto flex items-center gap-2 px-4 pb-4 pt-2"
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
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
            disabled={!prompt.trim()}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-full">
      {panelLayout === 'left' && (
        <>
          {renderNotesPanel()}
          {renderWritePanel()}
        </>
      )}
      {panelLayout === 'split' && renderNotesPanel()}
      <div className="flex flex-col flex-1 h-full p-6 min-w-0">
        <div className="flex-1 min-h-[200px] max-h-[calc(100vh-220px)] overflow-y-auto px-6 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500">
              <div className="mb-4">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto text-gray-300 dark:text-gray-600">
                  <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M2 7L12 12M12 22V12M22 7L12 12M17 4.5L7 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Welcome to Eden</h2>
              <p className="mt-2 max-w-sm">Your agentic reasoning partner for high-stakes work. Start a conversation below to begin.</p>
              
              {/* Coding Mode Indicator */}
              {selectedMode === "Coding" && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-md">
        <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
                      <Code size={20} className="text-red-600 dark:text-red-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-red-800 dark:text-red-200">Coding Mode Active</h3>
                      <p className="text-sm text-red-600 dark:text-red-300">
                        Code execution environment is ready. Use the floating code button or ask coding questions.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full max-w-3xl mx-auto">
              {/* Coding Mode Banner */}
              {selectedMode === "Coding" && messages.length > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
                        <Code size={18} className="text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-800 dark:text-red-200">Coding Mode</h3>
                        <p className="text-sm text-red-600 dark:text-red-300">
                          Code execution environment available • Red accent theme • Compact layout • Press Ctrl/Cmd + E to open code editor
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowCodeExecution(true)}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                    >
                      Open Code Editor
                    </button>
                  </div>
                </div>
              )}
              
              {messages.map((msg, idx) => {
                if (msg.loading) {
                  return (
                    <div key="skeleton" className="flex justify-center my-6 animate-pulse">
                      <div className="flex flex-col w-full max-w-2xl">
                        <div className="relative px-4 py-3 rounded-xl shadow-sm bg-white dark:bg-gray-800">
                          <div className="space-y-3">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={idx}
                    ref={msg.role === 'ai' ? (el => messageRefs.current[idx] = el) : null}
                    className={`flex my-6 ${msg.role === 'user' ? 'justify-end' : 'justify-center'}`}
                    data-msg-idx={msg.role === 'ai' ? idx : undefined}
                  >
                    {/* Message content and actions */}
                    <div className={`flex flex-col max-w-2xl group`}>
                        <div className={`relative px-4 py-3 rounded-xl shadow-sm ${
                            msg.role === 'user' 
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200' 
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200'
                        } ${citedMessageIndices.includes(idx) ? 'ring-2 ring-accent' : ''}`}>
                            
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
                                    className="absolute top-1.5 right-1.5 bg-black/5 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded p-1 hover:bg-black/10 dark:hover:bg-white/10"
                                    onClick={() => handleCopyMsgLink(idx)}
                                    title="Copy Message Link"
                                >
                                    <Clipboard size={14} />
                                </button>
                              </>
                            )}
                            
                            {/* Content */}
                            <div className="whitespace-pre-line">
                                {highlightedMsgIdx === idx
                                    ? highlightQuery(msg.content, highlightedQuery)
                                    : (msg.role === 'user' ? msg.content : msg.content.split('\n').map((p, i) => (
                                        <p key={i} className="my-1 last:my-0">{p}</p>
                                      )))
                                }
                            </div>
                        </div>

                        {/* AI message footer with actions */}
                        {msg.role === 'ai' && (
                            <div className="mt-2 flex justify-between items-center w-full text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                  <div className="inline-flex items-center gap-1 pl-1 pr-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium text-[10px] tracking-wide">
                                    <svg width='12' height='12' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='10' cy='10' r='10' fill='currentColor' fillOpacity='0.1'/><path d='M6 10.5L9 13.5L14 8.5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/></svg>
                                    EVES
                                  </div>
                                  {backlinks[idx] && backlinks[idx].length > 0 && (
                                    <div className="text-accent bg-accent/10 rounded-full px-2 py-0.5">
                                      Backlinked from: {backlinks[idx].join(', ')}
                                    </div>
                                  )}
                                </div>

                                <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {/* Run in Code Editor button for coding mode */}
                                    {selectedMode === "Coding" && (
                                      <button
                                        type="button"
                                        className="flex items-center gap-1 hover:text-red-500 text-red-600 dark:text-red-400"
                                        onClick={() => {
                                          // Extract code from message content and set it in code execution
                                          const codeMatch = msg.content.match(/```(\w+)?\n([\s\S]*?)```/);
                                          if (codeMatch) {
                                            const language = codeMatch[1] || 'javascript';
                                            const code = codeMatch[2].trim();
                                            setCodeExecutionInitial({ language, code });
                                          } else {
                                            setCodeExecutionInitial({ language: 'javascript', code: null });
                                          }
                                          setShowCodeExecution(true);
                                        }}
                                        title="Run in Code Editor"
                                      >
                                        <Code size={14} /> Run Code
                                      </button>
                                    )}
                                    <button
                                        type="button"
                                        className="flex items-center gap-1 hover:text-accent"
                                        onClick={() => handleCiteToNotes(msg, idx)} title="Cite to Notes"
                                    > <Copy size={14} /> Cite </button>
                                    <button
                                        type="button"
                                        className="flex items-center gap-1 hover:text-accent"
                                        onClick={() => handleSendToWrite(msg)} title="Send to Write"
                                    > <Pencil size={14} /> Write </button>
                                    <button
                                        type="button"
                                        className="flex items-center gap-1 hover:text-accent"
                                        onClick={() => setNotesOpen(true)} title="Open Notes"
                                    > <StickyNote size={14} /> Notes </button>
                                </div>
                            </div>
                        )}
              </div>
            </div>
          )
              })}
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
        </div>
        <div className="mt-4">
          <form 
            onSubmit={handleSend} 
            className={`w-full max-w-3xl mx-auto bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-2 ${researchMode ? 'mb-10' : ''}`}
          >
            {/* Main input row */}
            <div className={`flex items-start gap-2 transition-all duration-200 ${fullscreen ? 'min-h-[200px]' : ''}`}>
              <div className="relative flex-1 flex flex-col">
                <textarea
                  ref={textareaRef}
            value={prompt}
                  onInput={handleInput}
                  className={`w-full ${fullscreen ? 'min-h-[200px] max-h-[400px]' : 'min-h-[24px] max-h-[160px]'} resize-none bg-transparent text-gray-900 dark:text-white px-3 py-1.5 focus:outline-none transition-all duration-200`}
            placeholder={selectedMode === "Coding" ? "Ask coding questions, request code examples, or describe algorithms..." : "Type your message..."}
                  rows={1}
                  style={{ transition: 'height 0.15s' }}
                />
                {(isMultiline || fullscreen) && (
                  <button
                    type="button"
                    className="absolute top-0 right-0 z-10 p-1 rounded-full bg-black/10 hover:bg-black/20 text-gray-700 dark:text-gray-300 transition-all duration-150"
                    aria-label={fullscreen ? "Collapse" : "Fullscreen"}
                    onClick={() => setFullscreen(f => !f)}
                  >
                    {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
                )}
        </div>
              <button 
                type="submit" 
                className="bg-accent p-2 rounded-full shadow-sm flex items-center justify-center h-9 w-9 self-end disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!prompt.trim()}
              >
                <ArrowRight size={18} className="text-white"/>
              </button>
            </div>
            {/* Pills row */}
            <div className="w-full flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
          <div className="relative">
            <button
              type="button"
                  className={`flex items-center gap-2 text-sm transition px-2 py-1 rounded-lg ${
                    selectedMode === "Coding" 
                      ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent-foreground hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              onClick={() => setModeMenuOpen((open) => !open)}
            >
                  {selectedMode === "Coding" ? <Code size={14} /> : <Sliders size={14} />}
                  <span className="text-xs">{selectedMode}</span>
            </button>
            {modeMenuOpen && (
                  <div className="absolute left-0 bottom-full mb-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                {modeOptions.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleModeSelect(mode)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700/50 transition ${selectedMode === mode ? 'font-semibold text-accent' : 'text-black dark:text-white'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            )}
          </div>
              <button type="button" className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent-foreground transition px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><FileText size={14}/> <span className="text-xs">Files</span></button>
              <button type="button" className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent-foreground transition px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><MessageSquare size={14}/> <span className="text-xs">Deep Research</span></button>
              
              <div className="flex-grow" />

              <button
                type="button"
                title="Toggle Panel Layout"
                className="flex items-center gap-1.5 text-sm px-2 py-1 rounded-lg text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent-foreground transition hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={togglePanelLayout}
              >
                <ChevronsLeftRight size={14} />
              </button>

              <button
                type="button"
                title="Theme & Layout Presets"
                className="flex items-center gap-1.5 text-sm px-2 py-1 rounded-lg text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent-foreground transition hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowPresets(true)}
              >
                <Palette size={14} />
                {currentPreset ? (
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: `hsl(${accentColor})` }}
                    />
                    <span className="text-xs font-medium">
                      {getCurrentPresetName()}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs">Presets</span>
                )}
              </button>

              <button
                type="button"
                title="Code Execution Environment"
                className="flex items-center gap-1.5 text-sm px-2 py-1 rounded-lg text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent-foreground transition hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowCodeExecution(true)}
              >
                <Code size={14} />
              </button>

              <button
                type="button"
                className={`flex items-center gap-1.5 text-sm px-2 py-1 rounded-lg transition ${writeOpen ? 'text-accent bg-accent/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                onClick={() => setWriteOpen((open) => !open)}
              >
                <Pencil size={14} /> <span className="text-xs">Write</span>
              </button>
              <button
                type="button"
                className={`flex items-center gap-1.5 text-sm px-2 py-1 rounded-lg transition ${notesOpen && !writeOpen ? 'text-accent bg-accent/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                onClick={() => setNotesOpen((open) => !open)}
              >
                <StickyNote size={14} /> <span className="text-xs">Notes</span>
              </button>
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

      {/* Theme Presets Modal */}
      <ThemePresets
        isOpen={showPresets}
        onClose={() => setShowPresets(false)}
        onApplyPreset={applyPreset}
        currentPreset={currentPreset}
        currentTheme={getCurrentTheme()}
      />

      {/* Code Execution Environment */}
      <CodeExecution
        isOpen={showCodeExecution}
        onClose={() => setShowCodeExecution(false)}
        initialLanguage={codeExecutionInitial.language}
        initialCode={codeExecutionInitial.code}
        accentColor={accentColor}
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

      {/* Floating Search Button */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-accent text-accent-foreground rounded-full shadow-lg p-4 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent"
        title="Smart Search (⌘/Ctrl+K)"
        onClick={() => setShowSearchModal(true)}
        style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)' }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button>

      {/* Floating Code Execution Button */}
      <button
        className={`fixed bottom-8 right-24 z-50 rounded-full shadow-lg p-4 focus:outline-none focus:ring-2 transition-all duration-200 ${
          selectedMode === "Coding" 
            ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500' 
            : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
        }`}
        title={selectedMode === "Coding" ? "Code Execution Environment (Ctrl/Cmd + E)" : "Code Execution Environment"}
        onClick={() => setShowCodeExecution(true)}
        style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)' }}
      >
        <Code size={24} />
      </button>

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
                    onClick={() => setIsDarkMode(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      !isDarkMode 
                        ? 'bg-white shadow-md text-gray-900' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/50'
                    }`}
                  >
                    <Sun size={16} />
                    <span className="text-sm font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => setIsDarkMode(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isDarkMode 
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
            <button onClick={() => setShowSearchModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-accent p-1 rounded-full"><Minimize2 size={18} /></button>
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Smart Search</h2>
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${searchFilters.user ? 'bg-accent text-white border-accent' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'}`}
                onClick={() => setSearchFilters(f => ({ ...f, user: !f.user }))}
              >User</button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${searchFilters.ai ? 'bg-accent text-white border-accent' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'}`}
                onClick={() => setSearchFilters(f => ({ ...f, ai: !f.ai }))}
              >AI</button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${searchFilters.notes ? 'bg-accent text-white border-accent' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'}`}
                onClick={() => setSearchFilters(f => ({ ...f, notes: !f.notes }))}
              >Notes</button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${searchFilters.write ? 'bg-accent text-white border-accent' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'}`}
                onClick={() => setSearchFilters(f => ({ ...f, write: !f.write }))}
              >Write</button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${searchFilters.todos ? 'bg-accent text-white border-accent' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'}`}
                onClick={() => setSearchFilters(f => ({ ...f, todos: !f.todos }))}
              >To-Do</button>
            </div>
            {/* Fuzzy & Semantic toggles */}
            <div className="flex gap-4 mb-4 items-center">
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input type="checkbox" checked={fuzzySearch} onChange={e => setFuzzySearch(e.target.checked)} className="accent-accent" />
                Fuzzy Search
              </label>
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input type="checkbox" checked={semanticSearch} onChange={e => setSemanticSearch(e.target.checked)} className="accent-accent" />
                Semantic Search (AI)
              </label>
              {semanticLoading && <span className="text-xs text-accent ml-2 animate-pulse">Loading AI results...</span>}
            </div>
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search chat, notes, write, to-dos..."
              className="w-full px-4 py-2 mb-4 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
              onKeyDown={e => { if (e.key === 'Escape') setShowSearchModal(false); }}
            />
            <div className="max-h-80 overflow-y-auto">
              {searchResults.length === 0 && searchQuery && (
                <div className="text-gray-500 text-sm text-center py-12 flex flex-col items-center">
                  <Search size={40} className="text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">No Results Found</h3>
                  <p className="mt-1">Try adjusting your search query or filters.</p>
                </div>
              )}
              {searchResults.map((result, i) => (
                <div
                  key={i}
                  ref={el => resultRefs.current[i] = el}
                  className={`p-3 mb-2 rounded-lg border cursor-pointer transition-all duration-200 group ${
                    i === activeResultIdx 
                      ? 'ring-2 ring-accent bg-accent/5 border-accent' 
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-accent/10 hover:border-accent/30'
                  }`}
                  onClick={() => { setActiveResultIdx(i); setActiveMatchIdx(0); result.onClick(); setShowSearchModal(false); }}
                >
                  <div className="text-xs text-accent font-semibold mb-1 flex items-center gap-2">
                    {result.type} {result.location && <span className="text-gray-400 font-normal">({result.location})</span>}
                    <span className="ml-auto text-gray-400 font-normal text-xs">Result {i+1} of {searchResults.length}</span>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white">
                    {highlightQuery(
                      result.snippet,
                      searchQuery,
                      result.matchIndices || [],
                      i === activeResultIdx ? activeMatchIdx : 0
                    )}
                  </div>
                  {result.matchIndices && result.matchIndices.length > 1 && (
                    <div className="flex gap-2 mt-2 items-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                      <button
                        disabled={activeResultIdx !== i || activeMatchIdx === 0}
                        className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent/20 focus:ring-2 focus:ring-accent"
                        title="Previous match (←)"
                        onClick={e => {
                          e.stopPropagation();
                          if (activeResultIdx === i && activeMatchIdx > 0) setActiveMatchIdx(activeMatchIdx - 1);
                        }}
                      ><ChevronLeft size={16} /></button>
                      <span className="text-xs select-none text-gray-500 dark:text-gray-400 font-mono">
                        {activeResultIdx === i ? activeMatchIdx + 1 : 1} / {result.matchIndices.length}
                      </span>
                      <button
                        disabled={activeResultIdx !== i || activeMatchIdx === result.matchIndices.length - 1}
                        className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent/20 focus:ring-2 focus:ring-accent"
                        title="Next match (→)"
                        onClick={e => {
                          e.stopPropagation();
                          if (activeResultIdx === i && activeMatchIdx < result.matchIndices.length - 1) setActiveMatchIdx(activeMatchIdx + 1);
                        }}
                      ><ChevronRight size={16} /></button>
                      <span className="text-xs text-gray-400 ml-auto">(Use ←/→ to navigate matches)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Theme Indicator */}
      <div className="fixed top-4 right-4 z-40">
        <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-gray-200 dark:border-gray-700">
          {currentPreset ? (
            <>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: `hsl(${accentColor})` }}
              />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {getCurrentPresetName()}
              </span>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
            </>
          ) : null}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-1.5 rounded-full transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setShowThemeModal(true)}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="Customize theme"
          >
            <Settings size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
} 