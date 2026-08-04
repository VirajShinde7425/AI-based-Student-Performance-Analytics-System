def generate_class_analytics(students):

    total_students = len(students)

    averages = [s["average"] for s in students]
    attendance = [s["attendance"] for s in students]

    class_average = round(sum(averages) / total_students, 2)
    average_attendance = round(sum(attendance) / total_students, 2)

    highest_student = max(students, key=lambda x: x["average"])
    lowest_student = min(students, key=lambda x: x["average"])

    passed_students = len([s for s in students if s["average"] >= 40])

    pass_percentage = round(
        (passed_students / total_students) * 100,
        2
    )

    # Generate Risk Students List
    risk_students = []

    for student in students:

        reasons = []

        if student["attendance"] < 75:
            reasons.append("Low Attendance")

        if student["average"] < 40:
            reasons.append("Low Average")

        if reasons:
            risk_students.append({
                "studentId": student["studentId"],
                "name": student["name"],
                "average": student["average"],
                "attendance": student["attendance"],
                "reason": reasons
            })

    chart_labels = [s["name"] for s in students]

    marks_chart = [s["average"] for s in students]

    attendance_chart = [s["attendance"] for s in students]

    return {

    "summary": {

        "totalStudents": total_students,

        "classAverage": class_average,

        "averageAttendance": average_attendance,

        "passPercentage": pass_percentage,

        "studentsAtRisk": len(risk_students)
    },

    "topPerformer": highest_student,

    "lowestPerformer": lowest_student,

    "riskStudents": risk_students,

    "charts": {

        "averageMarks": {

            "labels": chart_labels,

            "values": marks_chart
        },

        "attendance": {

            "labels": chart_labels,

            "values": attendance_chart
        }
    }
}