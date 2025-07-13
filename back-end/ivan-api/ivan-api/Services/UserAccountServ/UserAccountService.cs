using AutoMapper;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.UserAccount;
using ivan_api.Repository.UserAccountRepo;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services.UserAccountServ
{
    public class UserAccountService : IUserAccountService
    {
        private readonly IUserAccountRepository _userAccountRepository;
        private readonly IMapper _mapper;
        public UserAccountService(IUserAccountRepository userAccountRepository, IMapper mapper)
        {
            _userAccountRepository = userAccountRepository;
            _mapper = mapper;
        }

        public async Task<PagedResultDto<UserAccountListDto>> getListUserAsync(UserAccountFilterDto filter)
        {
            //ValidateAndAdjustFilter(filter);
            var users = await _userAccountRepository.getListUser();
            var filteredUsers = users.AsQueryable();
            if (filter.RoleId.HasValue)
            {
                filteredUsers = filteredUsers.Where(u => u.RoleId == filter.RoleId.Value);
            }
            if (filter.IsActive.HasValue)
            {
                filteredUsers = filteredUsers.Where(u => u.IsActive == filter.IsActive.Value);
            }
            if (filter.IsEmailVerified.HasValue)
            {
                filteredUsers = filteredUsers.Where(u => u.IsEmailVerified == filter.IsEmailVerified.Value);
            }
            if (filter.SearchTerm != null)
            {
                filteredUsers = filteredUsers.Where(u => u.Email.Contains(filter.SearchTerm) ||
                                                         u.UserProfiles.FirstOrDefault()!.FirstName.Contains(filter.SearchTerm) ||
                                                         u.UserProfiles.FirstOrDefault()!.LastName.Contains(filter.SearchTerm));
            }

            var totalCount = filteredUsers.Count();
            var pagedUser = filteredUsers
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            var items = pagedUser.Select(x =>
            {
                var userDto = _mapper.Map<UserAccountListDto>(x);
                var profile = x.UserProfiles.FirstOrDefault();
                var dob = profile?.DateOfBirth;

                if (dob.HasValue)
                {
                    // Tính tuổi: trừ năm, rồi điều chỉnh nếu chưa tới sinh nhật
                    var today = DateTime.Today;
                    int age = today.Year - dob.Value.Year;
                    userDto.Age = age;
                }
                else
                {
                    userDto.Age = null; // hoặc gán = 0 / -1 tuỳ yêu cầu
                }

                return userDto;
            }).ToList();

            return new PagedResultDto<UserAccountListDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };

        }

        //private async IQueryable<User> ApplySorting(IQueryable<User> query, UserAccountFilterDto filter)
        //{
        //    return filter.SortBy?.ToLower() switch
        //    {
        //        "email" => filter.SortDirection.ToLower() == "asc"
        //            ? query.OrderBy(u => u.Email)
        //            : query.OrderByDescending(u => u.Email),
        //        "fullname" => filter.SortDirection.ToLower() == "asc"
        //            ? query.OrderBy(u => u.UserProfiles != null ? u.UserProfiles.FirstOrDefault()!.FirstName + " " + u.UserProfiles.FirstOrDefault()!.LastName : "")
        //            : query.OrderByDescending(u => u.UserProfiles != null ? u.UserProfiles.FirstOrDefault()!.FirstName + " " + u.UserProfiles.FirstOrDefault()!.LastName : ""),
        //        "rolename" => filter.SortDirection.ToLower() == "asc"
        //            ? query.OrderBy(u => u.Role.RoleName)
        //            : query.OrderByDescending(u => u.Role.RoleName),
        //        "lastloginat" => filter.SortDirection.ToLower() == "asc"
        //            ? query.OrderBy(u => u.LastLoginAt)
        //            : query.OrderByDescending(u => u.LastLoginAt),
        //        _ => filter.SortDirection.ToLower() == "asc"
        //            ? query.OrderBy(u => u.CreatedAt)
        //            : query.OrderByDescending(u => u.CreatedAt)
        //    };
        //}


        private static void ValidateAndAdjustFilter(UserAccountFilterDto filter)
        {
            // Giới hạn PageSize tối đa để tránh quá tải
            if (filter.PageSize > 100)
                filter.PageSize = 100;

            // Đảm bảo PageNumber hợp lệ
            if (filter.PageNumber < 1)
                filter.PageNumber = 1;

            // Đảm bảo SortDirection hợp lệ
            if (!string.IsNullOrEmpty(filter.SortDirection) &&
                !new[] { "asc", "desc" }.Contains(filter.SortDirection.ToLower()))
            {
                filter.SortDirection = "desc";
            }

            // Validate SortBy field
            if (!string.IsNullOrEmpty(filter.SortBy))
            {
                var validSortFields = new[] { "Email", "FullName", "CreatedAt", "LastLoginAt", "RoleName" };
                if (!validSortFields.Contains(filter.SortBy, StringComparer.OrdinalIgnoreCase))
                {
                    filter.SortBy = "CreatedAt";
                }
            }

            // Validate date ranges
            if (filter.CreatedDateFrom.HasValue && filter.CreatedDateTo.HasValue)
            {
                if (filter.CreatedDateFrom > filter.CreatedDateTo)
                {
                    // Swap dates if From > To
                    (filter.CreatedDateFrom, filter.CreatedDateTo) = (filter.CreatedDateTo, filter.CreatedDateFrom);
                }
            }

            if (filter.LastLoginFrom.HasValue && filter.LastLoginTo.HasValue)
            {
                if (filter.LastLoginFrom > filter.LastLoginTo)
                {
                    // Swap dates if From > To
                    (filter.LastLoginFrom, filter.LastLoginTo) = (filter.LastLoginTo, filter.LastLoginFrom);
                }
            }

            // Trim SearchTerm
            if (!string.IsNullOrEmpty(filter.SearchTerm))
            {
                filter.SearchTerm = filter.SearchTerm.Trim();

                // Giới hạn độ dài search term
                if (filter.SearchTerm.Length > 100)
                {
                    filter.SearchTerm = filter.SearchTerm.Substring(0, 100);
                }
            }
        }
    }
}
