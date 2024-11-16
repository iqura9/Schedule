import { Lesson } from "./types";

// Функція для відбору батьків (турнірна селекція)
export function selection(population: Lesson[][], fitnessScores: number[]): Lesson[][] {
    const matingPool: Lesson[][] = [];
    const tournamentSize = 5;
  
    for (let i = 0; i < population.length; i++) {
      let best: Lesson[] | null = null;
      let bestFitness = Infinity;
  
      for (let j = 0; j < tournamentSize; j++) {
        const index = Math.floor(Math.random() * population.length);
        const individual = population[index];
        const fitness = fitnessScores[index];
  
        if (fitness < bestFitness) {
          bestFitness = fitness;
          best = individual;
        }
      }
      if (best) matingPool.push(best);
    }
    return matingPool;
  }
  