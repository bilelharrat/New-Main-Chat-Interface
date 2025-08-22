import { useEffect } from 'react';
import { useSearch } from '../context/SearchContext';

export const useKeyboardShortcuts = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    activeResultIdx, 
    navigateResults,
    clearSearch 
  } = useSearch();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="search"]');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // Escape to clear search or close modal
      if (event.key === 'Escape') {
        if (searchQuery) {
          clearSearch();
          setSearchQuery('');
        }
      }

      // Arrow keys to navigate search results (only when modal is open)
      if (searchResults.length > 0 && document.querySelector('.fixed.inset-0.z-50')) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          navigateResults('next');
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          navigateResults('prev');
        } else if (event.key === 'Enter' && activeResultIdx >= 0) {
          event.preventDefault();
          const activeResult = searchResults[activeResultIdx];
          if (activeResult && activeResult.onClick) {
            activeResult.onClick();
            clearSearch();
            setSearchQuery('');
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery, searchResults, activeResultIdx, navigateResults, clearSearch, setSearchQuery]);
}; 