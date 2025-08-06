import { publicContentService } from "@/services/publicContentService";
import { useData } from "@/hooks/useData";
import type {
  PublicEvent,
  PublicOrganization,
  PublicVolunteer,
  PublicPartner,
  PublicOrganizationFilters,
  PublicEventFilters,
  PublicPartnerFilters,
  PublicVolunteerFilters,
  PagedResult,
} from "@/types/publicContent";

/**
 * Service adapter for Public Events to work with useData hook
 */
export const publicEventsDataService = {
  /**
   * Get all public events with pagination - adapted for useData
   */
  getAll: async (filters?: PublicEventFilters): Promise<PublicEvent[]> => {
    const defaultFilters: PublicEventFilters = {
      page: 1,
      size: 12,
      ...filters,
    };

    const result = await publicContentService.getPublicEvents(defaultFilters);
    return result.items;
  },

  /**
   * Get paginated events - for complex pagination scenarios
   */
  getAllPaginated: async (
    filters?: PublicEventFilters
  ): Promise<PagedResult<PublicEvent>> => {
    const defaultFilters: PublicEventFilters = {
      page: 1,
      size: 12,
      ...filters,
    };

    return await publicContentService.getPublicEvents(defaultFilters);
  },

  /**
   * Get single event by ID - adapted for useData
   */
  getById: async (eventId: number | string): Promise<PublicEvent> => {
    const numericId =
      typeof eventId === "string" ? parseInt(eventId, 10) : eventId;
    return await publicContentService.getPublicEvent(numericId);
  },

  /**
   * Public content is read-only, no create operation
   */
  create: async (): Promise<PublicEvent> => {
    throw new Error("Public events are read-only");
  },

  /**
   * Public content is read-only, no update operation
   */
  update: async (): Promise<PublicEvent> => {
    throw new Error("Public events are read-only");
  },

  /**
   * Public content is read-only, no delete operation
   */
  delete: async (): Promise<void> => {
    throw new Error("Public events are read-only");
  },
};

/**
 * Service adapter for Public Organizations to work with useData hook
 */
export const publicOrganizationsDataService = {
  /**
   * Get all public organizations with pagination - adapted for useData
   */
  getAll: async (
    filters?: PublicOrganizationFilters
  ): Promise<PublicOrganization[]> => {
    const defaultFilters: PublicOrganizationFilters = {
      page: 1,
      size: 12,
      ...filters,
    };

    const result = await publicContentService.getPublicOrganizations(
      defaultFilters
    );
    return result.items;
  },

  /**
   * Get paginated organizations - for complex pagination scenarios
   */
  getAllPaginated: async (
    filters?: PublicOrganizationFilters
  ): Promise<PagedResult<PublicOrganization>> => {
    const defaultFilters: PublicOrganizationFilters = {
      page: 1,
      size: 12,
      ...filters,
    };

    return await publicContentService.getPublicOrganizations(defaultFilters);
  },

  /**
   * Get single organization by ID - adapted for useData
   */
  getById: async (orgId: number | string): Promise<PublicOrganization> => {
    const numericId = typeof orgId === "string" ? parseInt(orgId, 10) : orgId;
    return await publicContentService.getPublicOrganization(numericId);
  },

  /**
   * Public content is read-only, no create operation
   */
  create: async (): Promise<PublicOrganization> => {
    throw new Error("Public organizations are read-only");
  },

  /**
   * Public content is read-only, no update operation
   */
  update: async (): Promise<PublicOrganization> => {
    throw new Error("Public organizations are read-only");
  },

  /**
   * Public content is read-only, no delete operation
   */
  delete: async (): Promise<void> => {
    throw new Error("Public organizations are read-only");
  },
};

/**
 * Service adapter for Public Volunteers to work with useData hook
 */
