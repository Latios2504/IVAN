using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class Report
{
    public int ReportId { get; set; }

    public string ReportType { get; set; } = null!;

    public string Content { get; set; } = null!;

    public DateTime? GeneratedDate { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User? CreatedByNavigation { get; set; }
}
