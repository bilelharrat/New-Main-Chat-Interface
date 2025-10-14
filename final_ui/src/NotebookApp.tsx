import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SearchProvider } from './context/SearchContext';
import StandaloneNotebook from './components/StandaloneNotebook';

export default function NotebookApp() {
  return (
    <ThemeProvider>
      <SearchProvider>
        <StandaloneNotebook />
      </SearchProvider>
    </ThemeProvider>
  );
}
