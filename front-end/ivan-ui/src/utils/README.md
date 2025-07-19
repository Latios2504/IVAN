# Utility Functions Documentation

This directory contains centralized utility functions to improve code quality, maintainability, and consistency across the IVAN application.

## 📁 File Structure

```
src/utils/
├── roleUtils.ts          # Role management utilities
├── errorHandling.ts      # Error handling and logging
├── performance.ts        # Performance optimization hooks
└── testing.ts           # Testing utilities and helpers
```

## 🔧 Role Utils (`roleUtils.ts`)

Centralized role management functions to ensure consistency across the application.

### Key Features

- **Type-safe role definitions** with TypeScript
- **Bidirectional mapping** between role names and IDs
- **Validation functions** for role data
- **Display name management** with Vietnamese translations
- **Filter options** for dropdowns and UI components

### Usage Examples

```typescript
import { roleUtils, userStatusUtils } from "@/utils/roleUtils";

// Convert role name to ID
const roleId = roleUtils.mapRoleToId("admin"); // Returns 1

// Get display name
const displayName = roleUtils.getRoleDisplayName("volunteer"); // Returns "Tình nguyện viên"

// Validate role
const isValid = roleUtils.isValidRoleId(3); // Returns true

// Get filter options
const filterOptions = roleUtils.getRolesForFilter();

// Status utilities
const badgeVariant = userStatusUtils.getStatusBadgeVariant(true, false);
const statusText = userStatusUtils.getStatusText(true, true);
```

## 🚨 Error Handling (`errorHandling.ts`)

Comprehensive error handling system with structured logging and user-friendly messages.

### Key Features

- **Structured logging** with different levels (debug, info, warn, error)
- **Context-aware error handling** for better debugging
- **User-friendly error messages** with internationalization
- **Error boundary helpers** for React components
- **Async error wrapper** for promise-based operations

### Usage Examples

```typescript
import {
  logger,
  ErrorHandlingService,
  withErrorHandling,
} from "@/utils/errorHandling";

// Structured logging
logger.debug("User loaded", { userId: "123" }, "UserManagement");
logger.error("API call failed", error, "UserService");

// Async error handling
const result = await withErrorHandling(
  () => userService.getUsers(),
  "UserManagementPage.loadUsers"
);

// Handle specific errors
const appError = ErrorHandlingService.handleApiError(error, "context");
const friendlyMessage = ErrorHandlingService.getUserFriendlyMessage(appError);
```

## ⚡ Performance (`performance.ts`)

Performance optimization hooks and utilities for better user experience.

### Key Features

- **Debouncing and throttling** for search inputs and API calls
- **Memoized filtering** for large datasets
- **Virtual scrolling** for performance with large lists
- **Intersection observer** for lazy loading
- **Performance monitoring** for development

### Usage Examples

```typescript
import {
  useDebounce,
  useOptimizedSearch,
  useTablePagination,
} from "@/utils/performance";

// Debounced search
const debouncedSearchTerm = useDebounce(searchTerm, 300);

// Optimized search with multiple fields
const filteredUsers = useOptimizedSearch(
  users,
  searchTerm,
  ["fullName", "email"],
  300
);

// Table pagination
const { currentPage, totalPages, paginatedData, goToPage, nextPage, prevPage } =
  useTablePagination(users, 10);
```

## 🧪 Testing (`testing.ts`)

Comprehensive testing utilities for unit, integration, and performance testing.

### Key Features

- **Mock data generators** for consistent test data
- **Component testing utilities** with providers
- **API mocking helpers** for different scenarios
- **Performance testing** for large datasets
- **Accessibility testing** utilities

### Usage Examples

```typescript
import {
  mockDataGenerators,
  componentTestUtils,
  apiTestUtils,
} from "@/utils/testing";

// Generate mock data
const mockUser = mockDataGenerators.createMockUser({ role: "admin" });
const mockUsers = mockDataGenerators.createMockUsers(100);

// Test component with providers
const { getByText } = componentTestUtils.renderWithProviders(<UserList />);

// Mock API responses
const mockGetUsers = apiTestUtils.mockApiService.mockSuccess(mockUsers);
```

