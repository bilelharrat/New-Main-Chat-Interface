import React from 'react';
import { BookOpen, FileText, Lightbulb, Code, Palette, Settings, Monitor, Moon, Sun, Zap, Target, Sparkles } from 'lucide-react';

const presets = {
  research: {
    name: "Research Mode",
    description: "Perfect for deep research with notes and writing side-by-side",
    icon: BookOpen,
    theme: {
      accentColor: "220 70% 50%", // Deep blue
      background: "light",
      panelLayout: "split",
      notesCollapsed: false,
      writeCollapsed: false,
      notesWidth: 400,
      writeWidth: 350,
      showCodeExecution: false
    },
    features: ["Split view for research", "Deep blue accent", "Notes & Write open", "Focus on content gathering"],
    workflow: "Ideal for academic research, literature reviews, and comprehensive note-taking"
  },
  essay: {
    name: "Essay Mode", 
    description: "Focused writing with reference notes easily accessible",
    icon: FileText,
    theme: {
      accentColor: "160 70% 45%", // Forest green
      background: "light", 
      panelLayout: "right",
      notesCollapsed: true,
      writeCollapsed: false,
      notesWidth: 300,
      writeWidth: 600,
      showCodeExecution: false
    },
    features: ["Large writing area", "Forest green accent", "Notes collapsed", "Distraction-free writing"],
    workflow: "Perfect for essay writing, long-form content, and structured writing projects"
  },
  creative: {
    name: "Creative Mode",
    description: "Inspiration-focused with vibrant colors and open workspace",
    icon: Lightbulb,
    theme: {
      accentColor: "280 70% 60%", // Purple
      background: "dark",
      panelLayout: "split",
      notesCollapsed: false,
      writeCollapsed: false,
      notesWidth: 350,
      writeWidth: 400,
      showCodeExecution: false
    },
    features: ["Dark theme", "Purple accent", "Open workspace", "Creative inspiration"],
    workflow: "Great for brainstorming, creative writing, and artistic projects"
  },
  coding: {
    name: "Coding Mode",
    description: "Developer environment with integrated code execution",
    icon: Code,
    theme: {
      accentColor: "0 70% 50%", // Red
      background: "dark",
      panelLayout: "split",
      notesCollapsed: true,
      writeCollapsed: true,
      notesWidth: 200,
      writeWidth: 200,
      showCodeExecution: true
    },
    features: ["Dark theme", "Red accent", "Code execution", "Compact layout", "Maximized chat"],
    workflow: "Optimized for programming, debugging, and technical discussions"
  },
  minimal: {
    name: "Minimal Mode",
    description: "Clean, distraction-free interface for focused conversations",
    icon: Monitor,
    theme: {
      accentColor: "200 15% 45%", // Muted blue-gray
      background: "light",
      panelLayout: "right",
      notesCollapsed: true,
      writeCollapsed: true,
      notesWidth: 200,
      writeWidth: 200,
      showCodeExecution: false
    },
    features: ["Muted colors", "Collapsed panels", "Clean interface", "Chat focus"],
    workflow: "Ideal for focused conversations, quick questions, and minimal distractions"
  },
  night: {
    name: "Night Mode",
    description: "Easy on the eyes for late-night work sessions",
    icon: Moon,
    theme: {
      accentColor: "45 70% 55%", // Warm amber
      background: "dark",
      panelLayout: "split",
      notesCollapsed: false,
      writeCollapsed: false,
      notesWidth: 350,
      writeWidth: 350,
      showCodeExecution: false
    },
    features: ["Dark theme", "Warm amber accent", "Balanced layout", "Eye-friendly"],
    workflow: "Perfect for late-night work, reduced eye strain, and comfortable long sessions"
  }
};

