namespace ivan_api.Services;

public interface IEmailService
{
    Task SendPasswordResetEmailAsync(string email, string resetCode);
    Task SendEmailVerificationAsync(string email, string verificationCode);
    Task SendWelcomeEmailAsync(string email, string userName);
    Task SendEventNotificationAsync(string email, string eventName, string eventDetails);
    Task SendEventReminderAsync(string email, string eventName, DateTime eventDate);
    Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true);
}
