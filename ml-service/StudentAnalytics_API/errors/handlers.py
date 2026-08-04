from flask import jsonify
from utils.logger import logger


def register_error_handlers(app):

    @app.errorhandler(Exception)
    def handle_exception(error):

        logger.exception(error)

        return jsonify({
            "success": False,
            "message": "An unexpected error occurred."
        }), 500