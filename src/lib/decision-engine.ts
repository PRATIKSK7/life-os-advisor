import { Meeting, GymSession, Task, Goal } from '@/types';
import { calculateFreeTimeBlocks } from './time-analysis';
import { parse, differenceInDays } from 'date-fns';

export interface DecisionEngineRecommendation {
  recommended_action: string;
  reason: string;
  estimated_duration: string;
  priority_score: number;
  supporting_goal: string;
  available_time_block: string;
  expected_impact: string;
  next_step: string;
  alternative_option: string;
}

export function calculateBestNextAction(
  currentTime: Date,
  meetings: Meeting[],
  gymSessions: GymSession[],
  goals: Goal[],
  tasks: Task[]
): DecisionEngineRecommendation {
  
  const freeBlocks = calculateFreeTimeBlocks(currentTime, meetings, gymSessions);
  const nextFreeBlock = freeBlocks.length > 0 ? freeBlocks[0] : null;

  const pendingTasks = tasks.filter(t => !t.isCompleted);
  
  if (pendingTasks.length === 0) {
    return {
      recommended_action: "Take a break or review your goals",
      reason: "You have no pending tasks.",
      estimated_duration: "N/A",
      priority_score: 0,
      supporting_goal: "N/A",
      available_time_block: nextFreeBlock ? `${nextFreeBlock.start} - ${nextFreeBlock.end}` : "None"
    };
  }

  let bestTaskData: any = null;
  let highestScore = -1;

  for (const task of pendingTasks) {
    const goal = task.goalId ? goals.find(g => g.id === task.goalId) : null;
    const goalPriority = goal ? goal.priority : 0;
    
    // Calculate urgency based on goal target date
    let urgency = 0;
    if (goal && goal.targetDate) {
      const targetDate = parse(goal.targetDate, 'yyyy-MM-dd', new Date());
      const daysUntil = differenceInDays(targetDate, currentTime);
      if (daysUntil < 0) urgency = 10; // Overdue
      else if (daysUntil <= 1) urgency = 9;
      else if (daysUntil <= 3) urgency = 7;
      else if (daysUntil <= 7) urgency = 5;
      else urgency = 2;
    }

    // Formula: (task.priority * 0.5) + (goal.priority * 0.3) + (urgency * 0.2)
    const score = (task.priority * 0.5) + (goalPriority * 0.3) + (urgency * 0.2);
    
    // Normalize to a 1-100 scale for easier reading
    const normalizedScore = Math.round(score * 10);

    // Prefer tasks that fit in the next available block
    let fitPenalty = 0;
    const duration = task.estimatedDurationMinutes || 30;
    if (nextFreeBlock && duration > nextFreeBlock.duration) {
      fitPenalty = 10; // Penalty if it doesn't fit
    }

    const finalScore = normalizedScore - fitPenalty;

    if (finalScore > highestScore) {
      highestScore = finalScore;
      bestTaskData = { task, goal, finalScore, duration };
    }
  }

  const { task, goal, finalScore, duration } = bestTaskData;

  const reason = goal 
    ? `Highest impact task supporting your goal "${goal.title}" with available focus block.`
    : `Highest priority task with available focus block.`;

  return {
    recommended_action: task.title,
    reason: reason,
    estimated_duration: `${duration} mins`,
    priority_score: finalScore,
    supporting_goal: goal ? goal.title : "None",
    available_time_block: nextFreeBlock ? `${nextFreeBlock.start} - ${nextFreeBlock.end}` : "None",
    expected_impact: goal ? `Progresses your high-priority goal: ${goal.title}` : "Completes an essential standalone task.",
    next_step: "Open the relevant tool or document and begin a focused work session.",
    alternative_option: "Review your active goals to ensure alignment before continuing."
  };
}
