using AutoMapper;
using AutoMapper.QueryableExtensions;
using DocumentFormat.OpenXml.Office2010.Excel;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.PartnerCollaboration;
using ivan_api.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Repository.PartnerCollaborationRepo
{
    public class PartnerCollaborationRepository : IPartnerCollaborationRepository
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly IMapper _mapper;
        public PartnerCollaborationRepository(VolunteerManagementSystemContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        public async Task<int> CreateCollaboration(PartnerCollaboration newPC)
        {
            var existingCollaboration = await _context.PartnerCollaborations
                .Where(pc => pc.OrganizationId == newPC.OrganizationId && pc.PartnerId == newPC.PartnerId 
                    && pc.CollaborationName.ToLower().Equals(newPC.CollaborationName.ToLower()))
                .FirstOrDefaultAsync();
            if (existingCollaboration != null)
            {
                throw new Exception("Đã tồn tại hợp tác: "+newPC.CollaborationName);
            }

            _context.PartnerCollaborations.Add(newPC);
            await _context.SaveChangesAsync();
            return newPC.CollaborationId;
        }

        public async Task<CollaborationDetailDto?> GetCollaborationDetailAsync(int collaborationId)
        {
            var dto = await _context.PartnerCollaborations
                .Include(pc => pc.Partner)
                .Include(pc => pc.Organization)
                .Where(pc => pc.CollaborationId == collaborationId)
                .ProjectTo<CollaborationDetailDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
            if (dto is null)
                throw new Exception($"Không tìm thấy collaboration với ID {collaborationId}");
            return dto;
        }

        public async Task<PagedResultDto<CollaborationViewList>> GetPartnerCollaborationsAsync(int PageNumber, int PageSize)
        {
            var query = _context.PartnerCollaborations
                .Include(pc => pc.Organization)
                .Include(pc => pc.Partner)
                .Include(pc => pc.Type)
                .AsQueryable();

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .ProjectTo<CollaborationViewList>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return new PagedResultDto<CollaborationViewList>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = PageNumber,
                PageSize = PageSize
            };
        }
    
    
    }
}
