import { Classroom, Group, Lecturer, Lesson } from "./types";

export const generateSchedule = (
  groups: Group[],
  lecturers: Lecturer[],
  classrooms: Classroom[]
): Lesson[] => {
  const schedule: Lesson[] = [];

  const weeks = ["Парний", "Не парний"];
  const days = ["Понеділок", "Вівторок", "Середа", "Четвер", "Пʼятниця"];
  const lessonsPerDay = 3;
  const timeslots: string[] = [];

  weeks.forEach((week) => {
    days.forEach((day) => {
      for (let lesson = 1; lesson <= lessonsPerDay; lesson++) {
        timeslots.push(`${week} - ${day}, пара номер ${lesson}`);
      }
    });
  });

  const allLessons: Lesson[] = [];

  groups.forEach((group) => {
    group.subjects.forEach((subject) => {
      const weeksInSemester = 14; 
      const lectureSessionsPerWeek = subject.lectures / 1.5 / weeksInSemester;
      const practiceSessionsPerWeek = subject.practices / 1.5 / weeksInSemester;

      const totalLectureSessions = Math.ceil(lectureSessionsPerWeek * weeksInSemester);
      const totalPracticeSessions = Math.ceil(practiceSessionsPerWeek * weeksInSemester);

  
      for (let i = 0; i < totalLectureSessions; i++) {
        allLessons.push({
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

      for (let i = 0; i < totalPracticeSessions; i++) {
        if (subject.requiresSubdivision) {
          // Додати заняття для кожної підгрупи
          group.subgroups.forEach((subgroupSize, index) => {
            allLessons.push({
              timeslot: "",
              groups: [`${group.id} (Підгрупа ${index + 1})`],
              subject: subject.name,
              type: "Практика",
              lecturer: "",
              auditorium: "",
              students: subgroupSize,
              capacity: 0,
            });
          });
        } else {
          allLessons.push({
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
      }
    });
  });

  const lecturerSchedule: { [key: string]: { [key: string]: boolean } } = {};
  const groupSchedule: { [key: string]: { [key: string]: boolean } } = {};
  const classroomSchedule: { [key: string]: { [key: string]: boolean } } = {};

  allLessons.forEach((lesson) => {
    const possibleLecturers = lecturers.filter(
      (lecturer) =>
        lecturer.subjects.includes(lesson.subject) &&
        lecturer.types.includes(lesson.type)
    );

    for (const timeslot of timeslots) {
      const availableLecturer = possibleLecturers.find((lecturer) => {
        if (
          lecturerSchedule[lecturer.name] &&
          lecturerSchedule[lecturer.name][timeslot]
        ) {
          return false;
        }
        return true;
      });

      if (!availableLecturer) continue;

      const isGroupAvailable = lesson.groups.every((groupId) => {
        if (groupSchedule[groupId] && groupSchedule[groupId][timeslot]) {
          return false;
        }
        return true;
      });

      if (!isGroupAvailable) continue;

      const suitableClassrooms = classrooms.filter(
        (classroom) => classroom.capacity >= lesson.students
      );

      const availableClassroom = suitableClassrooms.find((classroom) => {
        if (
          classroomSchedule[classroom.id] &&
          classroomSchedule[classroom.id][timeslot]
        ) {
          return false;
        }
        return true;
      });

      if (!availableClassroom) continue;

      lesson.timeslot = timeslot;
      lesson.lecturer = availableLecturer.name;
      lesson.auditorium = availableClassroom.id;
      lesson.capacity = availableClassroom.capacity;

      if (!lecturerSchedule[availableLecturer.name]) {
        lecturerSchedule[availableLecturer.name] = {};
      }
      lecturerSchedule[availableLecturer.name][timeslot] = true;

      lesson.groups.forEach((groupId) => {
        if (!groupSchedule[groupId]) {
          groupSchedule[groupId] = {};
        }
        groupSchedule[groupId][timeslot] = true;
      });

      if (!classroomSchedule[availableClassroom.id]) {
        classroomSchedule[availableClassroom.id] = {};
      }
      classroomSchedule[availableClassroom.id][timeslot] = true;

      schedule.push(lesson);
      break;
    }

    if (lesson.timeslot === "") {
      console.warn(`Не вдалося призначити заняття: ${lesson.subject} для групи(груп) ${lesson.groups.join(", ")}`);
    }
  });

  schedule.sort((a, b) => timeslots.indexOf(a.timeslot) - timeslots.indexOf(b.timeslot));

  return schedule;
};
