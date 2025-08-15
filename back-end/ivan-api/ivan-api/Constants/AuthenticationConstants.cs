namespace ivan_api.Constants;

public static class AuthenticationConstants
{
    // User Roles (matching database)
    public static class Roles
    {
        public const string Volunteer = "Volunteer";
        public const string Organization = "Organization";
        public const string Partner = "Partner";
        public const string VolunteerCoordinator = "Coordinator";
        public const string Admin = "Admin";
    }

    // Role IDs (matching database)
    public static class RoleIds
    {
        public const int Volunteer = 1;
        public const int Organization = 2;
        public const int Partner = 3;
        public const int VolunteerCoordinator = 4;
        public const int Admin = 5;
    }

    // Authentication Messages
    public static class Messages
    {
        public const string LoginSuccess = "Login successful";
        public const string LoginFailed = "Invalid email or password";
        public const string RegisterSuccess = "Registration successful. Please check your email for verification.";
        public const string UserAlreadyExists = "User already exists";
        public const string AccountDeactivated = "Account is deactivated";
        public const string PasswordResetSent = "If the email exists, a password reset code has been sent.";
        public const string PasswordResetSuccess = "Password reset successfully";
        public const string PasswordChangeSuccess = "Password changed successfully";
        public const string InvalidResetCode = "Invalid or expired reset code";
        public const string InvalidCurrentPassword = "Current password is incorrect";
        public const string LogoutSuccess = "Logout successful";
        public const string CoordinatorRegistrationNotAllowed = "Volunteer Coordinator accounts must be created by an Organization";
    }

    // Token Settings
    public static class TokenSettings
    {
        public const int DefaultExpiryMinutes = 60;
        public const int PasswordResetExpiryHours = 1;
    }
}
