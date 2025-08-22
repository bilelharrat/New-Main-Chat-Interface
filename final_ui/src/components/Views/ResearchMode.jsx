import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Settings, 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered, 
  Type, 
  X, 
  ChevronRight, 
  Code, 
  Folder, 
  Search, 
  Plus, 
  MessageCircle, 
  Grid, 
  Save,
  BarChart3,
  Clock,
  Quote,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Send,
  Pencil,
  ChevronDown
} from 'lucide-react';

const ResearchMode = () => {
  const [notes, setNotes] = useState('');
  const [researchContent, setResearchContent] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('Chicago');
  const [viewMode, setViewMode] = useState('Popup');

  return (
    <div className="flex flex-1 bg-white">


      {/* Left Sidebar - Apple-inspired design */}
      <div className="w-20 bg-white border-r border-gray-100 flex flex-col items-center py-6 space-y-8">
        {/* Logo */}
        <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-sm">
          E
        </div>
        
        {/* Search Bar - Pill-shaped with subtle styling */}
        <div className="w-16 h-8 bg-gray-50 rounded-full flex items-center justify-center">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        
        {/* Navigation Icons - Clean, minimal design */}
        <div className="flex flex-col items-center space-y-6">
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <Plus className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <Search className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <MessageCircle className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <Folder className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-green-500 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-200">
            <BookOpen className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <Grid className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <Code className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        
        {/* Bottom collapse button */}
        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200">
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Panel - Notes with Apple precision */}
        <div className="w-80 bg-gray-50 flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Auto</span>
            </div>
          </div>
          
          {/* Toolbar - Apple-style with perfect spacing */}
          <div className="flex items-center gap-1 p-4 border-b border-gray-100 bg-white">
            <select className="text-sm border-0 bg-transparent focus:outline-none text-gray-700 font-medium pr-8">
              <option>Normal</option>
              <option>Heading 1</option>
              <option>Heading 2</option>
            </select>
            <div className="h-4 w-px bg-gray-200 mx-2"></div>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors">
              <Bold className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors">
              <Italic className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors">
              <Underline className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors">
              <Strikethrough className="w-4 h-4 text-gray-600" />
            </button>
            <div className="h-4 w-px bg-gray-200 mx-2"></div>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors">
              <AlignLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors">
              <AlignCenter className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors">
              <AlignRight className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors">
              <AlignJustify className="w-4 h-4 text-gray-600" />
            </button>
            <div className="h-4 w-px bg-gray-200 mx-2"></div>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors">
              <List className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors">
              <ListOrdered className="w-4 h-4 text-gray-600" />
            </button>
            <div className="h-4 w-px bg-gray-200 mx-2"></div>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors">
              <Type className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors">
              <Highlighter className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors">
              <Link className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors">
              <Quote className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors">
              <Code className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors">
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          {/* Notes Content */}
          <div className="flex-1 p-6">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your research notes..."
              className="w-full h-full p-4 border border-gray-200 rounded-xl bg-white text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm leading-relaxed"
            />
          </div>
        </div>

        {/* Main Research Writing Panel - Apple precision */}
        <div className="flex-1 bg-white flex flex-col">
          {/* Header - Clean, minimal design matching the image */}
          <div className="p-8 border-b border-gray-100 bg-white">
            <div className="flex items-start justify-between">
              {/* Left side - Icon and title */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-sm">
                  <Pencil className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Research Writing</h1>
                  <p className="text-gray-500 mt-2 text-lg">AI-powered academic writing assistant</p>
                </div>
              </div>
              
              {/* Right side - Notes controls and format */}
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-600 mb-2">Notes:</span>
                  <div className="flex items-center gap-2">
                    <button 
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 ${viewMode === 'Popup' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      onClick={() => setViewMode('Popup')}
                    >
                      Popup
                    </button>
                    <button 
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 ${viewMode === 'Side' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      onClick={() => setViewMode('Side')}
                    >
                      Side
                    </button>
                    <button 
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 ${viewMode === 'Show' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      onClick={() => setViewMode('Show')}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">1 words</span>
                  <button className="px-3 py-1.5 bg-green-600 text-white rounded text-sm font-medium shadow-sm hover:bg-green-700 transition-colors flex items-center gap-1">
                    <Type className="w-3 h-3" />
                    Chicago Format
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Top Bar - Exact image proportions */}
          <div className="px-8 py-6 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between">
              {/* Left Section - Text Statistics */}
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">1</div>
                  <div className="text-xs text-gray-600">Words</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">5</div>
                  <div className="text-xs text-gray-600">Chars</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">1</div>
                  <div className="text-xs text-gray-600">Sentences</div>
                </div>
              </div>
              
              {/* Middle Section - Action Buttons */}
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded text-sm font-medium hover:from-purple-700 hover:to-pink-600 transition-colors">
                  <BarChart3 className="w-4 h-4" />
                  Analyze
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors">
                  <Type className="w-4 h-4" />
                  Format
                </button>
              </div>
              
              {/* Right Section - Navigation Tabs */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium shadow-sm border border-blue-200">
                  <Pencil className="w-4 h-4" />
                  Writing
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  <FileText className="w-4 h-4" />
                  Outline
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  <BookOpen className="w-4 h-4" />
                  Literature
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  <Clock className="w-4 h-4" />
                  Timeline
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  <BarChart3 className="w-4 h-4" />
                  Analysis
                </button>
              </div>
            </div>
          </div>



          {/* Text Editor - Clean, minimal design */}
          <div className="flex-1 p-8">
            <textarea
              value={researchContent}
              onChange={(e) => setResearchContent(e.target.value)}
              placeholder="Start writing your research paper..."
              className="w-full h-full p-6 border border-gray-200 rounded-xl bg-white text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg leading-relaxed"
            />
          </div>
        </div>

        {/* Right AI Sidebar - Apple minimalism */}
        <div className="w-80 bg-white border-l border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">AI</h3>
          </div>
          
          <div className="flex-1 p-6 space-y-4">
            <button className="w-full px-6 py-4 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-all duration-200 text-center font-medium shadow-sm">
              Analyze
            </button>
            <button className="w-full px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-200 text-center font-medium">
              Research Gaps
            </button>
          </div>
          
          <div className="p-6 border-t border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask for multiple approaches..."
                className="w-full px-5 py-4 pr-14 border border-gray-200 rounded-2xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm shadow-sm"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-purple-600 hover:text-purple-700 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchMode; 