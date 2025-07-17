using AutoMapper;
using System.Threading.Tasks;
using ivan_api.Models;
using ivan_api.DTOs.OrganizationProfiles;
using ivan_api.Repository.OrganizationProfiles;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.OrganizationProfiles
{
    public class OrganizationProfileService : IOrganizationProfileService
    {
        private readonly IOrganizationProfileRepository _repository;
        private readonly IMapper _mapper;

        public OrganizationProfileService(IOrganizationProfileRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<bool> AddOrganizationProfile(OrganizationProfileInputModel organizationProfile)
        {
            var org = _mapper.Map<Organization>(organizationProfile);
            org.CreatedAt = DateTime.Now;
            org.UpdatedAt = DateTime.Now;

            return await _repository.AddOrganizationProfile(org);
        }
        public async Task<bool> UpdateOrganizationProfile(OrganizationProfileUpdateModel organizationProfile, int orgId)
        {
            var existingOrg = await _repository.GetOrganizationProfileById(orgId);
            if (existingOrg == null)
            {
                throw new Exception("Organization not found");
            }

            _mapper.Map(organizationProfile, existingOrg);
            existingOrg.UpdatedAt = DateTime.Now;
            return await _repository.UpdateOrganizationProfile(existingOrg);
        }
        public async Task<IEnumerable<OrganizationProfileViewModel>> ListOrganizationProfile(OrganizationProfileFilterModel filter)
        {
            var orgs = await _repository.ListOrganizationProfile(filter);
            return _mapper.Map<IEnumerable<OrganizationProfileViewModel>>(orgs);
        }
        public async Task<OrganizationProfileViewModel> GetOrganizationProfileById(int id)
        {
            var org = await _repository.GetOrganizationProfileById(id);
            if (org == null)
            {
                throw new Exception("Organization not found");
            }

            return _mapper.Map<OrganizationProfileViewModel>(org);
        }

        public async Task<PagedResultDto<OrganizationProfileViewModel>> GetList(int pageNumber, int pageSize)
        {
            return await _repository.GetOrganizationProfilesAsync(pageNumber, pageSize);
        }
    }
}
