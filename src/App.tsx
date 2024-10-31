import React, { useEffect, useState } from "react";
import ScheduleTable from "./components/ScheduleTable";
import SettingsForm from "./components/SettingsForm";
import { generateClassrooms } from "./data/classrooms";
import { generateGroups } from "./data/groups";
import { generateLecturers } from "./data/lecturers";
import { assignSubjectsToGroups } from "./data/subjects";
import { generateSchedule } from "./schedulingAlgorithm";
import { Classroom, Group, Lecturer, ScheduleEntry } from "./types";


const App: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  console.log(schedule)
  const generate = (
    numGroups: number,
    minStudents: number,
    maxStudents: number
  ) => {
    const groups: Group[] = assignSubjectsToGroups(
      generateGroups(numGroups, minStudents, maxStudents)
    );
    const lecturers: Lecturer[] = generateLecturers();
    const classrooms: Classroom[] = generateClassrooms(10, 25, 40);

    const generatedSchedule = generateSchedule(groups, lecturers, classrooms);
    setSchedule(generatedSchedule);
  };

  useEffect(() => {
    generate(5, 20, 30);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Розклад занять</h1>
      <SettingsForm onGenerate={generate} />
      <ScheduleTable schedule={schedule} />
    </div>
  );
};

export default App;
