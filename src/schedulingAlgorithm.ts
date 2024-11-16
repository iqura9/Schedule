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

  // Create timeslots for each day and lesson number
  days.forEach((day) => {
    for (let lesson = 1; lesson <= lessonsPerDay; lesson++) {
      timeslots.push(`${day}, пара номер ${lesson}`);
    }
  });

  // Generate schedule for each group
  groups.forEach((group) => {
    const sessions: Lesson[] = [];

    // Create sessions for each subject
    group.subjects.forEach((subject) => {
      const totalLectures = Math.ceil(subject.lectures / 1.5);
      const totalPractices = Math.ceil(subject.practices / 1.5);

      // Add lecture sessions
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

      // Add practice sessions
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

    // Assign sessions to timeslots
    let sessionIndex = 0;
    timeslots.forEach((timeslot) => {
      if (sessionIndex >= sessions.length) return;
      const lesson = sessions[sessionIndex];
      lesson.timeslot = timeslot;

      // Assign a lecturer who can teach the subject
      const possibleLecturers = lecturers.filter((lecturer) =>
        lecturer.subjects.includes(lesson.subject)
      );
      if (possibleLecturers.length > 0) {
        const assignedLecturer =
          possibleLecturers[Math.floor(Math.random() * possibleLecturers.length)];
        lesson.lecturer = assignedLecturer.name;
      }

      // Assign a classroom with sufficient capacity
      const possibleClassrooms = classrooms.filter(
        (classroom) => classroom.capacity >= lesson.students
      );
      if (possibleClassrooms.length > 0) {
        const assignedClassroom =
          possibleClassrooms[Math.floor(Math.random() * possibleClassrooms.length)];
        lesson.auditorium = assignedClassroom.id;
        lesson.capacity = assignedClassroom.capacity;
      }

      // Add the lesson to the schedule
      schedule.push(lesson);
      sessionIndex++;
    });
  });

  return schedule;
};
