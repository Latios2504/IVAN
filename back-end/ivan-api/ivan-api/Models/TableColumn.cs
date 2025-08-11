using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class TableColumn
{
    public int Id { get; set; }

    public int TableSchemaId { get; set; }

    public string ColumnName { get; set; } = null!;

    public string? DataType { get; set; }

    public string? Description { get; set; }

    public virtual TableSchema TableSchema { get; set; } = null!;
}
