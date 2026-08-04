import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()


class Config:

    DEBUG = os.getenv("DEBUG", "True") == "True"

    HOST = os.getenv("HOST", "0.0.0.0")

    PORT = int(os.getenv("PORT", 5000))

    API_VERSION = os.getenv("API_VERSION", "v1")

    PROJECT_NAME = os.getenv(
        "PROJECT_NAME",
        "AI-Based Student Performance Analytics API"
    )

    MODEL_PATH = os.getenv(
        "MODEL_PATH",
        "models/student_performance_model.pkl"
    )

    DATABASE_URL = os.getenv("DATABASE_URL")

    SECRET_KEY = os.getenv("SECRET_KEY")