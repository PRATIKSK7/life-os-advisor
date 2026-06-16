import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Button({ className, variant = 'primary', size = 'default', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost', size?: 'default' | 'sm' | 'lg' }) {
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 border border-blue-400/20",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-300"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    default: "px-4 py-2 rounded-xl font-medium",
    lg: "px-6 py-3 rounded-xl text-lg font-medium"
  };

  return (
    <button
      className={cn(
        "transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all",
        className
      )}
      {...props}
    />
  );
}
