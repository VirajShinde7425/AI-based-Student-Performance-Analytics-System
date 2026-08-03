from flask import Blueprint, request, jsonify

from validators.analytics_validator import validate_student_analytics

from services.analytics_service import generate_student_analytics

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/student/analytics", methods=["POST"])
def student_analytics():

    data = request.get_json()

    valid, error = validate_student_analytics(data)

    if not valid:
        return jsonify(error), 400

    result = generate_student_analytics(data)

    return jsonify(result), 200