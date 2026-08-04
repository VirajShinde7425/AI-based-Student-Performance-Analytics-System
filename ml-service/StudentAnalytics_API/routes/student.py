from flask import Blueprint, jsonify
from services.student_service import get_student_profile

student_bp = Blueprint("student", __name__)


@student_bp.route("/student/<student_id>", methods=["GET"])
def get_student(student_id):

    student = get_student_profile(student_id)

    if student is None:

        return jsonify({
            "success": False,
            "message": "Student not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "Student fetched successfully.",
        "data": student
    }), 200