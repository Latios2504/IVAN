using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs;
using ivan_api.DTOs.Common;
using ivan_api.Models;

namespace ivan_api.Controllers.Public
{
    /// <summary>
    /// Public API for reference data - accessible without authentication
    /// Returns skills, industries, organization types, etc.
    /// </summary>
    [ApiController]
    [Route("api/public")]
    public class PublicDataController : ControllerBase
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly ILogger<PublicDataController> _logger;

        public PublicDataController(
            VolunteerManagementSystemContext context,
            ILogger<PublicDataController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all available skills for volunteers
        /// </summary>
        /// <returns>List of skills</returns>
        [HttpGet("skills")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<List<SkillDto>>>> GetSkills()
        {
            try
            {
                var skills = await Task.FromResult(_context.Skills
                    .Where(s => s.IsActive == true)
                    .Select(s => new SkillDto
                    {
                        SkillId = s.SkillId,
                        SkillName = s.SkillName,
                        Category = s.Category,
                        Description = s.Description,
                        IsActive = s.IsActive ?? false
                    })
                    .OrderBy(s => s.SkillName)
                    .ToList());

                return Ok(new ApiResponseDTO<List<SkillDto>>
                {
                    Success = true,
                    Data = skills,
                    Message = "Skills retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving skills");
                return StatusCode(500, new ApiResponseDTO<List<SkillDto>>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve skills" }
                });
            }
        }

        /// <summary>
        /// Get all partner industries
        /// </summary>
        /// <returns>List of partner industries</returns>
        [HttpGet("partner-industries")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<List<PartnerIndustryDto>>>> GetPartnerIndustries()
        {
            try
            {
                var industries = await Task.FromResult(_context.PartnerIndustries
                    .Where(pi => pi.IsActive == true)
                    .Select(pi => new PartnerIndustryDto
                    {
                        IndustryId = pi.IndustryId,
                        IndustryName = pi.IndustryName,
                        Description = pi.Description,
                        IsActive = pi.IsActive ?? false
                    })
                    .OrderBy(pi => pi.IndustryName)
                    .ToList());

                return Ok(new ApiResponseDTO<List<PartnerIndustryDto>>
                {
                    Success = true,
                    Data = industries,
                    Message = "Partner industries retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving partner industries");
                return StatusCode(500, new ApiResponseDTO<List<PartnerIndustryDto>>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve partner industries" }
                });
            }
        }

        /// <summary>
        /// Get all organization types
        /// </summary>
        /// <returns>List of organization types</returns>
        [HttpGet("organization-types")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<List<OrganizationTypeDto>>>> GetOrganizationTypes()
        {
            try
            {
                var organizationTypes = await Task.FromResult(_context.OrganizationTypes
                    .Where(ot => ot.IsActive == true)
                    .Select(ot => new OrganizationTypeDto
                    {
                        TypeId = ot.TypeId,
                        TypeName = ot.TypeName,
                        Description = ot.Description,
                        IsActive = ot.IsActive ?? false
                    })
                    .OrderBy(ot => ot.TypeName)
                    .ToList());

                return Ok(new ApiResponseDTO<List<OrganizationTypeDto>>
                {
                    Success = true,
                    Data = organizationTypes,
                    Message = "Organization types retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving organization types");
                return StatusCode(500, new ApiResponseDTO<List<OrganizationTypeDto>>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve organization types" }
                });
            }
        }
    }

    // DTOs for the public data endpoints
    public class SkillDto
    {
        public int SkillId { get; set; }
        public string SkillName { get; set; } = null!;
        public string? Category { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }

    public class PartnerIndustryDto
    {
        public int IndustryId { get; set; }
        public string IndustryName { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }

    public class OrganizationTypeDto
    {
        public int TypeId { get; set; }
        public string TypeName { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }
}
