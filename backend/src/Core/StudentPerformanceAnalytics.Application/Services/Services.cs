using System;
using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using StudentPerformanceAnalytics.Application.DTOs;
using StudentPerformanceAnalytics.Domain.Entities;
using StudentPerformanceAnalytics.Domain.Enums;
using StudentPerformanceAnalytics.Domain.Interfaces;
using BCrypt.Net;

namespace StudentPerformanceAnalytics.Application.Services;

// --- Service Interfaces ---
public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request);

    Task<ChangePasswordResponseDto> ChangePasswordAsync(Guid userId, ChangePasswordRequestDto request);

    Task RequestPasswordResetAsync(string email);

    Task<bool> ResetPasswordAsync(string token, string newPassword, string confirmPassword);
}

public interface IStudentService
{
    Task<IEnumerable<StudentSummaryDto>> GetStudentsAsync(string? search, string? department, int? semester, string? division, string? riskLevel);
    //Task<PagedResponseDto<StudentSummaryDto>> GetStudentsAsync(StudentQueryDto query);
    Task<StudentDetailDto?> GetStudentByIdAsync(Guid id);
    Task<StudentSummaryDto> CreateStudentAsync(CreateStudentDto dto);
    Task<bool> UpdateStudentAsync(Guid id, CreateStudentDto dto);
    Task<bool> DeleteStudentAsync(Guid id);
}

public interface IAttendanceService
{
    Task<IEnumerable<AttendanceRecordDto>> GetDailyAttendanceAsync(string department, string subject, DateTime date);
    Task<bool> BatchMarkAttendanceAsync(BatchMarkAttendanceDto dto);
}

public interface IMarksService
{
    Task<IEnumerable<SubjectMarkDto>> GetStudentMarksAsync(Guid studentId);
    Task<bool> SaveMarksAsync(List<SaveStudentMarkDto> marksList);
    Task<bool> AutoCalculateGradesAsync();

    Task<IEnumerable<SubjectMarkDto>> GetAllMarksAsync();
}

public interface IAnalyticsService
{
    Task<PowerBiSummaryDto> GetPowerBiSummaryAsync();
}

public interface IPredictionService
{
    Task<AiPredictionSummaryDto> GetPredictionSummaryAsync();
    Task<bool> RunInferenceAsync();
}

public interface IReportsService
{
    Task<ReportsDashboardDto> GetDashboardAsync();
}

public interface IExcelReportService
{
    Task<byte[]> GeneratePerformanceReportAsync();
}

public interface ISettingsService
{
    Task<SystemSettingDto> GetSettingsAsync();

    Task<bool> UpdateSettingsAsync(SystemSettingDto dto);

}

public interface IStudentPortalService
{
    Task<StudentDetailDto?> GetMyProfileAsync(Guid studentId);
    Task<StudentDashboardDto?> GetMyDashboardAsync(Guid studentId);

    Task<List<StudentAttendanceDto>> GetMyAttendanceAsync(Guid studentId);

    Task<List<StudentMarksDto>> GetMyMarksAsync(Guid studentId);

    Task<List<StudentPredictionHistoryDto>> GetMyPredictionsAsync(Guid studentId);
}

public interface ITeacherService
{
    Task<IEnumerable<TeacherSummaryDto>> GetTeachersAsync();

    Task<TeacherDetailDto?> GetTeacherByIdAsync(Guid id);

    Task<TeacherSummaryDto> CreateTeacherAsync(CreateTeacherDto dto);

    Task<bool> UpdateTeacherAsync(Guid id, CreateTeacherDto dto);

    Task<bool> DeleteTeacherAsync(Guid id);

    Task<bool> ResetTeacherPasswordAsync(Guid id);
}

public interface IAdminService
{
    Task<AdminDashboardDto> GetDashboardAsync();
}



