using AutoMapper;
using AutoMapper.QueryableExtensions;
using ivan_api.DTOs.AdminProfile;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Repository.AdminProfileRepo
{
    public class AdminProfileRepository : IAdminProfileRepository
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly IMapper _mapper;

        public AdminProfileRepository(VolunteerManagementSystemContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<AdminProfileViewModel?> GetByUserIdAsync(int userId)
        {
            // Load User + UserProfiles -> map về VM
            return await _context.Users
                .Include(u => u.UserProfiles)
                .Where(u => u.UserId == userId)
                .ProjectTo<AdminProfileViewModel>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> UpsertUserProfileAsync(int userId, AdminProfileUpdateDto dto)
        {
            var user = await _context.Users
                .Include(u => u.UserProfiles)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null) return false;

            var profile = user.UserProfiles.FirstOrDefault();

            if (profile == null)
            {
                // Tạo mới profile (FirstName/LastName NOT NULL trong DB => fallback chuỗi rỗng nếu thiếu)
                profile = new UserProfile
                {
                    UserId = userId,
                    FirstName = dto.FirstName?.Trim() ?? string.Empty,
                    LastName = dto.LastName?.Trim() ?? string.Empty,
                    PhoneNumber = dto.PhoneNumber?.Trim(),
                    DateOfBirth = dto.DateOfBirth.HasValue ? DateOnly.FromDateTime(dto.DateOfBirth.Value) : null,
                    Gender = dto.Gender,
                    Avatar = dto.Avatar,
                    Address = dto.Address,
                    WardCommune = dto.WardCommune,
                    District = dto.District,
                    Province = dto.Province,
                    PostalCode = dto.PostalCode,
                    EmergencyContactName = dto.EmergencyContactName,
                    EmergencyContactPhone = dto.EmergencyContactPhone,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.UserProfiles.Add(profile);
            }
            else
            {
                // Cập nhật từng field nếu có giá trị
                if (!string.IsNullOrWhiteSpace(dto.FirstName)) profile.FirstName = dto.FirstName.Trim();
                if (!string.IsNullOrWhiteSpace(dto.LastName)) profile.LastName = dto.LastName.Trim();
                if (!string.IsNullOrWhiteSpace(dto.PhoneNumber)) profile.PhoneNumber = dto.PhoneNumber.Trim();
                if (dto.DateOfBirth.HasValue) profile.DateOfBirth = DateOnly.FromDateTime(dto.DateOfBirth.Value);
                if (!string.IsNullOrWhiteSpace(dto.Gender)) profile.Gender = dto.Gender;
                if (!string.IsNullOrWhiteSpace(dto.Avatar)) profile.Avatar = dto.Avatar;
                if (!string.IsNullOrWhiteSpace(dto.Address)) profile.Address = dto.Address;
                if (!string.IsNullOrWhiteSpace(dto.WardCommune)) profile.WardCommune = dto.WardCommune;
                if (!string.IsNullOrWhiteSpace(dto.District)) profile.District = dto.District;
                if (!string.IsNullOrWhiteSpace(dto.Province)) profile.Province = dto.Province;
                if (!string.IsNullOrWhiteSpace(dto.PostalCode)) profile.PostalCode = dto.PostalCode;
                if (!string.IsNullOrWhiteSpace(dto.EmergencyContactName)) profile.EmergencyContactName = dto.EmergencyContactName;
                if (!string.IsNullOrWhiteSpace(dto.EmergencyContactPhone)) profile.EmergencyContactPhone = dto.EmergencyContactPhone;

                profile.UpdatedAt = DateTime.UtcNow;
            }

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateAvatarAsync(int userId, string avatarUrl)
        {
            var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null)
            {
                profile = new UserProfile
                {
                    UserId = userId,
                    FirstName = string.Empty,
                    LastName = string.Empty,
                    Avatar = avatarUrl,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.UserProfiles.Add(profile);
            }
            else
            {
                profile.Avatar = avatarUrl;
                profile.UpdatedAt = DateTime.UtcNow;
            }

            return await _context.SaveChangesAsync() > 0;
        }
    }
}
