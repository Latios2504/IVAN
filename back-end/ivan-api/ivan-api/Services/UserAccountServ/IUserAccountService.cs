using ivan_api.DTOs.Common;
using ivan_api.DTOs.UserAccount;

namespace ivan_api.Services.UserAccountServ
{
    public interface IUserAccountService
    {
        Task<PagedResultDto<UserAccountListDto>> getListUserAsync(UserAccountFilterDto filter);
        Task<UserAccountDetailDto> getUserInforByIdOrEmail(int? idUser, string? emailUser);
        Task<UserAccountDetailDto> updateUserAccount_Admin(int idUser, int idAdmin, UserAccountUpdateDTO_Admin dto);
    }
}
