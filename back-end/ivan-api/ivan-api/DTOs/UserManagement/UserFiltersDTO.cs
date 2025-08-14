namespace ivan_api.DTOs.UserManagement
{
    public class UserFiltersDTO
    {
        public string? Search { get; set; }
        public int? RoleId { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsEmailVerified { get; set; }
        public int Page { get; set; } = 1;
        public int Size { get; set; } = 10;
    }
}
