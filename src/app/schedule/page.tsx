'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, Button, Input } from '@/components/ui';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Dumbbell } from 'lucide-react';
import { format } from 'date-fns';

export default function SchedulePage() {
  const { meetings, addMeeting, deleteMeeting, gymSessions, addGymSession, deleteGymSession } = useAppStore();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const [newTitle, setNewTitle] = useState('');
  const [newStart, setNewStart] = useState('09:00');
  const [newEnd, setNewEnd] = useState('10:00');
  const [isGym, setIsGym] = useState(false);
  const [muscleGroup, setMuscleGroup] = useState('');

  const todaysMeetings = meetings.filter(m => m.date === selectedDate);
  const todaysGym = gymSessions.filter(g => g.date === selectedDate);

  const allEvents = [...todaysMeetings.map(m => ({...m, type: 'meeting'})), ...todaysGym.map(g => ({...g, type: 'gym'}))]
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    if (isGym) {
      addGymSession({
        id: Math.random().toString(36).substr(2, 9),
        title: newTitle,
        startTime: newStart,
        endTime: newEnd,
        date: selectedDate,
        muscleGroup
      });
    } else {
      addMeeting({
        id: Math.random().toString(36).substr(2, 9),
        title: newTitle,
        startTime: newStart,
        endTime: newEnd,
        date: selectedDate
      });
    }
    setNewTitle('');
    setMuscleGroup('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <CalendarIcon className="text-indigo-400" size={32} /> Schedule
        </h1>
        <Input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-auto bg-slate-800"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Events for {selectedDate}</h2>
          
          {allEvents.length === 0 ? (
            <Card className="p-8 text-center text-slate-400 border-dashed border-slate-700">
              No events scheduled for this day.
            </Card>
          ) : (
            <div className="space-y-3">
              {allEvents.map(event => (
                <Card key={event.id} className={`p-4 flex items-center justify-between ${event.type === 'gym' ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-blue-500'}`}>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-slate-100 flex items-center gap-2">
                      {event.type === 'gym' ? <Dumbbell size={16} className="text-emerald-400" /> : <CalendarIcon size={16} className="text-blue-400" />}
                      {event.title}
                    </span>
                    <span className="text-sm text-slate-400 flex items-center gap-1">
                      <Clock size={14} /> {event.startTime} - {event.endTime}
                      {event.type === 'gym' && event.muscleGroup && ` • ${event.muscleGroup}`}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-500 hover:text-red-400"
                    onClick={() => event.type === 'gym' ? deleteGymSession(event.id) : deleteMeeting(event.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add Event Form */}
        <div>
          <Card className="p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Plus size={18} /> Add Event
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="flex gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-700/50 mb-4">
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${!isGym ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                  onClick={() => setIsGym(false)}
                >
                  Meeting
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${isGym ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                  onClick={() => setIsGym(true)}
                >
                  Gym Session
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                <Input 
                  placeholder={isGym ? "Morning Workout" : "Team Sync"} 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Start Time</label>
                  <Input 
                    type="time" 
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">End Time</label>
                  <Input 
                    type="time" 
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    required
                  />
                </div>
              </div>

              {isGym && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Target Muscle Group (Optional)</label>
                  <Input 
                    placeholder="e.g. Chest & Triceps" 
                    value={muscleGroup}
                    onChange={(e) => setMuscleGroup(e.target.value)}
                  />
                </div>
              )}

              <Button type="submit" className="w-full mt-2">
                Add {isGym ? 'Gym Session' : 'Meeting'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
