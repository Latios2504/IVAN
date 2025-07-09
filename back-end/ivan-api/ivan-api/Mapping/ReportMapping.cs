using AutoMapper;
using ivan_api.Models;
using ivan_api.DTOs.Reports;

namespace ivan_api.Mapping
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