export const publicVolunteersDataService = {
  /**
   * Get all public volunteers with pagination - adapted for useData
   */
  getAll: async (
    filters?: PublicVolunteerFilters
  ): Promise<PublicVolunteer[]> => {
    const defaultFilters: PublicVolunteerFilters = {
      page: 1,
      size: 12,
      ...filters,
    };

    const result = await publicContentService.getPublicVolunteers(
      defaultFilters
    );
    return result.items;
  },

  /**
   * Get paginated volunteers - for complex pagination scenarios
   */
  getAllPaginated: async (
    filters?: PublicVolunteerFilters
  ): Promise<PagedResult<PublicVolunteer>> => {
    const defaultFilters: PublicVolunteerFilters = {
      page: 1,
      size: 12,
      ...filters,
    };

    return await publicContentService.getPublicVolunteers(defaultFilters);
  },

  /**
   * Get single volunteer by ID - adapted for useData
   */
  getById: async (volunteerId: number | string): Promise<PublicVolunteer> => {
    const numericId =
      typeof volunteerId === "string" ? parseInt(volunteerId, 10) : volunteerId;
    return await publicContentService.getPublicVolunteer(numericId);
  },

  /**
   * Public content is read-only, no create operation
   */
  create: async (): Promise<PublicVolunteer> => {
    throw new Error("Public volunteers are read-only");
  },

  /**
   * Public content is read-only, no update operation
   */
  update: async (): Promise<PublicVolunteer> => {
    throw new Error("Public volunteers are read-only");
  },

  /**
   * Public content is read-only, no delete operation
   */
  delete: async (): Promise<void> => {
    throw new Error("Public volunteers are read-only");
  },
};

/**
 * Service adapter for Public Partners to work with useData hook
 */
export const publicPartnersDataService = {
  /**
   * Get all public partners with pagination - adapted for useData
   */
  getAll: async (filters?: PublicPartnerFilters): Promise<PublicPartner[]> => {
    const defaultFilters: PublicPartnerFilters = {
      page: 1,
      size: 12,
      ...filters,
    };

    const result = await publicContentService.getPublicPartners(defaultFilters);
    return result.items;
  },

  /**
   * Get paginated partners - for complex pagination scenarios
   */
  getAllPaginated: async (
    filters?: PublicPartnerFilters
  ): Promise<PagedResult<PublicPartner>> => {
    const defaultFilters: PublicPartnerFilters = {
      page: 1,
      size: 12,
      ...filters,
    };

    return await publicContentService.getPublicPartners(defaultFilters);
  },

  /**
   * Get single partner by ID - adapted for useData
   */
  getById: async (partnerId: number | string): Promise<PublicPartner> => {
    const numericId =
      typeof partnerId === "string" ? parseInt(partnerId, 10) : partnerId;
    return await publicContentService.getPublicPartner(numericId);
  },

  /**
   * Public content is read-only, no create operation
   */
  create: async (): Promise<PublicPartner> => {
    throw new Error("Public partners are read-only");
  },

  /**
   * Public content is read-only, no update operation
   */
  update: async (): Promise<PublicPartner> => {
    throw new Error("Public partners are read-only");
  },

  /**
   * Public content is read-only, no delete operation
   */
  delete: async (): Promise<void> => {
    throw new Error("Public partners are read-only");
  },
};

/**
 * Hook for Public Events data management using useData
 * This replaces part of the complex PublicContentContext
 *
 * Usage:
 * const events = usePublicEventsData();
 *
 * useEffect(() => {
 *   events.loadAll();
 * }, []);
 */
export function usePublicEventsData() {
  return useData<PublicEvent, never, never>(publicEventsDataService);
}

/**
 * Hook for Public Events Pagination
 */
