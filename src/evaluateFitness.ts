import { countGaps } from "./countGaps";
import { Lesson } from "./types";

// Функція для оцінки придатності розкладу
export function evaluateFitness(schedule: Lesson[]): number {
    let fitness = 0;
  
    // Мінімізуємо кількість "вікон" у розкладах студентів
    const groupSchedules: { [key: string]: string[] } = {};
  
    schedule.forEach((lesson) => {
      lesson.groups.forEach((group) => {
        if (!groupSchedules[group]) {
          groupSchedules[group] = [];
        }
        groupSchedules[group].push(lesson.timeslot);
      });
    });
  
    for (const group in groupSchedules) {
      const timeslots = groupSchedules[group];
      fitness += countGaps(timeslots);
    }
  
    // Мінімізуємо кількість "вікон" у розкладах викладачів
    const lecturerSchedules: { [key: string]: string[] } = {};
  
    schedule.forEach((lesson) => {
      const lecturer = lesson.lecturer;
      if (!lecturerSchedules[lecturer]) {
        lecturerSchedules[lecturer] = [];
      }
      lecturerSchedules[lecturer].push(lesson.timeslot);
    });
  
    for (const lecturer in lecturerSchedules) {
      const timeslots = lecturerSchedules[lecturer];
      fitness += countGaps(timeslots);
    }
  
    return fitness;
  }
  
  