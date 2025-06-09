using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class VolunteerSkill
{
    public int VolunteerId { get; set; }

    public int SkillId { get; set; }

    public string? ProficiencyLevel { get; set; }

    public int? YearsOfExperience { get; set; }

    public string? Description { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Skill Skill { get; set; } = null!;

    public virtual VolunteerProfile Volunteer { get; set; } = null!;
}
