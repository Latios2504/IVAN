using AutoMapper;
using ivan_api.DTOs.UserManagement;
using ivan_api.DTOs.Common;
using ivan_api.Repository.UserManagement;
using ivan_api.Services.VolunteerProfileServ;
using ivan_api.Services.OrganizationProfiles;
using ivan_api.Services.PartnerProfiles;
using ivan_api.Models;

namespace ivan_api.Services.UserManagement
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IVolunteerProfileService _volunteerProfileService;
        private readonly IOrganizationProfileService _organizationProfileService;
        private readonly IPartnerProfileService _partnerProfileService;
        private readonly IMapper _mapper;

        public UserService(
            IUserRepository userRepository,
            IVolunteerProfileService volunteerProfileService,
            IOrganizationProfileService organizationProfileService,
            IPartnerProfileService partnerProfileService,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _volunteerProfileService = volunteerProfileService;
            _organizationProfileService = organizationProfileService;
            _partnerProfileService = partnerProfileService;
            _mapper = mapper;
        }

        public async Task<PagedResultDto<UserListDTO>> GetUsersAsync(UserFiltersDTO filters)
        {
            return await _userRepository.GetUsersAsync(filters);
        }

        public async Task<object> GetUserDetailsAsync(int userId)
        {
            // Get user for role detection only
            var user = await _userRepository.GetUserForRoleDetectionAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            // Route to appropriate profile service based on role
            switch (user.RoleId)
            {
                case 1: // Volunteer - Get combined user info + volunteer profile + user profile
                    var volunteerProfile = await _volunteerProfileService.GetVolunteerProfileById(userId);
                    var volunteerUserProfile = await _userRepository.GetUserProfileAsync(userId);
                    return CombineUserAndProfileData(user, volunteerUserProfile, volunteerProfile);

                case 2: // Organization - Get combined user info + organization profile + user profile
                    var organizationProfile = await _organizationProfileService.GetOrganizationProfileById(userId);
                    var organizationUserProfile = await _userRepository.GetUserProfileAsync(userId);
                    return CombineUserAndProfileData(user, organizationUserProfile, organizationProfile);

                case 3: // Partner - Get combined user info + partner profile + user profile
                    var partnerProfile = await _partnerProfileService.GetPartnerProfileById(userId);
                    var partnerUserProfile = await _userRepository.GetUserProfileAsync(userId);
                    return CombineUserAndProfileData(user, partnerUserProfile, partnerProfile);

                case 4: // Admin - Return user info + user profile (no role-specific profile)
                    var adminUserProfile = await _userRepository.GetUserProfileAsync(userId);
                    return CombineUserAndProfileData(user, adminUserProfile, null);

                default: // Coordinator or other roles - return basic user info + user profile only
                    var coordinatorUserProfile = await _userRepository.GetUserProfileAsync(userId);
                    return CombineUserAndProfileData(user, coordinatorUserProfile, null);
            }
        }

        private object CombineUserAndProfileData(User user, UserProfileDTO? userProfile, object? roleProfile)
        {
            var result = new Dictionary<string, object?>
            {
                // Basic user information
                ["userId"] = user.UserId,
                ["email"] = user.Email,
                ["roleId"] = user.RoleId,
                ["roleName"] = user.Role.RoleName,
                ["isActive"] = user.IsActive ?? false,
                ["isEmailVerified"] = user.IsEmailVerified ?? false,
                ["lastLoginAt"] = user.LastLoginAt,
                ["createdAt"] = user.CreatedAt,
                ["updatedAt"] = user.UpdatedAt
            };

            // Add user profile data if available
            if (userProfile != null)
            {
                result["fullName"] = userProfile.FullName;
                result["firstName"] = userProfile.FirstName;
                result["lastName"] = userProfile.LastName;
                result["phoneNumber"] = userProfile.PhoneNumber;
                result["dateOfBirth"] = userProfile.DateOfBirth;
                result["gender"] = userProfile.Gender;
                result["avatar"] = userProfile.Avatar;
                result["address"] = userProfile.Address;
                result["wardCommune"] = userProfile.WardCommune;
                result["district"] = userProfile.District;
                result["province"] = userProfile.Province;
                result["postalCode"] = userProfile.PostalCode;
                result["emergencyContactName"] = userProfile.EmergencyContactName;
                result["emergencyContactPhone"] = userProfile.EmergencyContactPhone;
            }

            // Add role-specific profile data if available
            if (roleProfile != null)
            {
                var roleProfileProps = roleProfile.GetType().GetProperties();
                foreach (var prop in roleProfileProps)
                {
                    var value = prop.GetValue(roleProfile);
                    if (value != null)
                    {
                        result[prop.Name.Substring(0, 1).ToLower() + prop.Name.Substring(1)] = value;
                    }
                }
            }

            return result;
        }

        public async Task<bool> UpdateUserStatusAsync(int userId, bool isActive)
        {
            return await _userRepository.UpdateUserStatusAsync(userId, isActive);
        }

        public async Task<IEnumerable<UserRoleDto>> GetAllUserRolesAsync()
        {
            var roles = await _userRepository.GetAllUserRolesAsync();
            return _mapper.Map<IEnumerable<UserRoleDto>>(roles);
        }
    }
}
