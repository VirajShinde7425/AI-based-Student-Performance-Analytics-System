export const validateTeacher = (teacher) => {

    const errors = {};

    // Full Name
    if (!teacher.fullName?.trim()) {
        errors.fullName = "Full Name is required.";
    }

    // Email
    if (!teacher.email?.trim()) {
        errors.email = "Institutional Email is required.";
    }
    else {
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(teacher.email)) {
            errors.email = "Enter a valid email address.";
        }
    }

    // Department
    if (!teacher.department?.trim()) {
        errors.department = "Department is required.";
    }

    // Academic Title
    if (!teacher.title?.trim()) {
        errors.title = "Academic Title is required.";
    }

    return errors;
};