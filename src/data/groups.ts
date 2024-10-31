import { Group } from "../types";

export const generateGroups = (
  numGroups: number,
  minStudents: number,
  maxStudents: number
): Group[] => {
  return Array.from({ length: numGroups }, (_, i) => ({
    id: `G${i + 1}`,
    students:
      Math.floor(Math.random() * (maxStudents - minStudents + 1)) + minStudents,
    subjects: [],
  }));
};
