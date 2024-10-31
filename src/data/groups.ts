import { Group } from "../types";


export const generateGroups = (): Group[] => {
  return [
    {
      id: "TTP-41",
      students: 30,
      subgroups: [10, 20],
      subjects: [],
    },
    {
      id: "TTP-42",
      students: 28,
      subgroups: [14, 14],
      subjects: [],
    },
    {
      id: "MI-41",
      students: 30,
      subgroups: [15, 15],
      subjects: [],
    },
    {
      id: "MI-42",
      students: 29,
      subgroups: [15, 14],
      subjects: [],
    },
    {
      id: "TK-41",
      students: 25,
      subgroups: [13, 12],
      subjects: [],
    },
  ];
};
