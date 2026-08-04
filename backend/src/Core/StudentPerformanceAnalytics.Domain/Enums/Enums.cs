namespace StudentPerformanceAnalytics.Domain.Enums;

public enum UserRole
{
    Admin,
    Teacher,
    Student
}

public enum RiskLevel
{
    Low,
    Medium,
    High,
    Critical
}

public enum AcademicStatus
{
    Active,
    AtRisk,
    NeedsSupport,
    Suspended
}

public enum AttendanceStatus
{
    Present,
    Absent,
    Late
}
