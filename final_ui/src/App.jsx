import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Settings, MemoryStick, Search } from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SearchProvider } from './context/SearchContext';
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';
import PromptConsole from './components/Views/PromptConsole';
import Files from './components/Views/Files';
import Projects from './components/Views/Projects';
import ResearchMode from './components/Views/ResearchMode';
import MemoryRetrieval from './components/Views/MemoryRetrieval';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ForgotPassword from './components/Auth/ForgotPassword';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

// --- Helper Components ---
const LightCard = ({ children, className = '', ...props }) => (
  <div className={`bg-white dark:bg-black border border-gray-200/80 dark:border-gray-700 rounded-2xl shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const StyledToggle = ({ label, isChecked, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
        <div className="relative">
            <input type="checkbox" className="sr-only peer" checked={isChecked} onChange={onChange} />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-accent-light dark:peer-focus:ring-accent-light peer-checked:bg-accent transition"></div>
            <div className="absolute left-1 top-1 bg-white border-gray-300 border rounded-full h-4 w-4 transition peer-checked:translate-x-full peer-checked:border-white"></div>
        </div>
    </label>
);

const SectionHeader = ({ title, subtitle }) => (
    <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
    </div>
);

// --- Main Components ---

const SettingsPanel = ({ darkMode, toggleDarkMode, accentColor, setAccentColor }) => {
    const [activeSection, setActiveSection] = useState('general');
    const [toggleStates, setToggleStates] = useState({
        dontLearn: false,
        incognito: false,
        redactInfo: true,
        warnCost: true,
        autoSwap: false,
        highContrast: false,
        reducedMotion: false,
        reportHallucination: true
    });

    const accentOptions = [
        { name: 'Blue', color: '#3B82F6', darkColor: '#60A5FA' },
        { name: 'Purple', color: '#8B5CF6', darkColor: '#A78BFA' },
        { name: 'Green', color: '#10B981', darkColor: '#34D399' },
        { name: 'Orange', color: '#F59E0B', darkColor: '#FBBF24' },
        { name: 'Red', color: '#EF4444', darkColor: '#F87171' }
    ];

    const sections = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'memory', label: 'Memory & Privacy', icon: MemoryStick },
        { id: 'cost', label: 'Token & Cost', icon: Settings },
        { id: 'ui', label: 'UI / Accessibility', icon: Settings },
        { id: 'keys', label: 'API Keys', icon: Settings },
        { id: 'support', label: 'Feedback & Support', icon: Settings }
    ];

    const handleToggleChange = (name) => {
        setToggleStates(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'general':
                return (
                    <div>
                        <SectionHeader title="General Settings" subtitle="Configure your basic preferences and account settings." />
                        <LightCard className="mt-6 p-6 divide-y divide-gray-200 dark:divide-gray-700">
                            <StyledToggle label="Dark Mode" isChecked={darkMode} onChange={toggleDarkMode} />
                            <StyledToggle label="Auto-save conversations" isChecked={toggleStates.autoSave} onChange={() => handleToggleChange('autoSave')} />
                            <StyledToggle label="Show typing indicators" isChecked={toggleStates.typingIndicators} onChange={() => handleToggleChange('typingIndicators')} />
                        </LightCard>
                    </div>
                );
            case 'memory':
                return (
                    <div>
                        <SectionHeader title="Memory & Privacy" subtitle="Control how your data is stored and used." />
                        <LightCard className="mt-6 p-6 divide-y divide-gray-200 dark:divide-gray-700">
                            <StyledToggle label="Don't learn from this session" isChecked={toggleStates.dontLearn} onChange={() => handleToggleChange('dontLearn')} />
                            <StyledToggle label="Incognito prompt (not stored or logged)" isChecked={toggleStates.incognito} onChange={() => handleToggleChange('incognito')} />
                            <StyledToggle label="Redact sensitive info automatically" isChecked={toggleStates.redactInfo} onChange={() => handleToggleChange('redactInfo')} />
                        </LightCard>
                    </div>
                );
            case 'cost':
                return (
                    <div>
                        <SectionHeader title="Token & Cost Controls" subtitle="Set limits and alerts to manage your spending." />
                        <LightCard className="mt-6 p-6">
                            <label className="block">
                                <span className="text-gray-700 dark:text-gray-300 font-medium">Daily Token Limit</span>
                                <input type="number" placeholder="e.g., 1000000" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-accent focus:ring-accent" />
                            </label>
                        </LightCard>
                        <LightCard className="mt-4 p-6 divide-y divide-gray-200 dark:divide-gray-700">
                            <StyledToggle label="Warn if cost > $1 per output" isChecked={toggleStates.warnCost} onChange={() => handleToggleChange('warnCost')} />
                            <StyledToggle label="Auto-swap to cheaper model if latency > 5s" isChecked={toggleStates.autoSwap} onChange={() => handleToggleChange('autoSwap')} />
                        </LightCard>
                    </div>
                );
            case 'ui':
                return (
                    <div>
                        <SectionHeader title="UI / Accessibility" subtitle="Customize the look and feel of the application." />
                        <LightCard className="mt-6 p-6 divide-y divide-gray-200 dark:divide-gray-700">
                            <StyledToggle label="Dark Mode" isChecked={darkMode} onChange={toggleDarkMode} />
                            <StyledToggle label="High Contrast Mode" isChecked={toggleStates.highContrast} onChange={() => handleToggleChange('highContrast')} />
                            <StyledToggle label="Reduced Motion" isChecked={toggleStates.reducedMotion} onChange={() => handleToggleChange('reducedMotion')} />
                        </LightCard>
                        <LightCard className="mt-4 p-6">
                            <h3 className="font-semibold text-lg dark:text-white mb-3">Theme Accent</h3>
                            <div className="flex gap-4">
                                {accentOptions.map(opt => (
                                    <button 
                                        key={opt.name} 
                                        onClick={() => setAccentColor(opt)} 
                                        className="w-8 h-8 rounded-full" 
                                        style={{
                                            backgroundColor: opt.color, 
                                            ...(accentColor.name === opt.name && {boxShadow: `0 0 0 3px ${darkMode ? opt.darkColor : opt.color}`})
                                        }}
                                    />
                                ))}
                            </div>
                        </LightCard>
                    </div>
                );
            case 'keys':
                return (
                    <div>
                        <SectionHeader title="API Keys & Integrations" subtitle="Connect to model providers and other services." />
                        <LightCard className="mt-6 p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">OpenAI API Key</label>
                                <input type="password" defaultValue="••••••••••••••••••••••••" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-accent focus:ring-accent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Anthropic API Key</label>
                                <input type="password" placeholder="Enter your Anthropic key" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-accent focus:ring-accent" />
                            </div>
                            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">Add New Provider</button>
                        </LightCard>
                    </div>
                );
            case 'support':
                return (
                    <div>
                        <SectionHeader title="Feedback & Support" subtitle="Get help and share your thoughts." />
                        <LightCard className="mt-6 p-6">
                            <div className="flex flex-col gap-3">
                                <button className="text-left font-medium text-accent dark:text-accent-light hover:underline">Submit a Feature Request</button>
                                <button className="text-left font-medium text-accent dark:text-accent-light hover:underline">Join Community on Discord</button>
                                <button className="text-left font-medium text-accent dark:text-accent-light hover:underline">View Changelog / What's New</button>
                            </div>
                        </LightCard>
                        <LightCard className="mt-4 p-3">
                            <StyledToggle label="Enable 'Report Hallucination' button" isChecked={toggleStates.reportHallucination} onChange={() => handleToggleChange('reportHallucination')} />
                        </LightCard>
                    </div>
                );
            default:
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{activeSection.replace('_', ' ')}</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Settings for this section are under development.</p>
                    </div>
                );
        }
    }
    
    return (
        <div className="flex-1 flex bg-gray-50 dark:bg-black overflow-hidden">
            <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
                <nav className="space-y-1">
                    {sections.map(section => (
                        <button 
                            key={section.id} 
                            onClick={() => setActiveSection(section.id)} 
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition ${
                                activeSection === section.id 
                                    ? 'bg-accent/10 text-accent dark:text-accent-light font-semibold' 
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <section.icon size={20} />
                            <span>{section.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
            <div className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
                {renderSection()}
            </div>
        </div>
    );
};

function AppShell() {
    const { darkMode, toggleDarkMode, accentColor, setAccentColor } = useTheme();
    const [currentView, setCurrentView] = useState('prompt-console');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Move useKeyboardShortcuts before any conditional returns
    useKeyboardShortcuts();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
    }, []);

    const handleLogin = (token) => {
        localStorage.setItem('authToken', token);
        setIsAuthenticated(true);
        setCurrentView('prompt-console'); // Redirect to main app after login
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
    };

    const handleLoginClick = () => {
        // Navigate to login page properly
        setCurrentView('login');
    };

    if (!isAuthenticated) {
        return (
            <Router>
                <Routes>
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/signup" element={<Signup onSignup={handleLogin} />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        );
    }

    const renderView = () => {
        switch (currentView) {
            case 'prompt-console':
                return <PromptConsole setView={setCurrentView} />;
            case 'files':
                return <Files />;
            case 'projects':
                return <Projects />;
            case 'research-mode':
                return <ResearchMode />;
            case 'memory-retrieval':
                return <MemoryRetrieval />;
            case 'settings':
                return <SettingsPanel darkMode={darkMode} toggleDarkMode={toggleDarkMode} accentColor={accentColor} setAccentColor={setAccentColor} />;
            case 'login':
                return <Login onLogin={handleLogin} />;
            case 'signup':
                return <Signup onSignup={handleLogin} />;
            case 'forgot-password':
                return <ForgotPassword />;
            default:
                return <PromptConsole setView={setCurrentView} />;
        }
    };

    return (
        <Router>
            {/* Show full screen auth pages */}
            {(currentView === 'login' || currentView === 'forgot-password') ? (
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
                        <Topbar 
                            onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            onSettingsClick={() => setShowSettings(!showSettings)}
                            darkMode={darkMode}
                            toggleDarkMode={toggleDarkMode}
                            onLoginClick={handleLoginClick}
                        />
                        <main className="flex-1 overflow-hidden">
                            {renderView()}
                        </main>
                    </div>
                </div>
            )}
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