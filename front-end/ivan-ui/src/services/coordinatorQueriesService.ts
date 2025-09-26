// Coordinator Queries Service - Matching backend CoordinatorQueriesController
import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  VolunteerBriefDto,
  EventBriefDto,
  CoordinatorQueryFilters,
} from "../types/coordinatorQueries";

class CoordinatorQueriesService {
  private readonly baseUrl = "/CoordinatorQueries";

  // GET /api/CoordinatorQueries/volunteers - Get volunteers of coordinator's organizations
  async getVolunteersOfMyOrganizations(
    filters: CoordinatorQueryFilters = { pageNumber: 1, pageSize: 20 }
  ): Promise<PagedResultDto<VolunteerBriefDto>> {
    const response = await apiClient.get<PagedResultDto<VolunteerBriefDto>>(
      `${this.baseUrl}/volunteers`,
      filters
    );

    if (!response.data) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    }

    // Handle .NET JSON serialization format
    const extractedData = apiClient.extractDataFromNetResponse(response.data);

    // If the entire response is wrapped, extract it
    if (
      extractedData &&
      typeof extractedData === "object" &&
      "items" in extractedData
    ) {
      const pagedResult = extractedData as PagedResultDto<VolunteerBriefDto>;
      // Also check if items is wrapped in $values
      if (
        pagedResult.items &&
        typeof pagedResult.items === "object" &&
        "$values" in pagedResult.items
      ) {
        pagedResult.items = (pagedResult.items as any).$values;
      }
      return pagedResult;
    }

