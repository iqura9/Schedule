import { Classroom, Group, Lecturer, Lesson } from "./types";

export const generateSchedule = (
  groups: Group[],
  lecturers: Lecturer[],
  classrooms: Classroom[]
): Lesson[] => {
  const schedule: Lesson[] = [];

  const days = ["Понеділок", "Вівторок", "Середа", "Четвер", "Пʼятниця"];
  const lessonsPerDay = 3;
  const timeslotsPerGroup: string[] = [];

  days.forEach((day) => {
    for (let lesson = 1; lesson <= lessonsPerDay; lesson++) {
      timeslotsPerGroup.push(`${day}, пара номер ${lesson}`);
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

    // Assign sessions to timeslots per group
    let timeslotIndex = 0;
    console.log('sessions',sessions)
    sessions.forEach((lesson) => {
      // Assign timeslot (cycle through timeslots if necessary)
      const timeslot = timeslotsPerGroup[timeslotIndex % timeslotsPerGroup.length];
      lesson.timeslot = timeslot;
      timeslotIndex++;

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
    });
  });

  return schedule;
};
