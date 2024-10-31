import { Group, Subject } from "../types";

export const subjectsList = [
  "Математика",
  "Фізика",
  "Програмування",
  "Хімія",
  "Біологія",
];

export const assignSubjectsToGroups = (groups: Group[]): Group[] => {
  return groups.map((group) => {
    // Випадково визначаємо кількість предметів для групи
    const numSubjects = getRandomInt(3, subjectsList.length);
    const groupSubjects = shuffleArray(subjectsList).slice(0, numSubjects);

    return {
      ...group,
      subjects: groupSubjects.map((subject): Subject => ({
        name: subject,
        lectures: getRandomInt(14, 28), // Випадкова кількість годин лекцій
        practices: getRandomInt(14, 28), // Випадкова кількість годин практичних
        requiresSubdivision: group.students > 25, // Поділ на підгрупи, якщо студентів більше 25
      })),
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
