import React, { useRef, useEffect } from 'react';
import { User, Bot, Clipboard, Copy, Pencil, StickyNote, ArrowRight } from 'lucide-react';

export default function ChatPanel({
  messages = [],
  onSend,
  inputValue,
  onInputChange,
  loading = false,
  onCopy,
  onCite,
  onWrite,
  onNotes,
  inputPlaceholder = 'Type a message...'
}) {
  const inputRef = useRef();
  const messagesEndRef = useRef();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
        <div className="w-full max-w-2xl mx-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex my-6 ${msg.role === 'user' ? 'justify-end' : 'justify-center'}`}
            >
              <div className="flex flex-col max-w-2xl group">
                <div className={`relative px-4 py-3 rounded-xl shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-emerald-200/50'
                }`}>
                  {/* Avatar/Icon */}
                  <div className="absolute -left-10 top-2">
                    {msg.role === 'user' ? (
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full p-1 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full p-1 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="whitespace-pre-line">
                    {msg.content}
                  </div>
                </div>
                {/* Footer with actions */}
                <div className="mt-2 flex justify-end items-center w-full text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    onClick={() => onCopy && onCopy(idx)}
                    title="Copy Message"
                  >
                    <Clipboard size={14} /> Copy
                  </button>
                  {onCite && (
                    <button
                      type="button"
                      className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      onClick={() => onCite(msg, idx)}
                      title="Cite to Notes"
                    >
                      <Copy size={14} /> Cite
                    </button>
                  )}
                  {onWrite && (
                    <button
                      type="button"
                      className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      onClick={() => onWrite(msg)}
                      title="Send to Write"
                    >
                      <Pencil size={14} /> Write
                    </button>
                  )}
                  {onNotes && (
                    <button
                      type="button"
                      className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
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
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Input Bar */}
      <form
        className="w-full max-w-2xl mx-auto flex items-center gap-2 px-4 pb-4 pt-2"
        onSubmit={e => {
          e.preventDefault();
          if (onSend) onSend();
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => onInputChange && onInputChange(e.target.value)}
          placeholder={inputPlaceholder}
          className="flex-1 px-3 py-2 border border-emerald-300 dark:border-emerald-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm transition-all duration-200"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 flex items-center gap-1 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transform hover:scale-105 group"
          disabled={loading || !inputValue.trim()}
        >
          <ArrowRight className="w-4 h-4 transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-90" />
        </button>
      </form>
    </div>
  );
} 