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

// Функція для генерації початкової популяції
function generateInitialPopulation(
  size: number,
  groups: Group[],
  lecturers: Lecturer[],
  classrooms: Classroom[]
): Lesson[][] {
  const population: Lesson[][] = [];
  for (let i = 0; i < size; i++) {
    const individual = generateValidSchedule(groups, lecturers, classrooms);
    population.push(individual);
  }
  return population;
}

// Функція для генерації валідного розкладу з урахуванням жорстких обмежень
function generateValidSchedule(
  groups: Group[],
  lecturers: Lecturer[],
  classrooms: Classroom[]
): Lesson[] {
  const schedule: Lesson[] = [];
  const days = ["Понеділок", "Вівторок", "Середа", "Четвер", "Пʼятниця"];
  const lessonsPerDay = 3;
  const timeslots: string[] = [];

  days.forEach((day) => {
    for (let lesson = 1; lesson <= lessonsPerDay; lesson++) {
      timeslots.push(`${day}, пара номер ${lesson}`);
    }
  });

  // Збираємо всі сесії (заняття)
  const sessions: Lesson[] = [];

  groups.forEach((group) => {
    group.subjects.forEach((subject) => {
      const totalLectures = Math.ceil(subject.lectures / 1.5);
      const totalPractices = Math.ceil(subject.practices / 1.5);

      // Додаємо лекційні сесії
      for (let i = 0; i < totalLectures; i++) {
        sessions.push({
          timeslot: "",
          groups: [group.id],
          subject: subject.name,
          type: "Лекція",
          lecturer: "",
          auditorium: "",
          students: group.students,
          capacity: 0,
        });
      }

      // Додаємо практичні сесії
      for (let i = 0; i < totalPractices; i++) {
        sessions.push({
          timeslot: "",
          groups: [group.id],
          subject: subject.name,
          type: "Практика",
          lecturer: "",
          auditorium: "",
          students: group.students,
          capacity: 0,
        });
      }
    });
  });

  // Перемішуємо сесії для випадкового розподілу
  shuffleArray(sessions);

  // Пробуємо призначити кожну сесію
  sessions.forEach((session) => {
    const assigned = assignSession(
      session,
      schedule,
      lecturers,
      classrooms,
      timeslots
    );
    if (!assigned) {
      // Якщо не вдалося призначити сесію, можна обробити це відповідним чином
    }
  });

  return schedule;
}

// Функція для призначення сесії з урахуванням жорстких обмежень
function assignSession(
  session: Lesson,
  schedule: Lesson[],
  lecturers: Lecturer[],
  classrooms: Classroom[],
  timeslots: string[]
): boolean {
  // Перемішуємо часові слоти для випадковості
  shuffleArray(timeslots);

  for (const timeslot of timeslots) {
    // Перевіряємо жорсткі обмеження
    if (!isHardConstraintSatisfied(session, schedule, timeslot)) continue;

    // Знаходимо можливих лекторів
    const possibleLecturers = lecturers.filter(
      (lecturer) =>
        lecturer.subjects.includes(session.subject) &&
        lecturer.types.includes(session.type)
    );
    shuffleArray(possibleLecturers);

    for (const lecturer of possibleLecturers) {
      // Перевіряємо, чи лектор вільний у цей час
      const lecturerBusy = schedule.some(
        (s) => s.timeslot === timeslot && s.lecturer === lecturer.name
      );
      if (lecturerBusy) continue;

      // Знаходимо доступні аудиторії
      const availableClassrooms = classrooms.filter(
        (classroom) =>
          classroom.capacity >= session.students &&
          !schedule.some(
            (s) => s.timeslot === timeslot && s.auditorium === classroom.id
          )
      );
      shuffleArray(availableClassrooms);

      if (availableClassrooms.length === 0) continue;

      const classroom = availableClassrooms[0];

      // Призначаємо сесію
      session.timeslot = timeslot;
      session.lecturer = lecturer.name;
      session.auditorium = classroom.id;
      session.capacity = classroom.capacity;
      schedule.push({ ...session });
      return true;
    }
  }
  // Не вдалося призначити сесію
  return false;
}

// Перевірка жорстких обмежень для сесії
function isHardConstraintSatisfied(
  session: Lesson,
  schedule: Lesson[],
  timeslot: string
): boolean {
  // Група не повинна бути зайнята в цей час
  const groupBusy = schedule.some(
    (s) =>
      s.timeslot === timeslot &&
      s.groups.some((g) => session.groups.includes(g))
  );
  if (groupBusy) return false;

  // Якщо це лекція, перевіряємо, чи можна об'єднати групи
  if (session.type === "Лекція") {
    // Додаткові перевірки можна додати тут
  }

  return true;
}

