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
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = null!;

    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = null!;

    [Phone]
    public string? PhoneNumber { get; set; }

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
