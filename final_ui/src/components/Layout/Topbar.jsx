import React from 'react';
import { Settings, Menu, Sun, Moon, User, Bell } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Topbar({ onMenuClick, onSettingsClick, darkMode, toggleDarkMode, onLoginClick }) {
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
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-full px-4 py-2 flex items-center gap-4 shadow-lg shadow-purple-500/25">
          {/* Dark mode toggle */}
          <button 
            onClick={toggleDarkMode} 
            className="w-6 h-6 flex items-center justify-center text-white hover:text-purple-100 transition-colors"
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
            className="w-6 h-6 flex items-center justify-center text-white hover:text-purple-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} className="w-5 h-5" />
          </button>
          
          {/* Vertical separator */}
          <div className="w-px h-4 bg-white/30"></div>
          
          {/* User profile */}
          <button 
            onClick={onLoginClick}
            className="w-6 h-6 flex items-center justify-center text-white hover:text-purple-100 transition-colors"
            aria-label="User profile"
          >
            <User size={20} className="w-5 h-5" />
          </button>
          
          {/* Settings */}
          <button 
            onClick={onSettingsClick} 
            className="w-6 h-6 flex items-center justify-center text-white hover:text-purple-100 transition-colors"
            aria-label="Open settings"
          >
            <Settings size={20} className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
} 