namespace ivan_api.Services.PasswordHashingSer;

public interface IPasswordHashingService
{
    string GenerateSalt();
    string HashPassword(string password, string salt);
    bool VerifyPassword(string password, string hash, string salt);
}
