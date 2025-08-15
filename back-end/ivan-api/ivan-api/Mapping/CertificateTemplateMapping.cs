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

            CreateMap<CertificateTemplate, CertificateTemplateUpdateModel>();
            CreateMap<CertificateTemplateUpdateModel, CertificateTemplate>();

            CreateMap<CertificateTemplateInputModel, CertificateTemplateUpdateModel>();
            CreateMap<CertificateTemplateUpdateModel, CertificateTemplateInputModel>();

            CreateMap<CertificateTemplateViewModel, CertificateTemplateUpdateModel>();
            CreateMap<CertificateTemplateUpdateModel, CertificateTemplateViewModel>();
        }
    }
}
