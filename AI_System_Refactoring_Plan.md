# IVAN AI System Refactoring Plan

## Overview
Transform the current complex AI orchestration system into a simplified, Custom Instructions-driven architecture where all AI logic and behavior is centralized in the database rather than hardcoded in the backend.

## Current System Problems
- Complex orchestration with multiple service layers
- Hardcoded SQL detection logic
- Hardcoded system prompts and behavior rules
- Difficult to modify AI behavior without code changes
- Over-engineered prompt building process

## New Simplified Approach
- All AI logic stored in `AiCustomInstructions` table
- Simple keyword matching to select appropriate instruction
- Database schema lookup only when keywords match
- Minimal backend logic, maximum flexibility

---

## PHASE 1: REMOVE COMPLEX ORCHESTRATION ✅ COMPLETED

### ✅ Step 1.1: Delete Complex Services
**Files Deleted:**
- ✅ `Services/AI/AiPromptOrchestrator.cs`
- ✅ `Services/AI/Interfaces/IAiPromptOrchestrator.cs`
- ✅ `Services/AI/SQLGenerator/Utils/QueryAnalyzer.cs`
- ✅ `Services/AI/SQLGenerator/Utils/SqlDetectionService.cs`
- ✅ `Services/AI/SQLGenerator/Prompts/SqlGenerationPrompt.cs`
- ✅ `Services/AI/SQLGenerator/Services/SqlPromptGenerator.cs`

### ✅ Step 1.2: Update Dependency Injection
**Files Modified:**
- ✅ `Services/AI/AiServiceExtensions.cs` - Removed service registrations
- ✅ `Program.cs` - Removed service registrations and using statements

### ✅ Step 1.3: Simplify AiController
**Files Modified:**
- ✅ `Controllers/AiController.cs` - Removed dependencies and simplified logic

### ✅ Step 1.4: Fix Compilation
- ✅ Removed all references to deleted services
- ✅ Fixed field name reference (_providerFactory → _aiProviderFactory)
- ✅ Build successful with 0 errors, 34 warnings (non-blocking)

**Status**: Phase 1 completed successfully. The complex orchestration has been removed and replaced with simplified logic. The system now builds without errors and is ready for Phase 2 implementation.

---

## PHASE 2: DATABASE SCHEMA ENHANCEMENT

### Step 2.1: Enhance AiCustomInstructions Table
**New Columns to Add:**
```sql
ALTER TABLE AiCustomInstructions ADD:
- Keywords NVARCHAR(MAX) NULL -- Comma-separated keywords to trigger this instruction
- FocusTables NVARCHAR(MAX) NULL -- Comma-separated table names to focus on  
- ResponseFormat NVARCHAR(500) NULL -- How AI should format responses
- IsDefaultInstruction BIT NOT NULL DEFAULT 0 -- Whether this is default for non-keyword queries
- Priority INT NOT NULL DEFAULT 0 -- Priority when multiple instructions match keywords
```

### Step 2.2: Update Entity Model
**File to Modify:**
- `Models/AiCustomInstruction.cs`

**Add Properties:**
- Keywords, FocusTables, ResponseFormat, IsDefaultInstruction, Priority

### Step 2.3: Create Sample Data
**Insert Sample Custom Instructions:**
1. **SQL Query Instruction**: Keywords: "volunteer,event,registration,tình nguyện,sự kiện"
2. **General Chat Instruction**: IsDefaultInstruction: true
3. **Report Generation**: Keywords: "report,statistics,summary,báo cáo,thống kê"

---

## PHASE 3: SIMPLIFIED BACKEND IMPLEMENTATION

### Step 3.1: Create New Simplified Services

**A. SimpleKeywordMatcher.cs**
```csharp
public interface ISimpleKeywordMatcher
{
    Task<AiCustomInstruction?> MatchCustomInstructionAsync(string query);
    List<string> ExtractKeywordsFromQuery(string query);
}
```

**B. DatabaseSchemaProvider.cs**
```csharp
public interface IDatabaseSchemaProvider  
{
    Task<DatabaseSchemaContext> GetSchemaForTablesAsync(List<string> tableNames);
    Task<DatabaseSchemaContext> GetAllSchemaAsync();
}
```

**C. SimplifiedAiService.cs**
```csharp
public interface ISimplifiedAiService
{
    Task<AiQueryResponse> ProcessQueryAsync(AiQueryRequest request);
}
```

