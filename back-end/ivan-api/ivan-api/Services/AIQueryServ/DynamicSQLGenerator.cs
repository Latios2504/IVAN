using System.Text;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using ivan_api.Models;

namespace ivan_api.Services.AIQueryServ;

public class DynamicSQLGenerator
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly ILogger<DynamicSQLGenerator> _logger;

    public DynamicSQLGenerator(VolunteerManagementSystemContext context, ILogger<DynamicSQLGenerator> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<string> GenerateAndExecuteQueryAsync(string naturalLanguageQuery)
    {
        try
        {
            var sqlQuery = await ConvertToSQLAsync(naturalLanguageQuery);
            _logger.LogInformation("Generated SQL: {SQL}", sqlQuery);
            
            if (string.IsNullOrEmpty(sqlQuery))
            {
                return "Không thể tạo truy vấn SQL từ câu hỏi này.";
            }

            var result = await ExecuteRawSQLAsync(sqlQuery);
            return FormatResultForAI(result, naturalLanguageQuery);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in dynamic SQL generation");
            return $"Lỗi khi thực hiện truy vấn: {ex.Message}";
        }
    }

    private async Task<string> ConvertToSQLAsync(string query)
    {
        var queryLower = query.ToLower();
        
        // **PATTERN MATCHING FOR COMMON QUERIES**
        
        // Top volunteers by hours
        if (Regex.IsMatch(queryLower, @"(top|liệt kê).*(tình nguyện viên|volunteer).*(giờ|hour|hoạt động)"))
        {
            var topN = ExtractNumber(query) ?? 5;
            return $"""
                SELECT TOP {topN}
                    vp.VolunteerId,
                    u.Email,
                    vp.TotalHoursVolunteered,
                    vp.Rating,
                    vp.University,
                    vp.Major
                FROM VolunteerProfiles vp
                JOIN Users u ON vp.UserId = u.UserId
                WHERE vp.TotalHoursVolunteered IS NOT NULL AND vp.TotalHoursVolunteered > 0
                ORDER BY vp.TotalHoursVolunteered DESC
                """;
        }

        // Highest volunteer hours
        if (Regex.IsMatch(queryLower, @"(tình nguyện viên|volunteer).*(cao nhất|highest|nhiều nhất|most).*(giờ|hour)"))
        {
            return """
                SELECT TOP 1
                    vp.VolunteerId,
                    u.Email,
                    vp.TotalHoursVolunteered,
                    vp.Rating,
                    vp.University,
                    vp.Major
                FROM VolunteerProfiles vp
                JOIN Users u ON vp.UserId = u.UserId
                WHERE vp.TotalHoursVolunteered IS NOT NULL
                ORDER BY vp.TotalHoursVolunteered DESC
                """;
        }

        // Most popular events
        if (Regex.IsMatch(queryLower, @"(sự kiện|event).*(nhiều người|popular|most).*(đăng ký|registration)"))
        {
            var topN = ExtractNumber(query) ?? 5;
            return $"""
                SELECT TOP {topN}
                    e.EventId,
                    e.EventName,
                    COUNT(er.RegistrationId) as TotalRegistrations,
                    e.MaxVolunteers
                FROM Events e
                LEFT JOIN EventRegistrations er ON e.EventId = er.EventId
                WHERE e.IsActive = 1
                GROUP BY e.EventId, e.EventName, e.MaxVolunteers
                ORDER BY COUNT(er.RegistrationId) DESC
                """;
        }

        // Event count
        if (Regex.IsMatch(queryLower, @"(bao nhiêu|how many).*(sự kiện|event)"))
        {
            return """
                SELECT 
                    COUNT(*) as TotalEvents,
                    SUM(CASE WHEN e.EndDate > GETDATE() THEN 1 ELSE 0 END) as ActiveEvents,
                    SUM(CASE WHEN e.EndDate <= GETDATE() THEN 1 ELSE 0 END) as CompletedEvents
                FROM Events e
                WHERE e.IsActive = 1
                """;
        }

        // Volunteer count
        if (Regex.IsMatch(queryLower, @"(bao nhiêu|how many).*(tình nguyện viên|volunteer)"))
        {
            return """
                SELECT 
                    COUNT(*) as TotalVolunteers,
                    SUM(CASE WHEN vp.IsVerified = 1 THEN 1 ELSE 0 END) as VerifiedVolunteers,
                    SUM(CASE WHEN vp.TotalHoursVolunteered > 0 THEN 1 ELSE 0 END) as ActiveVolunteers
                FROM VolunteerProfiles vp
                JOIN Users u ON vp.UserId = u.UserId
                WHERE u.IsActive = 1
                """;
        }

        // Compare volunteers
        if (Regex.IsMatch(queryLower, @"(so sánh|compare).*(tình nguyện viên|volunteer)"))
        {
            return """
                SELECT 
                    vp.VolunteerId,
                    u.Email,
                    vp.TotalHoursVolunteered,
                    vp.Rating,
                    vp.University,
                    vp.Major
                FROM VolunteerProfiles vp
                JOIN Users u ON vp.UserId = u.UserId
                WHERE vp.TotalHoursVolunteered IS NOT NULL
                ORDER BY vp.TotalHoursVolunteered DESC
                """;
        }

        return string.Empty;
    }

    private int? ExtractNumber(string text)
    {
        var match = Regex.Match(text, @"\b(\d+)\b");
        if (match.Success && int.TryParse(match.Value, out int number))
        {
            return number;
        }
        return null;
    }

    private async Task<List<Dictionary<string, object>>> ExecuteRawSQLAsync(string sql)
    {
        using var command = _context.Database.GetDbConnection().CreateCommand();
        command.CommandText = sql;
        
        await _context.Database.OpenConnectionAsync();
        
        using var reader = await command.ExecuteReaderAsync();
        var results = new List<Dictionary<string, object>>();
        
        while (await reader.ReadAsync())
        {
            var row = new Dictionary<string, object>();
            for (int i = 0; i < reader.FieldCount; i++)
            {
                row[reader.GetName(i)] = reader.GetValue(i);
            }
            results.Add(row);
        }
        
        return results;
    }

    private string FormatResultForAI(List<Dictionary<string, object>> results, string originalQuery)
    {
        if (!results.Any())
        {
            return "Không tìm thấy dữ liệu phù hợp với câu hỏi của bạn.";
        }

        var queryLower = originalQuery.ToLower();
        
        // Format based on query type
        if (Regex.IsMatch(queryLower, @"(top|liệt kê).*(tình nguyện viên|volunteer)"))
        {
            var sb = new StringBuilder();
            sb.AppendLine($"TOP {results.Count} TÌNH NGUYỆN VIÊN CÓ SỐ GIỜ HOẠT ĐỘNG NHIỀU NHẤT:");
            sb.AppendLine();
            
            for (int i = 0; i < results.Count; i++)
            {
                var row = results[i];
                var email = row.GetValueOrDefault("Email", "N/A").ToString();
                var hours = Convert.ToInt32(row.GetValueOrDefault("TotalHoursVolunteered", 0));
                var rating = row.GetValueOrDefault("Rating", "Chưa có").ToString();
                var university = row.GetValueOrDefault("University", "Chưa cập nhật").ToString();
                var major = row.GetValueOrDefault("Major", "Chưa cập nhật").ToString();
                
                sb.AppendLine($"{i + 1}. {email?.Replace("@gmail.com", "")} (ID: {row["VolunteerId"]})");
                sb.AppendLine($"   ⏰ Số giờ: {hours:N0} giờ");
                sb.AppendLine($"   ⭐ Đánh giá: {rating}/5.0");
                sb.AppendLine($"   🎓 Trường: {university}");
                sb.AppendLine($"   📚 Ngành: {major}");
                sb.AppendLine();
            }
            
            return sb.ToString();
        }

        if (Regex.IsMatch(queryLower, @"(cao nhất|highest|nhiều nhất)"))
        {
            var row = results.First();
            var email = row.GetValueOrDefault("Email", "N/A").ToString();
            var hours = Convert.ToInt32(row.GetValueOrDefault("TotalHoursVolunteered", 0));
            
            return $"Tình nguyện viên có số giờ tình nguyện cao nhất là {email?.Replace("@gmail.com", "")} với {hours:N0} giờ.";
        }

        if (Regex.IsMatch(queryLower, @"(sự kiện|event).*(nhiều người|popular)"))
        {
            var sb = new StringBuilder();
            sb.AppendLine($"TOP {results.Count} SỰ KIỆN CÓ NHIỀU NGƯỜI ĐĂNG KÝ NHẤT:");
            sb.AppendLine();
            
            for (int i = 0; i < results.Count; i++)
            {
                var row = results[i];
                var eventName = row.GetValueOrDefault("EventName", "N/A").ToString();
                var registrations = Convert.ToInt32(row.GetValueOrDefault("TotalRegistrations", 0));
                var maxVolunteers = Convert.ToInt32(row.GetValueOrDefault("MaxVolunteers", 0));
                
                sb.AppendLine($"{i + 1}. {eventName} (ID: {row["EventId"]})");
                sb.AppendLine($"   👥 Đăng ký: {registrations}/{maxVolunteers} người");
                sb.AppendLine();
            }
            
            return sb.ToString();
        }

        // Generic formatting for other queries
        var genericResult = new StringBuilder();
        foreach (var row in results.Take(10))
        {
            genericResult.AppendLine(string.Join(" | ", row.Select(kvp => $"{kvp.Key}: {kvp.Value}")));
        }
        
        return genericResult.ToString();
    }
}
