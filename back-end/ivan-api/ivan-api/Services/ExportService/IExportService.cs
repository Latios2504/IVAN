using ivan_api.DTOs.Export;

namespace ivan_api.Services.ExportService
{
    public interface IExportService
    {
        // Analytics Exports
        Task<ExportResult> ExportAnalyticsAsync(AnalyticsExportRequest request);
        
        // User Data Exports
        Task<ExportResult> ExportUsersAsync(UserExportRequest request);
        
        // Event Data Exports
        Task<ExportResult> ExportEventsAsync(EventExportRequest request);
        Task<ExportResult> ExportEventRegistrationsAsync(EventRegistrationExportRequest request);
        
        // Organization Data Exports
        Task<ExportResult> ExportOrganizationDataAsync(OrganizationExportRequest request);

        // Helper methods
        Task<string> GetContentTypeForFormat(ExportFormat format);
        Task<string> GenerateFileNameAsync(string baseName, ExportFormat format, string language = "vi-VN");
    }
}
