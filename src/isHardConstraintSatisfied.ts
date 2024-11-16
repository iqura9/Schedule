import { Lesson } from "./types";

// Перевірка жорстких обмежень для сесії
export function isHardConstraintSatisfied(
    session: Lesson,
    schedule: Lesson[],
    timeslot: string
  ): boolean {
    // Група не повинна бути зайнята в цей час
    const groupBusy = schedule.some(
      (s) =>
        s.timeslot === timeslot &&
        s.groups.some((g) => session.groups.includes(g))
    );
    if (groupBusy) return false;
  
    // Якщо це лекція, перевіряємо, чи можна об'єднати групи
    if (session.type === "Лекція") {
      // Додаткові перевірки можна додати тут
    }
  
    return true;
  }
  