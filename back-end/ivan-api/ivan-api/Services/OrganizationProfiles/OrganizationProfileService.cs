using AutoMapper;
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

        public async Task<bool> AddOrganizationProfile(OrganizationProfileCreateDto organizationProfile)
        {
            var org = _mapper.Map<Organization>(organizationProfile);
            org.CreatedAt = DateTime.Now;
            org.UpdatedAt = DateTime.Now;

            return await _repository.AddOrganizationProfile(org);
        }
        public async Task<bool> UpdateOrganizationProfile(OrganizationProfileUpdateDto organizationProfile, int userId)
        {
            var existingOrg = await _repository.GetOrganizationProfileById(userId);
            if (existingOrg == null)
            {
                throw new Exception("Organization not found");
            }

            _mapper.Map(organizationProfile, existingOrg);
            existingOrg.UpdatedAt = DateTime.Now;
            return await _repository.UpdateOrganizationProfile(existingOrg);
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

        #region Public Content Methods

        public async Task<PagedResultDto<PublicOrganizationDTO>> GetPublicOrganizationsAsync(PublicOrganizationFiltersDTO filters)
        {
            return await _repository.GetPublicOrganizationsAsync(filters);
        }

        public async Task<PublicOrganizationDTO?> GetPublicOrganizationAsync(int id)
        {
            return await _repository.GetPublicOrganizationAsync(id);
        }

        #endregion

        #region Lookup Methods

        public async Task<IEnumerable<OrganizationTypeDto>> GetAllOrganizationTypesAsync()
        {
            var organizationTypes = await _repository.GetAllOrganizationTypesAsync();
            return _mapper.Map<IEnumerable<OrganizationTypeDto>>(organizationTypes);
        }

        #endregion
    }
}
