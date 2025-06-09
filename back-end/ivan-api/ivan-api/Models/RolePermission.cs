using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class RolePermission
{
    public int PermissionId { get; set; }

    public int RoleId { get; set; }

    public string PermissionName { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual UserRole Role { get; set; } = null!;
}
