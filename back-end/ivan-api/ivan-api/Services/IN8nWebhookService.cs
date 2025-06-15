using ivan_api.DTOs;

namespace ivan_api.Services
{
    public interface IN8nWebhookService
    {
        Task SendUserRegistrationAsync(int userId, string email, string roleName);
    }
}
