import React from 'react';
import { User, Bot, Clipboard, Copy, Pencil, StickyNote } from 'lucide-react';

export default function ChatMessages({ messages, onCopy, onCite, onWrite, onNotes }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex my-6 ${msg.role === 'user' ? 'justify-end' : 'justify-center'}`}
        >
          <div className="flex flex-col max-w-2xl group">
            <div className={`relative px-4 py-3 rounded-xl shadow-sm message-bubble ${
              msg.role === 'user'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-[#007AFF]/20'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-[#007AFF]/20'
            }`}>
              {/* Avatar/Icon */}
              <div className="absolute -left-10 top-2">
                {msg.role === 'user' ? (
                        <div className="w-6 h-6 bg-gradient-to-br from-[#007AFF] to-[#5AC8FA] rounded-full p-1 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-gradient-to-br from-[#007AFF] to-[#5AC8FA] rounded-full p-1 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              {/* Content */}
              <div className={`whitespace-pre-line ${msg.role === 'ai' ? 'ai-response-text' : ''}`}>
                {msg.content}
              </div>
            </div>
            {/* Footer with actions */}
            <div className="mt-2 flex justify-end items-center w-full text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2">
              <button
                type="button"
                className="flex items-center gap-1 hover:text-[#30D158] dark:hover:text-[#4CAF50] transition-colors"
                onClick={() => onCopy && onCopy(idx)}
                title="Copy Message"
              >
                <Clipboard size={14} /> Copy
              </button>
              {onCite && (
                <button
                  type="button"
                  className="flex items-center gap-1 hover:text-[#30D158] dark:hover:text-[#4CAF50] transition-colors"
                  onClick={() => onCite(msg, idx)}
                  title="Cite to Notes"
                >
                  <Copy size={14} /> Cite
                </button>
              )}
              {onWrite && (
                <button
                  type="button"
                  className="flex items-center gap-1 hover:text-[#30D158] dark:hover:text-[#4CAF50] transition-colors"
                  onClick={() => onWrite(msg)}
                  title="Send to Write"
                >
                  <Pencil size={14} /> Write
                </button>
              )}
              {onNotes && (
                <button
                  type="button"
                  className="flex items-center gap-1 hover:text-[#30D158] dark:hover:text-[#4CAF50] transition-colors"
                  onClick={() => onNotes(msg)}
                  title="Open Notes"
                >
                  <StickyNote size={14} /> Notes
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 