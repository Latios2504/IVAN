using Microsoft.EntityFrameworkCore;
using ivan_api.DTOs;
using ivan_api.DTOs.AIDatabaseManage;
using ivan_api.Models;
using ivan_api.Configuration;
using ivan_api.Services.AIDatabaseServ;
using ivan_api.Services.AIQueryServ;
using ivan_api.Services.AIConversationServ;
using System.Text;
using System.Text.Json;

namespace ivan_api.Services.AIInstructionServ;

public class AIInstructionService : IAIInstructionService
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly ILogger<AIInstructionService> _logger;
    private readonly HttpClient _httpClient;
    private readonly GeminiConfiguration _geminiConfig;
    private readonly IAIDatabaseService _databaseService;
    private readonly IAIQueryEngine _queryEngine;
    private readonly IAIConversationService _conversationService;

    public AIInstructionService(
        VolunteerManagementSystemContext context, 
        ILogger<AIInstructionService> logger,
        HttpClient httpClient,
        GeminiConfiguration geminiConfig,
        IAIDatabaseService databaseService,
        IAIQueryEngine queryEngine,
        IAIConversationService conversationService)
    {
        _context = context;
        _logger = logger;
        _httpClient = httpClient;
        _geminiConfig = geminiConfig;
        _databaseService = databaseService;
        _queryEngine = queryEngine;
        _conversationService = conversationService;
    }

    public async Task<ApiResponseDTO<AiCustomInstructionDTO>> CreateInstructionAsync(int userId, AiCustomInstructionCreateDTO request)
    {
        try
        {
            // Validate the instruction
            var validationResult = await ValidateInstructionAsync(request);
            if (!validationResult.Success)
            {
                return new ApiResponseDTO<AiCustomInstructionDTO>
                {
                    Success = false,
                    Message = validationResult.Message ?? "Validation failed"
                };
            }

            var instruction = new AiCustomInstruction
            {
                CreatedByUserId = userId,
                InstructionName = request.InstructionName,
                SystemPrompt = request.SystemPrompt,
                BehaviorInstructions = request.BehaviorInstructions,
                DataAccessRules = request.DataAccessRules,
                IsActive = true,
                IsDefault = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.AiCustomInstructions.Add(instruction);
            await _context.SaveChangesAsync();

            var instructionDto = MapToDTO(instruction);

            _logger.LogInformation("Created AI instruction {InstructionId} for user {UserId}", instruction.InstructionId, userId);

            return new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = true,
                Message = "AI instruction created successfully",
                Data = instructionDto
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating AI instruction for user {UserId}", userId);
            return new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = false,
                Message = "An error occurred while creating the instruction"
            };
        }
    }

    public async Task<ApiResponseDTO<AiCustomInstructionDTO>> UpdateInstructionAsync(int instructionId, int userId, AiCustomInstructionUpdateDTO request)
    {
        try
        {
            var instruction = await _context.AiCustomInstructions
                .FirstOrDefaultAsync(i => i.InstructionId == instructionId && i.CreatedByUserId == userId);

            if (instruction == null)
            {
                return new ApiResponseDTO<AiCustomInstructionDTO>
                {
                    Success = false,
                    Message = "Instruction not found or you don't have permission to edit it"
                };
            }

            // Validate the updated instruction
            var validationRequest = new AiCustomInstructionCreateDTO
            {
                InstructionName = request.InstructionName,
                SystemPrompt = request.SystemPrompt,
                BehaviorInstructions = request.BehaviorInstructions,
                DataAccessRules = request.DataAccessRules
            };

            var validationResult = await ValidateInstructionAsync(validationRequest);
            if (!validationResult.Success)
            {
                return new ApiResponseDTO<AiCustomInstructionDTO>
                {
                    Success = false,
                    Message = validationResult.Message ?? "Validation failed"
                };
            }

            instruction.InstructionName = request.InstructionName;
            instruction.SystemPrompt = request.SystemPrompt;
            instruction.BehaviorInstructions = request.BehaviorInstructions;
            instruction.DataAccessRules = request.DataAccessRules;
            instruction.IsActive = request.IsActive;
            instruction.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var instructionDto = MapToDTO(instruction);

            _logger.LogInformation("Updated AI instruction {InstructionId} for user {UserId}", instructionId, userId);

            return new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = true,
                Message = "AI instruction updated successfully",
                Data = instructionDto
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating AI instruction {InstructionId} for user {UserId}", instructionId, userId);
            return new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = false,
                Message = "An error occurred while updating the instruction"
            };
        }
    }

    public async Task<ApiResponseDTO<bool>> DeleteInstructionAsync(int instructionId, int userId)
    {
        try
        {
            var instruction = await _context.AiCustomInstructions
                .FirstOrDefaultAsync(i => i.InstructionId == instructionId && i.CreatedByUserId == userId);

            if (instruction == null)
            {
                return new ApiResponseDTO<bool>
                {
                    Success = false,
                    Message = "Instruction not found or you don't have permission to delete it"
                };
            }

            if (instruction.IsDefault == true)
            {
                return new ApiResponseDTO<bool>
                {
                    Success = false,
                    Message = "Cannot delete default instruction templates"
                };
            }

            _context.AiCustomInstructions.Remove(instruction);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Deleted AI instruction {InstructionId} for user {UserId}", instructionId, userId);

            return new ApiResponseDTO<bool>
            {
                Success = true,
                Message = "AI instruction deleted successfully",
                Data = true
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting AI instruction {InstructionId} for user {UserId}", instructionId, userId);
            return new ApiResponseDTO<bool>
            {
                Success = false,
                Message = "An error occurred while deleting the instruction"
            };
        }
    }

    public async Task<ApiResponseDTO<AiCustomInstructionDTO>> GetInstructionAsync(int instructionId, int userId)
    {
        try
        {
            var instruction = await _context.AiCustomInstructions
                .Include(i => i.CreatedByUser)
                .FirstOrDefaultAsync(i => i.InstructionId == instructionId && 
                    (i.CreatedByUserId == userId || i.IsDefault == true));

            if (instruction == null)
            {
                return new ApiResponseDTO<AiCustomInstructionDTO>
                {
                    Success = false,
                    Message = "Instruction not found"
                };
            }

            var instructionDto = MapToDTO(instruction);

            return new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = true,
                Data = instructionDto
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting AI instruction {InstructionId} for user {UserId}", instructionId, userId);
            return new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = false,
                Message = "An error occurred while retrieving the instruction"
            };
        }
    }

    public async Task<ApiResponseDTO<List<AiCustomInstructionDTO>>> GetUserInstructionsAsync(int userId)
    {
        try
        {
            var instructions = await _context.AiCustomInstructions
                .Include(i => i.CreatedByUser)
                .Where(i => i.CreatedByUserId == userId || i.IsDefault == true)
                .OrderByDescending(i => i.IsDefault)
                .ThenByDescending(i => i.UpdatedAt)
                .ToListAsync();

            var instructionDtos = instructions.Select(MapToDTO).ToList();

            return new ApiResponseDTO<List<AiCustomInstructionDTO>>
            {
                Success = true,
                Data = instructionDtos
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting AI instructions for user {UserId}", userId);
            return new ApiResponseDTO<List<AiCustomInstructionDTO>>
            {
                Success = false,
                Message = "An error occurred while retrieving instructions"
            };
        }
    }

    public async Task<ApiResponseDTO<List<AiCustomInstructionDTO>>> GetTemplateInstructionsAsync()
    {
        try
        {
            var templates = await _context.AiCustomInstructions
                .Include(i => i.CreatedByUser)
                .Where(i => i.IsDefault == true && i.IsActive == true)
                .OrderBy(i => i.InstructionName)
                .ToListAsync();

            var templateDtos = templates.Select(MapToDTO).ToList();

            return new ApiResponseDTO<List<AiCustomInstructionDTO>>
            {
                Success = true,
                Data = templateDtos
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting template instructions");
            return new ApiResponseDTO<List<AiCustomInstructionDTO>>
            {
                Success = false,
                Message = "An error occurred while retrieving template instructions"
            };
        }
    }

    public async Task<ApiResponseDTO<AiCustomInstructionDTO>> GetDefaultInstructionAsync()
    {
        try
        {
            var defaultInstruction = await _context.AiCustomInstructions
                .Include(i => i.CreatedByUser)
                .FirstOrDefaultAsync(i => i.IsDefault == true && i.InstructionName.Contains("Default"));

            if (defaultInstruction == null)
            {
                return new ApiResponseDTO<AiCustomInstructionDTO>
                {
                    Success = false,
                    Message = "Default instruction not found"
                };
            }

            var instructionDto = MapToDTO(defaultInstruction);

            return new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = true,
                Data = instructionDto
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting default instruction");
            return new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = false,
                Message = "An error occurred while retrieving the default instruction"
            };
        }
    }

    public async Task<ApiResponseDTO<AiCustomInstructionDTO>> GetActiveInstructionAsync(int userId, string? instructionProfile = null)
    {
        try
        {
            AiCustomInstruction? instruction = null;

            if (!string.IsNullOrEmpty(instructionProfile))
            {
                // Try to find by name first
                instruction = await _context.AiCustomInstructions
                    .Include(i => i.CreatedByUser)
                    .FirstOrDefaultAsync(i => i.InstructionName.ToLower().Contains(instructionProfile.ToLower()) && 
                        i.IsActive == true && (i.CreatedByUserId == userId || i.IsDefault == true));
            }

            // Fallback to default if not found
            instruction ??= await _context.AiCustomInstructions
                .Include(i => i.CreatedByUser)
                .FirstOrDefaultAsync(i => i.IsDefault == true && i.InstructionName.Contains("Default"));

            if (instruction == null)
            {
                return new ApiResponseDTO<AiCustomInstructionDTO>
                {
                    Success = false,
                    Message = "No active instruction found"
                };
            }

            var instructionDto = MapToDTO(instruction);

            return new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = true,
                Data = instructionDto
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting active instruction for user {UserId}", userId);
            return new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = false,
                Message = "An error occurred while retrieving the active instruction"
            };
        }
    }

    public async Task<ApiResponseDTO<string>> TestInstructionAsync(int instructionId, string sampleQuery, int userId)
    {
        try
        {
            var instruction = await _context.AiCustomInstructions
                .FirstOrDefaultAsync(i => i.InstructionId == instructionId && 
                    (i.CreatedByUserId == userId || i.IsDefault == true));

            if (instruction == null)
            {
                return new ApiResponseDTO<string>
                {
                    Success = false,
                    Message = "Instruction not found"
                };
            }

            // Build a test prompt based on the instruction
            var testPrompt = $"{instruction.SystemPrompt}\n\n";
            if (!string.IsNullOrEmpty(instruction.BehaviorInstructions))
            {
                testPrompt += $"Hướng dẫn hành vi: {instruction.BehaviorInstructions}\n\n";
            }
            if (!string.IsNullOrEmpty(instruction.DataAccessRules))
            {
                testPrompt += $"Quy tắc truy cập dữ liệu: {instruction.DataAccessRules}\n\n";
            }
            testPrompt += $"Câu hỏi thử nghiệm: {sampleQuery}";

            // For now, return the constructed prompt. In a full implementation, 
            // this would be sent to the AI service for actual testing.
            var testResult = $"Test prompt được tạo thành công cho instruction '{instruction.InstructionName}':\n\n{testPrompt}";

            return new ApiResponseDTO<string>
            {
                Success = true,
                Message = "Test completed successfully",
                Data = testResult
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error testing AI instruction {InstructionId}", instructionId);
            return new ApiResponseDTO<string>
            {
                Success = false,
                Message = "An error occurred while testing the instruction"
            };
        }
    }

    public async Task<ApiResponseDTO<bool>> ValidateInstructionAsync(AiCustomInstructionCreateDTO instruction)
    {
        try
        {
            var errors = new List<string>();

            // Validate required fields
            if (string.IsNullOrWhiteSpace(instruction.InstructionName))
                errors.Add("Instruction name is required");

            if (string.IsNullOrWhiteSpace(instruction.SystemPrompt))
                errors.Add("System prompt is required");

            // Validate length limits
            if (instruction.InstructionName?.Length > 200)
                errors.Add("Instruction name must be 200 characters or less");

            if (instruction.SystemPrompt?.Length > 10000)
                errors.Add("System prompt must be 10,000 characters or less");

            if (instruction.BehaviorInstructions?.Length > 5000)
                errors.Add("Behavior instructions must be 5,000 characters or less");

            if (instruction.DataAccessRules?.Length > 2000)
                errors.Add("Data access rules must be 2,000 characters or less");

            // Check for duplicate names (would need userId context for this)
            // This is a simplified validation

            if (errors.Any())
            {
                return new ApiResponseDTO<bool>
                {
                    Success = false,
                    Message = string.Join("; ", errors)
                };
            }

            return new ApiResponseDTO<bool>
            {
                Success = true,
                Data = true
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating AI instruction");
            return new ApiResponseDTO<bool>
            {
                Success = false,
                Message = "An error occurred during validation"
            };
        }
    }

    public async Task<ApiResponseDTO<List<AiQueryAnalyticsDTO>>> GetInstructionAnalyticsAsync(int instructionId, int userId)
    {
        try
        {
            var analytics = await _context.AiQueryAnalytics
                .Where(a => a.InstructionId == instructionId && a.UserId == userId)
                .OrderByDescending(a => a.CreatedAt)
                .Take(100) // Limit to recent 100 queries
                .Select(a => new AiQueryAnalyticsDTO
                {
                    QueryId = a.QueryId,
                    UserId = a.UserId,
                    InstructionId = a.InstructionId,
                    QueryText = a.QueryText ?? "",
                    ResponseQuality = a.ResponseQuality,
                    ExecutionTime = a.ExecutionTime ?? 0,
                    DataTablesAccessed = a.DataTablesAccessed,
                    CreatedAt = a.CreatedAt ?? DateTime.UtcNow
                })
                .ToListAsync();

            return new ApiResponseDTO<List<AiQueryAnalyticsDTO>>
            {
                Success = true,
                Data = analytics
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting analytics for instruction {InstructionId}", instructionId);
            return new ApiResponseDTO<List<AiQueryAnalyticsDTO>>
            {
                Success = false,
                Message = "An error occurred while retrieving analytics"
            };
        }
    }

    public async Task<ApiResponseDTO<Dictionary<string, object>>> GetInstructionPerformanceAsync(int instructionId, int userId)
    {
        try
        {
            var analytics = await _context.AiQueryAnalytics
                .Where(a => a.InstructionId == instructionId && a.UserId == userId)
                .ToListAsync();

            var performance = new Dictionary<string, object>
            {
                ["totalQueries"] = analytics.Count,
                ["averageExecutionTime"] = analytics.Any() ? analytics.Average(a => a.ExecutionTime ?? 0) : 0,
                ["averageResponseQuality"] = analytics.Where(a => a.ResponseQuality.HasValue).Any() 
                    ? analytics.Where(a => a.ResponseQuality.HasValue).Average(a => a.ResponseQuality!.Value) : 0,
                ["queriesLast7Days"] = analytics.Count(a => a.CreatedAt >= DateTime.UtcNow.AddDays(-7)),
                ["mostAccessedTables"] = analytics
                    .Where(a => !string.IsNullOrEmpty(a.DataTablesAccessed))
                    .SelectMany(a => a.DataTablesAccessed!.Split(',', StringSplitOptions.RemoveEmptyEntries))
                    .GroupBy(t => t.Trim())
                    .OrderByDescending(g => g.Count())
                    .Take(5)
                    .ToDictionary(g => g.Key, g => g.Count())
            };

            return new ApiResponseDTO<Dictionary<string, object>>
            {
                Success = true,
                Data = performance
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting performance for instruction {InstructionId}", instructionId);
            return new ApiResponseDTO<Dictionary<string, object>>
            {
                Success = false,
                Message = "An error occurred while retrieving performance data"
            };
        }
    }

    // Private helper methods
    private AiCustomInstructionDTO MapToDTO(AiCustomInstruction instruction)
    {
        return new AiCustomInstructionDTO
        {
            InstructionId = instruction.InstructionId,
            CreatedByUserId = instruction.CreatedByUserId,
            InstructionName = instruction.InstructionName,
            SystemPrompt = instruction.SystemPrompt,
            BehaviorInstructions = instruction.BehaviorInstructions,
            DataAccessRules = instruction.DataAccessRules,
            IsActive = instruction.IsActive ?? false,
            IsDefault = instruction.IsDefault ?? false,
            CreatedAt = instruction.CreatedAt,
            UpdatedAt = instruction.UpdatedAt,
            CreatedByUser = instruction.CreatedByUser != null ? new UserBasicDTO
            {
                UserId = instruction.CreatedByUser.UserId,
                Email = instruction.CreatedByUser.Email,
                FullName = instruction.CreatedByUser.Email // Use email as display name for now
            } : null
        };
    }

    public async Task<ApiResponseDTO<List<AiCustomInstructionDTO>>> GetAllInstructionsAsync()
    {
        try
        {
            var instructions = await _context.AiCustomInstructions
                .Include(i => i.CreatedByUser)
                .OrderByDescending(i => i.IsDefault)
                .ThenByDescending(i => i.UpdatedAt)
                .ToListAsync();

            var instructionDtos = instructions.Select(MapToDTO).ToList();

            return new ApiResponseDTO<List<AiCustomInstructionDTO>>
            {
                Success = true,
                Data = instructionDtos
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all AI instructions");
            return new ApiResponseDTO<List<AiCustomInstructionDTO>>
            {
                Success = false,
                Message = "An error occurred while retrieving all instructions"
            };
        }
    }

    public async Task<ApiResponseDTO<bool>> DeleteAnyInstructionAsync(int instructionId)
    {
        try
        {
            var instruction = await _context.AiCustomInstructions
                .FirstOrDefaultAsync(i => i.InstructionId == instructionId);

            if (instruction == null)
            {
                return new ApiResponseDTO<bool>
                {
                    Success = false,
                    Message = "Instruction not found"
                };
            }

            if (instruction.IsDefault == true)
            {
                return new ApiResponseDTO<bool>
                {
                    Success = false,
                    Message = "Cannot delete default instruction templates"
                };
            }

            _context.AiCustomInstructions.Remove(instruction);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Admin deleted AI instruction {InstructionId}", instructionId);

            return new ApiResponseDTO<bool>
            {
                Success = true,
                Message = "AI instruction deleted successfully",
                Data = true
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting AI instruction {InstructionId} (admin operation)", instructionId);
            return new ApiResponseDTO<bool>
            {
                Success = false,
                Message = "An error occurred while deleting the instruction"
            };
        }
    }

    public async Task<ApiResponseDTO<AiCustomInstructionDTO>> UpdateAnyInstructionAsync(int instructionId, AiCustomInstructionUpdateDTO request)
    {
        try
        {
            var instruction = await _context.AiCustomInstructions
                .FirstOrDefaultAsync(i => i.InstructionId == instructionId);

            if (instruction == null)
            {
                return new ApiResponseDTO<AiCustomInstructionDTO>
                {
                    Success = false,
                    Message = "Instruction not found"
                };
            }

            // Update instruction fields
            instruction.InstructionName = request.InstructionName ?? instruction.InstructionName;
            instruction.SystemPrompt = request.SystemPrompt ?? instruction.SystemPrompt;
            instruction.BehaviorInstructions = request.BehaviorInstructions ?? instruction.BehaviorInstructions;
            instruction.DataAccessRules = request.DataAccessRules ?? instruction.DataAccessRules;
            instruction.IsActive = request.IsActive;
            instruction.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Admin updated AI instruction {InstructionId}", instructionId);

            var updatedDto = MapToDTO(instruction);
            return new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = true,
                Message = "AI instruction updated successfully",
                Data = updatedDto
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating AI instruction {InstructionId} (admin operation)", instructionId);
            return new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = false,
                Message = "An error occurred while updating the instruction"
            };
        }
    }

    public async Task<ApiResponseDTO<string>> TestAnyInstructionAsync(int instructionId, string sampleQuery)
    {
        try
        {
            var instruction = await _context.AiCustomInstructions
                .FirstOrDefaultAsync(i => i.InstructionId == instructionId);

            if (instruction == null)
            {
                return new ApiResponseDTO<string>
                {
                    Success = false,
                    Message = "Instruction not found"
                };
            }

            // **ENHANCED TESTING WITH FULL AI INFRASTRUCTURE**
            
            // Step 1: Analyze query to determine database needs
            var queryAnalysis = await _queryEngine.AnalyzeQueryAsync(sampleQuery);
            
            // Step 2: Get database context if needed
            string databaseContext = "";
            if (queryAnalysis.RequiredTables.Any())
            {
                var databaseResponse = await _databaseService.GetContextualDataAsync(queryAnalysis);
                if (databaseResponse.Success)
                {
                    databaseContext = await _databaseService.FormatDataForAIAsync(databaseResponse.Data, "natural");
                }
            }

            // Step 3: Build enhanced prompt with instruction + database context
            var systemPrompt = instruction.SystemPrompt;
            if (!string.IsNullOrEmpty(instruction.BehaviorInstructions))
            {
                systemPrompt += $"\n\nHướng dẫn hành vi: {instruction.BehaviorInstructions}";
            }
            if (!string.IsNullOrEmpty(instruction.DataAccessRules))
            {
                systemPrompt += $"\n\nQuy tắc truy cập dữ liệu: {instruction.DataAccessRules}";
            }

            // Step 4: Add database context to system prompt
            if (!string.IsNullOrEmpty(databaseContext))
            {
                systemPrompt += $"\n\nDữ liệu có sẵn:\n{databaseContext}";
                systemPrompt += "\n\nSử dụng dữ liệu này để trả lời câu hỏi cụ thể với thông tin thực tế.";
            }

            // Step 5: Call Gemini API with enhanced prompt
            var geminiResponse = await CallGeminiAPI(systemPrompt, sampleQuery);

            if (geminiResponse.Success)
            {
                // Save test analytics with database tables accessed
                await SaveTestAnalytics(instructionId, sampleQuery, true, geminiResponse.Data?.Length ?? 0);
                
                // Log database query execution if data was accessed
                if (queryAnalysis.RequiredTables.Any())
                {
                    await _databaseService.LogQueryExecutionAsync(
                        1, // Test user ID
                        sampleQuery,
                        string.Join(",", queryAnalysis.RequiredTables),
                        100, // Simulated execution time
                        instructionId
                    );
                }
                
                _logger.LogInformation("Successfully tested AI instruction {InstructionId} with database access", instructionId);
                
                var enhancedResponse = geminiResponse.Data;
                if (!string.IsNullOrEmpty(databaseContext))
                {
                    enhancedResponse = $"✅ Database Connected - Query analyzed: {queryAnalysis.QueryCategory}\n" +
                                     $"📊 Tables accessed: {string.Join(", ", queryAnalysis.RequiredTables)}\n\n" +
                                     $"{geminiResponse.Data}";
                }
                
                return new ApiResponseDTO<string>
                {
                    Success = true,
                    Message = $"Test completed successfully for instruction '{instruction.InstructionName}' with database access",
                    Data = enhancedResponse
                };
            }
            else
            {
                // Save failed test analytics
                await SaveTestAnalytics(instructionId, sampleQuery, false, 0);
                
                _logger.LogWarning("Failed to test AI instruction {InstructionId} with Gemini: {Error}", instructionId, geminiResponse.Message);
                return new ApiResponseDTO<string>
                {
                    Success = false,
                    Message = $"Failed to test instruction: {geminiResponse.Message}",
                    Data = null
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error testing AI instruction {InstructionId}", instructionId);
            return new ApiResponseDTO<string>
            {
                Success = false,
                Message = "An error occurred while testing the instruction"
            };
        }
    }

    public async Task<ApiResponseDTO<string>> TestAnyInstructionWithModelAsync(int instructionId, string sampleQuery, string model)
    {
        try
        {
            var instruction = await _context.AiCustomInstructions
                .FirstOrDefaultAsync(i => i.InstructionId == instructionId);

            if (instruction == null)
            {
                return new ApiResponseDTO<string>
                {
                    Success = false,
                    Message = "Instruction not found"
                };
            }

            // **ENHANCED TESTING WITH FULL AI INFRASTRUCTURE**
            
            // Step 1: Analyze query to determine database needs
            var queryAnalysis = await _queryEngine.AnalyzeQueryAsync(sampleQuery);
            
            // Step 2: Get database context if needed
            string databaseContext = "";
            if (queryAnalysis.RequiredTables.Any())
            {
                var databaseResponse = await _databaseService.GetContextualDataAsync(queryAnalysis);
                if (databaseResponse.Success)
                {
                    databaseContext = await _databaseService.FormatDataForAIAsync(databaseResponse.Data, "natural");
                }
            }

            // Step 3: Build enhanced prompt with instruction + database context
            var systemPrompt = instruction.SystemPrompt;
            if (!string.IsNullOrEmpty(instruction.BehaviorInstructions))
            {
                systemPrompt += $"\n\nHướng dẫn hành vi: {instruction.BehaviorInstructions}";
            }
            if (!string.IsNullOrEmpty(instruction.DataAccessRules))
            {
                systemPrompt += $"\n\nQuy tắc truy cập dữ liệu: {instruction.DataAccessRules}";
            }

            // Step 4: Add database context to system prompt
            if (!string.IsNullOrEmpty(databaseContext))
            {
                systemPrompt += $"\n\nDữ liệu có sẵn:\n{databaseContext}";
                systemPrompt += "\n\nSử dụng dữ liệu này để trả lời câu hỏi cụ thể với thông tin thực tế.";
            }

            // Step 5: Create conversation context for testing
            var testConversationId = $"test_{Guid.NewGuid():N}";
            
            // Step 6: Call Gemini API with enhanced prompt
            var geminiResponse = await CallGeminiAPIWithModel(systemPrompt, sampleQuery, model);

            if (geminiResponse.Success)
            {
                // Save test analytics with database tables accessed
                await SaveTestAnalytics(instructionId, sampleQuery, true, geminiResponse.Data?.Length ?? 0);
                
                // Log database query execution if data was accessed
                if (queryAnalysis.RequiredTables.Any())
                {
                    await _databaseService.LogQueryExecutionAsync(
                        1, // Test user ID
                        sampleQuery,
                        string.Join(",", queryAnalysis.RequiredTables),
                        100, // Simulated execution time
                        instructionId
                    );
                }
                
                _logger.LogInformation("Successfully tested AI instruction {InstructionId} with model {Model} and database access", instructionId, model);
                
                var enhancedResponse = geminiResponse.Data;
                if (!string.IsNullOrEmpty(databaseContext))
                {
                    enhancedResponse = $"✅ Database Connected - Query analyzed: {queryAnalysis.QueryCategory}\n" +
                                     $"📊 Tables accessed: {string.Join(", ", queryAnalysis.RequiredTables)}\n\n" +
                                     $"{geminiResponse.Data}";
                }
                
                return new ApiResponseDTO<string>
                {
                    Success = true,
                    Message = $"Test completed successfully for instruction '{instruction.InstructionName}' using model '{model}' with database access",
                    Data = enhancedResponse
                };
            }
            else
            {
                // Save failed test analytics
                await SaveTestAnalytics(instructionId, sampleQuery, false, 0);
                
                _logger.LogWarning("Failed to test AI instruction {InstructionId} with model {Model}: {Error}", instructionId, model, geminiResponse.Message);
                return new ApiResponseDTO<string>
                {
                    Success = false,
                    Message = $"Failed to test instruction with model {model}: {geminiResponse.Message}",
                    Data = null
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error testing AI instruction {InstructionId} with model {Model}", instructionId, model);
            return new ApiResponseDTO<string>
            {
                Success = false,
                Message = "An error occurred while testing the instruction"
            };
        }
    }

    // Helper method to call Gemini API
    private async Task<ApiResponseDTO<string>> CallGeminiAPI(string systemPrompt, string userMessage)
    {
        try
        {
            var geminiRequest = new GeminiRequestDTO
            {
                Contents = new List<ContentPart>
                {
                    new ContentPart
                    {
                        Parts = new List<TextPart>
                        {
                            new TextPart { Text = $"{systemPrompt}\n\nCâu hỏi: {userMessage}" }
                        }
                    }
                },
                GenerationConfig = new GenerationConfig
                {
                    Temperature = _geminiConfig.Temperature,
                    MaxOutputTokens = _geminiConfig.MaxTokens
                }
            };

            var json = JsonSerializer.Serialize(geminiRequest, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            });

            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var url = $"{_geminiConfig.GetFullUrl()}?key={_geminiConfig.ApiKey}";
            var response = await _httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Gemini API error: {StatusCode} - {Content}", response.StatusCode, errorContent);
                
                return new ApiResponseDTO<string>
                {
                    Success = false,
                    Message = "Không thể kết nối với Gemini API"
                };
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var geminiResponse = JsonSerializer.Deserialize<GeminiResponseDTO>(responseContent, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            });

            if (geminiResponse?.Candidates?.Count > 0 && 
                geminiResponse.Candidates[0].Content?.Parts?.Count > 0)
            {
                var aiResponse = geminiResponse.Candidates[0].Content.Parts[0].Text;

                return new ApiResponseDTO<string>
                {
                    Success = true,
                    Message = "AI response received successfully",
                    Data = aiResponse
                };
            }

            return new ApiResponseDTO<string>
            {
                Success = false,
                Message = "Không nhận được phản hồi từ Gemini API"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling Gemini API for instruction testing");
            return new ApiResponseDTO<string>
            {
                Success = false,
                Message = "Lỗi khi gọi Gemini API"
            };
        }
    }

    // Helper method to call Gemini API with a specific model
    private async Task<ApiResponseDTO<string>> CallGeminiAPIWithModel(string systemPrompt, string userMessage, string model)
    {
        try
        {
            var geminiRequest = new GeminiRequestDTO
            {
                Contents = new List<ContentPart>
                {
                    new ContentPart
                    {
                        Parts = new List<TextPart>
                        {
                            new TextPart { Text = $"{systemPrompt}\n\nCâu hỏi: {userMessage}" }
                        }
                    }
                },
                GenerationConfig = new GenerationConfig
                {
                    Temperature = _geminiConfig.Temperature,
                    MaxOutputTokens = _geminiConfig.MaxTokens
                }
            };

            var json = JsonSerializer.Serialize(geminiRequest, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            });

            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var url = $"{_geminiConfig.GetFullUrl(model)}?key={_geminiConfig.ApiKey}";
            var response = await _httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Gemini API error with model {Model}: {StatusCode} - {Content}", model, response.StatusCode, errorContent);
                
                return new ApiResponseDTO<string>
                {
                    Success = false,
                    Message = $"Không thể kết nối với Gemini API using model {model}"
                };
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var geminiResponse = JsonSerializer.Deserialize<GeminiResponseDTO>(responseContent, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            });

            if (geminiResponse?.Candidates?.Count > 0 && 
                geminiResponse.Candidates[0].Content?.Parts?.Count > 0)
            {
                var aiResponse = geminiResponse.Candidates[0].Content.Parts[0].Text;

                return new ApiResponseDTO<string>
                {
                    Success = true,
                    Message = "AI response received successfully",
                    Data = aiResponse
                };
            }

            return new ApiResponseDTO<string>
            {
                Success = false,
                Message = $"Không nhận được phản hồi từ Gemini API với model {model}"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling Gemini API with model {Model} for instruction testing", model);
            return new ApiResponseDTO<string>
            {
                Success = false,
                Message = $"Lỗi khi gọi Gemini API với model {model}"
            };
        }
    }

    // Helper method to save test analytics (metadata only)
    private async Task SaveTestAnalytics(int instructionId, string query, bool success, int responseLength)
    {
        try
        {
            var analytics = new AiQueryAnalytic
            {
                UserId = 1, // Default to admin user for testing
                InstructionId = instructionId,
                ConversationId = $"test_{Guid.NewGuid():N}",
                QueryText = query.Length > 1000 ? query.Substring(0, 1000) + "..." : query, // Truncate long queries
                ResponseQuality = success ? 5 : 1, // Simple success/failure rating
                ExecutionTime = null, // Not tracking execution time for tests
                DataTablesAccessed = "test_mode", // Mark as test data
                CreatedAt = DateTime.UtcNow
            };

            _context.AiQueryAnalytics.Add(analytics);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // Don't fail the test if analytics saving fails
            _logger.LogWarning(ex, "Failed to save test analytics for instruction {InstructionId}", instructionId);
        }
    }

    // Gemini model configuration management methods
    public Task<ApiResponseDTO<object>> GetGeminiConfigAsync()
    {
        try
        {
            var config = new
            {
                CurrentModel = _geminiConfig.Model,
                MaxTokens = _geminiConfig.MaxTokens,
                Temperature = _geminiConfig.Temperature,
                FullUrl = _geminiConfig.GetFullUrl()
            };

            return Task.FromResult(new ApiResponseDTO<object>
            {
                Success = true,
                Message = "Gemini configuration retrieved successfully",
                Data = config
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting Gemini configuration");
            return Task.FromResult(new ApiResponseDTO<object>
            {
                Success = false,
                Message = "Lỗi khi lấy cấu hình Gemini"
            });
        }
    }

    public Task<ApiResponseDTO<List<string>>> GetAvailableGeminiModelsAsync()
    {
        try
        {
            var availableModels = new List<string>
            {
                "gemini-2.5-pro",
                "gemini-2.5-flash",
                "gemini-2.5-flash-lite-preview-06-17",
                "gemini-2.0-flash",
                "gemini-2.0-flash-lite",
                "gemini-1.5-flash",
                "gemini-1.5-flash-8b",
                "gemini-1.5-pro"
            };

            return Task.FromResult(new ApiResponseDTO<List<string>>
            {
                Success = true,
                Message = "Available Gemini models retrieved successfully",
                Data = availableModels
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available Gemini models");
            return Task.FromResult(new ApiResponseDTO<List<string>>
            {
                Success = false,
                Message = "Lỗi khi lấy danh sách mô hình Gemini"
            });
        }
    }
}
