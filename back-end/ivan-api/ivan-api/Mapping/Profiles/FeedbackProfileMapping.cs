using AutoMapper;
using ivan_api.DTOs.Feedback;
using ivan_api.Models;

namespace ivan_api.Mapping.Profiles
{
    public class FeedbackProfileMapping : Profile
    {
        public FeedbackProfileMapping()
        {
            CreateMap<Feedback, FeedbackListDTO>()
                .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Category.CategoryName));
        }
    }
}
