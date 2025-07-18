using ivan_api.Models;

namespace ivan_api.Services.DatabaseSchema.Interfaces
{
    public interface ISchemaService
    {
        Task<List<TableSchema>> GetAllTableSchemasAsync();
        Task<TableSchema?> GetTableSchemaByNameAsync(string tableName);
        Task<List<string>> GetKeywordsForTableAsync(string tableName);
        Task<string> GetDatabaseSchemaDescriptionAsync();
        Task<string> GetSchemaWithRelationshipsAsync(List<string> tableNames);
    }
} 