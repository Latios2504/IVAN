using AutoMapper;
using ivan_api.Models;
using ivan_api.DTOs.PartnerProfiles;
using ivan_api.Repository.PartnerProfiles;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.PartnerProfiles
{
    public class PartnerProfileService : IPartnerProfileService
    {
        private readonly IPartnerProfileRepository _repository;
        private readonly IMapper _mapper;

        public PartnerProfileService(IPartnerProfileRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<bool> AddPartnerProfile(PartnerProfileCreateDto partnerProfileInputModel)
        {
            var par = _mapper.Map<Partner>(partnerProfileInputModel);
            par.CreatedAt = DateTime.Now;
            par.UpdatedAt = DateTime.Now;

            return await _repository.AddPartnerProfile(par);
        }
        public async Task<bool> UpdatePartnerProfile(PartnerProfileUpdateDto partnerProfileUpdateModel, int userId)
        {
            var existingPar = await _repository.GetPartnerProfileById(userId);
            if (existingPar == null)
            {
                throw new Exception("Partner not found");
            }

            _mapper.Map(partnerProfileUpdateModel, existingPar);
            existingPar.UpdatedAt = DateTime.Now;
            return await _repository.UpdatePartnerProfile(existingPar);
        }
        public async Task<PartnerProfileViewModel> GetPartnerProfileById(int userId)
        {
            var par = await _repository.GetPartnerProfileById(userId);
            if (par == null)
            {
                throw new Exception("Partner not found");
            }

            return _mapper.Map<PartnerProfileViewModel>(par);
        }

        public async Task<PagedResultDto<PartnerProfileViewModel>> GetList(int pageNumber, int pageSize)
        {
            return await _repository.GetPartnerProfilesAsync(pageNumber, pageSize);
        }

        public async Task<int> GetLastId() => await _repository.GetLastId();

        #region Public Content Methods

        public async Task<PagedResultDto<PublicPartnerDTO>> GetPublicPartnersAsync(PublicPartnerFiltersDTO filters)
        {
            return await _repository.GetPublicPartnersAsync(filters);
        }

        public async Task<PublicPartnerDTO?> GetPublicPartnerAsync(int id)
        {
            return await _repository.GetPublicPartnerAsync(id);
        }

        #endregion

        #region Lookup Methods

        public async Task<IEnumerable<PartnerIndustryDto>> GetAllPartnerIndustriesAsync()
        {
            var partnerIndustries = await _repository.GetAllPartnerIndustriesAsync();
            return _mapper.Map<IEnumerable<PartnerIndustryDto>>(partnerIndustries);
        }

        #endregion
    }
}
