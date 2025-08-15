using System.Text;
using System.Globalization;
using CsvHelper;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using ivan_api.DTOs.Export;
using ivan_api.DTOs.Analytics;
using ivan_api.Services.Analytics;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services.ExportService
{
    public class ExportService : IExportService
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly IAnalyticsService _analyticsService;
        private readonly ILogger<ExportService> _logger;

        public ExportService(
            VolunteerManagementSystemContext context,
            IAnalyticsService analyticsService,
            ILogger<ExportService> logger)
        {
            _context = context;
            _analyticsService = analyticsService;
            _logger = logger;
            
            // Set EPPlus license context for non-commercial use
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        }

        public async Task<ExportResult> ExportAnalyticsAsync(AnalyticsExportRequest request)
        {
            try
            {
                _logger.LogInformation("Starting analytics export with format: {Format}", request.Format);

                switch (request.Format)
                {
                    case ExportFormat.Excel:
                        return await ExportAnalyticsToExcelAsync(request);
                    case ExportFormat.Csv:
                        return await ExportAnalyticsToCsvAsync(request);
                    case ExportFormat.Pdf:
                        return await ExportAnalyticsToPdfAsync(request);
                    case ExportFormat.Json:
                        return await ExportAnalyticsToJsonAsync(request);
                    default:
                        throw new ArgumentException($"Unsupported export format: {request.Format}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting analytics data");
                return new ExportResult
                {
                    Success = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        private async Task<ExportResult> ExportAnalyticsToExcelAsync(AnalyticsExportRequest request)
        {
            using var package = new ExcelPackage();
            
            // Fetch analytics data from admin dashboard
            var adminDashboard = await _analyticsService.GetAdminDashboardAsync(request.Period);

            int recordCount = 0;

            // Create Overview worksheet
            if (request.Sections.Contains(AnalyticsSection.UserAnalytics) || request.Sections.Count == 0)
            {
                var worksheet = package.Workbook.Worksheets.Add("Tổng quan người dùng");
                await CreateUserAnalyticsWorksheetAsync(worksheet, adminDashboard, request.Language);
                recordCount += 10; // Approximate count for overview stats
            }

            // Create Event Analytics worksheet
            if (request.Sections.Contains(AnalyticsSection.EventAnalytics) || request.Sections.Count == 0)
            {
                var worksheet = package.Workbook.Worksheets.Add("Tổng quan sự kiện");
                await CreateEventAnalyticsWorksheetAsync(worksheet, adminDashboard, request.Language);
                recordCount += 10; // Approximate count for overview stats
            }



            // Create Role Distribution worksheet
            if (request.Sections.Contains(AnalyticsSection.RoleDistribution) || request.Sections.Count == 0)
            {
                var worksheet = package.Workbook.Worksheets.Add("Phân bố vai trò");
                await CreateRoleDistributionWorksheetAsync(worksheet, adminDashboard.RoleDistribution, request.Language);
                recordCount += adminDashboard.RoleDistribution.Count;
            }

            var data = package.GetAsByteArray();
            var fileName = await GenerateFileNameAsync("Analytics", request.Format, request.Language);

            return new ExportResult
            {
                Success = true,
                Data = data,
                FileName = fileName,
                ContentType = await GetContentTypeForFormat(request.Format),
                RecordCount = recordCount,
                FileSizeBytes = data.Length
            };
        }

        private async Task CreateUserAnalyticsWorksheetAsync(ExcelWorksheet worksheet, AdminDashboardDto adminDashboard, string language)
        {
            // Title
            worksheet.Cells[1, 1].Value = "THỐNG KÊ NGƯỜI DÙNG";
            worksheet.Cells[1, 1].Style.Font.Size = 16;
            worksheet.Cells[1, 1].Style.Font.Bold = true;
            worksheet.Cells[1, 1, 1, 4].Merge = true;

            // Headers and Data
            var startRow = 3;
            
            // User Statistics
            worksheet.Cells[startRow, 1].Value = "Tổng số người dùng";
            worksheet.Cells[startRow, 2].Value = adminDashboard.TotalUsers;
            
            worksheet.Cells[startRow + 1, 1].Value = "Tổng số tình nguyện viên";
            worksheet.Cells[startRow + 1, 2].Value = adminDashboard.TotalVolunteers;
            
            worksheet.Cells[startRow + 2, 1].Value = "Tổng số tổ chức";
            worksheet.Cells[startRow + 2, 2].Value = adminDashboard.TotalOrganizations;

            // Styling
            var dataRange = worksheet.Cells[startRow, 1, startRow + 2, 2];
            dataRange.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            dataRange.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            dataRange.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            dataRange.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            
            // Bold the labels
            worksheet.Cells[startRow, 1, startRow + 2, 1].Style.Font.Bold = true;
            
            // Auto-fit columns
            worksheet.Cells.AutoFitColumns();

            await Task.CompletedTask;
        }

        private async Task CreateEventAnalyticsWorksheetAsync(ExcelWorksheet worksheet, AdminDashboardDto adminDashboard, string language)
        {
            // Title
            worksheet.Cells[1, 1].Value = "THỐNG KÊ SỰ KIỆN";
            worksheet.Cells[1, 1].Style.Font.Size = 16;
            worksheet.Cells[1, 1].Style.Font.Bold = true;
            worksheet.Cells[1, 1, 1, 4].Merge = true;

            var startRow = 3;
            
            // Event Statistics
            worksheet.Cells[startRow, 1].Value = "Tổng số sự kiện";
            worksheet.Cells[startRow, 2].Value = adminDashboard.TotalEvents;
            
            worksheet.Cells[startRow + 1, 1].Value = "Tổng số đăng ký";
            worksheet.Cells[startRow + 1, 2].Value = adminDashboard.TotalRegistrations;
            
            worksheet.Cells[startRow + 2, 1].Value = "Tổng số đối tác";
            worksheet.Cells[startRow + 2, 2].Value = adminDashboard.TotalPartners;
            
            worksheet.Cells[startRow + 3, 1].Value = "Tổng số điều phối viên";
            worksheet.Cells[startRow + 3, 2].Value = adminDashboard.TotalCoordinators;
            
            worksheet.Cells[startRow + 4, 1].Value = "Xác minh đang chờ";
            worksheet.Cells[startRow + 4, 2].Value = adminDashboard.PendingVerifications;
            
            // Styling
            var dataRange = worksheet.Cells[startRow, 1, startRow + 4, 2];
            dataRange.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            dataRange.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            dataRange.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            dataRange.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            
            worksheet.Cells[startRow, 1, startRow + 5, 1].Style.Font.Bold = true;
            worksheet.Cells.AutoFitColumns();

            await Task.CompletedTask;
        }





        private async Task CreateRoleDistributionWorksheetAsync(ExcelWorksheet worksheet, IEnumerable<RoleDistributionDto> roleDistribution, string language)
        {
            // Title
            worksheet.Cells[1, 1].Value = "PHÂN BỐ VAI TRÒ NGƯỜI DÙNG";
            worksheet.Cells[1, 1].Style.Font.Size = 16;
            worksheet.Cells[1, 1].Style.Font.Bold = true;
            worksheet.Cells[1, 1, 1, 3].Merge = true;

            // Headers
            var startRow = 3;
            worksheet.Cells[startRow, 1].Value = "Vai trò";
            worksheet.Cells[startRow, 2].Value = "Số lượng";
            worksheet.Cells[startRow, 3].Value = "Tỷ lệ (%)";

            // Data
            var row = startRow + 1;
            foreach (var item in roleDistribution)
            {
                worksheet.Cells[row, 1].Value = item.RoleName;
                worksheet.Cells[row, 2].Value = item.UserCount;
                worksheet.Cells[row, 3].Value = Math.Round(item.Percentage, 2);
                row++;
            }

            // Styling
            var headerRange = worksheet.Cells[startRow, 1, startRow, 3];
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            headerRange.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightYellow);

            var dataRange = worksheet.Cells[startRow, 1, row - 1, 3];
            dataRange.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            dataRange.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            dataRange.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            dataRange.Style.Border.Right.Style = ExcelBorderStyle.Thin;

            worksheet.Cells.AutoFitColumns();

            await Task.CompletedTask;
        }





        private async Task<ExportResult> ExportAnalyticsToCsvAsync(AnalyticsExportRequest request)
        {
            // For CSV, we'll export a combined view of all analytics data
            var adminDashboard = await _analyticsService.GetAdminDashboardAsync(request.Period);

            var csvData = new List<dynamic>();

            // Add user analytics summary
            csvData.Add(new
            {
                Type = "User Analytics",
                Metric = "Total Users",
                Value = adminDashboard.TotalUsers.ToString(),
                Date = DateTime.Now.ToString("yyyy-MM-dd")
            });

            csvData.Add(new
            {
                Type = "User Analytics",
                Metric = "Total Volunteers",
                Value = adminDashboard.TotalVolunteers.ToString(),
                Date = DateTime.Now.ToString("yyyy-MM-dd")
            });

            // Add event analytics summary
            csvData.Add(new
            {
                Type = "Event Analytics",
                Metric = "Total Events",
                Value = adminDashboard.TotalEvents.ToString(),
                Date = DateTime.Now.ToString("yyyy-MM-dd")
            });

            // Add role distribution data
            foreach (var role in adminDashboard.RoleDistribution)
            {
                csvData.Add(new
                {
                    Type = "Role Distribution",
                    Metric = role.RoleName,
                    Value = role.UserCount.ToString(),
                    Date = DateTime.Now.ToString("yyyy-MM-dd")
                });
            }

            // Generate CSV
            using var writer = new StringWriter();
            using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
            
            csv.WriteRecords(csvData);
            var csvContent = writer.ToString();
            var data = Encoding.UTF8.GetBytes(csvContent);
            var fileName = await GenerateFileNameAsync("Analytics", request.Format, request.Language);

            return new ExportResult
            {
                Success = true,
                Data = data,
                FileName = fileName,
                ContentType = await GetContentTypeForFormat(request.Format),
                RecordCount = csvData.Count,
                FileSizeBytes = data.Length
            };
        }

        private Task<ExportResult> ExportAnalyticsToPdfAsync(AnalyticsExportRequest request)
        {
            // TODO: Implement PDF export using PdfSharp
            // This would create a professional PDF report with charts and analytics
            throw new NotImplementedException("PDF export for analytics will be implemented in Phase 3");
        }

        private async Task<ExportResult> ExportAnalyticsToJsonAsync(AnalyticsExportRequest request)
        {
            // Fetch all analytics data
            var adminDashboard = await _analyticsService.GetAdminDashboardAsync(request.Period);

            var analyticsData = new
            {
                ExportInfo = new
                {
                    ExportDate = DateTime.UtcNow,
                    Period = request.Period.ToString(),
                    Language = request.Language,
                    Sections = request.Sections
                },
                AdminDashboard = adminDashboard
            };

            var jsonContent = System.Text.Json.JsonSerializer.Serialize(analyticsData, new System.Text.Json.JsonSerializerOptions
            {
                WriteIndented = true,
                PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase
            });

            var data = Encoding.UTF8.GetBytes(jsonContent);
            var fileName = await GenerateFileNameAsync("Analytics", request.Format, request.Language);

            return new ExportResult
            {
                Success = true,
                Data = data,
                FileName = fileName,
                ContentType = await GetContentTypeForFormat(request.Format),
                RecordCount = adminDashboard.RoleDistribution.Count,
                FileSizeBytes = data.Length
            };
        }

        // Placeholder implementations for other export methods
        public Task<ExportResult> ExportUsersAsync(UserExportRequest request)
        {
            throw new NotImplementedException("User export will be implemented in Phase 2");
        }

        public Task<ExportResult> ExportEventsAsync(EventExportRequest request)
        {
            throw new NotImplementedException("Event export will be implemented in Phase 2");
        }

        public Task<ExportResult> ExportEventRegistrationsAsync(EventRegistrationExportRequest request)
        {
            throw new NotImplementedException("Event registration export will be implemented in Phase 2");
        }

        public Task<ExportResult> ExportOrganizationDataAsync(OrganizationExportRequest request)
        {
            throw new NotImplementedException("Organization export will be implemented in Phase 2");
        }

        public Task<string> GetContentTypeForFormat(ExportFormat format)
        {
            return Task.FromResult(format switch
            {
                ExportFormat.Excel => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ExportFormat.Csv => "text/csv",
                ExportFormat.Pdf => "application/pdf",
                ExportFormat.Json => "application/json",
                _ => "application/octet-stream"
            });
        }

        public Task<string> GenerateFileNameAsync(string baseName, ExportFormat format, string language = "vi-VN")
        {
            var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
            var extension = format switch
            {
                ExportFormat.Excel => ".xlsx",
                ExportFormat.Csv => ".csv",
                ExportFormat.Pdf => ".pdf",
                ExportFormat.Json => ".json",
                _ => ".dat"
            };

            return Task.FromResult($"{baseName}_{timestamp}{extension}");
        }
    }
}
