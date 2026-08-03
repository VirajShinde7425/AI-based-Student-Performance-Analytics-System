import { validators } from "./validators";

export const validateProfile = (profile) => {

    const errors = {};

    errors.name =
        validators.required(profile.name, "Full Name");

    if (!errors.name)
        errors.name = validators.minLength(profile.name, 3);

    errors.email =
        validators.required(profile.email, "Email");

    if (!errors.email)
        errors.email = validators.email(profile.email);

    errors.title =
        validators.required(profile.title, "Academic Title");

    errors.department =
        validators.required(profile.department, "Department");

    Object.keys(errors).forEach(key => {
        if (!errors[key])
            delete errors[key];
    });

    return errors;
};

export const validateInstitute = (institute) => {

    const errors = {};

    errors.name =
        validators.required(institute.name, "Institute Name");

    errors.accreditation =
        validators.required(institute.accreditation, "Accreditation");

    errors.academicYear =
        validators.required(institute.academicYear, "Academic Year");

    errors.attendanceThreshold =
        validators.numberRange(
            institute.attendanceThreshold,
            0,
            100
        );

    errors.flaskApiEndpoint =
        validators.required(
            institute.flaskApiEndpoint,
            "Flask API Endpoint"
        );

    Object.keys(errors).forEach(key => {
        if (!errors[key])
            delete errors[key];
    });

    return errors;
};

// export const validatePassword = (passwords) => {

//     const errors = {};

//     errors.current =
//         validators.required(
//             passwords.current,
//             "Current Password"
//         );

//     errors.newPass =
//         validators.required(
//             passwords.newPass,
//             "New Password"
//         );

//     if (!errors.newPass)
//         errors.newPass =
//             validators.password(passwords.newPass);

//     errors.confirmPass =
//         validators.required(
//             passwords.confirmPass,
//             "Confirm Password"
//         );

//     if (!errors.confirmPass)
//     {
//         errors.confirmPass =
//             validators.match(
//                 passwords.confirmPass,
//                 passwords.newPass,
//                 "Passwords"
//             );
//     }

//     Object.keys(errors).forEach(key => {
//         if (!errors[key])
//             delete errors[key];
//     });

//     return errors;
// };