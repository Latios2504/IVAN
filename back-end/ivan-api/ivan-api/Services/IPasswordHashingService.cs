namespace ivan_api.Services;

public interface IPasswordHashingService
{
    string GenerateSalt();
    string HashPassword(string password, string salt);
    bool VerifyPassword(string password, string hash, string salt);
}
