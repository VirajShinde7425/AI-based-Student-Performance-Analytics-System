using FluentValidation;
using StudentPerformanceAnalytics.Application.DTOs;

namespace StudentPerformanceAnalytics.Application.Validators;

public class LoginRequestValidator : AbstractValidator<LoginRequestDto>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("A valid institutional email is required.");
        RuleFor(x => x.Password).NotEmpty().WithMessage("Password cannot be empty.");
    }
}

public class CreateStudentValidator : AbstractValidator<CreateStudentDto>
{
    public CreateStudentValidator()
    {
        RuleFor(x => x.RegistrationId)
            .NotEmpty()
            .WithMessage("Registration ID is required.");

        RuleFor(x => x.RollNumber)
            .NotEmpty()
            .WithMessage("Roll Number is required.");

        RuleFor(x => x.FullName)
            .NotEmpty()
            .Length(2, 100)
            .WithMessage("Full Name is required.");

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .WithMessage("A valid institutional email is required.");

        RuleFor(x => x.DepartmentName)
            .NotEmpty()
            .WithMessage("Department is required.");

        RuleFor(x => x.Semester)
            .InclusiveBetween(1, 8)
            .WithMessage("Semester must be between 1 and 8.");

        RuleFor(x => x.Division)
            .NotEmpty()
            .WithMessage("Division is required.");

        RuleFor(x => x.GuardianName)
            .NotEmpty()
            .WithMessage("Guardian Name is required.");

        RuleFor(x => x.GuardianPhone)
            .NotEmpty()
            .WithMessage("Guardian Phone is required.");
    }
}

public class SaveStudentMarkValidator : AbstractValidator<SaveStudentMarkDto>
{
    public SaveStudentMarkValidator()
    {
        RuleFor(x => x.StudentId).NotEmpty();
        RuleFor(x => x.SubjectName).NotEmpty();
        RuleFor(x => x.AssignmentMarks).InclusiveBetween(0, 20);
        RuleFor(x => x.InternalMarks).InclusiveBetween(0, 30);
        RuleFor(x => x.PracticalMarks).InclusiveBetween(0, 20);
        RuleFor(x => x.FinalExamMarks).InclusiveBetween(0, 100);
    }
}
