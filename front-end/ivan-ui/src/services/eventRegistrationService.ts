import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  RegistrationRequestDTO,
  RegistrationDTO,
  RegistrationStatusDTO,
  ApproveRegistrationRequestDTO,
  RejectRegistrationRequestDTO,
} from "../types/eventRegistration";

class EventRegistrationService {
  private readonly baseUrl = "/events";

  // Volunteer endpoints
  async registerForEvent(
    eventId: number,
    request: RegistrationRequestDTO
  ): Promise<RegistrationDTO> {
    const response = await apiClient.post<RegistrationDTO>(
      `${this.baseUrl}/${eventId}/registrations`,
      request
    );
    return response.data!;
  }

  async updateRegistration(
    eventId: number,
    registrationId: number,
    request: RegistrationRequestDTO
  ): Promise<void> {
    await apiClient.put(
      `${this.baseUrl}/${eventId}/registrations/${registrationId}`,
      request
    );
  }

  async cancelRegistration(
    eventId: number,
    registrationId: number
  ): Promise<void> {
    await apiClient.delete(
      `${this.baseUrl}/${eventId}/registrations/${registrationId}`
    );
  }

  async getRegistrationStatus(
    eventId: number,
    registrationId: number
  ): Promise<RegistrationStatusDTO> {
    const response = await apiClient.get<RegistrationStatusDTO>(
      `${this.baseUrl}/${eventId}/registrations/${registrationId}/status`
    );
    return response.data!;
  }

  // Organization/Coordinator endpoints
  async getEventRegistrations(
    eventId: number,
    status?: string,
    page: number = 1,
    size: number = 20
  ): Promise<PagedResultDto<RegistrationDTO>> {
    const params = { status, page, size };
    const response = await apiClient.get<PagedResultDto<RegistrationDTO>>(
      `${this.baseUrl}/${eventId}/registrations`,
      params
    );
    return response.data!;
  }

  async getRegistration(
    eventId: number,
    registrationId: number
  ): Promise<RegistrationDTO> {
    const response = await apiClient.get<RegistrationDTO>(
      `${this.baseUrl}/${eventId}/registrations/${registrationId}`
    );
    return response.data!;
  }

  // Check if current user can register for an event
  async canRegisterForEvent(eventId: number): Promise<boolean> {
    try {
      // Try to register with minimal data to check if registration is possible
      // This is a workaround since we don't have a dedicated endpoint
      return true; // For now, assume they can register
    } catch (error) {
      return false;
    }
  }

  async approveRegistration(
    eventId: number,
    registrationId: number,
    request: ApproveRegistrationRequestDTO
  ): Promise<void> {
    await apiClient.patch(
      `${this.baseUrl}/${eventId}/registrations/${registrationId}/approve`,
      request
    );
  }

  async rejectRegistration(
    eventId: number,
    registrationId: number,
    request: RejectRegistrationRequestDTO
  ): Promise<void> {
    await apiClient.patch(
      `${this.baseUrl}/${eventId}/registrations/${registrationId}/reject`,
      request
    );
  }

  // Get registrations for the current volunteer
  async getRegistrationsByVolunteer(
    volunteerId: number,
    filters: { page?: number; size?: number; status?: string } = {}
  ): Promise<PagedResultDto<RegistrationDTO>> {
    const params = {
      page: filters.page || 1,
      size: filters.size || 20,
      ...(filters.status && { status: filters.status }),
    };
    const response = await apiClient.get<PagedResultDto<RegistrationDTO>>(
      `/api/volunteer/registrations`,
      params
    );
    return response.data!;
  }

  // Utility methods for validation
  validateRegistrationRequest(request: RegistrationRequestDTO): string[] {
    const errors: string[] = [];

    if (request.additionalInfo && request.additionalInfo.length > 1000) {
      errors.push("Additional info cannot exceed 1000 characters");
    }

    if (request.motivationLetter && request.motivationLetter.length > 2000) {
      errors.push("Motivation letter cannot exceed 2000 characters");
    }

    return errors;
  }

  validateRejectRequest(request: RejectRegistrationRequestDTO): string[] {
    const errors: string[] = [];

    if (!request.reason || request.reason.trim() === "") {
      errors.push("Rejection reason is required");
    }

    if (request.reason && request.reason.length > 500) {
      errors.push("Reason cannot exceed 500 characters");
    }

    return errors;
  }
}

export const eventRegistrationService = new EventRegistrationService();
export default eventRegistrationService;
