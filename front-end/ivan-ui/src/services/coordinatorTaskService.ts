// Coordinator Task Service - Matching backend CoordinatorTaskController
import apiClient from "./apiClient";
import type {
  CoordinatorTaskDto,
  CreateCoordinatorTaskDto,
  UpdateCoordinatorTaskDto,
   UpdateTaskStatusDto,
  CoordinatorTaskFilterDto,
  CoordinatorTaskStatsDto,
  CoordinatorTaskListResponseDto,
  CoordinatorTaskValidationResult,
  TaskStatus,
  TaskPriority,
  TaskCategory,
} from "../types/coordinatorTask";
import type { PagedResultDto } from "../types/common";
import {
  DEFAULT_COORDINATOR_TASK_FILTER,
  TASK_STATUS,
  TASK_PRIORITY,
} from "../types/coordinatorTask";

class CoordinatorTaskService {
  private readonly baseUrl = "/CoordinatorTask";

  // Helper function to handle .NET JSON serialization format
  private extractDataFromNetResponse<T>(data: T | any): T {
    // If data has $values property (common with .NET JSON serialization), extract it
    if (data && typeof data === "object" && "$values" in data) {
      return data.$values as T;
    }
    return data;
  }

  // === TASK MANAGEMENT ENDPOINTS ===

  // GET /api/CoordinatorTask - Get all coordinator tasks
  async getAllTasks(): Promise<CoordinatorTaskDto[]> {
    const response = await apiClient.get<CoordinatorTaskDto[]>(this.baseUrl);

    if (!response.success || !response.data) {
      console.warn("Failed to load tasks or received empty data:", response);
      return [];
    }

    // Handle .NET JSON serialization format
    const extractedData = this.extractDataFromNetResponse(response.data);

    // Ensure the data is an array
    if (!Array.isArray(extractedData)) {
      console.warn(
        "Expected tasks data to be an array, received:",
        typeof extractedData,
        extractedData
      );
      return [];
    }

    return extractedData;
  }

  // GET /api/CoordinatorTask/{id} - Get task by ID
  async getTaskById(taskId: number): Promise<CoordinatorTaskDto> {
    const response = await apiClient.get<CoordinatorTaskDto>(
      `${this.baseUrl}/${taskId}`
    );
    if (!response.data) {
      throw new Error("Coordinator task not found");
    }
    return response.data;
  }

  // POST /api/CoordinatorTask - Create new coordinator task
  async createTask(
    createDto: CreateCoordinatorTaskDto
  ): Promise<CoordinatorTaskDto> {
    // Validate before sending
    const validation = this.validateTaskData(createDto);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    const response = await apiClient.post<CoordinatorTaskDto>(
      this.baseUrl,
      createDto
    );
    if (!response.data) {
      throw new Error("Failed to create coordinator task");
    }
    return response.data;
  }

  // PUT /api/CoordinatorTask/{id} - Update coordinator task
  async updateTask(
    taskId: number,
    updateDto: UpdateCoordinatorTaskDto
  ): Promise<CoordinatorTaskDto> {
    // Validate before sending
    const validation = this.validateTaskData(updateDto);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    const response = await apiClient.put<CoordinatorTaskDto>(
      `${this.baseUrl}/${taskId}`,
      updateDto
    );
    if (!response.data) {
      throw new Error("Failed to update coordinator task");
    }
    return response.data;
  }

  // === FILTERING AND SEARCH METHODS ===

  // === NEW BACKEND ENDPOINTS ===

  // GET /api/CoordinatorTask/organization - Get tasks for organization with server-side filtering
  async getOrganizationTasks(
    filter: Partial<CoordinatorTaskFilterDto> = {}
  ): Promise<PagedResultDto<CoordinatorTaskDto>> {
    const params = new URLSearchParams();
    
    // Add filter parameters
    if (filter.coordinatorId) params.append('coordinatorId', filter.coordinatorId.toString());
    if (filter.eventId) params.append('eventId', filter.eventId.toString());
    if (filter.status) params.append('status', filter.status);
    if (filter.priority) params.append('priority', filter.priority);
    if (filter.dueFrom) params.append('dueFrom', filter.dueFrom);
    if (filter.dueTo) params.append('dueTo', filter.dueTo);
    if (filter.search) params.append('search', filter.search);
    if (filter.sortBy) params.append('sortBy', filter.sortBy);
    if (filter.sortDirection) params.append('sortDirection', filter.sortDirection);
    if (filter.pageNumber) params.append('page', filter.pageNumber.toString());
    if (filter.pageSize) params.append('size', filter.pageSize.toString());

    const response = await apiClient.get<PagedResultDto<CoordinatorTaskDto>>(
      `${this.baseUrl}/organization?${params.toString()}`
    );
    
    if (!response.success || !response.data) {
      throw new Error("Failed to load organization tasks");
    }
    
    return response.data;
  }

