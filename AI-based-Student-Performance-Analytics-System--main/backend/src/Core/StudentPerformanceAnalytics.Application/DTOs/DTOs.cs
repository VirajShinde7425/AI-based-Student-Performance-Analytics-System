using System;
using System.Collections.Generic;
using StudentPerformanceAnalytics.Domain.Enums;

namespace StudentPerformanceAnalytics.Application.DTOs;

// --- Auth DTOs ---
public record LoginRequestDto(string Email, string Password);

public record AuthResponseDto(
    string Token,
    string Name,
    string Role,
    string Email,
    string Department,
    string Avatar,
    string Title,
    Guid? StudentId
);

// --- Student DTOs ---
public record StudentSummaryDto(
    Guid Id,
    string RegistrationId,
    string RollNumber,
    string FullName,
    string Email,
    string AvatarUrl,
    string DepartmentName,
    int Semester,
    string Division,
    double AttendancePercentage,
    double AverageMarks,
    double CurrentGpa,
    double PredictedGpa,
    string PredictedGrade,
    string RiskLevel,
    string Status,
    string GuardianName,
    string GuardianPhone,
    string AiRecommendation
);

public record StudentDetailDto(
    Guid Id,
    string RegistrationId,
    string RollNumber,
    string FullName,
    string Email,
    string AvatarUrl,
    string DepartmentName,
    int Semester,
    string Division,
    double AttendancePercentage,
    double AverageMarks,
    double CurrentGpa,
    double PredictedGpa,
    string PredictedGrade,
    string RiskLevel,
    string Status,
    string GuardianName,
    string GuardianPhone,
    string AiRecommendation
    //SkillsDto Skills,
    //List<SubjectMarkDto> SubjectMarks,
    //List<double> AttendanceHistory,
    //List<double> GpaHistory
);

public record CreateStudentDto(
    string RegistrationId,
    string RollNumber,
    string FullName,
    string Email,
    string DepartmentName,
    int Semester,
    string Division,
    string GuardianName,
    string GuardianPhone
);

public record SkillsDto(
    int Coding,
    int Theory,
    int Lab,
    int Aptitude,
    int Projects,
    int SoftSkills
);

// --- Attendance DTOs ---
public record AttendanceRecordDto(
    Guid StudentId,
    string RollNumber,
    string StudentName,
    string AvatarUrl,
    double AverageAttendance,
    string Status,
    string Remarks
);

public record BatchMarkAttendanceDto(
    DateTime Date,
    string DepartmentName,
    string SubjectName,
    List<AttendanceEntryDto> Records
);

public record AttendanceEntryDto(
    Guid StudentId,
    string Status,
    string Remarks
);

// --- Marks DTOs ---
public record SubjectMarkDto(
    Guid StudentId,
    string SubjectName,
    double AssignmentMarks,
    double InternalMarks,
    double PracticalMarks,
    double FinalExamMarks,
    double TotalScore,
    string Grade
);

public record SaveStudentMarkDto(
    Guid StudentId,
    string SubjectName,
    string ExamTerm,
    double AssignmentMarks,
    double InternalMarks,
    double PracticalMarks,
    double FinalExamMarks
);

// --- Analytics & Power BI DTOs ---
public record PowerBiSummaryDto(
    double AverageGpa,
    double AverageAttendance,
    double PassRate,
    int StudentsAtRiskCount,
    string TopPerformerName,
    double TopPerformerScore,
    double HighestMark,
    string HighestStudent,
    double LowestMark,
    string LowestStudent,

    SkillsDto InstitutionalSkillsBenchmark,

    List<CategoryBreakdownDto> PerformanceCategories,

    List<StudentRankDto> TopPerformers,
    List<StudentRankDto> BottomPerformers,

    List<AttendanceTrendDto> AttendanceTrend,
    List<MarksDistributionDto> MarksDistribution,
    List<DepartmentComparisonDto> DepartmentComparison,
    List<SubjectPerformanceDto> SubjectPerformance,

    AiInsightDto AiInsight,

    List<RecentActivityDto> RecentActivities
);

public record AiInsightDto(
    string Title,
    string StudentName,
    string Message,
    string Recommendation,
    string Severity
);

public record RecentActivityDto(
    string Title,
    string Description,
    string Type,
    string TimeAgo
);

public record CategoryBreakdownDto(
    string Label,
    int Count,
    string Percentage,
    string Color
);

public record StudentRankDto(
    Guid Id,
    int Rank,
    string Name,
    string RollNumber,
    string Department,
    string AvatarUrl,
    double Score,
    string Subtext
);

public record AttendanceTrendDto(
    string Week,
    double Attendance
);

public record MarksDistributionDto(
    string Grade,
    int Count
);

public record DepartmentComparisonDto(
    string Department,
    double Attendance,
    double AverageMarks
);

public record SubjectPerformanceDto(
    string Subject,
    double AverageMarks
);

public record MarksAnalyticsDto(
    double HighestMark,
    string HighestStudent,

    double LowestMark,
    string LowestStudent,

    double ClassAverage,

    double PassRate,

    List<MarksDistributionDto> GradeDistribution,

    List<SubjectPerformanceDto> SubjectPerformance
);

// --- AI Predictions DTOs ---
public record AiPredictionSummaryDto(
    double ModelAccuracy,
    double ModelConfidence,
    int StudentsAtRiskCount,
    int LikelyTopPerformersCount,
    string FlaskApiEndpoint,
    string ApiStatus,
    List<StudentPredictionDto> StudentPredictions
);

public record StudentPredictionDto(
    Guid StudentId,
    string RollNumber,
    string FullName,
    string AvatarUrl,
    double CurrentAttendance,
    double CurrentGpa,
    double PredictedGpa,
    string PredictedGrade,
    string RiskLevel,
    double Confidence,
    string Recommendation
);

// --- Settings & Reports DTOs ---
public record SystemSettingDto(
    string InstituteName,
    string AccreditationGrade,
    string AcademicYear,
    double LowAttendanceThreshold,
    string FlaskApiEndpoint
);

public record StudentDashboardDto(
    string FullName,
    string Department,
    string AvatarUrl,

    double AttendancePercentage,
    double AverageMarks,

    double CurrentGpa,
    double PredictedGpa,

    string PredictedGrade,
    string RiskLevel,

    string AiRecommendation
);

public record StudentAttendanceDto(
    DateTime Date,
    string Subject,
    string Status
);

public record StudentMarksDto(
    string SubjectName,
    double AssignmentMarks,
    double InternalMarks,
    double PracticalMarks,
    double FinalExamMarks,
    double TotalScore,
    string Grade
);

public record StudentPredictionHistoryDto(
    DateTime PredictionDate,
    double PredictedGpa,
    string PredictedGrade,
    string RiskLevel,
    double ModelConfidence,
    string Recommendation
);

public record ChangePasswordRequestDto(
    string CurrentPassword,
    string NewPassword,
    string ConfirmPassword
);

public record ChangePasswordResponseDto(
    bool Success,
    string Message
);

public class CreateTeacherDto
{
    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Department { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;
}

public class TeacherSummaryDto
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Department { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string AvatarUrl { get; set; } = string.Empty;
}

public class TeacherDetailDto
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Department { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string AvatarUrl { get; set; } = string.Empty;
}

public class AdminDashboardDto
{
    public int TotalTeachers { get; set; }

    public int TotalStudents { get; set; }

    public int TotalDepartments { get; set; }

    public int TotalPredictions { get; set; }

    public string SystemStatus { get; set; } = "Online";
}
