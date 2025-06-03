using AutoMapper;
using System.Threading.Tasks;
using WebAPI.Data.Entities;
using WebAPI.Models.OrganizationProfiles;
using WebAPI.Repository.OrganizationProfiles;

namespace WebAPI.Service.OrganizationProfiles
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
            var org = _mapper.Map<OrganizationProfile>(organizationProfile);
            org.CreatedAt = DateTime.Now;
            org.UpdatedAt = DateTime.Now;

            return await _repository.AddOrganizationProfile(org);
        }
        public async Task<bool> UpdateOrganizationProfile(OrganizationProfileViewModel organizationProfile)
        {
            var existingOrg = await _repository.GetOrganizationProfileById(organizationProfile.Id);
            if(existingOrg == null)
            {
                throw new Exception("OrganizationProfile not found");
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
            if(org == null)
            {
                throw new Exception("OrganizationProfile not found");
            }

            return _mapper.Map<OrganizationProfileViewModel>(org);
        }
    }
}
