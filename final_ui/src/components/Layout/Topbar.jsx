import React, { useState, useRef } from 'react';
import { Settings, Menu, Sun, Moon, User, Bell } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Topbar({ onMenuClick, onSettingsClick, darkMode, toggleDarkMode, onLoginClick }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const pillRef = useRef(null);

  const handleMouseMove = (e) => {
    if (pillRef.current) {
      const rect = pillRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
      {/* Mobile menu button */}
      <button 
        onClick={onMenuClick} 
        className="md:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        <Menu size={20} className="text-gray-700 dark:text-gray-300"/>
      </button>
      
      {/* Spacer to push pill to the right */}
      <div className="flex-1"></div>
      
      {/* Action buttons - positioned at far right */}
      <div className="flex items-center gap-2">
        
        {/* Navigation Pill - Purple gradient design matching sidebar */}
        <div 
          ref={pillRef}
          className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-full px-4 py-2 flex items-center gap-4 shadow-lg shadow-blue-500/25 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            background: isHovering 
              ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 50%), linear-gradient(to right, #3b82f6, #9333ea)`
              : 'linear-gradient(to right, #3b82f6, #9333ea)'
          }}
        >
          {/* Dark mode toggle */}
          <button 
            onClick={toggleDarkMode} 
            className="w-6 h-6 flex items-center justify-center text-white hover:text-purple-100 transition-all duration-200 hover:scale-110 hover:drop-shadow-lg hover:drop-shadow-white/50"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun size={20} className="w-5 h-5" />
            ) : (
              <Moon size={20} className="w-5 h-5" />
            )}
          </button>
          
          {/* Vertical separator */}
          <div className="w-px h-4 bg-white/30"></div>
          
          {/* Notifications bell */}
          <button 
            className="w-6 h-6 flex items-center justify-center text-white hover:text-purple-100 transition-all duration-200 hover:scale-110 hover:drop-shadow-lg hover:drop-shadow-white/50"
            aria-label="Notifications"
          >
            <Bell size={20} className="w-5 h-5" />
          </button>
          
          {/* Vertical separator */}
          <div className="w-px h-4 bg-white/30"></div>
          
          {/* User profile */}
          <button 
            onClick={onLoginClick}
            className="w-6 h-6 flex items-center justify-center text-white hover:text-purple-100 transition-all duration-200 hover:scale-110 hover:drop-shadow-lg hover:drop-shadow-white/50"
            aria-label="User profile"
          >
            <User size={20} className="w-5 h-5" />
          </button>
          
          {/* Settings */}
          <button 
            onClick={onSettingsClick} 
            className="w-6 h-6 flex items-center justify-center text-white hover:text-purple-100 transition-all duration-200 hover:scale-110 hover:drop-shadow-lg hover:drop-shadow-white/50"
            aria-label="Open settings"
          >
            <Settings size={20} className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
} 