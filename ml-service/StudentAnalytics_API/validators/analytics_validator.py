def validate_student_analytics(data):

    if not data:
        return False, {
            "success": False,
            "message": "Request body cannot be empty."
        }

    required_fields = [
        "studentId",
        "name",
        "department",
        "semester",
        "email",
        "attendance",
        "internalMarks",
        "assignmentMarks",
        "practicalMarks",
        "quizMarks",
        "cgpa"
    ]

    for field in required_fields:

        if field not in data:
            return False, {
                "success": False,
                "message": f"'{field}' is required."
            }

    # Numeric validations
    numeric_fields = [
        "attendance",
        "internalMarks",
        "assignmentMarks",
        "practicalMarks",
        "quizMarks",
        "cgpa"
    ]

    for field in numeric_fields:

        if not isinstance(data[field], (int, float)):
            return False, {
                "success": False,
                "message": f"'{field}' must be numeric."
            }

    # Marks validation
    mark_fields = [
        "attendance",
        "internalMarks",
        "assignmentMarks",
        "practicalMarks",
        "quizMarks"
    ]

    for field in mark_fields:

        if data[field] < 0 or data[field] > 100:
            return False, {
                "success": False,
                "message": f"'{field}' must be between 0 and 100."
            }

    # CGPA validation
    if data["cgpa"] < 0 or data["cgpa"] > 10:
        return False, {
            "success": False,
            "message": "'cgpa' must be between 0 and 10."
        }

    return True, None