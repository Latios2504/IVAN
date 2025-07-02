using AutoMapper;
using WebAPI.Data.Entities;
using WebAPI.Models.Reports;

namespace WebAPI.Helpers.AutoMapper
{
    public class ReportMapping : Profile
    {
        public ReportMapping()
        {
            CreateMap<Report, ReportViewModel>();
            CreateMap<ReportViewModel, Report>();

            CreateMap<ReportInputModel, ReportViewModel>();
            CreateMap<ReportViewModel, ReportInputModel>();

            CreateMap<Report, ReportInputModel>();
            CreateMap<ReportInputModel, Report>();
        }
    }
}
