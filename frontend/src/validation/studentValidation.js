import { validators } from "./validators";

export const validateStudent = (student) => {
  const errors = {};

  errors.registrationId =
    validators.required(student.registrationId, "Registration ID");

  errors.rollNumber =
    validators.required(student.rollNumber, "Roll Number");

  errors.fullName =
    validators.required(student.fullName, "Full Name");

  if (!errors.fullName)
    errors.fullName = validators.minLength(student.fullName, 3);

  errors.email =
    validators.required(student.email, "Email");

  if (!errors.email)
    errors.email = validators.email(student.email);

  errors.department =
    validators.required(student.departmentName, "Department");

  errors.semester =
    validators.required(student.semester, "Semester");

  errors.division =
    validators.required(student.division, "Division");

  errors.guardianName =
    validators.required(student.guardianName, "Guardian Name");

  errors.guardianPhone =
    validators.required(student.guardianPhone, "Guardian Phone");

  if (!errors.guardianPhone)
    errors.guardianPhone = validators.phone(student.guardianPhone);

  Object.keys(errors).forEach(key => {
    if (!errors[key]) delete errors[key];
  });

  return errors;
};