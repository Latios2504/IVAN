# IVAN AI System Documentation

## Overview
The IVAN (Intelligent Volunteer Assistant Network) AI system is a comprehensive artificial intelligence infrastructure designed for volunteer management. It consists of 5 core database tables and multiple service layers that work together to provide intelligent query processing, SQL generation, and natural language responses.

## Core Database Tables

### 1. AiCustomInstructions
**Purpose**: Stores custom AI behavior instructions and system prompts
- **InstructionId** (INT, PRIMARY KEY): Unique identifier for each instruction
- **InstructionName** (NVARCHAR(200)): Human-readable name for the instruction
- **SystemPrompt** (NVARCHAR(MAX)): Main system prompt that defines AI behavior
- **BehaviorInstructions** (NVARCHAR(MAX)): Additional behavior rules and constraints
- **IsActive** (BIT): Whether the instruction is currently active
- **CreatedAt** (DATETIME2): Creation timestamp
- **UpdatedAt** (DATETIME2): Last modification timestamp

### 2. TableSchemas
**Purpose**: Metadata about database tables for AI query understanding
- **Id** (INT, PRIMARY KEY): Unique identifier
- **TableName** (NVARCHAR(255)): Exact name of the database table
- **Description** (NVARCHAR(MAX)): Human-readable description of the table's purpose

### 3. TableKeywords
**Purpose**: Keywords associated with tables for natural language query matching
- **Id** (INT, PRIMARY KEY): Unique identifier
- **TableSchemaId** (INT, FOREIGN KEY): References TableSchemas.Id
- **Keyword** (NVARCHAR(255)): Keyword in Vietnamese or English that relates to the table

### 4. TableColumns
**Purpose**: Column metadata for SQL generation and validation
- **Id** (INT, PRIMARY KEY): Unique identifier
- **TableSchemaId** (INT, FOREIGN KEY): References TableSchemas.Id
- **ColumnName** (NVARCHAR(255)): Exact column name in the database
- **DataType** (NVARCHAR(100)): SQL data type of the column
- **Description** (NVARCHAR(MAX)): Human-readable description of the column

### 5. TableRelationships
**Purpose**: Defines relationships between tables for proper JOIN generation
- **Id** (INT, PRIMARY KEY): Unique identifier
- **FromTableId** (INT, FOREIGN KEY): Source table reference
- **FromColumn** (NVARCHAR(255)): Source column name
- **ToTableId** (INT, FOREIGN KEY): Target table reference
- **ToColumn** (NVARCHAR(255)): Target column name
- **RelationshipType** (NVARCHAR(50)): Type of relationship (FK, etc.)

## Model Classes (C# Entities)

### AiCustomInstruction.cs
```csharp
public class AiCustomInstruction
{
    public int InstructionId { get; set; }
    public string InstructionName { get; set; }
    public string SystemPrompt { get; set; }
    public string? BehaviorInstructions { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### TableSchema.cs
```csharp
public class TableSchema
{
    public int Id { get; set; }
    public string TableName { get; set; }
    public string? Description { get; set; }
    
