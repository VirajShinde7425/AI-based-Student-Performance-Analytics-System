from pathlib import Path
from config import Config
import joblib
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = (BASE_DIR.parent / Path(Config.MODEL_PATH)).resolve()

# Load the model
model = joblib.load(MODEL_PATH)


def predict_total_score(attendance,
                        internal_marks,
                        assignment_marks,
                        practical_marks,
                        quiz_marks):

    features = pd.DataFrame({
        "Attendance": [attendance],
        "InternalMarks": [internal_marks],
        "AssignmentMarks": [assignment_marks],
        "PracticalMarks": [practical_marks],
        "QuizMarks": [quiz_marks]
    })

    prediction = model.predict(features)

    return round(float(prediction[0]), 2)


if __name__ == "__main__":

    score = predict_total_score(
        attendance=90,
        internal_marks=80,
        assignment_marks=85,
        practical_marks=88,
        quiz_marks=84
    )

    print("Predicted Total Score:", score)