  // GET /api/CoordinatorTask/personal - Get personal tasks for coordinator with server-side filtering
  async getPersonalTasks(
    filter: Partial<CoordinatorTaskFilterDto> = {}
  ): Promise<PagedResultDto<CoordinatorTaskDto>> {
    const params = new URLSearchParams();
    
    // Add filter parameters (no coordinatorId needed as it's determined by auth)
    if (filter.eventId) params.append('eventId', filter.eventId.toString());
    if (filter.status) params.append('status', filter.status);
    if (filter.priority) params.append('priority', filter.priority);
    if (filter.dueFrom) params.append('dueFrom', filter.dueFrom);
    if (filter.dueTo) params.append('dueTo', filter.dueTo);
    if (filter.search) params.append('search', filter.search);
    if (filter.sortBy) params.append('sortBy', filter.sortBy);
    if (filter.sortDirection) params.append('sortDirection', filter.sortDirection);
    if (filter.pageNumber) params.append('page', filter.pageNumber.toString());
    if (filter.pageSize) params.append('size', filter.pageSize.toString());

    const response = await apiClient.get<PagedResultDto<CoordinatorTaskDto>>(
      `${this.baseUrl}/personal?${params.toString()}`
    );
    
    if (!response.success || !response.data) {
      throw new Error("Failed to load personal tasks");
    }
    
    return response.data;
  }

  // Legacy method - Get tasks with filtering (client-side implementation for backward compatibility)
  async getTasksWithFilter(
    filter: Partial<CoordinatorTaskFilterDto> = {}
  ): Promise<CoordinatorTaskListResponseDto> {
    const filterWithDefaults = {
      ...DEFAULT_COORDINATOR_TASK_FILTER,
      ...filter,
    };

    // Get all tasks first
    const allTasks = await this.getAllTasks();

    // Apply client-side filtering
    let filteredTasks = [...allTasks];

    // Filter by eventId
    if (filterWithDefaults.eventId) {
      filteredTasks = filteredTasks.filter(
        (task) => task.eventId === filterWithDefaults.eventId
      );
    }

    // Filter by coordinatorId
    if (filterWithDefaults.coordinatorId) {
      filteredTasks = filteredTasks.filter(
        (task) => task.coordinatorId === filterWithDefaults.coordinatorId
      );
    }

    // Filter by status
    if (filterWithDefaults.status) {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === filterWithDefaults.status
      );
    }

