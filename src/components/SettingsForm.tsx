import React, { useState } from "react";

interface SettingsFormProps {
  onGenerate: (numGroups: number, minStudents: number, maxStudents: number) => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ onGenerate }) => {
  const [numGroups, setNumGroups] = useState<number>(5);
  const [minStudents, setMinStudents] = useState<number>(20);
  const [maxStudents, setMaxStudents] = useState<number>(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(numGroups, minStudents, maxStudents);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex space-x-4">
        <div>
          <label className="block">Кількість груп:</label>
          <input
            type="number"
            value={numGroups}
            onChange={(e) => setNumGroups(parseInt(e.target.value))}
            className="border p-2"
          />
        </div>
        <div>
          <label className="block">Мін. кількість студентів:</label>
          <input
            type="number"
            value={minStudents}
            onChange={(e) => setMinStudents(parseInt(e.target.value))}
            className="border p-2"
          />
        </div>
        <div>
          <label className="block">Макс. кількість студентів:</label>
          <input
            type="number"
            value={maxStudents}
            onChange={(e) => setMaxStudents(parseInt(e.target.value))}
            className="border p-2"
          />
        </div>
      </div>
      <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2">
        Згенерувати розклад
      </button>
    </form>
  );
};

export default SettingsForm;
