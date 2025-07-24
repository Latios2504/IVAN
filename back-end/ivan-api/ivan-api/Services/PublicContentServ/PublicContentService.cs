using Microsoft.EntityFrameworkCore;
using ivan_api.DTOs;
using ivan_api.DTOs.Public;
using ivan_api.DTOs.Common;
using ivan_api.Models;

namespace ivan_api.Services.PublicContentServ
{
    /// <summary>
    /// Implementation of public content service for organizations, events, and partners
    /// Phase 2: Real database queries and mapping
    /// </summary>
    public class PublicContentService : IPublicContentService
    {
        private readonly VolunteerManagementSystemContext _context;

        public PublicContentService(VolunteerManagementSystemContext context)
        {
            _context = context;
        }

        #region Organizations

        public async Task<PagedResultDto<PublicOrganizationDTO>> GetPublicOrganizationsAsync(PublicOrganizationFiltersDTO filters)
        {
            var query = _context.Organizations
                .Include(o => o.Type)
                .Where(o => o.IsActive == true); // Only active organizations

            // Apply filters
            if (!string.IsNullOrWhiteSpace(filters.Search))
            {
                var searchTerm = filters.Search.ToLower();
                query = query.Where(o => 
                    o.OrganizationName.ToLower().Contains(searchTerm) ||
                    (o.ShortName != null && o.ShortName.ToLower().Contains(searchTerm)) ||
                    (o.Description != null && o.Description.ToLower().Contains(searchTerm)));
            }

            if (filters.TypeId.HasValue)
            {
                query = query.Where(o => o.TypeId == filters.TypeId.Value);
            }

            if (!string.IsNullOrWhiteSpace(filters.Province))
            {
                query = query.Where(o => o.Province == filters.Province);
            }

            if (filters.IsVerified.HasValue)
            {
                query = query.Where(o => o.IsVerified == filters.IsVerified.Value);
            }

            // Order by rating and verification status (verified first, then by rating)
            query = query.OrderByDescending(o => o.IsVerified)
                         .ThenByDescending(o => o.Rating)
                         .ThenByDescending(o => o.RatingCount);

            // Get total count
            var totalItems = await query.CountAsync();

            // Apply pagination
            var organizations = await query
                .Skip((filters.Page - 1) * filters.Size)
                .Take(filters.Size)
                .Select(o => new PublicOrganizationDTO
                {
                    OrganizationId = o.OrganizationId,
                    OrganizationName = o.OrganizationName,
                    ShortName = o.ShortName,
                    TypeName = o.Type.TypeName,
                    EstablishedYear = o.EstablishedYear,
                    Website = o.Website,
                    FacebookPage = o.FacebookPage,
                    LinkedInPage = o.LinkedInPage,
                    Description = o.Description,
                    Mission = o.Mission,
                    Vision = o.Vision,
                    Address = o.Address,
                    WardCommune = o.WardCommune,
                    District = o.District,
                    Province = o.Province,
                    LogoUrl = o.LogoUrl,
                    BannerUrl = o.BannerUrl,
                    IsVerified = o.IsVerified ?? false,
                    Rating = o.Rating ?? 0,
                    RatingCount = o.RatingCount ?? 0,
                    TotalEvents = o.TotalEvents ?? 0,
                    TotalVolunteers = o.TotalVolunteers ?? 0
                })
                .ToListAsync();

            var totalPages = (int)Math.Ceiling((double)totalItems / filters.Size);

            return new PagedResultDto<PublicOrganizationDTO>
            {
                Items = organizations,
                PageNumber = filters.Page,
                PageSize = filters.Size,
                TotalCount = totalItems
            };
        }

