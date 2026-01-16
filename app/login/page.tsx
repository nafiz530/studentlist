'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });

    if (res.ok) {
      router.push('/');
    } else {
      alert('Incorrect Code');
      setLoading(false);
      setCode('');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xs">
        <h1 className="text-white text-center text-xs font-black tracking-[0.4em] uppercase mb-10 opacity-60">
          Restricted Access
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="tel" // Shows number pad on mobile
            pattern="[0-9]*" 
            inputMode="numeric"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter Code"
            className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-5 text-center text-2xl text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-bold tracking-widest placeholder:text-gray-700 placeholder:text-base placeholder:tracking-normal"
          />
          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-gray-200 active:scale-95 transition-all"
          >
            {loading ? 'CHECKING...' : 'ENTER'}
          </button>
        </form>
      </div>
    </div>
  );
}

