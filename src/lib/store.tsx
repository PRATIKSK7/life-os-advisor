'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Meeting, GymSession, Goal, Task, AppState } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { mockMeetings, mockGymSessions, mockGoals, mockTasks } from './mockData';

interface AppContextType extends AppState {
  addMeeting: (meeting: Meeting) => void;
  updateMeeting: (meeting: Meeting) => void;
  deleteMeeting: (id: string) => void;
  
  addGymSession: (session: GymSession) => void;
  updateGymSession: (session: GymSession) => void;
  deleteGymSession: (id: string) => void;
  
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);
  const [meetings, setMeetings] = useLocalStorage<Meeting[]>('lifeos_meetings', mockMeetings);
  const [gymSessions, setGymSessions] = useLocalStorage<GymSession[]>('lifeos_gym', mockGymSessions);
  const [goals, setGoals] = useLocalStorage<Goal[]>('lifeos_goals', mockGoals);
  const [tasks, setTasks] = useLocalStorage<Task[]>('lifeos_tasks', mockTasks);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Meetings
  const addMeeting = (m: Meeting) => setMeetings([...meetings, m]);
  const updateMeeting = (m: Meeting) => setMeetings(meetings.map(x => x.id === m.id ? m : x));
  const deleteMeeting = (id: string) => setMeetings(meetings.filter(x => x.id !== id));

  // Gym
  const addGymSession = (g: GymSession) => setGymSessions([...gymSessions, g]);
  const updateGymSession = (g: GymSession) => setGymSessions(gymSessions.map(x => x.id === g.id ? g : x));
  const deleteGymSession = (id: string) => setGymSessions(gymSessions.filter(x => x.id !== id));

  // Goals
  const addGoal = (g: Goal) => setGoals([...goals, g]);
  const updateGoal = (g: Goal) => setGoals(goals.map(x => x.id === g.id ? g : x));
  const deleteGoal = (id: string) => setGoals(goals.filter(x => x.id !== id));

  // Tasks
  const addTask = (t: Task) => setTasks([...tasks, t]);
  const updateTask = (t: Task) => setTasks(tasks.map(x => x.id === t.id ? t : x));
  const deleteTask = (id: string) => setTasks(tasks.filter(x => x.id !== id));
  const toggleTaskCompletion = (id: string) => setTasks(tasks.map(x => x.id === id ? { ...x, isCompleted: !x.isCompleted } : x));

  const resetDemoData = () => {
    setMeetings(mockMeetings);
    setGymSessions(mockGymSessions);
    setGoals(mockGoals);
    setTasks(mockTasks);
    window.localStorage.setItem('lifeos_version', '2');
    // Force reload to ensure all components pick up fresh data
    window.location.reload();
  };

  useEffect(() => {
    setHasMounted(true);
    
    // Auto-migrate if we're on the old version
    const version = window.localStorage.getItem('lifeos_version');
    if (version !== '2') {
      resetDemoData();
    }
  }, []);

  // Avoid hydration mismatch by not rendering until mounted
  if (!hasMounted) {
    return null; // Or a loading spinner
  }

  return (
    <AppContext.Provider value={{
      meetings, addMeeting, updateMeeting, deleteMeeting,
      gymSessions, addGymSession, updateGymSession, deleteGymSession,
      goals, addGoal, updateGoal, deleteGoal,
      tasks, addTask, updateTask, deleteTask, toggleTaskCompletion,
      resetDemoData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
