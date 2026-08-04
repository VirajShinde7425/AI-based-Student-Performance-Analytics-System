from flask import Flask, jsonify

from config import Config
from routes.health import health_bp
from routes.prediction import prediction_bp
from routes.analytics import analytics_bp
from errors.handlers import register_error_handlers
from routes.class_analytics import class_bp
from routes.student import student_bp
from routes.teacher import teacher_bp
from routes.admin import admin_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
register_error_handlers(app)
app.config.from_object(Config)

app.register_blueprint(prediction_bp, url_prefix="/api/v1")
app.register_blueprint(health_bp, url_prefix="/api/v1")
app.register_blueprint(analytics_bp, url_prefix="/api/v1")
app.register_blueprint(class_bp, url_prefix="/api/v1")
app.register_blueprint(student_bp, url_prefix="/api/v1")
app.register_blueprint(teacher_bp, url_prefix="/api/v1")
app.register_blueprint(admin_bp, url_prefix="/api/v1")

@app.route("/")
def home():
    return jsonify({
        "project": app.config["PROJECT_NAME"],
        "version": app.config["API_VERSION"],
        "status": "Running"
    })



if __name__ == "__main__":
    app.run(
        host=app.config["HOST"],
        port=app.config["PORT"],
        debug=app.config["DEBUG"]
    )