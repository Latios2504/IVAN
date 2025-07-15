using ivan_api.Models;

namespace ivan_api.Repository.UserAccountRepo
{
    public interface IUserAccountRepository
    {
        Task<IEnumerable<User>> getListUser();
        Task<User?> GetUserById(int? userId);
        Task<User?> GetUserByEmail(string email);
    }
}
