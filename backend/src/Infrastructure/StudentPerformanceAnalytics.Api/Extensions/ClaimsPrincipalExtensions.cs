using System.Security.Claims;
using StudentPerformanceAnalytics.Domain.Constants;

namespace StudentPerformanceAnalytics.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid? GetStudentId(this ClaimsPrincipal user)
    {
        var claim = user.FindFirst(CustomClaimTypes.StudentId);

        if (claim == null)
            return null;

        return Guid.Parse(claim.Value);
    }

    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var claim = user.FindFirst(ClaimTypes.NameIdentifier);

        if (claim == null)
            throw new UnauthorizedAccessException("User identifier claim not found.");

        return Guid.Parse(claim.Value);
    }

    public static string GetRole(this ClaimsPrincipal user)
    {
        return user.FindFirst(ClaimTypes.Role)?.Value ?? "";
    }

    public static string GetEmail(this ClaimsPrincipal user)
    {
        return user.FindFirst(ClaimTypes.Email)?.Value ?? "";
    }

    public static string GetDepartment(this ClaimsPrincipal user)
    {
        return user.FindFirst(CustomClaimTypes.Department)?.Value ?? "";
    }
}