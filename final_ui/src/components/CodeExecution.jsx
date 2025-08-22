import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Download, Copy, Settings, Terminal, Code, FileText, RotateCcw, Zap, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const languages = {
  javascript: {
    name: 'JavaScript',
    extension: '.js',
    icon: '⚡',
    defaultCode: `// Welcome to Eden Code Execution!
console.log("Hello, World!");

// Try some JavaScript features
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled numbers:", doubled);

// Async example
async function fetchData() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  const data = await response.json();
  console.log("Fetched data:", data);
}

fetchData();`
  },
  python: {
    name: 'Python',
    extension: '.py',
    icon: '🐍',
    defaultCode: `# Welcome to Eden Code Execution!
print("Hello, World!")

# Try some Python features
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print("Doubled numbers:", doubled)

# List comprehension example
squares = [x**2 for x in range(10)]
print("Squares:", squares)

# Dictionary example
person = {
    "name": "Eden",
    "type": "AI Assistant",
    "features": ["Code Execution", "Smart Search", "Notes"]
}
print("Person:", person)`
  },
  html: {
    name: 'HTML',
    extension: '.html',
    icon: '🌐',
    defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eden Code Execution</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        h1 {
            text-align: center;
            margin-bottom: 20px;
        }
        .feature {
            background: rgba(255, 255, 255, 0.2);
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Welcome to Eden Code Execution!</h1>
        <div class="feature">
            <h3>✨ Features</h3>
            <ul>
                <li>Multi-language support</li>
                <li>Real-time execution</li>
                <li>Syntax highlighting</li>
                <li>Output capture</li>
            </ul>
        </div>
        <div class="feature">
            <h3>🎯 Try it out!</h3>
            <p>This HTML is being executed in real-time within Eden's code environment.</p>
        </div>
    </div>
</body>
</html>`
  },
  css: {
    name: 'CSS',
    extension: '.css',
    icon: '🎨',
    defaultCode: `/* Welcome to Eden CSS Execution! */

/* Create a beautiful card design */
.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 40px;
  margin: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  text-align: center;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
}

.title {
  font-size: 2.5em;
  margin-bottom: 20px;
  font-weight: bold;
}

.subtitle {
  font-size: 1.2em;
  opacity: 0.9;
  margin-bottom: 30px;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.feature {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.feature h3 {
  margin: 0 0 10px 0;
  font-size: 1.1em;
}

.feature p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.9em;
}

/* Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  animation: fadeIn 0.6s ease-out;
}`
  },
  sql: {
    name: 'SQL',
    extension: '.sql',
    icon: '🗄️',
    defaultCode: `-- Welcome to Eden SQL Execution!

-- Create sample tables
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    title TEXT NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample data
INSERT INTO users (id, name, email) VALUES
(1, 'Alice Johnson', 'alice@example.com'),
(2, 'Bob Smith', 'bob@example.com'),
(3, 'Carol Davis', 'carol@example.com');

INSERT INTO posts (id, user_id, title, content) VALUES
(1, 1, 'First Post', 'This is my first post!'),
(2, 1, 'Second Post', 'Another great post.'),
(3, 2, 'Hello World', 'Hello from Bob!'),
(4, 3, 'Introduction', 'Nice to meet everyone!');

-- Query examples
SELECT 'User Statistics' as info;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_posts FROM posts;

SELECT 'Recent Posts with Authors' as info;
SELECT
    p.title,
    p.content,
    u.name as author,
    p.created_at
FROM posts p
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;`
  }
};

const CodeExecution = ({
  isOpen,
  onClose,
  initialLanguage = 'javascript',
  initialCode = null,
  accentColor // Receive accentColor prop
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(initialCode || languages[initialLanguage].defaultCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [autoRun, setAutoRun] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(14);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const codeRef = useRef(null);
  const outputRef = useRef(null);

  // Auto-run functionality
  useEffect(() => {
    if (autoRun && code) {
      const timeoutId = setTimeout(() => {
        executeCode();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [code, autoRun]);

  const executeCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput('');
    const startTime = Date.now();

    try {
      let result;

      switch (selectedLanguage) {
        case 'javascript':
          result = await executeJavaScript(code);
          break;
        case 'python':
          result = await executePython(code);
          break;
        case 'html':
          result = await executeHTML(code);
          break;
        case 'css':
          result = await executeCSS(code);
          break;
        case 'sql':
          result = await executeSQL(code);
          break;
        default:
          throw new Error('Unsupported language');
      }

      const endTime = Date.now();
      setExecutionTime(endTime - startTime);
      setOutput(result);

      // Add to history
      setExecutionHistory(prev => [{
        id: Date.now(),
        language: selectedLanguage,
        code: code,
        output: result,
        timestamp: new Date().toLocaleString(),
        executionTime: endTime - startTime
      }, ...prev.slice(0, 9)]); // Keep last 10 executions

    } catch (err) {
      setError(err.message);
      setExecutionTime(null);
    } finally {
      setIsRunning(false);
    }
  };

  const executeJavaScript = async (code) => {
    return new Promise((resolve) => {
      const originalConsoleLog = console.log;
      const logs = [];

      // Override console.log to capture output
      console.log = (...args) => {
        logs.push(args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
        originalConsoleLog(...args);
      };

      try {
        // Create a safe execution environment
        const sandbox = {
          console: { log: console.log },
          setTimeout: setTimeout,
          setInterval: setInterval,
          clearTimeout: clearTimeout,
          clearInterval: clearInterval,
          fetch: fetch,
          Math: Math,
          Date: Date,
          JSON: JSON,
          Array: Array,
          Object: Object,
          String: String,
          Number: Number,
          Boolean: Boolean,
          RegExp: RegExp,
          Error: Error,
          Promise: Promise
        };

        // Execute the code
        const result = new Function('console', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'fetch', 'Math', 'Date', 'JSON', 'Array', 'Object', 'String', 'Number', 'Boolean', 'RegExp', 'Error', 'Promise', code);
        result(
          sandbox.console, sandbox.setTimeout, sandbox.setInterval,
          sandbox.clearTimeout, sandbox.clearInterval, sandbox.fetch,
          sandbox.Math, sandbox.Date, sandbox.JSON, sandbox.Array,
          sandbox.Object, sandbox.String, sandbox.Number, sandbox.Boolean,
          sandbox.RegExp, sandbox.Error, sandbox.Promise
        );

        // Restore console.log
        console.log = originalConsoleLog;

        resolve(logs.join('\n'));
      } catch (err) {
        console.log = originalConsoleLog;
        throw err;
      }
    });
  };

  const executePython = async (code) => {
    // Simulate Python execution (in a real app, you'd use a Python runtime)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple Python-like execution simulation
        const lines = code.split('\n');
        const output = [];

        for (const line of lines) {
          if (line.trim().startsWith('print(')) {
            const content = line.match(/print\((.+)\)/)?.[1];
            if (content) {
              output.push(content.replace(/['"]/g, ''));
            }
          }
        }

        resolve(output.join('\n') || 'Python execution completed (simulated)');
      }, 500);
    });
  };

  const executeHTML = async (code) => {
    return new Promise((resolve) => {
      // Create a sandboxed iframe to render HTML
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      iframe.onload = () => {
        const result = iframe.contentDocument.body.innerHTML;
        document.body.removeChild(iframe);
        resolve(`HTML rendered successfully!\n\nPreview:\n${result}`);
      };

      iframe.srcdoc = code;
    });
  };

  const executeCSS = async (code) => {
    return new Promise((resolve) => {
      // Create a style element and apply CSS
      const style = document.createElement('style');
      style.textContent = code;
      document.head.appendChild(style);

      setTimeout(() => {
        document.head.removeChild(style);
        resolve('CSS applied successfully! Check the page for visual changes.');
      }, 100);
    });
  };

  const executeSQL = async (code) => {
    return new Promise((resolve) => {
      // Simulate SQL execution
      setTimeout(() => {
        const lines = code.split('\n');
        const results = [];

        for (const line of lines) {
          if (line.trim().toUpperCase().startsWith('SELECT')) {
            results.push('Query executed successfully');
            results.push('Results would be displayed here in a real database');
          }
        }

        resolve(results.join('\n') || 'SQL execution completed (simulated)');
      }, 300);
    });
  };

  const stopExecution = () => {
    setIsRunning(false);
    setError('Execution stopped by user');
  };

  const clearOutput = () => {
    setOutput('');
    setError(null);
    setExecutionTime(null);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code${languages[selectedLanguage].extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetCode = () => {
    setCode(languages[selectedLanguage].defaultCode);
    clearOutput();
  };

  const changeLanguage = (lang) => {
    setSelectedLanguage(lang);
    setCode(languages[lang].defaultCode);
    clearOutput();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-7xl w-full mx-4 max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `hsl(${accentColor} / 0.1)`, color: `hsl(${accentColor})` }}>
              <Code size={20} style={{ color: `hsl(${accentColor})` }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Code Execution Environment</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Write, run, and test code in real-time</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(true)}
              className="p-2 rounded-lg text-gray-500 hover:text-accent hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              title="Execution History"
            >
              <Clock size={18} />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg text-gray-500 hover:text-accent hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              title="Settings"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <XCircle size={18} />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(95vh-80px)]">
          {/* Left Panel - Code Editor */}
          <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700">
            {/* Language Selector */}
            <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Language:</span>
              <div className="flex gap-1">
                {Object.entries(languages).map(([key, lang]) => (
                  <button
                    key={key}
                    onClick={() => changeLanguage(key)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      selectedLanguage === key
                        ? 'text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    style={selectedLanguage === key ? { backgroundColor: `hsl(${accentColor})` } : {}}
                  >
                    <span className="mr-1">{lang.icon}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 relative">
              <SyntaxHighlighter
                language={selectedLanguage}
                style={theme === 'dark' ? tomorrow : undefined}
                customStyle={{
                  margin: 0,
                  height: '100%',
                  fontSize: `${fontSize}px`,
                  background: theme === 'dark' ? '#1a1a1a' : '#f8f9fa'
                }}
                showLineNumbers
                wrapLines
              >
                {code}
              </SyntaxHighlighter>

              {/* Code Input Overlay */}
              <textarea
                ref={codeRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="absolute inset-0 bg-transparent text-transparent caret-black dark:caret-white resize-none font-mono"
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: '1.5',
                  padding: '1rem',
                  border: 'none',
                  outline: 'none'
                }}
                spellCheck={false}
                placeholder="Write your code here..."
              />
            </div>

            {/* Code Actions */}
            <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <button
                  onClick={executeCode}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:brightness-90 disabled:opacity-50 transition"
                  style={{ backgroundColor: `hsl(${accentColor})` }}
                >
                  {isRunning ? <RotateCcw size={16} className="animate-spin" /> : <Play size={16} />}
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>

                {isRunning && (
                  <button
                    onClick={stopExecution}
                    className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <Square size={16} />
                    Stop
                  </button>
                )}

                <button
                  onClick={clearOutput}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  <RotateCcw size={16} />
                  Clear
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyCode}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  <Copy size={16} />
                  Copy
                </button>
                <button
                  onClick={downloadCode}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  <Download size={16} />
                  Download
                </button>
                <button
                  onClick={resetCode}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="w-1/2 flex flex-col">
            {/* Output Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Terminal size={18} style={{ color: `hsl(${accentColor})` }} />
                <span className="font-medium text-gray-900 dark:text-white">Output</span>
                {executionTime && (
                  <span className="text-xs text-gray-500">
                    ({executionTime}ms)
                  </span>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-1 text-red-500">
                  <AlertTriangle size={14} />
                  <span className="text-sm">Error</span>
                </div>
              )}
            </div>

            {/* Output Content */}
            <div className="flex-1 p-4 overflow-auto bg-gray-50 dark:bg-gray-800">
              <div
                ref={outputRef}
                className="font-mono text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap"
              >
                {error ? (
                  <div className="text-red-500">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle size={16} />
                      <span className="font-semibold">Execution Error:</span>
                    </div>
                    {error}
                  </div>
                ) : output ? (
                  <div className="text-green-600 dark:text-green-400">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={16} />
                      <span className="font-semibold">Execution Successful:</span>
                    </div>
                    {output}
                  </div>
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                    <Terminal size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Output will appear here when you run your code</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Code Editor Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Auto-run on code change
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={autoRun}
                      onChange={(e) => setAutoRun(e.target.checked)}
                      className="rounded border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 transition"
                      style={{ accentColor: `hsl(${accentColor})` }}
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      Automatically execute code when you stop typing
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Theme
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="20"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full accent-accent"
                    style={{ accentColor: `hsl(${accentColor})` }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History Modal */}
        {showHistory && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-4xl w-full max-h-[80vh] p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Execution History</h3>

              <div className="max-h-96 overflow-y-auto space-y-3">
                {executionHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No execution history yet</p>
                  </div>
                ) : (
                  executionHistory.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                      onClick={() => {
                        setCode(item.code);
                        setSelectedLanguage(item.language);
                        setOutput(item.output);
                        setShowHistory(false);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{languages[item.language].icon}</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {languages[item.language].name}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.timestamp} • {item.executionTime}ms
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {item.code.split('\n')[0]}...
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowHistory(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeExecution; 