        public async Task<PublicOrganizationDTO?> GetPublicOrganizationAsync(int id)
        {
            var organization = await _context.Organizations
                .Include(o => o.Type)
                .Where(o => o.OrganizationId == id && o.IsActive == true)
                .Select(o => new PublicOrganizationDTO
                {
                    OrganizationId = o.OrganizationId,
                    OrganizationName = o.OrganizationName,
                    ShortName = o.ShortName,
                    TypeName = o.Type.TypeName,
                    EstablishedYear = o.EstablishedYear,
                    Website = o.Website,
                    FacebookPage = o.FacebookPage,
                    LinkedInPage = o.LinkedInPage,
                    Description = o.Description,
                    Mission = o.Mission,
                    Vision = o.Vision,
                    Address = o.Address,
                    WardCommune = o.WardCommune,
                    District = o.District,
                    Province = o.Province,
                    LogoUrl = o.LogoUrl,
                    BannerUrl = o.BannerUrl,
                    IsVerified = o.IsVerified ?? false,
                    Rating = o.Rating ?? 0,
                    RatingCount = o.RatingCount ?? 0,
                    TotalEvents = o.TotalEvents ?? 0,
                    TotalVolunteers = o.TotalVolunteers ?? 0
                })
                .FirstOrDefaultAsync();

            return organization;
        }

        #endregion

        #region Events

        public async Task<PagedResultDto<PublicEventDTO>> GetPublicEventsAsync(PublicEventFiltersDTO filters)
        {
            var query = _context.Events
                .Include(e => e.Organization)
                .Include(e => e.Category)
                .Include(e => e.Status)
                .Where(e => e.IsActive == true && 
                           e.Organization.IsActive == true && 
                           e.Status.StatusName != "Cancelled"); // Only active events from active organizations

            // Apply filters
            if (!string.IsNullOrWhiteSpace(filters.Search))
            {
                var searchTerm = filters.Search.ToLower();
                query = query.Where(e => 
                    e.EventName.ToLower().Contains(searchTerm) ||
                    (e.Description != null && e.Description.ToLower().Contains(searchTerm)) ||
                    (e.ShortDescription != null && e.ShortDescription.ToLower().Contains(searchTerm)) ||
                    e.Organization.OrganizationName.ToLower().Contains(searchTerm));
            }

            if (filters.CategoryId.HasValue)
            {
                query = query.Where(e => e.CategoryId == filters.CategoryId.Value);
            }

            if (filters.OrganizationId.HasValue)
            {
                query = query.Where(e => e.OrganizationId == filters.OrganizationId.Value);
            }

            if (!string.IsNullOrWhiteSpace(filters.Province))
            {
                query = query.Where(e => e.Province == filters.Province);
            }

            if (filters.StartDate.HasValue)
            {
                query = query.Where(e => e.StartDate >= filters.StartDate.Value);
            }

            if (filters.EndDate.HasValue)
            {
                query = query.Where(e => e.EndDate <= filters.EndDate.Value);
            }

            if (filters.IsFeatured.HasValue)
            {
                query = query.Where(e => e.IsFeatured == filters.IsFeatured.Value);
            }

            if (filters.IsUrgent.HasValue)
            {
                query = query.Where(e => e.IsUrgent == filters.IsUrgent.Value);
            }

            // Order by: Urgent first, then Featured, then by start date
            query = query.OrderByDescending(e => e.IsUrgent)
                         .ThenByDescending(e => e.IsFeatured)
                         .ThenBy(e => e.StartDate)
                         .ThenByDescending(e => e.Rating);

            // Get total count
            var totalItems = await query.CountAsync();

            // Apply pagination
            var events = await query
                .Skip((filters.Page - 1) * filters.Size)
                .Take(filters.Size)
                .Select(e => new PublicEventDTO
                {
                    EventId = e.EventId,
                    OrganizationId = e.OrganizationId,
                    OrganizationName = e.Organization.OrganizationName,
                    EventName = e.EventName,
                    CategoryName = e.Category.CategoryName,
                    StatusName = e.Status.StatusName,
                    Description = e.Description,
                    ShortDescription = e.ShortDescription,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    RegistrationStartDate = e.RegistrationStartDate,
                    RegistrationEndDate = e.RegistrationEndDate,
                    Location = e.Location,
                    DetailedAddress = e.DetailedAddress,
                    WardCommune = e.WardCommune,
                    District = e.District,
                    Province = e.Province,
                    MaxVolunteers = e.MaxVolunteers,
                    MinVolunteers = e.MinVolunteers ?? 0,
                    CurrentVolunteers = e.CurrentVolunteers ?? 0,
                    RequiredSkills = e.RequiredSkills,
                    AgeRequirement = e.AgeRequirement,
                    GenderRequirement = e.GenderRequirement,
                    Requirements = e.Requirements,
                    Benefits = e.Benefits,
                    BannerImageUrl = e.BannerImageUrl,
                    GalleryImages = e.GalleryImages,
                    IsFeatured = e.IsFeatured ?? false,
                    IsUrgent = e.IsUrgent ?? false,
                    ViewCount = e.ViewCount ?? 0,
                    RegistrationCount = e.RegistrationCount ?? 0,
                    Rating = e.Rating ?? 0,
                    RatingCount = e.RatingCount ?? 0,
                    EventType = e.EventType
                })
                .ToListAsync();

            var totalPages = (int)Math.Ceiling((double)totalItems / filters.Size);

            return new PagedResultDto<PublicEventDTO>
            {
                Items = events,
                PageNumber = filters.Page,
                PageSize = filters.Size,
                TotalCount = totalItems
            };
        }

