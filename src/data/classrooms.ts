import { Classroom } from "../types";

export const generateClassrooms = (
  numClassrooms: number,
  minCapacity: number,
  maxCapacity: number
): Classroom[] => {
  return Array.from({ length: numClassrooms }, (_, i) => ({
    id: `A${i + 1}`,
    capacity: getRandomInt(minCapacity, maxCapacity),
    type: getRandomClassroomType(), // "лекційна", "лабораторія", "семінарська"
  }));
};

// Допоміжні функції
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomClassroomType(): string {
  const types = ["лекційна", "лабораторія", "семінарська"];
  return types[Math.floor(Math.random() * types.length)];
}
