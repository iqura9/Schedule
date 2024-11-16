import { crossover } from "./crossover";
import { evaluateFitness } from "./evaluateFitness";
import { generateInitialPopulation } from "./generateInitialPopulation";
import { isValidSchedule } from "./isValidSchedule";
import { mutation } from "./mutation";
import { selection } from "./selection";
import { Classroom, Group, Lecturer, Lesson } from "./types";

// Параметри генетичного алгоритму
const POPULATION_SIZE = 50;
const GENERATIONS = 100;
const MUTATION_RATE = 0.1;
const CROSSOVER_RATE = 0.8;

// Основна функція для запуску генетичного алгоритму
export const generateScheduleGA = (
  groups: Group[],
  lecturers: Lecturer[],
  classrooms: Classroom[]
): Lesson[] => {
  // Генеруємо початкову популяцію
  let population: Lesson[][] = generateInitialPopulation(
    POPULATION_SIZE,
    groups,
    lecturers,
    classrooms
  );

  // Основний цикл поколінь
  for (let generation = 0; generation < GENERATIONS; generation++) {
    // Обчислюємо придатність кожного індивіда
    const fitnessScores = population.map((individual) =>
      evaluateFitness(individual)
    );

    // Вибираємо батьків для кросоверу
    const matingPool = selection(population, fitnessScores);

    // Створюємо нове покоління
    const newPopulation: Lesson[][] = [];

    while (newPopulation.length < POPULATION_SIZE) {
      const parent1 = matingPool[Math.floor(Math.random() * matingPool.length)];
      const parent2 = matingPool[Math.floor(Math.random() * matingPool.length)];

      let offspring: Lesson[];

      // Виконуємо кросовер з певною ймовірністю
      if (Math.random() < CROSSOVER_RATE) {
        offspring = crossover(parent1, parent2);
      } else {
        offspring = [...parent1];
      }

      // Виконуємо мутацію з певною ймовірністю
      if (Math.random() < MUTATION_RATE) {
        offspring = mutation(offspring, lecturers, classrooms);
      }

      // Додаємо потомка до нового покоління, якщо він валідний
      if (isValidSchedule(offspring, lecturers, classrooms)) {
        newPopulation.push(offspring);
      }
    }

    // Оновлюємо популяцію
    population = newPopulation;

    // Логування прогресу
    console.log(
      `Покоління ${generation + 1}, найкраща придатність: ${Math.min(
        ...fitnessScores
      )}`
    );
  }

  // Повертаємо найкращий розклад
  const fitnessScores = population.map((individual) =>
    evaluateFitness(individual)
  );
  const bestIndex = fitnessScores.indexOf(Math.min(...fitnessScores));
  return population[bestIndex];
};









