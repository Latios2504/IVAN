using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class Skill
{
    public int SkillId { get; set; }

    public string SkillName { get; set; } = null!;

    public string? Category { get; set; }

    public string? Description { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<VolunteerSkill> VolunteerSkills { get; set; } = new List<VolunteerSkill>();
}
