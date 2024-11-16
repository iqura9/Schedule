import { isHardConstraintSatisfied } from "./isHardConstraintSatisfied";
import { shuffleArray } from "./shuffleArray";
import { Classroom, Lecturer, Lesson } from "./types";

// Функція мутації (зміна часових слотів)
export function mutation(
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

