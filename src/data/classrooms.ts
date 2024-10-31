import { Classroom } from "../types";

export const generateClassrooms = (
  numClassrooms: number,
  minCapacity: number,
  maxCapacity: number
): Classroom[] => {
  return Array.from({ length: numClassrooms }, (_, i) => ({
    id: `A${i + 1}`,
    capacity:
      Math.floor(Math.random() * (maxCapacity - minCapacity + 1)) + minCapacity,
  }));
};