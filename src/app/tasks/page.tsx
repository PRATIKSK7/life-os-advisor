'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, Button, Input } from '@/components/ui';
import { CheckSquare, Plus, Trash2, Clock, CheckCircle2, Circle } from 'lucide-react';
import clsx from 'clsx';

export default function TasksPage() {
  const { tasks, addTask, deleteTask, toggleTaskCompletion, goals } = useAppStore();

  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState(5);
  const [newDuration, setNewDuration] = useState('30');
  const [newGoalId, setNewGoalId] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addTask({
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      priority: newPriority,
      isCompleted: false,
      goalId: newGoalId || undefined,
      estimatedDurationMinutes: parseInt(newDuration) || 30
    });

    setNewTitle('');
    setNewPriority(5);
    setNewDuration('30');
    setNewGoalId('');
  };

  const pendingTasks = tasks.filter(t => !t.isCompleted).sort((a, b) => b.priority - a.priority);
  const completedTasks = tasks.filter(t => t.isCompleted);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        <CheckSquare className="text-emerald-400" size={32} /> Tasks
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Tasks */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-200">Pending</h2>
            {pendingTasks.length === 0 ? (
              <p className="text-slate-500 italic">All caught up!</p>
            ) : (
              pendingTasks.map(task => (
                <Card key={task.id} className="p-4 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleTaskCompletion(task.id)} className="text-slate-500 hover:text-emerald-400 transition-colors">
                      <Circle size={24} />
                    </button>
                    <div>
                      <h3 className="text-slate-100 font-medium">{task.title}</h3>
                      <div className="flex gap-3 mt-1 text-xs">
                        <span className="text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded">Pri: {task.priority}</span>
                        {task.estimatedDurationMinutes && (
                          <span className="text-slate-400 flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded"><Clock size={12}/> {task.estimatedDurationMinutes}m</span>
                        )}
                        {task.goalId && (
                          <span className="text-amber-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> {goals.find(g => g.id === task.goalId)?.title}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} className="text-red-400" />
                  </Button>
                </Card>
              ))
            )}
          </div>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-slate-800">
              <h2 className="text-xl font-semibold text-slate-500">Completed</h2>
              {completedTasks.map(task => (
                <Card key={task.id} className="p-4 flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleTaskCompletion(task.id)} className="text-emerald-500">
                      <CheckCircle2 size={24} />
                    </button>
                    <div>
                      <h3 className="text-slate-400 line-through">{task.title}</h3>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                    <Trash2 size={18} className="text-red-400" />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add Task Form */}
        <div>
          <Card className="p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Plus size={18} /> New Task
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Task Title</label>
                <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Priority (1-10)</label>
                  <Input type="number" min="1" max="10" value={newPriority} onChange={e => setNewPriority(parseInt(e.target.value))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Est. Mins</label>
                  <Input type="number" step="5" value={newDuration} onChange={e => setNewDuration(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Link to Goal</label>
                <select 
                  value={newGoalId} 
                  onChange={e => setNewGoalId(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="">-- No Goal --</option>
                  {goals.map(g => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
              </div>

              <Button type="submit" className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/25 border-emerald-400/20">
                Add Task
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
