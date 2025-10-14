import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Pin, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare,
  Bot,
  User,
  ArrowRight,
  FileText
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
}

const mockMessages: Message[] = [
  {
    id: '1',
    type: 'assistant',
    content: 'Based on the uploaded documents, I can help you understand the key concepts in AI and machine learning. What specific aspect would you like to explore?',
    timestamp: new Date(Date.now() - 300000),
    sources: ['1', '2']
  },
  {
    id: '2',
    type: 'user',
    content: 'Can you explain the difference between supervised and unsupervised learning?',
    timestamp: new Date(Date.now() - 240000)
  },
  {
    id: '3',
    type: 'assistant',
    content: 'Supervised learning uses labeled training data to learn a mapping from inputs to outputs. The algorithm learns from examples where both the input and the correct output are provided. Common examples include classification and regression tasks.\n\nUnsupervised learning, on the other hand, finds hidden patterns in data without labeled examples. The algorithm must discover the underlying structure on its own. Examples include clustering, dimensionality reduction, and association rule learning.',
    timestamp: new Date(Date.now() - 180000),
    sources: ['2']
  }
];

const MessageBubble: React.FC<{ message: Message; onPinToNotes: (content: string) => void; onInsertToWriter: (content: string) => void }> = ({ 
  message, 
  onPinToNotes, 
  onInsertToWriter 
}) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      
      <div className={`flex-1 max-w-[80%] ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`p-3 rounded-2xl ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          
          {message.sources && message.sources.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
              <div className="flex items-center gap-1 text-xs opacity-75">
                <FileText size={12} />
                <span>Sources: {message.sources.map(id => `[${id}]`).join(', ')}</span>
              </div>
            </div>
          )}
        </div>
        
        {!isUser && (
          <div className="flex items-center gap-1 mt-2">
            <button
              onClick={() => onPinToNotes(message.content)}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Pin to Notes"
            >
              <Pin size={14} />
            </button>
            <button
              onClick={() => onInsertToWriter(message.content)}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Insert to Writer"
            >
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(message.content)}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Copy"
            >
              <Copy size={14} />
            </button>
            <button
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Good response"
            >
              <ThumbsUp size={14} />
            </button>
            <button
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Poor response"
            >
              <ThumbsDown size={14} />
            </button>
          </div>
        )}
        
        <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isUser ? 'text-right' : ''}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export const ChatPanel: React.FC<{ 
  className?: string;
  onPinToNotes: (content: string) => void;
  onInsertToWriter: (content: string) => void;
}> = ({ className = '', onPinToNotes, onInsertToWriter }) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'This is a mock response. In a real implementation, this would be generated by the AI based on the uploaded sources and user query.',
        timestamp: new Date(),
        sources: ['1', '2']
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200/60 dark:border-gray-700/60">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            onPinToNotes={onPinToNotes}
            onInsertToWriter={onInsertToWriter}
          />
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-gray-600 dark:text-gray-300" />
            </div>
            <div className="flex-1">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200/60 dark:border-gray-700/60">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your sources..."
            className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 resize-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
