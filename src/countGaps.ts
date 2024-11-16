import { areConsecutive } from "./areConsecutive";

// Функція для підрахунку кількості "вікон" у розкладі
export function countGaps(timeslots: string[]): number {
    const sortedTimeslots = timeslots.slice().sort();
    let gaps = 0;
  
    for (let i = 1; i < sortedTimeslots.length; i++) {
      const prev = sortedTimeslots[i - 1];
      const current = sortedTimeslots[i];
  
      if (!areConsecutive(prev, current)) {
        gaps++;
      }
    }
    return gaps;
  }
  