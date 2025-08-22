import React from 'react';

export default function Canvas() {
  return (
    <div className="flex flex-col items-center justify-start w-full h-full bg-white dark:bg-gray-900 p-4 overflow-auto">
      <div className="w-full max-w-5xl flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg shadow mb-2">
          <button className="px-3 py-1 rounded bg-accent text-white font-semibold">Pen</button>
          <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Eraser</button>
          <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Sticky Note</button>
          <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Rectangle</button>
          <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Circle</button>
          <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Line</button>
          <label className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-pointer">
            Image Upload
            <input type="file" accept="image/*" className="hidden" />
          </label>
          <button className="px-3 py-1 rounded bg-red-500 text-white font-semibold ml-auto">Clear</button>
        </div>
        {/* Canvas Area */}
        <div className="relative w-full h-[600px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow overflow-hidden">
          {/* Drawing Canvas Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg select-none pointer-events-none">
            Drawing Canvas (coming soon)
          </div>
          {/* Sticky Notes Placeholder */}
          <div className="absolute top-4 left-4 bg-yellow-200 rounded shadow p-2 text-sm text-gray-800 select-none pointer-events-none">
            Sticky Note (coming soon)
          </div>
          {/* Shapes Placeholder */}
          <div className="absolute bottom-4 right-4 bg-blue-200 rounded shadow p-2 text-sm text-gray-800 select-none pointer-events-none">
            Shapes (coming soon)
          </div>
          {/* Image Upload Placeholder */}
          <div className="absolute bottom-4 left-4 bg-green-200 rounded shadow p-2 text-sm text-gray-800 select-none pointer-events-none">
            Image Upload (coming soon)
          </div>
        </div>
      </div>
    </div>
  );
} 