    return extractedData as PagedResultDto<VolunteerBriefDto>;
  }

  // GET /api/CoordinatorQueries/events/completed - Get completed events of coordinator's organizations
  async getCompletedEventsOfMyOrganizations(
    filters: CoordinatorQueryFilters = { pageNumber: 1, pageSize: 20 }
  ): Promise<PagedResultDto<EventBriefDto>> {
    const response = await apiClient.get<PagedResultDto<EventBriefDto>>(
      `${this.baseUrl}/events/completed`,
      filters
    );

    if (!response.data) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    }

    // Handle .NET JSON serialization format
    const extractedData = apiClient.extractDataFromNetResponse(response.data);

    // If the entire response is wrapped, extract it
    if (
      extractedData &&
      typeof extractedData === "object" &&
      "items" in extractedData
    ) {
      const pagedResult = extractedData as PagedResultDto<EventBriefDto>;
      // Also check if items is wrapped in $values
      if (
        pagedResult.items &&
        typeof pagedResult.items === "object" &&
        "$values" in pagedResult.items
      ) {
        pagedResult.items = (pagedResult.items as any).$values;
      }
      return pagedResult;
    }

    return extractedData as PagedResultDto<EventBriefDto>;
  }

  // GET /api/CoordinatorQueries/events/ongoing - Get ongoing events of coordinator's organizations
  async getOngoingEventsOfMyOrganizations(
    filters: CoordinatorQueryFilters = { pageNumber: 1, pageSize: 20 }
  ): Promise<PagedResultDto<EventBriefDto>> {
    const response = await apiClient.get<PagedResultDto<EventBriefDto>>(
      `${this.baseUrl}/events/ongoing`,
      filters
    );

    if (!response.data) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    }

    // Handle .NET JSON serialization format
    const extractedData = apiClient.extractDataFromNetResponse(response.data);

    // If the entire response is wrapped, extract it
    if (
      extractedData &&
      typeof extractedData === "object" &&
      "items" in extractedData
    ) {
      const pagedResult = extractedData as PagedResultDto<EventBriefDto>;
      // Also check if items is wrapped in $values
      if (
        pagedResult.items &&
        typeof pagedResult.items === "object" &&
        "$values" in pagedResult.items
      ) {
        pagedResult.items = (pagedResult.items as any).$values;
      }
      return pagedResult;
    }

    return extractedData as PagedResultDto<EventBriefDto>;
  }

  // GET /api/CoordinatorQueries/events/all - Get all events of coordinator's organizations
  async getEventsOfMyOrganizations(
    filters: CoordinatorQueryFilters = { pageNumber: 1, pageSize: 20 }
  ): Promise<PagedResultDto<EventBriefDto>> {
    const response = await apiClient.get<PagedResultDto<EventBriefDto>>(
      `${this.baseUrl}/events/all`,
      filters
    );

    if (!response.data) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    }

    // Handle .NET JSON serialization format
    const extractedData = apiClient.extractDataFromNetResponse(response.data);

    // If the entire response is wrapped, extract it
    if (
      extractedData &&
      typeof extractedData === "object" &&
      "items" in extractedData
    ) {
      const pagedResult = extractedData as PagedResultDto<EventBriefDto>;
      // Also check if items is wrapped in $values
      if (
        pagedResult.items &&
        typeof pagedResult.items === "object" &&
        "$values" in pagedResult.items
      ) {
        pagedResult.items = (pagedResult.items as any).$values;
      }
      return pagedResult;
    }

    return extractedData as PagedResultDto<EventBriefDto>;
  }

  // GET /api/CoordinatorQueries/events/completed/{volunteerId}
  // Get completed events of coordinator's organizations that a specific volunteer joined
  async getCompletedEventsOfMyOrganizationsForVolunteer(
    volunteerId: number,
    filters: CoordinatorQueryFilters = { pageNumber: 1, pageSize: 20 }
  ): Promise<PagedResultDto<EventBriefDto>> {
    const response = await apiClient.get<PagedResultDto<EventBriefDto>>(
      `${this.baseUrl}/events/completed/${volunteerId}`,
      filters
    );

    if (!response.data) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    }

    // Handle .NET JSON serialization format
    const extractedData = apiClient.extractDataFromNetResponse(response.data);

    // If the entire response is wrapped, extract it
    if (
      extractedData &&
      typeof extractedData === "object" &&
      "items" in extractedData
    ) {
      const pagedResult = extractedData as PagedResultDto<EventBriefDto>;
      // Also check if items is wrapped in $values
      if (
        pagedResult.items &&
        typeof pagedResult.items === "object" &&
        "$values" in pagedResult.items
      ) {
        pagedResult.items = (pagedResult.items as any).$values;
      }
      return pagedResult;
    }

    return extractedData as PagedResultDto<EventBriefDto>;
  }

  // GET /api/CoordinatorQueries/events/ongoing/{volunteer}
  // Get ongoing events of coordinator's organizations that a specific volunteer joined
  async getOngoingEventsOfMyOrganizationsForVolunteer(
    volunteerId: number,
    filters: CoordinatorQueryFilters = { pageNumber: 1, pageSize: 20 }
  ): Promise<PagedResultDto<EventBriefDto>> {
    const response = await apiClient.get<PagedResultDto<EventBriefDto>>(
      `${this.baseUrl}/events/ongoing/${volunteerId}`,
      filters
    );

    if (!response.data) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    }

    // Handle .NET JSON serialization format
    const extractedData = apiClient.extractDataFromNetResponse(response.data);

    // If the entire response is wrapped, extract it
    if (
      extractedData &&
      typeof extractedData === "object" &&
      "items" in extractedData
    ) {
      const pagedResult = extractedData as PagedResultDto<EventBriefDto>;
      // Also check if items is wrapped in $values
      if (
        pagedResult.items &&
        typeof pagedResult.items === "object" &&
        "$values" in pagedResult.items
      ) {
        pagedResult.items = (pagedResult.items as any).$values;
      }
      return pagedResult;
    }

    return extractedData as PagedResultDto<EventBriefDto>;
  }

  // GET /api/CoordinatorQueries/events/all/{volunteer}
  // Get all events of coordinator's organizations that a specific volunteer joined
  async getAllEventsOfMyOrganizationsForVolunteer(
    volunteerId: number,
    filters: CoordinatorQueryFilters = { pageNumber: 1, pageSize: 20 }
  ): Promise<PagedResultDto<EventBriefDto>> {
    const response = await apiClient.get<PagedResultDto<EventBriefDto>>(
      `${this.baseUrl}/events/all/${volunteerId}`,
      filters
    );

    if (!response.data) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    }

    // Handle .NET JSON serialization format
    const extractedData = apiClient.extractDataFromNetResponse(response.data);

    // If the entire response is wrapped, extract it
    if (
      extractedData &&
      typeof extractedData === "object" &&
      "items" in extractedData
    ) {
      const pagedResult = extractedData as PagedResultDto<EventBriefDto>;
      // Also check if items is wrapped in $values
      if (
        pagedResult.items &&
        typeof pagedResult.items === "object" &&
        "$values" in pagedResult.items
      ) {
        pagedResult.items = (pagedResult.items as any).$values;
      }
      return pagedResult;
    }

    return extractedData as PagedResultDto<EventBriefDto>;
  }

  // Helper method to get all volunteers without pagination (for dropdowns)
  async getAllVolunteersOfMyOrganizations(): Promise<VolunteerBriefDto[]> {
    try {
      const result = await this.getVolunteersOfMyOrganizations({
        pageNumber: 1,
        pageSize: 1000, // Large page size to get all volunteers
      });
      return result.items || [];
    } catch (error) {
      console.error("Error fetching all volunteers:", error);
      return [];
    }
  }

  // Helper method to get all completed events without pagination (for dropdowns)
  async getAllCompletedEventsOfMyOrganizations(): Promise<EventBriefDto[]> {
    try {
      const result = await this.getCompletedEventsOfMyOrganizations({
        pageNumber: 1,
        pageSize: 1000, // Large page size to get all events
      });
      return result.items || [];
    } catch (error) {
      console.error("Error fetching all completed events:", error);
      return [];
    }
  }


  async getAllOngoingEventsOfMyOrganizations(): Promise<EventBriefDto[]> {
    try {
      const result = await this.getOngoingEventsOfMyOrganizations({
        pageNumber: 1,
        pageSize: 1000, // Large page size to get all events
      });
      return result.items || [];
    } catch (error) {
      console.error("Error fetching all ongoing events:", error);
      return [];
    }
  }


  async getAllEventsOfMyOrganizations(): Promise<EventBriefDto[]> {
    try {
      const result = await this.getEventsOfMyOrganizations({
        pageNumber: 1,
        pageSize: 1000, // Large page size to get all events
      });
      return result.items || [];
    } catch (error) {
      console.error("Error fetching all events:", error);
      return [];
    }
  }
}

export const coordinatorQueriesService = new CoordinatorQueriesService();
export default coordinatorQueriesService;
