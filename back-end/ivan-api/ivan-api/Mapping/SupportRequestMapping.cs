using AutoMapper;
using ivan_api.DTOs.SupportRequest;
using ivan_api.Models;

namespace ivan_api.Mapping
{
    public class SupportRequestMapping : Profile
    {
        public SupportRequestMapping()
        {
            CreateMap<SupportCategory, SupportCategoryDTO>();
            CreateMap<SupportRequestCreateDTO, SupportRequest>();
            CreateMap<SupportRequest, SupportRequestResponseDTO>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserProfiles.FirstOrDefault() != null ? src.User.UserProfiles.FirstOrDefault()!.FullName : src.User.Email))
                .ForMember(dest => dest.UserEmail, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName))
                .ForMember(dest => dest.AssignedToName, opt => opt.MapFrom(src => src.AssignedToNavigation != null ? (src.AssignedToNavigation.UserProfiles.FirstOrDefault() != null ? src.AssignedToNavigation.UserProfiles.FirstOrDefault()!.FullName : src.AssignedToNavigation.Email) : null))
                .ForMember(dest => dest.ResolvedByName, opt => opt.MapFrom(src => src.ResolvedByNavigation != null ? (src.ResolvedByNavigation.UserProfiles.FirstOrDefault() != null ? src.ResolvedByNavigation.UserProfiles.FirstOrDefault()!.FullName : src.ResolvedByNavigation.Email) : null))
                .ForMember(dest => dest.AttachmentUrls, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.AttachmentUrls) ? src.AttachmentUrls.Split(new char[] { ',' }).ToList() : new List<string>()));

            CreateMap<SupportRequestComment, SupportRequestCommentDTO>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserProfiles.FirstOrDefault() != null ? src.User.UserProfiles.FirstOrDefault()!.FullName : src.User.Email))
                .ForMember(dest => dest.AttachmentUrls, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.AttachmentUrls) ? src.AttachmentUrls.Split(new char[] { ',' }).ToList() : new List<string>()));
        }
    }
}
