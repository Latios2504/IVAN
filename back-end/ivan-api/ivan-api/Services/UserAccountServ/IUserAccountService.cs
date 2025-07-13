using ivan_api.DTOs.Common;
using ivan_api.DTOs.UserAccount;

namespace ivan_api.Services.UserAccountServ
{
    public interface IUserAccountService
    {
        Task<PagedResultDto<UserAccountListDto>> getListUserAsync(UserAccountFilterDto filter);
    }
}
