using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ClosedXML.Excel;
using StudentPerformanceAnalytics.Application.Services;
using StudentPerformanceAnalytics.Domain.Interfaces;

namespace StudentPerformanceAnalytics.Infrastructure.ExternalServices
{
    public class ExcelReportService : IExcelReportService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ExcelReportService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<byte[]> GeneratePerformanceReportAsync()
        {
           
            var students = await _unitOfWork.Students.GetAllWithDepartmentAsync();

            
            var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Student Performance");

            
            worksheet.Cell(1, 1).Value = "Student";
            worksheet.Cell(1, 2).Value = "Department";
            worksheet.Cell(1, 3).Value = "Attendance (%)";
            worksheet.Cell(1, 4).Value = "Average Marks";
            worksheet.Cell(1, 5).Value = "Current GPA";
            worksheet.Cell(1, 6).Value = "Predicted GPA";
            worksheet.Cell(1, 7).Value = "Risk Level";

            
            int row = 2;

            foreach (var student in students)
            {
                worksheet.Cell(row, 1).Value = student.FullName;
                worksheet.Cell(row, 2).Value = student.Department?.Name;
                worksheet.Cell(row, 3).Value = student.AttendancePercentage;
                worksheet.Cell(row, 4).Value = student.AverageMarks;
                worksheet.Cell(row, 5).Value = student.CurrentGpa;
                worksheet.Cell(row, 6).Value = student.PredictedGpa;
                worksheet.Cell(row, 7).Value = student.RiskLevel.ToString();

                row++;
            }


            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();

            workbook.SaveAs(stream);

            return stream.ToArray();
        }
    }
}
