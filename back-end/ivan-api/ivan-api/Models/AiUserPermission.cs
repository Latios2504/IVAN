using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class AiUserPermission
{
    public int PermissionId { get; set; }

    public int UserId { get; set; }

    public string Permission { get; set; } = null!;

    public bool IsGranted { get; set; }

    public DateTime? GrantedAt { get; set; }

    public DateTime? RevokedAt { get; set; }

    public int? GrantedByUserId { get; set; }

    public string? Notes { get; set; }

    public virtual User? GrantedByUser { get; set; }

    public virtual User User { get; set; } = null!;
}
