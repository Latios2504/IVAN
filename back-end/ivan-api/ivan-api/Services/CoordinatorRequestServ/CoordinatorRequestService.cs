using ivan_api.Configuration;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.CoordinatorRequests;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ivan_api.Services.CoordinatorRequestServ
{
    public class CoordinatorRequestService : ICoordinatorRequestService
    {
        private readonly VolunteerManagementSystemContext _db;
        private const string CategoryName_Account = "CreateCoordinator"; // seed có sẵn

        public CoordinatorRequestService(VolunteerManagementSystemContext db)
        {
            _db = db;
        }

        public async Task<ApiResponseDTO<object>> CreateAsync(
            int organizationId,
            int requesterUserId,
            CreateCoordinatorRequestDto dto)
        {
            // 1) Validate Organization owner
            var org = await _db.Organizations.AsNoTracking()
                .FirstOrDefaultAsync(o => o.OrganizationId == organizationId);
            if (org == null)
                return ApiResponseDTO<object>.Fail("ORGANIZATION_NOT_FOUND");

            if (org.UserId != requesterUserId)
                return ApiResponseDTO<object>.Forbidden("NOT_OWNER_OF_ORGANIZATION");

            // 2) Resolve Support Category
            var category = await _db.SupportCategories
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.CategoryName == CategoryName_Account);
            if (category == null)
                return ApiResponseDTO<object>.Fail("SUPPORT_CATEGORY_NOT_FOUND");

            // 3) Idempotency: block duplicate open request by email in same org (optional)
            var duplicateOpen = await _db.SupportRequests
                .Where(sr => sr.CategoryId == category.CategoryId
                             && sr.Status == "Open"
                             && sr.UserId == requesterUserId
                             && sr.Description.Contains(dto.CandidateEmail))
                .AnyAsync();
            if (duplicateOpen)
                return ApiResponseDTO<object>.Conflict("DUPLICATE_OPEN_REQUEST_FOR_EMAIL");

            // 4) Compose subject + metadata (JSON) vào Description
            var subject = $"[ORG #{organizationId}] Yêu cầu tạo Coordinator cho {dto.CandidateEmail}";
            var metadata = new
            {
                type = "CreateCoordinatorRequest",
                organizationId,
                dto.CandidateEmail,
                dto.FullName,
                dto.Position,
                dto.Department,
                dto.Responsibilities,
                HireDate = dto.HireDate.ToString("yyyy-MM-dd"),
                dto.ManagerUserId
            };
            var description =
                "Yêu cầu tạo tài khoản Coordinator.\n\n" +
                "Metadata:\n" + JsonSerializer.Serialize(metadata, new JsonSerializerOptions { WriteIndented = true });

            // 5) Generate requestId: REQ-YYYYMMDD-#### (sequence per day)
            var todayUtc = DateTime.UtcNow.Date;
            var todayCount = await _db.SupportRequests
                .CountAsync(sr => sr.CreatedAt != null
                                  && sr.CreatedAt.Value.Date == todayUtc);
            var sequence = todayCount + 1;
            var requestIdExternal = $"REQ-{todayUtc:yyyyMMdd}-{sequence:0000}";

            // 6) Create SupportRequest
            var now = DateTime.UtcNow;
            var sr = new SupportRequest
            {
                UserId = requesterUserId,
                CategoryId = category.CategoryId,
                Subject = subject,
                Description = description,
                Priority = "High",
                Status = "Open",               // map với API status "PENDING"
                AssignedTo = null,
                CreatedAt = now,
                UpdatedAt = now
            };

            _db.SupportRequests.Add(sr);
            await _db.SaveChangesAsync();

            // 7) Response shape
            var response = new
            {
                requestId = requestIdExternal,
                status = "PENDING",
                organizationId,
                submittedAt = now.ToString("yyyy-MM-ddTHH:mm:ssZ")
            };

            return ApiResponseDTO<object>.Ok(response, "Coordinator request submitted");
        }

        public async Task<ApiResponseDTO<List<CoordinatorRequestListItemDto>>> ListAsync(string? statusFilter = null)
        {
            var category = await _db.SupportCategories
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.CategoryName == CategoryName_Account);
            if (category == null)
                return ApiResponseDTO<List<CoordinatorRequestListItemDto>>.Fail("SUPPORT_CATEGORY_NOT_FOUND");

            var query = _db.SupportRequests
                .AsNoTracking()
                .Where(sr => sr.CategoryId == category.CategoryId);

            if (!string.IsNullOrEmpty(statusFilter))
                query = query.Where(sr => sr.Status == statusFilter);

            // B1: lấy thô từ DB
            var rawRequests = await query
                .OrderByDescending(sr => sr.CreatedAt)
                .ToListAsync();

            // B2: map bằng C# sau khi đã ToList
            var requests = rawRequests.Select(sr => new CoordinatorRequestListItemDto
            {
                RequestId = sr.RequestId.ToString(),
                OrganizationId = ExtractOrganizationId(sr.Description),
                CandidateEmail = ExtractCandidateEmail(sr.Description),
                Status = MapStatus(sr.Status),
                SubmittedAt = sr.CreatedAt ?? DateTime.UtcNow
            }).ToList();

            return ApiResponseDTO<List<CoordinatorRequestListItemDto>>.Ok(requests);
        }

        // Helpers
        private int ExtractOrganizationId(string description)
        {
            try
            {
                var jsonStart = description.IndexOf('{');
                if (jsonStart >= 0)
                {
                    var json = description.Substring(jsonStart);
                    using var doc = JsonDocument.Parse(json);
                    if (doc.RootElement.TryGetProperty("organizationId", out var orgId))
                        return orgId.GetInt32();
                }
            }
            catch { }
            return 0;
        }
        private string ExtractCandidateEmail(string description)
        {
            try
            {
                var jsonStart = description.IndexOf('{');
                if (jsonStart >= 0)
                {
                    var json = description.Substring(jsonStart);
                    using var doc = JsonDocument.Parse(json);
                    if (doc.RootElement.TryGetProperty("CandidateEmail", out var email))
                        return email.GetString() ?? "";
                }
            }
            catch { }
            return "";
        }
        private string MapStatus(string statusDb)
        {
            return statusDb switch
            {
                "Open" => "PENDING",
                "In Progress" => "IN_PROGRESS",
                "Resolved" => "RESOLVED",
                _ => statusDb
            };
        }

        public async Task<ApiResponseDTO<object>> UpdateAsync(int requestId, int adminUserId, UpdateCoordinatorRequestDto dto)
        {
            var sr = await _db.SupportRequests.FirstOrDefaultAsync(x => x.RequestId == requestId);
            if (sr == null)
                return ApiResponseDTO<object>.Fail("REQUEST_NOT_FOUND");

            if (sr.Status == "Resolved")
                return ApiResponseDTO<object>.Conflict("REQUEST_ALREADY_RESOLVED");

            if (dto.Action.Equals("REJECT", StringComparison.OrdinalIgnoreCase))
            {
                sr.Status = "Resolved";
                sr.Resolution = dto.Note;
                sr.ResolvedBy = adminUserId;
                sr.ResolvedDate = DateTime.UtcNow;

                await _db.SaveChangesAsync();
                return ApiResponseDTO<object>.Ok(new { requestId }, "Request rejected");
            }

            if (dto.Action.Equals("APPROVE", StringComparison.OrdinalIgnoreCase))
            {
                // Parse metadata
                var jsonStart = sr.Description.IndexOf('{');
                if (jsonStart < 0)
                    return ApiResponseDTO<object>.Fail("INVALID_METADATA");
                var json = sr.Description.Substring(jsonStart);
                using var doc = JsonDocument.Parse(json);

                // Safely extract properties with null checks
                if (!doc.RootElement.TryGetProperty("organizationId", out var orgIdElement) || orgIdElement.ValueKind == JsonValueKind.Null)
                    return ApiResponseDTO<object>.Fail("INVALID_METADATA: organizationId is missing or null");
                var orgId = orgIdElement.GetInt32();
                
                if (!doc.RootElement.TryGetProperty("CandidateEmail", out var emailElement) || emailElement.ValueKind == JsonValueKind.Null)
                    return ApiResponseDTO<object>.Fail("INVALID_METADATA: CandidateEmail is missing or null");
                var email = emailElement.GetString()!;
                
                if (!doc.RootElement.TryGetProperty("FullName", out var fullNameElement) || fullNameElement.ValueKind == JsonValueKind.Null)
                    return ApiResponseDTO<object>.Fail("INVALID_METADATA: FullName is missing or null");
                var fullName = fullNameElement.GetString()!;
                
                if (!doc.RootElement.TryGetProperty("Position", out var positionElement) || positionElement.ValueKind == JsonValueKind.Null)
                    return ApiResponseDTO<object>.Fail("INVALID_METADATA: Position is missing or null");
                var position = positionElement.GetString()!;
                
                if (!doc.RootElement.TryGetProperty("Department", out var departmentElement) || departmentElement.ValueKind == JsonValueKind.Null)
                    return ApiResponseDTO<object>.Fail("INVALID_METADATA: Department is missing or null");
                var department = departmentElement.GetString()!;
                
                if (!doc.RootElement.TryGetProperty("Responsibilities", out var responsibilitiesElement) || responsibilitiesElement.ValueKind == JsonValueKind.Null)
                    return ApiResponseDTO<object>.Fail("INVALID_METADATA: Responsibilities is missing or null");
                var responsibilities = responsibilitiesElement.GetString()!;
                
                if (!doc.RootElement.TryGetProperty("HireDate", out var hireDateElement) || hireDateElement.ValueKind == JsonValueKind.Null)
                    return ApiResponseDTO<object>.Fail("INVALID_METADATA: HireDate is missing or null");
                var hireDate = DateOnly.Parse(hireDateElement.GetString()!);
                
                var managerUserId = doc.RootElement.TryGetProperty("ManagerUserId", out var mgr) && mgr.ValueKind != JsonValueKind.Null ? mgr.GetInt32() : (int?)null;

                // 1) Lấy roleId cho Coordinator
                var roleId = await _db.UserRoles.Where(r => r.RoleName == "Coordinator")
                                .Select(r => r.RoleId)
                                .FirstOrDefaultAsync();
                if (roleId == 0) return ApiResponseDTO<object>.Fail("ROLE_COORDINATOR_NOT_FOUND");

                var tempPassword = "123456";
                var salt =  PasswordHashGenerate.GenerateSaltBase64();
                var passwordHash = PasswordHashGenerate.HashPasswordWithSalt(tempPassword, salt);

                var normalizedEmail = (email ?? string.Empty).Trim().ToLowerInvariant();


                var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == normalizedEmail);
                if (user == null)
                {
                    // 2) Tạo user
                    user = new User
                    {
                        Email = email,
                        RoleId = roleId,
                        IsActive = true,
                        IsEmailVerified = false,
                        CreatedAt = DateTime.UtcNow,

                        // BẮT BUỘC set để tránh NULL
                        PasswordHash = passwordHash,
                        Salt = salt,
                    };
                    _db.Users.Add(user);
                    await _db.SaveChangesAsync();
                }

                // 3) Tạo VolunteerCoordinator
                var vc = await _db.VolunteerCoordinators.FirstOrDefaultAsync(x => x.UserId == user.UserId && x.OrganizationId == orgId);
                if (vc == null)
                {
                    vc = new VolunteerCoordinator
                    {
                        UserId = user.UserId,
                        OrganizationId = orgId,
                        EmployeeId = $"E{DateTime.UtcNow:yyyyMMdd}-{user.UserId}", // gen mã đơn giản
                        Position = position,
                        Department = department,
                        Responsibilities = responsibilities,
                        HireDate = hireDate,
                        ManagerId = managerUserId,
                        CreatedBy = adminUserId,
                        RequestedBy = orgId,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    };
                    _db.VolunteerCoordinators.Add(vc);
                }
                
                

                // 3) ĐẢM BẢO tạo UserProfile cho tài khoản Coordinator vừa tạo
                if (!await _db.UserProfiles.AnyAsync(p => p.UserId == user.UserId))
                {
                    // Tách họ tên (nếu có). fullName đã được parse ở trên từ metadata.
                    string firstName = string.Empty;
                    string lastName  = string.Empty;
                    if (!string.IsNullOrWhiteSpace(fullName))
                    {
                        var parts = fullName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                        if (parts.Length > 1)
                        {
                            lastName  = parts[^1];
                            firstName = string.Join(" ", parts[..^1]);
                        }
                        else
                        {
                            firstName = fullName.Trim();
                        }
                    }

                    _db.UserProfiles.Add(new UserProfile
                    {
                        UserId    = user.UserId,
                        FirstName = firstName,          // DB cho phép null, nhưng dùng "" an toàn hơn
                        LastName  = lastName,
                        CreatedAt = DateTime.UtcNow     // cột này đã có default (getdate()), set tay cũng ok
                    });
                    await _db.SaveChangesAsync();
                }

                // 4) Update SupportRequest
                sr.Status = "Resolved";
                sr.ResolvedBy = adminUserId;
                sr.ResolvedDate = DateTime.UtcNow;
                sr.Resolution = "APPROVED";

                await _db.SaveChangesAsync();

                return ApiResponseDTO<object>.Ok(new
                {
                    requestId,
                    coordinatorUserId = user.UserId,
                    volunteerCoordinatorId = vc.CoordinatorId
                }, "Coordinator account created");
            }

            return ApiResponseDTO<object>.Fail("INVALID_ACTION");
        }
    }
}
