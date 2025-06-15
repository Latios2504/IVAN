using ivan_api.DTOs;

namespace ivan_api.Services;

public interface IChatBotService
{
    Task<ApiResponseDTO<ChatMessageResponseDTO>> SendMessageAsync(int userId, ChatMessageRequestDTO request);
}
