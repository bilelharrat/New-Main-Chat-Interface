import React, { useRef, useEffect } from 'react';
import { User, Bot, Clipboard, Copy, Pencil, StickyNote, ArrowUp } from 'lucide-react';

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
                <div className={`relative px-4 py-3 rounded-xl shadow-sm message-bubble ${
                  msg.role === 'user'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-[#2196F3]/20/50'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-emerald-200/50'
                }`}>
                  {/* Avatar/Icon */}
                  <div className="absolute -left-10 top-2">
                    {msg.role === 'user' ? (
                        <div className="w-6 h-6 bg-gradient-to-br from-[#2196F3] to-[#2196F3] rounded-full p-1 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-gradient-to-br from-[#2196F3] to-cyan-500 rounded-full p-1 flex items-center justify-center">
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
                    className="flex items-center gap-1 hover:text-[#2196F3] dark:hover:text-emerald-400 transition-colors"
                    onClick={() => onCopy && onCopy(idx)}
                    title="Copy Message"
                  >
                    <Clipboard size={14} /> Copy
                  </button>
                  {onCite && (
                    <button
                      type="button"
                      className="flex items-center gap-1 hover:text-[#2196F3] dark:hover:text-emerald-400 transition-colors"
                      onClick={() => onCite(msg, idx)}
                      title="Cite to Notes"
                    >
                      <Copy size={14} /> Cite
                    </button>
                  )}
                  {onWrite && (
                    <button
                      type="button"
                      className="flex items-center gap-1 hover:text-[#2196F3] dark:hover:text-emerald-400 transition-colors"
                      onClick={() => onWrite(msg)}
                      title="Send to Write"
                    >
                      <Pencil size={14} /> Write
                    </button>
                  )}
                  {onNotes && (
                    <button
                      type="button"
                      className="flex items-center gap-1 hover:text-[#2196F3] dark:hover:text-emerald-400 transition-colors"
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
      {/* Input Bar - Apple Style */}
      <div className="p-6 border-t border-gray-200/20 dark:border-gray-700/20">
        <form
          className="w-full max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border border-gray-200/20 dark:border-gray-700/20 shadow-xl p-3 transition-all duration-300 hover:shadow-2xl"
          onSubmit={e => {
            e.preventDefault();
            if (onSend) onSend();
          }}
        >
          <div className="flex items-end gap-4">
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={e => onInputChange && onInputChange(e.target.value)}
                placeholder={inputPlaceholder}
                className="w-full px-4 py-3 bg-transparent border-0 resize-none focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-base leading-relaxed"
                rows="1"
                disabled={loading}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                style={{ transition: 'height 0.15s' }}
              />
            </div>
            <button
              type="submit"
              className="group relative p-4 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center h-14 w-14 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-gradient-to-r from-[#007AFF] to-[#0056CC] hover:from-[#0056CC] hover:to-[#003D99] text-white transform hover:scale-105 overflow-hidden"
              disabled={loading || !inputValue.trim()}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10"></div>
              ) : (
                <ArrowUp className="w-5 h-5 relative z-10 transition-transform duration-200 rotate-90 group-hover:rotate-0" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 