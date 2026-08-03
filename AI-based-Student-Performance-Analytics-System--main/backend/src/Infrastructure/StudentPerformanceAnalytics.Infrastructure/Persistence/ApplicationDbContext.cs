using Microsoft.EntityFrameworkCore;
using StudentPerformanceAnalytics.Domain.Entities;

namespace StudentPerformanceAnalytics.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<AttendanceRecord> AttendanceRecords => Set<AttendanceRecord>();
    public DbSet<SubjectMark> SubjectMarks => Set<SubjectMark>();
    public DbSet<AiPrediction> AiPredictions => Set<AiPrediction>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<SystemSetting> SystemSettings => Set<SystemSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Student>()
            .HasOne(s => s.Department)
            .WithMany(d => d.Students)
            .HasForeignKey(s => s.DepartmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<User>()
            .HasOne(u => u.Student)
            .WithOne(s => s.User)
            .HasForeignKey<User>(u => u.StudentId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<AttendanceRecord>()
            .HasOne(a => a.Student)
            .WithMany(s => s.AttendanceRecords)
            .HasForeignKey(a => a.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SubjectMark>()
            .HasOne(m => m.Student)
            .WithMany(s => s.SubjectMarks)
            .HasForeignKey(m => m.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AiPrediction>()
            .HasOne(p => p.Student)
            .WithMany(s => s.Predictions)
            .HasForeignKey(p => p.StudentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
