'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8 shadow-sm">
      <div className="text-slate-300 font-medium text-lg tracking-tight">
        {mounted ? format(time, 'EEEE, MMMM do') : 'Loading...'}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-slate-400 font-mono text-sm bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
          {mounted ? format(time, 'HH:mm:ss') : '--:--:--'}
        </div>
      </div>
    </header>
  );
}
