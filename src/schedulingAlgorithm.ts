import { Classroom, Group, Lecturer, Lesson } from "./types";

export const generateSchedule = (
  groups: Group[],
  lecturers: Lecturer[],
  classrooms: Classroom[]
): Lesson[] => {
  const schedule: Lesson[] = [];

  const weeks = ["Парний", "Непарний"];
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

  const groupToSubgroups: { [groupId: string]: string[] } = {};
  const subgroupToGroup: { [subgroupId: string]: string } = {};

  groups.forEach((group) => {
    const subgroupsIds = group.subgroups.map(
      (_, index) => `${group.id} (Підгрупа ${index + 1})`
    );
    groupToSubgroups[group.id] = subgroupsIds;
    subgroupsIds.forEach((subgroupId) => {
      subgroupToGroup[subgroupId] = group.id;
    });
  });

  const lecturerLoad: { [lecturerName: string]: number } = {};
  lecturers.forEach((lecturer) => {
    lecturerLoad[lecturer.name] = 0;
  });

  const lecturerSchedule: { [lecturerName: string]: { [timeslot: string]: boolean } } = {};
  const groupSchedule: { [groupId: string]: { [timeslot: string]: boolean } } = {};
  const classroomSchedule: { [classroomId: string]: { [timeslot: string]: boolean } } = {};

  const groupLessonQueues: { [groupId: string]: Lesson[] } = {};

  groups.forEach((group) => {
    groupLessonQueues[group.id] = [];
    const groupLessons: Lesson[] = [];

    group.subjects.forEach((subject) => {
      const weeksInSemester = 14;
      const lectureSessionsPerWeek = subject.lectures / 1.5 / weeksInSemester;
      const practiceSessionsPerWeek = subject.practices / 1.5 / weeksInSemester;

      const totalLectureSessions = Math.ceil(
        lectureSessionsPerWeek * weeksInSemester
      );
      const totalPracticeSessions = Math.ceil(
        practiceSessionsPerWeek * weeksInSemester
      );

      for (let i = 0; i < totalLectureSessions; i++) {
        groupLessons.push({
          timeslot: '',
          groups: [group.id],
          subject: subject.name,
          type: 'Лекція',
          lecturer: '',
          auditorium: '',
          students: group.students,
          capacity: 0,
        });
      }

      for (let i = 0; i < totalPracticeSessions; i++) {
        if (subject.requiresSubdivision) {
          group.subgroups.forEach((subgroupSize, index) => {
            const subgroupId = `${group.id} (Підгрупа ${index + 1})`;
            groupLessons.push({
              timeslot: '',
              groups: [subgroupId],
              subject: subject.name,
              type: 'Практика',
              lecturer: '',
              auditorium: '',
              students: subgroupSize,
              capacity: 0,
            });
          });
        } else {
          groupLessons.push({
            timeslot: '',
            groups: [group.id],
            subject: subject.name,
            type: 'Практика',
            lecturer: '',
            auditorium: '',
            students: group.students,
            capacity: 0,
          });
        }
      }
    });

    shuffleArray(groupLessons);

    groupLessonQueues[group.id] = groupLessons;
  });

  const groupLastSubjectPerDay: { [groupId: string]: { [day: string]: string } } = {};

  groups.forEach((group) => {
    groupLastSubjectPerDay[group.id] = {};
    days.forEach((day) => {
      groupLastSubjectPerDay[group.id][day] = '';
    });
  });

  for (const week of weeks) {
    for (const day of days) {
      for (let lessonNum = 1; lessonNum <= lessonsPerDay; lessonNum++) {
        const timeslot = `${week} - ${day}, пара номер ${lessonNum}`;

        for (const group of groups) {
          if (groupLessonQueues[group.id].length === 0) continue;

          const lesson = groupLessonQueues[group.id].shift()!;
          const subject = lesson.subject;

          if (groupLastSubjectPerDay[group.id][day] === subject) {
            groupLessonQueues[group.id].push(lesson);
            continue;
          }

          const possibleLecturers = lecturers.filter(
            (lecturer) =>
              lecturer.subjects.includes(subject) &&
              lecturer.types.includes(lesson.type)
          );

          possibleLecturers.sort(
            (a, b) => lecturerLoad[a.name] - lecturerLoad[b.name]
          );

          let lessonAssigned = false;

          for (const lecturer of possibleLecturers) {
 
            if (
              lecturerSchedule[lecturer.name] &&
              lecturerSchedule[lecturer.name][timeslot]
            ) {
              continue;
            }

            const isGroupAvailable = lesson.groups.every((groupId) => {
              const relatedGroups = getAllRelatedGroups(
                groupId,
                groupToSubgroups,
                subgroupToGroup
              );
              return relatedGroups.every((relGroupId) => {
                if (groupSchedule[relGroupId] && groupSchedule[relGroupId][timeslot]) {
                  return false;
                }
                return true;
              });
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
            lesson.lecturer = lecturer.name;
            lesson.auditorium = availableClassroom.id;
            lesson.capacity = availableClassroom.capacity;

       
            if (!lecturerSchedule[lecturer.name]) {
              lecturerSchedule[lecturer.name] = {};
            }
            lecturerSchedule[lecturer.name][timeslot] = true;


            lecturerLoad[lecturer.name] += 1.5; 

            lesson.groups.forEach((groupId) => {
              const relatedGroups = getAllRelatedGroups(
                groupId,
                groupToSubgroups,
                subgroupToGroup
              );
              relatedGroups.forEach((relGroupId) => {
                if (!groupSchedule[relGroupId]) {
                  groupSchedule[relGroupId] = {};
                }
                groupSchedule[relGroupId][timeslot] = true;
              });
            });

            if (!classroomSchedule[availableClassroom.id]) {
              classroomSchedule[availableClassroom.id] = {};
            }
            classroomSchedule[availableClassroom.id][timeslot] = true;

            groupLastSubjectPerDay[group.id][day] = subject;

            schedule.push(lesson);
            lessonAssigned = true;
            break;
          }

          if (!lessonAssigned) {
            groupLessonQueues[group.id].push(lesson);
          }
        }
      }
    }
  }

  for (const groupId in groupLessonQueues) {
    if (groupLessonQueues[groupId].length > 0) {
      groupLessonQueues[groupId].forEach((lesson) => {
        console.warn(
          `Не вдалося призначити заняття: ${lesson.subject} для групи(груп) ${lesson.groups.join(
            ', '
          )}`
        );
      });
    }
  }

  // Сортування розкладу за таймслотами
  schedule.sort(
    (a, b) => timeslots.indexOf(a.timeslot) - timeslots.indexOf(b.timeslot)
  );

  return schedule;
};

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getAllRelatedGroups(
  groupId: string,
  groupToSubgroups: { [groupId: string]: string[] },
  subgroupToGroup: { [subgroupId: string]: string }
): string[] {
  const relatedGroups = new Set<string>();
  relatedGroups.add(groupId);

  if (groupToSubgroups[groupId]) {
    groupToSubgroups[groupId].forEach((subgroupId) =>
      relatedGroups.add(subgroupId)
    );
  }

  if (subgroupToGroup[groupId]) {

    const parentGroupId = subgroupToGroup[groupId];
    relatedGroups.add(parentGroupId);
    groupToSubgroups[parentGroupId].forEach((subgroupId) =>
      relatedGroups.add(subgroupId)
    );
  }

  return Array.from(relatedGroups);
}