## 🎯 Benefits

### 1. **Code Consistency**

- Centralized role definitions prevent inconsistencies
- Standardized error handling across components
- Consistent status badge styling and text

### 2. **Type Safety**

- TypeScript interfaces for all utilities
- Compile-time validation of role IDs and names
- Reduced runtime errors

### 3. **Performance**

- Optimized search and filtering for large datasets
- Debounced inputs to reduce API calls
- Memoized computations to prevent unnecessary re-renders

### 4. **Maintainability**

- Single source of truth for role definitions
- Centralized error handling logic
- Reusable testing utilities

### 5. **Developer Experience**

- Structured logging for better debugging
- Performance monitoring in development
- Comprehensive testing helpers

### 6. **Error Prevention**

- Development-time validation catches issues early
- Enhanced logging and error tracking capabilities

## 🛡️ Error Prevention & Quality Assurance

### Development Validation

The `devValidation.ts` utility provides runtime checks in development mode:

```typescript
import {
  validateUtilityFunctions,
  checkFunctionExists,
} from "@/utils/devValidation";

// Auto-validates all utility functions on import
// Logs missing functions to console in development

// Manual validation
if (checkFunctionExists(roleUtils, "mapRoleToId", "UserManagementPage")) {
  // Function exists, safe to use
}
```

### Error Boundaries

Wrap components with error boundaries for graceful error handling:

```typescript
import { UserManagementErrorBoundary } from "@/components/ErrorBoundary";

<UserManagementErrorBoundary>
  <UserManagementPage />
</UserManagementErrorBoundary>;
```

### Enhanced Type Safety

Use strict type definitions from `types/enhanced.ts`:

```typescript
import { StrictUserRole, UserManagementState } from "@/types/enhanced";

const [state, setState] = useState<UserManagementState>({
  users: [],
  filters: { role: "all", status: "all", searchTerm: "" },
  isLoading: false,
});
```

## 🧪 Testing Strategy

### Unit Tests

Comprehensive test coverage in `__tests__/utils.test.ts`:

- Function correctness
- Edge case handling
- Performance benchmarks
- Error scenarios

### Integration Tests

- Component integration with utilities
- API response handling
- Error boundary functionality

### Development Checks

- Function existence validation
- Type safety verification
- Performance monitoring

## 🔄 Migration Guide

### From Local Constants to Centralized Utils

**Before:**

```typescript
// In component file
const USER_ROLES = {
  admin: "Quản trị viên",
  volunteer: "Tình nguyện viên",
  // ...
};

const getRoleId = (role: string): number => {
  switch (role) {
    case "admin":
      return 1;
    case "volunteer":
      return 2;
    // ...
  }
};
```

**After:**

```typescript
// Import centralized utilities
import { roleUtils } from "@/utils/roleUtils";

// Use centralized functions
const roleId = roleUtils.mapRoleToId(role);
const displayName = roleUtils.getRoleDisplayName(role);
```

### From Console Logs to Structured Logging

**Before:**

```typescript
console.log("Debug - Filter DTO:", filterDto);
console.error("Error loading users:", error);
```

**After:**

```typescript
import { logger } from "@/utils/errorHandling";

logger.debug("Loading users with filters", filterDto, "UserManagementPage");
logger.error("Failed to load users", error, "UserManagementPage");
```

## 📋 Best Practices

1. **Always use centralized utilities** instead of local implementations
2. **Include context** in error handling and logging
3. **Use TypeScript types** provided by utilities
4. **Test with mock data generators** for consistency
5. **Monitor performance** in development mode
6. **Handle errors gracefully** with user-friendly messages

## 🚀 Future Enhancements

- [ ] Add internationalization support for multiple languages
- [ ] Implement caching strategies for API responses
- [ ] Add more performance monitoring metrics
- [ ] Create automated accessibility testing
- [ ] Add real-time error tracking integration
- [ ] Implement advanced filtering and sorting utilities

## 📞 Support

For questions or issues with these utilities, please:

1. Check the inline documentation in each file
2. Review the usage examples above
3. Create an issue with detailed reproduction steps
4. Contact the development team for assistance
