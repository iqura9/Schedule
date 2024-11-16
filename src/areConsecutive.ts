// Функція для перевірки, чи є два часові слоти послідовними
export function areConsecutive(timeslot1: string, timeslot2: string): boolean {
    const [day1, lesson1] = timeslot1.split(", пара номер ");
    const [day2, lesson2] = timeslot2.split(", пара номер ");
  
    if (day1 !== day2) return false;
    return parseInt(lesson2) - parseInt(lesson1) === 1;
  }
  
  
  