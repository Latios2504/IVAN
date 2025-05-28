using AutoMapper;
using WebAPI.Data.Entities;
using WebAPI.Models.VolunteerProfile;

namespace WebAPI.Helpers.AutoMapper
{
    public class VolunteerProfileMapping : Profile
    {
        public VolunteerProfileMapping()
        {
            CreateMap<VolunteerProfile, VolunteerProfileViewModel>()
                .ForMember(dest => dest.FullName, opt => opt.Ignore());
            CreateMap<VolunteerProfileViewModel, VolunteerProfile>();

        }
    }
}
