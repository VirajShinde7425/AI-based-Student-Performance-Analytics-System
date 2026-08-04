def validate_class_analytics(data):

    if not data:
        return False, {
            "success": False,
            "message": "Request body cannot be empty."
        }

    if "students" not in data:
        return False, {
            "success": False,
            "message": "'students' is required."
        }

    students = data["students"]

    if not isinstance(students, list):
        return False, {
            "success": False,
            "message": "'students' must be a list."
        }

    if len(students) == 0:
        return False, {
            "success": False,
            "message": "Student list cannot be empty."
        }

    for student in students:

        if "name" not in student:
            return False, {
                "success": False,
                "message": "Student name is required."
            }

        if "attendance" not in student:
            return False, {
                "success": False,
                "message": f"Attendance missing for {student['name']}."
            }

        if "average" not in student:
            return False, {
                "success": False,
                "message": f"Average marks missing for {student['name']}."
            }

        attendance = student["attendance"]
        average = student["average"]

        if not isinstance(attendance, (int, float)):
            return False, {
                "success": False,
                "message": f"Attendance for {student['name']} must be numeric."
            }

        if attendance < 0 or attendance > 100:
            return False, {
                "success": False,
                "message": f"Attendance for {student['name']} must be between 0 and 100."
            }

        if not isinstance(average, (int, float)):
            return False, {
                "success": False,
                "message": f"Average marks for {student['name']} must be numeric."
            }

        if average < 0 or average > 100:
            return False, {
                "success": False,
                "message": f"Average marks for {student['name']} must be between 0 and 100."
            }

    return True, None