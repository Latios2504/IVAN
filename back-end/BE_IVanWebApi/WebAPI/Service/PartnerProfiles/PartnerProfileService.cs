using AutoMapper;
using System.Threading.Tasks;
using WebAPI.Data.Entities;
using WebAPI.Models.PartnerProfiles;
using WebAPI.Repository.PartnerProfiles;

namespace WebAPI.Service.PartnerProfiles
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

        public async Task<bool> AddPartnerProfile(PartnerProfileInputModel partnerProfileInputModel)
        {
            var par = _mapper.Map<Partner>(partnerProfileInputModel);
            par.CreatedAt = DateTime.Now;
            par.UpdatedAt = DateTime.Now;

            return await _repository.AddPartnerProfile(par);
        }
        public async Task<bool> UpdatePartnerProfile(PartnerProfileViewModel partnerProfileViewModel)
        {
            var existingPar = await _repository.GetPartnerProfileById(partnerProfileViewModel.PartnerId);
            if(existingPar == null)
            {
                throw new Exception("Partner not found");
            }

            _mapper.Map(partnerProfileViewModel, existingPar);
            existingPar.UpdatedAt = DateTime.Now;
            return await _repository.UpdatePartnerProfile(existingPar);
        }
        public async Task<IEnumerable<PartnerProfileViewModel>> ListPartnerProfile(PartnerProfileFilterModel filter)
        {
            var pars = await _repository.ListPartnerProfile(filter);
            return _mapper.Map<IEnumerable<PartnerProfileViewModel>>(pars);
        }
        public async Task<PartnerProfileViewModel> GetPartnerProfileById(int id)
        {
            var par = await _repository.GetPartnerProfileById(id);
            if(par == null)
            {
                throw new Exception("Partner not found");
            }

            return _mapper.Map<PartnerProfileViewModel>(par);
        }
    }
}
