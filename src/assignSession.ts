import { isHardConstraintSatisfied } from "./isHardConstraintSatisfied";
import { shuffleArray } from "./shuffleArray";
import { Classroom, Lecturer, Lesson } from "./types";

// Функція для призначення сесії з урахуванням жорстких обмежень
export function assignSession(
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