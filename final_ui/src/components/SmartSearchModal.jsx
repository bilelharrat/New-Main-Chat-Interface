import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MessageCircle, File, FolderOpen, Brain } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

export default function SmartSearchModal({ open, onClose }) {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchFilters,
    setSearchFilters,
    semanticSearch,
    setSemanticSearch,
    isSearching,
    activeResultIdx,
    setActiveResultIdx,
    fuzzyMatch,
    getAllMatchIndices,
  } = useSearch();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showResults, setShowResults] = useState(false);
  const [activeMatchIdx, setActiveMatchIdx] = useState(0);
  const resultRefs = useRef([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (open && resultRefs.current[activeResultIdx]) {
      resultRefs.current[activeResultIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeResultIdx, open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && searchQuery.trim()) {
        handleSearch();
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        // Navigate between categories
        const categories = ['all', 'conversations', 'documents', 'projects', 'memory'];
        const currentIndex = categories.indexOf(selectedCategory);
        const newIndex = (currentIndex + 1) % categories.length;
        setSelectedCategory(categories[newIndex]);
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (showResults && searchResults.length > 0) {
          // Navigate results
          const newIndex = e.key === 'ArrowUp' 
            ? Math.max(0, activeResultIdx - 1)
            : Math.min(searchResults.length - 1, activeResultIdx + 1);
          setActiveResultIdx(newIndex);
        } else {
          // Navigate categories
          const categories = ['all', 'conversations', 'documents', 'projects', 'memory'];
          const currentIndex = categories.indexOf(selectedCategory);
          if (e.key === 'ArrowUp') {
            const newIndex = currentIndex > 0 ? currentIndex - 1 : categories.length - 1;
            setSelectedCategory(categories[newIndex]);
          } else {
            const newIndex = currentIndex < categories.length - 1 ? currentIndex + 1 : 0;
            setSelectedCategory(categories[newIndex]);
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, searchQuery, selectedCategory, showResults, searchResults, activeResultIdx, onClose]);

  // Highlight query in text
  function highlightQuery(text, query, matchIndices = [], activeIdx = 0) {
    if (!query) return text;
    if (!matchIndices || matchIndices.length === 0) {
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const parts = text.split(regex);
      return parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} className="bg-blue-500/20 text-blue-200 px-1 rounded font-medium">{part}</mark>
          : part
      );
    }
    // Highlight all matches, emphasize active one
    const parts = [];
    let lastIdx = 0;
    matchIndices.forEach((idx, i) => {
      parts.push(text.slice(lastIdx, idx));
      parts.push(
        <mark
          key={i}
          className={`px-1 rounded font-medium ${i === activeIdx ? 'bg-blue-500/30 text-blue-200' : 'bg-blue-500/20 text-blue-200'}`}
        >
          {text.slice(idx, idx + query.length)}
        </mark>
      );
      lastIdx = idx + query.length;
    });
    parts.push(text.slice(lastIdx));
    return parts;
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowResults(true);
      // Trigger search through context
      // The search context will handle the actual search logic
    }
  };

  const resetSearch = () => {
    setShowResults(false);
    setSearchQuery('');
    setSelectedCategory('all');
    setActiveResultIdx(0);
    setActiveMatchIdx(0);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (searchQuery.trim()) {
      setShowResults(true);
    }
  };

  const handleResultClick = (result, index) => {
    setActiveResultIdx(index);
    // Here you can add logic to navigate to the result
    // For example, open the file, go to the conversation, etc.
    console.log('Selected result:', result);
  };

  const categories = [
    { 
      id: 'conversations', 
      name: 'Conversations', 
      icon: <MessageCircle className="w-6 h-6 text-white" />,
      bgGradient: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'documents', 
      name: 'Documents', 
      icon: <File className="w-6 h-6 text-white" />,
      bgGradient: 'from-gray-600 to-gray-700'
    },
    { 
      id: 'projects', 
      name: 'Projects', 
      icon: <FolderOpen className="w-6 h-6 text-white" />,
      bgGradient: 'from-slate-600 to-slate-700'
    },
    { 
      id: 'memory', 
      name: 'Memory', 
      icon: <Brain className="w-6 h-6 text-white" />,
      bgGradient: 'from-indigo-600 to-indigo-700'
    }
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] bg-black/20 backdrop-blur-md" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl w-full max-w-[600px] mx-4 rounded-[24px] overflow-hidden shadow-2xl border border-white/20 dark:border-gray-700/50">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/20 dark:border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-[16px] flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Search size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-light text-gray-900 dark:text-white/95 mb-1 tracking-tight">Smart Search</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300/80 font-light">Search across your workspace</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 group"
            aria-label="Close"
          >
            <X size={22} className="text-gray-500 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-white transition-colors duration-200" />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-8 py-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search conversations, files, projects..."
              className="w-full pl-12 pr-6 py-4 bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl border border-white/30 dark:border-gray-600/50 rounded-[16px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-lg font-light transition-all duration-300 shadow-lg"
            />
            {semanticSearch && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-sm"></div>
                <span className="text-sm text-blue-600 font-medium tracking-wide">AI</span>
              </div>
            )}
          </div>
        </div>

        {!showResults ? (
          <>
            {/* Central Branding */}
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-[18px] flex items-center justify-center mb-6 shadow-xl shadow-blue-500/30">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16L12 14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M12 8L12 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M16 12L14 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M8 12L10 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M15 15L13.5 13.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M9 9L10.5 10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M15 9L13.5 10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M9 15L10.5 13.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-light text-gray-900 dark:text-white/95 mb-3 tracking-tight">Discover Everything</h3>
              <p className="text-gray-600 dark:text-gray-300/80 text-center max-w-md text-base font-light leading-relaxed">Search across conversations, documents, projects, and memory with intelligent AI-powered results</p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 gap-4 px-6 pb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`group relative bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl rounded-[16px] p-6 flex flex-col items-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                    selectedCategory === category.id ? 'ring-2 ring-blue-500/40 shadow-lg scale-[1.02]' : 'hover:bg-white/80 dark:hover:bg-gray-600/70'
                  }`}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${category.bgGradient} rounded-[14px] flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    {category.icon}
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium text-lg mb-2 tracking-tight">{category.name}</span>
                  <span className="text-gray-600 dark:text-gray-300 text-sm text-center font-light leading-relaxed">
                    {category.id === 'conversations' && 'Chat history & conversations'}
                    {category.id === 'documents' && 'Files, PDFs & documents'}
                    {category.id === 'projects' && 'Active & archived projects'}
                    {category.id === 'memory' && 'Important notes & tags'}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="text-center pb-8">
              <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-300/70 font-light">
                <span className="flex items-center gap-3">
                  <kbd className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-mono tracking-wide">⌘K</kbd>
                  <span>Quick search</span>
                </span>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span className="flex items-center gap-3">
                  <kbd className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-mono tracking-wide">↑↓</kbd>
                  <span>Navigate</span>
                </span>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span className="flex items-center gap-3">
                  <kbd className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-mono tracking-wide">Tab</kbd>
                  <span>Categories</span>
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6 px-6">
              <div>
                <h3 className="text-xl font-light text-gray-900 dark:text-white/95 mb-1 tracking-tight">Search Results</h3>
                <p className="text-gray-600 dark:text-gray-300/80 text-sm font-light">Found {searchResults.length} results for "{searchQuery}"</p>
              </div>
              <button
                onClick={resetSearch}
                className="px-6 py-3 bg-white/60 dark:bg-gray-700/60 hover:bg-white/80 dark:hover:bg-gray-600/70 text-gray-700 dark:text-gray-200 rounded-[12px] transition-all duration-300 text-sm font-medium hover:scale-105 backdrop-blur-sm"
              >
                New Search
              </button>
            </div>

            {/* Results */}
            <div className="space-y-4 max-h-80 overflow-y-auto px-6 pb-8">
              {isSearching ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-[16px] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
                    <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h4 className="text-lg font-light text-gray-900 dark:text-white/95 mb-2 tracking-tight">Searching...</h4>
                  <p className="text-gray-600 dark:text-gray-300/80 text-sm font-light">Looking through your content with AI</p>
                </div>
              ) : searchResults.length === 0 && searchQuery ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700/60 rounded-[16px] flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <Search size={24} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  <h4 className="text-lg font-light text-gray-900 dark:text-white/95 mb-2 tracking-tight">No Results Found</h4>
                  <p className="text-gray-600 dark:text-gray-300/80 text-sm font-light">Try adjusting your search query or filters</p>
                </div>
              ) : (
                searchResults.map((result, i) => (
                  <div
                    key={i}
                    ref={el => resultRefs.current[i] = el}
                    className={`p-6 rounded-[16px] border cursor-pointer transition-all duration-300 hover:scale-[1.01] ${
                      i === activeResultIdx 
                        ? 'ring-2 ring-blue-500/40 bg-blue-50/80 dark:bg-blue-900/20 border-blue-500/30 shadow-lg backdrop-blur-sm' 
                        : 'border-white/30 dark:border-gray-700/50 bg-white/60 dark:bg-gray-700/60 hover:bg-white/80 dark:hover:bg-gray-600/70 hover:border-white/50 dark:hover:border-gray-600/70 backdrop-blur-sm'
                    }`}
                    onClick={() => handleResultClick(result, i)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded-[10px] shadow-sm`}>
                        {result.type}
                      </span>
                      {result.location && (
                        <span className="text-gray-600 dark:text-gray-300/80 text-xs font-light">in {result.location}</span>
                      )}
                    </div>
                    <div className="text-gray-900 dark:text-white/90 leading-relaxed text-sm font-light">
                      {highlightQuery(
                        result.snippet,
                        searchQuery,
                        result.matchIndices || [],
                        i === activeResultIdx ? activeMatchIdx : 0
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/40 dark:bg-gray-700/40 border-t border-white/20 dark:border-gray-700/50 backdrop-blur-sm">
          <div className="text-sm text-gray-600 dark:text-gray-300/70 font-light">
            {showResults ? `${searchResults.length} results` : 'Ready to search'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300/70 font-light">
            {showResults ? '↑↓ navigate, Enter select' : '↑↓ navigate categories'}
          </div>
        </div>
      </div>
    </div>
  );
}