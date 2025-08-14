using AutoMapper;
using ivan_api.DTOs.UserManagement;
using ivan_api.Models;

namespace ivan_api.Mapping
{
    public class UserManagementMapping : Profile
    {
        public UserManagementMapping()
        {
            // User → UserListDTO - Only basic user info, no detailed profile
            CreateMap<User, UserListDTO>()
                .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role.RoleName))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive ?? false))
                .ForMember(dest => dest.IsEmailVerified, opt => opt.MapFrom(src => src.IsEmailVerified ?? false))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt ?? DateTime.MinValue))
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => GetBasicDisplayName(src)))
                .ForMember(dest => dest.RoleSpecificInfo, opt => opt.MapFrom(src => GetRoleSpecificInfo(src)));

            // UserProfile → UserProfileDTO for detailed views
            CreateMap<UserProfile, UserProfileDTO>();

            // UserRole → UserRoleDto
            CreateMap<UserRole, UserRoleDto>()
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive ?? false));
        }

        // Helper methods for safe navigation
        private static string GetBasicDisplayName(User src)
        {
            // For user list, only show basic display name from UserProfile if exists
            var userProfile = src.UserProfiles?.FirstOrDefault();
            if (userProfile != null && !string.IsNullOrEmpty(userProfile.FullName))
            {
                return userProfile.FullName;
            }
            
            // Fallback to email prefix if no profile name
            return src.Email.Split('@')[0];
        }

        private static string GetRoleSpecificInfo(User src)
        {
            // Return minimal role-specific identifier for quick reference in user list
            var volunteerProfile = src.VolunteerProfileUsers?.FirstOrDefault();
            if (volunteerProfile != null)
            {
                return !string.IsNullOrEmpty(volunteerProfile.StudentId) 
                    ? $"Student ID: {volunteerProfile.StudentId}"
                    : $"University: {volunteerProfile.University ?? "N/A"}";
            }

            var organizationProfile = src.OrganizationUsers?.FirstOrDefault();
            if (organizationProfile != null)
            {
                return $"Organization: {organizationProfile.OrganizationName}";
            }

            var partnerProfile = src.PartnerUsers?.FirstOrDefault();
            if (partnerProfile != null)
            {
                return $"Company: {partnerProfile.CompanyName}";
            }

            return string.Empty;
        }
    }
}
