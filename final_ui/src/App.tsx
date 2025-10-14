import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SearchProvider } from './context/SearchContext';
import Sidebar from './components/Layout/Sidebar';
import PromptConsole from './components/Views/PromptConsole';
import Files from './components/Views/Files';
import Folders from './components/Views/Folders';
import MemoryRetrieval from './components/Views/MemoryRetrieval';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ForgotPassword from './components/Auth/ForgotPassword';
import NotebookLayout from './components/Notebook/NotebookLayout';
import NotebookManager from './components/Views/NotebookManager';
import FlowDiagram from './app/flow/FlowDiagram';
import StandaloneNotebook from './components/StandaloneNotebook';

import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';


// --- Main Components ---

function AppShell() {
    const [currentView, setCurrentView] = useState('prompt-console');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Move useKeyboardShortcuts before any conditional returns
    useKeyboardShortcuts();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
    }, []);

    // Auto-collapse sidebar when entering notebook mode
    useEffect(() => {
        if (currentView === 'notebook-writer' || currentView === 'notebook-sources' || currentView === 'notebook-notes' || currentView === 'notebook') {
            setSidebarCollapsed(true);
        }
    }, [currentView]);

    const handleLogin = (token: string) => {
        localStorage.setItem('authToken', token);
        setIsAuthenticated(true);
        setCurrentView('prompt-console'); // Redirect to main app after login
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
    };


    const handleCloseAuth = () => {
        // Close auth modal and return to main app
        setCurrentView('prompt-console');
    };

    if (!isAuthenticated) {
        return (
            <Router>
                <Routes>
                    <Route path="/login" element={<Login onLogin={handleLogin} onClose={() => {}} />} />
                    <Route path="/signup" element={<Signup onSignup={handleLogin} onClose={() => {}} />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        );
    }

    const renderView = () => {
        switch (currentView) {
            case 'prompt-console':
                return <PromptConsole setView={setCurrentView} currentView={currentView} />;
            case 'notebook-writer':
                return <NotebookManager setView={setCurrentView} />;
            case 'notebook-sources':
                return <NotebookLayout setView={setCurrentView} currentView={currentView} />;
            case 'notebook-notes':
                return <NotebookLayout setView={setCurrentView} currentView={currentView} />;
            case 'notebook':
                return <NotebookLayout setView={setCurrentView} currentView={currentView} />;
            case 'flow-diagram':
                return <FlowDiagram />;
            case 'files':
                return <Files />;
            case 'folders':
                return <Folders setCurrentView={setCurrentView} />;
            case 'memory-retrieval':
                return <MemoryRetrieval />;


            case 'login':
                return <Login onLogin={handleLogin} onClose={handleCloseAuth} />;
            case 'signup':
                return <Signup onSignup={handleLogin} onClose={handleCloseAuth} />;
            case 'forgot-password':
                return <ForgotPassword />;
            default:
                return <PromptConsole setView={setCurrentView} />;
        }
    };

    return (
        <Router>
            <Routes>
                {/* Standalone Notebook Route */}
                <Route path="/notebook" element={<StandaloneNotebook />} />
                
                {/* All other routes */}
                <Route path="*" element={
                    /* Show full screen auth pages */
                    (currentView === 'login' || currentView === 'forgot-password') ? (
                        <div className="h-screen w-screen">
                            {renderView()}
                        </div>
                    ) : (
                        <div className="flex h-screen bg-gray-50 dark:bg-black overflow-hidden">
                            <Sidebar 
                                currentView={currentView} 
                                setCurrentView={setCurrentView} 
                                collapsed={sidebarCollapsed}
                                setCollapsed={setSidebarCollapsed}
                                onLogout={handleLogout}
                            />
                            <div className="flex-1 flex flex-col">
                                <main className="flex-1 overflow-hidden">
                                    {renderView()}
                                </main>
                            </div>
                        </div>
                    )
                } />
            </Routes>
        </Router>
    );
}

export default function App() {
  return (
    <ThemeProvider>
      <SearchProvider>
        <AppShell />
      </SearchProvider>
    </ThemeProvider>
  );
} 