def validate_prediction(data):

    if not data:
        return False, {
            "success": False,
            "message": "Request body cannot be empty."
        }

    required_fields = [
        "attendance",
        "internalMarks",
        "assignmentMarks",
        "practicalMarks",
        "quizMarks"
    ]

    for field in required_fields:

        if field not in data:
            return False, {
                "success": False,
                "message": f"'{field}' is required."
            }

        if not isinstance(data[field], (int, float)):
            return False, {
                "success": False,
                "message": f"'{field}' must be numeric."
            }

        if data[field] < 0 or data[field] > 100:
            return False, {
                "success": False,
                "message": f"'{field}' must be between 0 and 100."
            }

    return True, None