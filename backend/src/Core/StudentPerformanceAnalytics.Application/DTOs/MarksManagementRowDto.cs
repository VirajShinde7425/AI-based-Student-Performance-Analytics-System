public record MarksManagementRowDto(
    Guid StudentId,
    string RollNumber,
    string FullName,
    string DepartmentName,
    string AvatarUrl,

    string SubjectName,
    string ExamTerm,

    double AssignmentMarks,
    double InternalMarks,
    double PracticalMarks,
    double FinalExamMarks,

    double TotalScore,
    string Grade
);