    // Navigation properties
    public ICollection<TableColumn> TableColumns { get; set; }
    public ICollection<TableKeyword> TableKeywords { get; set; }
    public ICollection<TableRelationship> FromTables { get; set; }
    public ICollection<TableRelationship> ToTables { get; set; }
}
```

### TableKeyword.cs, TableColumn.cs, TableRelationship.cs
Similar entity classes with appropriate properties and navigation relationships.

## Data Transfer Objects (DTOs)

### AiCustomInstructionDTOs.cs
- **AiCustomInstructionDTO**: For displaying instructions
- **AiCustomInstructionCreateDTO**: For creating new instructions
- **AiCustomInstructionUpdateDTO**: For updating existing instructions
- **ToggleInstructionStatusDTO**: For changing instruction status

### AiQueryDTOs.cs
- **AiQueryRequest**: Input for AI queries
  - Query (string): User's natural language query
  - CustomInstructionId (int?): Optional custom instruction
  - PreferredModel (string?): Preferred AI model
  - IncludeContext (bool?): Whether to include database context
- **AiQueryResponse**: Output from AI processing
  - Success, Response, ModelUsed, ExecutionTimeMs, etc.

## Service Layer Architecture

### 1. IAiCustomInstructionService & AiCustomInstructionService
**Purpose**: Manages CRUD operations for AI custom instructions
**Key Methods**:
- `GetAllCustomInstructionsAsync()`: Admin-only access to all instructions
- `GetUserCustomInstructionsAsync()`: User-specific instructions based on role
- `GetCustomInstructionByIdAsync()`: Retrieve specific instruction
- `CreateCustomInstructionAsync()`: Create new instruction
- `UpdateCustomInstructionAsync()`: Update existing instruction
- `DeleteCustomInstructionAsync()`: Delete instruction
- `ToggleInstructionStatusAsync()`: Enable/disable instruction

**Features**:
- Role-based access control (Admin vs User)
- Automatic timestamp management
- DTO mapping for clean API responses

### 2. IAiProvider & Implementations
**Purpose**: Abstraction layer for different AI providers (Gemini, OpenRouter)

#### GeminiAiProvider.cs
- Implements Google Gemini API integration
- Handles authentication and request formatting
- Supports multiple Gemini models

#### OpenRouterAiProvider.cs
- Implements OpenRouter API integration
- Provides access to multiple AI models through single interface
- Handles rate limiting and error management

**Common Interface Methods**:
- `SendPromptAsync()`: Send prompts to AI provider
- `GetAvailableModelsAsync()`: List available models
- `GetCapabilities()`: Provider limitations and features

### 3. IAiProviderFactory & AiProviderFactory
**Purpose**: Factory pattern for managing multiple AI providers
**Key Methods**:
- `GetEnabledProvidersAsync()`: Get all active providers
- `GetProviderAsync()`: Get specific provider by name
- `GetProviderForModelAsync()`: Find provider supporting specific model
- `GetProviderModelsAsync()`: Get all available models from all providers
- `TestProviderAsync()`: Health check for providers

### 4. IAiPromptOrchestrator & AiPromptOrchestrator
**Purpose**: Centralizes prompt building with custom instructions and SQL context
**Key Method**: `BuildPromptAsync()`
**Process**:
1. Retrieves custom instruction if specified
2. Builds system prompt from custom instruction
3. For SQL queries: adds database metadata context
4. For regular queries: combines system prompt with user query
5. Returns `PromptResult` with complete prompt and metadata

### 5. QueryAnalyzer
**Purpose**: Analyzes user queries to determine intent and requirements
**Key Method**: `AnalyzeQueryAsync()`
**Process**:
1. Determines if query is SQL-related or general conversation
2. Calculates confidence score
3. For SQL queries: identifies required tables, keywords, relationships
4. Returns `QueryIntent` with analysis results

### 6. SqlDetectionService
**Purpose**: Detects SQL queries and provides database metadata
**Key Methods**:
- `IsSqlQueryAsync()`: Determines if query needs database access
- `GetRelevantTableNamesAsync()`: Finds tables related to query
- `GetTableRelationshipsAsync()`: Retrieves table relationships
- `GetTableColumnsAsync()`: Gets column metadata
- `GetRelevantKeywordsAsync()`: Finds relevant keywords

**Detection Logic**:
- Checks for explicit SQL keywords
- Analyzes natural language patterns in Vietnamese/English
- Matches query content against table keywords
- Uses database metadata for context

### 7. SqlGenerationPrompt
**Purpose**: Builds specialized prompts for SQL generation using dynamic database metadata
**Key Methods**:
- `BuildSystemPromptAsync()`: Creates comprehensive SQL generation prompt
- `BuildUserPromptAsync()`: Adds query-specific context

**Features**:
- Dynamic schema information from database
- Vietnamese/English keyword support
- Relationship mapping for proper JOINs
- SQL Server T-SQL specific syntax
- Security best practices (parameterized queries)

### 8. ISqlExecutionService & SqlExecutionService
**Purpose**: Safely executes generated SQL queries
**Features**:
- Query validation and sanitization
- Timeout management
- Row limit enforcement
- Error handling and logging
- Result formatting

## Controller Layer

### AiController.cs
**Purpose**: Main API controller for AI operations
**Key Endpoints**:

#### GET `/api/Ai/models`
- Returns list of available AI models from all providers
- Combines models from Gemini, OpenRouter, etc.

#### GET `/api/Ai/configuration`
- Returns current AI configuration
- Shows enabled providers, default models, settings

#### POST `/api/Ai/query`
- **Main AI processing endpoint**
- **Process Flow**:
  1. Validates request data
  2. Analyzes query intent using `QueryAnalyzer`
  3. Builds prompt using `AiPromptOrchestrator`
  4. For SQL queries: attempts SQL generation and execution
  5. For regular queries: sends to AI provider
  6. Returns formatted response with metadata

**SQL Query Processing**:
1. Detects if query needs database access
2. Generates SQL using AI provider with database context
3. Executes SQL safely with validation
4. Converts results to natural language response
5. Returns both SQL data and natural language explanation

### AiCustomInstructionController.cs
**Purpose**: CRUD operations for AI custom instructions
**Endpoints**:
- GET `/api/AiCustomInstruction/all`: All instructions (Admin only)
- GET `/api/AiCustomInstruction`: User-specific instructions
- GET `/api/AiCustomInstruction/{id}`: Specific instruction
- POST `/api/AiCustomInstruction`: Create instruction
- PUT `/api/AiCustomInstruction/{id}`: Update instruction
- DELETE `/api/AiCustomInstruction/{id}`: Delete instruction
- PATCH `/api/AiCustomInstruction/{id}/status`: Toggle status

## Configuration

### AiModelConfiguration.cs
**Purpose**: Configuration class for AI providers
**Properties**:
- Name, ApiKey, BaseUrl: Provider connection details
- DefaultModel, AvailableModels: Model configuration
- MaxTokens, Temperature: AI behavior settings
- IsEnabled: Provider activation status
- Rate limiting settings

### AiModelConstants.cs
**Purpose**: Static constants for AI system
**Categories**:
- Provider names and types
- Default configuration values
- API endpoints
- Error messages
- Cache key prefixes
- Analytics constants

## Extensions

### AiServiceExtensions.cs
**Purpose**: Dependency injection configuration for AI services
**Registration Process**:
1. Configures AI providers (Gemini, OpenRouter)
2. Registers HTTP clients for API communication
3. Registers all AI services with proper interfaces
4. Validates configuration on startup

**Registered Services**:
- AI Providers (Gemini, OpenRouter)
- Provider Factory
- Prompt Orchestrator
- Query Analyzer
- SQL Detection Service
- SQL Generation Prompt
- SQL Execution Service
- Custom Instruction Service

## AI System Workflow

### 1. Query Processing Flow
```
User Query → AiController.SendQuery()
    ↓
