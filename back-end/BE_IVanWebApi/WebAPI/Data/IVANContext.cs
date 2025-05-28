using Microsoft.EntityFrameworkCore;
using WebAPI.Data.Entities;

namespace WebAPI.Data
{
    public class IVANContext : DbContext
    {
        public IVANContext(DbContextOptions options) : base(options)
        {
        }

        DbSet<VolunteerProfile> VolunteerProfiles { get; set; }
        DbSet<User> users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Cấu hình unique constraint cho UserId trong VolunteerProfile
            modelBuilder.Entity<VolunteerProfile>()
                .HasIndex(vp => vp.UserId)
                .IsUnique();

        }
    }
}
