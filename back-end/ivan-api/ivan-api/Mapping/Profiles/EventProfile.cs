using AutoMapper;
using ivan_api.DTOs.EventManage;
using ivan_api.Models;

namespace ivan_api.Mapping.Profiles
{
    public class EventProfile : Profile
    {
        public EventProfile()
        {
            // Entity → DTO
            CreateMap<Event, EventDto>();

            // CreateEventDto → Entity
            CreateMap<CreateEventDto, Event>();

            // UpdateEventDto → Entity (chỉ map những trường khác null)
            CreateMap<UpdateEventDto, Event>()
                .ForAllMembers(opts => opts.Condition((src, _, _, _) => src != null));
        }
    }
}
