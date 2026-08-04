import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { DEPARTMENTS, SEMESTERS, DIVISIONS } from '../../mockData/studentData';
import { validateStudent } from "../../validation/studentValidation";

export const EditStudentModal = () => {
  const {
  activeModal,
  setActiveModal,
  selectedStudent,
  updateStudent
} = useApp();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
  registrationId: '',
  name: '',
  rollNo: '',
  email: '',
  department: DEPARTMENTS[0],
  semester: 6,
  division: 'A',
  guardianName: '',
  guardianPhone: ''
});

const [errors, setErrors] = useState({});

useEffect(() => {
  if (!selectedStudent) return;

  setFormData({
    registrationId: selectedStudent.registrationId,
    name: selectedStudent.fullName,
    rollNo: selectedStudent.rollNumber,
    email: selectedStudent.email,
    department: selectedStudent.departmentName,
    semester: selectedStudent.semester,
    division: selectedStudent.division,
    guardianName: selectedStudent.guardianName || "",
    guardianPhone: selectedStudent.guardianPhone || ""
  });

}, [selectedStudent]);

const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validateStudent({
    registrationId: formData.registrationId,
    rollNumber: formData.rollNo,
    fullName: formData.name,
    email: formData.email,
    departmentName: formData.department,
    semester: formData.semester,
    division: formData.division,
    guardianName: formData.guardianName,
    guardianPhone: formData.guardianPhone
});

if (Object.keys(validationErrors).length > 0)
{
    setErrors(validationErrors);

    addToast(
        "Validation Error",
        "Please correct the highlighted fields.",
        "warning"
    );

    return;
}

setErrors({});

  await updateStudent(selectedStudent.id, formData);

  addToast(
    "Student Updated",
    `${formData.name} updated successfully.`,
    "success"
  );

  setActiveModal(null);
};

  return (
    <Modal
      isOpen={activeModal === 'editStudent'}
      onClose={() => setActiveModal(null)}
      title="Edit Student Record"
    >
      <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Registration ID *
            </label>

            <input
              type="text"
              placeholder="STU-2026-001"
              value={formData.registrationId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  registrationId: e.target.value
                })
              }
              className={`w-full px-3 py-2 text-xs rounded-xl focus:ring-2 focus:outline-none ${
                errors.registrationId
                  ? "border border-red-500 bg-red-50 dark:bg-red-950"
                  : "border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-primary-500"
              }`}
            />

            {errors.registrationId && (
              <p className="mt-1 text-xs text-red-500">
                {errors.registrationId}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Roll Number*</label>
            <input
              type="text"
              value={formData.rollNo}
              onChange={(e) =>
                setFormData({ ...formData, rollNo: e.target.value })
              }
              className={`w-full px-3 py-2 text-xs rounded-xl ${
                errors.rollNumber
                  ? "border border-red-500 bg-red-50 dark:bg-red-950"
                  : "border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              }`}
            />

            {errors.rollNumber && (
              <p className="mt-1 text-xs text-red-500">
                {errors.rollNumber}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
      Full Name *
    </label>
    <input
      type="text"
      placeholder="Rahul Sharma"
      value={formData.name}
      onChange={(e) =>
        setFormData({ ...formData, name: e.target.value })
      }
      className={`w-full px-3 py-2 text-xs rounded-xl focus:ring-2 focus:outline-none ${
        errors.fullName
          ? "border border-red-500 bg-red-50 dark:bg-red-950"
          : "border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-primary-500"
      }`}
    />

    {errors.fullName && (
      <p className="mt-1 text-xs text-red-500">
        {errors.fullName}
      </p>
    )}
  </div>

  <div>
    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
      Institutional Email *
    </label>
    <input
      type="email"
      placeholder="rahul.sharma@institution.edu"
      value={formData.email}
      onChange={(e) =>
        setFormData({ ...formData, email: e.target.value })
      }
      className={`w-full px-3 py-2 text-xs rounded-xl focus:ring-2 focus:outline-none ${
        errors.email
          ? "border border-red-500 bg-red-50 dark:bg-red-950"
          : "border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-primary-500"
      }`}
    />

    {errors.email && (
      <p className="mt-1 text-xs text-red-500">
        {errors.email}
      </p>
    )}
  </div>
</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department*</label>
            <select
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              className={`w-full px-3 py-2 text-xs rounded-xl focus:ring-2 ${
                errors.departmentName
                  ? "border border-red-500 bg-red-50 dark:bg-red-950"
                  : "border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-primary-500"
              }`}
            >
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            
            {errors.departmentName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.departmentName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Semester*</label>
            <select
                          value={formData.semester}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              semester: Number(e.target.value)
                            })
                          }
                          className={`w-full px-3 py-2 text-xs rounded-xl focus:ring-2 ${
                            errors.semester
                              ? "border border-red-500 bg-red-50 dark:bg-red-950"
                              : "border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-primary-500"
                          }`}
                        >
                          {SEMESTERS.map(s => (
                            <option key={s} value={s}>
                              Semester {s}
                            </option>
                          ))}
                        </select>
            
                        {errors.semester && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.semester}
                          </p>
                        )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Division*</label>
            <select
                          value={formData.division}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              division: e.target.value
                            })
                          }
                          className={`w-full px-3 py-2 text-xs rounded-xl focus:ring-2 ${
                            errors.division
                              ? "border border-red-500 bg-red-50 dark:bg-red-950"
                              : "border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-primary-500"
                          }`}
                        >
                          {DIVISIONS.map(d => (
                            <option key={d} value={d}>
                              Division {d}
                            </option>
                          ))}
                        </select>
            
                        {errors.division && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.division}
                          </p>
                        )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Guardian Name*</label>
            <input
              type="text"
              placeholder="Vijay Sharma"
              value={formData.guardianName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  guardianName: e.target.value
                })
              }
              className={`w-full px-3 py-2 text-xs rounded-xl focus:ring-2 focus:outline-none ${
                errors.guardianName
                  ? "border border-red-500 bg-red-50 dark:bg-red-950"
                  : "border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-primary-500"
              }`}
            />

            {errors.guardianName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.guardianName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Guardian Contact Phone*</label>
            <input
              type="text"
              placeholder="+91"
              value={formData.guardianPhone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  guardianPhone: e.target.value
                })
              }
              className={`w-full px-3 py-2 text-xs rounded-xl focus:ring-2 focus:outline-none ${
                errors.guardianPhone
                  ? "border border-red-500 bg-red-50 dark:bg-red-950"
                  : "border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-primary-500"
              }`}
            />

            {errors.guardianPhone && (
              <p className="mt-1 text-xs text-red-500">
                {errors.guardianPhone}
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md shadow-primary-600/20 transition-all"
          >
            Edit Student
          </button>
        </div>
      </form>
    </Modal>
  );
};
