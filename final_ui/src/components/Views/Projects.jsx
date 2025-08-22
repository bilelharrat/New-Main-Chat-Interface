import React, { useState } from 'react';
import { Folder, Plus, Search, Trash2, ArrowRight } from 'lucide-react';

const mockProjects = [
  { id: 1, name: 'Eden Redesign', desc: 'UI/UX overhaul for Eden platform', date: '2024-07-10' },
  { id: 2, name: 'AI Research', desc: 'Research on LLM prompt engineering', date: '2024-07-08' },
  { id: 3, name: 'Client Demo', desc: 'Demo workspace for client', date: '2024-07-05' },
  { id: 4, name: 'Internal Docs', desc: 'Documentation and onboarding', date: '2024-07-01' },
];

export default function Projects() {
  const [search, setSearch] = useState("");
  const projects = mockProjects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full w-full p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:brightness-95 transition">
          <Plus size={18} /> Add Project
        </button>
      </div>
      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-accent focus:outline-none text-gray-900"
        />
      </div>
      {/* Project List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full text-gray-400 text-center py-12">No projects found.</div>
        ) : (
          projects.map(project => (
            <div
              key={project.id}
              className="group relative flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm p-5 gap-3 transition hover:shadow-md"
            >
              <div className="flex items-center gap-3 mb-2">
                <Folder className="text-accent/70" size={28} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{project.name}</div>
                  <div className="text-xs text-gray-400">{project.date}</div>
                </div>

              </div>
              <div className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[2.5em]">{project.desc}</div>
              {/* Actions on hover */}
              <div className="absolute right-4 bottom-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-accent text-white rounded-lg text-sm font-medium shadow hover:brightness-95 transition">
                  <ArrowRight size={16} /> Open
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 
