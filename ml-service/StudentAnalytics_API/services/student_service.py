from services.prediction_service import predict_student
import json


def get_student_by_id(student_id):

    with open("data/students.json", "r") as file:
        students = json.load(file)

    for student in students:
        if student["studentId"] == student_id:
            return student

    return None



def generate_student_insights(student):

    strengths = []

    weaknesses = []

    observations = []

    recommendations = []

    # Attendance

    if student["attendance"] >= 85:

        strengths.append("Excellent Attendance")

    elif student["attendance"] < 75:

        weaknesses.append("Low Attendance")

        recommendations.append(
            "Improve attendance to at least 75%."
        )

    # Internal

    if student["internalMarks"] >= 75:

        strengths.append("Strong Internal Performance")

    elif student["internalMarks"] < 50:

        weaknesses.append("Low Internal Marks")

        recommendations.append(
            "Focus on improving internal assessment scores."
        )

    # Assignment

    if student["assignmentMarks"] >= 75:

        strengths.append("Consistent Assignment Performance")

    elif student["assignmentMarks"] < 50:

        weaknesses.append("Assignment Performance Needs Improvement")

        recommendations.append(
            "Submit assignments on time and improve quality."
        )

    # Practical

    if student["practicalMarks"] >= 75:

        strengths.append("Excellent Practical Skills")

    elif student["practicalMarks"] < 50:

        weaknesses.append("Weak Practical Performance")

        recommendations.append(
            "Spend more time practicing laboratory exercises."
        )

    # Quiz

    if student["quizMarks"] >= 75:

        strengths.append("Good Quiz Performance")

    elif student["quizMarks"] < 50:

        weaknesses.append("Low Quiz Performance")

        recommendations.append(
            "Practice quizzes regularly."
        )

    observations.append(
        f"Current CGPA: {student['cgpa']}"
    )

    return {

        "strengths": strengths,

        "weaknesses": weaknesses,

        "observations": observations,

        "recommendations": recommendations
    }



def build_student_analytics(student):

    prediction = predict_student(student)

    insights = generate_student_insights(student)

    return {

        "prediction": prediction,

        "insights": insights
    }




def get_student_profile(student_id):

    student = get_student_by_id(student_id)

    if student is None:
        return None

    # ML Prediction
    #prediction = predict_student(student)

    # Student Insights
    #insights = generate_student_insights(student)

    analytics = build_student_analytics(student)

    profile = {

        "student": {
            "studentId": student["studentId"],
            "name": student["name"],
            "department": student["department"],
            "semester": student["semester"],
            "email": student["email"]
        },

        "academic": {
            "attendance": student["attendance"],
            "internalMarks": student["internalMarks"],
            "assignmentMarks": student["assignmentMarks"],
            "practicalMarks": student["practicalMarks"],
            "quizMarks": student["quizMarks"],
            "cgpa": student["cgpa"]
        },

        **analytics
    }

    return profile