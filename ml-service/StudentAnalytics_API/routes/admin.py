from flask import Blueprint, jsonify

from services.admin_service import get_admin_dashboard

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/admin/dashboard", methods=["GET"])
def admin_dashboard():

    dashboard = get_admin_dashboard()

    return jsonify({
        "success": True,
        "message": "Admin dashboard fetched successfully.",
        "data": dashboard
    }), 200