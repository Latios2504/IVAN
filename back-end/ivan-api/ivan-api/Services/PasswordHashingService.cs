using System.Security.Cryptography;
using System.Text;

namespace ivan_api.Services;

public class PasswordHashingService : IPasswordHashingService
{
    public string GenerateSalt()
    {
        byte[] saltBytes = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(saltBytes);
        }
        return Convert.ToBase64String(saltBytes);
    }

    public string HashPassword(string password, string salt)
    {
        using (var sha256 = SHA256.Create())
        {
            // Combine password and salt
            string saltedPassword = password + salt;
            byte[] saltedPasswordBytes = Encoding.UTF8.GetBytes(saltedPassword);
            
            // Hash the salted password
            byte[] hashBytes = sha256.ComputeHash(saltedPasswordBytes);
            
            return Convert.ToBase64String(hashBytes);
        }
    }

    public bool VerifyPassword(string password, string hash, string salt)
    {
        string hashedPassword = HashPassword(password, salt);
        return hashedPassword == hash;
    }
}
