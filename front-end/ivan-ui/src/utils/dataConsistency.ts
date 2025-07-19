/**
 * Data Consistency Debugging Utilities
 * Helps identify and debug data mapping and filtering issues
 */

import { logger } from './errorHandling';
import { roleUtils } from './roleUtils';

export interface DataConsistencyReport {
  timestamp: string;
  context: string;
  apiData: any;
  transformedData: any;
  filterCriteria: any;
  filteredResults: any;
  issues: string[];
  recommendations: string[];
}

/**
 * Debug API to Frontend data transformation
 */
export const debugDataTransformation = (
  context: string,
  apiData: any[],
  transformedData: any[],
  transformFunction: string
): DataConsistencyReport => {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check data count consistency
  if (apiData.length !== transformedData.length) {
    issues.push(`Data count mismatch: API returned ${apiData.length} items, but transformed to ${transformedData.length} items`);
    recommendations.push('Check transformation logic for filtering or mapping errors');
  }

  // Check for missing or null transformed data
  const nullTransformed = transformedData.filter(item => !item || Object.keys(item).length === 0);
  if (nullTransformed.length > 0) {
    issues.push(`${nullTransformed.length} items were transformed to null/empty objects`);
    recommendations.push('Verify transformation function handles all API data fields correctly');
  }

  // Check role mapping specifically
  if (context.includes('User') || context.includes('Role')) {
    apiData.forEach((apiItem, index) => {
      const transformedItem = transformedData[index];
      if (apiItem.roleName && transformedItem?.role) {
        const expectedRole = roleUtils.mapApiRoleToFrontendRole(apiItem.roleName);
        if (transformedItem.role !== expectedRole) {
          issues.push(`Role mapping error at index ${index}: API role "${apiItem.roleName}" mapped to "${transformedItem.role}" instead of "${expectedRole}"`);
          recommendations.push(`Update mapApiRoleToFrontendRole function to handle "${apiItem.roleName}"`);
        }
      }
    });
  }

  const report: DataConsistencyReport = {
    timestamp: new Date().toISOString(),
    context,
    apiData: apiData.slice(0, 3), // Sample first 3 items
    transformedData: transformedData.slice(0, 3),
    filterCriteria: null,
    filteredResults: null,
    issues,
    recommendations
  };

  // Log the report
  if (issues.length > 0) {
    logger.warn(`Data consistency issues found in ${context}`, report, 'DataConsistency');
  } else {
    logger.debug(`Data transformation successful in ${context}`, { 
      itemCount: transformedData.length,
      transformFunction 
    }, 'DataConsistency');
  }

  return report;
};

/**
 * Debug filtering logic
 */
export const debugFiltering = (
  context: string,
  originalData: any[],
  filterCriteria: any,
  filteredData: any[]
): DataConsistencyReport => {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check if filtering is too restrictive
  if (originalData.length > 0 && filteredData.length === 0) {
    issues.push('Filtering resulted in zero items - may be too restrictive');
    recommendations.push('Check filter criteria and ensure they match data format');
  }

  // Check filter criteria validity
  if (filterCriteria.role && filterCriteria.role !== 'all') {
    const validRoles = roleUtils.getAllRoles().map(r => r.name);
    if (!validRoles.includes(filterCriteria.role)) {
      issues.push(`Invalid role filter: "${filterCriteria.role}" is not a valid role`);
      recommendations.push(`Valid roles are: ${validRoles.join(', ')}`);
    }
  }

  // Analyze filtering effectiveness
  const filteringRatio = originalData.length > 0 ? (filteredData.length / originalData.length) : 0;
  if (filteringRatio < 0.1 && originalData.length > 10) {
    issues.push(`Filtering is very restrictive: ${(filteringRatio * 100).toFixed(1)}% of data remains`);
    recommendations.push('Verify filter logic is not overly restrictive');
  }

  const report: DataConsistencyReport = {
    timestamp: new Date().toISOString(),
    context,
    apiData: null,
    transformedData: null,
    filterCriteria,
    filteredResults: {
      originalCount: originalData.length,
      filteredCount: filteredData.length,
      filteringRatio: filteringRatio,
      sampleResults: filteredData.slice(0, 3)
    },
    issues,
    recommendations
  };

  if (issues.length > 0) {
    logger.warn(`Filtering issues found in ${context}`, report, 'DataConsistency');
  } else {
    logger.debug(`Filtering successful in ${context}`, {
      originalCount: originalData.length,
      filteredCount: filteredData.length,
      filteringRatio
    }, 'DataConsistency');
  }

  return report;
};

