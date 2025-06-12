using Microsoft.EntityFrameworkCore;
using WebAPI.Data_old.Entities;

namespace WebAPI.Data_old
{
    public class IVANContext : DbContext
    {
        public IVANContext(DbContextOptions options) : base(options)
        {
        }

        public IVANContext()
        {

        }

        //DbSet<VolunteerProfile> VolunteerProfiles { get; set; }
        //DbSet<User> users { get; set; }

        public virtual DbSet<OrganizationProfile> OrganizationProfiles { get; set; }
        public virtual DbSet<PartnerProfile> PartnerProfiles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Cấu hình unique constraint cho UserId trong VolunteerProfileF
            //modelBuilder.Entity<VolunteerProfile>()
            //    .HasIndex(vp => vp.UserId)
            //    .IsUnique();

            modelBuilder.Entity<PartnerCollaboration>()
                .HasOne(p => p.CreatedByNavigation)
                .WithMany()
                .HasForeignKey(p => p.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict); // or .NoAction()

            modelBuilder.Entity<PartnerCollaboration>()
                .HasOne(p => p.ApprovedByNavigation)
                .WithMany()
                .HasForeignKey(p => p.ApprovedBy)
                .OnDelete(DeleteBehavior.Restrict); // or .NoAction()
        }
    }
}