export function usePublicEventsPagination() {
  const { loadAll, ...rest } = useData<PagedResult<PublicEvent>, never, never>({
    getAll: async (
      filters?: PublicEventFilters
    ): Promise<PagedResult<PublicEvent>[]> => {
      const result = await publicEventsDataService.getAllPaginated(filters);
      return [result]; // Wrap in array since useData expects arrays
    },
    create: async () => {
      throw new Error("Not supported");
    },
    update: async () => {
      throw new Error("Not supported");
    },
    delete: async () => {
      throw new Error("Not supported");
    },
  });

  return {
    loadAll: () => loadAll(),
    loadWithFilters: (filters?: PublicEventFilters) => {
      const serviceWithFilters = {
        getAll: async (): Promise<PagedResult<PublicEvent>[]> => {
          const result = await publicEventsDataService.getAllPaginated(filters);
          return [result];
        },
        create: async () => {
          throw new Error("Not supported");
        },
        update: async () => {
          throw new Error("Not supported");
        },
        delete: async () => {
          throw new Error("Not supported");
        },
      };
      return serviceWithFilters.getAll();
    },
    ...rest,
  };
}

/**
 * Hook for Public Organizations data management using useData
 */
export function usePublicOrganizationsData() {
  return useData<PublicOrganization, never, never>(
    publicOrganizationsDataService
  );
}

/**
 * Hook for Public Organizations Pagination
 */
export function usePublicOrganizationsPagination() {
  const { loadAll, ...rest } = useData<
    PagedResult<PublicOrganization>,
    never,
    never
  >({
    getAll: async (
      filters?: PublicOrganizationFilters
    ): Promise<PagedResult<PublicOrganization>[]> => {
      const result = await publicOrganizationsDataService.getAllPaginated(
        filters
      );
      return [result];
    },
    create: async () => {
      throw new Error("Not supported");
    },
    update: async () => {
      throw new Error("Not supported");
    },
    delete: async () => {
      throw new Error("Not supported");
    },
  });

  return {
    loadAll: () => loadAll(),
    loadWithFilters: (filters?: PublicOrganizationFilters) => {
      const serviceWithFilters = {
        getAll: async (): Promise<PagedResult<PublicOrganization>[]> => {
          const result = await publicOrganizationsDataService.getAllPaginated(
            filters
          );
          return [result];
        },
        create: async () => {
          throw new Error("Not supported");
        },
        update: async () => {
          throw new Error("Not supported");
        },
        delete: async () => {
          throw new Error("Not supported");
        },
      };
      return serviceWithFilters.getAll();
    },
    ...rest,
  };
}

/**
 * Hook for Public Volunteers data management using useData
 */
export function usePublicVolunteersData() {
  return useData<PublicVolunteer, never, never>(publicVolunteersDataService);
}

/**
 * Hook for Public Volunteers Pagination
 */
export function usePublicVolunteersPagination() {
  const { loadAll, ...rest } = useData<
    PagedResult<PublicVolunteer>,
    never,
    never
  >({
    getAll: async (
      filters?: PublicVolunteerFilters
    ): Promise<PagedResult<PublicVolunteer>[]> => {
      const result = await publicVolunteersDataService.getAllPaginated(filters);
      return [result];
    },
    create: async () => {
      throw new Error("Not supported");
    },
    update: async () => {
      throw new Error("Not supported");
    },
    delete: async () => {
      throw new Error("Not supported");
    },
  });

  return {
    loadAll: () => loadAll(),
    loadWithFilters: (filters?: PublicVolunteerFilters) => {
      const serviceWithFilters = {
        getAll: async (): Promise<PagedResult<PublicVolunteer>[]> => {
          const result = await publicVolunteersDataService.getAllPaginated(
            filters
          );
          return [result];
        },
        create: async () => {
          throw new Error("Not supported");
        },
        update: async () => {
          throw new Error("Not supported");
        },
        delete: async () => {
          throw new Error("Not supported");
        },
      };
      return serviceWithFilters.getAll();
    },
    ...rest,
  };
}

/**
 * Hook for Public Partners data management using useData
 */
export function usePublicPartnersData() {
  return useData<PublicPartner, never, never>(publicPartnersDataService);
}

/**
 * Hook for Public Partners Pagination
 */
