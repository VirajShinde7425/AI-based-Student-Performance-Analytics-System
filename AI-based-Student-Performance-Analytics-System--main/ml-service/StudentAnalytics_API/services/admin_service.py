import json



def get_admin_dashboard():

    with open("data/students.json", "r") as file:
        students = json.load(file)

    with open("data/teachers.json", "r") as file:
        teachers = json.load(file)

    total_students = len(students)
    total_teachers = len(teachers)

    average_attendance = round(
        sum(student["attendance"] for student in students) / total_students,
        2
    )

    average_marks = round(
        sum(
            (
                student["internalMarks"] +
                student["assignmentMarks"] +
                student["practicalMarks"] +
                student["quizMarks"]
            ) / 4
            for student in students
        ) / total_students,
        2
    )

    students_at_risk = len([
        student
        for student in students
        if student["attendance"] < 75
    ])

    pass_percentage = round(
        (
            len([
                student
                for student in students
                if (
                    student["internalMarks"] +
                    student["assignmentMarks"] +
                    student["practicalMarks"] +
                    student["quizMarks"]
                ) / 4 >= 40
            ])
            / total_students
        ) * 100,
        2
    )

    departments = {}

    for student in students:

        department = student["department"]

        if department not in departments:
            departments[department] = {
                "students": 0,
                "totalMarks": 0
            }

        departments[department]["students"] += 1

        departments[department]["totalMarks"] += (
            student["internalMarks"] +
            student["assignmentMarks"] +
            student["practicalMarks"] +
            student["quizMarks"]
        ) / 4

    department_performance = []

    for department, values in departments.items():

        department_performance.append({

            "department": department,

            "students": values["students"],

            "averageMarks": round(
                values["totalMarks"] / values["students"],
                2
            )
        })

    return {

        "summary": {

            "totalStudents": total_students,

            "totalTeachers": total_teachers,

            "departments": len(departments),

            "overallAverage": average_marks,

            "overallAttendance": average_attendance,

            "overallPassPercentage": pass_percentage,

            "studentsAtRisk": students_at_risk
        },

        "departmentPerformance": department_performance
    }