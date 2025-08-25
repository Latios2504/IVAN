using System.Security.Cryptography;
using System.Text;

namespace ivan_api.Configuration
{
    public class PasswordHashGenerate
    {
        public static string GenerateSaltBase64(int size = 16)
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(size));
        }

        public static string ComputeSha256(string input)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
            return Convert.ToHexString(bytes); // .NET 5+ (uppercase). Dùng ToLowerInvariant() nếu muốn.
        }

        public static string HashPasswordWithSalt(string rawPassword, string base64Salt)
        {
            // đơn giản: hash( raw + ":" + salt )
            return ComputeSha256($"{rawPassword}:{base64Salt}");
        }

        public static string GenerateTempPassword()
        {
            // mật khẩu tạm đủ mạnh để pass policy cơ bản
            // ví dụ 16 kí tự ngẫu nhiên + hậu tố đảm bảo có hoa/thường/ký tự đặc biệt/số
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(12)) + "Aa!1";
        }
    }
}
