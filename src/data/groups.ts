import { Group } from "../types";

export const generateGroups = (
  numGroups: number,
  minStudents: number,
  maxStudents: number
): Group[] => {
  return Array.from({ length: numGroups }, (_, i) => {
    const students = getRandomInt(minStudents, maxStudents);
    const subgroupSize = Math.floor(students / 2);

    return {
      id: `G${i + 1}`,
      name: `Група ${i + 1}`,
      students,
      subgroups: [subgroupSize, students - subgroupSize],
      subjects: [],
    };
  });
};

// Допоміжна функція
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
