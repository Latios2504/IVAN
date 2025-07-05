using ivan_api.DTOs.AIDatabaseManage;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services.AIRecommendationServ.Helpers;

public class SkillGapAnalysisHelper
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly ILogger _logger;

    public SkillGapAnalysisHelper(VolunteerManagementSystemContext context, ILogger logger)
    {
        _context = context;
        _logger = logger;
    }

    public SkillGapAnalysisDTO AnalyzeSkillGapForEventType(string eventType, List<Event> events, string? organizationId)
    {
        var requiredSkillsAll = new List<string>();
        var availableSkillsAll = new List<string>();
        var skillDemand = new Dictionary<string, int>();
        var skillSupply = new Dictionary<string, int>();

        // Collect all required skills from events
        foreach (var eventItem in events)
        {
            if (!string.IsNullOrEmpty(eventItem.RequiredSkills))
            {
                var skills = eventItem.RequiredSkills.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(s => s.Trim()).ToList();
                
                requiredSkillsAll.AddRange(skills);
                
                // Count demand for each skill
                foreach (var skill in skills)
                {
                    skillDemand[skill] = skillDemand.GetValueOrDefault(skill, 0) + 1;
                }
            }

            // Collect skills from registered volunteers
            foreach (var registration in eventItem.EventRegistrations)
            {
                if (!string.IsNullOrEmpty(registration.Volunteer?.Skills))
                {
                    var volunteerSkills = registration.Volunteer.Skills.Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(s => s.Trim()).ToList();
                    
                    availableSkillsAll.AddRange(volunteerSkills);
                    
                    // Count supply for each skill
                    foreach (var skill in volunteerSkills)
                    {
                        skillSupply[skill] = skillSupply.GetValueOrDefault(skill, 0) + 1;
                    }
                }
            }
        }

        var uniqueRequiredSkills = requiredSkillsAll.Distinct().ToList();
        var uniqueAvailableSkills = availableSkillsAll.Distinct().ToList();

        // Find missing and surplus skills
        var missingSkills = uniqueRequiredSkills
            .Where(required => !uniqueAvailableSkills.Any(available => 
                available.Contains(required, StringComparison.OrdinalIgnoreCase)))
            .ToList();

        var surplusSkills = uniqueAvailableSkills
            .Where(available => !uniqueRequiredSkills.Any(required => 
                available.Contains(required, StringComparison.OrdinalIgnoreCase)))
            .ToList();

        return new SkillGapAnalysisDTO
        {
            AnalysisId = Guid.NewGuid().ToString(),
            OrganizationId = organizationId ?? "ALL",
            RequiredSkills = uniqueRequiredSkills,
            AvailableSkills = uniqueAvailableSkills,
            MissingSkills = missingSkills,
            SurplusSkills = surplusSkills,
            SkillDemand = skillDemand,
            SkillSupply = skillSupply,
            TrainingRecommendations = GenerateTrainingRecommendations(missingSkills, skillDemand),
            RecruitmentRecommendations = GenerateRecruitmentRecommendations(missingSkills, skillDemand),
            AnalysisDate = DateTime.UtcNow
        };
    }

    public async Task<SkillGapAnalysisDTO> GenerateOverallSkillGapAnalysis(List<Event> allEvents, string? organizationId)
    {
        // Calculate overall statistics
        var totalRequiredPositions = allEvents.Sum(e => e.MaxParticipants ?? 0);
        var totalRegistrations = allEvents.Sum(e => e.EventRegistrations.Count);
        var fillRate = totalRequiredPositions > 0 ? (double)totalRegistrations / totalRequiredPositions : 0;

        var overallSkillDemand = new Dictionary<string, int>();
        var overallSkillSupply = new Dictionary<string, int>();

        // Aggregate all skills data
        foreach (var eventItem in allEvents)
        {
            if (!string.IsNullOrEmpty(eventItem.RequiredSkills))
            {
                var skills = eventItem.RequiredSkills.Split(',', StringSplitOptions.RemoveEmptyEntries);
                foreach (var skill in skills)
                {
                    var trimmedSkill = skill.Trim();
                    overallSkillDemand[trimmedSkill] = overallSkillDemand.GetValueOrDefault(trimmedSkill, 0) + (eventItem.MaxParticipants ?? 1);
                }
            }
        }

        // Get all active volunteers in the organization
        var volunteers = await _context.VolunteerProfiles
            .Include(v => v.EventRegistrations)
            .Where(v => v.IsVerified == true)
            .ToListAsync();

        foreach (var volunteer in volunteers)
        {
            if (!string.IsNullOrEmpty(volunteer.Skills))
            {
                var skills = volunteer.Skills.Split(',', StringSplitOptions.RemoveEmptyEntries);
                foreach (var skill in skills)
                {
                    var trimmedSkill = skill.Trim();
                    overallSkillSupply[trimmedSkill] = overallSkillSupply.GetValueOrDefault(trimmedSkill, 0) + 1;
                }
            }
        }

        var criticalMissingSkills = overallSkillDemand
            .Where(demand => !overallSkillSupply.ContainsKey(demand.Key) || 
                           overallSkillSupply[demand.Key] < demand.Value * 0.8) // Less than 80% coverage
            .Select(kvp => kvp.Key)
            .ToList();

        return new SkillGapAnalysisDTO
        {
            AnalysisId = Guid.NewGuid().ToString(),
            OrganizationId = organizationId ?? "ALL",
            RequiredSkills = overallSkillDemand.Keys.ToList(),
            AvailableSkills = overallSkillSupply.Keys.ToList(),
            MissingSkills = criticalMissingSkills,
            SurplusSkills = overallSkillSupply
                .Where(supply => !overallSkillDemand.ContainsKey(supply.Key))
                .Select(kvp => kvp.Key)
                .ToList(),
            SkillDemand = overallSkillDemand,
            SkillSupply = overallSkillSupply,
            TrainingRecommendations = GenerateTrainingRecommendations(criticalMissingSkills, overallSkillDemand),
            RecruitmentRecommendations = GenerateRecruitmentRecommendations(criticalMissingSkills, overallSkillDemand),
            AnalysisDate = DateTime.UtcNow
        };
    }

    public List<string> GenerateTrainingRecommendations(List<string> missingSkills, Dictionary<string, int> skillDemand)
    {
        var recommendations = new List<string>();

        if (!missingSkills.Any())
        {
            recommendations.Add("Không cần đào tạo bổ sung kỹ năng hiện tại");
            return recommendations;
        }

        // Prioritize skills by demand
        var prioritizedSkills = missingSkills
            .OrderByDescending(skill => skillDemand.GetValueOrDefault(skill, 0))
            .Take(5); // Top 5 priority skills

        foreach (var skill in prioritizedSkills)
        {
            var demand = skillDemand.GetValueOrDefault(skill, 0);
            recommendations.Add($"Đào tạo kỹ năng '{skill}' - cần {demand} người");
        }

        // Add general recommendations
        if (missingSkills.Count > 5)
        {
            recommendations.Add($"Xem xét đào tạo thêm {missingSkills.Count - 5} kỹ năng khác");
        }

        recommendations.Add("Tổ chức workshop định kỳ cho tình nguyện viên");
        recommendations.Add("Hợp tác với các tổ chức đào tạo chuyên nghiệp");

        return recommendations;
    }

    public List<string> GenerateRecruitmentRecommendations(List<string> missingSkills, Dictionary<string, int> skillDemand)
    {
        var recommendations = new List<string>();

        if (!missingSkills.Any())
        {
            recommendations.Add("Hiện tại đủ kỹ năng cần thiết");
            return recommendations;
        }

        // Focus on high-demand skills
        var criticalSkills = missingSkills
            .Where(skill => skillDemand.GetValueOrDefault(skill, 0) >= 3) // High demand
            .ToList();

        if (criticalSkills.Any())
        {
            recommendations.Add($"Ưu tiên tuyển dụng tình nguyện viên có kỹ năng: {string.Join(", ", criticalSkills)}");
        }

        // Targeted recruitment strategies
        foreach (var skill in criticalSkills.Take(3))
        {
            recommendations.Add($"Tuyển dụng mục tiêu cho kỹ năng '{skill}' - cần {skillDemand.GetValueOrDefault(skill, 0)} người");
        }

        // General recruitment advice
        recommendations.Add("Đăng tin tuyển dụng trên các nền tảng chuyên ngành");
        recommendations.Add("Hợp tác với trường đại học để tuyển sinh viên có kỹ năng phù hợp");
        recommendations.Add("Tạo chương trình giới thiệu tình nguyện viên");

        return recommendations;
    }
}
