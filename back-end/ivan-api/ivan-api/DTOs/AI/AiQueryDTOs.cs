using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace ivan_api.DTOs.AI;

/// <summary>
/// DTO for AI query request
/// </summary>
public class AiQueryRequest
{
    [Required(ErrorMessage = "Query is required")]
    public string Query { get; set; } = string.Empty;
    
    public int? CustomInstructionId { get; set; }
    
    public string? PreferredModel { get; set; }
    
    public bool IncludeContext { get; set; } = true;

    // Optional client-provided memory (no database storage)
    public string? ConversationId { get; set; }

    public List<ChatMessageDto>? ClientMessages { get; set; }

    public string? ClientSummary { get; set; }
}

/// <summary>
/// User context information for AI queries
/// Contains user identity and role-specific IDs for data access control
/// </summary>
public class UserContextInfo
{
    public int UserId { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public int RoleId { get; set; }
    
    // Role-specific IDs (only one will be populated based on role)
    public int? OrganizationId { get; set; }
    public int? PartnerId { get; set; }
    public int? VolunteerId { get; set; }
    public int? CoordinatorId { get; set; }
    
    // Helper methods to determine role
    public bool IsAdmin => RoleName.Equals("Admin", StringComparison.OrdinalIgnoreCase);
    public bool IsOrganization => RoleName.Equals("Organization", StringComparison.OrdinalIgnoreCase);
    public bool IsPartner => RoleName.Equals("Partner", StringComparison.OrdinalIgnoreCase);
    public bool IsVolunteer => RoleName.Equals("Volunteer", StringComparison.OrdinalIgnoreCase);
    public bool IsCoordinator => RoleName.Equals("Coordinator", StringComparison.OrdinalIgnoreCase) || 
                                RoleName.Equals("Volunteer Coordinator", StringComparison.OrdinalIgnoreCase);
    
    /// <summary>
    /// Get the specific profile ID based on role
    /// </summary>
    public int? GetProfileId()
    {
        return IsOrganization ? OrganizationId :
               IsPartner ? PartnerId :
               IsVolunteer ? VolunteerId :
               IsCoordinator ? CoordinatorId :
               null; // Admin doesn't have a profile ID
    }
    
    /// <summary>
    /// Get a human-readable description of the user context
    /// </summary>
    public string GetContextDescription()
    {
        if (IsAdmin)
            return $"Admin User (UserId: {UserId}) - Full Access";
        
        var profileId = GetProfileId();
        var profileType = IsOrganization ? "Organization" :
                         IsPartner ? "Partner" :
                         IsVolunteer ? "Volunteer" :
                         IsCoordinator ? "Coordinator" : "Unknown";
        
        return $"{profileType} User (UserId: {UserId}, {profileType}Id: {profileId})";
    }
}

/// <summary>
/// Minimal chat message payload provided by the client to enable stateless memory
/// </summary>
public class ChatMessageDto
{
    public string Role { get; set; } = "user"; // "user" | "assistant"
    public string Content { get; set; } = string.Empty;
    public string? Timestamp { get; set; }
}