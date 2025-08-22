import React, { useState, useEffect, useRef } from 'react';
import { 
  Files, 
  GitBranchPlus, 
  Database, 
  Send, 
  Sun, 
  Moon, 
  FileCode, 
  FileDiff, 
  FilePlus, 
  Table, 
  Terminal, 
  Sparkles,
  X
} from 'lucide-react';

const CodingMode = ({ onClose }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeView, setActiveView] = useState('explorer');
  const [activeTab, setActiveTab] = useState('editor');
  const [code, setCode] = useState(`function App() {
  return (
    <div className="app">
      <h1>Hello, World!</h1>
    </div>
  );
}`);
  const [apiResponse, setApiResponse] = useState(`[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" }
]`);
  const [terminalOutput, setTerminalOutput] = useState(`> npm run dev
VITE v5.2.0 ready in 320 ms`);
  const [aiMessages, setAiMessages] = useState([
    { role: 'ai', content: 'Hello! How can I help you refactor, debug, or explain your code today?' },
    { role: 'user', content: 'Explain the current function.' }
  ]);
  const [aiInput, setAiInput] = useState('');

  // Panel sizing refs
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const bottomPanelRef = useRef(null);

  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Note: Lucide icons are already available through the import, so we don't need to load them externally
    // The script loading was causing issues with cleanup functions

    return () => {
      // Cleanup function - no external scripts to clean up
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
    // Remove the Lucide icons recreation as it's not needed and may cause issues
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSendAI = (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const newMessage = { role: 'user', content: aiInput };
    setAiMessages(prev => [...prev, newMessage]);
    setAiInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = { role: 'ai', content: `I understand you said: "${aiInput}". How can I help you with that?` };
      setAiMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleApiRequest = () => {
    // Simulate API request
    setApiResponse(`[
  { "id": 1, "name": "Alice", "email": "alice@example.com" },
  { "id": 2, "name": "Bob", "email": "bob@example.com" },
  { "id": 3, "name": "Charlie", "email": "charlie@example.com" }
]`);
  };

  return (
    <div className={`flex h-screen w-screen text-sm ${isDarkMode ? 'dark' : ''}`} style={{
      '--bg-primary': isDarkMode ? '#111319' : '#F7F8FA',
      '--bg-secondary': isDarkMode ? '#1A1D25' : '#FFFFFF',
      '--bg-tertiary': isDarkMode ? '#232731' : '#F1F3F6',
      '--border-primary': isDarkMode ? '#30363D' : '#E4E7EB',
      '--border-secondary': isDarkMode ? '#424953' : '#D8DCE1',
      '--text-primary': isDarkMode ? '#F0F6FC' : '#181C2A',
      '--text-secondary': isDarkMode ? '#A0A7B5' : '#697081',
      '--text-tertiary': isDarkMode ? '#7D8590' : '#8F96A8',
      '--accent-primary': isDarkMode ? '#58A6FF' : '#4A69FF',
      '--accent-primary-hover': isDarkMode ? '#4A8ADF' : '#3B54CC',
      '--accent-primary-text': isDarkMode ? '#0D1117' : '#FFFFFF',
      '--code-bg': isDarkMode ? '#010409' : '#0D1117',
      '--code-text': isDarkMode ? '#E6EDF3' : '#C9D1D9',
      '--code-border': isDarkMode ? '#21262D' : '#30363D',
      '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
    }}>
      {/* Activity Bar (Far Left) */}
      <div className="bg-secondary border-r border-primary flex flex-col items-center justify-between py-2">
        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={() => handleViewChange('explorer')}
            className={`activity-btn p-3 rounded-lg ${activeView === 'explorer' ? 'active' : ''}`}
          >
            <Files className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleViewChange('source-control')}
            className={`activity-btn p-3 rounded-lg ${activeView === 'source-control' ? 'active' : ''}`}
          >
            <GitBranchPlus className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleViewChange('database')}
            className={`activity-btn p-3 rounded-lg ${activeView === 'database' ? 'active' : ''}`}
          >
            <Database className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleViewChange('api-client')}
            className={`activity-btn p-3 rounded-lg ${activeView === 'api-client' ? 'active' : ''}`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button onClick={toggleTheme} className="p-3 rounded-lg text-secondary hover:bg-tertiary">
            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Left Sidebar Panel */}
      <aside className="w-[260px] min-w-[200px] max-w-[400px] bg-secondary flex flex-col h-full border-r border-primary">
        {/* Explorer View */}
        {activeView === 'explorer' && (
          <div className="flex flex-col h-full">
            <h2 className="text-md font-semibold p-3 border-b border-primary flex-shrink-0">Explorer</h2>
            <div className="flex-1 p-3 overflow-y-auto">
              <ul className="space-y-1">
                <li className="file-item flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-tertiary">
                  <FileCode className="w-4 h-4 text-blue-500" />
                  <span>App.jsx</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Source Control View */}
        {activeView === 'source-control' && (
          <div className="flex flex-col h-full">
            <h2 className="text-md font-semibold p-3 border-b border-primary">Source Control</h2>
            <div className="flex-1 p-3 overflow-y-auto space-y-4">
              <div>
                <label className="text-xs font-bold text-tertiary uppercase">Commit Message</label>
                <textarea 
                  className="w-full bg-tertiary border border-secondary rounded-md mt-1 p-2 text-primary" 
                  rows={3} 
                  placeholder="feat: Implement new feature"
                />
                <button className="w-full mt-2 btn-accent font-semibold py-2 rounded-lg">Commit</button>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-2">Changes (2)</h3>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-tertiary">
                    <FileDiff className="w-4 h-4 text-yellow-500" />
                    <span>App.jsx</span>
                  </li>
                  <li className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-tertiary">
                    <FilePlus className="w-4 h-4 text-green-500" />
                    <span>api.js</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Database View */}
        {activeView === 'database' && (
          <div className="flex flex-col h-full">
            <h2 className="text-md font-semibold p-3 border-b border-primary">Database</h2>
            <div className="flex-1 p-3 overflow-y-auto">
              <h3 className="font-semibold text-secondary mb-2">Connections</h3>
              <ul className="space-y-1">
                <li className="px-2 py-1.5">
                  <details open>
                    <summary className="flex items-center gap-2 cursor-pointer">
                      <Database className="w-4 h-4 text-green-500" />
                      Production DB
                    </summary>
                    <ul className="pl-6 mt-1 space-y-1">
                      <li className="flex items-center gap-2">
                        <Table className="w-4 h-4 text-tertiary" />
                        users
                      </li>
                      <li className="flex items-center gap-2">
                        <Table className="w-4 h-4 text-tertiary" />
                        posts
                      </li>
                    </ul>
                  </details>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* API Client View */}
        {activeView === 'api-client' && (
          <div className="flex flex-col h-full">
            <h2 className="text-md font-semibold p-3 border-b border-primary">API Client</h2>
            <div className="flex-1 p-3 overflow-y-auto">
              <h3 className="font-semibold text-secondary mb-2">Requests</h3>
              <ul className="space-y-1">
                <li 
                  className="api-request-item flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-tertiary"
                  onClick={() => handleTabChange('api-client-main')}
                >
                  <span className="font-bold text-green-500 text-xs">GET</span>
                  <span>/users</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </aside>

      {/* Center Column: Editor + Terminal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Editor Area */}
        <main className="flex-1 flex flex-col min-h-0">
          {/* Editor Tabs */}
          <div className="flex-shrink-0 flex items-end border-b border-primary bg-secondary">
            <div 
              onClick={() => handleTabChange('editor')}
              className={`editor-tab flex items-center gap-2 px-4 py-2 border-b-2 cursor-pointer ${
                activeTab === 'editor' 
                  ? 'active text-primary' 
                  : 'text-secondary border-transparent'
              }`}
            >
              <FileCode className="w-4 h-4 text-blue-500" />
              <span>App.jsx</span>
            </div>
            <div 
              onClick={() => handleTabChange('api-client-main')}
              className={`editor-tab flex items-center gap-2 px-4 py-2 border-b-2 cursor-pointer ${
                activeTab === 'api-client-main' 
                  ? 'active text-primary' 
                  : 'text-secondary border-transparent'
              }`}
            >
              <Send className="w-4 h-4 text-green-500" />
              <span>GET /users</span>
            </div>
          </div>
          
          {/* Editor Content */}
          <div className="flex-1 bg-code-bg relative">
            {/* Code Editor */}
            {activeTab === 'editor' && (
              <div className="h-full">
                <div className="p-4 bg-primary code-editor-wrapper h-full">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="code-editor h-full w-full bg-transparent font-mono text-base rounded-lg p-4 overflow-auto resize-none border-none outline-none"
                    style={{
                      backgroundColor: 'var(--code-bg)',
                      color: 'var(--code-text)'
                    }}
                  />
                </div>
              </div>
            )}

            {/* API Client Main Panel */}
            {activeTab === 'api-client-main' && (
              <div className="h-full bg-primary p-4 overflow-y-auto">
                <div className="flex items-center gap-2">
                  <select className="font-semibold bg-tertiary border border-secondary rounded-md px-2 py-2">
                    <option>GET</option>
                    <option>POST</option>
                  </select>
                  <input 
                    type="text" 
                    defaultValue="https://api.example.com/users" 
                    className="flex-1 bg-tertiary border border-secondary rounded-md p-2 text-primary"
                  />
                  <button 
                    onClick={handleApiRequest}
                    className="btn-accent font-semibold px-4 py-2 rounded-md"
                  >
                    Send
                  </button>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-secondary mb-2">Response</h3>
                  <div 
                    className="font-mono text-xs p-3 rounded-lg h-64 overflow-y-auto"
                    style={{
                      backgroundColor: 'var(--code-bg)',
                      color: 'var(--code-text)'
                    }}
                  >
                    <pre>{apiResponse}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        
        {/* Bottom Panel: Terminal */}
        <aside className="h-[200px] min-h-[80px] bg-secondary flex flex-col">
          <div className="flex items-center gap-2 p-2 border-b border-primary flex-shrink-0">
            <Terminal className="w-4 h-4 text-secondary ml-1" />
            <h2 className="font-medium text-primary">Terminal</h2>
          </div>
          <div className="flex-1 p-1">
            <div 
              className="font-mono text-xs p-3 rounded-lg h-full overflow-y-auto"
              style={{
                backgroundColor: 'var(--code-bg)',
                color: 'var(--code-text)'
              }}
            >
              <p>&gt; npm run dev</p>
              <p className="text-green-400">{terminalOutput}</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Right Panel: AI & Collaboration */}
      <aside className="w-[350px] min-w-[250px] max-w-[500px] bg-secondary flex flex-col h-full border-l border-primary">
        <div className="flex items-center justify-between p-3 border-b border-primary flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-primary" />
            <h2 className="font-medium text-primary">AI Assistant</h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Collaboration Avatars */}
            <div className="flex -space-x-2">
              <img 
                className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-gray-800" 
                src="https://placehold.co/32x32/4A69FF/FFFFFF?text=A" 
                alt="User A" 
              />
              <img 
                className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-gray-800" 
                src="https://placehold.co/32x32/34D399/FFFFFF?text=B" 
                alt="User B" 
              />
            </div>
            <button className="btn-accent text-xs font-semibold px-3 py-1.5 rounded-md">Share</button>
          </div>
        </div>
        
        {/* AI Assistant Panel */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
          <div className="flex-1 space-y-4">
            {aiMessages.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'ai' && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-tertiary flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-accent-primary" />
                  </div>
                )}
                <div className={`flex flex-col gap-1 w-full max-w-[320px] ${msg.role === 'user' ? 'items-end' : ''}`}>
                  <div className={`leading-1.5 p-3 rounded-xl ${
                    msg.role === 'user' 
                      ? 'bg-accent-primary text-accent-primary-text rounded-s-xl rounded-ee-xl' 
                      : 'border-gray-200 bg-tertiary rounded-e-xl rounded-es-xl'
                  }`}>
                    <p className="text-sm font-normal">{msg.content}</p>
                  </div>
                </div>
                {msg.role === 'user' && (
                  <img 
                    className="w-8 h-8 rounded-full" 
                    src="https://placehold.co/32x32/4A69FF/FFFFFF?text=A" 
                    alt="User A" 
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Quick Actions & Input */}
          <div className="mt-4 flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <button className="text-xs text-secondary bg-tertiary hover:bg-border-primary px-2 py-1 rounded-md">/explain</button>
              <button className="text-xs text-secondary bg-tertiary hover:bg-border-primary px-2 py-1 rounded-md">/refactor</button>
              <button className="text-xs text-secondary bg-tertiary hover:bg-border-primary px-2 py-1 rounded-md">/find bugs</button>
            </div>
            <form onSubmit={handleSendAI} className="relative">
              <input 
                type="text" 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="w-full bg-tertiary border border-secondary rounded-lg p-2 pr-10 text-primary" 
                placeholder="Ask AI Assistant..."
              />
              <button 
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-secondary hover:text-accent-primary"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-50 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <style>{`
        .bg-primary { background-color: var(--bg-primary); }
        .bg-secondary { background-color: var(--bg-secondary); }
        .bg-tertiary { background-color: var(--bg-tertiary); }
        .border-primary { border-color: var(--border-primary); }
        .border-secondary { border-color: var(--border-secondary); }
        .text-primary { color: var(--text-primary); }
        .text-secondary { color: var(--text-secondary); }
        .text-tertiary { color: var(--text-tertiary); }
        .btn-accent { 
          background-color: var(--accent-primary); 
          color: var(--accent-primary-text);
          transition: background-color 0.2s;
        }
        .btn-accent:hover { background-color: var(--accent-primary-hover); }
        .code-editor-wrapper { background-color: var(--code-bg); }
        .code-editor { color: var(--code-text); }
        .code-border { border-color: var(--code-border); }
        .shadow-custom-sm { box-shadow: var(--shadow-sm); }
        .shadow-custom-md { box-shadow: var(--shadow-md); }
        
        .activity-btn.active { color: var(--accent-primary); background-color: var(--bg-tertiary); }
        .editor-tab.active { background-color: var(--bg-primary); border-bottom-color: transparent; }
        
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border-secondary); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--text-tertiary); }
      `}</style>
    </div>
  );
};

export default CodingMode; 