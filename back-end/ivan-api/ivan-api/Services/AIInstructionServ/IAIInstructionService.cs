using ivan_api.DTOs;
using ivan_api.DTOs.AIDatabaseManage;
using ivan_api.Models;

namespace ivan_api.Services.AIInstructionServ;

public interface IAIInstructionService
{
    // CRUD operations for custom instructions
    Task<ApiResponseDTO<AiCustomInstructionDTO>> CreateInstructionAsync(int userId, AiCustomInstructionCreateDTO request);
    Task<ApiResponseDTO<AiCustomInstructionDTO>> UpdateInstructionAsync(int instructionId, int userId, AiCustomInstructionUpdateDTO request);
    Task<ApiResponseDTO<bool>> DeleteInstructionAsync(int instructionId, int userId);
    Task<ApiResponseDTO<AiCustomInstructionDTO>> GetInstructionAsync(int instructionId, int userId);
    Task<ApiResponseDTO<List<AiCustomInstructionDTO>>> GetUserInstructionsAsync(int userId);

    // Admin-only operations
    Task<ApiResponseDTO<List<AiCustomInstructionDTO>>> GetAllInstructionsAsync(); // Admin can see all instructions
    Task<ApiResponseDTO<bool>> DeleteAnyInstructionAsync(int instructionId); // Admin can delete any instruction
    Task<ApiResponseDTO<AiCustomInstructionDTO>> UpdateAnyInstructionAsync(int instructionId, AiCustomInstructionUpdateDTO request); // Admin can update any instruction

    // Template and default instructions
    Task<ApiResponseDTO<List<AiCustomInstructionDTO>>> GetTemplateInstructionsAsync();
    Task<ApiResponseDTO<AiCustomInstructionDTO>> GetDefaultInstructionAsync();
    Task<ApiResponseDTO<AiCustomInstructionDTO>> GetActiveInstructionAsync(int userId, string? instructionProfile = null);

    // Instruction testing and validation
    Task<ApiResponseDTO<string>> TestInstructionAsync(int instructionId, string sampleQuery, int userId);
    Task<ApiResponseDTO<string>> TestAnyInstructionAsync(int instructionId, string sampleQuery); // Admin can test any instruction
    Task<ApiResponseDTO<string>> TestAnyInstructionWithModelAsync(int instructionId, string sampleQuery, string model); // Admin can test with specific model
    Task<ApiResponseDTO<bool>> ValidateInstructionAsync(AiCustomInstructionCreateDTO instruction);

    // Analytics and insights
    Task<ApiResponseDTO<List<AiQueryAnalyticsDTO>>> GetInstructionAnalyticsAsync(int instructionId, int userId);
    Task<ApiResponseDTO<Dictionary<string, object>>> GetInstructionPerformanceAsync(int instructionId, int userId);

    // Gemini model configuration management (Admin only)
    Task<ApiResponseDTO<object>> GetGeminiConfigAsync();
    Task<ApiResponseDTO<List<string>>> GetAvailableGeminiModelsAsync();
}
