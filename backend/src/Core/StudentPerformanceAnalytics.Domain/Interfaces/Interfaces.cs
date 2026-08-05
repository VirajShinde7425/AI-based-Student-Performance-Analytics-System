using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using StudentPerformanceAnalytics.Domain.Entities;
using StudentPerformanceAnalytics.Domain.Enums;


namespace StudentPerformanceAnalytics.Domain.Interfaces;

public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    Task AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
}

public interface IStudentRepository : IRepository<Student>
{
    Task<IEnumerable<Student>> GetFilteredStudentsAsync(string? searchQuery, string? department, int? semester, string? division, RiskLevel? riskLevel);
    Task<Student?> GetStudentWithDetailsAsync(Guid id);

    Task<IEnumerable<Student>> GetAllWithDepartmentAsync();
}

public interface IAttendanceRepository : IRepository<AttendanceRecord>
{
    Task<IEnumerable<AttendanceRecord>> GetByStudentIdAsync(Guid studentId);
    Task<IEnumerable<AttendanceRecord>> GetByDateAndSubjectAsync(DateTime date, string subjectName);
}

public interface IMarksRepository : IRepository<SubjectMark>
{
    Task<IEnumerable<SubjectMark>> GetByStudentIdAsync(Guid studentId);
    Task<IEnumerable<SubjectMark>> GetBySubjectAndExamAsync(string subjectName, string examTerm);
}

public interface IUnitOfWork : IDisposable
{
    IStudentRepository Students { get; }
    IAttendanceRepository Attendance { get; }
    IMarksRepository Marks { get; }
    IRepository<User> Users { get; }
    IRepository<Department> Departments { get; }
    IRepository<AiPrediction> Predictions { get; }
    IRepository<Notification> Notifications { get; }
    IRepository<SystemSetting> Settings { get; }
    Task<int> CompleteAsync();
}

public interface IJwtService
{
    string GenerateToken(User user);
}

public interface IFlaskMlApiClient
{
    Task<AiPrediction> PredictStudentPerformanceAsync(
    Student student,
    SubjectMark marks);
}


