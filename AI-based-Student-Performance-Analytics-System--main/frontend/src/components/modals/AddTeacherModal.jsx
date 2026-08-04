import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { DEPARTMENTS } from "../../mockData/studentData";
import { validateTeacher } from "../../validation/teacherValidation";



export const AddTeacherModal = () => {

    const {
        activeModal,
        setActiveModal,
        addTeacher
    } = useApp();

    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        department: DEPARTMENTS[0],
        title: ""
    });

    const [errors, setErrors] = useState({});


    const handleSubmit = async (e) => {

    e.preventDefault();

    const validationErrors =
        validateTeacher(formData);

    if (Object.keys(validationErrors).length > 0) {

        setErrors(validationErrors);

        addToast(
            "Validation Error",
            "Please correct the highlighted fields.",
            "warning"
        );

        return;
    }

    setErrors({});

    try {

        await addTeacher(formData);

        addToast(
            "Teacher Added",
            `${formData.fullName} has been added successfully.`,
            "success"
        );

        setActiveModal(null);

        setFormData({
            fullName: "",
            email: "",
            department: DEPARTMENTS[0],
            title: ""
        });

    } catch {

        addToast(
            "Error",
            "Unable to create teacher.",
            "error"
        );

    }

};

return (
    <Modal
        isOpen={activeModal === "addTeacher"}
        onClose={() => setActiveModal(null)}
        title="Add New Teacher"
        size="lg"
    >
        <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}

            <div>

                <label className="block text-sm font-semibold mb-2">
                    Full Name
                </label>

                <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            fullName: e.target.value
                        })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    placeholder="Prof. Sarah Jenkins"
                />

                {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.fullName}
                    </p>
                )}

            </div>

            {/* Email */}

            <div>

                <label className="block text-sm font-semibold mb-2">
                    Institutional Email
                </label>

                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            email: e.target.value
                        })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    placeholder="teacher@institution.edu"
                />

                {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                    </p>
                )}

            </div>

            {/* Department */}

            <div>

                <label className="block text-sm font-semibold mb-2">
                    Department
                </label>

                <select
                    value={formData.department}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            department: e.target.value
                        })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >

                    {DEPARTMENTS.map((dept) => (

                        <option
                            key={dept}
                            value={dept}
                        >
                            {dept}
                        </option>

                    ))}

                </select>

                {errors.department && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.department}
                    </p>
                )}

            </div>

            {/* Academic Title */}

            <div>

                <label className="block text-sm font-semibold mb-2">
                    Academic Title
                </label>

                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            title: e.target.value
                        })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    placeholder="Associate Professor"
                />

                {errors.title && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.title}
                    </p>
                )}

            </div>

            {/* Password Notice */}

            <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3">

                <p className="text-xs text-blue-700 dark:text-blue-300">

                    Default Password:
                    <span className="font-bold ml-1">
                        Teacher@123
                    </span>

                </p>

                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">

                    The teacher can change this after logging in.

                </p>

            </div>

            {/* Buttons */}

            <div className="flex justify-end gap-3 pt-4">

                <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold"
                >
                    Create Teacher
                </button>

            </div>

        </form>
    </Modal>
);
};