using ivan_api.DTOs.AI;
using ivan_api.Models;
using ivan_api.Services.AI.Interfaces;

namespace ivan_api.Services.AI;

/// <summary>
/// Orchestrator service for AI Custom Instructions - delegates to specialized services
/// </summary>
public class AiInstructionsService : IAiInstructionsService
{
    private readonly IAiInstructionsCrudService _crudService;
    private readonly IAiInstructionsTestingService _testingService;
    private readonly IAiInstructionsAnalyticsService _analyticsService;
    private readonly ILogger<AiInstructionsService> _logger;

    public AiInstructionsService(
        IAiInstructionsCrudService crudService,
        IAiInstructionsTestingService testingService,
        IAiInstructionsAnalyticsService analyticsService,
        ILogger<AiInstructionsService> logger)
    {
        _crudService = crudService;
        _testingService = testingService;
        _analyticsService = analyticsService;
        _logger = logger;
    }

    #region CRUD Operations - Delegated to CrudService

    public async Task<IEnumerable<AiCustomInstructionDTO>> GetAllInstructionsAsync()
    {
        return await _crudService.GetAllInstructionsAsync();
    }

    public async Task<IEnumerable<AiCustomInstructionDTO>> GetUserInstructionsAsync(int userId)
    {
        return await _crudService.GetUserInstructionsAsync(userId);
    }

    public async Task<AiCustomInstructionDTO?> GetInstructionByIdAsync(int instructionId)
    {
        return await _crudService.GetInstructionByIdAsync(instructionId);
    }

    public async Task<AiCustomInstructionDTO> CreateInstructionAsync(AiCustomInstructionCreateDTO createDto, int createdByUserId)
    {
        return await _crudService.CreateInstructionAsync(createDto, createdByUserId);
    }

    public async Task<AiCustomInstructionDTO> UpdateInstructionAsync(int instructionId, AiCustomInstructionUpdateDTO updateDto)
    {
        return await _crudService.UpdateInstructionAsync(instructionId, updateDto);
    }

    public async Task<bool> DeleteInstructionAsync(int instructionId)
    {
        return await _crudService.DeleteInstructionAsync(instructionId);
    }

    #endregion

    #region Status Management - Delegated to CrudService

    public async Task<AiCustomInstructionDTO> ToggleInstructionStatusAsync(int instructionId, bool isActive)
    {
        return await _crudService.ToggleInstructionStatusAsync(instructionId, isActive);
    }

    #endregion

    #region Template Management - Delegated to CrudService

    public async Task<IEnumerable<AiCustomInstructionDTO>> GetTemplateInstructionsAsync()
    {
        return await _crudService.GetTemplateInstructionsAsync();
    }

    public async Task<AiCustomInstructionDTO?> GetDefaultInstructionAsync()
    {
        return await _crudService.GetDefaultInstructionAsync();
    }

    #endregion

    #region Testing & Analytics - Delegated to Specialized Services

    public async Task<TestInstructionResponseDTO> TestInstructionWithModelAsync(int instructionId, TestInstructionWithModelRequestDTO testRequest)
    {
        return await _testingService.TestInstructionWithModelAsync(instructionId, testRequest);
    }

    public async Task<IEnumerable<AiQueryAnalyticsDTO>> GetInstructionAnalyticsAsync(int instructionId)
    {
        return await _analyticsService.GetInstructionAnalyticsAsync(instructionId);
    }

    public async Task<InstructionPerformanceDTO> GetInstructionPerformanceAsync(int instructionId)
    {
        return await _analyticsService.GetInstructionPerformanceAsync(instructionId);
    }

    public async Task<IEnumerable<AiQueryAnalyticsDTO>> GetAllAnalyticsAsync()
    {
        return await _analyticsService.GetAllAnalyticsAsync();
    }

    #endregion

    #region AI Provider Integration - Delegated to TestingService

    public async Task<IEnumerable<string>> GetAvailableModelsAsync()
    {
        return await _testingService.GetAvailableModelsAsync();
    }

    public async Task<object> GetAiConfigurationAsync()
    {
        return await _testingService.GetAiConfigurationAsync();
    }

    #endregion
}
