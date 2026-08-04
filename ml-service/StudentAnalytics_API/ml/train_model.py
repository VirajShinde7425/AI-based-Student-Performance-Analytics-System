import pandas as pd
import joblib

from sklearn.model_selection import train_test_split

from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

# Load dataset
df = pd.read_csv("../datasets/processed_student_data.csv")

# Features
X = df[
    [
        "Attendance",
        "InternalMarks",
        "AssignmentMarks",
        "PracticalMarks",
        "QuizMarks"
    ]
]

# Target
y = df["TotalScore"]

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print(f"Training Samples : {len(X_train)}")
print(f"Testing Samples  : {len(X_test)}")

# Models to Compare
models = {
    "Linear Regression": LinearRegression(),
    "Decision Tree": DecisionTreeRegressor(random_state=42),
    "Random Forest": RandomForestRegressor(
        n_estimators=100,
        random_state=42
    )
}

results = []

best_model = None
best_model_name = ""
best_r2 = float("-inf")

print("\n================ MODEL COMPARISON ================\n")

for name, model in models.items():

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)

    rmse = mean_squared_error(
        y_test,
        predictions
    ) ** 0.5

    r2 = r2_score(
        y_test,
        predictions
    )

    results.append([name, mae, rmse, r2])

    print(f"{name}")

    print(f"MAE : {mae:.2f}")

    print(f"RMSE: {rmse:.2f}")

    print(f"R²  : {r2:.4f}")

    print("------------------------------------------")

    if r2 > best_r2:
        best_r2 = r2
        best_model = model
        best_model_name = name

print("\n=============== FINAL RESULT ===============")

print(f"Best Model : {best_model_name}")

print(f"R² Score   : {best_r2:.4f}")

# Save best model
joblib.dump(
    best_model,
    "../models/student_performance_model.pkl"
)

print("\nModel saved successfully!")