'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Target, CheckSquare, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'AI Advisor', href: '/advisor', icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col h-full sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
          <Sparkles className="text-blue-400" size={24} />
          LifeOS AI
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                isActive 
                  ? "bg-blue-500/10 text-blue-400 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] border border-blue-500/20" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              )}
            >
              <Icon size={20} className={clsx(isActive && "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 text-xs text-slate-500 font-medium tracking-wide text-center">
        MVP v1.0
      </div>
    </aside>
  );
}
