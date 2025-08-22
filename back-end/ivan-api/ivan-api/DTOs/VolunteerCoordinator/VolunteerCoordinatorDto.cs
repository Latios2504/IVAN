using System.ComponentModel.DataAnnotations;

namespace ivan_api.DTOs.VolunteerCoordinator;

public class VolunteerCoordinatorDto
{
    public int CoordinatorId { get; set; }
    public int UserId { get; set; }
    public int OrganizationId { get; set; }
    public string? EmployeeId { get; set; }
    public string? Position { get; set; }
    public string? Department { get; set; }
    public string? Responsibilities { get; set; }
    public DateOnly? HireDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public decimal? Salary { get; set; }
    public int? ManagerId { get; set; }
    public bool? IsActive { get; set; }
    public string? Notes { get; set; }
    public int CreatedBy { get; set; }
    public int RequestedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public UserInformationDto? User { get; set; }
    public string? OrganizationName { get; set; }
    public UserInformationDto? Manager { get; set; }
    public UserInformationDto? CreatedByUser { get; set; }
}

public class UserInformationDto
{
    public int UserId { get; set; }
    public string Email { get; set; } = null!;
    public string? FullName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Avatar { get; set; }
}

public class CreateVolunteerCoordinatorDto
{
    // User account information
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    // Personal information (UserProfile fields)
    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = null!;

    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = null!;

    [Phone]
    public string? PhoneNumber { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    [StringLength(10)]
    public string? Gender { get; set; }

    [StringLength(500)]
    public string? Avatar { get; set; }

    [StringLength(500)]
    public string? Address { get; set; }

    [StringLength(100)]
    public string? WardCommune { get; set; }

    [StringLength(100)]
    public string? District { get; set; }

    [StringLength(100)]
    public string? Province { get; set; }

    [StringLength(20)]
    public string? PostalCode { get; set; }

    [StringLength(200)]
    public string? EmergencyContactName { get; set; }

    [Phone]
    public string? EmergencyContactPhone { get; set; }

    // Employment information (VolunteerCoordinator fields)
    [StringLength(50)]
    public string? EmployeeId { get; set; }

    [StringLength(100)]
    public string? Position { get; set; }

    [StringLength(100)]
    public string? Department { get; set; }

    [StringLength(1000)]
    public string? Responsibilities { get; set; }

    public DateOnly? HireDate { get; set; }
    public decimal? Salary { get; set; }
    public int? ManagerId { get; set; }

    [StringLength(1000)]
    public string? Notes { get; set; }
}

public class UpdateVolunteerCoordinatorDto
{
    [StringLength(50)]
    public string? EmployeeId { get; set; }

    [StringLength(100)]
    public string? Position { get; set; }

    [StringLength(100)]
    public string? Department { get; set; }

    [StringLength(1000)]
    public string? Responsibilities { get; set; }

    public DateOnly? HireDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public decimal? Salary { get; set; }
    public int? ManagerId { get; set; }
    public bool? IsActive { get; set; }

    [StringLength(1000)]
    public string? Notes { get; set; }
}

public class VolunteerCoordinatorFilterDto
{
    public int Page { get; set; } = 1;
    public int Size { get; set; } = 20;
    public string? Search { get; set; }
    public string? Department { get; set; }
    public string? Position { get; set; }
    public bool? IsActive { get; set; }
    public int? ManagerId { get; set; }
    public string SortBy { get; set; } = "CreatedAt";
    public string SortOrder { get; set; } = "desc";
}

public class VolunteerCoordinatorStatsDto
{
    public int TotalCoordinators { get; set; }
    public int ActiveCoordinators { get; set; }
    public int InactiveCoordinators { get; set; }
    public List<DepartmentStatsDto> DepartmentStats { get; set; } = new();
    public List<string> AvailablePositions { get; set; } = new();
    public List<string> AvailableDepartments { get; set; } = new();
}

public class DepartmentStatsDto
{
    public string Department { get; set; } = null!;
    public int Count { get; set; }
}
