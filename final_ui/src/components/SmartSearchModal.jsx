import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Minimize2, ChevronLeft, ChevronRight, Search, Zap } from 'lucide-react';
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
    fuzzyMatch,
    getAllMatchIndices,
  } = useSearch();

  const [fullscreen, setFullscreen] = useState(false);
  const [fuzzySearch] = useState(true); // Always enabled
  const [activeMatchIdx, setActiveMatchIdx] = useState(0);
  const resultRefs = useRef([]);

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
      if (searchResults.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setActiveMatchIdx(0);
          if (activeResultIdx < searchResults.length - 1) {
            setSearchFilters((f) => ({ ...f })); // force rerender
            setTimeout(() => {
              resultRefs.current[activeResultIdx + 1]?.focus?.();
            }, 0);
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setActiveMatchIdx(0);
          if (activeResultIdx > 0) {
            setSearchFilters((f) => ({ ...f })); // force rerender
            setTimeout(() => {
              resultRefs.current[activeResultIdx - 1]?.focus?.();
            }, 0);
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, searchResults, activeResultIdx, setSearchFilters]);

  // Highlight query in text
  function highlightQuery(text, query, matchIndices = [], activeIdx = 0) {
    if (!query) return text;
    if (!matchIndices || matchIndices.length === 0) {
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const parts = text.split(regex);
      return parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} className="bg-blue-100 text-blue-700 px-0.5 rounded-sm">{part}</mark>
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
          className={`px-0.5 rounded-sm ${i === activeIdx ? 'bg-blue-300 text-blue-900' : 'bg-blue-100 text-blue-700'}`}
        >
          {text.slice(idx, idx + query.length)}
        </mark>
      );
      lastIdx = idx + query.length;
    });
    parts.push(text.slice(lastIdx));
    return parts;
  }

  // Modal size classes
  const modalClass = fullscreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/40'
    : 'fixed inset-0 z-50 flex items-center justify-center bg-black/30';
  const contentClass = fullscreen
    ? 'bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full h-full max-w-full max-h-full flex flex-col p-8'
    : 'bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-2xl w-full p-6 flex flex-col relative';

  return open ? (
    <div className={modalClass}>
      <div className={contentClass}>
        {/* Expand/contract button */}
        <button
          className="absolute top-3 right-12 p-2 text-gray-400 hover:text-blue-600"
          onClick={() => setFullscreen(f => !f)}
          title={fullscreen ? 'Contract' : 'Expand'}
        >
          {fullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
        {/* Close button */}
        <button
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-blue-600"
          onClick={onClose}
          title="Close"
        >
          <X size={20} />
        </button>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Search size={22} className="text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Smart Search</h2>
          <span className="ml-auto text-xs text-gray-400">Ctrl+K</span>
        </div>
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(searchFilters).map(([key, enabled]) => (
            <button
              key={key}
              onClick={() => setSearchFilters(f => ({ ...f, [key]: !f[key] }))}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition border ${
                enabled
                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                  : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
        {/* Fuzzy & Semantic toggles */}
        <div className="flex gap-6 mb-4 items-center">
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <input type="checkbox" checked={fuzzySearch} disabled className="accent-blue-500" />
            Fuzzy Search
          </label>
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <input type="checkbox" checked={semanticSearch} onChange={e => setSemanticSearch(e.target.checked)} className="accent-blue-500" />
            Semantic Search (AI)
          </label>
        </div>
        {/* Search input */}
        <input
          autoFocus
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="w-full px-4 py-3 mb-4 rounded-lg border-2 border-blue-200 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        {/* Result navigation */}
        {searchResults.length > 0 && (
          <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
            <span>
              Result {activeResultIdx + 1} of {searchResults.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => activeResultIdx > 0 && setSearchFilters(f => ({ ...f }))}
                disabled={activeResultIdx === 0}
                className="p-1 rounded-full bg-gray-200 text-gray-600 disabled:opacity-40"
                title="Previous result"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => activeResultIdx < searchResults.length - 1 && setSearchFilters(f => ({ ...f }))}
                disabled={activeResultIdx === searchResults.length - 1}
                className="p-1 rounded-full bg-gray-200 text-gray-600 disabled:opacity-40"
                title="Next result"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {searchResults.length === 0 && searchQuery && !isSearching && (
            <div className="text-gray-500 text-base text-center py-12 flex flex-col items-center">
              <Search size={40} className="text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">No Results Found</h3>
              <p className="mt-1">Try adjusting your search query or filters.</p>
            </div>
          )}
          {searchResults.map((result, i) => (
            <div
              key={i}
              ref={el => resultRefs.current[i] = el}
              tabIndex={0}
              className={`p-4 mb-3 rounded-lg border cursor-pointer transition-all duration-200 group focus:ring-2 focus:ring-blue-300 outline-none ${
                i === activeResultIdx 
                  ? 'ring-2 ring-blue-400 bg-blue-50 border-blue-300' 
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 hover:border-blue-200'
              }`}
              onClick={() => {}}
            >
              <div className="text-sm font-semibold mb-1 flex items-center gap-2 text-blue-700">
                {result.type} {result.location && <span className="text-gray-400 font-normal">({result.location})</span>}
              </div>
              <div className="text-base text-gray-900 dark:text-white">
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
                    className="p-1 rounded-full bg-gray-200 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-100 focus:ring-2 focus:ring-blue-300"
                    title="Previous match (←)"
                    onClick={e => {
                      e.stopPropagation();
                      if (activeResultIdx === i && activeMatchIdx > 0) setActiveMatchIdx(activeMatchIdx - 1);
                    }}
                  ><ChevronLeft size={16} /></button>
                  <span className="text-xs select-none text-gray-500 font-mono">
                    {activeResultIdx === i ? activeMatchIdx + 1 : 1} / {result.matchIndices.length}
                  </span>
                  <button
                    disabled={activeResultIdx !== i || activeMatchIdx === result.matchIndices.length - 1}
                    className="p-1 rounded-full bg-gray-200 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-100 focus:ring-2 focus:ring-blue-300"
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
  ) : null;
} 