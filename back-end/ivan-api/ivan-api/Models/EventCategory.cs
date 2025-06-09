using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class EventCategory
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public string? Description { get; set; }

    public string? IconUrl { get; set; }

    public string? Color { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();
}
