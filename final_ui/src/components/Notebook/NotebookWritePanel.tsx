import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  MessageSquare, 
  Download, 
  Send, 
  Clock, 
  Clipboard, 
  CheckSquare, 
  Trash2, 
  X,
  PanelLeftClose,
  PanelRightClose
} from 'lucide-react';

interface NotebookWritePanelProps {
  className?: string;
  onContentChange?: (content: string) => void;
  isLeft?: boolean;
  onClose?: () => void;
  onInsertToNotes?: (content: string) => void;
}

export const NotebookWritePanel: React.FC<NotebookWritePanelProps> = ({ 
  className, 
  onContentChange,
  isLeft = false,
  onClose,
  onInsertToNotes
}) => {
  const [writeContent, setWriteContent] = useState<string>("");
  const [writeCollapsed, setWriteCollapsed] = useState(false);
  const [showWriteHistory, setShowWriteHistory] = useState(false);
  const [showTodos, setShowTodos] = useState(false);
  const [writeFormat, setWriteFormat] = useState<string>('');
  const [writeHistory, setWriteHistory] = useState<Array<{content: string, timestamp: number}>>([]);
  const [writeTodos, setWriteTodos] = useState<Array<{id: string, text: string, completed: boolean, created: number}>>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('markdown');

  // Mock functions for now
  const handleQuickAction = (panel: string, action: string) => {
    console.log(`Quick action: ${action} on ${panel} panel`);
    if (action === 'cite' && onInsertToNotes) {
      onInsertToNotes(writeContent);
    }
  };

  const openExportModal = (panel: string) => {
    console.log(`Opening export modal for ${panel}`);
    setShowExportModal(true);
  };

  const handleCopyPanelLink = (panel: string) => {
    console.log(`Copying link for ${panel}`);
    // Implement copy to clipboard
  };

  const handleEditorRightClick = (e: React.MouseEvent, panel: string) => {
    e.preventDefault();
    console.log(`Right click on ${panel} editor`);
    // Implement context menu logic
  };

  const handleQuillDrop = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    setter(prev => prev + data);
  };

  const handleFormatClick = () => {
    // Mock formatting options
    const formats = ['Academic', 'Blog Post', 'Email', 'Report'];
    const currentIdx = writeFormat ? formats.indexOf(writeFormat) : -1;
    const nextIdx = (currentIdx + 1) % formats.length;
    setWriteFormat(formats[nextIdx]);
  };

  useEffect(() => {
    if (onContentChange) {
      onContentChange(writeContent);
    }
  }, [writeContent, onContentChange]);

  return (
    <div className={`h-full flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl relative ${className}`}>
      {/* Elegant Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/60 dark:border-gray-800/60 bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm">
        {!writeCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Write Panel</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <button
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
            onClick={() => setWriteCollapsed(!writeCollapsed)}
            title={writeCollapsed ? 'Expand' : 'Collapse'}
          >
            {isLeft ? <PanelRightClose size={16} /> : <PanelLeftClose size={16} />}
          </button>
          {!writeCollapsed && (
            <>
              <button
                className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
                onClick={() => setShowWriteHistory(true)}
                title="View version history"
              > 
                <Clock size={16} /> 
              </button>
              <button
                className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
                onClick={() => handleCopyPanelLink('writing')}
                title="Copy Writing Link"
              > 
                <Clipboard size={16} /> 
              </button>
              <button
                className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
                onClick={() => setShowTodos(!showTodos)}
                title="Toggle To-Do List"
              > 
                <CheckSquare size={16} /> 
              </button>
              <button
                className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
                onClick={() => openExportModal('write')}
                title="Export Content"
              > 
                <Download size={16} /> 
              </button>
              <button
                className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-[#FF3B30]/10 dark:hover:bg-[#FF3B30]/20 hover:text-[#FF3B30] dark:hover:text-[#FF6961] transition-all duration-200 hover:scale-105"
                onClick={() => setWriteContent('')}
                title="Clear Writing"
              > 
                <Trash2 size={16} /> 
              </button>
              <button
                className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
                onClick={handleFormatClick}
                title="Request a writing format"
              >
                {writeFormat ? `Format: ${writeFormat}` : 'Format'}
              </button>
            </>
          )}
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