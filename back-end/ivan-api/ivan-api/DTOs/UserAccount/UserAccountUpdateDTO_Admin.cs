namespace ivan_api.DTOs.UserAccount
{
    public class UserAccountUpdateDTO_Admin
    {
        public int RoleId { get; set; }

        public bool? IsActive { get; set; }

        public bool? IsEmailVerified { get; set; }
    }
}
