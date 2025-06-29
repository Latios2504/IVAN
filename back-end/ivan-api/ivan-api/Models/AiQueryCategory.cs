using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class AiQueryCategory
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public string? Description { get; set; }

    public string? DataTablesRequired { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }
}
