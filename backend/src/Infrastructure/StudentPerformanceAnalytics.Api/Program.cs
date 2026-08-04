using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
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
using Microsoft.Extensions.Configuration;
using static StudentPerformanceAnalytics.Application.Services.PredictionService;


var options = new WebApplicationOptions
{
    Args = args
};

var builder = WebApplication.CreateBuilder(options);

// Remove the default configuration sources
builder.Configuration.Sources.Clear();

// Re-add configuration without file watching
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
    .AddJsonFile(
        $"appsettings.{builder.Environment.EnvironmentName}.json",
        optional: true,
        reloadOnChange: false)
    .AddEnvironmentVariables();

// 1. Add Services & DbContext
var connectionString = builder.Configuration.GetConnectionString("PostgreSQLConnection");
var useInMemory = builder.Configuration.GetValue<bool>("ConnectionStrings:UseInMemoryDatabase", false);

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

// 2. Repositories & UnitOfWork
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<IAttendanceRepository, AttendanceRepository>();
builder.Services.AddScoped<IMarksRepository, MarksRepository>();
builder.Services.AddScoped<ISettingsService, SettingsService>();

// 3. Application Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<IAttendanceService, AttendanceService>();
builder.Services.AddScoped<IMarksService, MarksService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();
builder.Services.AddScoped<IPredictionService, PredictionService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<ITeacherService, TeacherService>();
builder.Services.AddScoped<IAdminService, AdminService>();

// Report Services
builder.Services.AddScoped<IReportsService, ReportsService>();
builder.Services.AddScoped<IExcelReportService, ExcelReportService>();

// 4. HttpClient Integration for Flask ML API
builder.Services.AddHttpClient<IFlaskMlApiClient, FlaskMlApiClient>(client =>
{
    var flaskEndpoint = builder.Configuration["FlaskApi:BaseUrl"] ?? "http://localhost:5000";
    client.BaseAddress = new Uri(flaskEndpoint);
    client.Timeout = TimeSpan.FromSeconds(10);
});

// 5. AutoMapper & FluentValidation
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();

// 6. JWT Authentication Setup
var secretKey = builder.Configuration["Jwt:SecretKey"] ?? "SUPER_SECRET_KEY_STUDENT_ANALYTICS_SYSTEM_2026_JWT_PRODUCTION_KEY";
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Services.AddAuthorization();

builder.Services.AddScoped<IStudentPortalService, StudentPortalService>();

// 7. CORS policy for React Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:5173",
            "https://ai-based-student-performance-analyt.vercel.app"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 8. Swagger OpenAPI definition
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "EduMetrics AI - ASP.NET Core 9 Web API",
        Version = "v1",
        Description = "Clean Architecture RESTful Web API backend for Student Performance Analytics System."
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
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
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

Console.WriteLine("====================================");
Console.WriteLine("StudentPerformanceAnalytics.Api Started");
Console.WriteLine("====================================");

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto
});

// 9. Middleware Pipeline
app.UseMiddleware<GlobalExceptionMiddleware>();

//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "EduMetrics AI API v1"));
//}

app.UseSwagger();

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "EduMetrics AI API v1");
});

app.UseRouting();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// 10. Auto-Seed Database on Startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    await context.Database.MigrateAsync();

    await DbSeeder.SeedDataAsync(context);
}

app.MapGet("/", () =>
{
    return Results.Ok(new
    {
        Application = "Student Performance Analytics API",
        Status = "Running",
        Environment = app.Environment.EnvironmentName
    });
});

app.Run();