QueryAnalyzer.AnalyzeQueryAsync()
    ↓
AiPromptOrchestrator.BuildPromptAsync()
    ↓
[If SQL Query]
    ↓
SqlGenerationPrompt.BuildSystemPromptAsync()
    ↓
AI Provider (Generate SQL)
    ↓
SqlExecutionService.ExecuteSqlAsync()
    ↓
Natural Language Response Generation
    ↓
Return Response with SQL Data
```

### 2. Custom Instruction Integration
```
User specifies CustomInstructionId
    ↓
AiCustomInstructionService.GetCustomInstructionByIdAsync()
    ↓
AiPromptOrchestrator integrates instruction into prompt
    ↓
AI Provider processes with custom behavior
    ↓
Response follows custom instruction guidelines
```

### 3. Database Metadata Utilization
```
User Query contains keywords
    ↓
SqlDetectionService.GetRelevantTableNamesAsync()
    ↓
Match keywords against TableKeywords table
    ↓
Retrieve TableColumns and TableRelationships
    ↓
Build comprehensive database context
    ↓
Generate accurate SQL with proper JOINs
```

## Key Features

### 1. Multi-Provider Support
- Supports multiple AI providers (Gemini, OpenRouter)
- Automatic failover and load balancing
- Provider-specific optimizations

### 2. Intelligent SQL Generation
- Natural language to SQL conversion
- Vietnamese and English query support
- Dynamic database schema awareness
- Relationship-aware JOIN generation

### 3. Custom AI Instructions
- User-defined AI behavior
- Role-based instruction access
- System prompt customization
- Behavior rule enforcement

### 4. Security & Safety
- SQL injection prevention
- Query validation and sanitization
- Rate limiting and timeout management
- Error handling and logging

### 5. Bilingual Support
- Vietnamese and English keywords
- Localized error messages
- Cultural context awareness
- Natural language responses in user's language

## Performance Optimizations

### 1. Caching Strategy
- Database metadata caching
- Provider response caching
- Configuration caching

### 2. Efficient Query Processing
- Keyword-based table detection
- Minimal database metadata loading
- Optimized SQL generation

### 3. Resource Management
- Connection pooling
- Timeout management
- Memory-efficient data structures

## Error Handling

### 1. Graceful Degradation
- Fallback to simpler AI responses if SQL fails
- Multiple provider fallback
- Default instruction fallback

### 2. Comprehensive Logging
- Query analysis logging
- SQL generation logging
- Provider communication logging
- Error tracking and monitoring

### 3. User-Friendly Error Messages
- Localized error responses
- Helpful suggestions for query improvement
- Clear indication of system limitations

## Future Extensibility

### 1. New Provider Integration
- Standardized IAiProvider interface
- Easy registration through DI
- Configuration-driven provider management

### 2. Enhanced Analytics
- Query pattern analysis
- Performance monitoring
- Usage statistics

### 3. Advanced Features
- Conversation history
- Context awareness across queries
- Learning from user feedback
- Advanced SQL optimization

This AI system represents a sophisticated integration of natural language processing, database intelligence, and user customization, providing a powerful tool for volunteer management through intelligent query processing and response generation.