namespace StudentPerformanceAnalytics.Application.DTOs;

public class PagedResponseDto<T>
{
    public IEnumerable<T> Items { get; set; } = new List<T>();

    public int Page { get; set; }

    public int PageSize { get; set; }

    public int TotalItems { get; set; }

    public int TotalPages { get; set; }
}