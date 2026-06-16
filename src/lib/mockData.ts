import { Meeting, GymSession, Goal, Task } from '@/types';
import { format, addDays } from 'date-fns';

const today = new Date();
const tomorrow = addDays(today, 1);
const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
const todayStr = formatDate(today);

export const mockMeetings: Meeting[] = [
  { id: 'm1', title: 'College Classes', startTime: '08:00', endTime: '12:30', date: todayStr },
  { id: 'm2', title: 'Lunch', startTime: '12:30', endTime: '13:30', date: todayStr },
  { id: 'm3', title: 'DSA Practice', startTime: '13:30', endTime: '15:00', date: todayStr },
  { id: 'm4', title: 'Project Development', startTime: '15:00', endTime: '17:00', date: todayStr },
  { id: 'm5', title: 'Internship Preparation', startTime: '17:00', endTime: '18:30', date: todayStr },
  { id: 'm6', title: 'AI Project Work', startTime: '20:00', endTime: '21:30', date: todayStr },
  { id: 'm7', title: 'LinkedIn Networking', startTime: '21:30', endTime: '22:30', date: todayStr },
  { id: 'm8', title: 'Reflection', startTime: '22:30', endTime: '23:00', date: todayStr }
];

export const mockGymSessions: GymSession[] = [
  { id: 'g1', title: 'Morning Walk', startTime: '07:00', endTime: '08:00', date: todayStr, muscleGroup: 'Cardio' },
  { id: 'g2', title: 'Gym Workout', startTime: '18:30', endTime: '20:00', date: todayStr, muscleGroup: 'Full Body' }
];

export const mockGoals: Goal[] = [
  { id: 'goal-1', title: 'Secure Software Engineering Internship', priority: 10, targetDate: formatDate(addDays(today, 90)) },
  { id: 'goal-2', title: 'Crack Product-Based Company Interviews', priority: 10, targetDate: formatDate(addDays(today, 180)) },
  { id: 'goal-3', title: 'Build Strong AI Project Portfolio', priority: 9, targetDate: formatDate(addDays(today, 180)) },
  { id: 'goal-4', title: 'Maintain 8.5+ CGPA', priority: 9, targetDate: formatDate(addDays(today, 365)) },
  { id: 'goal-5', title: 'Improve Fitness and Consistency', priority: 8, targetDate: formatDate(addDays(today, 365)) },
  { id: 'goal-6', title: 'Grow LinkedIn Professional Brand', priority: 7, targetDate: formatDate(addDays(today, 365)) },
  { id: 'goal-7', title: 'Improve Communication & Presentation Skills', priority: 7, targetDate: formatDate(addDays(today, 365)) }
];

