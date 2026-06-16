'use client';

import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui';
import { calculateBestNextAction } from '@/lib/decision-engine';
import { Calendar, CheckSquare, Target, Clock, ArrowRight, Activity, AlertTriangle, Zap, BrainCircuit, Dumbbell, Users } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { meetings, tasks, gymSessions, goals, resetDemoData } = useAppStore();
  const todayStr = new Date().toISOString().split('T')[0];

  const todaysMeetings = meetings.filter(m => m.date === todayStr);
  const pendingTasks = tasks.filter(t => !t.isCompleted);
  
  const recommendation = calculateBestNextAction(
    new Date(),
    meetings,
    gymSessions,
    goals,
    tasks
  );

  // Executive Metrics Computations
  const top3Priorities = pendingTasks.sort((a, b) => b.priority - a.priority).slice(0, 3);
  
  const deepWorkBlock = todaysMeetings.find(m => m.title.toLowerCase().includes('deep work'));
  const learningBlock = todaysMeetings.find(m => m.title.toLowerCase().includes('learning') || m.title.toLowerCase().includes('study'));
  const fitnessBlock = gymSessions.find(m => m.date === todayStr);
  const networkingBlock = todaysMeetings.find(m => m.title.toLowerCase().includes('networking'));

  const biggestRisk = "You have multiple Placement tasks pending. Falling behind on DSA could jeopardize Goal 2 (Crack Product-Based Interviews).";
  const highestImpactOpportunity = top3Priorities.length > 0 ? top3Priorities[0].title : "Solve 3 LeetCode Problems";
  const todaysFocus = "Placements & Internship Preparation";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Chief of Staff Briefing</h1>
          <p className="text-slate-400 mt-1">Good morning, Pratik S K. Here is your executive summary for today.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { if (resetDemoData) resetDemoData(); else { window.localStorage.clear(); window.location.reload(); } }} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2">
            Reset Demo Data
          </button>
          <Link href="/advisor" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
            <BrainCircuit size={18} />
            Consult AI Advisor
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Strategic Overview */}
        <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-500/30">
            <h3 className="text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
              <Target size={14} /> Today's Focus
            </h3>
            <p className="text-xl font-bold text-white">{todaysFocus}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/30">
            <h3 className="text-amber-400 font-semibold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap size={14} /> Highest Impact Opportunity
            </h3>
            <p className="text-xl font-bold text-white">{highestImpactOpportunity}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-red-900/30 to-rose-900/30 border-red-500/30">
            <h3 className="text-red-400 font-semibold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
              <AlertTriangle size={14} /> Biggest Risk
            </h3>
            <p className="text-sm font-medium text-red-100">{biggestRisk}</p>
          </Card>
        </div>

        {/* Schedule Blocks */}
        <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border-slate-700/50 hover:bg-slate-800/50 transition-colors">
             <div className="flex justify-between items-start mb-2">
               <BrainCircuit size={18} className="text-blue-400" />
               <span className="text-xs text-slate-500 font-mono">{deepWorkBlock?.startTime || 'Unscheduled'}</span>
             </div>
             <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Deep Work</p>
             <p className="text-white font-medium truncate mt-1">{deepWorkBlock?.title || 'No deep work scheduled'}</p>
          </Card>
          
          <Card className="p-4 border-slate-700/50 hover:bg-slate-800/50 transition-colors">
             <div className="flex justify-between items-start mb-2">
               <Target size={18} className="text-emerald-400" />
               <span className="text-xs text-slate-500 font-mono">{learningBlock?.startTime || 'Unscheduled'}</span>
             </div>
             <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Learning Block</p>
             <p className="text-white font-medium truncate mt-1">{learningBlock?.title || 'No learning scheduled'}</p>
          </Card>

          <Card className="p-4 border-slate-700/50 hover:bg-slate-800/50 transition-colors">
             <div className="flex justify-between items-start mb-2">
               <Dumbbell size={18} className="text-orange-400" />
               <span className="text-xs text-slate-500 font-mono">{fitnessBlock?.startTime || 'Unscheduled'}</span>
             </div>
             <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Fitness Block</p>
             <p className="text-white font-medium truncate mt-1">{fitnessBlock?.title || 'Rest day'}</p>
          </Card>

          <Card className="p-4 border-slate-700/50 hover:bg-slate-800/50 transition-colors">
             <div className="flex justify-between items-start mb-2">
               <Users size={18} className="text-indigo-400" />
               <span className="text-xs text-slate-500 font-mono">{networkingBlock?.startTime || 'Unscheduled'}</span>
             </div>
             <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Networking Block</p>
             <p className="text-white font-medium truncate mt-1">{networkingBlock?.title || 'No networking scheduled'}</p>
          </Card>
        </div>

        {/* AI Recommendation Engine */}
        <Card className="md:col-span-4 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-blue-500/30 mt-4">
          <div className="p-8 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
            
            <div className="space-y-4 flex-1">
               <h2 className="text-indigo-400 font-semibold flex items-center gap-2 uppercase tracking-wider text-sm">
                <Activity size={16} /> Decision Engine Output
              </h2>
              <div className="text-2xl font-bold text-white leading-tight">
                {recommendation.recommended_action}
              </div>
              
              <div className="flex flex-col gap-2 mt-2">
                 <div className="text-sm text-slate-300">
                   <span className="text-slate-400 font-medium">Expected Impact:</span> {recommendation.expected_impact}
                 </div>
                 <div className="text-sm text-slate-300">
                   <span className="text-slate-400 font-medium">Next Step:</span> {recommendation.next_step}
                 </div>
                 <div className="text-sm text-slate-300">
                   <span className="text-slate-400 font-medium">Alternative:</span> {recommendation.alternative_option}
                 </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-medium mt-4">
                <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded">
                  Goal: {recommendation.supporting_goal}
                </span>
                <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded">
                  Block: {recommendation.available_time_block}
                </span>
                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded">
                  Score: {recommendation.priority_score}
                </span>
              </div>
            </div>

          </div>
          
          <div className="px-8 py-4 bg-slate-900/50 border-t border-blue-500/20 flex justify-between items-center">
             <p className="text-slate-400 text-sm italic">"{recommendation.reason}"</p>
          </div>
        </Card>

        {/* Top 3 Priorities List */}
        <div className="md:col-span-4 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Top 3 Priorities</h2>
            <Link href="/tasks" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              View All Tasks <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="space-y-3">
            {top3Priorities.map(task => (
              <Card key={task.id} className="p-4 flex items-center justify-between bg-slate-900 border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-slate-600" />
                  <span className="text-slate-200 font-medium">{task.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  {task.estimatedDurationMinutes && (
                    <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded-md">
                      <Clock size={12} /> {task.estimatedDurationMinutes}m
                    </span>
                  )}
                  <span className="text-xs font-medium px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">
                    Priority {task.priority}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
