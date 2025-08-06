import { apiClient } from "./apiClient";
import type {
  PublicOrganization,
  PublicEvent,
  PublicPartner,
  PublicVolunteer,
  PublicOrganizationFilters,
  PublicEventFilters,
  PublicPartnerFilters,
  PublicVolunteerFilters,
  PagedResult,
} from "../types/publicContent";

/**
 * Public Content API Service
 * Handles all public content requests (organizations, events, partners)
 */
class PublicContentService {
  private readonly baseUrl = "/public";

  // Organizations
  async getPublicOrganizations(
    filters: PublicOrganizationFilters = {}
  ): Promise<PagedResult<PublicOrganization>> {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.typeId) params.append("typeId", filters.typeId.toString());
    if (filters.province) params.append("province", filters.province);
    if (filters.isVerified !== undefined)
      params.append("isVerified", filters.isVerified.toString());
    params.append("page", (filters.page || 1).toString());
    params.append("size", (filters.size || 20).toString());

    const response = await apiClient.get<PagedResult<PublicOrganization>>(
      `${this.baseUrl}/organizations?${params.toString()}`
    );
    return response.data;
  }

  async getPublicOrganization(id: number): Promise<PublicOrganization> {
    const response = await apiClient.get<PublicOrganization>(
      `${this.baseUrl}/organizations/${id}`
    );
    return response.data;
  }

  // Events
  async getPublicEvents(
    filters: PublicEventFilters = {}
  ): Promise<PagedResult<PublicEvent>> {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.categoryId)
      params.append("categoryId", filters.categoryId.toString());
    if (filters.organizationId)
      params.append("organizationId", filters.organizationId.toString());
    if (filters.province) params.append("province", filters.province);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    params.append("page", (filters.page || 1).toString());
    params.append("size", (filters.size || 20).toString());

    const response = await apiClient.get<PagedResult<PublicEvent>>(
      `${this.baseUrl}/events?${params.toString()}`
    );
    return response.data;
  }

  async getPublicEvent(id: number): Promise<PublicEvent> {
    const response = await apiClient.get<PublicEvent>(
      `${this.baseUrl}/events/${id}`
    );
    return response.data;
  }

  // Partners
  async getPublicPartners(
    filters: PublicPartnerFilters = {}
  ): Promise<PagedResult<PublicPartner>> {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.industryId)
      params.append("industryId", filters.industryId.toString());
    if (filters.province) params.append("province", filters.province);
    if (filters.isVerified !== undefined)
      params.append("isVerified", filters.isVerified.toString());
    params.append("page", (filters.page || 1).toString());
    params.append("size", (filters.size || 20).toString());

    const response = await apiClient.get<PagedResult<PublicPartner>>(
      `${this.baseUrl}/partners?${params.toString()}`
    );
    return response.data;
  }

  async getPublicPartner(id: number): Promise<PublicPartner> {
    const response = await apiClient.get<PublicPartner>(
      `${this.baseUrl}/partners/${id}`
    );
    return response.data;
  }

  // Volunteers
  async getPublicVolunteers(
    filters: PublicVolunteerFilters = {}
  ): Promise<PagedResult<PublicVolunteer>> {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.skillId) params.append("skillId", filters.skillId.toString());
    if (filters.university) params.append("university", filters.university);
    if (filters.province) params.append("province", filters.province);
    if (filters.isVerified !== undefined)
      params.append("isVerified", filters.isVerified.toString());
    params.append("page", (filters.page || 1).toString());
    params.append("size", (filters.size || 20).toString());

    const response = await apiClient.get<PagedResult<PublicVolunteer>>(
      `${this.baseUrl}/volunteers?${params.toString()}`
    );
    return response.data;
  }

  async getPublicVolunteer(id: number): Promise<PublicVolunteer> {
    const response = await apiClient.get<PublicVolunteer>(
      `${this.baseUrl}/volunteers/${id}`
    );
    return response.data;
  }
}

export const publicContentService = new PublicContentService();
