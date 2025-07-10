namespace ivan_api.DTOs.UserAccount
{
    public class UserAccountListDto
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string RoleName { get; set; }
        public bool IsActive { get; set; }
        public bool IsEmailVerified { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public DateTime? CreatedAt { get; set; }    
        public DateTime? UpdatedAt { get; set; }

        // Thông tin bổ sung để hiển thị
        public string? PhoneNumber { get; set; }
        public string? Province { get; set; }
        public int? Age { get; set; }
        public string StatusDisplay => IsActive ? "Hoạt động" : "Vô hiệu hóa";
        public string VerificationDisplay => IsEmailVerified ? "Đã xác thực" : "Chưa xác thực";
    }
}
