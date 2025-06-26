using AutoMapper;
using ivan_api.DTOs.CoordinatorTask;
using ivan_api.Models;

namespace ivan_api.Mapping.Profiles
{
    public class CoordinatorTaskProfile : Profile
    {
        public CoordinatorTaskProfile() {
            // Map entity -> DTO (response)
            CreateMap<CoordinatorTask, CoordinatorTaskDto>()
                .ForMember(dest => dest.CoordinatorName, opt => opt.MapFrom(src => src.Coordinator != null ? src.Coordinator.UserProfiles.FirstOrDefault()!.FullName : null))
                .ForMember(dest => dest.EventName, opt => opt.MapFrom(src => src.Event != null ? src.Event.EventName : null));

            // Map DTO -> entity (create)
            CreateMap<CoordinatorTaskCreateDto, CoordinatorTask>();

            // Map DTO -> entity (update, chỉ map nếu != null)
            CreateMap<CoordinatorTaskUpdateDto, CoordinatorTask>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
