from flask import Blueprint, jsonify, request
from validators.prediction_validator import validate_prediction
from services.prediction_service import predict_student

prediction_bp = Blueprint("prediction", __name__)

@prediction_bp.route("/predict", methods=["POST"])

def predict():

    data = request.get_json()

    is_valid, error = validate_prediction(data)

    if not is_valid:
        return jsonify(error),400

    result = predict_student(data)

    return jsonify({
        "success": True,
        "message": "Prediction generated successfully.",
        "data": result
    }), 200

