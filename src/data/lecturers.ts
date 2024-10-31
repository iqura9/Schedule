import { Lecturer } from "../types";
import { subjectsList } from "./subjects";

export const lecturersNames = ["Лектор 1", "Лектор 2", "Лектор 3"];

export const generateLecturers = (): Lecturer[] => {
  return lecturersNames.map((name) => {
    const numSubjects = getRandomInt(2, subjectsList.length);
    const lecturerSubjects = shuffleArray(subjectsList).slice(0, numSubjects);

    return {
      name,
      subjects: lecturerSubjects,
      classTypes: getRandomClassTypes(), // ["лекції"], ["практичні"], або ["лекції", "практичні"]
    };
  });
};

// Допоміжні функції
function shuffleArray<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomClassTypes(): string[] {
  const types = ["лекції", "практичні"];
  const numTypes = getRandomInt(1, 2);
  return shuffleArray(types).slice(0, numTypes);
}
