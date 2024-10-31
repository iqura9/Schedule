import { ReactNode } from "react";

// types/index.ts
export interface Subject {
    name: string;
    lectures: number;
    practices: number;
    requiresSubdivision: boolean;
  }
  
  export interface Group {
    id: string;
    students: number;
    subjects: Subject[];
  }
  
  export interface Lecturer {
    name: string;
    subjects: string[];
  }
  
  export interface Classroom {
    [x: string]: ReactNode;
    id: string;
    capacity: number;
  }
  
  export interface ScheduleEntry {
    group: Group;
    subject: Subject;
    lecturer: Lecturer;
    classroom: Classroom;
    timeSlot: string;
  }
  