import { Classroom, Group, Lecturer, Lesson } from "./types";

export const generateSchedule = (
  groups: Group[],
  lecturers: Lecturer[],
  classrooms: Classroom[]
): Lesson[] => {
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
    // Створюємо сесії для кожного предмета
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
      console.log("Не вдалося призначити сесію:", session);
    }
  });

  return schedule;
};

// Функція для призначення сесії з урахуванням жорстких обмежень
function assignSession(
  session: Lesson,
  schedule: Lesson[],
  lecturers: Lecturer[],
  classrooms: Classroom[],
  timeslots: string[]
): boolean {
  for (const timeslot of timeslots) {
    // Перевіряємо, чи група вільна у цей час
    const groupBusy = schedule.some(
      (s) =>
        s.timeslot === timeslot &&
        s.groups.some((g) => session.groups.includes(g))
    );
    if (groupBusy) continue;

    // Знаходимо можливих лекторів
    const possibleLecturers = lecturers.filter((lecturer) =>
      lecturer.subjects.includes(session.subject)
    );

    for (const lecturer of possibleLecturers) {
      // Перевіряємо, чи лектор вільний у цей час
      const lecturerBusy = schedule.some(
        (s) => s.timeslot === timeslot && s.lecturer === lecturer.name
      );
      if (lecturerBusy) continue;

      // Знаходимо доступні аудиторії
      const totalStudents = session.students;
      const availableClassrooms = classrooms.filter(
        (classroom) =>
          classroom.capacity >= totalStudents &&
          !schedule.some(
            (s) => s.timeslot === timeslot && s.auditorium === classroom.id
          )
      );
      if (availableClassrooms.length === 0) continue;

      const classroom = availableClassrooms[0];

      // Призначаємо сесію
      session.timeslot = timeslot;
      session.lecturer = lecturer.name;
      session.auditorium = classroom.id;
      session.capacity = classroom.capacity;
      schedule.push(session);
      return true;
    }
  }
  // Не вдалося призначити сесію
  return false;
}

// Функція для перемішування масиву
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
