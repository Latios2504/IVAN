using System.Text;
using Microsoft.EntityFrameworkCore;
using ivan_api.DTOs.AIDatabaseManage;
using ivan_api.Models;

namespace ivan_api.Services.AIDatabaseServ;

public class AIDatabaseService : IAIDatabaseService
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly ILogger<AIDatabaseService> _logger;

    public AIDatabaseService(VolunteerManagementSystemContext context, ILogger<AIDatabaseService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<AIDatabaseResponseDTO> GetContextualDataAsync(QueryAnalysisDTO queryAnalysis)
    {
        var startTime = DateTime.UtcNow;
        
        try
        {
            var data = queryAnalysis.QueryCategory.ToLower() switch
            {
                "volunteer analytics" => await GetVolunteerAnalyticsAsync(queryAnalysis.OriginalQuery, queryAnalysis.Parameters),
                "event performance" => await GetEventPerformanceAsync(queryAnalysis.OriginalQuery, queryAnalysis.Parameters),
                "event count" => await GetEventCountAsync(queryAnalysis.OriginalQuery, queryAnalysis.Parameters),
                "partner insights" => await GetPartnerInsightsAsync(queryAnalysis.OriginalQuery, queryAnalysis.Parameters),
                "trend analysis" => await GetTrendAnalysisAsync(queryAnalysis.OriginalQuery, queryAnalysis.Parameters),
                _ => await GetGeneralDataAsync(queryAnalysis.RequiredTables)
            };

            var executionTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;

            return new AIDatabaseResponseDTO
            {
                Success = data.Success,
                Data = data.Data,
                QueryCategory = queryAnalysis.QueryCategory,
                TablesAccessed = string.Join(", ", queryAnalysis.RequiredTables),
                ExecutionTimeMs = executionTime,
                ErrorMessage = data.ErrorMessage
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting contextual data for query analysis");
            return new AIDatabaseResponseDTO
            {
                Success = false,
                ErrorMessage = "Lỗi khi truy vấn dữ liệu từ hệ thống"
            };
        }
    }

    public async Task<DatabaseSummaryDTO> GetRelevantDataAsync(string queryCategory)
    {
        try
        {
            var data = new Dictionary<string, object>();
            var tablesIncluded = new List<string>();

            switch (queryCategory.ToLower())
            {
                case "volunteer analytics":
                    var volunteerData = await GetVolunteerSummaryData();
                    data.Add("volunteers", volunteerData);
                    tablesIncluded.AddRange(new[] { "VolunteerProfiles", "VolunteerSkills", "EventRegistrations" });
                    break;

                case "event performance":
                    var eventData = await GetEventSummaryData();
                    data.Add("events", eventData);
                    tablesIncluded.AddRange(new[] { "Events", "EventRegistrations", "Feedback" });
                    break;

                case "partner insights":
                    var partnerData = await GetPartnerSummaryData();
                    data.Add("partners", partnerData);
                    tablesIncluded.AddRange(new[] { "Partners", "PartnerCollaborations", "Organizations" });
                    break;

                default:
                    var generalData = await GetGeneralSystemData();
                    data.Add("general", generalData);
                    tablesIncluded.AddRange(new[] { "Users", "Events", "VolunteerProfiles", "Organizations" });
                    break;
            }

            return new DatabaseSummaryDTO
            {
                Summary = await FormatDataForAIAsync(data, "summary"),
                Data = data,
                TablesIncluded = tablesIncluded,
                GeneratedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting relevant data for category: {Category}", queryCategory);
            throw;
        }
    }

    public async Task<string> FormatDataForAIAsync(object data, string format = "natural")
    {
        try
        {
            if (data is Dictionary<string, object> dict)
            {
                var sb = new StringBuilder();
                
                foreach (var kvp in dict)
                {
                    sb.AppendLine($"\n=== {kvp.Key.ToUpper()} ===");
                    
                    if (kvp.Value is IEnumerable<object> list)
                    {
                        var count = 0;
                        foreach (var item in list)
                        {
                            if (count++ > 10) // Limit to first 10 items for AI context
                            {
                                sb.AppendLine("... (và nhiều hơn nữa)");
                                break;
                            }
                            sb.AppendLine($"- {item}");
                        }
                    }
                    else
                    {
                        sb.AppendLine(kvp.Value?.ToString() ?? "N/A");
                    }
                }
                
                return sb.ToString();
            }
            
            return data?.ToString() ?? "Không có dữ liệu";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error formatting data for AI");
            return "Lỗi định dạng dữ liệu";
        }
    }

    public async Task<AIDatabaseResponseDTO> GetVolunteerAnalyticsAsync(string query, Dictionary<string, object>? parameters = null)
    {
        try
        {
            // **DEBUG LOGGING**
            _logger.LogInformation("GetVolunteerAnalyticsAsync called with query: '{Query}', parameters: {Parameters}", 
                query, parameters != null ? string.Join(", ", parameters.Select(p => $"{p.Key}={p.Value}")) : "null");

            // Check if this is a specific volunteer lookup by ID
            if (parameters != null && parameters.ContainsKey("volunteerId"))
            {
                var volunteerId = Convert.ToInt32(parameters["volunteerId"]);
                _logger.LogInformation("Found volunteerId in parameters: {VolunteerId}", volunteerId);
                return await GetSpecificVolunteerDataAsync(volunteerId);
            }

            // Check if query contains volunteer ID pattern
            var volunteerIdMatch = System.Text.RegularExpressions.Regex.Match(query, @"volunteer.*?id\s*(\d+)|id\s*(\d+).*volunteer|tình nguyện.*?id\s*(\d+)|id\s*(\d+).*tình nguyện", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            if (volunteerIdMatch.Success)
            {
                var idStr = volunteerIdMatch.Groups[1].Value ?? volunteerIdMatch.Groups[2].Value ?? volunteerIdMatch.Groups[3].Value ?? volunteerIdMatch.Groups[4].Value;
                if (int.TryParse(idStr, out int volunteerId))
                {
                    _logger.LogInformation("Found volunteerId in query regex: {VolunteerId}", volunteerId);
                    return await GetSpecificVolunteerDataAsync(volunteerId);
                }
            }

            _logger.LogInformation("No specific volunteerId found, returning general analytics");

            // General volunteer analytics
            var volunteers = await _context.VolunteerProfiles
                .Include(v => v.User)
                .Include(v => v.VolunteerSkills)
                .ThenInclude(vs => vs.Skill)
                .Where(v => v.User.IsActive == true)
                .ToListAsync();

            var totalVolunteers = volunteers.Count;
            var activeVolunteers = volunteers.Count(v => v.IsVerified.HasValue && v.IsVerified.Value);
            var skillDistribution = volunteers
                .SelectMany(v => v.VolunteerSkills)
                .GroupBy(vs => vs.Skill.SkillName)
                .ToDictionary(g => g.Key, g => g.Count());

            var summary = $"""
                THỐNG KÊ TÌNH NGUYỆN VIÊN:
                - Tổng số tình nguyện viên: {totalVolunteers}
                - Tình nguyện viên đã xác thực: {activeVolunteers}
                - Tỷ lệ xác thực: {(activeVolunteers * 100.0 / Math.Max(totalVolunteers, 1)):F1}%
                
                PHÂN BỐ KỸ NĂNG:
                {string.Join("\n", skillDistribution.Take(10).Select(kv => $"- {kv.Key}: {kv.Value} người"))}
                """;

            return new AIDatabaseResponseDTO
            {
                Success = true,
                Data = summary,
                QueryCategory = "Volunteer Analytics",
                TablesAccessed = "VolunteerProfiles, Users, VolunteerSkills, Skills"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting volunteer analytics");
            return new AIDatabaseResponseDTO
            {
                Success = false,
                ErrorMessage = ex.Message
            };
        }
    }

    // New method to get specific volunteer data by ID
    private async Task<AIDatabaseResponseDTO> GetSpecificVolunteerDataAsync(int volunteerId)
    {
        try
        {
            var volunteer = await _context.VolunteerProfiles
                .Include(v => v.User)
                .Include(v => v.VolunteerSkills)
                .ThenInclude(vs => vs.Skill)
                .Include(v => v.EventRegistrations)
                .ThenInclude(er => er.Event)
                .FirstOrDefaultAsync(v => v.VolunteerId == volunteerId);

            if (volunteer == null)
            {
                return new AIDatabaseResponseDTO
                {
                    Success = false,
                    ErrorMessage = $"Không tìm thấy tình nguyện viên có ID {volunteerId}"
                };
            }

            var skills = volunteer.VolunteerSkills?.Select(vs => vs.Skill?.SkillName).Where(s => !string.IsNullOrEmpty(s)).ToList() ?? new List<string?>();
            var events = volunteer.EventRegistrations?.Select(er => er.Event?.EventName).Where(e => !string.IsNullOrEmpty(e)).ToList() ?? new List<string?>();
            
            var volunteerInfo = $"""
                THÔNG TIN CHI TIẾT TÌNH NGUYỆN VIÊN ID {volunteerId}:
                
                === THÔNG TIN CÁ NHÂN ===
                - Email: {volunteer.User?.Email ?? "Chưa cập nhật"}
                - Mã sinh viên: {volunteer.StudentId ?? "Chưa cập nhật"}
                - Trường đại học: {volunteer.University ?? "Chưa cập nhật"}
                - Chuyên ngành: {volunteer.Major ?? "Chưa cập nhật"}
                - Năm học: {volunteer.YearOfStudy?.ToString() ?? "Chưa cập nhật"}
                - Trạng thái xác thực: {(volunteer.IsVerified == true ? "Đã xác thực" : "Chưa xác thực")}
                - Ngày đăng ký: {volunteer.CreatedAt?.ToString("dd/MM/yyyy") ?? "Chưa rõ"}
                - Lần hoạt động cuối: {volunteer.LastActiveDate?.ToString("dd/MM/yyyy") ?? "Chưa rõ"}
                
                === HOẠT ĐỘNG TÌNH NGUYỆN ===
                - Số giờ tình nguyện: {volunteer.VolunteerHours?.ToString() ?? "0"} giờ
                - Tổng số giờ đã thực hiện: {volunteer.TotalHoursVolunteered?.ToString() ?? "0"} giờ
                - Đánh giá: {volunteer.Rating?.ToString("F1") ?? "Chưa có"}/5.0 ({volunteer.RatingCount ?? 0} lượt đánh giá)
                - Thời gian có sẵn: {volunteer.Availability ?? "Chưa cập nhật"}
                
                === KỸ NĂNG ({skills.Count} kỹ năng) ===
                {(skills.Any() ? string.Join("\n", skills.Select(s => $"- {s}")) : "Chưa có kỹ năng nào được đăng ký")}
                
                === SỰ KIỆN THAM GIA ({events.Count} sự kiện) ===
                {(events.Any() ? string.Join("\n", events.Take(10).Select(e => $"- {e}")) : "Chưa tham gia sự kiện nào")}
                {(events.Count > 10 ? $"\n... và {events.Count - 10} sự kiện khác" : "")}
                
                === THÔNG TIN BỔ SUNG ===
                - Động lực tham gia: {volunteer.Motivation ?? "Chưa có thông tin"}
                - Kinh nghiệm: {volunteer.Experience ?? "Chưa có kinh nghiệm"}
                - Kỹ năng khác: {volunteer.Skills ?? "Chưa cập nhật"}
                """;

            return new AIDatabaseResponseDTO
            {
                Success = true,
                Data = volunteerInfo,
                QueryCategory = "Volunteer Details",
                TablesAccessed = "VolunteerProfiles, Users, VolunteerSkills, Skills, EventRegistrations, Events"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting specific volunteer data for ID {VolunteerId}", volunteerId);
            return new AIDatabaseResponseDTO
            {
                Success = false,
                ErrorMessage = $"Lỗi khi truy xuất thông tin tình nguyện viên ID {volunteerId}: {ex.Message}"
            };
        }
    }

    public async Task<AIDatabaseResponseDTO> GetEventPerformanceAsync(string query, Dictionary<string, object>? parameters = null)
    {
        try
        {
            var events = await _context.Events
                .Include(e => e.EventRegistrations)
                .Include(e => e.Category)
                .Include(e => e.Organization)
                .Include(e => e.Status)
                .Where(e => e.IsActive.HasValue && e.IsActive.Value)
                .ToListAsync();

            var totalEvents = events.Count;
            
            // Add null check for Status navigation property
            var completedEvents = events.Count(e => e.Status != null && e.Status.StatusName == "Completed");
            
            // Handle case where no events exist to avoid division by zero
            var avgRegistrations = events.Any() ? events.Average(e => e.CurrentVolunteers ?? 0) : 0;

            var topEvents = events
                .Where(e => e.Rating.HasValue) // Only include events with ratings
                .OrderByDescending(e => e.Rating ?? 0)
                .Take(5)
                .Select(e => $"{e.EventName} - Rating: {e.Rating:F1}")
                .ToList();

            var summary = $"""
                HIỆU SUẤT SỰ KIỆN:
                - Tổng số sự kiện: {totalEvents}
                - Sự kiện đã hoàn thành: {completedEvents}
                - Trung bình tình nguyện viên/sự kiện: {avgRegistrations:F1}
                
                TOP 5 SỰ KIỆN ĐƯỢC ĐÁNH GIÁ CAO:
                {(topEvents.Any() ? string.Join("\n", topEvents.Select(e => $"- {e}")) : "- Chưa có sự kiện nào được đánh giá")}
                """;

            return new AIDatabaseResponseDTO
            {
                Success = true,
                Data = summary,
                QueryCategory = "Event Performance",
                TablesAccessed = "Events, EventRegistrations, EventCategories, Organizations, EventStatus"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting event performance");
            return new AIDatabaseResponseDTO
            {
                Success = false,
                ErrorMessage = ex.Message
            };
        }
    }

    public async Task<AIDatabaseResponseDTO> GetPartnerInsightsAsync(string query, Dictionary<string, object>? parameters = null)
    {
        try
        {
            var partners = await _context.Partners
                .Include(p => p.User)
                .Where(p => p.IsActive.HasValue && p.IsActive.Value)
                .ToListAsync();

            var totalPartners = partners.Count;
            var verifiedPartners = partners.Count(p => p.IsVerified.HasValue && p.IsVerified.Value);

            var summary = $"""
                THÔNG TIN ĐỐI TÁC:
                - Tổng số đối tác: {totalPartners}
                - Đối tác đã xác thực: {verifiedPartners}
                - Tỷ lệ xác thực: {(verifiedPartners * 100.0 / Math.Max(totalPartners, 1)):F1}%
                """;

            return new AIDatabaseResponseDTO
            {
                Success = true,
                Data = summary,
                QueryCategory = "Partner Insights",
                TablesAccessed = "Partners, Users"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting partner insights");
            return new AIDatabaseResponseDTO
            {
                Success = false,
                ErrorMessage = ex.Message
            };
        }
    }

    public async Task<AIDatabaseResponseDTO> GetTrendAnalysisAsync(string query, Dictionary<string, object>? parameters = null)
    {
        try
        {
            var last30Days = DateTime.UtcNow.AddDays(-30);
            
            var recentUsers = await _context.Users
                .Where(u => u.CreatedAt >= last30Days)
                .GroupBy(u => u.CreatedAt.HasValue ? u.CreatedAt.Value.Date : DateTime.MinValue.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .OrderBy(x => x.Date)
                .ToListAsync();

            var recentEvents = await _context.Events
                .Where(e => e.CreatedAt >= last30Days)
                .GroupBy(e => e.CreatedAt.HasValue ? e.CreatedAt.Value.Date : DateTime.MinValue.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .OrderBy(x => x.Date)
                .ToListAsync();

            var summary = $"""
                XU HƯỚNG 30 NGÀY QUA:
                
                NGƯỜI DÙNG MỚI:
                {string.Join("\n", recentUsers.Take(10).Select(u => $"- {u.Date:dd/MM}: {u.Count} người"))}
                
                SỰ KIỆN MỚI:
                {string.Join("\n", recentEvents.Take(10).Select(e => $"- {e.Date:dd/MM}: {e.Count} sự kiện"))}
                """;

            return new AIDatabaseResponseDTO
            {
                Success = true,
                Data = summary,
                QueryCategory = "Trend Analysis",
                TablesAccessed = "Users, Events"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting trend analysis");
            return new AIDatabaseResponseDTO
            {
                Success = false,
                ErrorMessage = ex.Message
            };
        }
    }

    public async Task<List<string>> GetRelatedTablesAsync(List<string> baseTables)
    {
        // Define table relationships for intelligent data fetching
        var tableRelationships = new Dictionary<string, List<string>>
        {
            ["VolunteerProfiles"] = new() { "Users", "VolunteerSkills", "Skills", "EventRegistrations" },
            ["Events"] = new() { "EventCategories", "EventRegistrations", "Organizations", "Feedback" },
            ["Partners"] = new() { "Users", "PartnerCollaborations", "Organizations" },
            ["Organizations"] = new() { "Users", "OrganizationTypes", "Events", "PartnerCollaborations" }
        };

        var relatedTables = new HashSet<string>(baseTables);
        
        foreach (var table in baseTables)
        {
            if (tableRelationships.ContainsKey(table))
            {
                foreach (var related in tableRelationships[table])
                {
                    relatedTables.Add(related);
                }
            }
        }

        return relatedTables.ToList();
    }

    public async Task<Dictionary<string, object>> GetDataSummaryAsync(List<string> tableNames)
    {
        var summary = new Dictionary<string, object>();

        foreach (var tableName in tableNames)
        {
            try
            {
                var count = tableName.ToLower() switch
                {
                    "users" => await _context.Users.CountAsync(),
                    "volunteerprofiles" => await _context.VolunteerProfiles.CountAsync(),
                    "events" => await _context.Events.CountAsync(),
                    "partners" => await _context.Partners.CountAsync(),
                    "organizations" => await _context.Organizations.CountAsync(),
                    _ => 0
                };

                summary[tableName] = $"{count} records";
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Could not get count for table {TableName}: {Error}", tableName, ex.Message);
                summary[tableName] = "Unknown";
            }
        }

        return summary;
    }

    public async Task LogQueryExecutionAsync(int userId, string query, string tablesAccessed, int executionTime, int? instructionId = null)
    {
        try
        {
            var analytics = new AiQueryAnalytic
            {
                UserId = userId,
                InstructionId = instructionId,
                QueryText = query,
                DataTablesAccessed = tablesAccessed,
                ExecutionTime = executionTime,
                CreatedAt = DateTime.UtcNow
            };

            _context.AiQueryAnalytics.Add(analytics);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging query execution for user {UserId}", userId);
        }
    }

    // Private helper methods
    private async Task<object> GetVolunteerSummaryData()
    {
        return await _context.VolunteerProfiles
            .Include(v => v.User)
            .Select(v => new
            {
                v.VolunteerId,
                v.User.Email,
                v.IsVerified,
                v.VolunteerHours,
                v.Rating
            })
            .Take(50)
            .ToListAsync();
    }

    private async Task<object> GetEventSummaryData()
    {
        return await _context.Events
            .Include(e => e.Category)
            .Include(e => e.Status)
            .Select(e => new
            {
                e.EventId,
                e.EventName,
                CategoryName = e.Category != null ? e.Category.CategoryName : "Chưa phân loại",
                StatusName = e.Status != null ? e.Status.StatusName : "Chưa xác định",
                e.CurrentVolunteers,
                e.Rating,
                e.CreatedAt
            })
            .Take(50)
            .ToListAsync();
    }

    private async Task<object> GetPartnerSummaryData()
    {
        return await _context.Partners
            .Include(p => p.User)
            .Select(p => new
            {
                p.PartnerId,
                p.CompanyName,
                p.User.Email,
                p.IsVerified,
                p.Rating
            })
            .Take(50)
            .ToListAsync();
    }

    private async Task<object> GetGeneralSystemData()
    {
        return new
        {
            TotalUsers = await _context.Users.CountAsync(),
            TotalVolunteers = await _context.VolunteerProfiles.CountAsync(),
            TotalEvents = await _context.Events.CountAsync(),
            TotalPartners = await _context.Partners.CountAsync(),
            TotalOrganizations = await _context.Organizations.CountAsync()
        };
    }

    private async Task<AIDatabaseResponseDTO> GetGeneralDataAsync(List<string> requiredTables)
    {
        var summary = await GetDataSummaryAsync(requiredTables);
        
        return new AIDatabaseResponseDTO
        {
            Success = true,
            Data = await FormatDataForAIAsync(summary),
            QueryCategory = "General",
            TablesAccessed = string.Join(", ", requiredTables)
        };
    }

    public async Task<AIDatabaseResponseDTO> GetEventCountAsync(string query, Dictionary<string, object>? parameters = null)
    {
        try
        {
            // Simple event count without navigation properties to avoid null reference
            var totalEvents = await _context.Events.CountAsync(e => e.IsActive.HasValue && e.IsActive.Value);
            
            // Get basic event statistics
            var activeEvents = await _context.Events
                .Where(e => e.IsActive.HasValue && e.IsActive.Value)
                .Where(e => e.EndDate > DateTime.Now)
                .CountAsync();
                
            var pastEvents = await _context.Events
                .Where(e => e.IsActive.HasValue && e.IsActive.Value)
                .Where(e => e.EndDate <= DateTime.Now)
                .CountAsync();

            // Get events by category with null checks
            var eventsByCategory = await _context.Events
                .Include(e => e.Category)
                .Where(e => e.IsActive.HasValue && e.IsActive.Value)
                .GroupBy(e => e.Category != null ? e.Category.CategoryName : "Chưa phân loại")
                .Select(g => new { Category = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(5)
                .ToListAsync();

            var summary = $"""
                THỐNG KÊ SỰ KIỆN:
                - Tổng số sự kiện hiện có: {totalEvents}
                - Sự kiện đang diễn ra/sắp tới: {activeEvents}
                - Sự kiện đã kết thúc: {pastEvents}
                
                PHÂN BỐ THEO DANH MỤC:
                {string.Join("\n", eventsByCategory.Select(c => $"- {c.Category}: {c.Count} sự kiện"))}
                """;

            return new AIDatabaseResponseDTO
            {
                Success = true,
                Data = summary,
                QueryCategory = "Event Count",
                TablesAccessed = "Events, EventCategories"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting event count");
            return new AIDatabaseResponseDTO
            {
                Success = false,
                ErrorMessage = $"Lỗi khi đếm số sự kiện: {ex.Message}"
            };
        }
    }
}