### Step 3.2: Update DTOs
**Files to Modify:**
- `DTOs/AiCustomInstructionDTOs.cs`

**Add New Properties to DTOs:**
- Keywords, FocusTables, ResponseFormat, IsDefaultInstruction, Priority

### Step 3.3: Update AiCustomInstructionService
**Add New Methods:**
- `GetInstructionByKeywordsAsync(List<string> keywords)`
- `GetDefaultInstructionAsync()`
- `GetInstructionWithHighestPriorityAsync(List<AiCustomInstruction> matches)`

---

## PHASE 4: IMPLEMENTATION STEPS

### Step 4.1: Database Migration (1 day)
1. Create migration script for AiCustomInstructions table changes
2. Insert sample Custom Instructions for testing
3. Update existing instructions with new fields

### Step 4.2: Backend Refactoring (4 days)
1. **Remove Old Services** (1 day)
   - Delete complex orchestration services
   - Update DI registration
   - Fix compilation errors

2. **Create New Simple Services** (2 days)
   - Implement SimpleKeywordMatcher
   - Implement DatabaseSchemaProvider
   - Implement SimplifiedAiService

3. **Refactor AiController** (1 day)
   - Simplify SendQuery endpoint
   - Implement new simple flow
   - Remove complex dependencies

4. **Update AiCustomInstructionService** (1 day)
   - Add keyword matching methods
   - Update CRUD operations for new fields
   - Add priority-based selection

### Step 4.3: Frontend Updates (2 days)
1. **Update AI Instructions Management UI** (1 day)
   - Add fields for Keywords, FocusTables, ResponseFormat
   - Add Priority setting
   - Add Default Instruction toggle

2. **Test Integration** (1 day)
   - Test keyword matching
   - Test database schema integration
   - Test SQL generation and execution

---

## PHASE 5: TESTING & VALIDATION

### Step 5.1: Create Test Custom Instructions
1. **Volunteer Management**: Keywords: "volunteer,member,người tình nguyện"
2. **Event Management**: Keywords: "event,activity,sự kiện,hoạt động"
3. **General Chat**: Default instruction for non-matching queries
4. **Reporting**: Keywords: "report,thống kê,báo cáo"

### Step 5.2: Test Scenarios
1. Query with matching keywords → Should use specific instruction + database schema
2. Query without matching keywords → Should use default instruction
3. Multiple keyword matches → Should use highest priority instruction
4. SQL generation → Should work with focused tables
5. General conversation → Should work without database schema

---

## PHASE 6: DEPLOYMENT & MONITORING

### Step 6.1: Gradual Rollout
1. Deploy with feature flag
2. Test with admin users first
3. Monitor performance and accuracy
4. Full rollout after validation

### Step 6.2: Performance Optimization
1. Cache Custom Instructions
2. Cache Database Schema
3. Optimize keyword matching algorithm

---

## NEW SIMPLIFIED FLOW

### Before (Complex):
```
User Query → QueryAnalyzer → AiPromptOrchestrator → SqlDetectionService → SqlGenerationPrompt → AI Provider → SqlExecutionService → Response
```

### After (Simple):
```
User Query → SimpleKeywordMatcher → DatabaseSchemaProvider (if needed) → AI Provider → SqlExecutionService (if SQL) → Response
```

---

## BENEFITS

1. **Simplicity**: 70% reduction in AI-related code complexity
2. **Flexibility**: All AI behavior configurable via database
3. **Maintainability**: Much simpler codebase
4. **User Control**: Users can create custom AI behaviors
5. **Performance**: Fewer service layers, faster processing

---

## RISKS & MITIGATION

### Risk 1: Loss of Complex Logic
**Mitigation**: Move complex logic to Custom Instructions as detailed prompts

### Risk 2: Performance Impact
**Mitigation**: Implement caching for Custom Instructions and Database Schema

### Risk 3: Keyword Matching Accuracy
**Mitigation**: Use fuzzy matching and multiple keyword strategies

---

## SUCCESS CRITERIA

1. ✅ All complex orchestration services removed
2. ✅ AI behavior fully configurable via database
3. ✅ Simple keyword-based instruction matching works
4. ✅ Database schema integration works with focused tables
5. ✅ SQL generation and execution still functional
6. ✅ General conversation works with default instructions
7. ✅ Frontend UI supports new Custom Instruction fields
8. ✅ Performance maintained or improved
9. ✅ Code complexity reduced by 70%
10. ✅ All existing functionality preserved