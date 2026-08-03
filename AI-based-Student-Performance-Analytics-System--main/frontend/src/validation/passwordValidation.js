import { validators } from "./validators";

export const validatePassword = (passwords) => {

    const errors = {};

    errors.current =
        validators.required(
            passwords.current,
            "Current Password"
        );

    errors.newPass =
        validators.required(
            passwords.newPass,
            "New Password"
        );

    if (!errors.newPass)
    {
        errors.newPass =
            validators.password(passwords.newPass);
    }

    errors.confirmPass =
        validators.required(
            passwords.confirmPass,
            "Confirm Password"
        );

    if (!errors.confirmPass)
    {
        errors.confirmPass =
            validators.match(
                passwords.confirmPass,
                passwords.newPass,
                "Passwords"
            );
    }

    Object.keys(errors).forEach(key => {
        if (!errors[key])
            delete errors[key];
    });

    return errors;
};