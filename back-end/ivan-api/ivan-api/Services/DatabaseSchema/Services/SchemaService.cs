using ivan_api.Models;
using ivan_api.Services.DatabaseSchema.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services.DatabaseSchema.Services
{
    public class SchemaService : ISchemaService
    {
        private readonly VolunteerManagementSystemContext _context;

        public SchemaService(VolunteerManagementSystemContext context)
        {
            _context = context;
        }

        public async Task<List<TableSchema>> GetAllTableSchemasAsync()
        {
            return await _context.TableSchemas
                .Include(ts => ts.TableColumns)
                .Include(ts => ts.TableKeywords)
                .ToListAsync();
        }

        public async Task<TableSchema?> GetTableSchemaByNameAsync(string tableName)
        {
            return await _context.TableSchemas
                .Include(ts => ts.TableColumns)
                .Include(ts => ts.TableKeywords)
                .FirstOrDefaultAsync(ts => ts.TableName.Equals(tableName, StringComparison.OrdinalIgnoreCase));
        }

        public async Task<List<string>> GetKeywordsForTableAsync(string tableName)
        {
            var tableSchema = await GetTableSchemaByNameAsync(tableName);
            return tableSchema?.TableKeywords.Select(tk => tk.Keyword).ToList() ?? new List<string>();
        }



        public async Task<string> GetDatabaseSchemaDescriptionAsync()
        {
            var tables = await GetAllTableSchemasAsync();
            if (!tables.Any()) return "No schema information available.";

            var description = new System.Text.StringBuilder();
            description.AppendLine("Database Schema Information:");
            description.AppendLine();

            foreach (var table in tables)
            {
                description.AppendLine($"Table: {table.TableName}");
                if (!string.IsNullOrEmpty(table.Description))
                {
                    description.AppendLine($"Description: {table.Description}");
                }

                if (table.TableKeywords.Any())
                {
                    var keywords = string.Join(", ", table.TableKeywords.Select(tk => tk.Keyword));
                    description.AppendLine($"Keywords: {keywords}");
                }

                if (table.TableColumns.Any())
                {
                    description.AppendLine("Columns:");
                    foreach (var column in table.TableColumns)
                    {
                        var columnInfo = $"- {column.ColumnName}";
                        if (!string.IsNullOrEmpty(column.DataType))
                        {
                            columnInfo += $" ({column.DataType})";
                        }
                        if (!string.IsNullOrEmpty(column.Description))
                        {
                            columnInfo += $" - {column.Description}";
                        }
                        description.AppendLine(columnInfo);
                    }
                }
                description.AppendLine();
            }

            return description.ToString();
        }

        public async Task<string> GetSchemaWithRelationshipsAsync(List<string> tableNames)
        {
            var tables = await GetAllTableSchemasAsync();
            var relevantTables = tables.Where(t => tableNames.Contains(t.TableName)).ToList();
            
            if (!relevantTables.Any()) return "No relevant schema information available.";

            var description = new System.Text.StringBuilder();
            description.AppendLine("Relevant Database Schema with Relationships:");
            description.AppendLine();

            foreach (var table in relevantTables)
            {
                description.AppendLine($"Table: {table.TableName}");
                if (!string.IsNullOrEmpty(table.Description))
                {
                    description.AppendLine($"Description: {table.Description}");
                }

                if (table.TableKeywords.Any())
                {
                    var keywords = string.Join(", ", table.TableKeywords.Select(tk => tk.Keyword));
                    description.AppendLine($"Keywords: {keywords}");
                }

                if (table.TableColumns.Any())
                {
                    description.AppendLine("Columns:");
                    foreach (var column in table.TableColumns)
                    {
                        var columnInfo = $"- {column.ColumnName}";
                        if (!string.IsNullOrEmpty(column.DataType))
                        {
                            columnInfo += $" ({column.DataType})";
                        }
                        if (!string.IsNullOrEmpty(column.Description))
                        {
                            columnInfo += $" - {column.Description}";
                        }
                        description.AppendLine(columnInfo);
                    }
                }

                // Add relationships
                var relationships = new List<string>();
                
                // Outgoing relationships
                foreach (var rel in table.TableRelationshipFromTables)
                {
                    var toTable = tables.FirstOrDefault(t => t.Id == rel.ToTableId);
                    if (toTable != null)
                    {
                        relationships.Add($"→ {toTable.TableName} ({table.TableName}.{rel.FromColumn} → {toTable.TableName}.{rel.ToColumn})");
                    }
                }

                // Incoming relationships  
                foreach (var rel in table.TableRelationshipToTables)
                {
                    var fromTable = tables.FirstOrDefault(t => t.Id == rel.FromTableId);
                    if (fromTable != null)
                    {
                        relationships.Add($"← {fromTable.TableName} ({fromTable.TableName}.{rel.FromColumn} → {table.TableName}.{rel.ToColumn})");
                    }
                }

                if (relationships.Any())
                {
                    description.AppendLine("Relationships:");
                    foreach (var relationship in relationships)
                    {
                        description.AppendLine($"  {relationship}");
                    }
                }

                description.AppendLine();
            }

            return description.ToString();
        }
    }
} 