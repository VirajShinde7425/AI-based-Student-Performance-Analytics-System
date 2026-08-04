using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StudentPerformanceAnalytics.Domain.Entities;
using StudentPerformanceAnalytics.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using BCrypt.Net;

namespace StudentPerformanceAnalytics.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedDataAsync(ApplicationDbContext context)
    {
        if (context.Users.Any()) return; // Already seeded

        var hasher = new PasswordHasher<User>();

        // Seed Users
        var teacher = new User
        {
            Email = "sarah.jenkins@institution.edu",
            FullName = "Prof. Sarah Jenkins",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Teacher@123"),
            Role = UserRole.Teacher,
            Department = "Computer Science",
            Title = "Senior Associate Professor",
            AvatarUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
        };


        var admin = new User
        {
            Email = "admin@institution.edu",
            FullName = "Dr. Robert Vance",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = UserRole.Admin,
            Department = "Academic Affairs",
            Title = "Dean of Academic Affairs",
            AvatarUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
        };


        await context.Users.AddRangeAsync(teacher, admin);
        await context.SaveChangesAsync();

        // Seed Departments
        var csDept = new Department { Name = "Computer Science", Code = "CS", HeadOfDepartment = "Prof. Sarah Jenkins" };
        var aiDept = new Department { Name = "Artificial Intelligence", Code = "AI", HeadOfDepartment = "Dr. Alan Turing" };
        var dsDept = new Department { Name = "Data Science", Code = "DS", HeadOfDepartment = "Dr. Grace Hopper" };
        var cyDept = new Department { Name = "Cyber Security", Code = "CY", HeadOfDepartment = "Prof. Kevin Mitnick" };
        var itDept = new Department { Name = "Information Technology", Code = "IT", HeadOfDepartment = "Dr. Linus Torvalds" };

        await context.Departments.AddRangeAsync(csDept, aiDept, dsDept, cyDept, itDept);
        await context.SaveChangesAsync();

//        // Seed Students
//        var s1 = new Student
//        {
//            RegistrationId = "STU-2024-001",
//            RollNumber = "CS2401",
//            FullName = "Aarav Sharma",
//            Email = "aarav.sharma@institution.edu",
//            AvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
//            DepartmentId = csDept.Id,
//            Semester = 6,
//            Division = "A",
//            AttendancePercentage = 94.5,
//            AverageMarks = 91.2,
//            CurrentGpa = 3.92,
//            PredictedGpa = 3.95,
//            PredictedGrade = "A+",
//            RiskLevel = RiskLevel.Low,
//            Status = AcademicStatus.Active,
//            GuardianName = "Rajesh Sharma",
//            GuardianPhone = "+91 98765 43210",
//            AiRecommendation = "Excellent academic trajectory. Recommended for advanced AI research honors."
//        };

//        var s2 = new Student
//        {
//            RegistrationId = "STU-2024-002",
//            RollNumber = "AI2405",
//            FullName = "Rohan Varma",
//            Email = "rohan.v@institution.edu",
//            AvatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
//            DepartmentId = aiDept.Id,
//            Semester = 6,
//            Division = "B",
//            AttendancePercentage = 64.0,
//            AverageMarks = 52.4,
//            CurrentGpa = 2.15,
//            PredictedGpa = 1.95,
//            PredictedGrade = "F",
//            RiskLevel = RiskLevel.Critical,
//            Status = AcademicStatus.AtRisk,
//            GuardianName = "Sanjay Varma",
//            GuardianPhone = "+91 98123 45678",
//            AiRecommendation = "High academic drop risk detected. Severe attendance drop in Deep Learning. Immediate counseling required."
//        };

//        var s3 = new Student
//        {
//            RegistrationId = "STU-2024-005",
//            RollNumber = "CY2403",
//            FullName = "Priya Nair",
//            Email = "priya.nair@institution.edu",
//            AvatarUrl = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
//            DepartmentId = cyDept.Id,
//            Semester = 6,
//            Division = "A",
//            AttendancePercentage = 96.0,
//            AverageMarks = 94.8,
//            CurrentGpa = 3.98,
//            PredictedGpa = 4.00,
//            PredictedGrade = "A+",
//            RiskLevel = RiskLevel.Low,
//            Status = AcademicStatus.Active,
//            GuardianName = "Raman Nair",
//            GuardianPhone = "+91 97111 22334",
//            AiRecommendation = "Rank 1 candidate in Cyber Security department. Outstanding ethical hacking lab scores."
//        };
//        await context.SaveChangesAsync();

//        await context.SubjectMarks.AddRangeAsync(

//    new SubjectMark
//    {
//        StudentId = s1.Id,
//        SubjectName = "Machine Learning",
//        Semester = 6,
//        ExamTerm = "End Semester Final Exam",
//        AssignmentMarks = 18,
//        InternalMarks = 27,
//        PracticalMarks = 18,
//        FinalExamMarks = 86,
//        TotalScore = 87.6,
//        Grade = "A"
//    },

//    new SubjectMark
//    {
//        StudentId = s2.Id,
//        SubjectName = "Machine Learning",
//        Semester = 6,
//        ExamTerm = "End Semester Final Exam",
//        AssignmentMarks = 12,
//        InternalMarks = 18,
//        PracticalMarks = 15,
//        FinalExamMarks = 54,
//        TotalScore = 58.2,
//        Grade = "C"
//    },

//    new SubjectMark
//    {
//        StudentId = s3.Id,
//        SubjectName = "Machine Learning",
//        Semester = 6,
//        ExamTerm = "End Semester Final Exam",
//        AssignmentMarks = 20,
//        InternalMarks = 30,
//        PracticalMarks = 20,
//        FinalExamMarks = 96,
//        TotalScore = 97.6,
//        Grade = "A+"
//    }

//);

//        await context.SaveChangesAsync();



        // Seed Notifications & System Setting
        await context.Notifications.AddRangeAsync(
            new Notification { Title = "Attendance Threshold Warning", Message = "3 students in AI Dept dropped below 75% attendance.", Type = "warning", TimeAgo = "10 mins ago" },
            new Notification { Title = "Mid-Term Marks Uploaded", Message = "Prof. Sarah uploaded marks for Machine Learning.", Type = "info", TimeAgo = "1 hour ago" },
            new Notification { Title = "AI Model Prediction Complete", Message = "ML API updated predictions for 1,280 students.", Type = "success", TimeAgo = "3 hours ago" }
        );

        await context.SystemSettings.AddAsync(new SystemSetting());
        await context.SaveChangesAsync();
    }
}
