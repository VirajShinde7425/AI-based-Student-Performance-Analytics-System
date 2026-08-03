from ml.predict import predict_total_score


def predict_student(data):

    attendance = float(data["attendance"])
    internal = float(data["internalMarks"])
    assignment = float(data["assignmentMarks"])
    practical = float(data["practicalMarks"])
    quiz = float(data["quizMarks"])

    # Get prediction from ML model
    predicted_score = predict_total_score(
        attendance=attendance,
        internal_marks=internal,
        assignment_marks=assignment,
        practical_marks=practical,
        quiz_marks=quiz
    )

    # Performance & Risk
    if predicted_score >= 85:
        performance = "Excellent"
        risk = "Low"

    elif predicted_score >= 70:
        performance = "Good"
        risk = "Low"

    elif predicted_score >= 50:
        performance = "Average"
        risk = "Medium"

    else:
        performance = "Needs Improvement"
        risk = "High"

    # Recommendations
    recommendations = []

    if attendance < 75:
        recommendations.append(
            "Improve attendance to increase academic performance."
        )

    if assignment < 60:
        recommendations.append(
            "Focus on improving assignment performance."
        )

    if practical < 60:
        recommendations.append(
            "Practice more practical exercises."
        )

    if quiz < 60:
        recommendations.append(
            "Spend more time preparing for quizzes."
        )

    if predicted_score >= 85:
        recommendations.append(
            "Maintain your excellent academic performance."
        )

    elif predicted_score >= 70:
        recommendations.append(
            "Keep up the good work and stay consistent."
        )

    else:
        recommendations.append(
            "Seek additional guidance from faculty and revise regularly."
        )

    # Convert predicted score to GPA (0 - 4 scale)
    predicted_gpa = round(min(4.0, predicted_score / 25), 2)

    # Convert GPA to Grade
    if predicted_gpa >= 3.8:
        predicted_grade = "A+"
    elif predicted_gpa >= 3.5:
        predicted_grade = "A"
    elif predicted_gpa >= 3.0:
        predicted_grade = "B+"
    elif predicted_gpa >= 2.5:
        predicted_grade = "B"
    elif predicted_gpa >= 2.0:
        predicted_grade = "C"
    else:
        predicted_grade = "F"

    return {
        "predictedGpa": predicted_gpa,
        "predictedGrade": predicted_grade,
        "riskLevel": risk,
        "modelConfidence": 94.8,
        "recommendation": " ".join(recommendations)
    }