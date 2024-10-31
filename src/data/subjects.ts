// subjects.ts

import { Group, Subject } from "../types";



export const subjectsList = [
  "Теорія прийняття рішень",
  "Статистичне моделювання",
  "Інтелектуальні системи",
  "Інформаційні технології",
  "Розробка ПЗ під мобільні",
];

export const assignSubjectsToGroups = (groups: Group[]): Group[] => {
  return groups.map((group) => {
    let groupSubjects: Subject[] = [];

    switch (group.id) {
      case "TTP-41":
      case "TTP-42":
        groupSubjects = [
          {
            name: "Теорія прийняття рішень",
            lectures: 30,
            practices: 15,
            requiresSubdivision: true,
          },
          {
            name: "Статистичне моделювання",
            lectures: 30,
            practices: 15,
            requiresSubdivision: true,
          },
          {
            name: "Інформаційні технології",
            lectures: 15,
            practices: 15,
            requiresSubdivision: false,
          },
        ];
        break;
      case "MI-41":
      case "MI-42":
        groupSubjects = [
          {
            name: "Статистичне моделювання",
            lectures: 30,
            practices: 15,
            requiresSubdivision: true,
          },
          {
            name: "Інтелектуальні системи",
            lectures: 30,
            practices: 15,
            requiresSubdivision: true,
          },
          {
            name: "Інформаційні технології",
            lectures: 15,
            practices: 15,
            requiresSubdivision: true,
          },
          {
            name: "Розробка ПЗ під мобільні",
            lectures: 15,
            practices: 15,
            requiresSubdivision: true,
          },
        ];
        break;
      case "TK-41":
        groupSubjects = [
          {
            name: "Статистичне моделювання",
            lectures: 30,
            practices: 15,
            requiresSubdivision: true,
          },
          {
            name: "Інтелектуальні системи",
            lectures: 30,
            practices: 15,
            requiresSubdivision: true,
          },
          {
            name: "Теорія прийняття рішень",
            lectures: 15,
            practices: 15,
            requiresSubdivision: true,
          },
        ];
        break;
    }

    return {
      ...group,
      subjects: groupSubjects,
    };
  });
};
