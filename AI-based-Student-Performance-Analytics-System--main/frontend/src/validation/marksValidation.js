import { validators } from "./validators";

export const validateMarks = (marks) => {

    const errors = {};

    errors.assignmentMarks =
        validators.numberRange(marks.assignmentMarks, 0, 20);

    errors.internalMarks =
        validators.numberRange(marks.internalMarks, 0, 30);

    errors.practicalMarks =
        validators.numberRange(marks.practicalMarks, 0, 20);

    errors.finalExamMarks =
        validators.numberRange(marks.finalExamMarks, 0, 100);

    Object.keys(errors).forEach(key => {
        if (!errors[key])
            delete errors[key];
    });

    return errors;
};