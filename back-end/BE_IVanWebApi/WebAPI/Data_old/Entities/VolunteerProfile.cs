using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Data_old.Entities
{
    public class VolunteerProfile
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; }

        [MaxLength(20)]
        public string Phone { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [MaxLength(20)]
        public string Gender { get; set; }

        public string Address { get; set; }

        [MaxLength(100)]
        public string City { get; set; }

        [MaxLength(100)]
        public string Province { get; set; }

        [MaxLength(200)]
        public string EmergencyContactName { get; set; }

        [MaxLength(20)]
        public string EmergencyContactPhone { get; set; }

        public string Skills { get; set; } // Lưu dưới dạng chuỗi, ví dụ: "First Aid,Teaching"

        public string Interests { get; set; } // Ví dụ: "Environmental Conservation,Education"

        public string Availability { get; set; } // Ví dụ: "Weekends,Evenings"

        public int VolunteerHoursCompleted { get; set; } = 0;

        public string ProfilePictureUrl { get; set; }

        public string Bio { get; set; }

        [MaxLength(300)]
        public string FacebookUrl { get; set; }

        [MaxLength(100)]
        public string EducationLevel { get; set; }

        [MaxLength(100)]
        public string Occupation { get; set; }

        [MaxLength(200)]
        public string Company { get; set; }

        public bool IsBackgroundChecked { get; set; } = false;

        public DateTime? BackgroundCheckDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}