// --- Service Implementations ---
public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;

    public AuthService(IUnitOfWork unitOfWork, IJwtService jwtService)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var email = request.Email.Trim();

        var users = await _unitOfWork.Users.FindAsync(
            u => u.Email.ToLower() == email.ToLower());

        var user = users.FirstOrDefault();

        if (user == null)
        {
            throw new UnauthorizedAccessException("Email address not found.");
        }

        bool validPassword = BCrypt.Net.BCrypt.Verify(
            request.Password,
            user.PasswordHash
        );

        if (!validPassword)
        {
            throw new UnauthorizedAccessException("Incorrect password.");
        }

        var token = _jwtService.GenerateToken(user);

        return new AuthResponseDto(
            token,
            user.FullName,
            user.Role.ToString(),
            user.Email,
            user.Department,
            user.AvatarUrl,
            user.Title,
            user.StudentId
        );
    }

    public async Task<ChangePasswordResponseDto> ChangePasswordAsync(
        Guid userId,
        ChangePasswordRequestDto request)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);

        if (user == null)
        {
            return new ChangePasswordResponseDto(false, "User not found.");
        }

        bool validPassword = BCrypt.Net.BCrypt.Verify(
            request.CurrentPassword,
            user.PasswordHash
        );

        if (!validPassword)
        {
            return new ChangePasswordResponseDto(false, "Current password is incorrect.");
        }

        if (request.NewPassword != request.ConfirmPassword)
        {
            return new ChangePasswordResponseDto(
                false,
                "New password and confirmation password do not match.");
        }

        if (BCrypt.Net.BCrypt.Verify(
                request.NewPassword,
                user.PasswordHash))
        {
            return new ChangePasswordResponseDto(
                false,
                "New password must be different from the current password.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Users.Update(user);
        await _unitOfWork.CompleteAsync();

        return new ChangePasswordResponseDto(
            true,
            "Password changed successfully.");
    }
public async Task RequestPasswordResetAsync(string email)
{
    try
    {
        if (string.IsNullOrWhiteSpace(email))
            return;

        var normalizedEmail = email.Trim();

        var users = await _unitOfWork.Users.FindAsync(
            u => u.Email.ToLower() == normalizedEmail.ToLower());

        var user = users.FirstOrDefault();

        if (user == null)
            return;

        Console.WriteLine("Forgot password: user found.");

        var token = CreateResetToken(user);

        Console.WriteLine("Forgot password: reset token created.");

        var frontendUrl =
            Environment.GetEnvironmentVariable("FRONTEND_URL")
            ?? "http://localhost:5173";

        Console.WriteLine($"Forgot password: FRONTEND_URL configured = {!string.IsNullOrWhiteSpace(frontendUrl)}");

        var resetLink =
            $"{frontendUrl.TrimEnd('/')}/#/reset-password?token={Uri.EscapeDataString(token)}";

        Console.WriteLine("Forgot password: reset link created.");

        await SendResetEmailAsync(user.Email, user.FullName, resetLink);

        Console.WriteLine("Forgot password: email sent successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"FORGOT PASSWORD ERROR: {ex}");
        throw;
    }
}
    public async Task<bool> ResetPasswordAsync(
        string token,
        string newPassword,
        string confirmPassword)
    {
        if (string.IsNullOrWhiteSpace(token) ||
            string.IsNullOrWhiteSpace(newPassword) ||
            newPassword != confirmPassword)
        {
            return false;
        }

        if (newPassword.Length < 8 ||
            !newPassword.Any(char.IsUpper) ||
            !newPassword.Any(char.IsLower) ||
            !newPassword.Any(char.IsDigit) ||
            !newPassword.Any(c => "@$!%*?&#^()_-+=".Contains(c)))
        {
            return false;
        }

        if (!TryValidateResetToken(token, out var userId))
            return false;

        var user = await _unitOfWork.Users.GetByIdAsync(userId);

        if (user == null)
            return false;

        // The token contains a fingerprint of the old password hash.
        // Therefore, a reset token cannot be reused after a successful reset.
        if (!TryValidateResetToken(token, out _, user))
            return false;

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        user.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Users.Update(user);
        await _unitOfWork.CompleteAsync();

        return true;
    }

    private string CreateResetToken(User user)
    {
        var expiresAt = DateTimeOffset.UtcNow
            .AddMinutes(30)
            .ToUnixTimeSeconds();

        var payload = new
        {
            uid = user.Id,
            exp = expiresAt,
            pwd = PasswordFingerprint(user.PasswordHash)
        };

        var payloadJson = JsonSerializer.Serialize(payload);
        var payloadPart = Base64UrlEncode(Encoding.UTF8.GetBytes(payloadJson));
        var signature = Sign(payloadPart);

        return $"{payloadPart}.{signature}";
    }

    private bool TryValidateResetToken(
        string token,
        out Guid userId,
        User? currentUser = null)
    {
        userId = Guid.Empty;

        var parts = token.Split('.');
        if (parts.Length != 2)
            return false;

        var expectedSignature = Sign(parts[0]);

        if (!CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(expectedSignature),
                Encoding.UTF8.GetBytes(parts[1])))
        {
            return false;
        }

        try
        {
            var json = Encoding.UTF8.GetString(Base64UrlDecode(parts[0]));
            using var document = JsonDocument.Parse(json);
            var root = document.RootElement;

            if (!root.TryGetProperty("uid", out var uidElement) ||
                !Guid.TryParse(uidElement.GetString(), out userId))
            {
                userId = Guid.Empty;
                return false;
            }

            if (!root.TryGetProperty("exp", out var expElement) ||
                expElement.GetInt64() < DateTimeOffset.UtcNow.ToUnixTimeSeconds())
            {
                userId = Guid.Empty;
                return false;
            }

            if (currentUser != null)
            {
                if (!root.TryGetProperty("pwd", out var pwdElement) ||
                    pwdElement.GetString() != PasswordFingerprint(currentUser.PasswordHash))
                {
                    userId = Guid.Empty;
                    return false;
                }
            }

            return true;
        }
        catch
        {
            userId = Guid.Empty;
            return false;
        }
    }
private async Task SendResetEmailAsync(
    string recipientEmail,
    string recipientName,
    string resetLink)
{
    var apiKey = Environment.GetEnvironmentVariable("RESEND_API_KEY");

    var fromEmail =
        Environment.GetEnvironmentVariable("SMTP_FROM_EMAIL");

    var fromName =
        Environment.GetEnvironmentVariable("SMTP_FROM_NAME")
        ?? "EduMetrics AI";

    if (string.IsNullOrWhiteSpace(apiKey))
    {
        throw new InvalidOperationException(
            "Password reset email is not configured. Set RESEND_API_KEY.");
    }

    if (string.IsNullOrWhiteSpace(fromEmail))
    {
        throw new InvalidOperationException(
            "Password reset email is not configured. Set SMTP_FROM_EMAIL.");
    }

    var htmlBody = $"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px">
          <h2 style="color:#2563eb">EduMetrics AI</h2>

          <p>Hello {System.Net.WebUtility.HtmlEncode(recipientName)},</p>

          <p>We received a request to reset your EduMetrics AI password.</p>

          <p>This link will expire in <strong>30 minutes</strong>.</p>

          <p>
            <a href="{System.Net.WebUtility.HtmlEncode(resetLink)}"
               style="display:inline-block;padding:12px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px">
              Reset Password
            </a>
          </p>

          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
        """;

    try
    {
        using var httpClient = new HttpClient();

        httpClient.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue(
                "Bearer",
                apiKey);

        var requestBody = new
        {
            from = $"{fromName} <{fromEmail}>",
            to = new[] { recipientEmail },
            subject = "EduMetrics AI - Reset your password",
            html = htmlBody
        };

        var json = System.Text.Json.JsonSerializer.Serialize(requestBody);

        using var content = new StringContent(
            json,
            System.Text.Encoding.UTF8,
            "application/json");

        Console.WriteLine("Resend: attempting to send email...");

        var response = await httpClient.PostAsync(
            "https://api.resend.com/emails",
            content);

        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            Console.WriteLine(
                $"Resend ERROR: {(int)response.StatusCode} {response.StatusCode}");
            Console.WriteLine($"Resend response: {responseBody}");

            throw new InvalidOperationException(
                $"Resend email failed: {response.StatusCode}");
        }

        Console.WriteLine("Resend: email sent successfully.");
        Console.WriteLine($"Resend response: {responseBody}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Resend ERROR: {ex}");
        throw;
    }
}

public class StudentService : IStudentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public StudentService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<StudentSummaryDto>> GetStudentsAsync(string? search, string? department, int? semester, string? division, string? riskLevelStr)
    {
        RiskLevel? parsedRisk = Enum.TryParse<RiskLevel>(riskLevelStr, true, out var r) ? r : null;
        var students = await _unitOfWork.Students.GetFilteredStudentsAsync(search, department, semester, division, parsedRisk);
        return _mapper.Map<IEnumerable<StudentSummaryDto>>(students);
    }

    public async Task<StudentDetailDto?> GetStudentByIdAsync(Guid id)
    {
        var student = await _unitOfWork.Students.GetStudentWithDetailsAsync(id);
        if (student == null) return null;
        return _mapper.Map<StudentDetailDto>(student);
    }



    public async Task<StudentSummaryDto> CreateStudentAsync(CreateStudentDto dto)
    {
        // Check if login email already exists
        var existingUser = await _unitOfWork.Users.FindAsync(u => u.Email == dto.Email);

        if (existingUser.Any())
        {
            throw new InvalidOperationException("A user with this email already exists.");
        }

        var existingRegistration = await _unitOfWork.Students.FindAsync(
            s => s.RegistrationId == dto.RegistrationId);

        if (existingRegistration.Any())
        {
            throw new InvalidOperationException("Registration ID already exists.");
        }

        var existingRollNumber = await _unitOfWork.Students.FindAsync(
            s => s.RollNumber == dto.RollNumber);

        if (existingRollNumber.Any())
        {
            throw new InvalidOperationException("Roll Number already exists.");
        }

        var depts = await _unitOfWork.Departments.FindAsync(d => d.Name == dto.DepartmentName);
        var dept = depts.FirstOrDefault();

        if (dept == null)
        {
            dept = new Department
            {
                Name = dto.DepartmentName,
                Code = dto.DepartmentName[..2].ToUpper()
            };

            await _unitOfWork.Departments.AddAsync(dept);
            await _unitOfWork.CompleteAsync();

        }

        var student = new Student
        {
            RegistrationId = dto.RegistrationId,
            RollNumber = dto.RollNumber,
            FullName = dto.FullName,
            Email = dto.Email,

            DepartmentId = dept.Id,
            Department = dept,

            Semester = dto.Semester,
            Division = dto.Division,

            // Default values for a newly enrolled student
            AttendancePercentage = 0,
            AverageMarks = 0,
            CurrentGpa = 0,
            PredictedGpa = 0,
            PredictedGrade = "-",

            RiskLevel = RiskLevel.Low,
            Status = AcademicStatus.Active,

            GuardianName = dto.GuardianName,
            GuardianPhone = dto.GuardianPhone,

            AiRecommendation = "Prediction not generated yet.",

            AvatarUrl = $"https://api.dicebear.com/7.x/avataaars/svg?seed={dto.FullName}"
        };

        await _unitOfWork.Students.AddAsync(student);
        await _unitOfWork.CompleteAsync();

        var user = new User
        {
            Email = student.Email,
            FullName = student.FullName,

            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),

            Role = UserRole.Student,

            Department = dto.DepartmentName,

            Title = "Student",

            AvatarUrl = student.AvatarUrl,

            StudentId = student.Id
        };

        await _unitOfWork.Users.AddAsync(user);

        await _unitOfWork.CompleteAsync();

        return _mapper.Map<StudentSummaryDto>(student);
    }

    public async Task<bool> UpdateStudentAsync(Guid id, CreateStudentDto dto)
    {
        var student = await _unitOfWork.Students.GetByIdAsync(id);

        if (student == null)
            return false;

        var depts = await _unitOfWork.Departments.FindAsync(d => d.Name == dto.DepartmentName);
        var dept = depts.FirstOrDefault();

        if (dept != null)
        {
            student.DepartmentId = dept.Id;
            student.Department = dept;
        }

        student.FullName = dto.FullName;
        student.RegistrationId = dto.RegistrationId;
        student.RollNumber = dto.RollNumber;
        student.Email = dto.Email;
        student.Semester = dto.Semester;
        student.Division = dto.Division;
        student.GuardianName = dto.GuardianName;
        student.GuardianPhone = dto.GuardianPhone;

        _unitOfWork.Students.Update(student);

        var users = await _unitOfWork.Users.FindAsync(u => u.StudentId == student.Id);

        var user = users.FirstOrDefault();

        if (user != null)
        {
            user.FullName = student.FullName;
            user.Email = student.Email;
            user.Department = dto.DepartmentName;
            user.AvatarUrl = student.AvatarUrl;

            _unitOfWork.Users.Update(user);
        }

        await _unitOfWork.CompleteAsync();

        return true;
    }

    public async Task<bool> DeleteStudentAsync(Guid id)
    {
        var student = await _unitOfWork.Students.GetByIdAsync(id);

        if (student == null) return false;

        var users = await _unitOfWork.Users.FindAsync(u => u.StudentId == student.Id);

        var user = users.FirstOrDefault();

        if (user != null)
        {
            _unitOfWork.Users.Delete(user);
        }

        _unitOfWork.Students.Delete(student);
        await _unitOfWork.CompleteAsync();
        return true;
    }
}

public class AttendanceService : IAttendanceService
{
    private readonly IUnitOfWork _unitOfWork;

    public AttendanceService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<AttendanceRecordDto>> GetDailyAttendanceAsync(
    string department,
    string subject,
    DateTime date)
    {
        var students = await _unitOfWork.Students.GetAllAsync();

        var attendance = await _unitOfWork.Attendance.FindAsync(a =>
            a.Date == date &&
            a.SubjectName == subject);

        return students.Select(student =>
        {
            var record = attendance.FirstOrDefault(a => a.StudentId == student.Id);

            return new AttendanceRecordDto(
                student.Id,
                student.RollNumber,
                student.FullName,
                student.AvatarUrl,
                student.AttendancePercentage,
                record?.Status.ToString() ?? "Present",
                record?.Remarks ?? ""
            );
        });
    }

    private RiskLevel CalculateRiskLevel(Student student)
    {
        if (student.AttendancePercentage < 60 || student.AverageMarks < 40)
            return RiskLevel.Critical;

        if (student.AttendancePercentage < 75 || student.AverageMarks < 60)
            return RiskLevel.High;

        if (student.AttendancePercentage < 85 || student.AverageMarks < 75)
            return RiskLevel.Medium;

        return RiskLevel.Low;
    }

    public async Task<bool> BatchMarkAttendanceAsync(BatchMarkAttendanceDto dto)
    {

        foreach (var entry in dto.Records)
        {
            var student = await _unitOfWork.Students.GetByIdAsync(entry.StudentId);

            if (student == null)
                continue;

            // Update overall attendance percentage
            if (entry.Status == "Present")
                student.AttendancePercentage = Math.Min(100, student.AttendancePercentage + 0.5);
            else if (entry.Status == "Absent")
                student.AttendancePercentage = Math.Max(0, student.AttendancePercentage - 1.5);

            student.RiskLevel = CalculateRiskLevel(student);
            _unitOfWork.Students.Update(student);

            // Check if today's attendance already exists
            var existing = (await _unitOfWork.Attendance.FindAsync(a =>
                a.StudentId == student.Id &&
                a.Date.Date == dto.Date.ToUniversalTime().Date &&
                a.SubjectName == dto.SubjectName))
                .FirstOrDefault();

            if (existing == null)
            {
                await _unitOfWork.Attendance.AddAsync(new AttendanceRecord
                {
                    StudentId = student.Id,
                    Date = DateTime.SpecifyKind(dto.Date.Date, DateTimeKind.Utc),
                    SubjectName = dto.SubjectName,
                    Status = Enum.Parse<AttendanceStatus>(entry.Status),
                    Remarks = entry.Remarks,
                    SlotNumber = 1
                });
            }
            else
            {
                existing.Status = Enum.Parse<AttendanceStatus>(entry.Status);
                existing.Remarks = entry.Remarks;

                _unitOfWork.Attendance.Update(existing);
            }
        }

        await _unitOfWork.CompleteAsync();
        return true;
    }
}

    public class MarksService : IMarksService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public MarksService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<SubjectMarkDto>> GetStudentMarksAsync(Guid studentId)
        {
            var marks = await _unitOfWork.Marks.GetByStudentIdAsync(studentId);
            return _mapper.Map<IEnumerable<SubjectMarkDto>>(marks);
        }

        public async Task<IEnumerable<SubjectMarkDto>> GetAllMarksAsync()
        {
            var marks = await _unitOfWork.Marks.GetAllAsync();
            return _mapper.Map<IEnumerable<SubjectMarkDto>>(marks);
        }

    private RiskLevel CalculateRiskLevel(Student student)
        {
            if (student.AttendancePercentage < 60 || student.AverageMarks < 40)
                return RiskLevel.Critical;

            if (student.AttendancePercentage < 75 || student.AverageMarks < 60)
                return RiskLevel.High;

            if (student.AttendancePercentage < 85 || student.AverageMarks < 75)
                return RiskLevel.Medium;

            return RiskLevel.Low;
        }

        public async Task<bool> SaveMarksAsync(List<SaveStudentMarkDto> marksList)
        {

            foreach (var m in marksList)
            {
                Console.WriteLine($"{m.StudentId} - {m.SubjectName}");
                var total = (m.AssignmentMarks + m.InternalMarks + m.PracticalMarks + m.FinalExamMarks) / 1.7;
                var markEntity = new SubjectMark
                {
                    StudentId = m.StudentId,
                    SubjectName = m.SubjectName,
                    ExamTerm = m.ExamTerm,
                    AssignmentMarks = m.AssignmentMarks,
                    InternalMarks = m.InternalMarks,
                    PracticalMarks = m.PracticalMarks,
                    FinalExamMarks = m.FinalExamMarks,
                    TotalScore = Math.Round(total, 1),
                    Grade = total >= 90 ? "A+" :
                            total >= 80 ? "A" :
                            total >= 70 ? "B+" :
                            total >= 60 ? "B" :
                            total >= 50 ? "C" :
                            total >= 40 ? "D" :
                            "F"
                };

                var existing = (await _unitOfWork.Marks
                    .GetBySubjectAndExamAsync(m.SubjectName, m.ExamTerm))
                    .FirstOrDefault(x => x.StudentId == m.StudentId);

                if (existing != null)
                {
                    existing.AssignmentMarks = m.AssignmentMarks;
                    existing.InternalMarks = m.InternalMarks;
                    existing.PracticalMarks = m.PracticalMarks;
                    existing.FinalExamMarks = m.FinalExamMarks;
                    existing.TotalScore = Math.Round(total, 1);
                    existing.Grade = total >= 90 ? "A+" :
                                     total >= 80 ? "A" :
                                     total >= 70 ? "B+" :
                                     total >= 60 ? "B" :
                                     total >= 50 ? "C" :
                                     total >= 40 ? "D" :
                                     "F";

                    _unitOfWork.Marks.Update(existing);
                }
                else
                {
                    await _unitOfWork.Marks.AddAsync(markEntity);
                }


                var student = await _unitOfWork.Students.GetByIdAsync(m.StudentId);
                if (student != null)
                {
                    student.AverageMarks = Math.Round(total, 1);

                // Convert percentage to 10-point GPA
                student.CurrentGpa = Math.Round(
                    Math.Min(4.0, student.AverageMarks / 25.0),
                    2
                );

                student.RiskLevel = CalculateRiskLevel(student);

                    _unitOfWork.Students.Update(student);
                }
            }
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<bool> AutoCalculateGradesAsync()
        {
            return await Task.FromResult(true);
        }
    }

    public class AnalyticsService : IAnalyticsService
    {
        private readonly IUnitOfWork _unitOfWork;

        public AnalyticsService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<PowerBiSummaryDto> GetPowerBiSummaryAsync()
        {
            var students = (await _unitOfWork.Students.GetAllWithDepartmentAsync()).ToList();

            var allMarks = (await _unitOfWork.Marks.GetAllAsync()).ToList();

            if (!students.Any())
            {
                return new PowerBiSummaryDto(
                    0,
                    0,
                    0,
                    0,
                    "No Students",
                    0,
                    0,
                    "No Students",
                    0,
                    "No Students",

                    new SkillsDto(0, 0, 0, 0, 0, 0),

                    new List<CategoryBreakdownDto>(),

                    new List<StudentRankDto>(),
                    new List<StudentRankDto>(),

                    new List<AttendanceTrendDto>(),
                    new List<MarksDistributionDto>(),
                    new List<DepartmentComparisonDto>(),
                    new List<SubjectPerformanceDto>(),

                    new AiInsightDto(
                        "",
                        "",
                        "",
                        "",
                        ""
                    ),

                    new List<RecentActivityDto>()
                    );
            }

            // Dynamic KPIs
            double averageGpa = Math.Round(students.Average(s => s.CurrentGpa), 2);

            double averageAttendance = Math.Round(students.Average(s => s.AttendancePercentage), 2);

            double passRate = Math.Round(
                students.Count(s => s.AverageMarks >= 40) * 100.0 / students.Count,
                2
            );

            int atRiskCount = students.Count(s =>
                s.RiskLevel == RiskLevel.High ||
                s.RiskLevel == RiskLevel.Critical);

            var topStudent = students
                .OrderByDescending(s => s.AverageMarks)
                .First();

            // Top Performers
            var top = students
                .OrderByDescending(s => s.AverageMarks)
                .Take(5)
                .Select((s, i) => new StudentRankDto(
                    s.Id,
                    i + 1,
                    s.FullName,
                    s.RollNumber,
                    s.Department?.Name ?? "Computer Science",
                    s.AvatarUrl,
                    s.AverageMarks,
                    $"GPA {s.CurrentGpa}"
                ))
                .ToList();

            var highestStudent = students
                .OrderByDescending(s => s.AverageMarks)
                .First();

            var lowestStudent = students
                .OrderBy(s => s.AverageMarks)
                .First();

            // Bottom Performers
            var bottom = students
                .OrderBy(s => s.AverageMarks)
                .Take(5)
                .Select((s, i) => new StudentRankDto(
                    s.Id,
                    i + 1,
                    s.FullName,
                    s.RollNumber,
                    s.Department?.Name ?? "Computer Science",
                    s.AvatarUrl,
                    s.AverageMarks,
                    $"Attendance {s.AttendancePercentage}%"
                ))
                .ToList();

            // Performance Categories
            int excellent = students.Count(s => s.AverageMarks >= 90);
            int good = students.Count(s => s.AverageMarks >= 75 && s.AverageMarks < 90);
            int average = students.Count(s => s.AverageMarks >= 60 && s.AverageMarks < 75);
            int poor = students.Count(s => s.AverageMarks >= 40 && s.AverageMarks < 60);
            int critical = students.Count(s => s.AverageMarks < 40);

            int total = students.Count;

            double avgAttendance = Math.Round(students.Average(s => s.AttendancePercentage), 1);

            var attendanceTrend = new List<AttendanceTrendDto>
        {
            new("Week 1", avgAttendance - 3),
            new("Week 2", avgAttendance - 2),
            new("Week 3", avgAttendance - 2.5),
            new("Week 4", avgAttendance - 1),
            new("Week 5", avgAttendance - 2),
            new("Week 6", avgAttendance - 1),
            new("Week 7", avgAttendance - 0.5),
            new("Week 8", avgAttendance)
        };

            var marksDistribution = new List<MarksDistributionDto>
        {
            new("A", students.Count(s => s.AverageMarks >= 90)),
            new("B", students.Count(s => s.AverageMarks >= 75 && s.AverageMarks < 90)),
            new("C", students.Count(s => s.AverageMarks >= 60 && s.AverageMarks < 75)),
            new("D", students.Count(s => s.AverageMarks < 60))
        };

            var departmentComparison = students
                .GroupBy(s => s.Department?.Name ?? "Unknown")
                .Select(g => new DepartmentComparisonDto(
                    g.Key,
                    Math.Round(g.Average(x => x.AttendancePercentage), 1),
                    Math.Round(g.Average(x => x.AverageMarks), 1)
                ))
                .ToList();

            var subjectPerformance = allMarks
                .GroupBy(m => m.SubjectName)
                .Select(g => new SubjectPerformanceDto(
                    g.Key,
                    Math.Round(g.Average(x => x.TotalScore), 1)
                ))
                .ToList();

            // Generate AI Insight dynamically
            var criticalStudent = students
                .OrderBy(s => s.AttendancePercentage)
                .First();

            AiInsightDto aiInsight;

            if (criticalStudent.AttendancePercentage < 75)
            {
                aiInsight = new AiInsightDto(
                    "Attendance Anomaly Detected",
                    criticalStudent.FullName,
                    $"{criticalStudent.FullName}'s attendance has dropped to {criticalStudent.AttendancePercentage:F1}%.",
                    "Immediate faculty counselling is recommended.",
                    "Critical"
                );
            }
            else
            {
                aiInsight = new AiInsightDto(
                    "Academic Performance Stable",
                    highestStudent.FullName,
                    $"{highestStudent.FullName} is maintaining excellent academic performance.",
                    "Continue current learning strategy.",
                    "Good"
                );
            }

            var activities = new List<RecentActivityDto>
{
    new(
        "Attendance Analysis Completed",
        $"{students.Count} students analyzed successfully.",
        "info",
        "Just now"
    ),

    new(
        "Highest Performer Updated",
        $"{highestStudent.FullName} is currently leading the batch.",
        "success",
        "Today"
    ),

    new(
        "Performance Dashboard Refreshed",
        "Latest academic analytics are now available.",
        "info",
        "Today"
    )
};

            return new PowerBiSummaryDto(
                averageGpa,
                averageAttendance,
                passRate,
                atRiskCount,
                topStudent.FullName,
                topStudent.AverageMarks,
                highestStudent.AverageMarks,
                highestStudent.FullName,
                lowestStudent.AverageMarks,
                lowestStudent.FullName,

                // Keep these static for now until skills become dynamic
                new SkillsDto(88, 82, 90, 85, 91, 84),

                new List<CategoryBreakdownDto>
                {
            new("Excellent (90%+)", excellent,
                $"{Math.Round(excellent * 100.0 / total)}%",
                "bg-emerald-500 text-white"),

            new("Good (75-89%)", good,
                $"{Math.Round(good * 100.0 / total)}%",
                "bg-blue-500 text-white"),

            new("Average (60-74%)", average,
                $"{Math.Round(average * 100.0 / total)}%",
                "bg-indigo-500 text-white"),

            new("Poor (40-59%)", poor,
                $"{Math.Round(poor * 100.0 / total)}%",
                "bg-amber-500 text-slate-900"),

            new("Critical (<40%)", critical,
                $"{Math.Round(critical * 100.0 / total)}%",
                "bg-red-500 text-white font-bold")
                },

                top,
                bottom,
                attendanceTrend,
                marksDistribution,
                departmentComparison,
                subjectPerformance,
                aiInsight,

                activities
            );
        }
    }

    public class PredictionService : IPredictionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFlaskMlApiClient _flaskClient;

        public PredictionService(IUnitOfWork unitOfWork, IFlaskMlApiClient flaskClient)
        {
            _unitOfWork = unitOfWork;
            _flaskClient = flaskClient;
        }

        public async Task<AiPredictionSummaryDto> GetPredictionSummaryAsync()
        {
            var students = (await _unitOfWork.Students.GetAllAsync()).ToList();

            var predictions = students.Select(s => new StudentPredictionDto(
                s.Id,
                s.RollNumber,
                s.FullName,
                s.AvatarUrl,
                s.AttendancePercentage,
                s.CurrentGpa,
                s.PredictedGpa,
                s.PredictedGrade,
                s.RiskLevel.ToString(),
                94.8,

                string.IsNullOrWhiteSpace(s.AiRecommendation)
                    ? s.RiskLevel switch
                    {
                        RiskLevel.Critical =>
                            "Immediate counseling required. Improve attendance and complete remedial assignments.",

                        RiskLevel.High =>
                            "Schedule faculty mentoring and increase classroom participation.",

                        RiskLevel.Medium =>
                            "Monitor progress closely and focus on improving practical performance.",

                        RiskLevel.Low when s.AverageMarks >= 90 =>
                            "Outstanding performance. Recommended for research projects and advanced coursework.",

                        RiskLevel.Low =>
                            "Good academic progress. Continue consistent performance.",

                        _ =>
                            "Continue academic monitoring."
                    }
                    : s.AiRecommendation
            )).ToList();

            return new AiPredictionSummaryDto(
                94.8,
                92.1,
                students.Count(s => s.RiskLevel == RiskLevel.High || s.RiskLevel == RiskLevel.Critical),
                42,
                "Configured via Azure Environment Variable",
                "Live Flask ML Service",
                predictions
            );
        }

        public async Task<bool> RunInferenceAsync()
        {
            var students = await _unitOfWork.Students.GetAllAsync();
            //var settingsList = await _unitOfWork.Settings.GetAllAsync();
            //var endpoint = settingsList.FirstOrDefault()?.FlaskApiEndpoint ?? "http://localhost:5000/api/v1/predict";

            foreach (var s in students)
            {
                var marks = await _unitOfWork.Marks.GetByStudentIdAsync(s.Id);

                var latestMarks = marks
                    .OrderByDescending(m => m.CreatedAt)
                    .FirstOrDefault();

                if (latestMarks == null)
                    continue;

                var prediction = await _flaskClient.PredictStudentPerformanceAsync(
                    s,
                    latestMarks);

                s.PredictedGpa = prediction.PredictedGpa;
                s.PredictedGrade = prediction.PredictedGrade;
                s.RiskLevel = prediction.RiskLevel;
                s.AiRecommendation = prediction.Recommendation;
                _unitOfWork.Students.Update(s);

                await _unitOfWork.Predictions.AddAsync(prediction);
            }

            await _unitOfWork.CompleteAsync();
            return true;
        }

    public class SettingsService : ISettingsService
    {
        private readonly IUnitOfWork _unitOfWork;

        public SettingsService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<SystemSettingDto> GetSettingsAsync()
        {
            var setting = (await _unitOfWork.Settings.GetAllAsync())
                .FirstOrDefault();

            if (setting == null)
            {
                return new SystemSettingDto(
                "",
                "",
                "",
                75,
                "http://localhost:5000/api/v1/predict"
            );
            }

            return new SystemSettingDto(
                setting.InstituteName,
                setting.AccreditationGrade,
                setting.AcademicYear,
                setting.LowAttendanceThreshold,
                setting.FlaskApiEndpoint
            );
        }

        public async Task<bool> UpdateSettingsAsync(SystemSettingDto dto)
        {
            var setting = (await _unitOfWork.Settings.GetAllAsync())
                .FirstOrDefault();

            if (setting == null)
                return false;

            setting.InstituteName = dto.InstituteName;
            setting.AccreditationGrade = dto.AccreditationGrade;
            setting.AcademicYear = dto.AcademicYear;
            setting.LowAttendanceThreshold = dto.LowAttendanceThreshold;
            setting.FlaskApiEndpoint = dto.FlaskApiEndpoint;

            _unitOfWork.Settings.Update(setting);

            await _unitOfWork.CompleteAsync();

            return true;
        }
    }

    public class StudentPortalService : IStudentPortalService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public StudentPortalService(
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<StudentDetailDto?> GetMyProfileAsync(Guid studentId)
        {
            var student = await _unitOfWork
                .Students
                .GetStudentWithDetailsAsync(studentId);

            if (student == null)
                return null;

            return _mapper.Map<StudentDetailDto>(student);
        }

        public async Task<StudentDashboardDto?> GetMyDashboardAsync(Guid studentId)
        {
            var student = await _unitOfWork
                .Students
                .GetStudentWithDetailsAsync(studentId);

            if (student == null)
                return null;

            return new StudentDashboardDto(
                student.FullName,
                student.Department?.Name ?? "",
                student.AvatarUrl,

                student.AttendancePercentage,
                student.AverageMarks,

                student.CurrentGpa,
                student.PredictedGpa,

                student.PredictedGrade,
                student.RiskLevel.ToString(),

                student.AiRecommendation
            );
        }

        public async Task<List<StudentAttendanceDto>> GetMyAttendanceAsync(Guid studentId)
        {
            var student = await _unitOfWork
                .Students
                .GetStudentWithDetailsAsync(studentId);

            if (student == null)
                return new List<StudentAttendanceDto>();

            return student.AttendanceRecords
                .OrderByDescending(a => a.Date)
                .Select(a => new StudentAttendanceDto(
                    a.Date,
                    a.SubjectName,
                    a.Status.ToString()
                ))
                .ToList();
        }

        public async Task<List<StudentMarksDto>> GetMyMarksAsync(Guid studentId)
        {
            var student = await _unitOfWork
                .Students
                .GetStudentWithDetailsAsync(studentId);

            if (student == null)
                return new List<StudentMarksDto>();

            return student.SubjectMarks
                .Select(m => new StudentMarksDto(
                    m.SubjectName,
                    m.AssignmentMarks,
                    m.InternalMarks,
                    m.PracticalMarks,
                    m.FinalExamMarks,
                    m.TotalScore,
                    m.Grade
                ))
                .ToList();
        }

        public async Task<List<StudentPredictionHistoryDto>> GetMyPredictionsAsync(Guid studentId)
        {
            var student = await _unitOfWork
                .Students
                .GetStudentWithDetailsAsync(studentId);

            if (student == null)
                return new List<StudentPredictionHistoryDto>();

            return student.Predictions
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new StudentPredictionHistoryDto(
                    p.CreatedAt,
                    p.PredictedGpa,
                    p.PredictedGrade,
                    p.RiskLevel.ToString(),
                    p.ModelConfidence,
                    p.Recommendation
                ))
                .ToList();
        }
    }


    public class TeacherService : ITeacherService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public TeacherService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TeacherSummaryDto>> GetTeachersAsync()
        {
            var users = await _unitOfWork.Users.FindAsync(
                u => u.Role == UserRole.Teacher);

            return _mapper.Map<IEnumerable<TeacherSummaryDto>>(users);
        }

        public async Task<TeacherDetailDto?> GetTeacherByIdAsync(Guid id)
        {
            var teacher = await _unitOfWork.Users.GetByIdAsync(id);

            if (teacher == null || teacher.Role != UserRole.Teacher)
                return null;

            return _mapper.Map<TeacherDetailDto>(teacher);
        }

        public async Task<TeacherSummaryDto> CreateTeacherAsync(CreateTeacherDto dto)
        {
            // Check if email already exists
            var existingUser = await _unitOfWork.Users.FindAsync(
                u => u.Email == dto.Email);

            if (existingUser.Any())
            {
                throw new InvalidOperationException(
                    "A user with this email already exists.");
            }

            var teacher = new User
            {
                Email = dto.Email,
                FullName = dto.FullName,

                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Teacher@123"),

                Role = UserRole.Teacher,

                Department = dto.Department,

                Title = dto.Title,

                AvatarUrl =
                    $"https://api.dicebear.com/7.x/avataaars/svg?seed={dto.FullName}"
            };

            await _unitOfWork.Users.AddAsync(teacher);

            await _unitOfWork.CompleteAsync();

            return _mapper.Map<TeacherSummaryDto>(teacher);
        }

        public async Task<bool> UpdateTeacherAsync(Guid id, CreateTeacherDto dto)
        {
            var teacher = await _unitOfWork.Users.GetByIdAsync(id);

            if (teacher == null || teacher.Role != UserRole.Teacher)
                return false;

            teacher.FullName = dto.FullName;
            teacher.Email = dto.Email;
            teacher.Department = dto.Department;
            teacher.Title = dto.Title;

            _unitOfWork.Users.Update(teacher);

            await _unitOfWork.CompleteAsync();

            return true;
        }

        public async Task<bool> DeleteTeacherAsync(Guid id)
        {
            var teacher = await _unitOfWork.Users.GetByIdAsync(id);

            if (teacher == null || teacher.Role != UserRole.Teacher)
                return false;

            _unitOfWork.Users.Delete(teacher);

            await _unitOfWork.CompleteAsync();

            return true;
        }

        public async Task<bool> ResetTeacherPasswordAsync(Guid id)
        {
            var teacher = await _unitOfWork.Users.GetByIdAsync(id);

            if (teacher == null || teacher.Role != UserRole.Teacher)
                return false;

            teacher.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword("Teacher@123");

            _unitOfWork.Users.Update(teacher);

            await _unitOfWork.CompleteAsync();

            return true;
        }
    }


    public class AdminService : IAdminService
    {
        private readonly IUnitOfWork _unitOfWork;

        public AdminService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<AdminDashboardDto> GetDashboardAsync()
        {
            var teachers =
                await _unitOfWork.Users.FindAsync(
                    u => u.Role == Domain.Enums.UserRole.Teacher);

            var students =
                await _unitOfWork.Students.GetAllAsync();

            var departments =
                await _unitOfWork.Departments.GetAllAsync();

            var predictions =
                await _unitOfWork.Predictions.GetAllAsync();

            return new AdminDashboardDto
            {
                TotalTeachers = teachers.Count(),

                TotalStudents = students.Count(),

                TotalDepartments = departments.Count(),

                TotalPredictions = predictions.Count(),

                SystemStatus = "Online"
            };
        }
    }


}
