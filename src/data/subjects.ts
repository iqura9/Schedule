import { Group, Subject } from "../types";

export const subjectsList = [
  "Математика",
  "Фізика",
  "Програмування",
  "Хімія",
  "Біологія",
];

export const assignSubjectsToGroups = (groups: Group[]): Group[] => {
  return groups.map((group) => ({
    ...group,
    subjects: subjectsList.map((subject): Subject => ({
      name: subject,
      lectures: 30, // Кількість годин лекцій
      practices: 15, // Кількість годин практичних
      requiresSubdivision: Math.random() > 0.5, // Випадково
    })),
  }));
};
