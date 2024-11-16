import { isHardConstraintSatisfied } from "./isHardConstraintSatisfied";
import { shuffleArray } from "./shuffleArray";
import { Classroom, Group, Lecturer, Lesson } from "./types";

// Функція для генерації валідного розкладу з урахуванням жорстких обмежень
export function generateValidSchedule(
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