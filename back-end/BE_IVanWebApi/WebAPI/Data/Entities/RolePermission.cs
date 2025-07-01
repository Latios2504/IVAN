using System;
using System.Collections.Generic;

namespace WebAPI.Data.Entities;

public partial class RolePermission
{
    public int PermissionId { get; set; }

    public int RoleId { get; set; }

    public string PermissionName { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual UserRole Role { get; set; } = null!;
}
