import React, { useEffect, useState } from "react";
import api from "../services/api";

export const StudentMarksPage = () => {
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    const loadMarks = async () => {
      try {
        const response = await api.get("/my/marks");
        setMarks(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadMarks();
  }, []);

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">
          My Marks
        </h1>

        <p className="text-slate-500">
          View your subject-wise academic performance.
        </p>
      </div>

      <div className="saas-card overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100 dark:bg-slate-800">

            <tr>
              <th className="p-4 text-left">Subject</th>
              <th className="p-4">Assignment</th>
              <th className="p-4">Internal</th>
              <th className="p-4">Practical</th>
              <th className="p-4">Final</th>
              <th className="p-4">Total</th>
              <th className="p-4">Grade</th>
            </tr>

          </thead>

          <tbody>

            {marks.map((m, index) => (

              <tr key={index} className="border-t">

                <td className="p-4 font-semibold">
                  {m.subjectName}
                </td>

                <td className="text-center">{m.assignmentMarks}</td>

                <td className="text-center">{m.internalMarks}</td>

                <td className="text-center">{m.practicalMarks}</td>

                <td className="text-center">{m.finalExamMarks}</td>

                <td className="text-center font-bold">
                  {m.totalScore}
                </td>

                <td className="text-center">

                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                    {m.grade}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};