export function usePublicPartnersPagination() {
  const { loadAll, ...rest } = useData<
    PagedResult<PublicPartner>,
    never,
    never
  >({
    getAll: async (
      filters?: PublicPartnerFilters
    ): Promise<PagedResult<PublicPartner>[]> => {
      const result = await publicPartnersDataService.getAllPaginated(filters);
      return [result];
    },
    create: async () => {
      throw new Error("Not supported");
    },
    update: async () => {
      throw new Error("Not supported");
    },
    delete: async () => {
      throw new Error("Not supported");
    },
  });

  return {
    loadAll: () => loadAll(),
    loadWithFilters: (filters?: PublicPartnerFilters) => {
      const serviceWithFilters = {
        getAll: async (): Promise<PagedResult<PublicPartner>[]> => {
          const result = await publicPartnersDataService.getAllPaginated(
            filters
          );
          return [result];
        },
        create: async () => {
          throw new Error("Not supported");
        },
        update: async () => {
          throw new Error("Not supported");
        },
        delete: async () => {
          throw new Error("Not supported");
        },
      };
      return serviceWithFilters.getAll();
    },
    ...rest,
  };
}

/**
 * Composite hook for all public content data
 * This can replace the entire PublicContentContext in simpler cases
 *
 * Usage:
 * const { events, organizations, volunteers, partners } = usePublicContentData();
 *
 * useEffect(() => {
 *   events.loadAll();
 *   organizations.loadAll();
 *   volunteers.loadAll();
 *   partners.loadAll();
 * }, []);
 */
export function usePublicContentData() {
  const events = usePublicEventsData();
  const organizations = usePublicOrganizationsData();
  const volunteers = usePublicVolunteersData();
  const partners = usePublicPartnersData();

  return {
    events,
    organizations,
    volunteers,
    partners,
  };
}

/**
 * Helper selectors for public content
 */
export const publicContentSelectors = {
  // Events
  hasEvents: (events: PublicEvent[]) => events.length > 0,
  getEventById: (events: PublicEvent[], eventId: number) =>
    events.find((e) => e.eventId === eventId),
  filterEventsByStatus: (events: PublicEvent[], status: string) =>
    status === "all" ? events : events.filter((e) => e.statusName === status),

  // Organizations
  hasOrganizations: (orgs: PublicOrganization[]) => orgs.length > 0,
  getOrganizationById: (orgs: PublicOrganization[], orgId: number) =>
    orgs.find((o) => o.organizationId === orgId),
  filterOrganizationsByProvince: (
    orgs: PublicOrganization[],
    province: string
  ) =>
    province === "all" ? orgs : orgs.filter((o) => o.province === province),

  // Volunteers
  hasVolunteers: (volunteers: PublicVolunteer[]) => volunteers.length > 0,
  getVolunteerById: (volunteers: PublicVolunteer[], volunteerId: number) =>
    volunteers.find((v) => v.volunteerId === volunteerId),
  filterVolunteersBySkill: (volunteers: PublicVolunteer[], skill: string) =>
    skill === "all"
      ? volunteers
      : volunteers.filter(
          (v) =>
            v.skills?.includes(skill) ||
            v.skillsList?.some((s: any) => s.skillName === skill)
        ),

  // Partners
  hasPartners: (partners: PublicPartner[]) => partners.length > 0,
  getPartnerById: (partners: PublicPartner[], partnerId: number) =>
    partners.find((p) => p.partnerId === partnerId),
  filterPartnersByIndustry: (partners: PublicPartner[], industry: string) =>
    industry === "all"
      ? partners
      : partners.filter((p) => p.industryName === industry),

  // Pagination helpers
  isFirstPage: (currentPage: number) => currentPage === 1,
  isLastPage: (currentPage: number, totalPages: number) =>
    currentPage >= totalPages,
  hasNextPage: (currentPage: number, totalPages: number) =>
    currentPage < totalPages,
  hasPrevPage: (currentPage: number) => currentPage > 1,
};
