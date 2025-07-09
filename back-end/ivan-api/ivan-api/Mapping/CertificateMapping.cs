using AutoMapper;
using ivan_api.Models;
using ivan_api.DTOs.Certificates;

namespace ivan_api.Mapping
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
