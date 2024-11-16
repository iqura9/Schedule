import { Classroom, Lecturer, Lesson } from "./types";

// Функція для перевірки валідності розкладу (жорсткі обмеження)
export function isValidSchedule(
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
  