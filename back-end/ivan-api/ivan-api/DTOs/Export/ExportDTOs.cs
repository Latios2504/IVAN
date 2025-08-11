using ivan_api.DTOs.Analytics;

namespace ivan_api.DTOs.Export
{
    public enum ExportFormat
    {
        Excel,
        Csv,
        Pdf,
        Json
    }

    public enum AnalyticsSection
    {
        UserAnalytics,
        EventAnalytics,
        GeographicDistribution,
        RoleDistribution,
        EventTrends,
        CategoryStats,
        RegistrationStats
    }

    public class AnalyticsExportRequest
    {
        public ExportFormat Format { get; set; } = ExportFormat.Excel;
        public TimePeriod Period { get; set; } = TimePeriod.Last30Days;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public List<AnalyticsSection> Sections { get; set; } = new();
        public bool IncludeCharts { get; set; } = true;
        public string Language { get; set; } = "vi-VN";
        public string FileName { get; set; } = string.Empty;
    }

    public class UserExportRequest
    {
        public ExportFormat Format { get; set; } = ExportFormat.Excel;
        public List<int>? RoleIds { get; set; }
        public List<string>? Provinces { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IncludeProfiles { get; set; } = true;
        public bool IncludeVolunteerStats { get; set; } = false;
        public string Language { get; set; } = "vi-VN";
        public string FileName { get; set; } = string.Empty;
    }

    public class EventExportRequest
    {
        public ExportFormat Format { get; set; } = ExportFormat.Excel;
        public List<int>? CategoryIds { get; set; }
        public List<int>? StatusIds { get; set; }
        public List<int>? OrganizationIds { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IncludeRegistrations { get; set; } = false;
        public bool IncludeStatistics { get; set; } = true;
        public string Language { get; set; } = "vi-VN";
        public string FileName { get; set; } = string.Empty;
    }

    public class EventRegistrationExportRequest
    {
        public ExportFormat Format { get; set; } = ExportFormat.Excel;
        public int? EventId { get; set; }
        public List<int>? StatusIds { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IncludeVolunteerDetails { get; set; } = true;
        public bool IncludeEventDetails { get; set; } = true;
        public string Language { get; set; } = "vi-VN";
        public string FileName { get; set; } = string.Empty;
    }

    public class OrganizationExportRequest
    {
        public ExportFormat Format { get; set; } = ExportFormat.Excel;
        public int? OrganizationId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IncludeEvents { get; set; } = true;
        public bool IncludeVolunteers { get; set; } = true;
        public bool IncludeStatistics { get; set; } = true;
        public string Language { get; set; } = "vi-VN";
        public string FileName { get; set; } = string.Empty;
    }

    public class ExportResult
    {
        public bool Success { get; set; }
        public byte[] Data { get; set; } = Array.Empty<byte>();
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public string ErrorMessage { get; set; } = string.Empty;
        public int RecordCount { get; set; }
        public long FileSizeBytes { get; set; }
    }
}
