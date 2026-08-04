using System;
using System.Collections.Generic;
using StudentPerformanceAnalytics.Domain.Enums;

namespace StudentPerformanceAnalytics.Domain.Entities;

public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Teacher;
    public string Department { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;

    public Guid? StudentId { get; set; }

    public Student? Student { get; set; }
}

public class Department : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string HeadOfDepartment { get; set; } = string.Empty;
    public ICollection<Student> Students { get; set; } = new List<Student>();
}

public class Student : BaseEntity
{
    public string RegistrationId { get; set; } = string.Empty; // e.g. STU-2024-001
    public string RollNumber { get; set; } = string.Empty;      // e.g. CS2401
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;

    public Guid DepartmentId { get; set; }
    public Department? Department { get; set; }

    public int Semester { get; set; } = 6;
    public string Division { get; set; } = "A";

    public double AttendancePercentage { get; set; } = 85.0;
    public double AverageMarks { get; set; } = 75.0;
    public double CurrentGpa { get; set; } = 0;
    public double PredictedGpa { get; set; } = 0;
    public string PredictedGrade { get; set; } = "A";

    public RiskLevel RiskLevel { get; set; } = RiskLevel.Low;
    public AcademicStatus Status { get; set; } = AcademicStatus.Active;

    public string GuardianName { get; set; } = string.Empty;
    public string GuardianPhone { get; set; } = string.Empty;

    public string AiRecommendation { get; set; } = string.Empty;

    // Skills radar values (0-100)
    public int SkillCoding { get; set; } = 80;
    public int SkillTheory { get; set; } = 75;
    public int SkillLab { get; set; } = 85;
    public int SkillAptitude { get; set; } = 80;
    public int SkillProjects { get; set; } = 82;
    public int SkillSoftSkills { get; set; } = 78;

    public ICollection<AttendanceRecord> AttendanceRecords { get; set; } = new List<AttendanceRecord>();
    public ICollection<SubjectMark> SubjectMarks { get; set; } = new List<SubjectMark>();
    public ICollection<AiPrediction> Predictions { get; set; } = new List<AiPrediction>();

    // NEW
    public User? User { get; set; }
}

public class AttendanceRecord : BaseEntity
{
    public Guid StudentId { get; set; }
    public Student? Student { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow.Date;
    public string SubjectName { get; set; } = string.Empty;
    public AttendanceStatus Status { get; set; } = AttendanceStatus.Present;
    public int SlotNumber { get; set; } = 1;
    public string Remarks { get; set; } = string.Empty;
}

public class SubjectMark : BaseEntity
{
    public Guid StudentId { get; set; }
    public Student? Student { get; set; }

    public string SubjectName { get; set; } = string.Empty;
    public int Semester { get; set; } = 6;
    public string ExamTerm { get; set; } = "Final Semester";

    public double AssignmentMarks { get; set; } // Max 20
    public double InternalMarks { get; set; }   // Max 30
    public double PracticalMarks { get; set; }  // Max 20
    public double FinalExamMarks { get; set; }  // Max 100

    public double TotalScore { get; set; }
    public string Grade { get; set; } = "A";
}

public class AiPrediction : BaseEntity
{
    public Guid StudentId { get; set; }
    public Student? Student { get; set; }

    public double PredictedGpa { get; set; }
    public string PredictedGrade { get; set; } = "A";
    public RiskLevel RiskLevel { get; set; } = RiskLevel.Low;
    public double ModelConfidence { get; set; } = 94.8;
    public string Recommendation { get; set; } = string.Empty;
    public string FeatureVectorJson { get; set; } = "{}";
}

public class Notification : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "info"; // info, warning, success
    public bool IsRead { get; set; } = false;
    public string TimeAgo { get; set; } = "Just now";
}

public class SystemSetting : BaseEntity
{
    public string InstituteName { get; set; } = "St. Xavier Institute of Technology";
    public string AccreditationGrade { get; set; } = "Grade A+ Autonomous";
    public string AcademicYear { get; set; } = "2025-2026";
    public double LowAttendanceThreshold { get; set; } = 75.0;
    public string FlaskApiEndpoint { get; set; } = "http://localhost:5000/api/v1/predict";
}
