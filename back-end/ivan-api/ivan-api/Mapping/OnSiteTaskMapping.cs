using AutoMapper;
using ivan_api.Models;
using ivan_api.DTOs.OnSiteTasks;

namespace ivan_api.Mapping
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

            CreateMap<OnSiteTask, OnSiteTaskUpdateModel>();
            CreateMap<OnSiteTaskUpdateModel, OnSiteTask>();

            CreateMap<OnSiteTaskInputModel, OnSiteTaskUpdateModel>();
            CreateMap<OnSiteTaskUpdateModel, OnSiteTaskInputModel>();

            CreateMap<OnSiteTaskViewModel, OnSiteTaskUpdateModel>();
            CreateMap<OnSiteTaskUpdateModel, OnSiteTaskViewModel>();
        }
    }
}
