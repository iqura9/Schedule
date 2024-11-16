import { Lesson } from "./types";

// Функція кросоверу (одна точка)
export function crossover(parent1: Lesson[], parent2: Lesson[]): Lesson[] {
    const point = Math.floor(Math.random() * parent1.length);
    const offspring = parent1
      .slice(0, point)
      .concat(parent2.slice(point));
  
    return offspring;
  }
  