    // Filter by priority
    if (filterWithDefaults.priority) {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === filterWithDefaults.priority
      );
    }

    // Filter by due date range
    if (filterWithDefaults.dueFrom) {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.dueDate && task.dueDate >= filterWithDefaults.dueFrom!
      );
    }

    if (filterWithDefaults.dueTo) {
      filteredTasks = filteredTasks.filter(
        (task) => task.dueDate && task.dueDate <= filterWithDefaults.dueTo!
      );
    }

    // Search in task name, description, notes
    if (filterWithDefaults.search) {
      const searchTerm = filterWithDefaults.search.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.taskName.toLowerCase().includes(searchTerm) ||
          task.description?.toLowerCase().includes(searchTerm) ||
          task.notes?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (filterWithDefaults.sortBy) {
      filteredTasks.sort((a, b) => {
        const aValue = this.getSortValue(a, filterWithDefaults.sortBy!);
        const bValue = this.getSortValue(b, filterWithDefaults.sortBy!);

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;

        return filterWithDefaults.sortDirection === "desc"
          ? -comparison
          : comparison;
      });
    }

    // Apply pagination
    const pageNumber = filterWithDefaults.pageNumber || 1;
    const pageSize = filterWithDefaults.pageSize || 20;
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredTasks.length / pageSize);

    return {
      tasks: paginatedTasks,
      totalCount: filteredTasks.length,
      page: pageNumber,
      size: pageSize,
      totalPages,
    };
  }

  // Helper method to get sort value from task object
  private getSortValue(task: CoordinatorTaskDto, sortBy: string): any {
    switch (sortBy) {
      case "taskName":
        return task.taskName;
      case "dueDate":
        return task.dueDate;
      case "priority":
        return this.getPriorityWeight(task.priority);
      case "status":
        return task.status;
      case "category":
        return task.category;
      case "estimatedHours":
        return task.estimatedHours || 0;
      case "actualHours":
        return task.actualHours || 0;
      default:
        return task.taskName;
    }
  }

  // Helper method to get priority weight for sorting
  private getPriorityWeight(priority?: string | null): number {
    switch (priority) {
      case TASK_PRIORITY.URGENT:
        return 4;
      case TASK_PRIORITY.HIGH:
        return 3;
      case TASK_PRIORITY.MEDIUM:
        return 2;
      case TASK_PRIORITY.LOW:
        return 1;
      default:
        return 0;
    }
  }

  // === CONVENIENCE METHODS ===

  // Get tasks by event ID
  async getTasksByEventId(eventId: number): Promise<CoordinatorTaskDto[]> {
    const result = await this.getTasksWithFilter({ eventId });
    return result.tasks;
  }

  // Get tasks by coordinator ID
  async getTasksByCoordinatorId(
    coordinatorId: number
  ): Promise<CoordinatorTaskDto[]> {
    const result = await this.getTasksWithFilter({ coordinatorId });
    return result.tasks;
  }

  // Get tasks by status
  async getTasksByStatus(status: TaskStatus): Promise<CoordinatorTaskDto[]> {
    const result = await this.getTasksWithFilter({ status });
    return result.tasks;
  }

  // Get overdue tasks
  async getOverdueTasks(): Promise<CoordinatorTaskDto[]> {
    const allTasks = await this.getAllTasks();
    const currentDate = new Date().toISOString();

    return allTasks.filter(
      (task) =>
        task.dueDate &&
        task.dueDate < currentDate &&
        task.status !== TASK_STATUS.COMPLETED &&
        task.status !== TASK_STATUS.CANCELLED
    );
  }

  // Get tasks due today
  async getTasksDueToday(): Promise<CoordinatorTaskDto[]> {
    const allTasks = await this.getAllTasks();
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).toISOString();
    const todayEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    ).toISOString();

    return allTasks.filter(
      (task) =>
        task.dueDate && task.dueDate >= todayStart && task.dueDate < todayEnd
    );
  }

  // === STATISTICS METHODS ===

  // Generate task statistics (client-side calculation)
  async getTaskStats(
    eventId?: number,
    coordinatorId?: number
  ): Promise<CoordinatorTaskStatsDto> {
    let tasks = await this.getAllTasks();

    // Filter by eventId or coordinatorId if provided
    if (eventId) {
      tasks = tasks.filter((task) => task.eventId === eventId);
    }
    if (coordinatorId) {
      tasks = tasks.filter((task) => task.coordinatorId === coordinatorId);
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === TASK_STATUS.COMPLETED
    ).length;
    const inProgressTasks = tasks.filter(
      (task) => task.status === TASK_STATUS.IN_PROGRESS
    ).length;
    const pendingTasks = tasks.filter(
      (task) => task.status === TASK_STATUS.ASSIGNED
    ).length;

    const currentDate = new Date().toISOString();
    const overdueTasks = tasks.filter(
      (task) =>
        task.dueDate &&
        task.dueDate < currentDate &&
        task.status !== TASK_STATUS.COMPLETED &&
        task.status !== TASK_STATUS.CANCELLED
    ).length;

    // Calculate stats by status
    const tasksByStatus = this.calculateStatsByField(tasks, "status");
    const tasksByPriority = this.calculateStatsByField(tasks, "priority");
    const tasksByCategory = this.calculateStatsByField(tasks, "category");

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      overdueTasks,
      tasksByStatus,
      tasksByPriority,
      tasksByCategory,
    };
  }

  // Helper method to calculate statistics by field
  private calculateStatsByField(
    tasks: CoordinatorTaskDto[],
    field: keyof CoordinatorTaskDto
  ): any[] {
    const counts: Record<string, number> = {};
    const total = tasks.length;

    tasks.forEach((task) => {
      const value = task[field] as string;
      if (value) {
        counts[value] = (counts[value] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([key, count]) => ({
      [field]: key,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
  }

  // === UTILITY METHODS ===

  // Update task status using dedicated PATCH endpoint
  async updateTaskStatus(
    taskId: number,
    status: TaskStatus
  ): Promise<CoordinatorTaskDto> {
    const updateDto: UpdateTaskStatusDto = {
      status: status,
    };
    
    const response = await apiClient.patch<CoordinatorTaskDto>(
      `${this.baseUrl}/${taskId}/status`,
      updateDto
    );
    
    if (!response.data) {
      throw new Error("Failed to update task status");
    }
    
    return response.data;
  }

  // Mark task as completed
  async completeTask(
    taskId: number,
    actualHours?: number
  ): Promise<CoordinatorTaskDto> {
    const task = await this.getTaskById(taskId);
    const updateDto: UpdateCoordinatorTaskDto = {
      eventId: task.eventId,
      coordinatorId: task.coordinatorId,
      taskName: task.taskName,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: TASK_STATUS.COMPLETED,
      category: task.category,
      estimatedHours: task.estimatedHours,
      actualHours: actualHours ?? task.actualHours,
      completedAt: new Date().toISOString(),
      notes: task.notes,
    };

    return this.updateTask(taskId, updateDto);
  }

  // Validate task data before creation/update
  validateTaskData(
    data: CreateCoordinatorTaskDto | UpdateCoordinatorTaskDto
  ): CoordinatorTaskValidationResult {
    const errors: string[] = [];

    // Required field validations
    if (!data.taskName?.trim()) {
      errors.push("Task name is required");
    } else if (data.taskName.length > 200) {
      errors.push("Task name must be 200 characters or less");
    }

    if (!data.eventId || data.eventId <= 0) {
      errors.push("Valid event ID is required");
    }

    if (!data.coordinatorId || data.coordinatorId <= 0) {
      errors.push("Valid coordinator ID is required");
    }

    // Optional field validations
    if (data.description && data.description.length > 2000) {
      errors.push("Description must be 2000 characters or less");
    }

    if (
      data.estimatedHours !== undefined &&
      data.estimatedHours !== null &&
      data.estimatedHours < 0
    ) {
      errors.push("Estimated hours cannot be negative");
    }

    if (
      "actualHours" in data &&
      data.actualHours !== undefined &&
      data.actualHours !== null &&
      data.actualHours < 0
    ) {
      errors.push("Actual hours cannot be negative");
    }

    if (data.notes && data.notes.length > 1000) {
      errors.push("Notes must be 1000 characters or less");
    }

    // Date validations
    if (data.dueDate) {
      const dueDate = new Date(data.dueDate);
      if (isNaN(dueDate.getTime())) {
        errors.push("Due date must be a valid date");
      }
    }

    if ("completedAt" in data && data.completedAt) {
      const completedDate = new Date(data.completedAt);
      if (isNaN(completedDate.getTime())) {
        errors.push("Completion date must be a valid date");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Helper method to format date for API
  formatDateForApi(date: Date | string): string {
    if (typeof date === "string") {
      return date;
    }
    return date.toISOString();
  }

  // Helper method to check if task is overdue
  isTaskOverdue(task: CoordinatorTaskDto): boolean {
    if (!task.dueDate) return false;
    if (
      task.status === TASK_STATUS.COMPLETED ||
      task.status === TASK_STATUS.CANCELLED
    )
      return false;

    const currentDate = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < currentDate;
  }

  // Helper method to get task progress percentage
  getTaskProgress(task: CoordinatorTaskDto): number {
    if (task.status === TASK_STATUS.COMPLETED) return 100;
    if (task.status === TASK_STATUS.CANCELLED) return 0;
    if (task.status === TASK_STATUS.IN_PROGRESS) return 50;
    if (task.status === TASK_STATUS.ON_HOLD) return 25;
    return 0; // ASSIGNED or other statuses
  }

  // Helper method to get time remaining for task
  getTimeRemaining(task: CoordinatorTaskDto): string | null {
    if (!task.dueDate) return null;

    const currentDate = new Date();
    const dueDate = new Date(task.dueDate);
    const diffMs = dueDate.getTime() - currentDate.getTime();

    if (diffMs < 0) return "Overdue";

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} remaining`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} remaining`;
    } else {
      return "Due soon";
    }
  }
}

export const coordinatorTaskService = new CoordinatorTaskService();
export default coordinatorTaskService;
