using WebAPI.Data.Entities;
using WebAPI.Models.VolunteerProfile;
using WebAPI.Repository.VolunteerProfileRepo;

namespace WebAPI.Service.VolunteerProfileService
{
    public class VolunteerProfileService : IVolunteerProfileService
    {
        private readonly IVolunteerProfileRepository _repo;

        public VolunteerProfileService(IVolunteerProfileRepository repo)
        {
            _repo = repo;
        }

        public async Task<VolunteerProfile> AddAsync(VolunteerProfileDto dto)
        {
            var entity = new VolunteerProfile
            {
                UserId = dto.UserId,
                StudentId = dto.StudentId,
                University = dto.University,
                Major = dto.Major,
                YearOfStudy = dto.YearOfStudy,
                Motivation = dto.Motivation,
                Experience = dto.Experience,
                Availability = dto.Availability,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            return await _repo.AddAsync(entity);
        }

        public async Task<VolunteerProfileViewDto?> GetByUserIdAsync(int userId)
        {
            var v = await _repo.GetByUserIdAsync(userId);
            if (v == null) return null;

            return new VolunteerProfileViewDto
            {
                VolunteerId = v.VolunteerId,
                UserId = v.UserId,
                FullName = v.User.UserProfiles.FirstOrDefault()?.FullName ?? "N/A",
                University = v.University,
                YearOfStudy = v.YearOfStudy,
                Motivation = v.Motivation,
                Rating = v.Rating
            };
        }

        public async Task<List<VolunteerProfileViewDto>> ListAsync()
        {
            var list = await _repo.GetAllAsync();
            return list.Select(v => new VolunteerProfileViewDto
            {
                VolunteerId = v.VolunteerId,
                UserId = v.UserId,
                FullName = v.User.UserProfiles.FirstOrDefault()?.FullName ?? "N/A",
                University = v.University,
                YearOfStudy = v.YearOfStudy,
                Motivation = v.Motivation,
                Rating = v.Rating
            }).ToList();
        }

        public async Task<VolunteerProfile?> UpdateAsync(int userId, VolunteerProfileDto dto)
        {
            var entity = await _repo.GetByUserIdAsync(userId);
            if (entity == null) return null;

            entity.StudentId = dto.StudentId;
            entity.University = dto.University;
            entity.Major = dto.Major;
            entity.YearOfStudy = dto.YearOfStudy;
            entity.Motivation = dto.Motivation;
            entity.Experience = dto.Experience;
            entity.Availability = dto.Availability;
            entity.UpdatedAt = DateTime.UtcNow;

            return await _repo.UpdateAsync(entity);
        }
    }
}
