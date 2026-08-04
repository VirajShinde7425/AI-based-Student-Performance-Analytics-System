using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using StudentPerformanceAnalytics.Domain.Entities;
using StudentPerformanceAnalytics.Domain.Interfaces;
using StudentPerformanceAnalytics.Domain.Constants;

namespace StudentPerformanceAnalytics.Infrastructure.Authentication;

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(User user)
    {
        var secretKey = _configuration["Jwt:SecretKey"] ?? "SUPER_SECRET_KEY_STUDENT_ANALYTICS_SYSTEM_2026_JWT";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim(CustomClaimTypes.Department, user.Department),
        };

        if (user.StudentId.HasValue)
        {
            claims.Add(new Claim(
                CustomClaimTypes.StudentId,
                user.StudentId.Value.ToString()));
        }

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"] ?? "EduMetricsApi",
            audience: _configuration["Jwt:Audience"] ?? "EduMetricsClient",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