const ThemePresets = ({ 
  isOpen, 
  onClose, 
  onApplyPreset, 
  currentPreset,
  currentTheme 
}) => {
  if (!isOpen) return null;

  const handlePresetClick = (presetKey) => {
    onApplyPreset(presetKey);
    onClose();
  };

  const getCurrentPresetKey = () => {
    return Object.keys(presets).find(key => {
      const preset = presets[key];
      return (
        preset.theme.accentColor === currentTheme.accentColor &&
        preset.theme.background === currentTheme.background &&
        preset.theme.panelLayout === currentTheme.panelLayout
      );
    }) || null;
  };

  const currentPresetKey = getCurrentPresetKey();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Theme & Layout Presets</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Choose from pre-built configurations optimized for different workflows
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Presets Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(presets).map(([key, preset]) => {
              const IconComponent = preset.icon;
              const isActive = currentPresetKey === key;
              
              return (
                <div
                  key={key}
                  onClick={() => handlePresetClick(key)}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                    isActive 
                      ? 'bg-accent/5 dark:bg-accent/10 border-accent shadow-lg' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-accent/50 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750'
                  }`}
                  style={isActive ? { 
                    borderColor: `hsl(${currentTheme.accentColor})`,
                    boxShadow: `0 0 0 1px hsl(${currentTheme.accentColor})`
                  } : {}}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full animate-pulse"
                        style={{ backgroundColor: `hsl(${currentTheme.accentColor})` }}
                      ></div>
                      <span className="text-xs font-medium text-accent">Active</span>
                    </div>
                  )}
                  
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="p-3 rounded-xl shadow-lg"
                      style={{ 
                        backgroundColor: `hsl(${preset.theme.accentColor})`,
                        color: 'white'
                      }}
                    >
                      <IconComponent size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        {preset.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>
                  </div>

                  {/* Workflow description */}
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={14} className="text-gray-500" />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Best for:</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {preset.workflow}
                    </p>
                  </div>

                  {/* Layout Preview */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <Sparkles size={14} />
                      <span>Layout Preview:</span>
                    </div>
                    <div className="flex gap-1 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      {/* Chat area */}
                      <div className="flex-1 bg-gray-100 dark:bg-gray-700 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Chat</span>
                        </div>
                      </div>
                      
                      {/* Notes panel */}
                      {preset.theme.panelLayout === 'left' || preset.theme.panelLayout === 'split' ? (
                        <div 
                          className={`relative ${preset.theme.notesCollapsed ? 'w-3' : 'w-12'}`}
                          style={{ backgroundColor: `hsl(${preset.theme.accentColor})` }}
                        >
                          {!preset.theme.notesCollapsed && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs text-white font-medium">Notes</span>
                            </div>
                          )}
                        </div>
                      ) : null}
                      
                      {/* Write panel */}
                      {preset.theme.panelLayout === 'left' ? (
                        <div 
                          className={`relative ${preset.theme.writeCollapsed ? 'w-3' : 'w-12'}`}
                          style={{ backgroundColor: `hsl(${preset.theme.accentColor})` }}
                        >
                          {!preset.theme.writeCollapsed && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs text-white font-medium">Write</span>
                            </div>
                          )}
                        </div>
                      ) : null}
                      
                      {/* Right panels */}
                      {preset.theme.panelLayout === 'right' || preset.theme.panelLayout === 'split' ? (
                        <>
                          <div 
                            className={`relative ${preset.theme.notesCollapsed ? 'w-3' : 'w-12'}`}
                            style={{ backgroundColor: `hsl(${preset.theme.accentColor})` }}
                          >
                            {!preset.theme.notesCollapsed && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs text-white font-medium">Notes</span>
                              </div>
                            )}
                          </div>
                          <div 
                            className={`relative ${preset.theme.writeCollapsed ? 'w-3' : 'w-12'}`}
                            style={{ backgroundColor: `hsl(${preset.theme.accentColor})` }}
                          >
                            {!preset.theme.writeCollapsed && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs text-white font-medium">Write</span>
                              </div>
                            )}
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <Zap size={14} />
                      <span>Key Features:</span>
                    </div>
                    {preset.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <div 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: `hsl(${preset.theme.accentColor})` }}
                        ></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Theme indicator */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    {preset.theme.background === 'dark' ? (
                      <Moon size={14} className="text-gray-400" />
                    ) : (
                      <Sun size={14} className="text-gray-400" />
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {preset.theme.background} theme
                    </span>
                    {preset.theme.showCodeExecution && (
                      <div className="ml-auto flex items-center gap-1">
                        <Code size={14} className="text-red-500" />
                        <span className="text-xs text-red-500 font-medium">Code Editor</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {currentPresetKey ? (
                <span>Currently using: <strong className="text-gray-700 dark:text-gray-300">
                  {presets[currentPresetKey].name}
                </strong></span>
              ) : (
                <span>Custom configuration active</span>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePresets;
export { presets }; 