import React, { useState, useEffect, useRef } from 'react';
import { FileText, MemoryStick, Settings, MessageSquare, ChevronLeft, ChevronRight, Folder, Search, Plus, PenTool, Workflow, BookOpen } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useSearch } from '../../context/SearchContext';
import SmartSearchModal from '../SmartSearchModal';

const navItems = [
  { id: 'new-chat', label: 'New Chat', icon: Plus, isAction: true },
  { id: 'prompt-console', label: 'Chat', icon: MessageSquare },
  { id: 'notebook-writer', label: 'Notebook', icon: BookOpen },
  { id: 'flow-diagram', label: 'Flow Diagram', icon: Workflow },
  { id: 'files', label: 'Files', icon: FileText },
  { id: 'folders', label: 'Folders', icon: Folder },
  { id: 'memory-retrieval', label: 'Memory & Retrieval', icon: MemoryStick },

  { id: 'settings', label: 'Settings', icon: Settings },
];




export default function Sidebar({ currentView, setCurrentView, collapsed, setCollapsed, onLogout }) {
  const { accentColor, darkMode } = useTheme();
  const {
    searchQuery,
    setSearchQuery,
    searchHistory,
    clearHistory
  } = useSearch();
  
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240); // Default width: 240px (w-60)
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef(null);

  // Resize handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleDoubleClick = () => {
    setSidebarWidth(240); // Reset to default width
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    
    const newWidth = e.clientX;
    const minWidth = 200; // Minimum width
    const maxWidth = 500; // Maximum width
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  // Add global mouse event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);



  if (collapsed) {
    // Collapsed: vertical, centered, icon-only layout
    return (
      <div className="h-full bg-gray-50 dark:bg-gray-800 text-black dark:text-white flex flex-col w-16 items-center nav-spacing py-3 transition-all duration-300 shadow-apple">
        <div className="flex flex-col items-center nav-spacing w-full flex-1">
          <div className="w-8 h-8 m-sm">
            <img src="/logo.png" alt="Eden Logo" className="w-full h-full object-contain bg-gradient-to-r from-[#30D158] to-[#007AFF] rounded-xl shadow-sm" />
          </div>
          <button onClick={() => setCollapsed(false)} className="m-sm p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus-ring" title="Expand sidebar"><ChevronRight size={18}/></button>
          <button
            className="flex items-center justify-center w-10 h-10 rounded-xl transition hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white dark:hover:bg-gray-700 m-sm focus-ring"
            title="Search everything (⌘K)"
            onClick={() => setShowSearchModal(true)}
          >
            <Search size={18} className="text-[#007AFF]" />
          </button>
          <button
            className="flex items-center justify-center w-10 h-10 rounded-xl transition hover:bg-gradient-to-r hover:from-[#30D158] hover:to-[#4CAF50] hover:text-white text-[#30D158] m-sm focus-ring"
            title="New Chat"
            onClick={() => setCurrentView('prompt-console')}
          >
            <Plus size={18} />
          </button>
          {navItems.filter(item => item.id !== 'new-chat').map((item) => (
            <div key={item.id} className="relative">
              <button
                onClick={item.id === 'settings' ? () => setCurrentView('settings') : 
                        item.id === 'notebook-writer' ? () => setCurrentView('notebook-writer') : 
                        () => setCurrentView(item.id)}
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition focus-ring ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] text-white shadow-sm'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
                title={item.label}
              >
                <item.icon size={18} />
              </button>
              
            </div>
          ))}
        </div>
        <SmartSearchModal open={showSearchModal} onClose={() => setShowSearchModal(false)} />
      </div>
    );
  }

  // Expanded sidebar
  return (
    <>
      <div 
        className={`h-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white flex flex-col transition-all duration-300 min-h-screen justify-between overflow-x-hidden shadow-apple relative ${
          isResizing ? 'select-none' : ''
        }`}
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, SF Pro Display, Inter, sans-serif',
          width: `${sidebarWidth}px`
        }}
      >
        <div>
          <div className="flex items-center bg-gray-50 dark:bg-gray-800 card-padding-md pb-2 justify-between border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center component-gap-md flex-1">
              <img src="/logo.png" alt="Eden Logo" className="w-8 h-8 object-contain bg-gradient-to-r from-[#30D158] to-[#007AFF] rounded-full shadow-sm" />
              <h2 className="text-gray-900 dark:text-white text-heading-3 font-bold leading-tight tracking-tight text-gradient-primary text-render-optimized">Eden</h2>
            </div>
            <div className="flex w-10 items-center justify-end">
              <button onClick={() => setCollapsed(true)}
                className="flex max-w-[320px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-transparent text-gray-600 dark:text-gray-400 component-gap-sm text-sm font-bold leading-normal tracking-[0.015em] min-w-0 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus-ring"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-600 dark:placeholder:text-gray-400 border-none focus:outline-none focus:ring-0 transition-all duration-200 cursor-pointer"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    setShowSearchModal(true);
                  }
                }}
                onClick={() => setShowSearchModal(true)}
                readOnly
              />
            </div>
          </div>
          
          <div className="flex flex-col component-gap-xs px-2">
            <div className="flex items-center component-gap-md bg-gray-50 dark:bg-gray-800 px-3 min-h-12">
              <div
                className="flex items-center w-full component-gap-md cursor-pointer transition rounded-xl px-3 py-2.5 hover:bg-gradient-to-r hover:from-[#30D158] hover:to-[#4CAF50] hover:text-white focus-ring"
                onClick={() => setCurrentView('prompt-console')}
              >
                <div className="text-white flex items-center justify-center rounded-lg bg-gradient-to-r from-[#34C759] to-[#30D158] shrink-0 size-8 shadow-sm">
                  <Plus size={18} />
                </div>
                <p className="flex-1 truncate text-sm leading-normal font-medium">New Chat</p>
              </div>
            </div>
            {navItems.filter(item => item.id !== 'new-chat').map((item) => (
              <div
                key={item.id}
                className={`flex items-center component-gap-md bg-gray-50 dark:bg-gray-800 px-3 min-h-12 relative ${item.id === 'settings' ? 'm-sm border-t border-gray-200 dark:border-gray-700 pt-2' : ''}`}
              >
                <div
                      className={`flex items-center w-full component-gap-md cursor-pointer transition-all duration-300 rounded-xl px-3 py-2.5 focus-ring-enhanced ${
                        currentView === item.id
                          ? 'bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] text-white shadow-apple-medium transform scale-105'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:transform hover:scale-102'
                      }`}
                  onClick={item.id === 'settings' ? () => setCurrentView('settings') : 
                          item.id === 'notebook-writer' ? () => setCurrentView('notebook-writer') : 
                          () => setCurrentView(item.id)}
                >
                  <div className={`flex items-center justify-center rounded-lg shrink-0 size-8 transition-all duration-300 ${
                    currentView === item.id
                      ? 'bg-white/20 text-white transform scale-110'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    <item.icon size={18} />
                  </div>
                  <p className={`flex-1 truncate text-sm leading-normal transition-all duration-300 ${currentView === item.id ? 'font-semibold text-white' : 'font-medium'}`}>{item.label}</p>
                </div>
                
              </div>
            ))}
          </div>
        </div>
        <div><div className="h-4 bg-gray-50 dark:bg-gray-800"></div></div>
        
        {/* Resize Handle */}
        <div
          ref={resizeRef}
          className={`absolute right-0 top-0 bottom-0 w-2 cursor-col-resize transition-all duration-200 group ${
            isResizing ? 'bg-[#30D158]' : 'hover:bg-[#30D158]/30'
          }`}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          title={`Current width: ${sidebarWidth}px - Drag to resize (double-click to reset)`}
        >
          {/* Hover indicator line */}
          <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-[#30D158]/20 group-hover:bg-[#30D158]/40 transition-colors duration-200"></div>
          <div className={`absolute right-0.5 top-1/2 -translate-y-1/2 w-1 h-12 rounded-full transition-all duration-200 ${
            isResizing ? 'bg-white opacity-100' : 'bg-[#30D158]/50 opacity-0 group-hover:opacity-100'
          }`}></div>
          {isResizing && (
            <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-[#30D158]"></div>
          )}
          
          {/* Width indicator tooltip */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {sidebarWidth}px
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 transform"></div>
          </div>
        </div>
      </div>
      <SmartSearchModal open={showSearchModal} onClose={() => setShowSearchModal(false)} />
    </>
  );
} 