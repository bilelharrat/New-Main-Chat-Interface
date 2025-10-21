import React, { useState } from 'react';
import { NotebookWritePanel } from './Notebook/NotebookWritePanel';

interface WriteViewProps {
  setView: (view: string) => void;
}

export const WriteView: React.FC<WriteViewProps> = ({ setView }) => {
  const [writerContent, setWriterContent] = useState('');

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200/60 dark:border-gray-700/60">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('prompt-console')}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Back to Chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Write
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create and edit your documents
            </p>
          </div>
        </div>
      </div>

      {/* Writer Content */}
      <div className="flex-1 overflow-hidden">
        <NotebookWritePanel 
          className="h-full"
          onContentChange={setWriterContent}
          onClose={() => setView('prompt-console')}
        />
      </div>
    </div>
  );
};

export default WriteView;
