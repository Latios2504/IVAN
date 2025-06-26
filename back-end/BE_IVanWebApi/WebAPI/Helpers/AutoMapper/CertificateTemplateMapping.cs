using AutoMapper;
using WebAPI.Data.Entities;
using WebAPI.Models.CertificateTemplates;

namespace WebAPI.Helpers.AutoMapper
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
