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
                    o => o.MapFrom(s => s.UserProfiles != null ? s.UserProfiles.FirstOrDefault()!.FirstName + " " + s.UserProfiles.FirstOrDefault()!.LastName : "Unknown"))
                .ForMember(dest => dest.RoleName, o => o.MapFrom(s => s.Role != null ? s.Role.RoleName : "Unknown"))
                .ForMember(dest => dest.PhoneNumber, o => o.MapFrom(s => s.UserProfiles != null ? s.UserProfiles.FirstOrDefault()!.PhoneNumber : "Unknown"))
                .ForMember(dest => dest.Province, o => o.MapFrom(s => s.UserProfiles != null ? s.UserProfiles.FirstOrDefault()!.Province : "Unknown"))
                .ForMember(d => d.Age, o => o.Ignore()); // Ignore Age, tính toán trong Repository

        }
    }
}
