using AutoMapper;
using ivan_api.DTOs.AdminProfile;
using ivan_api.Models;

namespace ivan_api.Mapping
{
    public class AdminProfileMapping : Profile
    {
        public AdminProfileMapping()
        {
            // User (+ UserProfiles.FirstOrDefault) -> AdminProfileViewModel
            CreateMap<User, AdminProfileViewModel>()
                .ForMember(d => d.UserId, o => o.MapFrom(s => s.UserId))
                .ForMember(d => d.Email, o => o.MapFrom(s => s.Email))
                .ForMember(d => d.FirstName, o => o.MapFrom(s => s.UserProfiles.FirstOrDefault().FirstName))
                .ForMember(d => d.LastName, o => o.MapFrom(s => s.UserProfiles.FirstOrDefault().LastName))
                .ForMember(d => d.FullName, o => o.MapFrom(s => s.UserProfiles.FirstOrDefault().FullName))
                .ForMember(d => d.PhoneNumber, o => o.MapFrom(s => s.UserProfiles.FirstOrDefault().PhoneNumber))
                .ForMember(d => d.DateOfBirth, o => o.MapFrom(s =>
                    s.UserProfiles.FirstOrDefault().DateOfBirth.HasValue
                        ? s.UserProfiles.FirstOrDefault().DateOfBirth.Value.ToDateTime(TimeOnly.MinValue)
                        : (DateTime?)null))
                .ForMember(d => d.Gender, o => o.MapFrom(s => s.UserProfiles.FirstOrDefault().Gender))
                .ForMember(d => d.Avatar, o => o.MapFrom(s => s.UserProfiles.FirstOrDefault().Avatar))
                .ForMember(d => d.Address, o => o.MapFrom(s => s.UserProfiles.FirstOrDefault().Address))
                .ForMember(d => d.WardCommune, o => o.MapFrom(s => s.UserProfiles.FirstOrDefault().WardCommune))
                .ForMember(d => d.District, o => o.MapFrom(s => s.UserProfiles.FirstOrDefault().District))
                .ForMember(d => d.Province, o => o.MapFrom(s => s.UserProfiles.FirstOrDefault().Province))
                .ForMember(d => d.PostalCode, o => o.MapFrom(s => s.UserProfiles.FirstOrDefault().PostalCode))
                .ForMember(d => d.EmergencyContactName, o => o.MapFrom(s => s.UserProfiles.FirstOrDefault().EmergencyContactName))
                .ForMember(d => d.EmergencyContactPhone, o => o.MapFrom(s => s.UserProfiles.FirstOrDefault().EmergencyContactPhone))
                .ForMember(d => d.CreatedAt, o => o.MapFrom(s => s.UserProfiles.FirstOrDefault().CreatedAt))
                .ForMember(d => d.UpdatedAt, o => o.MapFrom(s => s.UserProfiles.FirstOrDefault().UpdatedAt));
        }
    }
}
