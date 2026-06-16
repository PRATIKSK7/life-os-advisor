import { Meeting, GymSession } from '@/types';
import { parse, format, differenceInMinutes, isAfter, isBefore } from 'date-fns';

export interface TimeBlock {
  start: string;
  end: string;
  duration: number; // minutes
}

export function calculateFreeTimeBlocks(
  currentTime: Date,
  meetings: Meeting[],
  gymSessions: GymSession[]
): TimeBlock[] {
  const todayStr = format(currentTime, 'yyyy-MM-dd');
  
  const allEvents = [...meetings, ...gymSessions]
    .filter(e => e.date === todayStr)
    .map(e => ({
      start: parse(e.startTime, 'HH:mm', currentTime),
      end: parse(e.endTime, 'HH:mm', currentTime)
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const freeBlocks: TimeBlock[] = [];
  let currentPointer = currentTime;
  
  // Set an arbitrary end of active day, e.g., 22:00
  const endOfActiveDay = parse('22:00', 'HH:mm', currentTime);

  for (const event of allEvents) {
    if (isAfter(currentPointer, event.end)) continue;

    if (isBefore(currentPointer, event.start)) {
      const duration = differenceInMinutes(event.start, currentPointer);
      if (duration > 0) {
        freeBlocks.push({
          start: format(currentPointer, 'HH:mm'),
          end: format(event.start, 'HH:mm'),
          duration
        });
      }
    }
    
    // Move pointer to the end of the event, but only if it's in the future relative to the pointer
    if (isBefore(currentPointer, event.end)) {
        currentPointer = event.end;
    }
  }

  // Check remaining time until end of day
  if (isBefore(currentPointer, endOfActiveDay)) {
    const duration = differenceInMinutes(endOfActiveDay, currentPointer);
    if (duration > 0) {
      freeBlocks.push({
        start: format(currentPointer, 'HH:mm'),
        end: format(endOfActiveDay, 'HH:mm'),
        duration
      });
    }
  }

  return freeBlocks;
}
