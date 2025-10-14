import React, { useState } from 'react';
import { 
  StickyNote, 
  Plus, 
  Search, 
  Tag, 
  Pin, 
  Copy, 
  ArrowRight,
  FileText,
  Calendar,
  Trash2,
  Edit3
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  section: string;
  tags: string[];
  sources: string[];
  createdAt: Date;
  updatedAt: Date;
  pinned: boolean;
}

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Supervised Learning Definition',
    content: 'Supervised learning uses labeled training data to learn a mapping from inputs to outputs. The algorithm learns from examples where both the input and the correct output are provided.',
    section: 'Machine Learning Basics',
    tags: ['supervised-learning', 'definitions', 'ml-fundamentals'],
    sources: ['2'],
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 1800000),
    pinned: true
  },
  {
    id: '2',
    title: 'AI in Healthcare Applications',
    content: 'Current applications include medical imaging analysis, drug discovery, personalized treatment plans, and predictive analytics for patient outcomes.',
    section: 'AI Applications',
    tags: ['healthcare', 'applications', 'medical-ai'],
    sources: ['1'],
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 3600000),
    pinned: false
  },
  {
    id: '3',
    title: 'Blockchain Technology Overview',
    content: 'Blockchain is a distributed ledger technology that maintains a continuously growing list of records, called blocks, which are linked and secured using cryptography.',
    section: 'Web3 Technologies',
    tags: ['blockchain', 'web3', 'distributed-systems'],
    sources: ['3'],
    createdAt: new Date(Date.now() - 10800000),
    updatedAt: new Date(Date.now() - 5400000),
    pinned: false
  }
];

const sections = [
  'Machine Learning Basics',
  'AI Applications', 
  'Web3 Technologies',
  'Research Methods',
  'General Notes'
];

const NoteCard: React.FC<{ 
  note: Note; 
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onInsertToWriter: (content: string) => void;
  onTogglePin: (noteId: string) => void;
}> = ({ note, onEdit, onDelete, onInsertToWriter, onTogglePin }) => {
  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60 hover:shadow-md transition-all duration-200 group ${
      note.pinned ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 dark:text-white text-sm leading-tight">
              {note.title}
            </h3>
            {note.pinned && (
              <Pin size={12} className="text-blue-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
            <Tag size={12} />
            <span>{note.section}</span>
            <Calendar size={12} />
            <span>{note.updatedAt.toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onTogglePin(note.id)}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title={note.pinned ? 'Unpin' : 'Pin'}
          >
            <Pin size={12} />
          </button>
          <button
            onClick={() => onEdit(note)}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit3 size={12} />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
        {note.content}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {note.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
          {note.tags.length > 2 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{note.tags.length - 2}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => onInsertToWriter(note.content)}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Insert to Writer"
          >
            <ArrowRight size={12} />
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(note.content)}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Copy"
          >
            <Copy size={12} />
          </button>
        </div>
      </div>
      
      {note.sources.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <FileText size={12} />
            <span>Sources: {note.sources.map(id => `[${id}]`).join(', ')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const NotesPanel: React.FC<{ 
  className?: string;
  onInsertToWriter: (content: string) => void;
}> = ({ className = '', onInsertToWriter }) => {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [showNewNote, setShowNewNote] = useState(false);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSection = selectedSection === 'All' || note.section === selectedSection;
    return matchesSearch && matchesSection;
  });

  const handleEdit = (note: Note) => {
    // TODO: Implement edit functionality
    console.log('Edit note:', note);
  };

  const handleDelete = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const handleTogglePin = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, pinned: !note.pinned } : note
    ));
  };

  const pinnedNotes = filteredNotes.filter(note => note.pinned);
  const regularNotes = filteredNotes.filter(note => !note.pinned);

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200/60 dark:border-gray-700/60">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notes</h2>
          <button 
            onClick={() => setShowNewNote(true)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
        
        {/* Section Filter */}
        <div className="flex gap-1 overflow-x-auto">
          {['All', ...sections].map(section => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedSection === section
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {section}
            </button>
          ))}
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Pinned Notes */}
          {pinnedNotes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Pin size={14} className="text-blue-500" />
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Pinned</h3>
              </div>
              <div className="space-y-3">
                {pinnedNotes.map(note => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onInsertToWriter={onInsertToWriter}
                    onTogglePin={handleTogglePin}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Regular Notes */}
          {regularNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <div className="flex items-center gap-2 mb-3 mt-6">
                  <StickyNote size={14} className="text-gray-500 dark:text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">All Notes</h3>
                </div>
              )}
              <div className="space-y-3">
                {regularNotes.map(note => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onInsertToWriter={onInsertToWriter}
                    onTogglePin={handleTogglePin}
                  />
                ))}
              </div>
            </div>
          )}
          
          {filteredNotes.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <StickyNote size={32} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">No notes found</p>
              {searchQuery && (
                <p className="text-xs mt-1">Try adjusting your search terms</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;
