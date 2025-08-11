using AutoMapper;
using ivan_api.DTOs.UserAccount;
using ivan_api.Models;

namespace ivan_api.Mapping.Profiles
{
    public class UserAccountProfile : Profile
    {
        public UserAccountProfile()
        {
            CreateMap<User, UserAccountListDto>()
                .ForMember(dest => dest.FullName,
                    o => o.MapFrom(s => s.UserProfiles != null && s.UserProfiles.Any() 
                        ? (s.UserProfiles.FirstOrDefault()!.FirstName ?? "") + " " + (s.UserProfiles.FirstOrDefault()!.LastName ?? "") 
                        : null))
                .ForMember(dest => dest.RoleName, o => o.MapFrom(s => s.Role != null ? s.Role.RoleName : "Unknown"))
                .ForMember(dest => dest.PhoneNumber, o => o.MapFrom(s => s.UserProfiles != null && s.UserProfiles.Any() ? s.UserProfiles.FirstOrDefault()!.PhoneNumber : null))
                .ForMember(dest => dest.Province, o => o.MapFrom(s => s.UserProfiles != null && s.UserProfiles.Any() ? s.UserProfiles.FirstOrDefault()!.Province : null))
                .ForMember(d => d.Age, o => o.Ignore()); // Ignore Age, tính toán trong Repository

            CreateMap<User, UserAccountDetailDto>()
            // Account Information
            .ForMember(d => d.UserId, o => o.MapFrom(s => s.UserId))
            .ForMember(d => d.Email, o => o.MapFrom(s => s.Email))
            .ForMember(d => d.RoleId, o => o.MapFrom(s => s.RoleId))
            .ForMember(d => d.RoleName, o => o.MapFrom(s => s.Role != null ? s.Role.RoleName : null))
            .ForMember(d => d.RoleDescription, o => o.MapFrom(s => s.Role != null ? s.Role.Description : null))
            .ForMember(d => d.IsActive, o => o.MapFrom(s => s.IsActive ?? false))
            .ForMember(d => d.IsEmailVerified, o => o.MapFrom(s => s.IsEmailVerified ?? false))
            .ForMember(d => d.LastLoginAt, o => o.MapFrom(s => s.LastLoginAt))
            .ForMember(d => d.CreatedAt, o => o.MapFrom(s => s.CreatedAt ?? default))
            .ForMember(d => d.UpdatedAt, o => o.MapFrom(s => s.UpdatedAt ?? default))

            // Profile Information (first profile, safe)
            .ForMember(d => d.ProfileId, o => o.MapFrom(s => s.UserProfiles.Select(p => (int?)p.ProfileId).FirstOrDefault()))
            .ForMember(d => d.FirstName, o => o.MapFrom(s => s.UserProfiles.Select(p => p.FirstName).FirstOrDefault()))
            .ForMember(d => d.LastName, o => o.MapFrom(s => s.UserProfiles.Select(p => p.LastName).FirstOrDefault()))
            .ForMember(d => d.FullName, o => o.MapFrom(s =>
                s.UserProfiles
                 .Select(p => p.FirstName + " " + p.LastName)
                 .FirstOrDefault() ?? string.Empty))
            .ForMember(d => d.PhoneNumber, o => o.MapFrom(s => s.UserProfiles.Select(p => p.PhoneNumber).FirstOrDefault()))
            .ForMember(d => d.DateOfBirth, o => o.MapFrom(s =>
                s.UserProfiles
                 .Select(p => p.DateOfBirth.HasValue
                     ? (DateTime?)p.DateOfBirth.Value.ToDateTime(TimeOnly.MinValue)
                     : null)
                 .FirstOrDefault()))
            .ForMember(d => d.Gender, o => o.MapFrom(s => s.UserProfiles.Select(p => p.Gender).FirstOrDefault()))
            .ForMember(d => d.Avatar, o => o.MapFrom(s => s.UserProfiles.Select(p => p.Avatar).FirstOrDefault()))

            // Address Information
            .ForMember(d => d.Address, o => o.MapFrom(s => s.UserProfiles.Select(p => p.Address).FirstOrDefault()))
            .ForMember(d => d.WardCommune, o => o.MapFrom(s => s.UserProfiles.Select(p => p.WardCommune).FirstOrDefault()))
            .ForMember(d => d.District, o => o.MapFrom(s => s.UserProfiles.Select(p => p.District).FirstOrDefault()))
            .ForMember(d => d.Province, o => o.MapFrom(s => s.UserProfiles.Select(p => p.Province).FirstOrDefault()))
            .ForMember(d => d.PostalCode, o => o.MapFrom(s => s.UserProfiles.Select(p => p.PostalCode).FirstOrDefault()))

            // Emergency Contact
            .ForMember(d => d.EmergencyContactName, o => o.MapFrom(s => s.UserProfiles.Select(p => p.EmergencyContactName).FirstOrDefault()))
            .ForMember(d => d.EmergencyContactPhone, o => o.MapFrom(s => s.UserProfiles.Select(p => p.EmergencyContactPhone).FirstOrDefault()))

            // Computed getters on DTO (Age, FullAddress, StatusDisplay, VerificationDisplay) are auto-handled
            ;

        }
    }
}
