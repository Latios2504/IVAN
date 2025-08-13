using AutoMapper;
using ivan_api.DTOs.SupportRequest;
using ivan_api.Models;
using System.Text.Json;

namespace ivan_api.Mapping.Profiles
{
    public class SupportRequestProfile : Profile
    {
        public SupportRequestProfile()
        {
            CreateMap<SupportRequest, SupportRequestDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName))
                .ForMember(dest => dest.AttachmentUrls, opt => opt.MapFrom(src => DeserializeAttachmentUrls(src.AttachmentUrls)));
        }

        private static string[] DeserializeAttachmentUrls(string? attachmentUrls)
        {
            if (string.IsNullOrEmpty(attachmentUrls))
            {
                return Array.Empty<string>();
            }
            try
            {
                return JsonSerializer.Deserialize<string[]>(attachmentUrls) ?? Array.Empty<string>();
            }
            catch (JsonException)
            {
                return Array.Empty<string>();
            }
        }
    }
}
