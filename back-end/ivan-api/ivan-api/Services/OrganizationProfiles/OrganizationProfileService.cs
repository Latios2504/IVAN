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
        public async Task<OrganizationProfileViewModel> UpdateOrganizationProfile(OrganizationProfileUpdateModel organizationProfile, int orgId)
        {
            var existingOrg = await _repository.GetOrganizationProfileById(orgId);
            if (existingOrg == null)
            {
                throw new Exception("Organization not found");
            }

            _mapper.Map(organizationProfile, existingOrg);
            existingOrg.UpdatedAt = DateTime.Now;
            
            var updateResult = await _repository.UpdateOrganizationProfile(existingOrg);
            if (!updateResult)
            {
                throw new Exception("Failed to update organization profile");
            }

            // Return the updated profile data
            return await GetOrganizationProfileById(existingOrg.UserId);
        }
        public async Task<IEnumerable<OrganizationProfileViewModel>> ListOrganizationProfile(OrganizationProfileFilterModel filter)
        {
            var orgs = await _repository.ListOrganizationProfile(filter);
            return _mapper.Map<IEnumerable<OrganizationProfileViewModel>>(orgs);
        }
        public async Task<OrganizationProfileViewModel> GetOrganizationProfileById(int userId)
        {
            var org = await _repository.GetOrganizationProfileById(userId);
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

        public async Task<int> GetLastId() => await _repository.GetLastId();
    }
}
