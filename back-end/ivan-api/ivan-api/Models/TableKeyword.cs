using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class TableKeyword
{
    public int Id { get; set; }

    public int TableSchemaId { get; set; }

    public string Keyword { get; set; } = null!;

    public virtual TableSchema TableSchema { get; set; } = null!;
}
