using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StudentPerformanceAnalytics.Domain.Entities;
using StudentPerformanceAnalytics.Domain.Enums;
using StudentPerformanceAnalytics.Domain.Interfaces;

namespace StudentPerformanceAnalytics.Infrastructure.Persistence;

public class Repository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly ApplicationDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(ApplicationDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(Guid id) => await _dbSet.FindAsync(id);

    public async Task<IEnumerable<T>> GetAllAsync() => await _dbSet.ToListAsync();

    public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate) => await _dbSet.Where(predicate).ToListAsync();

    public async Task AddAsync(T entity) => await _dbSet.AddAsync(entity);

    public void Update(T entity) => _dbSet.Update(entity);

    public void Delete(T entity) => _dbSet.Remove(entity);
}

public class StudentRepository : Repository<Student>, IStudentRepository
{
    public StudentRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<Student>> GetFilteredStudentsAsync(string? searchQuery, string? department, int? semester, string? division, RiskLevel? riskLevel)
    {
        IQueryable<Student> query = _dbSet.Include(s => s.Department);

        if (!string.IsNullOrWhiteSpace(searchQuery))
        {
            var lower = searchQuery.ToLower();
            query = query.Where(s => s.FullName.ToLower().Contains(lower) || s.RollNumber.ToLower().Contains(lower) || s.RegistrationId.ToLower().Contains(lower));
        }

        if (!string.IsNullOrWhiteSpace(department) && department != "All")
        {
            query = query.Where(s => s.Department != null && s.Department.Name == department);
        }

        if (semester.HasValue && semester.Value > 0)
        {
            query = query.Where(s => s.Semester == semester.Value);
        }

        if (!string.IsNullOrWhiteSpace(division) && division != "All")
        {
            query = query.Where(s => s.Division == division);
        }

        if (riskLevel.HasValue)
        {
            query = query.Where(s => s.RiskLevel == riskLevel.Value);
        }

        return await query.ToListAsync();
    }

    public async Task<Student?> GetStudentWithDetailsAsync(Guid id)
    {
        return await _dbSet
            .Include(s => s.Department)
            .Include(s => s.SubjectMarks)
            .Include(s => s.AttendanceRecords)
            .Include(s => s.Predictions)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<IEnumerable<Student>> GetAllWithDepartmentAsync()
    {
        return await _dbSet
            .Include(s => s.Department)
            .ToListAsync();
    }
}

public class AttendanceRepository : Repository<AttendanceRecord>, IAttendanceRepository
{
    public AttendanceRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<AttendanceRecord>> GetByStudentIdAsync(Guid studentId)
    {
        return await _dbSet.Where(a => a.StudentId == studentId).OrderByDescending(a => a.Date).ToListAsync();
    }

    public async Task<IEnumerable<AttendanceRecord>> GetByDateAndSubjectAsync(DateTime date, string subjectName)
    {
        return await _dbSet.Where(a => a.Date.Date == date.Date && a.SubjectName == subjectName).ToListAsync();
    }
}

public class MarksRepository : Repository<SubjectMark>, IMarksRepository
{
    public MarksRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<SubjectMark>> GetByStudentIdAsync(Guid studentId)
    {
        return await _dbSet.Where(m => m.StudentId == studentId).ToListAsync();
    }

    public async Task<IEnumerable<SubjectMark>> GetBySubjectAndExamAsync(string subjectName, string examTerm)
    {
        return await _dbSet.Where(m => m.SubjectName == subjectName && m.ExamTerm == examTerm).ToListAsync();
    }
}

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public IStudentRepository Students { get; }
    public IAttendanceRepository Attendance { get; }
    public IMarksRepository Marks { get; }
    public IRepository<User> Users { get; }
    public IRepository<Department> Departments { get; }
    public IRepository<AiPrediction> Predictions { get; }
    public IRepository<Notification> Notifications { get; }
    public IRepository<SystemSetting> Settings { get; }

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
        Students = new StudentRepository(context);
        Attendance = new AttendanceRepository(context);
        Marks = new MarksRepository(context);
        Users = new Repository<User>(context);
        Departments = new Repository<Department>(context);
        Predictions = new Repository<AiPrediction>(context);
        Notifications = new Repository<Notification>(context);
        Settings = new Repository<SystemSetting>(context);
    }

    public async Task<int> CompleteAsync() => await _context.SaveChangesAsync();

    public void Dispose() => _context.Dispose();
}