/**
 * Debug role-specific data issues
 */
export const debugRoleData = (users: any[], context: string = 'RoleDebug') => {
  const roleDistribution: Record<string, number> = {};
  const unmappedRoles: string[] = [];
  const issues: string[] = [];

  users.forEach(user => {
    if (user.role) {
      roleDistribution[user.role] = (roleDistribution[user.role] || 0) + 1;
    } else {
      issues.push(`User ${user.id || user.email} has no role assigned`);
    }

    // Check if role is valid
    if (user.role && !roleUtils.isValidRoleName(user.role)) {
      if (!unmappedRoles.includes(user.role)) {
        unmappedRoles.push(user.role);
      }
    }
  });

  if (unmappedRoles.length > 0) {
    issues.push(`Unmapped roles found: ${unmappedRoles.join(', ')}`);
  }

  const report = {
    context,
    totalUsers: users.length,
    roleDistribution,
    unmappedRoles,
    issues,
    validRoles: roleUtils.getAllRoles().map(r => r.name)
  };

  logger.info('Role distribution analysis', report, 'DataConsistency');

  return report;
};

/**
 * Comprehensive data consistency check
 */
export const runDataConsistencyCheck = (
  context: string,
  apiData: any[],
  transformedData: any[],
  filterCriteria: any,
  filteredData: any[]
) => {
  logger.info(`Starting data consistency check for ${context}`, {}, 'DataConsistency');

  const transformationReport = debugDataTransformation(
    `${context}-Transformation`,
    apiData,
    transformedData,
    'mapApiToFrontend'
  );

  const filteringReport = debugFiltering(
    `${context}-Filtering`,
    transformedData,
    filterCriteria,
    filteredData
  );

  // Role-specific checks for user data
  if (context.includes('User')) {
    debugRoleData(transformedData, `${context}-RoleAnalysis`);
  }

  const overallIssues = [
    ...transformationReport.issues,
    ...filteringReport.issues
  ];

  const overallRecommendations = [
    ...transformationReport.recommendations,
    ...filteringReport.recommendations
  ];

  if (overallIssues.length > 0) {
    logger.error(`Data consistency check failed for ${context}`, {
      issueCount: overallIssues.length,
      issues: overallIssues,
      recommendations: overallRecommendations
    }, 'DataConsistency');
  } else {
    logger.info(`Data consistency check passed for ${context}`, {
      apiCount: apiData.length,
      transformedCount: transformedData.length,
      filteredCount: filteredData.length
    }, 'DataConsistency');
  }

  return {
    passed: overallIssues.length === 0,
    issues: overallIssues,
    recommendations: overallRecommendations,
    reports: {
      transformation: transformationReport,
      filtering: filteringReport
    }
  };
};

/**
 * Auto-debug wrapper for data operations
 */
export const withDataConsistencyCheck = <T>(
  operation: () => T,
  context: string,
  debugData?: {
    apiData?: any[];
    transformedData?: any[];
    filterCriteria?: any;
    filteredData?: any[];
  }
): T => {
  try {
    const result = operation();

    // Run consistency check if debug data is provided
    if (debugData && process.env.NODE_ENV === 'development') {
      const { apiData, transformedData, filterCriteria, filteredData } = debugData;
      if (apiData && transformedData && filterCriteria && filteredData) {
        runDataConsistencyCheck(context, apiData, transformedData, filterCriteria, filteredData);
      }
    }

    return result;
  } catch (error) {
    logger.error(`Data operation failed in ${context}`, { error }, 'DataConsistency');
    throw error;
  }
};