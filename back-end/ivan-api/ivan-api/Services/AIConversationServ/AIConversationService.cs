using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using ivan_api.DTOs;
using ivan_api.DTOs.AIDatabaseManage;
using ivan_api.Models;

namespace ivan_api.Services.AIConversationServ;

public class AIConversationService : IAIConversationService
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly ILogger<AIConversationService> _logger;

    public AIConversationService(VolunteerManagementSystemContext context, ILogger<AIConversationService> logger)
    {
        _context = context;
        _logger = logger;
    }

    // Controller-compatible methods
    public async Task<AIConversationContextDTO> StartConversationAsync(int userId, string? instructionProfile = null, Dictionary<string, object>? initialContext = null)
    {
        try
        {
            // TODO: Map instructionProfile to instructionId if needed
            var context = await CreateConversationAsync(userId, null);
            
            if (initialContext != null && initialContext.Any())
            {
                await UpdateConversationAsync(context.ConversationId, initialContext);
                context = await GetConversationAsync(context.ConversationId);
            }
            
            return context;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting conversation for user {UserId}", userId);
            throw;
        }
    }

    public async Task<AIConversationContextDTO> ContinueConversationAsync(string conversationId, string query, string? queryCategory = null)
    {
        try
        {
            var context = await GetConversationAsync(conversationId);
            if (context == null)
            {
                throw new ArgumentException("Conversation not found");
            }

            // Process the message and add to history
            await AddQueryToHistoryAsync(conversationId, query, "AI response", queryCategory ?? "general");
            
            return context;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error continuing conversation {ConversationId}", conversationId);
            throw;
        }
    }

    public async Task<AIConversationContextDTO> GetConversationContextAsync(string conversationId)
    {
        return await GetConversationAsync(conversationId);
    }

    public async Task<List<ConversationHistoryDTO>> GetConversationHistoryAsync(string conversationId, int limit = 10, int offset = 0)
    {
        try
        {
            var history = await _context.AiQueryAnalytics
                .Where(q => q.QueryText != null && q.QueryText.Contains(conversationId))
                .OrderByDescending(q => q.CreatedAt)
                .Skip(offset)
                .Take(limit)
                .Select(q => new ConversationHistoryDTO
                {
                    HistoryId = q.QueryId,
                    ConversationId = conversationId,
                    Query = q.QueryText ?? "",
                    Response = "AI Response",
                    QueryCategory = "general",
                    ExecutionTimeMs = q.ExecutionTime ?? 0,
                    CreatedAt = q.CreatedAt ?? DateTime.UtcNow,
                    Metadata = new Dictionary<string, object>()
                })
                .ToListAsync();

            return history;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting conversation history for {ConversationId}", conversationId);
            return new List<ConversationHistoryDTO>();
        }
    }

    public async Task<List<ConversationSummaryDTO>> GetUserConversationsAsync(int userId, int limit = 10, int offset = 0)
    {
        try
        {
            var conversations = await _context.AiConversationContexts
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.UpdatedAt)
                .Skip(offset)
                .Take(limit)
                .Select(c => new ConversationSummaryDTO
                {
                    ConversationId = c.ConversationId,
                    TotalQueries = 0, // Will be calculated separately if needed
                    Duration = TimeSpan.FromHours(1), // Default duration
                    TopCategories = new List<string> { "General" },
                    KeyTopics = new List<string>(),
                    AverageResponseTime = 1000,
                    MainFocus = "General conversation",
                    Achievements = new List<string>()
                })
                .ToListAsync();

            return conversations;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting conversations for user {UserId}", userId);
            return new List<ConversationSummaryDTO>();
        }
    }

    public async Task<bool> UpdateConversationContextAsync(string conversationId, Dictionary<string, object>? sessionData = null, string? instructionProfile = null)
    {
        try
        {
            if (sessionData != null)
            {
                await UpdateConversationAsync(conversationId, sessionData);
            }
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating conversation context for {ConversationId}", conversationId);
            return false;
        }
    }

    public async Task<bool> ClearConversationHistoryAsync(string conversationId)
    {
        try
        {
            var historyEntries = await _context.AiQueryAnalytics
                .Where(q => q.QueryText != null && q.QueryText.Contains(conversationId))
                .ToListAsync();

            _context.AiQueryAnalytics.RemoveRange(historyEntries);
            await _context.SaveChangesAsync();
            
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error clearing conversation history for {ConversationId}", conversationId);
            return false;
        }
    }

    // Original internal methods
    public async Task<AIConversationContextDTO> CreateConversationAsync(int userId, int? instructionId = null)
    {
        try
        {
            var conversationId = Guid.NewGuid().ToString();
            var expiresAt = DateTime.UtcNow.AddHours(24); // 24-hour conversation timeout

            var context = new AiConversationContext
            {
                ConversationId = conversationId,
                UserId = userId,
                InstructionId = instructionId,
                SessionData = JsonSerializer.Serialize(new Dictionary<string, object>()),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.AiConversationContexts.Add(context);
            await _context.SaveChangesAsync();

            var instruction = instructionId.HasValue 
                ? await _context.AiCustomInstructions.FindAsync(instructionId.Value)
                : null;

            return new AIConversationContextDTO
            {
                ConversationId = conversationId,
                UserId = userId,
                InstructionId = instructionId,
                InstructionName = instruction?.InstructionName,
                SessionData = new Dictionary<string, object>(),
                CreatedAt = context.CreatedAt ?? DateTime.UtcNow,
                UpdatedAt = context.UpdatedAt ?? DateTime.UtcNow,
                ExpiresAt = expiresAt,
                IsActive = true,
                MessageCount = 0
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating conversation for user {UserId}", userId);
            throw;
        }
    }

    public async Task<AIConversationContextDTO> GetConversationAsync(string conversationId)
    {
        try
        {
            var context = await _context.AiConversationContexts
                .Include(c => c.Instruction)
                .FirstOrDefaultAsync(c => c.ConversationId == conversationId);

            if (context == null)
                throw new ArgumentException($"Conversation {conversationId} not found");

            var sessionData = string.IsNullOrEmpty(context.SessionData)
                ? new Dictionary<string, object>()
                : JsonSerializer.Deserialize<Dictionary<string, object>>(context.SessionData) ?? new Dictionary<string, object>();

            var messageCount = await _context.AiQueryAnalytics
                .Where(q => q.ConversationId == conversationId)
                .CountAsync();

            return new AIConversationContextDTO
            {
                ConversationId = context.ConversationId,
                UserId = context.UserId,
                InstructionId = context.InstructionId,
                InstructionName = context.Instruction?.InstructionName,
                SessionData = sessionData,
                CreatedAt = context.CreatedAt ?? DateTime.UtcNow,
                UpdatedAt = context.UpdatedAt ?? DateTime.UtcNow,
                ExpiresAt = (context.CreatedAt ?? DateTime.UtcNow).AddHours(24),
                IsActive = DateTime.UtcNow < (context.CreatedAt ?? DateTime.UtcNow).AddHours(24),
                MessageCount = messageCount
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting conversation {ConversationId}", conversationId);
            throw;
        }
    }

    public async Task<AIConversationContextDTO> UpdateConversationAsync(string conversationId, Dictionary<string, object> sessionData)
    {
        try
        {
            var context = await _context.AiConversationContexts
                .FirstOrDefaultAsync(c => c.ConversationId == conversationId);

            if (context == null)
                throw new ArgumentException($"Conversation {conversationId} not found");

            context.SessionData = JsonSerializer.Serialize(sessionData);
            context.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetConversationAsync(conversationId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating conversation {ConversationId}", conversationId);
            throw;
        }
    }

    public async Task<bool> EndConversationAsync(string conversationId)
    {
        try
        {
            var context = await _context.AiConversationContexts
                .FirstOrDefaultAsync(c => c.ConversationId == conversationId);

            if (context == null) return false;

            context.UpdatedAt = DateTime.UtcNow;
            // Mark as ended by setting updated time (can add an explicit EndedAt field if needed)
            
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error ending conversation {ConversationId}", conversationId);
            return false;
        }
    }

    public async Task AddQueryToHistoryAsync(string conversationId, string query, string response, string category)
    {
        try
        {
            var context = await _context.AiConversationContexts
                .FirstOrDefaultAsync(c => c.ConversationId == conversationId);

            if (context == null) return;

            var analytics = new AiQueryAnalytic
            {
                UserId = context.UserId,
                InstructionId = context.InstructionId,
                QueryText = query,
                ConversationId = conversationId,
                DataTablesAccessed = category,
                ExecutionTime = 0, // Will be updated by the actual query processing
                CreatedAt = DateTime.UtcNow
            };

            _context.AiQueryAnalytics.Add(analytics);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding query to history for conversation {ConversationId}", conversationId);
        }
    }

    public async Task<List<ConversationHistoryDTO>> GetConversationHistoryAsync(string conversationId, int limit = 10)
    {
        try
        {
            var history = await _context.AiQueryAnalytics
                .Where(q => q.ConversationId == conversationId)
                .OrderByDescending(q => q.CreatedAt)
                .Take(limit)
                .ToListAsync();

            return history.Select(h => new ConversationHistoryDTO
            {
                HistoryId = h.QueryId,
                ConversationId = h.ConversationId ?? string.Empty,
                Query = h.QueryText ?? string.Empty,
                Response = "", // Response not stored in analytics table
                QueryCategory = h.DataTablesAccessed ?? "General",
                ExecutionTimeMs = h.ExecutionTime ?? 0,
                CreatedAt = h.CreatedAt ?? DateTime.UtcNow,
                Metadata = new Dictionary<string, object>
                {
                    ["instruction_id"] = h.InstructionId ?? 0,
                    ["response_quality"] = h.ResponseQuality ?? 0
                }
            }).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting conversation history for {ConversationId}", conversationId);
            return new List<ConversationHistoryDTO>();
        }
    }

    public async Task<ConversationSummaryDTO> GetConversationSummaryAsync(string conversationId)
    {
        try
        {
            var context = await _context.AiConversationContexts
                .FirstOrDefaultAsync(c => c.ConversationId == conversationId);

            if (context == null)
                return new ConversationSummaryDTO { ConversationId = conversationId };

            var queries = await _context.AiQueryAnalytics
                .Where(q => q.ConversationId == conversationId)
                .ToListAsync();

            var totalQueries = queries.Count;
            var duration = (context.UpdatedAt ?? DateTime.UtcNow) - (context.CreatedAt ?? DateTime.UtcNow);
            var avgResponseTime = queries.Any() ? queries.Average(q => q.ExecutionTime ?? 0) : 0;

            var categories = queries
                .Where(q => !string.IsNullOrEmpty(q.DataTablesAccessed))
                .GroupBy(q => q.DataTablesAccessed)
                .OrderByDescending(g => g.Count())
                .Take(3)
                .Select(g => g.Key!)
                .ToList();

            return new ConversationSummaryDTO
            {
                ConversationId = conversationId,
                TotalQueries = totalQueries,
                Duration = duration,
                TopCategories = categories,
                KeyTopics = ExtractKeyTopicsFromQueries(queries.Select(q => q.QueryText ?? "").ToList()),
                AverageResponseTime = avgResponseTime,
                MainFocus = DetermineMainFocus(categories),
                Achievements = GenerateAchievements(totalQueries, duration, avgResponseTime)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting conversation summary for {ConversationId}", conversationId);
            return new ConversationSummaryDTO { ConversationId = conversationId };
        }
    }

    public async Task<string> BuildContextAwarePromptAsync(string conversationId, string newQuery, string? instructionProfile = null)
    {
        try
        {
            var conversation = await GetConversationAsync(conversationId);
            var recentHistory = await GetConversationHistoryAsync(conversationId, 5);

            var contextBuilder = new List<string>();

            // Add conversation context
            if (conversation.MessageCount > 0)
            {
                contextBuilder.Add($"Đây là cuộc hội thoại thứ {conversation.MessageCount + 1} trong phiên này.");
            }

            // Add instruction context
            if (!string.IsNullOrEmpty(conversation.InstructionName))
            {
                contextBuilder.Add($"Bạn đang hoạt động với vai trò: {conversation.InstructionName}");
            }

            // Add recent conversation history
            if (recentHistory.Any())
            {
                contextBuilder.Add("Lịch sử cuộc hội thoại gần đây:");
                foreach (var item in recentHistory.Take(3))
                {
                    contextBuilder.Add($"- Câu hỏi trước: {item.Query.Substring(0, Math.Min(100, item.Query.Length))}...");
                }
            }

            // Add session data context
            if (conversation.SessionData.Any())
            {
                var relevantData = ExtractRelevantSessionData(conversation.SessionData, newQuery);
                if (relevantData.Any())
                {
                    contextBuilder.Add("Thông tin phiên làm việc liên quan:");
                    contextBuilder.AddRange(relevantData);
                }
            }

            var contextPrompt = string.Join("\n", contextBuilder);
            return $"{contextPrompt}\n\nCâu hỏi hiện tại: {newQuery}";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error building context-aware prompt for conversation {ConversationId}", conversationId);
            return newQuery;
        }
    }

    public async Task<List<string>> GetRelevantPastQueriesAsync(string conversationId, string currentQuery, int limit = 5)
    {
        try
        {
            var history = await GetConversationHistoryAsync(conversationId, 20);
            var currentQueryLower = currentQuery.ToLower();

            var relevantQueries = history
                .Where(h => !string.IsNullOrEmpty(h.Query))
                .Select(h => new { Query = h.Query, Relevance = CalculateQueryRelevance(h.Query, currentQueryLower) })
                .Where(q => q.Relevance > 0.3)
                .OrderByDescending(q => q.Relevance)
                .Take(limit)
                .Select(q => q.Query)
                .ToList();

            return relevantQueries;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting relevant past queries for conversation {ConversationId}", conversationId);
            return new List<string>();
        }
    }

    public async Task<bool> IsConversationActiveAsync(string conversationId)
    {
        try
        {
            var context = await _context.AiConversationContexts
                .FirstOrDefaultAsync(c => c.ConversationId == conversationId);

            if (context == null) return false;

            return DateTime.UtcNow < (context.CreatedAt ?? DateTime.UtcNow).AddHours(24);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if conversation is active {ConversationId}", conversationId);
            return false;
        }
    }

    public async Task ExtendConversationAsync(string conversationId, TimeSpan extension)
    {
        try
        {
            var context = await _context.AiConversationContexts
                .FirstOrDefaultAsync(c => c.ConversationId == conversationId);

            if (context != null)
            {
                context.UpdatedAt = DateTime.UtcNow;
                // Extension logic can be implemented based on business rules
                await _context.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error extending conversation {ConversationId}", conversationId);
        }
    }

    public async Task<List<string>> GetActiveConversationsForUserAsync(int userId)
    {
        try
        {
            var activeConversations = await _context.AiConversationContexts
                .Where(c => c.UserId == userId && c.CreatedAt > DateTime.UtcNow.AddHours(-24))
                .Select(c => c.ConversationId)
                .ToListAsync();

            return activeConversations;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting active conversations for user {UserId}", userId);
            return new List<string>();
        }
    }

    public async Task<ConversationAnalyticsDTO> GetConversationAnalyticsAsync(string conversationId)
    {
        try
        {
            var queries = await _context.AiQueryAnalytics
                .Where(q => q.ConversationId == conversationId)
                .ToListAsync();

            var categoryDistribution = queries
                .Where(q => !string.IsNullOrEmpty(q.DataTablesAccessed))
                .GroupBy(q => q.DataTablesAccessed!)
                .ToDictionary(g => g.Key, g => g.Count());

            var responseTimes = queries
                .GroupBy(q => q.DataTablesAccessed ?? "General")
                .ToDictionary(g => g.Key, g => g.Average(q => (double)q.ExecutionTime));

            var frequentTopics = ExtractKeyTopicsFromQueries(queries.Select(q => q.QueryText ?? "").ToList());

            var engagementScore = CalculateEngagementScore(queries);

            var insights = GenerateConversationInsights(queries, categoryDistribution, responseTimes);

            return new ConversationAnalyticsDTO
            {
                ConversationId = conversationId,
                CategoryDistribution = categoryDistribution.ToDictionary(x => x.Key, x => (object)x.Value),
                ResponseTimes = responseTimes.Values.ToList(),
                FrequentTopics = frequentTopics,
                EngagementScore = engagementScore,
                Insights = insights
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting conversation analytics for {ConversationId}", conversationId);
            return new ConversationAnalyticsDTO { ConversationId = conversationId };
        }
    }

    public async Task<List<ConversationPatternDTO>> AnalyzeConversationPatternsAsync(int userId, TimeSpan period)
    {
        try
        {
            var startDate = DateTime.UtcNow.Subtract(period);
            
            var userQueries = await _context.AiQueryAnalytics
                .Where(q => q.UserId == userId && q.CreatedAt >= startDate)
                .ToListAsync();

            var patterns = new List<ConversationPatternDTO>();

            // Analyze query timing patterns
            var timingPattern = AnalyzeQueryTimingPatterns(userQueries);
            if (timingPattern != null) patterns.Add(timingPattern);

            // Analyze category preferences
            var categoryPattern = AnalyzeCategoryPatterns(userQueries);
            if (categoryPattern != null) patterns.Add(categoryPattern);

            // Analyze query complexity patterns
            var complexityPattern = AnalyzeComplexityPatterns(userQueries);
            if (complexityPattern != null) patterns.Add(complexityPattern);

            return patterns;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing conversation patterns for user {UserId}", userId);
            return new List<ConversationPatternDTO>();
        }
    }

    // Private helper methods
    private List<string> ExtractKeyTopicsFromQueries(List<string> queries)
    {
        var keywords = new List<string>();
        var commonWords = new[] { "how", "what", "when", "where", "why", "who", "là", "gì", "như", "thế", "nào", "có", "được", "and", "or", "the", "a", "an" };

        foreach (var query in queries)
        {
            if (string.IsNullOrEmpty(query)) continue;

            var words = query.ToLower()
                .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Where(w => w.Length > 3 && !commonWords.Contains(w))
                .ToList();

            keywords.AddRange(words);
        }

        return keywords
            .GroupBy(k => k)
            .OrderByDescending(g => g.Count())
            .Take(5)
            .Select(g => g.Key)
            .ToList();
    }

    private string DetermineMainFocus(List<string> categories)
    {
        return categories.FirstOrDefault() switch
        {
            var c when c?.Contains("Volunteer") == true => "Quản lý tình nguyện viên",
            var c when c?.Contains("Event") == true => "Quản lý sự kiện",
            var c when c?.Contains("Partner") == true => "Quan hệ đối tác",
            var c when c?.Contains("Analytics") == true => "Phân tích dữ liệu",
            _ => "Tổng hợp"
        };
    }

    private List<string> GenerateAchievements(int totalQueries, TimeSpan duration, double avgResponseTime)
    {
        var achievements = new List<string>();

        if (totalQueries >= 10)
            achievements.Add("Người dùng tích cực - đã đặt hơn 10 câu hỏi");

        if (duration.TotalMinutes >= 30)
            achievements.Add("Phiên làm việc hiệu quả - thời gian tương tác trên 30 phút");

        if (avgResponseTime < 2000)
            achievements.Add("Trải nghiệm mượt mà - thời gian phản hồi nhanh");

        return achievements;
    }

    private List<string> ExtractRelevantSessionData(Dictionary<string, object> sessionData, string newQuery)
    {
        var relevantData = new List<string>();
        var queryLower = newQuery.ToLower();

        foreach (var item in sessionData)
        {
            if (item.Key.ToLower().Contains("current") || 
                item.Key.ToLower().Contains("last") ||
                queryLower.Contains(item.Key.ToLower()))
            {
                relevantData.Add($"{item.Key}: {item.Value}");
            }
        }

        return relevantData;
    }

    private double CalculateQueryRelevance(string pastQuery, string currentQuery)
    {
        var pastWords = pastQuery.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var currentWords = currentQuery.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        var commonWords = pastWords.Intersect(currentWords).Count();
        var totalWords = Math.Max(pastWords.Length, currentWords.Length);

        return totalWords > 0 ? (double)commonWords / totalWords : 0;
    }

    private double CalculateEngagementScore(List<AiQueryAnalytic> queries)
    {
        if (!queries.Any()) return 0;

        var score = 0.0;
        
        // More queries = higher engagement
        score += Math.Min(queries.Count * 10, 50);
        
        // Variety in categories = higher engagement
        var uniqueCategories = queries.Select(q => q.DataTablesAccessed).Distinct().Count();
        score += uniqueCategories * 5;
        
        // Recent activity = higher engagement
        var recentQueries = queries.Count(q => q.CreatedAt > DateTime.UtcNow.AddMinutes(-30));
        score += recentQueries * 3;

        return Math.Min(score, 100);
    }

    private List<ConversationInsightDTO> GenerateConversationInsights(
        List<AiQueryAnalytic> queries, 
        Dictionary<string, int> categoryDistribution, 
        Dictionary<string, double> responseTimes)
    {
        var insights = new List<ConversationInsightDTO>();

        // Usage insights
        if (queries.Count > 5)
        {
            insights.Add(new ConversationInsightDTO
            {
                Type = "Usage",
                Title = "Người dùng tích cực",
                Description = $"Đã thực hiện {queries.Count} truy vấn trong cuộc hội thoại này",
                Score = Math.Min(queries.Count * 10, 100),
                Data = new Dictionary<string, object> { ["query_count"] = queries.Count }
            });
        }

        // Performance insights
        var avgResponseTime = queries.Any() ? queries.Average(q => q.ExecutionTime) : 0;
        if (avgResponseTime < 1000)
        {
            insights.Add(new ConversationInsightDTO
            {
                Type = "Performance",
                Title = "Hiệu suất cao",
                Description = $"Thời gian phản hồi trung bình: {avgResponseTime:F0}ms",
                Score = 100 - ((avgResponseTime ?? 0) / 10),
                Data = new Dictionary<string, object> { ["avg_response_time"] = avgResponseTime }
            });
        }

        // Preference insights
        var topCategory = categoryDistribution.OrderByDescending(kv => kv.Value).FirstOrDefault();
        if (!string.IsNullOrEmpty(topCategory.Key))
        {
            insights.Add(new ConversationInsightDTO
            {
                Type = "Preference",
                Title = "Lĩnh vực quan tâm chính",
                Description = $"Chủ yếu quan tâm đến: {topCategory.Key}",
                Score = (double)topCategory.Value / queries.Count * 100,
                Data = new Dictionary<string, object> { ["top_category"] = topCategory.Key, ["percentage"] = topCategory.Value }
            });
        }

        return insights;
    }

    private ConversationPatternDTO? AnalyzeQueryTimingPatterns(List<AiQueryAnalytic> queries)
    {
        if (queries.Count < 3) return null;

        var hourGroups = queries
            .GroupBy(q => (q.CreatedAt ?? DateTime.UtcNow).Hour)
            .OrderByDescending(g => g.Count())
            .ToList();

        if (!hourGroups.Any()) return null;

        var peakHour = hourGroups.First().Key;
        var peakCount = hourGroups.First().Count();

        return new ConversationPatternDTO
        {
            PatternType = "Timing",
            Description = $"Người dùng thường hoạt động nhiều nhất vào {peakHour}:00",
            Frequency = (double)peakCount / queries.Count,
            Examples = new List<string> { $"{peakCount} truy vấn vào {peakHour}:00" },
            Recommendation = "Có thể tối ưu hóa hiệu suất hệ thống vào khung giờ này"
        };
    }

    private ConversationPatternDTO? AnalyzeCategoryPatterns(List<AiQueryAnalytic> queries)
    {
        var categoryGroups = queries
            .Where(q => !string.IsNullOrEmpty(q.DataTablesAccessed))
            .GroupBy(q => q.DataTablesAccessed!)
            .OrderByDescending(g => g.Count())
            .ToList();

        if (!categoryGroups.Any()) return null;

        var topCategory = categoryGroups.First();

        return new ConversationPatternDTO
        {
            PatternType = "Category Preference",
            Description = $"Chuyên sâu về {topCategory.Key}",
            Frequency = (double)topCategory.Count() / queries.Count,
            Examples = topCategory.Take(3).Select(q => q.QueryText ?? "").ToList(),
            Recommendation = "Cân nhắc tạo instruction chuyên biệt cho lĩnh vực này"
        };
    }

    private ConversationPatternDTO? AnalyzeComplexityPatterns(List<AiQueryAnalytic> queries)
    {
        var avgExecutionTime = queries.Average(q => q.ExecutionTime);
        var complexity = avgExecutionTime switch
        {
            > 3000 => "High",
            > 1500 => "Medium",
            _ => "Low"
        };

        return new ConversationPatternDTO
        {
            PatternType = "Query Complexity",
            Description = $"Thường đặt câu hỏi có độ phức tạp {complexity}",
            Frequency = 1.0,
            Examples = new List<string> { $"Thời gian xử lý trung bình: {avgExecutionTime:F0}ms" },
            Recommendation = complexity == "High" 
                ? "Có thể cần hướng dẫn đặt câu hỏi đơn giản hơn"
                : "Phong cách truy vấn phù hợp"
        };
    }
}
