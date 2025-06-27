using Microsoft.EntityFrameworkCore;
using ivan_api.DTOs;
using ivan_api.Models;

namespace ivan_api.Services;

public class AIInstructionService : IAIInstructionService
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly ILogger<AIInstructionService> _logger;

    public AIInstructionService(VolunteerManagementSystemContext context, ILogger<AIInstructionService> logger)
    {
        _context = context;
        _logger = logger;
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

            if (instruction.IsDefault)
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
                    (i.CreatedByUserId == userId || i.IsDefault));

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
                .Where(i => i.CreatedByUserId == userId || i.IsDefault)
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
                .Where(i => i.IsDefault && i.IsActive)
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
                .FirstOrDefaultAsync(i => i.IsDefault && i.InstructionName.Contains("Default"));

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
                        i.IsActive && (i.CreatedByUserId == userId || i.IsDefault));
            }

            // Fallback to default if not found
            instruction ??= await _context.AiCustomInstructions
                .Include(i => i.CreatedByUser)
                .FirstOrDefaultAsync(i => i.IsDefault && i.InstructionName.Contains("Default"));

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
                    (i.CreatedByUserId == userId || i.IsDefault));

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
                    QueryText = a.QueryText,
                    ResponseQuality = a.ResponseQuality,
                    ExecutionTime = a.ExecutionTime,
                    DataTablesAccessed = a.DataTablesAccessed,
                    CreatedAt = a.CreatedAt
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
                ["averageExecutionTime"] = analytics.Any() ? analytics.Average(a => a.ExecutionTime) : 0,
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
            InstructionName = instruction.InstructionName,
            SystemPrompt = instruction.SystemPrompt,
            BehaviorInstructions = instruction.BehaviorInstructions,
            DataAccessRules = instruction.DataAccessRules,
            IsActive = instruction.IsActive,
            IsDefault = instruction.IsDefault
        };
    }
}
