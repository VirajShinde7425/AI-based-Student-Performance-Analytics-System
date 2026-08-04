from flask import Blueprint, jsonify

from services.teacher_service import get_teacher_dashboard

teacher_bp = Blueprint("teacher", __name__)


@teacher_bp.route("/teacher/dashboard", methods=["GET"])
def teacher_dashboard():

    dashboard = get_teacher_dashboard()

    return jsonify({
        "success": True,
        "message": "Teacher dashboard fetched successfully.",
        "data": dashboard
    }), 200