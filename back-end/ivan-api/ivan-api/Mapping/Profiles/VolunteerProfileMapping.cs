using AutoMapper;
using ivan_api.DTOs.VolunteerProfile;
using ivan_api.Models;

namespace ivan_api.Mapping.Profiles
{
    public class VolunteerProfileMapping : Profile
    {
        public VolunteerProfileMapping()
        {
            // List
            CreateMap<VolunteerProfile, VolunteerProfileListDto>()
                .ForMember(d => d.VolunteerId, o => o.MapFrom(s => s.VolunteerId))
                .ForMember(d => d.FullName, o => o.MapFrom(s => s.User.UserProfiles.FirstOrDefault()!.FullName ?? string.Empty))
                .ForMember(d => d.University, o => o.MapFrom(s => s.University))
                .ForMember(d => d.Major, o => o.MapFrom(s => s.Major))
                .ForMember(d => d.YearOfStudy, o => o.MapFrom(s => s.YearOfStudy))
                .ForMember(d => d.VolunteerHours, o => o.MapFrom(s => s.VolunteerHours))
                .ForMember(d => d.Rating, o => o.MapFrom(s => s.Rating));

            // Detail
            CreateMap<VolunteerProfile, VolunteerProfileDetailDto>()
                .ForMember(d => d.VolunteerId, o => o.MapFrom(s => s.VolunteerId))
                .ForMember(d => d.UserId, o => o.MapFrom(s => s.UserId))
                .ForMember(d => d.Email, o => o.MapFrom(s => s.User.Email))
                // UserProfile fields mapping
                .ForMember(d => d.FirstName, o => o.MapFrom(s =>
                    s.User.UserProfiles.FirstOrDefault()!.FirstName))
                .ForMember(d => d.LastName, o => o.MapFrom(s =>
                    s.User.UserProfiles.FirstOrDefault()!.LastName))
                .ForMember(d => d.FullName, o => o.MapFrom(s =>
                    s.User.UserProfiles.FirstOrDefault()!.FullName))
                .ForMember(d => d.PhoneNumber, o => o.MapFrom(s =>
                    s.User.UserProfiles.FirstOrDefault()!.PhoneNumber))
                .ForMember(d => d.DateOfBirth, o => o.MapFrom(s =>
                    s.User.UserProfiles.FirstOrDefault() != null && s.User.UserProfiles.FirstOrDefault()!.DateOfBirth.HasValue 
                        ? s.User.UserProfiles.FirstOrDefault()!.DateOfBirth.Value.ToDateTime(TimeOnly.MinValue)
                        : (DateTime?)null))
                .ForMember(d => d.Gender, o => o.MapFrom(s =>
                    s.User.UserProfiles.FirstOrDefault()!.Gender))
                .ForMember(d => d.Avatar, o => o.MapFrom(s =>
                    s.User.UserProfiles.FirstOrDefault()!.Avatar))
                .ForMember(d => d.Address, o => o.MapFrom(s =>
                    s.User.UserProfiles.FirstOrDefault()!.Address))
                .ForMember(d => d.WardCommune, o => o.MapFrom(s =>
                    s.User.UserProfiles.FirstOrDefault()!.WardCommune))
                .ForMember(d => d.District, o => o.MapFrom(s =>
                    s.User.UserProfiles.FirstOrDefault()!.District))
                .ForMember(d => d.Province, o => o.MapFrom(s =>
                    s.User.UserProfiles.FirstOrDefault()!.Province))
                .ForMember(d => d.PostalCode, o => o.MapFrom(s =>
                    s.User.UserProfiles.FirstOrDefault()!.PostalCode))
                .ForMember(d => d.EmergencyContactName, o => o.MapFrom(s =>
                    s.User.UserProfiles.FirstOrDefault()!.EmergencyContactName))
                .ForMember(d => d.EmergencyContactPhone, o => o.MapFrom(s =>
                    s.User.UserProfiles.FirstOrDefault()!.EmergencyContactPhone))
                // Skills mapping
                .ForMember(d => d.Skills, o => o.MapFrom(s => s.VolunteerSkills));

            // Skills
            CreateMap<VolunteerSkill, VolunteerSkillDto>();
            CreateMap<VolunteerSkillCreateDto, VolunteerSkill>();
            CreateMap<VolunteerSkillUpdateDto, VolunteerSkill>();

            // Create/Update
            CreateMap<VolunteerProfileCreateDto, VolunteerProfile>();
            CreateMap<VolunteerProfileUpdateDto, VolunteerProfile>();

        }
    }
}
