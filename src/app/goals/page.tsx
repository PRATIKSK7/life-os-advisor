'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, Button, Input } from '@/components/ui';
import { Target, Plus, Trash2, CalendarDays } from 'lucide-react';

export default function GoalsPage() {
  const { goals, addGoal, deleteGoal } = useAppStore();

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState(5);
  const [newTarget, setNewTarget] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addGoal({
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      targetDate: newTarget
    });

    setNewTitle('');
    setNewDesc('');
    setNewPriority(5);
    setNewTarget('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        <Target className="text-amber-400" size={32} /> Goals
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {goals.length === 0 ? (
            <Card className="p-8 text-center text-slate-400 border-dashed border-slate-700">
              No active goals. Add one to get started!
            </Card>
          ) : (
            goals.sort((a, b) => b.priority - a.priority).map(goal => (
              <Card key={goal.id} className="p-5 flex flex-col gap-3 group">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-100">{goal.title}</h3>
                    {goal.description && <p className="text-slate-400 mt-1">{goal.description}</p>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteGoal(goal.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={18} className="text-red-400" />
                  </Button>
                </div>
                <div className="flex gap-4 mt-2 border-t border-slate-700/50 pt-3">
                  <span className="text-sm px-3 py-1 bg-amber-500/10 text-amber-400 rounded-lg flex items-center gap-1 border border-amber-500/20">
                    <Target size={14} /> Priority {goal.priority}/10
                  </span>
                  {goal.targetDate && (
                    <span className="text-sm text-slate-400 flex items-center gap-1 bg-slate-800 rounded-lg px-3 py-1">
                      <CalendarDays size={14} /> Target: {goal.targetDate}
                    </span>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        <div>
          <Card className="p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Plus size={18} /> New Goal
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Goal Title</label>
                <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Description (Optional)</label>
                <Input value={newDesc} onChange={e => setNewDesc(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Priority (1-10)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" min="1" max="10" 
                    value={newPriority} 
                    onChange={e => setNewPriority(parseInt(e.target.value))}
                    className="flex-1 accent-amber-500"
                  />
                  <span className="text-slate-300 font-mono font-medium w-6">{newPriority}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Target Date (Optional)</label>
                <Input type="date" value={newTarget} onChange={e => setNewTarget(e.target.value)} />
              </div>
              <Button type="submit" className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-amber-500/25 border-amber-400/20">
                Create Goal
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
