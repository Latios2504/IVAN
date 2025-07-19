/**
 * Development-time validation utilities
 * Helps catch common errors during development
 */

import { roleUtils, userStatusUtils } from "./roleUtils";
import { logger } from "./errorHandling";

/**
 * Validate that all required utility functions exist
 */
export const validateUtilityFunctions = () => {
  if (process.env.NODE_ENV !== "development") return;

  const requiredRoleUtils = [
    "mapRoleToId",
    "mapIdToRole",
    "getRoleDisplayName",
    "getRoleDisplayNameById",
    "isValidRoleId",
    "isValidRoleName",
    "getAllRoles",
    "getRolesForFilter",
    "mapApiRoleToFrontendRole",
  ];

  const requiredStatusUtils = [
    "getStatusOptions",
    "getStatusBadgeVariant",
    "getStatusText",
  ];

  // Validate roleUtils
  requiredRoleUtils.forEach((funcName) => {
    if (typeof roleUtils[funcName as keyof typeof roleUtils] !== "function") {
      console.error(`❌ Missing roleUtils.${funcName} function`);
    } else {
      console.log(`✅ roleUtils.${funcName} is available`);
    }
  });

  // Validate userStatusUtils
  requiredStatusUtils.forEach((funcName) => {
    if (
      typeof userStatusUtils[funcName as keyof typeof userStatusUtils] !==
      "function"
    ) {
      console.error(`❌ Missing userStatusUtils.${funcName} function`);
    } else {
      console.log(`✅ userStatusUtils.${funcName} is available`);
    }
  });

  logger.info("Utility function validation completed", {}, "DevValidation");
};

/**
 * Validate component props and state
 */
export const validateComponentState = (componentName: string, state: any) => {
  if (process.env.NODE_ENV !== "development") return;

  const requiredFields = {
    UserManagementPage: ["users", "filters", "isLoading"],
    UserDetailsModal: ["user", "isOpen"],
    CoordinatorCreationDialog: ["isOpen"],
  };

  const required = requiredFields[componentName as keyof typeof requiredFields];
  if (!required) return;

  required.forEach((field) => {
    if (state[field] === undefined) {
      console.warn(
        `⚠️ ${componentName}: Missing required state field '${field}'`
      );
    }
  });
};

/**
 * Function existence checker
 */
export const checkFunctionExists = (
  obj: any,
  funcName: string,
  context: string
) => {
  if (process.env.NODE_ENV !== "development") return true;

  if (typeof obj[funcName] !== "function") {
    console.error(`❌ ${context}: Function '${funcName}' does not exist`);
    logger.error(
      `Function not found: ${funcName}`,
      { context },
      "DevValidation"
    );
    return false;
  }
  return true;
};

/**
 * API response validator
 */
export const validateApiResponse = (
  response: any,
  expectedFields: string[],
  context: string
) => {
  if (process.env.NODE_ENV !== "development") return;

  if (!response) {
    console.error(`❌ ${context}: Response is null or undefined`);
    return;
  }

  expectedFields.forEach((field) => {
    if (response[field] === undefined) {
      console.warn(
        `⚠️ ${context}: Missing expected field '${field}' in API response`
      );
    }
  });
};

/**
 * Role validation helper
 */
export const validateRoleData = (role: string, context: string) => {
  if (process.env.NODE_ENV !== "development") return;

  if (!roleUtils.isValidRoleName(role)) {
    console.error(`❌ ${context}: Invalid role '${role}'`);
    logger.error(`Invalid role detected`, { role, context }, "DevValidation");
  }
};

// Auto-run validation on import in development
if (process.env.NODE_ENV === "development") {
  validateUtilityFunctions();
}
