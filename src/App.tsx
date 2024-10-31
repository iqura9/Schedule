import React from 'react';
import { generateClassrooms } from './data/classrooms';
import { generateGroups } from './data/groups';
import { generateLecturers } from './data/lecturers';
import { assignSubjectsToGroups } from './data/subjects';
import { generateSchedule } from './schedulingAlgorithm';
import { Classroom, Group, Lecturer, Lesson } from './types';

function App() {
  const groups: Group[] = assignSubjectsToGroups(generateGroups());
  const lecturers: Lecturer[] = generateLecturers();
  const classrooms: Classroom[] = generateClassrooms();

  const schedule: Lesson[] = generateSchedule(groups, lecturers, classrooms);

  // Підрахунок годин лекторів
  const lecturerHours = {};
  schedule?.forEach((lesson) => {
    if (!lecturerHours[lesson.lecturer]) {
      lecturerHours[lesson.lecturer] = 1.5;
    } else {
      lecturerHours[lesson.lecturer] += 1.5;
    }
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Розклад занять</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Таймслот</th>
            <th className="px-4 py-2 border">Групи</th>
            <th className="px-4 py-2 border">Предмет</th>
            <th className="px-4 py-2 border">Тип</th>
            <th className="px-4 py-2 border">Лектор</th>
            <th className="px-4 py-2 border">Аудиторія</th>
            <th className="px-4 py-2 border">Студентів</th>
            <th className="px-4 py-2 border">Місткість</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((lesson, index) => (
            <React.Fragment key={index}>
              {index === 0 ||
              schedule[index - 1].timeslot !== lesson.timeslot ? (
                <tr>
                  <td
                    className="px-4 py-2 border font-semibold bg-blue-100"
                    colSpan="8"
                  >
                    {lesson.timeslot}
                  </td>
                </tr>
              ) : null}
              <tr
                className={
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }
              >
                <td className="px-4 py-2 border"></td>
                <td className="px-4 py-2 border">
                  {lesson.groups.join(', ')}
                </td>
                <td className="px-4 py-2 border">{lesson.subject}</td>
                <td className="px-4 py-2 border">{lesson.type}</td>
                <td className="px-4 py-2 border">{lesson.lecturer}</td>
                <td className="px-4 py-2 border">{lesson.auditorium}</td>
                <td className="px-4 py-2 border">{lesson.students}</td>
                <td className="px-4 py-2 border">{lesson.capacity}</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-bold mt-8">
        Кількість годин лекторів на тиждень:
      </h2>
      <table className="min-w-full bg-white border mt-2">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Лектор</th>
            <th className="px-4 py-2 border">Кількість годин</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(lecturerHours).map(
            ([lecturer, hours], index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }
              >
                <td className="px-4 py-2 border">{lecturer}</td>
                <td className="px-4 py-2 border">
                  {hours} годин
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
