export interface Meeting {
  id: string;
  title: string;
  startTime: string; // ISO 8601 string or format "HH:mm"
  endTime: string;
  date: string; // YYYY-MM-DD
}

export interface GymSession {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  muscleGroup?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  priority: number; // 1-10
  targetDate?: string;
}

export interface Task {
  id: string;
  title: string;
  priority: number; // 1-10
  isCompleted: boolean;
  goalId?: string;
  estimatedDurationMinutes?: number;
}

export interface Recommendation {
  recommended_action: string;
  reason: string;
  estimated_duration: string;
  priority_score: number;
  goal_supported?: string;
  available_time_block?: string;
  expected_impact?: string;
  next_step?: string;
  alternative_option?: string;
}

export interface AppState {
  meetings: Meeting[];
  gymSessions: GymSession[];
  goals: Goal[];
  tasks: Task[];
  resetDemoData?: () => void;
}
