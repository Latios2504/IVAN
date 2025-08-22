using ivan_api.Configuration;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace ivan_api.Services.EmailSer;

public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;
    private readonly EmailConfiguration _emailConfig;

    public EmailService(ILogger<EmailService> logger, IOptions<EmailConfiguration> emailConfig)
    {
        _logger = logger;
        _emailConfig = emailConfig.Value;
    }

    public async Task SendPasswordResetEmailAsync(string email, string resetCode)
    {
        var subject = "Đặt lại mật khẩu - IVAN Volunteer System";
        var body = CreatePasswordResetEmailBody(resetCode);
        
        await SendEmailAsync(email, subject, body);
        _logger.LogInformation($"Password reset email sent to: {email}");
    }

    public async Task SendEmailVerificationAsync(string email, string verificationCode)
    {
        var subject = "Xác thực email - IVAN Volunteer System";
        var body = CreateEmailVerificationBody(verificationCode);
        
        await SendEmailAsync(email, subject, body);
        _logger.LogInformation($"Email verification sent to: {email}");
    }

    public async Task SendWelcomeEmailAsync(string email, string userName)
    {
        var subject = "Chào mừng đến với IVAN Volunteer System";
        var body = CreateWelcomeEmailBody(userName);
        
        await SendEmailAsync(email, subject, body);
        _logger.LogInformation($"Welcome email sent to: {email}");
    }

    public async Task SendEventNotificationAsync(string email, string eventName, string eventDetails)
    {
        var subject = $"Thông báo sự kiện mới: {eventName}";
        var body = CreateEventNotificationBody(eventName, eventDetails);
        
        await SendEmailAsync(email, subject, body);
        _logger.LogInformation($"Event notification email sent to: {email}");
    }

    public async Task SendEventReminderAsync(string email, string eventName, DateTime eventDate)
    {
        var subject = $"Nhắc nhở sự kiện: {eventName}";
        var body = CreateEventReminderBody(eventName, eventDate);
        
        await SendEmailAsync(email, subject, body);
        _logger.LogInformation($"Event reminder email sent to: {email}");
    }

    public async Task SendTemporaryPasswordEmailAsync(string email, string userName, string temporaryPassword)
    {
        var subject = "Tài khoản Volunteer Coordinator - IVAN Volunteer System";
        var body = CreateTemporaryPasswordEmailBody(userName, temporaryPassword);
        
        await SendEmailAsync(email, subject, body);
        _logger.LogInformation($"Temporary password email sent to: {email}");
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true)
    {
        try
        {
            // Development mode - just log instead of sending actual emails
            if (_emailConfig.EnableDevelopmentMode)
            {
                _logger.LogInformation($"=== EMAIL (Development Mode) ===");
                _logger.LogInformation($"To: {toEmail}");
                _logger.LogInformation($"Subject: {subject}");
                _logger.LogInformation($"Body: {body}");
                _logger.LogInformation($"================================");
                return;
            }

            // Validate email configuration
            if (string.IsNullOrEmpty(_emailConfig.SmtpHost) || 
                string.IsNullOrEmpty(_emailConfig.Username) || 
                string.IsNullOrEmpty(_emailConfig.Password))
            {
                _logger.LogError("Email configuration is incomplete. Please check appsettings.json");
                throw new InvalidOperationException("Email configuration is incomplete");
            }

            using var client = new SmtpClient(_emailConfig.SmtpHost, _emailConfig.SmtpPort);
            client.EnableSsl = _emailConfig.EnableSsl;
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential(_emailConfig.Username, _emailConfig.Password);

            using var mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(_emailConfig.FromEmail, _emailConfig.FromName);
            mailMessage.To.Add(toEmail);
            mailMessage.Subject = subject;
            mailMessage.Body = body;
            mailMessage.IsBodyHtml = isHtml;
            mailMessage.BodyEncoding = Encoding.UTF8;
            mailMessage.SubjectEncoding = Encoding.UTF8;

            await client.SendMailAsync(mailMessage);
            _logger.LogInformation($"Email sent successfully to: {toEmail}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Failed to send email to: {toEmail}");
            throw;
        }
    }

    #region Email Templates

    private string CreatePasswordResetEmailBody(string resetCode)
    {
        return $@"
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset='UTF-8'>
                <title>Đặt lại mật khẩu</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #4CAF50; color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background-color: #f9f9f9; }}
                    .reset-code {{ background-color: #e7f3ff; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0; }}
                    .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>IVAN Volunteer System</h1>
                        <h2>Đặt lại mật khẩu</h2>
                    </div>
                    <div class='content'>
                        <p>Xin chào,</p>
                        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản IVAN Volunteer System của mình.</p>
                        <div class='reset-code'>
                            <h3>Mã đặt lại mật khẩu của bạn:</h3>
                            <h2 style='color: #2196F3; letter-spacing: 2px;'>{resetCode}</h2>
                        </div>
                        <p>Vui lòng sử dụng mã này để đặt lại mật khẩu. Mã này sẽ hết hạn sau 15 phút.</p>
                        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                        <p>Trân trọng,<br>Đội ngũ IVAN Volunteer System</p>
                    </div>
                    <div class='footer'>
                        <p>© 2024 IVAN Volunteer System. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </body>
            </html>";
    }

    private string CreateEmailVerificationBody(string verificationCode)
    {
        return $@"
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset='UTF-8'>
                <title>Xác thực email</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #2196F3; color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background-color: #f9f9f9; }}
                    .verification-code {{ background-color: #e7f3ff; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0; }}
                    .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>IVAN Volunteer System</h1>
                        <h2>Xác thực địa chỉ email</h2>
                    </div>
                    <div class='content'>
                        <p>Xin chào,</p>
                        <p>Cảm ơn bạn đã đăng ký tài khoản IVAN Volunteer System!</p>
                        <div class='verification-code'>
                            <h3>Mã xác thực email của bạn:</h3>
                            <h2 style='color: #2196F3; letter-spacing: 2px;'>{verificationCode}</h2>
                        </div>
                        <p>Vui lòng sử dụng mã này để xác thực địa chỉ email của bạn và kích hoạt tài khoản.</p>
                        <p>Mã này sẽ hết hạn sau 24 giờ.</p>
                        <p>Trân trọng,<br>Đội ngũ IVAN Volunteer System</p>
                    </div>
                    <div class='footer'>
                        <p>© 2024 IVAN Volunteer System. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </body>
            </html>";
    }

    private string CreateWelcomeEmailBody(string userName)
    {
        return $@"
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset='UTF-8'>
                <title>Chào mừng đến với IVAN</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #4CAF50; color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background-color: #f9f9f9; }}
                    .welcome-box {{ background-color: #e8f5e8; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0; }}
                    .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>🎉 Chào mừng đến với IVAN! 🎉</h1>
                    </div>
                    <div class='content'>
                        <div class='welcome-box'>
                            <h2>Xin chào {userName}!</h2>
                            <p>Chào mừng bạn đến với cộng đồng tình nguyện viên IVAN!</p>
                        </div>
                        <p>Tài khoản của bạn đã được tạo thành công và sẵn sàng để bắt đầu hành trình tình nguyện ý nghĩa.</p>
                        <h3>Bạn có thể:</h3>
                        <ul>
                            <li>🔍 Tìm kiếm và tham gia các hoạt động tình nguyện</li>
                            <li>📅 Quản lý lịch trình tình nguyện của mình</li>
                            <li>👥 Kết nối với cộng đồng tình nguyện viên</li>
                            <li>📊 Theo dõi các hoạt động và thành tích của bạn</li>
                            <li>🎓 Nhận chứng chỉ tình nguyện</li>
                        </ul>
                        <p>Hãy đăng nhập và khám phá những cơ hội tình nguyện tuyệt vời đang chờ đợi bạn!</p>
                        <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>
                        <p>Trân trọng,<br>Đội ngũ IVAN Volunteer System</p>
                    </div>
                    <div class='footer'>
                        <p>© 2024 IVAN Volunteer System. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </body>
            </html>";
    }

    private string CreateEventNotificationBody(string eventName, string eventDetails)
    {
        return $@"
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset='UTF-8'>
                <title>Thông báo sự kiện mới</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #FF9800; color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background-color: #f9f9f9; }}
                    .event-box {{ background-color: #fff3e0; padding: 15px; border-left: 4px solid #FF9800; margin: 20px 0; }}
                    .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>📢 Sự kiện tình nguyện mới!</h1>
                    </div>
                    <div class='content'>
                        <p>Xin chào,</p>
                        <div class='event-box'>
                            <h2>{eventName}</h2>
                            <div>{eventDetails}</div>
                        </div>
                        <p>Một sự kiện tình nguyện mới vừa được tạo và chúng tôi nghĩ bạn sẽ quan tâm!</p>
                        <p>Đăng nhập vào hệ thống để xem thêm chi tiết và đăng ký tham gia.</p>
                        <p>Đừng bỏ lỡ cơ hội đóng góp cho cộng đồng!</p>
                        <p>Trân trọng,<br>Đội ngũ IVAN Volunteer System</p>
                    </div>
                    <div class='footer'>
                        <p>© 2024 IVAN Volunteer System. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </body>
            </html>";
    }

    private string CreateEventReminderBody(string eventName, DateTime eventDate)
    {
        return $@"
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset='UTF-8'>
                <title>Nhắc nhở sự kiện</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #9C27B0; color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background-color: #f9f9f9; }}
                    .reminder-box {{ background-color: #f3e5f5; padding: 15px; border-left: 4px solid #9C27B0; margin: 20px 0; }}
                    .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>⏰ Nhắc nhở sự kiện</h1>
                    </div>
                    <div class='content'>
                        <p>Xin chào,</p>
                        <div class='reminder-box'>
                            <h2>{eventName}</h2>
                            <p><strong>Thời gian:</strong> {eventDate:dd/MM/yyyy HH:mm}</p>
                        </div>
                        <p>Đây là lời nhắc nhở về sự kiện tình nguyện mà bạn đã đăng ký tham gia.</p>
                        <p>Sự kiện sẽ diễn ra vào {eventDate:dd/MM/yyyy} lúc {eventDate:HH:mm}.</p>
                        <p>Vui lòng chuẩn bị và đến đúng giờ. Cảm ơn bạn đã tham gia!</p>
                        <p>Trân trọng,<br>Đội ngũ IVAN Volunteer System</p>
                    </div>
                    <div class='footer'>
                        <p>© 2024 IVAN Volunteer System. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </body>
            </html>";
    }

    private string CreateTemporaryPasswordEmailBody(string userName, string temporaryPassword)
    {
        return $@"
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset='UTF-8'>
                <title>Tài khoản Volunteer Coordinator</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #4CAF50; color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background-color: #f9f9f9; }}
                    .password-box {{ background-color: #e8f5e8; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0; text-align: center; }}
                    .warning-box {{ background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }}
                    .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>🎉 Chào mừng đến với IVAN Volunteer System</h1>
                    </div>
                    <div class='content'>
                        <p>Xin chào <strong>{userName}</strong>,</p>
                        <p>Tài khoản Volunteer Coordinator của bạn đã được tạo thành công trong hệ thống IVAN Volunteer System.</p>
                        <div class='password-box'>
                            <h3>Mật khẩu tạm thời của bạn:</h3>
                            <h2 style='color: #4CAF50; letter-spacing: 2px; font-family: monospace;'>{temporaryPassword}</h2>
                        </div>
                        <div class='warning-box'>
                            <h4>⚠️ Lưu ý quan trọng:</h4>
                            <ul style='text-align: left; margin: 10px 0;'>
                                <li>Đây là mật khẩu tạm thời, bạn <strong>BẮT BUỘC</strong> phải thay đổi khi đăng nhập lần đầu</li>
                                <li>Vui lòng bảo mật thông tin này và không chia sẻ với người khác</li>
                                <li>Mật khẩu tạm thời sẽ hết hạn sau 24 giờ nếu không được sử dụng</li>
                            </ul>
                        </div>
                        <p>Để đăng nhập vào hệ thống, vui lòng truy cập trang web và sử dụng email cùng mật khẩu tạm thời ở trên.</p>
                        <p>Sau khi đăng nhập thành công, hệ thống sẽ yêu cầu bạn tạo mật khẩu mới để bảo mật tài khoản.</p>
                        <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với quản trị viên của tổ chức.</p>
                        <p>Trân trọng,<br>Đội ngũ IVAN Volunteer System</p>
                    </div>
                    <div class='footer'>
                        <p>© 2024 IVAN Volunteer System. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </body>
            </html>";
    }

    #endregion
}
