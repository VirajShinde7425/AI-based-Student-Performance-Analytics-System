import json

from services.class_service import generate_class_analytics
from services.helper import calculate_average


def get_teacher_dashboard():

    with open("data/students.json", "r") as file:
        students = json.load(file)

    class_students = []

    for student in students:

        average = calculate_average(student)

        class_students.append({

            "studentId": student["studentId"],

            "name": student["name"],

            "attendance": student["attendance"],

            "average": average
        })

    dashboard = generate_class_analytics(class_students)

    return dashboard