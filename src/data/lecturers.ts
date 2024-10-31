import { Lecturer } from "../types";
import { subjectsList } from "./subjects";

export const lecturersNames = ["Лектор 1", "Лектор 2", "Лектор 3"];

export const generateLecturers = (): Lecturer[] => {
  return lecturersNames.map((name) => ({
    name,
    subjects: subjectsList.slice(
      0,
      Math.floor(Math.random() * subjectsList.length) + 1
    ),
  }));
};