export const mockTasks: Task[] = [
  // ACADEMICS (Goal 4)
  { id: 't1', title: 'Complete DBMS Assignment', priority: 9, isCompleted: false, goalId: 'goal-4', estimatedDurationMinutes: 60 },
  { id: 't2', title: 'Prepare Operating Systems Notes', priority: 8, isCompleted: false, goalId: 'goal-4', estimatedDurationMinutes: 90 },
  { id: 't3', title: 'Revise Computer Networks', priority: 8, isCompleted: false, goalId: 'goal-4', estimatedDurationMinutes: 60 },
  { id: 't4', title: 'Finish College Project Documentation', priority: 7, isCompleted: false, goalId: 'goal-4', estimatedDurationMinutes: 120 },
  { id: 't5', title: 'Study 2 hours for Semester Exams', priority: 10, isCompleted: false, goalId: 'goal-4', estimatedDurationMinutes: 120 },

  // PLACEMENTS (Goal 2)
  { id: 't6', title: 'Solve 3 LeetCode Problems', priority: 10, isCompleted: false, goalId: 'goal-2', estimatedDurationMinutes: 90 }, // Today's Priority 1
  { id: 't7', title: 'Practice Binary Trees', priority: 9, isCompleted: false, goalId: 'goal-2', estimatedDurationMinutes: 60 },
  { id: 't8', title: 'Complete DSA Revision Sheet', priority: 8, isCompleted: false, goalId: 'goal-2', estimatedDurationMinutes: 120 },
  { id: 't9', title: 'Attend Mock Interview', priority: 10, isCompleted: false, goalId: 'goal-2', estimatedDurationMinutes: 60 },
  { id: 't10', title: 'Revise OOP Concepts', priority: 8, isCompleted: false, goalId: 'goal-2', estimatedDurationMinutes: 45 },
  { id: 't11', title: 'Practice Aptitude Questions', priority: 7, isCompleted: false, goalId: 'goal-2', estimatedDurationMinutes: 60 },

  // PROJECTS (Goal 3)
  { id: 't12', title: 'Improve LifeOS AI Advisor', priority: 10, isCompleted: false, goalId: 'goal-3', estimatedDurationMinutes: 120 }, // Today's Priority 2
  { id: 't13', title: 'Add Google Calendar Integration', priority: 9, isCompleted: false, goalId: 'goal-3', estimatedDurationMinutes: 90 },
  { id: 't14', title: 'Build File Upload System', priority: 8, isCompleted: false, goalId: 'goal-3', estimatedDurationMinutes: 60 },
  { id: 't15', title: 'Improve AI Recommendation Engine', priority: 8, isCompleted: false, goalId: 'goal-3', estimatedDurationMinutes: 60 },
  { id: 't16', title: 'Deploy LifeOS on Vercel', priority: 7, isCompleted: false, goalId: 'goal-3', estimatedDurationMinutes: 30 },
  { id: 't17', title: 'Create Project Architecture Diagram', priority: 6, isCompleted: false, goalId: 'goal-3', estimatedDurationMinutes: 45 },
  { id: 't18', title: 'Write GitHub Documentation', priority: 6, isCompleted: false, goalId: 'goal-3', estimatedDurationMinutes: 45 },
  { id: 't19', title: 'Record Demo Video', priority: 5, isCompleted: false, goalId: 'goal-3', estimatedDurationMinutes: 30 },

  // CAREER (Goal 1 & 6)
  { id: 't20', title: 'Update Resume', priority: 10, isCompleted: false, goalId: 'goal-1', estimatedDurationMinutes: 45 }, // Today's Priority 3
  { id: 't21', title: 'Apply to 5 Internships', priority: 10, isCompleted: false, goalId: 'goal-1', estimatedDurationMinutes: 60 },
  { id: 't22', title: 'Connect with 3 Recruiters', priority: 8, isCompleted: false, goalId: 'goal-6', estimatedDurationMinutes: 30 },
  { id: 't23', title: 'Optimize LinkedIn Profile', priority: 7, isCompleted: false, goalId: 'goal-6', estimatedDurationMinutes: 30 },
  { id: 't24', title: 'Write LinkedIn Post', priority: 7, isCompleted: false, goalId: 'goal-6', estimatedDurationMinutes: 20 },

  // FITNESS (Goal 5)
  { id: 't25', title: 'Morning Walk', priority: 8, isCompleted: true, goalId: 'goal-5', estimatedDurationMinutes: 30 },
  { id: 't26', title: 'Gym Workout', priority: 8, isCompleted: false, goalId: 'goal-5', estimatedDurationMinutes: 90 },
  { id: 't27', title: 'Drink 3L Water', priority: 7, isCompleted: false, goalId: 'goal-5', estimatedDurationMinutes: 5 },
  { id: 't28', title: 'Stretching Session', priority: 6, isCompleted: false, goalId: 'goal-5', estimatedDurationMinutes: 15 },
  { id: 't29', title: 'Sleep Before 11 PM', priority: 9, isCompleted: false, goalId: 'goal-5', estimatedDurationMinutes: 0 },

  // COMMUNICATION (Goal 7)
  { id: 't30', title: 'Practice Public Speaking', priority: 7, isCompleted: false, goalId: 'goal-7', estimatedDurationMinutes: 30 },
  { id: 't31', title: 'Record 5-Minute Presentation', priority: 6, isCompleted: false, goalId: 'goal-7', estimatedDurationMinutes: 45 },
  { id: 't32', title: 'Read Technical Article', priority: 6, isCompleted: false, goalId: 'goal-7', estimatedDurationMinutes: 20 }
];
