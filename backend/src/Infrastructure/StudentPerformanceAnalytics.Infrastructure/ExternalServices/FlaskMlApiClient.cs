using StudentPerformanceAnalytics.Domain.Entities;
using StudentPerformanceAnalytics.Domain.Enums;
using StudentPerformanceAnalytics.Domain.Interfaces;
using StudentPerformanceAnalytics.Infrastructure.ExternalServices.Models;
using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;

namespace StudentPerformanceAnalytics.Infrastructure.ExternalServices;

public class FlaskMlApiClient : IFlaskMlApiClient
{
    private readonly HttpClient _httpClient;

    public FlaskMlApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<AiPrediction> PredictStudentPerformanceAsync(Student student, SubjectMark marks)
    {
        var assignmentPercentage =
            (marks.AssignmentMarks / 20.0) * 100.0;

        var internalPercentage =
            (marks.InternalMarks / 30.0) * 100.0;

        var practicalPercentage =
            (marks.PracticalMarks / 20.0) * 100.0;

        var quizPercentage =
            (((marks.AssignmentMarks + marks.PracticalMarks) / 2.0) / 20.0) * 100.0;

        var payload = new FlaskPredictionRequest
        {
            Attendance = student.AttendancePercentage,

            AssignmentMarks = Math.Round(assignmentPercentage, 2),

            InternalMarks = Math.Round(internalPercentage, 2),

            PracticalMarks = Math.Round(practicalPercentage, 2),

            QuizMarks = Math.Round(quizPercentage, 2)
        };

        try
        {
            Console.WriteLine("========== Payload ==========");
            Console.WriteLine(JsonSerializer.Serialize(payload));
            Console.WriteLine("=============================");

            var response = await _httpClient.PostAsJsonAsync("/api/v1/predict", payload);

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();

                Console.WriteLine("========== Flask Response ==========");
                Console.WriteLine(json);
                Console.WriteLine("====================================");


                var result = JsonSerializer.Deserialize<FlaskPredictionResponse>(
                    json,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });


                if (result != null && result.Success)
                {
                    return new AiPrediction
                    {
                        StudentId = student.Id,

                        PredictedGpa = result.Data.PredictedGpa,

                        PredictedGrade = result.Data.PredictedGrade,

                        RiskLevel = Enum.TryParse<RiskLevel>(
                            result.Data.RiskLevel,
                            true,
                            out var risk)
                                ? risk
                                : RiskLevel.Low,

                        ModelConfidence = result.Data.ModelConfidence,

                        Recommendation = result.Data.Recommendation,

                        FeatureVectorJson = JsonSerializer.Serialize(payload)
                    };
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }

        var fallbackGpa = Math.Round(student.AverageMarks / 25.0, 2);

        return new AiPrediction
        {
            StudentId = student.Id,
            PredictedGpa = fallbackGpa,
            PredictedGrade = "B",
            RiskLevel = student.AttendancePercentage < 75
                ? RiskLevel.High
                : RiskLevel.Low,
            ModelConfidence = 90,
            Recommendation = "Prediction generated using fallback model.",
            FeatureVectorJson = JsonSerializer.Serialize(payload)
        };
    }
}

