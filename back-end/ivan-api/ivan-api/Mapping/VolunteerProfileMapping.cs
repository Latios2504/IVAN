using AutoMapper;
using ivan_api.DTOs.VolunteerProfile;
using ivan_api.Models;

namespace ivan_api.Mapping
{
    public class VolunteerProfileMapping : Profile
    {
        public VolunteerProfileMapping()
        {
            // VolunteerProfileCreateDto → VolunteerProfile
            CreateMap<VolunteerProfileCreateDto, VolunteerProfile>()
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) // Set in service
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore()) // Set in service
                .ForMember(dest => dest.VolunteerId, opt => opt.Ignore()) // Auto-generated
                .ForMember(dest => dest.VolunteerHours, opt => opt.MapFrom(src => 0))
                .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => 0))
                .ForMember(dest => dest.RatingCount, opt => opt.MapFrom(src => 0))
                .ForMember(dest => dest.IsVerified, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.TotalHoursVolunteered, opt => opt.MapFrom(src => 0));

            // VolunteerProfileUpdateDto → VolunteerProfile (for partial updates)
            CreateMap<VolunteerProfileUpdateDto, VolunteerProfile>()
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore()) // Set in service
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) // Don't update
                .ForMember(dest => dest.VolunteerId, opt => opt.Ignore()) // Don't update
                .ForMember(dest => dest.UserId, opt => opt.Ignore()) // Don't update
                .ForMember(dest => dest.VolunteerHours, opt => opt.Ignore()) // Don't update from DTO
                .ForMember(dest => dest.Rating, opt => opt.Ignore()) // Don't update from DTO
                .ForMember(dest => dest.RatingCount, opt => opt.Ignore()) // Don't update from DTO
                .ForMember(dest => dest.IsVerified, opt => opt.Ignore()) // Don't update from DTO
                .ForMember(dest => dest.VerifiedAt, opt => opt.Ignore()) // Don't update from DTO
                .ForMember(dest => dest.VerifiedBy, opt => opt.Ignore()) // Don't update from DTO
                .ForMember(dest => dest.TotalHoursVolunteered, opt => opt.Ignore()) // Don't update from DTO
                .ForMember(dest => dest.LastActiveDate, opt => opt.Ignore()) // Don't update from DTO
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // VolunteerProfile → VolunteerProfileViewModel
            CreateMap<VolunteerProfile, VolunteerProfileViewModel>()
                .ForMember(dest => dest.VolunteerHours, opt => opt.MapFrom(src => src.VolunteerHours ?? 0))
                .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Rating ?? 0))
                .ForMember(dest => dest.RatingCount, opt => opt.MapFrom(src => src.RatingCount ?? 0))
                .ForMember(dest => dest.IsVerified, opt => opt.MapFrom(src => src.IsVerified ?? false))
                .ForMember(dest => dest.TotalHoursVolunteered, opt => opt.MapFrom(src => src.TotalHoursVolunteered ?? 0))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true)) // Default to active
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt ?? DateTime.MinValue))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt ?? DateTime.MinValue))
                // Map from User navigation property - using null-safe navigation
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User != null ? src.User.Email : null))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => GetFullName(src)))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => GetUserProfileProperty(src, p => p.PhoneNumber)))
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => GetDateOfBirth(src)))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => GetUserProfileProperty(src, p => p.Gender)))
                .ForMember(dest => dest.Avatar, opt => opt.MapFrom(src => GetUserProfileProperty(src, p => p.Avatar)))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => GetUserProfileProperty(src, p => p.Address)))
                // Map verification info
                .ForMember(dest => dest.VerifiedByName, opt => opt.MapFrom(src => GetVerifiedByName(src)))
                // Map skills
                .ForMember(dest => dest.VolunteerSkills, opt => opt.MapFrom(src => src.VolunteerSkills));

            // Skill → SkillDto
            CreateMap<Skill, SkillDto>()
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive ?? false));

            // VolunteerSkill → VolunteerSkillDto
            CreateMap<VolunteerSkill, VolunteerSkillDto>()
                .ForMember(dest => dest.SkillName, opt => opt.MapFrom(src => src.Skill != null ? src.Skill.SkillName : string.Empty));

            // VolunteerSkillDto → VolunteerSkill
            CreateMap<VolunteerSkillDto, VolunteerSkill>();

            // VolunteerProfile → PublicVolunteerDTO (for public API)
            CreateMap<VolunteerProfile, PublicVolunteerDTO>()
                .ForMember(dest => dest.VolunteerId, opt => opt.MapFrom(src => src.VolunteerId))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.User.UserProfiles.Select(p => p.FirstName).FirstOrDefault() ?? string.Empty))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.User.UserProfiles.Select(p => p.LastName).FirstOrDefault() ?? string.Empty))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => 
                    src.User.UserProfiles
                        .Select(p => p.FirstName + " " + p.LastName)
                        .FirstOrDefault() ?? string.Empty))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.User.UserProfiles.Select(p => p.Gender).FirstOrDefault()))
                .ForMember(dest => dest.Avatar, opt => opt.MapFrom(src => src.User.UserProfiles.Select(p => p.Avatar).FirstOrDefault()))
                .ForMember(dest => dest.Province, opt => opt.MapFrom(src => src.User.UserProfiles.Select(p => p.Province).FirstOrDefault()))
                .ForMember(dest => dest.University, opt => opt.MapFrom(src => src.University))
                .ForMember(dest => dest.Major, opt => opt.MapFrom(src => src.Major))
                .ForMember(dest => dest.YearOfStudy, opt => opt.MapFrom(src => src.YearOfStudy))
                .ForMember(dest => dest.Motivation, opt => opt.MapFrom(src => src.Motivation))
                .ForMember(dest => dest.Experience, opt => opt.MapFrom(src => src.Experience))
                .ForMember(dest => dest.Availability, opt => opt.MapFrom(src => src.Availability))
                .ForMember(dest => dest.VolunteerHours, opt => opt.MapFrom(src => src.VolunteerHours ?? 0))
                .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Rating ?? 0))
                .ForMember(dest => dest.RatingCount, opt => opt.MapFrom(src => src.RatingCount ?? 0))
                .ForMember(dest => dest.IsVerified, opt => opt.MapFrom(src => src.IsVerified ?? false))
                .ForMember(dest => dest.TotalHoursVolunteered, opt => opt.MapFrom(src => src.TotalHoursVolunteered ?? 0))
                .ForMember(dest => dest.Skills, opt => opt.MapFrom(src => src.Skills))
                .ForMember(dest => dest.SkillsList, opt => opt.MapFrom(src => src.VolunteerSkills));

            // VolunteerSkill → PublicVolunteerSkillDTO (for public API)
            CreateMap<VolunteerSkill, PublicVolunteerSkillDTO>()
                .ForMember(dest => dest.SkillId, opt => opt.MapFrom(src => src.SkillId))
                .ForMember(dest => dest.SkillName, opt => opt.MapFrom(src => src.Skill != null ? src.Skill.SkillName : string.Empty))
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Skill != null ? src.Skill.Category : null))
                .ForMember(dest => dest.ProficiencyLevel, opt => opt.MapFrom(src => src.ProficiencyLevel ?? string.Empty))
                .ForMember(dest => dest.YearsOfExperience, opt => opt.MapFrom(src => src.YearsOfExperience ?? 0))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description));
        }

        // Helper methods for safe navigation
        private static string GetFullName(VolunteerProfile src)
        {
            var userProfile = src.User?.UserProfiles?.FirstOrDefault();
            if (userProfile == null) return string.Empty;
            return $"{userProfile.FirstName} {userProfile.LastName}".Trim();
        }

        private static string? GetUserProfileProperty(VolunteerProfile src, Func<UserProfile, string?> propertySelector)
        {
            var userProfile = src.User?.UserProfiles?.FirstOrDefault();
            return userProfile != null ? propertySelector(userProfile) : null;
        }

        private static DateTime? GetDateOfBirth(VolunteerProfile src)
        {
            var userProfile = src.User?.UserProfiles?.FirstOrDefault();
            if (userProfile?.DateOfBirth.HasValue == true)
            {
                return userProfile.DateOfBirth.Value.ToDateTime(TimeOnly.MinValue);
            }
            return null;
        }

        private static string GetVerifiedByName(VolunteerProfile src)
        {
            var verifierProfile = src.VerifiedByNavigation?.UserProfiles?.FirstOrDefault();
            if (verifierProfile == null) return string.Empty;
            return $"{verifierProfile.FirstName} {verifierProfile.LastName}".Trim();
        }
    }
}
