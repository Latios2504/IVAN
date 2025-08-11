using ivan_api.DTOs.UserAccount;
using ivan_api.Models;

namespace ivan_api.Repository.UserAccountRepo
{
    public interface IUserAccountRepository
    {
        Task<IEnumerable<User>> getListUser();
        Task<User?> GetUserById(int? userId);
        Task<User?> GetUserByEmail(string email);
        Task<User?> UpdateuserAccount_Admin(int id, UserAccountUpdateDTO_Admin dto);

    }
}
