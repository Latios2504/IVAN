using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class TableRelationship
{
    public int Id { get; set; }

    public int FromTableId { get; set; }

    public string FromColumn { get; set; } = null!;

    public int ToTableId { get; set; }

    public string ToColumn { get; set; } = null!;

    public string? RelationshipType { get; set; }

    public virtual TableSchema FromTable { get; set; } = null!;

    public virtual TableSchema ToTable { get; set; } = null!;
}
