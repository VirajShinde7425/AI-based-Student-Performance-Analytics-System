namespace StudentPerformanceAnalytics.Application.DTOs;

public class StudentQueryDto
{
    public string? Search { get; set; }

    public string? Department { get; set; }

    public int? Semester { get; set; }

    public string? Division { get; set; }

    public string? RiskLevel { get; set; }

    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 10;

    public string SortBy { get; set; } = "FullName";

    public bool Ascending { get; set; } = true;
}