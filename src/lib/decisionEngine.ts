import { Meeting, GymSession, Task, Goal, Recommendation } from '@/types';
import { parse, isAfter, isBefore, differenceInMinutes, startOfDay, endOfDay } from 'date-fns';

interface DecisionEngineInput {
  currentTime: Date;
  meetings: Meeting[];
  gymSessions: GymSession[];
  tasks: Task[];
  goals: Goal[];
  availableFreeTimeMinutes?: number; // Optional override, otherwise calculated
}

export function calculateBestNextAction(input: DecisionEngineInput): Recommendation {
  const { currentTime, meetings, gymSessions, tasks, goals } = input;
  
  // 1. Get today's date string
  const todayStr = currentTime.toISOString().split('T')[0];

  // 2. Filter today's meetings and gym sessions
  const todaysMeetings = meetings.filter(m => m.date === todayStr);
  const todaysGym = gymSessions.filter(g => g.date === todayStr);

  // Combine and sort events by start time
  const allEvents = [...todaysMeetings, ...todaysGym].map(e => ({
    ...e,
    parsedStart: parse(e.startTime, 'HH:mm', currentTime),
    parsedEnd: parse(e.endTime, 'HH:mm', currentTime),
  })).sort((a, b) => a.parsedStart.getTime() - b.parsedStart.getTime());

  // 3. Determine current state
  let currentEvent = null;
  let nextEvent = null;

  for (const event of allEvents) {
    if (isAfter(currentTime, event.parsedStart) && isBefore(currentTime, event.parsedEnd)) {
      currentEvent = event;
      break;
    }
    if (isBefore(currentTime, event.parsedStart)) {
      nextEvent = event;
      break;
    }
  }

  // If currently in an event, recommend focusing on it
  if (currentEvent) {
    return {
      recommended_action: `Attend: ${currentEvent.title}`,
      reason: `You are currently scheduled for this event until ${currentEvent.endTime}.`,
      estimated_duration: `${differenceInMinutes(currentEvent.parsedEnd, currentTime)} mins remaining`,
      priority_score: 100 // Highest priority if currently happening
    };
  }

  // 4. Calculate available free time before next event or end of day
  let freeTimeMinutes = 0;
  if (nextEvent) {
    freeTimeMinutes = differenceInMinutes(nextEvent.parsedStart, currentTime);
  } else {
    // If no more events, free time is until 10 PM (arbitrary end of day for logic)
    const endOfDayTime = parse('22:00', 'HH:mm', currentTime);
    freeTimeMinutes = differenceInMinutes(endOfDayTime, currentTime);
    if (freeTimeMinutes < 0) freeTimeMinutes = 0; // It's past 10 PM
  }

  if (freeTimeMinutes < 15) {
    return {
      recommended_action: "Take a short break / Prepare for next event",
      reason: `You only have ${freeTimeMinutes} minutes until your next scheduled event (${nextEvent?.title}).`,
      estimated_duration: `${freeTimeMinutes} mins`,
      priority_score: 50
    };
  }

  // 5. Evaluate tasks
  const pendingTasks = tasks.filter(t => !t.isCompleted);
  if (pendingTasks.length === 0) {
    return {
      recommended_action: "Relax or Learn something new!",
      reason: "You have no pending tasks.",
      estimated_duration: `${freeTimeMinutes} mins`,
      priority_score: 10
    };
  }

  // Score tasks
  const scoredTasks = pendingTasks.map(task => {
    let score = task.priority * 10; // Base score 10-100
    
    // Boost score if it aligns with a high priority goal
    if (task.goalId) {
      const goal = goals.find(g => g.id === task.goalId);
      if (goal) {
        score += goal.priority * 5; 
      }
    }

    // Penalize if task duration > free time
    const duration = task.estimatedDurationMinutes || 30; // Default 30 mins
    let fitsInBlock = true;
    if (duration > freeTimeMinutes) {
      score -= 30; // Penalty
      fitsInBlock = false;
    }

    return { task, score, duration, fitsInBlock };
  });

  // Sort by score descending
  scoredTasks.sort((a, b) => b.score - a.score);
  const bestTaskData = scoredTasks[0];

  let reason = `This is your highest priority task right now.`;
  if (bestTaskData.task.goalId) {
      const goal = goals.find(g => g.id === bestTaskData.task.goalId);
      if (goal) reason += ` It aligns with your goal: "${goal.title}".`;
  }
  if (bestTaskData.fitsInBlock) {
      reason += ` You have a ${freeTimeMinutes} min block, which is perfect for this.`;
  } else {
      reason += ` Note: It might take longer (${bestTaskData.duration}m) than your available free time (${freeTimeMinutes}m).`;
  }

  return {
    recommended_action: bestTaskData.task.title,
    reason: reason,
    estimated_duration: `${bestTaskData.duration} mins`,
    priority_score: bestTaskData.score
  };
}
