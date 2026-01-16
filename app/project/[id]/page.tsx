'use client';
import { useState, useEffect } from 'react';
import { Project, Member } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import CreditFooter from '@/components/CreditFooter';

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [rollSort, setRollSort] = useState<'asc'|'desc'>('asc');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Member>>({
    name: '', class: '8', section: 'A', roll: '', status: 'Booked'
  });

  // Fetch
  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then((data: Project[]) => {
      const p = data.find(x => x.id === params.id);
      if (p) setProject(p);
      setLoading(false);
    });
  }, [params.id]);

  // Save Logic
  const sync = async (updatedProject: Project) => {
    setProject(updatedProject); // Optimistic Update
    const all: Project[] = await fetch('/api/projects').then(r => r.json());
    const newAll = all.map(p => p.id === updatedProject.id ? updatedProject : p);
    await fetch('/api/projects', { method: 'POST', body: JSON.stringify(newAll) });
  };

  const handleSubmit = async () => {
    if (!project) return;
    const now = new Date().toISOString();
    let newMembers = [...project.members];

    if (isEditing && formData.id) {
      newMembers = newMembers.map(m => m.id === formData.id ? { ...m, ...formData, updatedAt: now } as Member : m);
    } else {
      newMembers.push({ ...formData, id: uuidv4(), createdAt: now } as Member);
    }

    await sync({ ...project, members: newMembers });
    setShowModal(false);
    setFormData({ name: '', class: '8', section: 'A', roll: '', status: 'Booked' });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!project || !deleteId) return;
    const newMembers = project.members.filter(m => m.id !== deleteId);
    await sync({ ...project, members: newMembers });
    setDeleteId(null);
  };

  // Filter Logic
  const filtered = project?.members
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
    .filter(m => classFilter === 'All' || m.class === classFilter)
    .sort((a, b) => rollSort === 'asc' ? Number(a.roll) - Number(b.roll) : Number(b.roll) - Number(a.roll));

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-gray-400">Loading...</div>;
  if (!project) return <div className="h-screen flex items-center justify-center font-bold">Project Not Found</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 1. Header & Filters (Sticky) */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="p-5 pb-4">
          <h1 className="font-black text-gray-900 leading-none truncate" 
              style={{ fontSize: 'clamp(1.8rem, 8vw, 2.5rem)' }}>
            {project.name}
          </h1>
          
          <div className="flex gap-2 mt-4">
            <input 
              className="flex-grow bg-gray-100 rounded-lg px-3 py-2 text-base outline-none focus:ring-2 ring-black"
              placeholder="Search..."
              value={search} onChange={e => setSearch(e.target.value)}
            />
             <button 
              onClick={() => { setIsEditing(false); setFormData({ name: '', class: '8', section: 'A', roll: '', status: 'Booked' }); setShowModal(true); }}
              className="bg-black text-white px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap active:scale-95 transition"
            >
              + Add
            </button>
          </div>

          <div className="flex gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar">
            <select 
              className="bg-gray-100 rounded-lg px-3 py-2 text-sm font-bold outline-none"
              value={classFilter} onChange={e => setClassFilter(e.target.value)}
            >
              <option value="All">All Classes</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
            </select>
            <button 
              onClick={() => setRollSort(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="bg-gray-100 rounded-lg px-3 py-2 text-sm font-bold whitespace-nowrap"
            >
              Roll {rollSort === 'asc' ? '⬇' : '⬆'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Member List */}
      <div className="flex-grow p-4 max-w-2xl mx-auto w-full flex flex-col">
        {filtered && filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {filtered.map(m => (
              <div key={m.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative">
                <div className="flex justify-between items-start">
                   <div>
                      <h2 className="text-lg font-bold text-gray-900">{m.name}</h2>
                      <p className="text-gray-500 text-sm font-medium mt-0.5">
                        Class {m.class} • Sec {m.section} • Roll {m.roll}
                      </p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-bold uppercase ${m.status.includes('Paid') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {m.status} {m.customAmount && `(${m.customAmount})`}
                      </span>
                   </div>
                   
                   <div className="flex flex-col gap-2">
                      <button onClick={() => { setFormData(m); setIsEditing(true); setShowModal(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold">Edit</button>
                      <button onClick={() => setDeleteId(m.id)} className="p-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold">Del</button>
                   </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-50 text-[10px] text-gray-400 flex justify-between">
                   <span>Added: {format(new Date(m.createdAt), 'dd/MM/yy hh:mm a')}</span>
                   {m.updatedAt && <span>Edited</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
           <div className="flex-grow flex items-center justify-center opacity-40 text-center p-10">
             <p className="font-bold">No members found.</p>
           </div>
        )}

        {/* 3. Footer Logic */}
        <CreditFooter isEmpty={!filtered || filtered.length === 0} />
      </div>

      {/* 4. Full Screen Input Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white z-50 p-5 overflow-y-auto">
           <h2 className="text-2xl font-black mb-6">{isEditing ? 'Edit Info' : 'New Member'}</h2>
           
           <div className="space-y-5">
             <div>
               <label className="text-xs font-bold text-gray-400">NAME</label>
               <input className="w-full text-xl font-bold border-b-2 py-2 outline-none rounded-none" 
                 value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Name" />
             </div>

             <div className="grid grid-cols-3 gap-4">
                <div>
                   <label className="text-xs font-bold text-gray-400">CLASS</label>
                   <select className="w-full text-lg font-bold border-b-2 py-2 bg-transparent rounded-none" 
                     value={formData.class} onChange={e => setFormData({...formData, class: e.target.value as any})}>
                     <option>8</option><option>9</option><option>10</option>
                   </select>
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-400">SEC</label>
                   <select className="w-full text-lg font-bold border-b-2 py-2 bg-transparent rounded-none"
                     value={formData.section} onChange={e => setFormData({...formData, section: e.target.value as any})}>
                     <option>A</option><option>B</option><option>C</option>
                   </select>
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-400">ROLL</label>
                   <input type="number" className="w-full text-lg font-bold border-b-2 py-2 outline-none rounded-none"
                     value={formData.roll} onChange={e => setFormData({...formData, roll: e.target.value})} placeholder="00" />
                </div>
             </div>

             <div>
                <label className="text-xs font-bold text-gray-400 mb-2 block">STATUS</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Booked', 'Pre-register', 'Full paid', 'Custom Paid'].map(s => (
                    <button key={s} onClick={() => setFormData({...formData, status: s as any})}
                      className={`p-3 rounded-lg text-sm font-bold border transition ${formData.status === s ? 'bg-black text-white border-black' : 'text-gray-500 border-gray-200'}`}>
                      {s}
                    </button>
                  ))}
                </div>
             </div>

             {formData.status === 'Custom Paid' && (
                <div>
                  <label className="text-xs font-bold text-gray-400">AMOUNT</label>
                  <input type="number" className="w-full text-xl font-bold border-b-2 py-2 outline-none rounded-none"
                    value={formData.customAmount} onChange={e => setFormData({...formData, customAmount: e.target.value})} placeholder="Enter Amount" />
                </div>
             )}

             <div className="pt-6 grid grid-cols-2 gap-4">
                <button onClick={() => setShowModal(false)} className="py-4 font-bold text-gray-500 bg-gray-100 rounded-xl">Cancel</button>
                <button onClick={handleSubmit} className="py-4 font-bold text-white bg-black rounded-xl shadow-lg">Save</button>
             </div>
           </div>
        </div>
      )}

      {/* 5. Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-6">
           <div className="bg-white p-6 rounded-2xl w-full max-w-xs shadow-2xl">
              <h3 className="text-xl font-bold mb-2">Delete Member?</h3>
              <p className="text-gray-500 text-sm mb-6">Cannot be undone.</p>
              <div className="flex gap-3">
                 <button onClick={() => setDeleteId(null)} className="flex-1 py-3 font-bold bg-gray-100 rounded-xl">Cancel</button>
                 <button onClick={handleDelete} className="flex-1 py-3 font-bold bg-red-500 text-white rounded-xl">Delete</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