// Функція для перевірки валідності розкладу (жорсткі обмеження)
function isValidSchedule(
  schedule: Lesson[],
  lecturers: Lecturer[],
  classrooms: Classroom[]
): boolean {
  for (const lesson of schedule) {
    // Перевірка жорстких обмежень
    const timeslot = lesson.timeslot;

    // Група не повинна бути зайнята в цей час
    const groupBusy = schedule.some(
      (s) =>
        s !== lesson &&
        s.timeslot === timeslot &&
        s.groups.some((g) => lesson.groups.includes(g))
    );
    if (groupBusy) return false;

    // Лектор не повинен бути зайнятий в цей час
    const lecturerBusy = schedule.some(
      (s) =>
        s !== lesson && s.timeslot === timeslot && s.lecturer === lesson.lecturer
    );
    if (lecturerBusy) return false;

    // Аудиторія не повинна бути зайнята в цей час
    const classroomBusy = schedule.some(
      (s) =>
        s !== lesson &&
        s.timeslot === timeslot &&
        s.auditorium === lesson.auditorium
    );
    if (classroomBusy) return false;

    // Група повинна поміщатися в аудиторію
    const classroom = classrooms.find(
      (c) => c.id === lesson.auditorium
    );
    if (!classroom || classroom.capacity < lesson.students) return false;

    // Лектор повинен викладати цей предмет і тип заняття
    const lecturer = lecturers.find(
      (l) => l.name === lesson.lecturer
    );
    if (
      !lecturer ||
      !lecturer.subjects.includes(lesson.subject) ||
      !lecturer.types.includes(lesson.type)
    )
      return false;
  }
  return true;
}

// Функція для оцінки придатності розкладу
function evaluateFitness(schedule: Lesson[]): number {
  let fitness = 0;

  // Мінімізуємо кількість "вікон" у розкладах студентів
  const groupSchedules: { [key: string]: string[] } = {};

  schedule.forEach((lesson) => {
    lesson.groups.forEach((group) => {
      if (!groupSchedules[group]) {
        groupSchedules[group] = [];
      }
      groupSchedules[group].push(lesson.timeslot);
    });
  });

  for (const group in groupSchedules) {
    const timeslots = groupSchedules[group];
    fitness += countGaps(timeslots);
  }

  // Мінімізуємо кількість "вікон" у розкладах викладачів
  const lecturerSchedules: { [key: string]: string[] } = {};

  schedule.forEach((lesson) => {
    const lecturer = lesson.lecturer;
    if (!lecturerSchedules[lecturer]) {
      lecturerSchedules[lecturer] = [];
    }
    lecturerSchedules[lecturer].push(lesson.timeslot);
  });

  for (const lecturer in lecturerSchedules) {
    const timeslots = lecturerSchedules[lecturer];
    fitness += countGaps(timeslots);
  }

  return fitness;
}

// Функція для підрахунку кількості "вікон" у розкладі
function countGaps(timeslots: string[]): number {
  const sortedTimeslots = timeslots.slice().sort();
  let gaps = 0;

  for (let i = 1; i < sortedTimeslots.length; i++) {
    const prev = sortedTimeslots[i - 1];
    const current = sortedTimeslots[i];

    if (!areConsecutive(prev, current)) {
      gaps++;
    }
  }
  return gaps;
}

// Функція для перевірки, чи є два часові слоти послідовними
function areConsecutive(timeslot1: string, timeslot2: string): boolean {
  const [day1, lesson1] = timeslot1.split(", пара номер ");
  const [day2, lesson2] = timeslot2.split(", пара номер ");

  if (day1 !== day2) return false;
  return parseInt(lesson2) - parseInt(lesson1) === 1;
}

// Функція для відбору батьків (турнірна селекція)
function selection(population: Lesson[][], fitnessScores: number[]): Lesson[][] {
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

// Функція кросоверу (одна точка)
function crossover(parent1: Lesson[], parent2: Lesson[]): Lesson[] {
  const point = Math.floor(Math.random() * parent1.length);
  const offspring = parent1
    .slice(0, point)
    .concat(parent2.slice(point));

  return offspring;
}

// Функція мутації (зміна часових слотів)
function mutation(
  schedule: Lesson[],
  lecturers: Lecturer[],
  classrooms: Classroom[]
): Lesson[] {
  const mutatedSchedule = schedule.map((lesson) => ({ ...lesson }));
  const index = Math.floor(Math.random() * mutatedSchedule.length);
  const lesson = mutatedSchedule[index];

  // Випадково змінюємо часовий слот
  const days = ["Понеділок", "Вівторок", "Середа", "Четвер", "Пʼятниця"];
  const lessonsPerDay = 3;
  const timeslots: string[] = [];

  days.forEach((day) => {
    for (let lessonNum = 1; lessonNum <= lessonsPerDay; lessonNum++) {
      timeslots.push(`${day}, пара номер ${lessonNum}`);
    }
  });

  shuffleArray(timeslots);

  for (const timeslot of timeslots) {
    // Перевіряємо жорсткі обмеження
    if (!isHardConstraintSatisfied(lesson, mutatedSchedule, timeslot)) continue;

    // Знаходимо можливих лекторів
    const possibleLecturers = lecturers.filter(
      (lecturer) =>
        lecturer.subjects.includes(lesson.subject) &&
        lecturer.types.includes(lesson.type)
    );
    shuffleArray(possibleLecturers);

    if (possibleLecturers.length === 0) continue;

    const lecturer = possibleLecturers[0];

    // Знаходимо доступні аудиторії
    const availableClassrooms = classrooms.filter(
      (classroom) =>
        classroom.capacity >= lesson.students &&
        !mutatedSchedule.some(
          (s) => s.timeslot === timeslot && s.auditorium === classroom.id
        )
    );
    shuffleArray(availableClassrooms);

    if (availableClassrooms.length === 0) continue;

    const classroom = availableClassrooms[0];

    // Застосовуємо мутацію
    lesson.timeslot = timeslot;
    lesson.lecturer = lecturer.name;
    lesson.auditorium = classroom.id;
    lesson.capacity = classroom.capacity;

    return mutatedSchedule;
  }

  return mutatedSchedule;
}

// Функція для перемішування масиву
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
