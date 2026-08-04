import pandas as pd

# Load dataset
df = pd.read_csv("../datasets/Students Performance Dataset.csv")


# Select required columns
processed_df = df[
    [
        "Attendance (%)",
        "Midterm_Score",
        "Assignments_Avg",
        "Projects_Score",
        "Quizzes_Avg",
        "Total_Score"
    ]
]

# Rename columns
processed_df.rename(columns={
    "Attendance (%)": "Attendance",
    "Midterm_Score": "InternalMarks",
    "Assignments_Avg": "AssignmentMarks",
    "Projects_Score": "PracticalMarks",
    "Quizzes_Avg": "QuizMarks",
    "Total_Score": "TotalScore"
}, inplace=True)

print("\nProcessed Dataset Preview:")
print(processed_df.head())

print("\nShape:", processed_df.shape)

print("\nMissing Values:")
print(processed_df.isnull().sum())

print(df[
    [
        "Attendance (%)",
        "Midterm_Score",
        "Assignments_Avg",
        "Projects_Score",
        "Quizzes_Avg",
        "Total_Score"
    ]
].corr(numeric_only=True))

print(df[
    [
        "Midterm_Score",
        "Assignments_Avg",
        "Projects_Score",
        "Quizzes_Avg",
        "Total_Score"
    ]
].head(10))

# Save processed dataset
processed_df.to_csv(
    "../datasets/processed_student_data.csv",
    index=False
)

print("\n✅ processed_student_data.csv created successfully.")