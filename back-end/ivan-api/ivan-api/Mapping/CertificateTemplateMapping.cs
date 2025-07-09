using AutoMapper;
using ivan_api.Models;
using ivan_api.DTOs.CertificateTemplates;

namespace ivan_api.Mapping
{
    public class CertificateTemplateMapping : Profile
    {
        public CertificateTemplateMapping()
        {
            CreateMap<CertificateTemplate, CertificateTemplateViewModel>();
            CreateMap<CertificateTemplateViewModel, CertificateTemplate>();

            CreateMap<CertificateTemplateInputModel, CertificateTemplate>();
            CreateMap<CertificateTemplate, CertificateTemplateInputModel>();

            CreateMap<CertificateTemplate, CertificateTemplateInputModel>();
            CreateMap<CertificateTemplateInputModel, CertificateTemplate>();
        }
    }
}
