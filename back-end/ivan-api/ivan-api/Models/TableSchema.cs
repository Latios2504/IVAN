using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class TableSchema
{
    public int Id { get; set; }

    public string TableName { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<TableColumn> TableColumns { get; set; } = new List<TableColumn>();

    public virtual ICollection<TableKeyword> TableKeywords { get; set; } = new List<TableKeyword>();

    public virtual ICollection<TableRelationship> TableRelationshipFromTables { get; set; } = new List<TableRelationship>();

    public virtual ICollection<TableRelationship> TableRelationshipToTables { get; set; } = new List<TableRelationship>();
}
