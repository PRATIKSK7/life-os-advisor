'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, Button, Input } from '@/components/ui';
import { calculateBestNextAction } from '@/lib/decision-engine';
import { calculateFreeTimeBlocks } from '@/lib/time-analysis';
import { Sparkles, Send, Bot, User, Clock, Loader2 } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendation?: any;
};

export default function AdvisorPage() {
  const { meetings, tasks, gymSessions, goals } = useAppStore();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your advanced LifeOS AI Advisor. I can analyze your schedule and goals, and reason about what you should do next using Gemini 2.5 Pro. Ask me 'What should I do now?'."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Math.random().toString(36).substr(2, 9), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const currentTime = new Date();
      const freeTime = calculateFreeTimeBlocks(currentTime, meetings, gymSessions);
      const recommendation = calculateBestNextAction(currentTime, meetings, gymSessions, goals, tasks);

      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: userMessage.content,
          time: currentTime.toISOString(),
          meetings,
          gym: gymSessions,
          goals: goals.sort((a,b) => b.priority - a.priority).slice(0,3), // top goals
          tasks: tasks.filter(t => !t.isCompleted).sort((a,b) => b.priority - a.priority).slice(0,5), // top tasks
          freeTime,
          recommendation
        })
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: data.recommendation || data.error,
        recommendation: recommendation
      }]);

    } catch (error) {
       setMessages(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: "Sorry, I had trouble reaching the AI service. Please ensure your GEMINI_API_KEY is configured."
      }]);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-6">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3 shrink-0">
        <Sparkles className="text-blue-400" size={32} /> AI Advisor
      </h1>

      <Card className="flex-1 flex flex-col overflow-hidden bg-slate-900/40 border-slate-700/50">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`space-y-3 ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`px-5 py-3 rounded-2xl inline-block whitespace-pre-wrap text-left ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}`}>
                  {msg.content}
                </div>
                
                {/* Recommendation Card */}
                {msg.recommendation && (
                  <div className="bg-slate-800/80 border border-blue-500/30 rounded-xl p-5 shadow-lg max-w-sm mt-2 text-left">
                    <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                      <Clock size={16} /> Decision Engine Analysis
                    </h4>
                    <div className="text-xl font-bold text-white mb-2">
                      {msg.recommendation.recommended_action}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-medium">
                      <span className="bg-slate-900 text-slate-400 px-2 py-1 rounded">Est: {msg.recommendation.estimated_duration}</span>
                      <span className="bg-slate-900 text-slate-400 px-2 py-1 rounded">Block: {msg.recommendation.available_time_block}</span>
                      <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded">Score: {msg.recommendation.priority_score}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 max-w-[85%]">
               <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-blue-500/20 text-blue-400">
                <Loader2 size={20} className="animate-spin" />
              </div>
              <div className="px-5 py-3 rounded-2xl inline-block bg-slate-800 text-slate-400 rounded-tl-none border border-slate-700">
                 Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 backdrop-blur-md">
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-thin scrollbar-thumb-slate-700">
            {[
              "What should I do right now?",
              "I have 4 hours free tonight. What should I focus on?",
              "Am I spending my time on the right things?",
              "What is preventing me from achieving my goals faster?",
              "What should I finish this week?",
              "Create my optimal schedule for tomorrow.",
              "How can I improve my chances of getting a top internship?"
            ].map(q => (
              <button 
                key={q}
                onClick={() => setInput(q)}
                className="whitespace-nowrap text-xs bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-full transition-colors border border-slate-700 hover:border-indigo-500"
              >
                {q}
              </button>
            ))}
          </div>
          <form onSubmit={handleSend} className="flex gap-2">
            <Input 
              placeholder="Ask me 'What should I do now?'..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-slate-800 border-slate-700"
              disabled={isLoading}
            />
            <Button type="submit" variant="primary" className="px-6" disabled={isLoading || !input.trim()}>
              <Send size={18} />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
