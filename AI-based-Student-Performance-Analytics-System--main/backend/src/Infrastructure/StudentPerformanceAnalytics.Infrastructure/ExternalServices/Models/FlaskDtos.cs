using System.Text.Json.Serialization;

namespace StudentPerformanceAnalytics.Infrastructure.ExternalServices.Models;

public class FlaskPredictionRequest
{
    [JsonPropertyName("attendance")]
    public double Attendance { get; set; }

    [JsonPropertyName("internalMarks")]
    public double InternalMarks { get; set; }

    [JsonPropertyName("assignmentMarks")]
    public double AssignmentMarks { get; set; }

    [JsonPropertyName("practicalMarks")]
    public double PracticalMarks { get; set; }

    [JsonPropertyName("quizMarks")]
    public double QuizMarks { get; set; }
}

public class FlaskPredictionResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; } = "";

    [JsonPropertyName("data")]
    public FlaskPredictionData Data { get; set; } = new();
}

public class FlaskPredictionData
{
    [JsonPropertyName("predictedGpa")]
    public double PredictedGpa { get; set; }

    [JsonPropertyName("predictedGrade")]
    public string PredictedGrade { get; set; } = "";

    [JsonPropertyName("riskLevel")]
    public string RiskLevel { get; set; } = "";

    [JsonPropertyName("modelConfidence")]
    public double ModelConfidence { get; set; }

    [JsonPropertyName("recommendation")]
    public string Recommendation { get; set; } = "";
}