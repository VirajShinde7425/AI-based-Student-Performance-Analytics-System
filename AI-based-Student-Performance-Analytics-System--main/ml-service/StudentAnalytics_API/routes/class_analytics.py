from flask import Blueprint, request, jsonify

from validators.class_validator import validate_class_analytics
from services.class_service import generate_class_analytics

class_bp = Blueprint("class", __name__)


@class_bp.route("/class-analytics", methods=["POST"])
def class_analytics():

    data = request.get_json()

    valid, error = validate_class_analytics(data)

    if not valid:
        return jsonify(error), 400

    result = generate_class_analytics(data["students"])

    return jsonify({
        "success": True,
        "message": "Class analytics generated successfully.",
        "data": result
    }), 200