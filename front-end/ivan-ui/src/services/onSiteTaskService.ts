import { apiClient } from "./apiClient";
import type {
  OnSiteTask,
  OnSiteTaskInput,
  OnSiteTaskUpdate,
  OnSiteTaskViewModel,
  PagedOnSiteTaskResult,
  TaskAssignment,
} from "@/types/onSiteTask";
import type { ApiResponse } from "@/types/common";

class OnSiteTaskService {
  private readonly baseUrl = "/api/OnSiteTask";

  // Get paginated list of on-site tasks
  async getOnSiteTasks(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PagedOnSiteTaskResult> {
    const response = await apiClient.get<ApiResponse<PagedOnSiteTaskResult>>(
      `${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data.data!;
  }

  // Get specific task by ID
  async getOnSiteTaskById(id: number): Promise<OnSiteTaskViewModel> {
    const response = await apiClient.get<ApiResponse<OnSiteTaskViewModel>>(
      `${this.baseUrl}/get/${id}`
    );
    return response.data.data!;
  }

  // Create new on-site task
  async createOnSiteTask(
    taskData: OnSiteTaskInput
  ): Promise<OnSiteTaskViewModel> {
    const response = await apiClient.post<ApiResponse<OnSiteTaskViewModel>>(
      `${this.baseUrl}/add`,
      taskData
    );
    return response.data.data!;
  }

  // Update existing on-site task
  async updateOnSiteTask(
    id: number,
    taskData: OnSiteTaskUpdate
  ): Promise<OnSiteTaskViewModel> {
    const response = await apiClient.put<ApiResponse<OnSiteTaskViewModel>>(
      `${this.baseUrl}/update/${id}`,
      taskData
    );
    return response.data.data!;
  }

  // Get tasks for a specific event
  async getTasksByEvent(
    eventId: number,
    pageNumber: number = 1,
    pageSize: number = 50
  ): Promise<PagedOnSiteTaskResult> {
    const response = await apiClient.get<ApiResponse<PagedOnSiteTaskResult>>(
      `${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}&eventId=${eventId}`
    );
    return response.data.data!;
  }

  // Get tasks assigned to current volunteer (for volunteer view)
  async getMyTasks(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PagedOnSiteTaskResult> {
    const response = await apiClient.get<ApiResponse<PagedOnSiteTaskResult>>(
      `${this.baseUrl}/my-tasks?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data.data!;
  }

  // Assign volunteer to task
  async assignVolunteerToTask(
    taskId: number,
    volunteerId: number
  ): Promise<TaskAssignment> {
    const response = await apiClient.post<ApiResponse<TaskAssignment>>(
      `${this.baseUrl}/${taskId}/assign`,
      { volunteerId }
    );
    return response.data.data!;
  }

  // Update task status
  async updateTaskStatus(
    taskId: number,
    statusId: number
  ): Promise<OnSiteTaskViewModel> {
    const response = await apiClient.patch<ApiResponse<OnSiteTaskViewModel>>(
      `${this.baseUrl}/${taskId}/status`,
      { statusId }
    );
    return response.data.data!;
  }

  // Mark task as completed
  async completeTask(
    taskId: number,
    notes?: string,
    actualHours?: number
  ): Promise<OnSiteTaskViewModel> {
    const response = await apiClient.patch<ApiResponse<OnSiteTaskViewModel>>(
      `${this.baseUrl}/${taskId}/complete`,
      { notes, actualHours }
    );
    return response.data.data!;
  }

  // Verify completed task (for coordinators)
  async verifyTask(
    taskId: number,
    verified: boolean,
    notes?: string
  ): Promise<OnSiteTaskViewModel> {
    const response = await apiClient.patch<ApiResponse<OnSiteTaskViewModel>>(
      `${this.baseUrl}/${taskId}/verify`,
      { verified, notes }
    );
    return response.data.data!;
  }
}

export const onSiteTaskService = new OnSiteTaskService();
