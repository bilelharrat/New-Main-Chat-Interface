import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MessageSquare, FileText, Folder, Database } from 'lucide-react';
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
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="18" height="18" rx="4" fill="white"/>
          <path d="M16 10.5C16 11.2956 15.6839 12.0587 15.1213 12.6213C14.5587 13.1839 13.7956 13.5 13 13.5H8L6 15.5V8.5C6 7.70435 6.31607 6.94129 6.87868 6.37868C7.44129 5.81607 8.20435 5.5 9 5.5H13C13.7956 5.5 14.5587 5.81607 15.1213 6.37868C15.6839 6.94129 16 7.70435 16 8.5V10.5Z" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgGradient: 'from-[#4CAF50] to-[#2196F3]'
    },
    { 
      id: 'documents', 
      name: 'Documents', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="18" height="18" rx="4" fill="white"/>
          <path d="M13 6H9C8.44772 6 8 6.44772 8 7V14C8 14.5523 8.44772 15 9 15H15C15.5523 15 16 14.5523 16 14V9M13 6L16 9M13 6V9H16" stroke="#2196F3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgGradient: 'from-[#2196F3] to-[#03A9F4]'
    },
    { 
      id: 'projects', 
      name: 'Projects', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="18" height="18" rx="4" fill="white"/>
          <path d="M15 14C15 14.5304 14.7893 15.0391 14.4142 15.4142C14.0391 15.7893 13.5304 16 13 16H7C6.46957 16 5.96086 15.7893 5.58579 15.4142C5.21071 15.0391 5 14.5304 5 14V8C5 7.46957 5.21071 6.96086 5.58579 6.58579C5.96086 6.21071 6.46957 6 7 6H9L10 7.5H13C13.5304 7.5 14.0391 7.71071 14.4142 8.08579C14.7893 8.46086 15 8.96957 15 9.5V14Z" stroke="#673AB7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgGradient: 'from-[#673AB7] to-[#9C27B0]'
    },
    { 
      id: 'memory', 
      name: 'Memory', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="18" height="18" rx="4" fill="white"/>
          <path d="M7 7V14M9 7V14M15 7V14M13 7V14M9 7H13M9 14H13M9 10.5H13M7 7H9M7 14H9M13 7H15M13 14H15" stroke="#FF5722" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgGradient: 'from-[#FF5722] to-[#FF9800]'
    }
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh]" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-black/80 backdrop-blur-xl w-full max-w-[680px] mx-4 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4CAF50] to-[#2196F3] rounded-2xl flex items-center justify-center shadow-lg">
              <Search size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-light text-white/90 mb-1">Smart Search</h2>
              <p className="text-sm text-gray-400">Search across your entire workspace</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all duration-200 group"
            aria-label="Close"
          >
            <X size={20} className="text-gray-400 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-8 py-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400/80" size={22} />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search conversations, files, projects..."
              className="w-full pl-14 pr-5 py-4 bg-white/95 backdrop-blur-sm border-2 border-[#4CAF50] rounded-2xl focus:outline-none focus:border-[#4CAF50] focus:ring-4 focus:ring-[#4CAF50]/20 text-gray-900 placeholder-gray-500 text-lg transition-all duration-300 shadow-lg"
            />
            {semanticSearch && (
              <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-600 font-medium">AI</span>
              </div>
            )}
          </div>
        </div>

        {!showResults ? (
          <>
            {/* Central Branding */}
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4CAF50] via-[#2196F3] to-[#9C27B0] rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16L12 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 8L12 10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 12L14 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 12L10 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M15 15L13.5 13.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 9L10.5 10.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M15 9L13.5 10.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 15L10.5 13.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-light text-white mb-3">Discover Everything</h3>
              <p className="text-gray-400 text-center max-w-md">Search across conversations, documents, projects, and memory with intelligent AI-powered results</p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 gap-6 px-8 pb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`group relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    selectedCategory === category.id ? 'ring-2 ring-[#4CAF50]/50 shadow-xl scale-105' : 'hover:bg-white'
                  }`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.bgGradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    {category.icon}
                  </div>
                  <span className="text-gray-900 font-semibold text-lg mb-2">{category.name}</span>
                  <span className="text-gray-500 text-sm text-center">
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
              <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">⌘K</kbd>
                  Quick search
                </span>
                <span>•</span>
                <span className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">↑↓</kbd>
                  Navigate
                </span>
                <span>•</span>
                <span className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">Tab</kbd>
                  Categories
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6 px-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Search Results</h3>
                <p className="text-gray-400 text-sm">Found {searchResults.length} results for "{searchQuery}"</p>
              </div>
              <button
                onClick={resetSearch}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all duration-200 text-sm font-medium hover:scale-105"
              >
                New Search
              </button>
            </div>

            {/* Results */}
            <div className="space-y-4 max-h-96 overflow-y-auto px-8 pb-8">
              {isSearching ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#4CAF50] to-[#2196F3] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">Searching...</h4>
                  <p className="text-gray-400 text-sm">Looking through your content with AI</p>
                </div>
              ) : searchResults.length === 0 && searchQuery ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search size={28} className="text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">No Results Found</h4>
                  <p className="text-gray-400 text-sm">Try adjusting your search query or filters</p>
                </div>
              ) : (
                searchResults.map((result, i) => (
                  <div
                    key={i}
                    ref={el => resultRefs.current[i] = el}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                      i === activeResultIdx 
                        ? 'ring-2 ring-[#4CAF50] bg-white/10 border-[#4CAF50]/30 shadow-xl' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                    onClick={() => handleResultClick(result, i)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1.5 bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-white text-xs font-medium rounded-full shadow-sm`}>
                        {result.type}
                      </span>
                      {result.location && (
                        <span className="text-gray-400 text-xs">in {result.location}</span>
                      )}
                    </div>
                    <div className="text-white/90 leading-relaxed text-sm">
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
        <div className="flex items-center justify-between px-8 py-4 bg-white/5 border-t border-white/10">
          <div className="text-sm text-gray-400">
            {showResults ? `${searchResults.length} results` : 'Ready to search'}
          </div>
          <div className="text-sm text-gray-400">
            {showResults ? '↑↓ navigate, Enter select' : '↑↓ navigate categories'}
          </div>
        </div>
      </div>
    </div>
  );
}