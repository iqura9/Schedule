import { Classroom, Group, Lecturer, ScheduleEntry } from "./types";

export const generateSchedule = (
  groups: Group[],
  lecturers: Lecturer[],
  classrooms: Classroom[]
): ScheduleEntry[] => {
  const schedule: ScheduleEntry[] = [];

  // Всі можливі часові слоти
  const timeSlots = [
    "Пон 1",
    "Пон 2",
    "Вів 1",
    "Вів 2",
    "Сер 1",
    "Сер 2",
    "Чет 1",
    "Чет 2",
    "Пят 1",
    "Пят 2",
  ];

  groups.forEach((group) => {
    group.subjects.forEach((subject) => {
      // Знайдемо доступного лектора
      const lecturer = lecturers.find((lec) =>
        lec.subjects.includes(subject.name)
      );

      // Знайдемо доступну аудиторію
      const classroom = classrooms.find(
        (room) => room.capacity >= group.students
      );

      // Знайдемо вільний часовий слот
      const timeSlot = timeSlots.find((slot) => {
        // Перевірка на конфлікти
        return !schedule.some(
          (entry) =>
            entry.timeSlot === slot &&
            (entry.group.id === group.id ||
              entry.lecturer.name === lecturer?.name ||
              entry.classroom.id === classroom?.id)
        );
      });

      if (lecturer && classroom && timeSlot) {
        schedule.push({
          group,
          subject,
          lecturer,
          classroom,
          timeSlot,
        });
      }
    });
  });

  return schedule;
};