        public async Task<PublicEventDTO?> GetPublicEventAsync(int id)
        {
            var eventItem = await _context.Events
                .Include(e => e.Organization)
                .Include(e => e.Category)
                .Include(e => e.Status)
                .Where(e => e.EventId == id && 
                           e.IsActive == true && 
                           e.Organization.IsActive == true && 
                           e.Status.StatusName != "Cancelled")
                .Select(e => new PublicEventDTO
                {
                    EventId = e.EventId,
                    OrganizationId = e.OrganizationId,
                    OrganizationName = e.Organization.OrganizationName,
                    EventName = e.EventName,
                    CategoryName = e.Category.CategoryName,
                    StatusName = e.Status.StatusName,
                    Description = e.Description,
                    ShortDescription = e.ShortDescription,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    RegistrationStartDate = e.RegistrationStartDate,
                    RegistrationEndDate = e.RegistrationEndDate,
                    Location = e.Location,
                    DetailedAddress = e.DetailedAddress,
                    WardCommune = e.WardCommune,
                    District = e.District,
                    Province = e.Province,
                    MaxVolunteers = e.MaxVolunteers,
                    MinVolunteers = e.MinVolunteers ?? 0,
                    CurrentVolunteers = e.CurrentVolunteers ?? 0,
                    RequiredSkills = e.RequiredSkills,
                    AgeRequirement = e.AgeRequirement,
                    GenderRequirement = e.GenderRequirement,
                    Requirements = e.Requirements,
                    Benefits = e.Benefits,
                    BannerImageUrl = e.BannerImageUrl,
                    GalleryImages = e.GalleryImages,
                    IsFeatured = e.IsFeatured ?? false,
                    IsUrgent = e.IsUrgent ?? false,
                    ViewCount = e.ViewCount ?? 0,
                    RegistrationCount = e.RegistrationCount ?? 0,
                    Rating = e.Rating ?? 0,
                    RatingCount = e.RatingCount ?? 0,
                    EventType = e.EventType
                })
                .FirstOrDefaultAsync();

            return eventItem;
        }

        #endregion

        #region Partners

