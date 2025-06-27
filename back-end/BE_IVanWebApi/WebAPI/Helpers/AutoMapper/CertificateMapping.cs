using AutoMapper;
using WebAPI.Data.Entities;
using WebAPI.Models.Certificates;

namespace WebAPI.Helpers.AutoMapper
{
    public class CertificateMapping : Profile
    {
        public CertificateMapping()
        {
            CreateMap<Certificate, CertificateViewModel>();
            CreateMap<CertificateViewModel, Certificate>();

            CreateMap<CertificateInputModel, Certificate>();
            CreateMap<Certificate, CertificateInputModel>();

            CreateMap<Certificate, CertificateInputModel>();
            CreateMap<CertificateInputModel, Certificate>();
        }
    }
}
