using System.Text.RegularExpressions;
using ivan_api.DTOs;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services;

public class AIQueryEngine : IAIQueryEngine
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly ILogger<AIQueryEngine> _logger;
    private readonly IAIDatabaseService _aiDatabaseService;

    public AIQueryEngine(
        VolunteerManagementSystemContext context, 
        ILogger<AIQueryEngine> logger,
        IAIDatabaseService aiDatabaseService)
    {
        _context = context;
        _logger = logger;
        _aiDatabaseService = aiDatabaseService;
    }

    public async Task<QueryAnalysisDTO> AnalyzeQueryAsync(string naturalLanguageQuery)
    {
        try
        {
            var query = naturalLanguageQuery.ToLower();
            
            var category = await CategorizeQueryAsync(query);
            var requiredTables = await GetRequiredTablesAsync(category, query);
            var complexity = await EstimateQueryComplexityAsync(query);
            var parameters = await ExtractQueryParametersAsync(query);

            return new QueryAnalysisDTO
            {
                QueryCategory = category,
                RequiredTables = requiredTables,
                QueryType = DetermineQueryType(query),
                Parameters = parameters,
                EstimatedComplexity = complexity
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing query: {Query}", naturalLanguageQuery);
            
            // Return default analysis
            return new QueryAnalysisDTO
            {
                QueryCategory = "General",
                RequiredTables = new List<string> { "Users", "Events" },
                QueryType = "lookup",
                EstimatedComplexity = "Low"
            };
        }
    }

    public async Task<AIDatabaseResponseDTO> ProcessNaturalQueryAsync(string query, int userId, string? instructionProfile = null)
    {
        try
        {
            // Analyze the query
            var analysis = await AnalyzeQueryAsync(query);
            
            // Get relevant data based on analysis
            var response = await _aiDatabaseService.GetContextualDataAsync(analysis);
            
            // Log the execution
            await _aiDatabaseService.LogQueryExecutionAsync(
                userId, 
                query, 
                response.TablesAccessed, 
                response.ExecutionTimeMs
            );

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing natural query for user {UserId}: {Query}", userId, query);
            
            return new AIDatabaseResponseDTO
            {
                Success = false,
                ErrorMessage = "Không thể xử lý truy vấn. Vui lòng thử lại."
            };
        }
    }

    public async Task<string> CategorizeQueryAsync(string query)
    {
        var queryLower = query.ToLower();

        // Check for predefined categories in database
        var categories = await _context.AiQueryCategories
            .Where(c => c.IsActive)
            .ToListAsync();

        // Use keyword matching to categorize
        if (ContainsVolunteerKeywords(queryLower))
            return "Volunteer Analytics";
        
        if (ContainsEventKeywords(queryLower))
            return "Event Performance";
        
        if (ContainsPartnerKeywords(queryLower))
            return "Partner Insights";
        
        if (ContainsTrendKeywords(queryLower))
            return "Trend Analysis";

        return "General";
    }

    public async Task<List<string>> GetRequiredTablesAsync(string queryCategory, string specificQuery)
    {
        var tables = new List<string>();

        switch (queryCategory.ToLower())
        {
            case "volunteer analytics":
                tables.AddRange(new[] { "VolunteerProfiles", "Users", "VolunteerSkills", "Skills" });
                if (specificQuery.Contains("event") || specificQuery.Contains("sự kiện"))
                    tables.AddRange(new[] { "EventRegistrations", "Events" });
                break;

            case "event performance":
                tables.AddRange(new[] { "Events", "EventRegistrations", "EventCategories", "Organizations" });
                if (specificQuery.Contains("feedback") || specificQuery.Contains("đánh giá"))
                    tables.Add("Feedback");
                break;

            case "partner insights":
                tables.AddRange(new[] { "Partners", "Users", "PartnerCollaborations" });
                if (specificQuery.Contains("organization") || specificQuery.Contains("tổ chức"))
                    tables.Add("Organizations");
                break;

            case "trend analysis":
                tables.AddRange(new[] { "Users", "Events", "VolunteerProfiles", "EventRegistrations" });
                break;

            default:
                tables.AddRange(new[] { "Users", "Events", "VolunteerProfiles" });
                break;
        }

        // Add related tables
        var relatedTables = await _aiDatabaseService.GetRelatedTablesAsync(tables);
        tables.AddRange(relatedTables.Except(tables));

        return tables.Distinct().ToList();
    }

    public async Task<string> EstimateQueryComplexityAsync(string query)
    {
        var queryLower = query.ToLower();
        var complexityScore = 0;

        // Check for complexity indicators
        if (Regex.IsMatch(queryLower, @"\b(trend|xu hướng|so sánh|compare|phân tích|analyze)\b"))
            complexityScore += 2;

        if (Regex.IsMatch(queryLower, @"\b(report|báo cáo|dashboard|biểu đồ|chart)\b"))
            complexityScore += 2;

        if (Regex.IsMatch(queryLower, @"\b(last month|tháng trước|year|năm|quarter|quý)\b"))
            complexityScore += 1;

        if (Regex.IsMatch(queryLower, @"\b(all|tất cả|every|mỗi|total|tổng)\b"))
            complexityScore += 1;

        return complexityScore switch
        {
            >= 4 => "High",
            >= 2 => "Medium",
            _ => "Low"
        };
    }

    public async Task<Dictionary<string, object>> ExtractQueryParametersAsync(string query)
    {
        var parameters = new Dictionary<string, object>();
        var queryLower = query.ToLower();

        // Extract time periods
        if (Regex.IsMatch(queryLower, @"\b(today|hôm nay)\b"))
            parameters["timeframe"] = "today";
        else if (Regex.IsMatch(queryLower, @"\b(this week|tuần này)\b"))
            parameters["timeframe"] = "week";
        else if (Regex.IsMatch(queryLower, @"\b(this month|tháng này)\b"))
            parameters["timeframe"] = "month";
        else if (Regex.IsMatch(queryLower, @"\b(this year|năm này)\b"))
            parameters["timeframe"] = "year";

        // Extract numbers
        var numberMatches = Regex.Matches(query, @"\b(\d+)\b");
        if (numberMatches.Count > 0)
        {
            parameters["numbers"] = numberMatches.Select(m => int.Parse(m.Value)).ToList();
        }

        // Extract specific entities
        if (Regex.IsMatch(queryLower, @"\b(top|cao nhất|best|tốt nhất)\b"))
            parameters["orderBy"] = "desc";
        
        if (Regex.IsMatch(queryLower, @"\b(bottom|thấp nhất|worst|tệ nhất)\b"))
            parameters["orderBy"] = "asc";

        return parameters;
    }

    public async Task<string> OptimizeQueryForDatabaseAsync(string naturalQuery, string category)
    {
        // This would contain logic to optimize database queries
        // For now, return the natural query as-is
        return naturalQuery;
    }

    public async Task<bool> ValidateQuerySafetyAsync(string query)
    {
        var queryLower = query.ToLower();
        
        // Check for potentially dangerous operations
        var dangerousKeywords = new[] 
        { 
            "delete", "drop", "truncate", "update", "insert", 
            "alter", "create", "grant", "revoke", "exec", "execute" 
        };

        return !dangerousKeywords.Any(keyword => queryLower.Contains(keyword));
    }

    public async Task<string> BuildQueryContextAsync(QueryAnalysisDTO analysis, DatabaseSummaryDTO? existingData = null)
    {
        var context = $"Phân loại truy vấn: {analysis.QueryCategory}\n";
        context += $"Bảng dữ liệu liên quan: {string.Join(", ", analysis.RequiredTables)}\n";
        context += $"Độ phức tạp: {analysis.EstimatedComplexity}\n";

        if (analysis.Parameters.Any())
        {
            context += "Tham số: " + string.Join(", ", analysis.Parameters.Select(kv => $"{kv.Key}: {kv.Value}")) + "\n";
        }

        if (existingData != null)
        {
            context += $"\nDữ liệu có sẵn từ: {string.Join(", ", existingData.TablesIncluded)}\n";
            context += $"Được tạo lúc: {existingData.GeneratedAt:dd/MM/yyyy HH:mm}\n";
        }

        return context;
    }

    // Private helper methods
    private string DetermineQueryType(string query)
    {
        var queryLower = query.ToLower();

        if (Regex.IsMatch(queryLower, @"\b(how many|bao nhiêu|count|đếm)\b"))
            return "count";
        
        if (Regex.IsMatch(queryLower, @"\b(show|hiển thị|list|danh sách|get|lấy)\b"))
            return "lookup";
        
        if (Regex.IsMatch(queryLower, @"\b(analyze|phân tích|trend|xu hướng|compare|so sánh)\b"))
            return "analytics";
        
        if (Regex.IsMatch(queryLower, @"\b(report|báo cáo|summary|tóm tắt)\b"))
            return "reporting";

        return "general";
    }

    private bool ContainsVolunteerKeywords(string query)
    {
        var keywords = new[] 
        { 
            "volunteer", "tình nguyện", "tình nguyện viên", "skill", "kỹ năng", 
            "registration", "đăng ký", "profile", "hồ sơ" 
        };
        return keywords.Any(query.Contains);
    }

    private bool ContainsEventKeywords(string query)
    {
        var keywords = new[] 
        { 
            "event", "sự kiện", "activity", "hoạt động", "performance", "hiệu suất",
            "feedback", "đánh giá", "rating", "xếp hạng" 
        };
        return keywords.Any(query.Contains);
    }

    private bool ContainsPartnerKeywords(string query)
    {
        var keywords = new[] 
        { 
            "partner", "đối tác", "collaboration", "hợp tác", "organization", "tổ chức",
            "company", "công ty" 
        };
        return keywords.Any(query.Contains);
    }

    private bool ContainsTrendKeywords(string query)
    {
        var keywords = new[] 
        { 
            "trend", "xu hướng", "analysis", "phân tích", "growth", "tăng trưởng",
            "statistic", "thống kê", "over time", "theo thời gian" 
        };
        return keywords.Any(query.Contains);
    }

    // Phase 3: Enhanced Natural Language Processing
    public async Task<AIQueryResultDTO> ProcessAdvancedQueryAsync(string query, int userId, int? instructionId = null)
    {
        try
        {
            var startTime = DateTime.UtcNow;
            
            // Analyze the query with enhanced processing
            var analysis = await AnalyzeQueryAsync(query);
            
            // Validate data access permissions
            var hasPermission = await ValidateDataAccessPermissionsAsync(userId, analysis.RequiredTables);
            if (!hasPermission)
            {
                return new AIQueryResultDTO
                {
                    Success = false,
                    ErrorMessage = "Không có quyền truy cập vào dữ liệu yêu cầu."
                };
            }

            // Get optimized query processing
            var optimization = await OptimizeQueryPerformanceAsync(analysis);
            
            // Process the query with database service
            var response = await _aiDatabaseService.GetContextualDataAsync(analysis);
            
            // Apply privacy filters
            var filteredResult = await ApplyPrivacyFiltersAsync(response.Data, userId);
            
            // Generate proactive insights
            var insights = await GenerateProactiveInsightsAsync(userId);
            
            var executionTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;

            return new AIQueryResultDTO
            {
                Success = response.Success,
                Result = filteredResult,
                QueryCategory = analysis.QueryCategory,
                TablesAccessed = analysis.RequiredTables,
                ExecutionTimeMs = executionTime,
                ErrorMessage = response.ErrorMessage,
                Optimization = optimization,
                GeneratedInsights = insights.Take(3).ToList() // Limit to top 3 insights
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in advanced query processing for user {UserId}", userId);
            return new AIQueryResultDTO
            {
                Success = false,
                ErrorMessage = "Lỗi xử lý truy vấn nâng cao."
            };
        }
    }

    public async Task<List<SuggestedQueryDTO>> GetQuerySuggestionsAsync(string partialQuery, string category)
    {
        var suggestions = new List<SuggestedQueryDTO>();

        try
        {
            // Pre-defined suggestions based on category
            var categoryTemplates = GetQueryTemplatesByCategory(category);
            
            // Match suggestions based on partial query
            foreach (var template in categoryTemplates)
            {
                var relevanceScore = CalculateRelevanceScore(partialQuery, template.QueryText);
                if (relevanceScore > 0.3) // Minimum relevance threshold
                {
                    suggestions.Add(new SuggestedQueryDTO
                    {
                        QueryText = template.QueryText,
                        Description = template.Description,
                        Category = category,
                        Complexity = template.Complexity,
                        RelevanceScore = relevanceScore
                    });
                }
            }

            // Sort by relevance score
            return suggestions.OrderByDescending(s => s.RelevanceScore).Take(5).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting query suggestions for category {Category}", category);
            return new List<SuggestedQueryDTO>();
        }
    }

    public async Task<QueryOptimizationDTO> OptimizeQueryPerformanceAsync(QueryAnalysisDTO analysis)
    {
        try
        {
            var optimizations = new List<string>();
            var cachingRecommendations = new List<string>();

            // Analyze complexity and suggest optimizations
            if (analysis.EstimatedComplexity == "High")
            {
                optimizations.Add("Sử dụng phân trang cho kết quả lớn");
                optimizations.Add("Cache kết quả trong 5 phút");
                cachingRecommendations.Add("Cache aggregate results");
            }

            if (analysis.RequiredTables.Count > 5)
            {
                optimizations.Add("Giới hạn số bảng được truy vấn");
                optimizations.Add("Sử dụng eager loading cho relationships");
            }

            var optimizedQuery = await OptimizeQueryForDatabaseAsync(
                string.Join(" ", analysis.Parameters.Values), 
                analysis.QueryCategory
            );

            return new QueryOptimizationDTO
            {
                OriginalQuery = string.Join(" ", analysis.Parameters.Values),
                OptimizedQuery = optimizedQuery,
                OptimizationTechniques = optimizations,
                EstimatedPerformanceGain = CalculatePerformanceGain(analysis),
                CachingRecommendations = cachingRecommendations
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error optimizing query performance");
            return new QueryOptimizationDTO();
        }
    }

    // Phase 3: Smart Data Relationships
    public async Task<List<string>> ResolveDataRelationshipsAsync(List<string> baseTables)
    {
        return await _aiDatabaseService.GetRelatedTablesAsync(baseTables);
    }

    public async Task<DataSummaryDTO> GetIntelligentDataSummaryAsync(string queryCategory, Dictionary<string, object> filters)
    {
        try
        {
            var summary = await _aiDatabaseService.GetRelevantDataAsync(queryCategory);
            
            return new DataSummaryDTO
            {
                Summary = summary.Summary,
                KeyMetrics = ExtractKeyMetrics(summary.Data),
                DataSources = summary.TablesIncluded,
                GeneratedAt = DateTime.UtcNow,
                DataFreshness = CalculateDataFreshness(summary.GeneratedAt)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting intelligent data summary");
            return new DataSummaryDTO();
        }
    }

    // Phase 3: Real-time Analytics
    public async Task<TrendAnalysisDTO> GenerateTrendAnalysisAsync(string metric, TimeSpan period)
    {
        try
        {
            var endDate = DateTime.UtcNow;
            var startDate = endDate.Subtract(period);

            var dataPoints = new List<TrendDataPointDTO>();

            switch (metric.ToLower())
            {
                case "volunteers":
                case "tình nguyện viên":
                    dataPoints = await GetVolunteerTrendData(startDate, endDate);
                    break;
                case "events":
                case "sự kiện":
                    dataPoints = await GetEventTrendData(startDate, endDate);
                    break;
                case "registrations":
                case "đăng ký":
                    dataPoints = await GetRegistrationTrendData(startDate, endDate);
                    break;
            }

            var trend = AnalyzeTrend(dataPoints);

            return new TrendAnalysisDTO
            {
                Metric = metric,
                AnalysisPeriod = period,
                DataPoints = dataPoints,
                TrendDirection = trend.Direction,
                TrendStrength = trend.Strength,
                KeyInsights = GenerateTrendInsights(dataPoints, trend),
                Predictions = GeneratePredictions(dataPoints)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating trend analysis for metric {Metric}", metric);
            return new TrendAnalysisDTO { Metric = metric, AnalysisPeriod = period };
        }
    }

    public async Task<List<InsightDTO>> GenerateProactiveInsightsAsync(int userId)
    {
        var insights = new List<InsightDTO>();

        try
        {
            // Generate insights based on recent data patterns
            insights.AddRange(await AnalyzeVolunteerEngagement());
            insights.AddRange(await AnalyzeEventPerformance());
            insights.AddRange(await AnalyzeSystemHealth());

            return insights.OrderByDescending(i => GetInsightPriority(i.Priority)).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating proactive insights for user {UserId}", userId);
            return new List<InsightDTO>();
        }
    }

    // Phase 3: Privacy & Security
    public async Task<bool> ValidateDataAccessPermissionsAsync(int userId, List<string> requestedTables)
    {
        try
        {
            // Get user role and permissions
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            // For now, implement basic role-based access
            // Admin can access all tables
            if (user.Role.ToString() == "Admin") return true;

            // Regular users have limited access
            var allowedTables = new[] { "Events", "EventCategories", "Organizations" };
            return requestedTables.All(table => allowedTables.Contains(table));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating data access permissions for user {UserId}", userId);
            return false;
        }
    }

    public async Task<string> ApplyPrivacyFiltersAsync(string dataResult, int userId)
    {
        try
        {
            // Apply privacy filters based on user role
            var user = await _context.Users.FindAsync(userId);
            if (user?.Role.ToString() == "Admin") return dataResult;

            // Remove sensitive information for non-admin users
            var filteredResult = dataResult;
            
            // Remove personal identifiable information patterns
            filteredResult = System.Text.RegularExpressions.Regex.Replace(
                filteredResult, 
                @"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", 
                "[EMAIL_HIDDEN]"
            );
            
            filteredResult = System.Text.RegularExpressions.Regex.Replace(
                filteredResult, 
                @"\b\d{3}[-.]?\d{3}[-.]?\d{4}\b", 
                "[PHONE_HIDDEN]"
            );

            return filteredResult;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error applying privacy filters");
            return dataResult;
        }
    }

    // Private helper methods for Phase 3
    private List<SuggestedQueryDTO> GetQueryTemplatesByCategory(string category)
    {
        return category.ToLower() switch
        {
            "volunteer analytics" => new List<SuggestedQueryDTO>
            {
                new() { QueryText = "Có bao nhiêu tình nguyện viên hoạt động?", Description = "Thống kê tình nguyện viên đang hoạt động", Complexity = "Low" },
                new() { QueryText = "Kỹ năng nào được yêu cầu nhiều nhất?", Description = "Phân tích kỹ năng phổ biến", Complexity = "Medium" },
                new() { QueryText = "Xu hướng tham gia của tình nguyện viên theo tháng", Description = "Phân tích xu hướng tham gia", Complexity = "High" }
            },
            "event performance" => new List<SuggestedQueryDTO>
            {
                new() { QueryText = "Sự kiện nào thành công nhất?", Description = "Top sự kiện có đánh giá cao", Complexity = "Low" },
                new() { QueryText = "Tỷ lệ tham gia sự kiện theo danh mục", Description = "Phân tích tỷ lệ tham gia", Complexity = "Medium" },
                new() { QueryText = "So sánh hiệu suất sự kiện theo quý", Description = "Báo cáo hiệu suất theo thời gian", Complexity = "High" }
            },
            _ => new List<SuggestedQueryDTO>()
        };
    }

    private double CalculateRelevanceScore(string partialQuery, string suggestion)
    {
        if (string.IsNullOrEmpty(partialQuery)) return 0.5;
        
        var partial = partialQuery.ToLower();
        var suggest = suggestion.ToLower();
        
        if (suggest.Contains(partial)) return 1.0;
        
        var words = partial.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var matchingWords = words.Count(word => suggest.Contains(word));
        
        return (double)matchingWords / words.Length;
    }

    private int CalculatePerformanceGain(QueryAnalysisDTO analysis)
    {
        return analysis.EstimatedComplexity switch
        {
            "High" => 40,
            "Medium" => 25,
            _ => 10
        };
    }

    private Dictionary<string, object> ExtractKeyMetrics(Dictionary<string, object> data)
    {
        var metrics = new Dictionary<string, object>();
        
        foreach (var kvp in data)
        {
            if (kvp.Value is System.Collections.IEnumerable enumerable && kvp.Value is not string)
            {
                var count = enumerable.Cast<object>().Count();
                metrics[$"{kvp.Key}_count"] = count;
            }
        }
        
        return metrics;
    }

    private int CalculateDataFreshness(DateTime generatedAt)
    {
        return (int)(DateTime.UtcNow - generatedAt).TotalMinutes;
    }

    private async Task<List<TrendDataPointDTO>> GetVolunteerTrendData(DateTime startDate, DateTime endDate)
    {
        var data = await _context.VolunteerProfiles
            .Where(v => v.CreatedAt >= startDate && v.CreatedAt <= endDate)
            .GroupBy(v => v.CreatedAt.HasValue ? v.CreatedAt.Value.Date : DateTime.MinValue.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return data.Select(d => new TrendDataPointDTO
        {
            Date = d.Date,
            Value = d.Count,
            Label = $"{d.Count} tình nguyện viên"
        }).ToList();
    }

    private async Task<List<TrendDataPointDTO>> GetEventTrendData(DateTime startDate, DateTime endDate)
    {
        var data = await _context.Events
            .Where(e => e.CreatedAt >= startDate && e.CreatedAt <= endDate)
            .GroupBy(e => e.CreatedAt.HasValue ? e.CreatedAt.Value.Date : DateTime.MinValue.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return data.Select(d => new TrendDataPointDTO
        {
            Date = d.Date,
            Value = d.Count,
            Label = $"{d.Count} sự kiện"
        }).ToList();
    }

    private async Task<List<TrendDataPointDTO>> GetRegistrationTrendData(DateTime startDate, DateTime endDate)
    {
        var data = await _context.EventRegistrations
            .Where(r => r.CreatedAt >= startDate && r.CreatedAt <= endDate)
            .GroupBy(r => r.CreatedAt.HasValue ? r.CreatedAt.Value.Date : DateTime.MinValue.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return data.Select(d => new TrendDataPointDTO
        {
            Date = d.Date,
            Value = d.Count,
            Label = $"{d.Count} đăng ký"
        }).ToList();
    }

    private (string Direction, double Strength) AnalyzeTrend(List<TrendDataPointDTO> dataPoints)
    {
        if (dataPoints.Count < 2) return ("Stable", 0);

        var firstHalf = dataPoints.Take(dataPoints.Count / 2).Average(d => d.Value);
        var secondHalf = dataPoints.Skip(dataPoints.Count / 2).Average(d => d.Value);

        var change = secondHalf - firstHalf;
        var changePercent = firstHalf > 0 ? Math.Abs(change / firstHalf) * 100 : 0;

        var direction = change > 0 ? "Increasing" : change < 0 ? "Decreasing" : "Stable";
        
        return (direction, changePercent);
    }

    private List<string> GenerateTrendInsights(List<TrendDataPointDTO> dataPoints, (string Direction, double Strength) trend)
    {
        var insights = new List<string>();

        if (trend.Strength > 20)
        {
            insights.Add($"Xu hướng {trend.Direction.ToLower()} mạnh ({trend.Strength:F1}% thay đổi)");
        }

        if (dataPoints.Any())
        {
            var peak = dataPoints.OrderByDescending(d => d.Value).First();
            insights.Add($"Đỉnh cao nhất: {peak.Value} vào {peak.Date:dd/MM/yyyy}");
        }

        return insights;
    }

    private Dictionary<string, object> GeneratePredictions(List<TrendDataPointDTO> dataPoints)
    {
        var predictions = new Dictionary<string, object>();

        if (dataPoints.Count >= 3)
        {
            var lastThree = dataPoints.TakeLast(3).ToList();
            var avgGrowth = lastThree.Zip(lastThree.Skip(1), (a, b) => b.Value - a.Value).Average();
            
            predictions["next_week_estimate"] = Math.Max(0, lastThree.Last().Value + avgGrowth * 7);
            predictions["confidence"] = lastThree.Count >= 5 ? "High" : "Medium";
        }

        return predictions;
    }

    private async Task<List<InsightDTO>> AnalyzeVolunteerEngagement()
    {
        var insights = new List<InsightDTO>();

        try
        {
            var last30Days = DateTime.UtcNow.AddDays(-30);
            var recentVolunteers = await _context.VolunteerProfiles
                .Where(v => v.CreatedAt >= last30Days)
                .CountAsync();

            if (recentVolunteers < 5)
            {
                insights.Add(new InsightDTO
                {
                    InsightId = Guid.NewGuid().ToString(),
                    Title = "Tuyển dụng tình nguyện viên chậm",
                    Description = $"Chỉ có {recentVolunteers} tình nguyện viên mới trong 30 ngày qua",
                    Category = "Volunteer Engagement",
                    Priority = "High",
                    Type = "Alert",
                    ActionItems = new List<string> { "Tăng cường chiến dịch tuyển dụng", "Kiểm tra quy trình đăng ký" }
                });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing volunteer engagement");
        }

        return insights;
    }

    private async Task<List<InsightDTO>> AnalyzeEventPerformance()
    {
        var insights = new List<InsightDTO>();

        try
        {
            var last30Days = DateTime.UtcNow.AddDays(-30);
            var lowRatedEvents = await _context.Events
                .Where(e => e.CreatedAt >= last30Days && e.Rating < 3)
                .CountAsync();

            if (lowRatedEvents > 2)
            {
                insights.Add(new InsightDTO
                {
                    InsightId = Guid.NewGuid().ToString(),
                    Title = "Chất lượng sự kiện cần cải thiện",
                    Description = $"{lowRatedEvents} sự kiện có đánh giá thấp trong tháng qua",
                    Category = "Event Performance",
                    Priority = "Medium",
                    Type = "Recommendation",
                    ActionItems = new List<string> { "Phân tích feedback", "Cải thiện quy trình tổ chức" }
                });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing event performance");
        }

        return insights;
    }

    private async Task<List<InsightDTO>> AnalyzeSystemHealth()
    {
        var insights = new List<InsightDTO>();

        try
        {
            var totalUsers = await _context.Users.CountAsync();
            var activeUsers = await _context.Users.Where(u => u.IsActive == true).CountAsync();
            
            var activeRatio = totalUsers > 0 ? (double)activeUsers / totalUsers : 0;

            if (activeRatio < 0.7)
            {
                insights.Add(new InsightDTO
                {
                    InsightId = Guid.NewGuid().ToString(),
                    Title = "Tỷ lệ người dùng hoạt động thấp",
                    Description = $"Chỉ {activeRatio:P0} người dùng đang hoạt động",
                    Category = "System Health",
                    Priority = "Medium",
                    Type = "Trend",
                    ActionItems = new List<string> { "Kiểm tra lý do người dùng ngừng hoạt động", "Tăng cường engagement" }
                });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing system health");
        }

        return insights;
    }

    private int GetInsightPriority(string priority)
    {
        return priority switch
        {
            "Critical" => 4,
            "High" => 3,
            "Medium" => 2,
            "Low" => 1,
            _ => 0
        };
    }
}
