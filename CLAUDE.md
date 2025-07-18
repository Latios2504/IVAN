# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**IVAN (Intelligent Volunteer Assistant Network)** is a production-ready AI-powered volunteer management platform for Vietnam. It connects volunteers, organizations, partners, and coordinators in a smart ecosystem with advanced AI assistance.

### Architecture
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS (Port 5173)
- **Backend**: .NET 8.0 Web API with Entity Framework Core (Port 7000+)
- **Database**: SQL Server with Vietnamese language support
- **AI Services**: 8-layer AI ecosystem with Gemini API integration

## Common Development Commands

### Frontend Development
```bash
# Development server
cd front-end/ivan-ui
npm install
npm run dev

# Production build
npm run build

# Code linting
npm run lint

# Preview production build
npm run preview
```

### Backend Development
```bash
# Development server
cd back-end/ivan-api/ivan-api
dotnet restore
dotnet run

# Build project
dotnet build

# Run specific project
dotnet run --project ivan-api.csproj
```

### Database Setup
```sql
-- Create database with Vietnamese collation
CREATE DATABASE IVANDatabase COLLATE Vietnamese_CI_AS;

-- Apply schema (run these files in order):
-- 1. ivan_database_schema.sql
-- 2. ivan_database_organized.sql
-- 3. ivan_database_data.sql
```

## High-Level Architecture

### Frontend Structure (`front-end/ivan-ui/src/`)
- **Components**: 20+ Shadcn/UI components + 14 custom categories
- **Pages**: 14+ route-level components for different user roles
- **Context**: Global state management (Auth, Notifications, Theme, Language)
- **Services**: API communication layer with type-safe clients
- **Types**: 16+ TypeScript definition files ensuring type safety
- **Hooks**: Custom React hooks for business logic

### Backend Structure (`back-end/ivan-api/ivan-api/`)
- **Controllers**: 18 RESTful API controllers with 60+ endpoints
- **Services**: 26 business logic services (including 8 AI services)
- **Repository**: Data access layer with Entity Framework Core
- **Models**: 41+ database entity models with relationships
- **DTOs**: Data transfer objects for API communication
- **Configuration**: JWT, Email, AI service configurations

### Database Schema
- **Core Tables**: 41+ tables with comprehensive relationships
- **AI Tables**: 9 specialized tables for AI conversation and analytics
- **Indexes**: 41+ strategic indexes for production performance
- **Collation**: Vietnamese_CI_AS for proper text sorting

### AI Infrastructure (8-Layer System)
1. **AIQueryEngine**: Main orchestration service
2. **IntelligentSQLGenerator**: AI-powered SQL generation
3. **AIDatabaseService**: Data access for AI operations
4. **AIInstructionsService**: Custom AI behavior management
5. **AIConversationService**: Chat history and context
6. **AISecurityService**: Input validation and output filtering
7. **AIPerformanceService**: Monitoring and optimization
8. **AICacheService**: Response caching for performance

## User Roles & Access Control

### Role Hierarchy
- **Admin**: Full system management
- **Coordinator**: Regional volunteer management
- **Organization**: Event creation and volunteer coordination
- **Partner**: Resource collaboration
- **Volunteer**: Self-service profile and event participation

### Authentication
- JWT-based authentication with refresh tokens
- Role-based access control at route and API level
- Session management with secure token storage

## Key Development Patterns

### Frontend Patterns
- **Component Organization**: Shadcn/UI base + custom business components
- **State Management**: React Context + custom hooks
- **Type Safety**: Strict TypeScript with comprehensive type definitions
- **Routing**: Protected routes with role-based access
- **API Integration**: Type-safe service layer with error handling

### Backend Patterns
- **Clean Architecture**: Controllers → Services → Repositories → Models
- **Dependency Injection**: Interface-based service registration
- **Entity Framework**: Code-first with migrations
- **API Design**: RESTful endpoints with consistent response format
- **Error Handling**: Centralized exception handling with user-friendly messages

### Database Patterns
- **Naming Convention**: PascalCase for tables and columns
- **Relationships**: Navigation properties with lazy loading
- **Indexes**: Strategic indexing for query performance
- **Audit Trail**: CreatedAt/UpdatedAt on all entities

## AI Integration Details

### ChatBot Implementation
- **Frontend**: 311-line floating ChatBot component
- **Backend**: Multi-model AI processing with context awareness
- **Database**: Conversation history and analytics storage
- **Features**: Role-based responses, Vietnamese language support

### AI Services Flow
1. User query → AIQueryEngine (analysis)
2. IntelligentSQLGenerator → SQL generation via Gemini API
3. AIDatabaseService → Data retrieval and processing
4. Response formatting → User interface

## Development Guidelines

### Code Quality
- **TypeScript**: 100% coverage in frontend
- **Testing**: Unit tests for business logic
- **Documentation**: Comprehensive inline documentation
- **Performance**: Lazy loading and code splitting

### Security
- **Input Validation**: Server-side validation on all endpoints
- **Authentication**: Secure JWT implementation
- **Authorization**: Role-based access control
- **Data Protection**: Sensitive data encryption

### Performance
- **Frontend**: Code splitting, lazy loading, caching
- **Backend**: Query optimization, response caching
- **Database**: Strategic indexing, query analysis
- **AI**: Response caching, rate limiting

## Memory Bank System

The `/memory-bank/` directory contains comprehensive project documentation:
- **01-project-overview.md**: Detailed project information
- **02-technical-architecture.md**: System architecture details
- **03-database-schema.md**: Database design documentation
- **04-frontend-development.md**: Frontend development guidelines
- **05-backend-development.md**: Backend development guidelines
- **06-development-status.md**: Current project status
- **07-project-structure.md**: Complete project structure
- **08-development-guidelines.md**: Coding standards
- **09-ai-infrastructure.md**: AI system documentation

## Common Tasks

### Adding New Features
1. Review memory bank documentation for context
2. Update TypeScript types in `/types/`
3. Create/update components in `/components/`
4. Add API endpoints in backend controllers
5. Implement business logic in services
6. Update database schema if needed

### Debugging
- **Frontend**: Check browser console, React DevTools
- **Backend**: Check application logs, API responses
- **Database**: Use SQL Server Management Studio
- **AI**: Monitor AI service logs and performance metrics

### Testing
- **Frontend**: Component testing with React Testing Library
- **Backend**: Unit tests for services and controllers
- **API**: Integration tests for endpoints
- **Database**: Data consistency and performance tests

## Environment Configuration

### Development Environment
- **Frontend**: `npm run dev` on localhost:5173
- **Backend**: `dotnet run` on localhost:7000+
- **Database**: Local SQL Server instance
- **AI**: Gemini API key in appsettings.json

### Production Considerations
- **Deployment**: Docker containers recommended
- **Database**: SQL Server with proper indexing
- **AI**: Rate limiting and response caching
- **Security**: HTTPS, secure headers, input validation

## Key Files to Reference

### Frontend
- `src/context/AuthContext.tsx`: Authentication state management
- `src/services/api/apiClient.ts`: API communication setup
- `src/types/`: TypeScript definitions
- `src/components/chatbot/ChatBot.tsx`: AI integration

### Backend
- `Program.cs`: Application configuration
- `Models/VolunteerManagementSystemContext.cs`: Database context
- `Services/AI/`: AI service implementations
- `Controllers/`: API endpoints

### Database
- `ivan_database_organized.sql`: Complete schema
- Tables with AI prefix: AI functionality
- Tables with User prefix: User management

This production-ready platform serves Vietnamese volunteer organizations with advanced AI assistance and comprehensive management capabilities.