using ivan_api.DTOs;

namespace ivan_api.Services;

public interface IGoogleSheetsService
{
    Task<ApiResponseDTO<GoogleSheetsResponseDTO>> ReadSheetDataAsync(string query, string? sheetId = null, string? range = null);
    Task<ApiResponseDTO<GoogleSheetsResponseDTO>> ReadSheetDataForAIAsync(string userQuery, string? sheetId = null);
}
