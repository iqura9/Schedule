import { generateValidSchedule } from "./generateValidSchedule";
import { Classroom, Group, Lecturer, Lesson } from "./types";

// Функція для генерації початкової популяції
export function generateInitialPopulation(
    size: number,
    groups: Group[],
    lecturers: Lecturer[],
    classrooms: Classroom[]
  ): Lesson[][] {
    const population: Lesson[][] = [];
    for (let i = 0; i < size; i++) {
      const individual = generateValidSchedule(groups, lecturers, classrooms);
      population.push(individual);
    }
    return population;
  }
  