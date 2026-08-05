// export const validateTeacher = (teacher) => {

//     const errors = {};

//     // Full Name
//     if (!teacher.fullName?.trim()) {
//         errors.fullName = "Full Name is required.";
//     }

//     // Email
//     if (!teacher.email?.trim()) {
//         errors.email = "Institutional Email is required.";
//     }
//     else {
//         const emailRegex =
//             /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//         if (!emailRegex.test(teacher.email)) {
//             errors.email = "Enter a valid email address.";
//         }
//     }

//     // Department
//     if (!teacher.department?.trim()) {
//         errors.department = "Department is required.";
//     }

//     // Academic Title
//     if (!teacher.title?.trim()) {
//         errors.title = "Academic Title is required.";
//     }

//     return errors;
// };

import { validators } from "./validators";

export const validateTeacher = (teacher) => {

    const errors = {};

    // Full Name
    errors.fullName =
        validators.required(teacher.fullName, "Full Name");

    if (!errors.fullName)
        errors.fullName =
            validators.minLength(teacher.fullName, 3);

    if (!errors.fullName)
        errors.fullName =
            validators.name(teacher.fullName);

    // Email
    errors.email =
        validators.required(teacher.email, "Email");

    if (!errors.email)
        errors.email =
            validators.email(teacher.email);

    // Department
    errors.department =
        validators.required(teacher.department, "Department");

    // Academic Title
    errors.title =
        validators.required(teacher.title, "Academic Title");

    if (!errors.title)
        errors.title =
            validators.minLength(teacher.title, 3);

    if (!errors.title)
        errors.title =
            validators.name(teacher.title);

    Object.keys(errors).forEach(key => {
        if (!errors[key]) delete errors[key];
    });

    return errors;
};