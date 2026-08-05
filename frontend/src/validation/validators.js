export const validators = {
  required: (value, fieldName) => {
    if (value === null || value === undefined || value.toString().trim() === "") {
      return `${fieldName} is required.`;
    }
    return "";
  },

  email: (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(value))
      return "Please enter a valid email address.";

    return "";
  },

  minLength: (value, min) => {
    if (value.length < min)
      return `Minimum ${min} characters required.`;

    return "";
  },

  maxLength: (value, max) => {
    if (value.length > max)
      return `Maximum ${max} characters allowed.`;

    return "";
  },

  phone: (value) => {
    const regex = /^[6-9]\d{9}$/;

    if (!regex.test(value))
      return "Please enter a valid 10-digit mobile number.";

    return "";
  },

  name: (value) => {
  const regex = /^[A-Za-z\s.]+$/;

  if (!regex.test(value))
    return "Only alphabets, spaces and '.' are allowed.";

  return "";
},

alphaNumeric: (value, fieldName = "Field") => {
  const regex = /^[A-Za-z0-9]+$/;

  if (!regex.test(value))
    return `${fieldName} can contain only letters and numbers.`;

  return "";
},

registrationId: (value) => {
  const regex = /^STU-\d{4}-\d{3}$/;

  if (!regex.test(value))
    return "Registration ID must be in STU-2026-001 format.";

  return "";
},

  password: (value) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=]).{8,}$/;

    if (!regex.test(value))
      return "Password must contain uppercase, lowercase, number and special character.";

    return "";
  },

  numberRange: (value, min, max) => {
    const number = Number(value);

    if (isNaN(number))
      return "Please enter a valid number.";

    if (number < min || number > max)
      return `Value must be between ${min} and ${max}.`;

    return "";
  },

  match: (value, compareValue, fieldName) => {
    if (value !== compareValue)
      return `${fieldName} does not match.`;

    return "";
  },

  numeric: (value, fieldName = "Field") => {
  const regex = /^[0-9]+$/;

  if (!regex.test(value))
    return `${fieldName} must contain only numbers.`;

  return "";
},
};