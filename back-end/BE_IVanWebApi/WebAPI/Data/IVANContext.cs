using Microsoft.EntityFrameworkCore;
using WebAPI.Data.Entities;

namespace WebAPI.Data
{
    public class IVANContext : DbContext
    {
        public IVANContext(DbContextOptions options) : base(options)
        {
        }
        
        public DbSet<VolunteerProfile> VolunteerProfile { get; set; }
        public DbSet<User> User { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Cấu hình unique constraint cho UserId trong VolunteerProfile
            modelBuilder.Entity<VolunteerProfile>()
                .HasIndex(vp => vp.UserId)
                .IsUnique();

            // Seed Data cho Users
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "volunteer1",
                    Email = "volunteer1@example.com",
                    PasswordHash = "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // Mã hóa mật khẩu (giả lập)
                    RoleId = 2, // Volunteer role
                    IsActive = true,
                    EmailVerified = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 2,
                    Username = "volunteer2",
                    Email = "volunteer2@example.com",
                    PasswordHash = "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
                    RoleId = 2, // Volunteer role
                    IsActive = true,
                    EmailVerified = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 3,
                    Username = "admin",
                    Email = "admin@example.com",
                    PasswordHash = "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
                    RoleId = 4, // Admin role
                    IsActive = true,
                    EmailVerified = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );

            // Seed Data cho VolunteerProfiles
            modelBuilder.Entity<VolunteerProfile>().HasData(
                new VolunteerProfile
                {
                    Id = 1,
                    UserId = 1,
                    FirstName = "Nguyen",
                    LastName = "Van A",
                    Phone = "0987654321",
                    DateOfBirth = new DateTime(1995, 5, 15),
                    Gender = "Male",
                    Address = "123 Đường Láng, Đống Đa",
                    City = "Hà Nội",
                    Province = "Hà Nội",
                    EmergencyContactName = "Nguyen Thi B",
                    EmergencyContactPhone = "0987654322",
                    Skills = "First Aid,Teaching",
                    Interests = "Environmental Conservation,Education",
                    Availability = "Weekends,Evenings",
                    VolunteerHoursCompleted = 50,
                    Bio = "Tình nguyện viên nhiệt huyết với 5 năm kinh nghiệm trong các hoạt động cộng đồng.",
                    EducationLevel = "Đại học",
                    Occupation = "Kỹ sư phần mềm",
                    Company = "FPT Software"
                },
                new VolunteerProfile
                {
                    Id = 2,
                    UserId = 2,
                    FirstName = "Tran",
                    LastName = "Thi C",
                    Phone = "0912345678",
                    DateOfBirth = new DateTime(1998, 8, 20),
                    Gender = "Female",
                    Address = "456 Nguyễn Trãi, Thanh Xuân",
                    City = "Hà Nội",
                    Province = "Hà Nội",
                    EmergencyContactName = "Tran Van D",
                    EmergencyContactPhone = "0912345679",
                    Skills = "Event Management,Public Speaking",
                    Interests = "Community Development,Health",
                    Availability = "Weekdays,Evenings",
                    VolunteerHoursCompleted = 30,
                    Bio = "Tình nguyện viên năng động, thích tham gia các hoạt động phát triển cộng đồng.",
                    EducationLevel = "Đại học",
                    Occupation = "Nhân viên marketing",
                    Company = "VinGroup"
                });
        }
    }
}
