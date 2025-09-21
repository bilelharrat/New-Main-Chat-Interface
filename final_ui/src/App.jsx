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
  <div className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 rounded-3xl shadow-lg shadow-gray-200/20 dark:shadow-gray-900/20 ${className}`} {...props}>
    {children}
  </div>
);

const StyledToggle = ({ label, isChecked, onChange, description }) => (
    <label className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 rounded-xl transition-all duration-200 group">
        <div className="flex-1">
            <span className="text-gray-900 dark:text-white font-medium text-base">{label}</span>
            {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
            )}
        </div>
        <div className="relative ml-4">
            <input type="checkbox" className="sr-only peer" checked={isChecked} onChange={onChange} />
            <div className={`w-12 h-7 rounded-full peer transition-all duration-300 ease-in-out ${
                isChecked 
                    ? 'bg-blue-500 shadow-lg shadow-blue-500/30' 
                    : 'bg-gray-300 dark:bg-gray-600'
            }`}></div>
            <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-6 w-6 transition-all duration-300 ease-in-out shadow-sm ${
                isChecked ? 'translate-x-5' : 'translate-x-0'
            }`}></div>
        </div>
    </label>
);

const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-8">
        <h2 className="text-3xl font-light text-gray-900 dark:text-white tracking-tight">{title}</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg leading-relaxed">{subtitle}</p>
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
        { name: 'Apple Blue', color: '#007AFF', darkColor: '#5AC8FA' },
        { name: 'Apple Green', color: '#30D158', darkColor: '#4CAF50' },
        { name: 'Apple Orange', color: '#FF9500', darkColor: '#FFB340' },
        { name: 'Apple Red', color: '#FF3B30', darkColor: '#FF6961' }
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
                        <SectionHeader title="General" subtitle="Configure your basic preferences and account settings." />
                        <LightCard className="p-2">
                            <StyledToggle 
                                label="Dark Mode" 
                                isChecked={darkMode} 
                                onChange={toggleDarkMode}
                                description="Switch between light and dark appearance"
                            />
                            <div className="border-t border-gray-200/60 dark:border-gray-700/60"></div>
                            <StyledToggle 
                                label="Auto-save conversations" 
                                isChecked={toggleStates.autoSave} 
                                onChange={() => handleToggleChange('autoSave')}
                                description="Automatically save your chat history"
                            />
                            <div className="border-t border-gray-200/60 dark:border-gray-700/60"></div>
                            <StyledToggle 
                                label="Show typing indicators" 
                                isChecked={toggleStates.typingIndicators} 
                                onChange={() => handleToggleChange('typingIndicators')}
                                description="Display when AI is typing a response"
                            />
                        </LightCard>
                    </div>
                );
            case 'memory':
                return (
                    <div>
                        <SectionHeader title="Privacy & Data" subtitle="Control how your data is stored and used." />
                        <LightCard className="p-2">
                            <StyledToggle 
                                label="Don't learn from this session" 
                                isChecked={toggleStates.dontLearn} 
                                onChange={() => handleToggleChange('dontLearn')}
                                description="Prevent AI from learning from your current conversation"
                            />
                            <div className="border-t border-gray-200/60 dark:border-gray-700/60"></div>
                            <StyledToggle 
                                label="Incognito mode" 
                                isChecked={toggleStates.incognito} 
                                onChange={() => handleToggleChange('incognito')}
                                description="Prompts won't be stored or logged anywhere"
                            />
                            <div className="border-t border-gray-200/60 dark:border-gray-700/60"></div>
                            <StyledToggle 
                                label="Auto-redact sensitive info" 
                                isChecked={toggleStates.redactInfo} 
                                onChange={() => handleToggleChange('redactInfo')}
                                description="Automatically detect and hide personal information"
                            />
                        </LightCard>
                    </div>
                );
            case 'cost':
                return (
                    <div>
                        <SectionHeader title="Usage & Billing" subtitle="Set limits and alerts to manage your spending." />
                        <LightCard className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-900 dark:text-white font-medium text-base mb-2">Daily Token Limit</label>
                                    <input 
                                        type="number" 
                                        placeholder="e.g., 1,000,000" 
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200" 
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Set a daily limit to control your usage</p>
                                </div>
                            </div>
                        </LightCard>
                        <LightCard className="mt-6 p-2">
                            <StyledToggle 
                                label="Cost warnings" 
                                isChecked={toggleStates.warnCost} 
                                onChange={() => handleToggleChange('warnCost')}
                                description="Alert when individual responses cost more than $1"
                            />
                            <div className="border-t border-gray-200/60 dark:border-gray-700/60"></div>
                            <StyledToggle 
                                label="Auto-optimize for speed" 
                                isChecked={toggleStates.autoSwap} 
                                onChange={() => handleToggleChange('autoSwap')}
                                description="Switch to faster models when response time exceeds 5 seconds"
                            />
                        </LightCard>
                    </div>
                );
            case 'ui':
                return (
                    <div>
                        <SectionHeader title="Appearance" subtitle="Customize the look and feel of the application." />
                        <LightCard className="p-2">
                            <StyledToggle 
                                label="Dark Mode" 
                                isChecked={darkMode} 
                                onChange={toggleDarkMode}
                                description="Switch between light and dark appearance"
                            />
                            <div className="border-t border-gray-200/60 dark:border-gray-700/60"></div>
                            <StyledToggle 
                                label="High Contrast" 
                                isChecked={toggleStates.highContrast} 
                                onChange={() => handleToggleChange('highContrast')}
                                description="Increase contrast for better visibility"
                            />
                            <div className="border-t border-gray-200/60 dark:border-gray-700/60"></div>
                            <StyledToggle 
                                label="Reduce Motion" 
                                isChecked={toggleStates.reducedMotion} 
                                onChange={() => handleToggleChange('reducedMotion')}
                                description="Minimize animations and transitions"
                            />
                        </LightCard>
                        <LightCard className="mt-6 p-6">
                            <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-4">Accent Color</h3>
                            <div className="flex gap-3">
                                {accentOptions.map(opt => (
                                    <button 
                                        key={opt.name} 
                                        onClick={() => setAccentColor(opt)} 
                                        className={`w-12 h-12 rounded-2xl transition-all duration-200 hover:scale-110 ${
                                            accentColor.name === opt.name ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : ''
                                        }`}
                                        style={{ backgroundColor: opt.color }}
                                        title={opt.name}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Choose your preferred accent color</p>
                        </LightCard>
                    </div>
                );
            case 'keys':
                return (
                    <div>
                        <SectionHeader title="API Keys" subtitle="Connect to model providers and other services." />
                        <LightCard className="p-6 space-y-6">
                            <div>
                                <label className="block text-gray-900 dark:text-white font-medium text-base mb-2">OpenAI API Key</label>
                                <input 
                                    type="password" 
                                    defaultValue="••••••••••••••••••••••••" 
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-gray-900 dark:text-white transition-all duration-200" 
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Your OpenAI API key for GPT models</p>
                            </div>
                            <div>
                                <label className="block text-gray-900 dark:text-white font-medium text-base mb-2">Anthropic API Key</label>
                                <input 
                                    type="password" 
                                    placeholder="Enter your Anthropic key" 
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-gray-900 dark:text-white transition-all duration-200" 
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Your Anthropic API key for Claude models</p>
                            </div>
                            <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                                Add New Provider
                            </button>
                        </LightCard>
                    </div>
                );
            case 'support':
                return (
                    <div>
                        <SectionHeader title="Support" subtitle="Get help and share your thoughts." />
                        <LightCard className="p-6">
                            <div className="space-y-4">
                                <button className="w-full text-left p-4 rounded-2xl hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all duration-200 group">
                                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Submit a Feature Request</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Share your ideas for new features</div>
                                </button>
                                <button className="w-full text-left p-4 rounded-2xl hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all duration-200 group">
                                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Join Community on Discord</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Connect with other users and get help</div>
                                </button>
                                <button className="w-full text-left p-4 rounded-2xl hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all duration-200 group">
                                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">View Changelog</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">See what's new in the latest updates</div>
                                </button>
                            </div>
                        </LightCard>
                        <LightCard className="mt-6 p-2">
                            <StyledToggle 
                                label="Report Hallucination" 
                                isChecked={toggleStates.reportHallucination} 
                                onChange={() => handleToggleChange('reportHallucination')}
                                description="Enable the button to report AI hallucinations"
                            />
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
        <div className="flex-1 flex bg-gray-50/50 dark:bg-gray-950 overflow-hidden">
            {/* Sidebar */}
            <div className="w-72 border-r border-gray-200/60 dark:border-gray-700/60 p-6 overflow-y-auto bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl">
                <h1 className="text-2xl font-light text-gray-900 dark:text-white mb-8 tracking-tight">Settings</h1>
                <nav className="space-y-2">
                    {sections.map(section => (
                        <button 
                            key={section.id} 
                            onClick={() => setActiveSection(section.id)} 
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-left transition-all duration-200 ${
                                activeSection === section.id 
                                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium shadow-sm' 
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/60 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <section.icon size={20} className="flex-shrink-0" />
                            <span className="text-base">{section.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 p-8 sm:p-12 md:p-16 overflow-y-auto bg-gradient-to-br from-gray-50/30 to-white/50 dark:from-gray-900/30 dark:to-gray-800/50">
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

    const handleCloseAuth = () => {
        // Close auth modal and return to main app
        setCurrentView('prompt-console');
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