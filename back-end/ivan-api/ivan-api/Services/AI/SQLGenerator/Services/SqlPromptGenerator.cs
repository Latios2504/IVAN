using ivan_api.Services.DatabaseSchema.Interfaces;
using ivan_api.Services.AI.SQLGenerator.Prompts;
using ivan_api.Models;
using Microsoft.Extensions.Logging;

namespace ivan_api.Services.AI.SQLGenerator.Services
{
    public class SqlPromptGenerator
    {
        private readonly ISchemaService _schemaService;
        private readonly SqlGenerationPrompt _sqlGenerationPrompt;

        public SqlPromptGenerator(ISchemaService schemaService, VolunteerManagementSystemContext context, ILogger<SqlGenerationPrompt> logger)
        {
            _schemaService = schemaService;
            _sqlGenerationPrompt = new SqlGenerationPrompt(context, logger);
        }

        public async Task<string> GenerateSqlPromptAsync(
            string userQuery, 
            List<string> relevantTables, 
            List<string> relevantKeywords,
            List<string> relevantRelationships,
            string? customInstructionPrompt = null)
        {
            // Build system prompt with dynamic metadata
            var systemPrompt = await _sqlGenerationPrompt.BuildSystemPromptAsync(customInstructionPrompt ?? "");

            // Build user prompt with context
            var userPrompt = await _sqlGenerationPrompt.BuildUserPromptAsync(userQuery, relevantTables);

            // Combine prompts
            return $"{systemPrompt}\n\n{userPrompt}";
        }
    }
} 