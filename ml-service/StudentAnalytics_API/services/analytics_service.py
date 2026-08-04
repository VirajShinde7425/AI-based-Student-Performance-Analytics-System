from services.student_service import build_student_analytics


def generate_student_analytics(student):

    analytics = build_student_analytics(student)

    return {

        "success": True,

        "message": "Student analytics generated successfully.",

        "data": analytics
    }