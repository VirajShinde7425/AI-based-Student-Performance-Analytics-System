using AutoMapper;
using StudentPerformanceAnalytics.Application.DTOs;
using StudentPerformanceAnalytics.Domain.Entities;

namespace StudentPerformanceAnalytics.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Student, StudentSummaryDto>()
            .ForMember(dest => dest.DepartmentName, opt => opt.MapFrom(src => src.Department != null ? src.Department.Name : string.Empty))
            .ForMember(dest => dest.RiskLevel, opt => opt.MapFrom(src => src.RiskLevel.ToString()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

        CreateMap<Student, StudentDetailDto>()
            .ForMember(dest => dest.DepartmentName, opt => opt.MapFrom(src => src.Department != null ? src.Department.Name : string.Empty))
            .ForMember(dest => dest.RiskLevel, opt => opt.MapFrom(src => src.RiskLevel.ToString()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
        //.ForMember(dest => dest.Skills, opt => opt.MapFrom(src => new SkillsDto(
        //   src.SkillCoding, src.SkillTheory, src.SkillLab, src.SkillAptitude, src.SkillProjects, src.SkillSoftSkills
        //)))
        //.ForMember(dest => dest.AttendanceHistory, opt => opt.MapFrom(src => new List<double> { 90, 92, 94, 91, 93, src.AttendancePercentage }))
        //.ForMember(dest => dest.GpaHistory, opt => opt.MapFrom(src => new List<double> { 3.5, 3.6, 3.7, src.CurrentGpa }));


        CreateMap<User, TeacherSummaryDto>();

        CreateMap<User, TeacherDetailDto>();

        CreateMap<SubjectMark, SubjectMarkDto>();

        CreateMap<SystemSetting, SystemSettingDto>();
    }
}
