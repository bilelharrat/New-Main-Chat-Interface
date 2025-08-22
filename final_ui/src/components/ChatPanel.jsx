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
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200'
                }`}>
                  {/* Avatar/Icon */}
                  <div className="absolute -left-10 top-2">
                    {msg.role === 'user' ? (
                      <User className="w-6 h-6 text-blue-500 bg-blue-100 rounded-full p-1" />
                    ) : (
                      <Bot className="w-6 h-6 text-accent bg-accent/10 rounded-full p-1" />
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
                    className="flex items-center gap-1 hover:text-accent"
                    onClick={() => onCopy && onCopy(idx)}
                    title="Copy Message"
                  >
                    <Clipboard size={14} /> Copy
                  </button>
                  {onCite && (
                    <button
                      type="button"
                      className="flex items-center gap-1 hover:text-accent"
                      onClick={() => onCite(msg, idx)}
                      title="Cite to Notes"
                    >
                      <Copy size={14} /> Cite
                    </button>
                  )}
                  {onWrite && (
                    <button
                      type="button"
                      className="flex items-center gap-1 hover:text-accent"
                      onClick={() => onWrite(msg)}
                      title="Send to Write"
                    >
                      <Pencil size={14} /> Write
                    </button>
                  )}
                  {onNotes && (
                    <button
                      type="button"
                      className="flex items-center gap-1 hover:text-accent"
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
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
          disabled={loading || !inputValue.trim()}
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
} 