using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StudentPerformanceAnalytics.Api.Middleware;
using StudentPerformanceAnalytics.Application.Mappings;
using StudentPerformanceAnalytics.Application.Services;
using StudentPerformanceAnalytics.Application.Validators;
using StudentPerformanceAnalytics.Domain.Interfaces;
using StudentPerformanceAnalytics.Infrastructure.Authentication;
using StudentPerformanceAnalytics.Infrastructure.ExternalServices;
using StudentPerformanceAnalytics.Infrastructure.Persistence;
using System;
using System.Text;
using Microsoft.AspNetCore.HttpOverrides;

var options = new WebApplicationOptions
{
    Args = args
};

var builder = WebApplication.CreateBuilder(options);


// ============================================================
// CONFIGURATION
// ============================================================

// Remove default configuration sources
builder.Configuration.Sources.Clear();

// Add configuration without file watching
builder.Configuration
    .AddJsonFile(
        "appsettings.json",
        optional: false,
        reloadOnChange: false)
    .AddJsonFile(
        $"appsettings.{builder.Environment.EnvironmentName}.json",
        optional: true,
        reloadOnChange: false)
    .AddEnvironmentVariables();


// ============================================================
// 1. DATABASE / DbContext
// ============================================================

var connectionString =
    builder.Configuration.GetConnectionString("PostgreSQLConnection");

var useInMemory =
    builder.Configuration.GetValue<bool>(
        "ConnectionStrings:UseInMemoryDatabase",
        false);

if (useInMemory)
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseInMemoryDatabase("StudentAnalyticsInMemoryDb"));
}
else
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql(connectionString));
}


// ============================================================
// 2. REPOSITORIES & UNIT OF WORK
// ============================================================

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddScoped<IStudentRepository, StudentRepository>();

builder.Services.AddScoped<IAttendanceRepository, AttendanceRepository>();

builder.Services.AddScoped<IMarksRepository, MarksRepository>();


// ============================================================
// 3. APPLICATION SERVICES
// ============================================================

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<IStudentService, StudentService>();

builder.Services.AddScoped<IAttendanceService, AttendanceService>();

builder.Services.AddScoped<IMarksService, MarksService>();

builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();

builder.Services.AddScoped<IPredictionService, PredictionService>();

builder.Services.AddScoped<ISettingsService, SettingsService>();

builder.Services.AddScoped<IStudentPortalService, StudentPortalService>();

builder.Services.AddScoped<ITeacherService, TeacherService>();

builder.Services.AddScoped<IAdminService, AdminService>();

builder.Services.AddScoped<IJwtService, JwtService>();


// ============================================================
// 4. REPORT SERVICES
// ============================================================

builder.Services.AddScoped<IReportsService, ReportsService>();

builder.Services.AddScoped<IExcelReportService, ExcelReportService>();


// ============================================================
// 5. HTTP CLIENT - FLASK ML API
// ============================================================

builder.Services.AddHttpClient<IFlaskMlApiClient, FlaskMlApiClient>(client =>
{
    var flaskEndpoint =
        builder.Configuration["FlaskApi:BaseUrl"]
        ?? "http://localhost:5000";

    client.BaseAddress = new Uri(flaskEndpoint);

    client.Timeout = TimeSpan.FromSeconds(10);
});


// ============================================================
// 6. AUTOMAPPER & FLUENT VALIDATION
// ============================================================

builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();


// ============================================================
// 7. JWT AUTHENTICATION
// ============================================================

var secretKey =
    builder.Configuration["Jwt:SecretKey"]
    ?? "SUPER_SECRET_KEY_STUDENT_ANALYTICS_SYSTEM_2026_JWT_PRODUCTION_KEY";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
        JwtBearerDefaults.AuthenticationScheme;

    options.DefaultChallengeScheme =
        JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata =
        !builder.Environment.IsDevelopment();

    options.SaveToken = true;

    options.TokenValidationParameters =
        new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,

            IssuerSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(secretKey)),

            ValidateIssuer = false,

            ValidateAudience = false,

            ValidateLifetime = true,

            ClockSkew = TimeSpan.Zero
        };
});

builder.Services.AddAuthorization();


// ============================================================
// 8. CORS - REACT FRONTEND
// ============================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "http://localhost:5173",
                "https://ai-based-student-performance-analyt-zeta.vercel.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


// ============================================================
// 9. CONTROLLERS
// ============================================================

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();


// ============================================================
// 10. SWAGGER / OPENAPI
// ============================================================

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "EduMetrics AI - ASP.NET Core 9 Web API",

        Version = "v1",

        Description =
            "Clean Architecture RESTful Web API backend for Student Performance Analytics System."
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description =
            "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",

        Name = "Authorization",

        In = ParameterLocation.Header,

        Type = SecuritySchemeType.ApiKey,

        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference =
                    new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
            },

            Array.Empty<string>()
        }
    });
});


// ============================================================
// BUILD APPLICATION
// ============================================================

var app = builder.Build();


// ============================================================
// STARTUP LOG
// ============================================================

Console.WriteLine("====================================");
Console.WriteLine("StudentPerformanceAnalytics.Api Started");
Console.WriteLine("====================================");


// ============================================================
// FORWARDED HEADERS - RENDER / PROXY
// ============================================================

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto
});


// ============================================================
// 11. GLOBAL EXCEPTION MIDDLEWARE
// ============================================================

app.UseMiddleware<GlobalExceptionMiddleware>();


// ============================================================
// 12. SWAGGER
// ============================================================

app.UseSwagger();

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint(
        "/swagger/v1/swagger.json",
        "EduMetrics AI API v1");
});


// ============================================================
// 13. REQUEST PIPELINE
// ============================================================

app.UseRouting();

app.UseCors("AllowFrontend");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();


// ============================================================
// 14. DATABASE MIGRATION & SEEDING
// ============================================================

using (var scope = app.Services.CreateScope())
{
    var context =
        scope.ServiceProvider
            .GetRequiredService<ApplicationDbContext>();

    await context.Database.MigrateAsync();

    await DbSeeder.SeedDataAsync(context);
}


// ============================================================
// 15. HEALTH / ROOT ENDPOINT
// ============================================================

app.MapGet("/", () =>
{
    return Results.Ok(new
    {
        Application =
            "Student Performance Analytics API",

        Status =
            "Running",

        Environment =
            app.Environment.EnvironmentName
    });
});


// ============================================================
// RUN APPLICATION
// ============================================================

app.Run();