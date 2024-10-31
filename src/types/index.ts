export interface Subject {
  name: string;
  lectures: number;
  practices: number; 
  requiresSubdivision: boolean;
}

export interface Group {
  id: string;
  students: number;
  subgroups: number[];
  subjects: Subject[];
}

export interface Lecturer {
  name: string;
  subjects: string[];
  types: string[]; 
}

export interface Classroom {
  id: string;
  capacity: number;
}

export interface Lesson {
  timeslot: string;
  groups: string[];
  subject: string;
  type: string; 
  lecturer: string;
  auditorium: string;
  students: number;
  capacity: number;
}