        public async Task<PagedResultDto<PublicPartnerDTO>> GetPublicPartnersAsync(PublicPartnerFiltersDTO filters)
        {
            var query = _context.Partners
                .Include(p => p.Industry)
                .Where(p => p.IsActive == true); // Only active partners

            // Apply filters
            if (!string.IsNullOrWhiteSpace(filters.Search))
            {
                var searchTerm = filters.Search.ToLower();
                query = query.Where(p => 
                    p.CompanyName.ToLower().Contains(searchTerm) ||
                    (p.Description != null && p.Description.ToLower().Contains(searchTerm)));
            }

            if (filters.IndustryId.HasValue)
            {
                query = query.Where(p => p.IndustryId == filters.IndustryId.Value);
            }

            if (!string.IsNullOrWhiteSpace(filters.Province))
            {
                query = query.Where(p => p.Province == filters.Province);
            }

            if (filters.IsVerified.HasValue)
            {
                query = query.Where(p => p.IsVerified == filters.IsVerified.Value);
            }

            // Order by verification status (verified first), then by rating and collaboration count
            query = query.OrderByDescending(p => p.IsVerified)
                         .ThenByDescending(p => p.Rating)
                         .ThenByDescending(p => p.TotalCollaborations);

            // Get total count
            var totalItems = await query.CountAsync();

            // Apply pagination
            var partners = await query
                .Skip((filters.Page - 1) * filters.Size)
                .Take(filters.Size)
                .Select(p => new PublicPartnerDTO
                {
                    PartnerId = p.PartnerId,
                    CompanyName = p.CompanyName,
                    IndustryName = p.Industry.IndustryName,
                    Website = p.Website,
                    Description = p.Description,
                    Address = p.Address,
                    WardCommune = p.WardCommune,
                    District = p.District,
                    Province = p.Province,
                    LogoUrl = p.LogoUrl,
                    IsVerified = p.IsVerified ?? false,
                    Rating = p.Rating ?? 0,
                    RatingCount = p.RatingCount ?? 0,
                    TotalCollaborations = p.TotalCollaborations ?? 0
                })
                .ToListAsync();

            var totalPages = (int)Math.Ceiling((double)totalItems / filters.Size);

            return new PagedResultDto<PublicPartnerDTO>
            {
                Items = partners,
                PageNumber = filters.Page,
                PageSize = filters.Size,
                TotalCount = totalItems
            };
        }

        public async Task<PublicPartnerDTO?> GetPublicPartnerAsync(int id)
        {
            var partner = await _context.Partners
                .Include(p => p.Industry)
                .Where(p => p.PartnerId == id && p.IsActive == true)
                .Select(p => new PublicPartnerDTO
                {
                    PartnerId = p.PartnerId,
                    CompanyName = p.CompanyName,
                    IndustryName = p.Industry.IndustryName,
                    Website = p.Website,
                    Description = p.Description,
                    Address = p.Address,
                    WardCommune = p.WardCommune,
                    District = p.District,
                    Province = p.Province,
                    LogoUrl = p.LogoUrl,
                    IsVerified = p.IsVerified ?? false,
                    Rating = p.Rating ?? 0,
                    RatingCount = p.RatingCount ?? 0,
                    TotalCollaborations = p.TotalCollaborations ?? 0
                })
                .FirstOrDefaultAsync();

            return partner;
        }

        #endregion

        #region Volunteers

