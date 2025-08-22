i jusimport React from 'react';
import { BookOpen } from 'lucide-react';

export default function ModeSelector({ onSelect }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-eden-bg p-8">
      <div className="w-full max-w-md">
        <button
          onClick={() => onSelect('research')}
          className="w-full bg-white border border-eden-border rounded-2xl p-6 shadow hover:shadow-lg transition group text-left focus:outline-none flex flex-col items-start"
        >
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-blue-600 mr-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-eden-text-primary group-hover:text-eden-accent">Research Mode</div>
              <div className="text-base text-eden-text-secondary mt-1">Perfect for deep research with notes and writing side-by-side</div>
            </div>
          </div>
          <div className="w-full">
            <div className="text-xs text-eden-text-secondary mb-1 font-semibold">Best for:</div>
            <div className="text-xs bg-gray-50 border border-eden-border rounded p-2 mb-2">Ideal for academic research, literature reviews, and comprehensive note-taking</div>
            <div className="text-xs text-eden-text-secondary mb-1 font-semibold">Layout Preview:</div>
            <div className="flex items-center gap-1 mb-2">
              <span className="px-3 py-1 rounded bg-gray-100 text-gray-500 text-xs">Chat</span>
              <span className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold">Notes</span>
              <span className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold">Notes</span>
              <span className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold">Write</span>
            </div>
            <div className="text-xs text-eden-text-secondary mb-1 font-semibold">Key Features:</div>
            <ul className="text-xs text-eden-text-secondary list-disc pl-5 space-y-1 mb-2">
              <li>Split view for research</li>
              <li>Deep blue accent</li>
              <li>Notes & Write open</li>
              <li>Focus on content gathering</li>
            </ul>
            <div className="text-xs text-eden-text-secondary mt-4 flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center mr-1">🌞</span>
              Light Theme
            </div>
          </div>
        </button>
      </div>
    </div>
  );
} 