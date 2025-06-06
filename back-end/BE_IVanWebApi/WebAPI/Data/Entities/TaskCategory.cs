using System;
using System.Collections.Generic;

namespace WebAPI.Data.Entities;

public partial class TaskCategory
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public string? Description { get; set; }

    public string? Color { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<OnSiteTask> OnSiteTasks { get; set; } = new List<OnSiteTask>();
}