        public async Task<PagedResultDto<PublicVolunteerDTO>> GetPublicVolunteersAsync(PublicVolunteerFiltersDTO filters)
        {
            var query = _context.VolunteerProfiles
                .Include(v => v.User)
                    .ThenInclude(u => u.UserProfiles)
                .Include(v => v.VolunteerSkills)
                    .ThenInclude(vs => vs.Skill)
                .Where(v => v.User.IsActive == true); // Only active users

            // Apply filters
            if (!string.IsNullOrWhiteSpace(filters.Search))
            {
                var searchTerm = filters.Search.ToLower();
                query = query.Where(v => 
                    v.User.UserProfiles.Any(up => up.FullName.ToLower().Contains(searchTerm)) ||
                    (v.Motivation != null && v.Motivation.ToLower().Contains(searchTerm)) ||
                    (v.University != null && v.University.ToLower().Contains(searchTerm)) ||
                    (v.Major != null && v.Major.ToLower().Contains(searchTerm)));
            }

            if (filters.SkillId.HasValue)
            {
                query = query.Where(v => v.VolunteerSkills.Any(vs => vs.SkillId == filters.SkillId.Value));
            }

            if (!string.IsNullOrWhiteSpace(filters.University))
            {
                query = query.Where(v => v.University == filters.University);
            }

            if (!string.IsNullOrWhiteSpace(filters.Province))
            {
                query = query.Where(v => v.User.UserProfiles.Any(up => up.Province == filters.Province));
            }

            if (filters.IsVerified.HasValue)
            {
                query = query.Where(v => v.IsVerified == filters.IsVerified.Value);
            }

            // Order by verification status (verified first), then by rating and volunteer hours
            query = query.OrderByDescending(v => v.IsVerified)
                         .ThenByDescending(v => v.Rating)
                         .ThenByDescending(v => v.VolunteerHours);

            // Get total count
            var totalItems = await query.CountAsync();

            // Apply pagination
            var volunteers = await query
                .Skip((filters.Page - 1) * filters.Size)
                .Take(filters.Size)
                .Select(v => new PublicVolunteerDTO
                {
                    VolunteerId = v.VolunteerId,
                    FullName = v.User.UserProfiles.FirstOrDefault() != null ? v.User.UserProfiles.FirstOrDefault()!.FullName : "",
                    ProfilePicture = v.User.UserProfiles.FirstOrDefault() != null ? v.User.UserProfiles.FirstOrDefault()!.Avatar : "",
                    University = v.University,
                    Major = v.Major,
                    Bio = v.Motivation,
                    Province = v.User.UserProfiles.FirstOrDefault() != null ? v.User.UserProfiles.FirstOrDefault()!.Province : null,
                    IsVerified = v.IsVerified ?? false,
                    Rating = v.Rating ?? 0,
                    ReviewCount = v.RatingCount ?? 0,
                    VolunteerHours = v.VolunteerHours ?? 0,
                    Skills = v.VolunteerSkills.Select(vs => new PublicVolunteerSkillDTO
                    {
                        Id = vs.SkillId,
                        Name = vs.Skill.SkillName,
                        ProficiencyLevel = vs.ProficiencyLevel
                    }).ToList()
                })
                .ToListAsync();

            var totalPages = (int)Math.Ceiling((double)totalItems / filters.Size);

            return new PagedResultDto<PublicVolunteerDTO>
            {
                Items = volunteers,
                PageNumber = filters.Page,
                PageSize = filters.Size,
                TotalCount = totalItems
            };
        }

        public async Task<PublicVolunteerDTO?> GetPublicVolunteerAsync(int id)
        {
            var volunteer = await _context.VolunteerProfiles
                .Include(v => v.User)
                    .ThenInclude(u => u.UserProfiles)
                .Include(v => v.VolunteerSkills)
                    .ThenInclude(vs => vs.Skill)
                .Where(v => v.VolunteerId == id && v.User.IsActive == true)
                .Select(v => new PublicVolunteerDTO
                {
                    VolunteerId = v.VolunteerId,
                    FullName = v.User.UserProfiles.FirstOrDefault() != null ? v.User.UserProfiles.FirstOrDefault()!.FullName : "",
                    ProfilePicture = v.User.UserProfiles.FirstOrDefault() != null ? v.User.UserProfiles.FirstOrDefault()!.Avatar : "",
                    University = v.University,
                    Major = v.Major,
                    Bio = v.Motivation,
                    Experience = v.Experience,
                    Province = v.User.UserProfiles.FirstOrDefault() != null ? v.User.UserProfiles.FirstOrDefault()!.Province : null,
                    IsVerified = v.IsVerified ?? false,
                    Rating = v.Rating ?? 0,
                    ReviewCount = v.RatingCount ?? 0,
                    VolunteerHours = v.VolunteerHours ?? 0,
                    Skills = v.VolunteerSkills.Select(vs => new PublicVolunteerSkillDTO
                    {
                        Id = vs.SkillId,
                        Name = vs.Skill.SkillName,
                        ProficiencyLevel = vs.ProficiencyLevel
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            return volunteer;
        }

        #endregion
    }
}
