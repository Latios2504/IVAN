using AutoMapper;
using WebAPI.Data.Entities;
using WebAPI.Models.OnSiteTasks;

namespace WebAPI.Helpers.AutoMapper
{
    public class OnSiteTaskMapping : Profile
    {
        public OnSiteTaskMapping()
        {
            CreateMap<OnSiteTask, OnSiteTaskViewModel>();
            CreateMap<OnSiteTaskViewModel, OnSiteTask>();

            CreateMap<OnSiteTaskInputModel, OnSiteTask>();
            CreateMap<OnSiteTask, OnSiteTaskInputModel>();

            CreateMap<OnSiteTask, OnSiteTaskInputModel>();
            CreateMap<OnSiteTaskInputModel, OnSiteTask>();
        }
    }
}
