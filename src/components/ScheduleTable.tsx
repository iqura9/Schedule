import React from "react";
import { ScheduleEntry } from "../types";

interface ScheduleTableProps {
  schedule: ScheduleEntry[];
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedule }) => {
  return (
    <table className="min-w-full table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2">Група</th>
          <th className="px-4 py-2">Предмет</th>
          <th className="px-4 py-2">Лектор</th>
          <th className="px-4 py-2">Аудиторія</th>
          <th className="px-4 py-2">Тип</th>
          <th className="px-4 py-2">Час</th>
        </tr>
      </thead>
      <tbody>
        {schedule.map((entry, index) => (
          <tr key={index}>
            <td className="border px-4 py-2">{entry.group.id}</td>
            <td className="border px-4 py-2">{entry.subject.name}</td>
            <td className="border px-4 py-2">{entry.lecturer.name}</td>
            <td className="border px-4 py-2">{entry.classroom.id}</td>
            <td className="border px-4 py-2">{entry.classroom.type}</td>
            <td className="border px-4 py-2">{entry.timeSlot}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ScheduleTable;
