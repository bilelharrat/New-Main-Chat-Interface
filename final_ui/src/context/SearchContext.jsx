import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    user: true,
    ai: true,
    notes: true,
    todos: true,
    write: true
  });
  const [semanticSearch, setSemanticSearch] = useState(false);
  const [semanticLoading, setSemanticLoading] = useState(false);
  const [activeResultIdx, setActiveResultIdx] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Highlight state for search result jumps
  const [highlightedMsgIdx, setHighlightedMsgIdx] = useState(null);
  const [highlightedQuery, setHighlightedQuery] = useState('');
  const [highlightedNotes, setHighlightedNotes] = useState(false);
  const [highlightedWrite, setHighlightedWrite] = useState(false);
  const [highlightedTodo, setHighlightedTodo] = useState({ panel: null, id: null });

  const resultRefs = useRef([]);

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('eden-search-history');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    }
  }, []);

  // Save search history to localStorage
  const saveSearchHistory = (history) => {
    try {
      localStorage.setItem('eden-search-history', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  // Add query to search history
  const addToHistory = (query) => {
    if (!query.trim()) return;
    
    const newHistory = [
      query,
      ...searchHistory.filter(item => item !== query)
    ].slice(0, 10); // Keep only last 10 searches
    
    setSearchHistory(newHistory);
    saveSearchHistory(newHistory);
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('eden-search-history');
  };

  // Fuzzy match function (always enabled)
  const fuzzyMatch = (a, b) => {
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
  };

  // Get all match indices for highlighting
  const getAllMatchIndices = (text, query) => {
    const indices = [];
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    let index = lowerText.indexOf(lowerQuery);
    while (index !== -1) {
      indices.push(index);
      index = lowerText.indexOf(lowerQuery, index + 1);
    }
    return indices;
  };

  // Placeholder for semantic search API
  const fetchSemanticResults = async (query) => {
    // TODO: Replace with real API call to OpenAI/embeddings
    // Return: [{ type, location, snippet, onClick }]
    return new Promise(resolve => setTimeout(() => resolve([]), 1200));
  };

  // Smart search function that can be called from anywhere
  const performSmartSearch = async (query, data = {}) => {
    if (!query.trim()) {
      setSearchResults([]);
      setActiveResultIdx(0);
      return;
    }

    // Add to search history
    addToHistory(query);

    setIsSearching(true);
    const q = query.toLowerCase();
    const results = [];

    // Always use fuzzy matching for better UX
    const matchFn = fuzzyMatch;

    // Search chat messages (always enabled by default)
    if (data.messages && (searchFilters.user || searchFilters.ai)) {
      data.messages.forEach((msg, idx) => {
        if (
          ((msg.role === 'user' && searchFilters.user) || (msg.role === 'ai' && searchFilters.ai)) &&
          matchFn(msg.content, q)
        ) {
          const matchIndices = getAllMatchIndices(msg.content, query);
          results.push({
            type: msg.role === 'user' ? 'User Message' : 'AI Message',
            location: `Message #${idx + 1}`,
            snippet: msg.content.length > 120 ? msg.content.slice(0, 120) + '...' : msg.content,
            matchIndices,
            onClick: () => {
              // Navigate to message and highlight
              setHighlightedMsgIdx(idx);
              setHighlightedQuery(query);
              setTimeout(() => {
                setHighlightedMsgIdx(null);
                setHighlightedQuery('');
              }, 2000);
            }
          });
        }
      });
    }

    // Search notes
    if (data.notes && searchFilters.notes && matchFn(data.notes, q)) {
      const matchIndices = getAllMatchIndices(data.notes, query);
      results.push({
        type: 'Note',
        location: 'Notes Panel',
        snippet: data.notes.length > 120 ? data.notes.slice(0, 120) + '...' : data.notes,
        matchIndices,
        onClick: () => {
          setHighlightedNotes(true);
          setHighlightedQuery(query);
          setTimeout(() => {
            setHighlightedNotes(false);
            setHighlightedQuery('');
          }, 2000);
        }
      });
    }

    // Search write content
    if (data.writeContent && searchFilters.write && matchFn(data.writeContent, q)) {
      const matchIndices = getAllMatchIndices(data.writeContent, query);
      results.push({
        type: 'Write',
        location: 'Write Panel',
        snippet: data.writeContent.length > 120 ? data.writeContent.slice(0, 120) + '...' : data.writeContent,
        matchIndices,
        onClick: () => {
          setHighlightedWrite(true);
          setHighlightedQuery(query);
          setTimeout(() => {
            setHighlightedWrite(false);
            setHighlightedQuery('');
          }, 2000);
        }
      });
    }

    // Search todos
    if (data.notesTodos && searchFilters.todos) {
      data.notesTodos.forEach((todo) => {
        if (matchFn(todo.text, q)) {
          const matchIndices = getAllMatchIndices(todo.text, query);
          results.push({
            type: 'To-Do',
            location: 'Notes',
            snippet: todo.text.length > 120 ? todo.text.slice(0, 120) + '...' : todo.text,
            matchIndices,
            onClick: () => {
              setHighlightedTodo({ panel: 'notes', id: todo.id });
              setHighlightedQuery(query);
              setTimeout(() => {
                setHighlightedTodo({ panel: null, id: null });
                setHighlightedQuery('');
              }, 2000);
            }
          });
        }
      });
    }

    if (data.writeTodos && searchFilters.todos) {
      data.writeTodos.forEach((todo) => {
        if (matchFn(todo.text, q)) {
          const matchIndices = getAllMatchIndices(todo.text, query);
          results.push({
            type: 'To-Do',
            location: 'Write',
            snippet: todo.text.length > 120 ? todo.text.slice(0, 120) + '...' : todo.text,
            matchIndices,
            onClick: () => {
              setHighlightedTodo({ panel: 'write', id: todo.id });
              setHighlightedQuery(query);
              setTimeout(() => {
                setHighlightedTodo({ panel: null, id: null });
                setHighlightedQuery('');
              }, 2000);
            }
          });
        }
      });
    }

    // If no data provided, create mock results for demonstration
    if (Object.keys(data).length === 0) {
      const mockResults = [
        {
          type: 'User Message',
          location: 'Chat #3',
          snippet: `I need help with ${query} implementation...`,
          onClick: () => console.log('Navigate to user message about:', query)
        },
        {
          type: 'AI Message', 
          location: 'Chat #3',
          snippet: `Here's how you can implement ${query} effectively...`,
          onClick: () => console.log('Navigate to AI response about:', query)
        },
        {
          type: 'Note',
          location: 'Notes Panel',
          snippet: `Important reminder about ${query} - need to follow up...`,
          onClick: () => console.log('Navigate to note about:', query)
        },
        {
          type: 'To-Do',
          location: 'Notes',
          snippet: `Complete the ${query} project by Friday`,
          onClick: () => console.log('Navigate to todo about:', query)
        }
      ].filter(item => 
        matchFn(item.snippet, q) && 
        searchFilters[item.type.toLowerCase().replace(' ', '')]
      );
      
      results.push(...mockResults);
    }

    setSearchResults(results);
    setActiveResultIdx(0);
    setIsSearching(false);

    // Semantic search (AI)
    if (semanticSearch && query) {
      setSemanticLoading(true);
      try {
        const aiResults = await fetchSemanticResults(query);
        if (aiResults && aiResults.length > 0) {
          setSearchResults(prev => [
            ...prev,
            ...aiResults.map(r => ({ ...r, type: r.type + ' (Semantic)', semantic: true }))
          ]);
        }
      } catch (error) {
        console.error('Semantic search error:', error);
      } finally {
        setSemanticLoading(false);
      }
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setActiveResultIdx(0);
    setHighlightedMsgIdx(null);
    setHighlightedQuery('');
    setHighlightedNotes(false);
    setHighlightedWrite(false);
    setHighlightedTodo({ panel: null, id: null });
    setShowHistory(false);
  };

  // Navigate through results
  const navigateResults = (direction) => {
    if (searchResults.length === 0) return;
    
    if (direction === 'next') {
      setActiveResultIdx(prev => (prev + 1) % searchResults.length);
    } else {
      setActiveResultIdx(prev => (prev - 1 + searchResults.length) % searchResults.length);
    }
  };

  const value = {
    // State
    searchQuery,
    searchResults,
    searchFilters,
    semanticSearch,
    semanticLoading,
    activeResultIdx,
    isSearching,
    highlightedMsgIdx,
    highlightedQuery,
    highlightedNotes,
    highlightedWrite,
    highlightedTodo,
    resultRefs,
    searchHistory,
    showHistory,
    
    // Actions
    setSearchQuery,
    setSearchFilters,
    setSemanticSearch,
    setActiveResultIdx,
    performSmartSearch,
    clearSearch,
    navigateResults,
    fuzzyMatch,
    getAllMatchIndices,
    addToHistory,
    clearHistory,
    setShowHistory
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}; 