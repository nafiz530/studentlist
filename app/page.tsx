'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Project } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import CreditFooter from '@/components/CreditFooter';

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  const handleCreate = async () => {
    if (!name) return;
    const newProject: Project = { id: uuidv4(), name, members: [] };
    const updated = [...projects, newProject];
    setProjects(updated);
    setShowModal(false);
    setName('');
    await fetch('/api/projects', { method: 'POST', body: JSON.stringify(updated) });
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-400 font-bold animate-pulse">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="p-6 flex-grow flex flex-col max-w-xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pt-4">
          <h1 className="text-3xl font-black text-gray-900">PROJECTS</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-5 py-3 rounded-xl font-bold text-sm active:scale-95 transition shadow-lg shadow-gray-200"
          >
            + New
          </button>
        </div>

        {/* List */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <Link key={project.id} href={`/project/${project.id}`}>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm active:scale-[0.98] transition cursor-pointer relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-gray-300 -rotate-12 group-hover:rotate-0 transition-transform">
                    {project.members.length}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 relative z-10">{project.name}</h2>
                  <p className="text-gray-400 font-medium text-sm mt-1 relative z-10">
                    {project.members.length} {project.members.length === 1 ? 'Member' : 'Members'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center text-center opacity-40">
            <p className="font-bold">No projects found.<br/>Tap + New to create one.</p>
          </div>
        )}

        {/* Footer - Passes isEmpty true if no projects */}
        <CreditFooter isEmpty={projects.length === 0} />
      </div>

      {/* Full Screen Pop-up */}
      {showModal && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col p-6 animate-in slide-in-from-bottom-10 duration-200">
          <div className="flex justify-end">
            <button onClick={() => setShowModal(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 font-bold">✕ Close</button>
          </div>
          
          <div className="flex-grow flex flex-col justify-center">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Project Name</label>
            <input 
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-4xl font-black outline-none border-b-2 border-gray-200 focus:border-black py-2 placeholder:text-gray-200"
              placeholder="Name..."
            />
            <button 
              onClick={handleCreate}
              className="mt-8 w-full bg-black text-white py-5 rounded-2xl text-lg font-bold shadow-xl active:scale-95 transition"
            >
              Create Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

