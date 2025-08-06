import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type {
  VolunteerCoordinatorDto,
  VolunteerCoordinatorStatsDto,
  VolunteerCoordinatorFilterDto,
  VolunteerCoordinatorHierarchyDto,
  ManagementLevelDto,
  SpecializationDto,
  PagedResultDto,
  CreateVolunteerCoordinatorDto,
  UpdateVolunteerCoordinatorDto,
} from "../types/volunteer-coordinator";
import { volunteerCoordinatorService } from "../services/volunteerCoordinatorService";
import { useAuth } from "../hooks/useAuth";

interface VolunteerCoordinatorState {
  // Data
  coordinators: VolunteerCoordinatorDto[];
  currentCoordinator: VolunteerCoordinatorDto | null;
  stats: VolunteerCoordinatorStatsDto | null;
  hierarchy: VolunteerCoordinatorHierarchyDto[];
  managementLevels: ManagementLevelDto[];
  specializations: SpecializationDto[];
  availableManagers: VolunteerCoordinatorDto[];

  // Pagination & Filtering
  filters: VolunteerCoordinatorFilterDto;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };

  // UI State
  loading: boolean;
  error: string | null;
}

interface VolunteerCoordinatorContextType extends VolunteerCoordinatorState {
  // Coordinator CRUD
  loadCoordinators: () => Promise<void>;
  loadCoordinatorById: (coordinatorId: number) => Promise<void>;
  createCoordinator: (
    coordinatorData: CreateVolunteerCoordinatorDto
  ) => Promise<number>;
  updateCoordinator: (
    coordinatorId: number,
    coordinatorData: UpdateVolunteerCoordinatorDto
  ) => Promise<void>;
  deleteCoordinator: (coordinatorId: number) => Promise<void>;

  // Stats & Analytics
  loadStats: () => Promise<void>;

  // Hierarchy
  loadHierarchy: () => Promise<void>;

  // Lookup Data
  loadManagementLevels: () => Promise<void>;
  loadSpecializations: () => Promise<void>;
  loadAvailableManagers: () => Promise<void>;

  // Status Management
  toggleCoordinatorStatus: (coordinatorId: number) => Promise<void>;
  assignManager: (coordinatorId: number, managerId: number) => Promise<void>;
  removeManager: (coordinatorId: number) => Promise<void>;

  // Filters & Pagination
  setFilters: (filters: Partial<VolunteerCoordinatorFilterDto>) => void;
  resetFilters: () => void;

  // Utility
  clearError: () => void;
  setCurrentCoordinator: (coordinator: VolunteerCoordinatorDto | null) => void;
}

type VolunteerCoordinatorAction =
  | { type: "LOAD_START" }
  | {
      type: "LOAD_SUCCESS";
      payload: { coordinators: PagedResultDto<VolunteerCoordinatorDto> };
    }
  | { type: "LOAD_FAILURE"; payload: string }
  | { type: "SET_CURRENT_COORDINATOR"; payload: VolunteerCoordinatorDto | null }
  | { type: "SET_STATS"; payload: VolunteerCoordinatorStatsDto }
  | { type: "SET_HIERARCHY"; payload: VolunteerCoordinatorHierarchyDto[] }
  | { type: "SET_MANAGEMENT_LEVELS"; payload: ManagementLevelDto[] }
  | { type: "SET_SPECIALIZATIONS"; payload: SpecializationDto[] }
  | { type: "SET_AVAILABLE_MANAGERS"; payload: VolunteerCoordinatorDto[] }
  | { type: "SET_FILTERS"; payload: Partial<VolunteerCoordinatorFilterDto> }
  | { type: "RESET_FILTERS" }
  | { type: "ADD_COORDINATOR"; payload: VolunteerCoordinatorDto }
  | {
      type: "UPDATE_COORDINATOR";
      payload: {
        coordinatorId: number;
        updates: Partial<VolunteerCoordinatorDto>;
      };
    }
  | { type: "REMOVE_COORDINATOR"; payload: number }
  | { type: "CLEAR_ERROR" };

const defaultFilters: VolunteerCoordinatorFilterDto = {
  page: 1,
  size: 20,
  sortBy: "fullName",
  sortDirection: "asc",
};

const initialState: VolunteerCoordinatorState = {
  coordinators: [],
  currentCoordinator: null,
  stats: null,
  hierarchy: [],
  managementLevels: [],
  specializations: [],
  availableManagers: [],
  filters: defaultFilters,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    pageSize: 20,
  },
  loading: false,
  error: null,
};

const volunteerCoordinatorReducer = (
  state: VolunteerCoordinatorState,
  action: VolunteerCoordinatorAction
): VolunteerCoordinatorState => {
  switch (action.type) {
    case "LOAD_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "LOAD_SUCCESS":
      return {
        ...state,
        loading: false,
        coordinators: action.payload.coordinators.items,
        pagination: {
          currentPage: action.payload.coordinators.pageNumber,
          totalPages: action.payload.coordinators.totalPages,
          totalCount: action.payload.coordinators.totalCount,
          pageSize: action.payload.coordinators.pageSize,
        },
      };

    case "LOAD_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "SET_CURRENT_COORDINATOR":
      return {
        ...state,
        currentCoordinator: action.payload,
      };

    case "SET_STATS":
      return {
        ...state,
        stats: action.payload,
      };

    case "SET_HIERARCHY":
      return {
        ...state,
        hierarchy: action.payload,
      };

    case "SET_MANAGEMENT_LEVELS":
      return {
        ...state,
        managementLevels: action.payload,
      };

    case "SET_SPECIALIZATIONS":
      return {
        ...state,
        specializations: action.payload,
      };

    case "SET_AVAILABLE_MANAGERS":
      return {
        ...state,
        availableManagers: action.payload,
      };

    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case "RESET_FILTERS":
      return {
        ...state,
        filters: defaultFilters,
      };

    case "ADD_COORDINATOR":
      return {
        ...state,
        coordinators: [action.payload, ...state.coordinators],
        pagination: {
          ...state.pagination,
          totalCount: state.pagination.totalCount + 1,
        },
      };

    case "UPDATE_COORDINATOR":
      return {
        ...state,
        coordinators: state.coordinators.map((coordinator) =>
          coordinator.coordinatorId === action.payload.coordinatorId
            ? { ...coordinator, ...action.payload.updates }
            : coordinator
        ),
        currentCoordinator:
          state.currentCoordinator?.coordinatorId ===
          action.payload.coordinatorId
            ? { ...state.currentCoordinator, ...action.payload.updates }
            : state.currentCoordinator,
      };

    case "REMOVE_COORDINATOR":
      return {
        ...state,
        coordinators: state.coordinators.filter(
          (coordinator) => coordinator.coordinatorId !== action.payload
        ),
        currentCoordinator:
          state.currentCoordinator?.coordinatorId === action.payload
            ? null
            : state.currentCoordinator,
        pagination: {
          ...state.pagination,
          totalCount: state.pagination.totalCount - 1,
        },
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

const VolunteerCoordinatorContext = createContext<
  VolunteerCoordinatorContextType | undefined
>(undefined);

export const useVolunteerCoordinator = (): VolunteerCoordinatorContextType => {
  const context = useContext(VolunteerCoordinatorContext);
  if (context === undefined) {
    throw new Error(
      "useVolunteerCoordinator must be used within a VolunteerCoordinatorProvider"
    );
  }
  return context;
};

interface VolunteerCoordinatorProviderProps {
  children: ReactNode;
}

export const VolunteerCoordinatorProvider: React.FC<
  VolunteerCoordinatorProviderProps
> = ({ children }) => {
  const [state, dispatch] = useReducer(
    volunteerCoordinatorReducer,
    initialState
  );
  const { isAuthenticated, user } = useAuth();

  const loadCoordinators = async () => {
    try {
      dispatch({ type: "LOAD_START" });
      const coordinatorsData =
        await volunteerCoordinatorService.getOrganizationCoordinators(
          state.filters
        );
      dispatch({
        type: "LOAD_SUCCESS",
        payload: { coordinators: coordinatorsData },
      });
    } catch (error) {
      dispatch({
        type: "LOAD_FAILURE",
        payload:
          error instanceof Error
            ? error.message
            : "Failed to load coordinators",
      });
    }
  };

  const loadCoordinatorById = async (coordinatorId: number) => {
    try {
      const coordinator = await volunteerCoordinatorService.getCoordinatorById(
        coordinatorId
      );
      dispatch({
        type: "SET_CURRENT_COORDINATOR",
        payload: coordinator,
      });
    } catch (error) {
      dispatch({
        type: "LOAD_FAILURE",
        payload:
          error instanceof Error
            ? error.message
            : "Failed to load coordinator details",
      });
    }
  };

  const createCoordinator = async (
    coordinatorData: CreateVolunteerCoordinatorDto
  ): Promise<number> => {
    try {
      const coordinatorId = await volunteerCoordinatorService.createCoordinator(
        coordinatorData
      );

      // Load the created coordinator to add to state
      const newCoordinator =
        await volunteerCoordinatorService.getCoordinatorById(coordinatorId);
      dispatch({
        type: "ADD_COORDINATOR",
        payload: newCoordinator,
      });

      return coordinatorId;
    } catch (error) {
      dispatch({
        type: "LOAD_FAILURE",
        payload:
          error instanceof Error
            ? error.message
            : "Failed to create coordinator",
      });
      throw error;
    }
  };

  const updateCoordinator = async (
    coordinatorId: number,
    coordinatorData: UpdateVolunteerCoordinatorDto
  ) => {
    try {
      await volunteerCoordinatorService.updateCoordinator(
        coordinatorId,
        coordinatorData
      );

      // Update the coordinator in state
      dispatch({
        type: "UPDATE_COORDINATOR",
        payload: { coordinatorId, updates: coordinatorData },
      });
    } catch (error) {
      dispatch({
        type: "LOAD_FAILURE",
        payload:
          error instanceof Error
            ? error.message
            : "Failed to update coordinator",
      });
      throw error;
    }
  };

  const deleteCoordinator = async (coordinatorId: number) => {
    try {
      await volunteerCoordinatorService.deleteCoordinator(coordinatorId);
      dispatch({
        type: "REMOVE_COORDINATOR",
        payload: coordinatorId,
      });
    } catch (error) {
      dispatch({
        type: "LOAD_FAILURE",
        payload:
          error instanceof Error
            ? error.message
            : "Failed to delete coordinator",
      });
      throw error;
    }
  };

  const loadStats = async () => {
    try {
      const stats = await volunteerCoordinatorService.getCoordinatorStats();
      dispatch({
        type: "SET_STATS",
        payload: stats,
      });
    } catch (error) {
      dispatch({
        type: "LOAD_FAILURE",
        payload:
          error instanceof Error ? error.message : "Failed to load stats",
      });
    }
  };

  const loadHierarchy = async () => {
    try {
      const hierarchy =
        await volunteerCoordinatorService.getCoordinatorHierarchy();
      dispatch({
        type: "SET_HIERARCHY",
        payload: hierarchy,
      });
    } catch (error) {
      dispatch({
        type: "LOAD_FAILURE",
        payload:
          error instanceof Error ? error.message : "Failed to load hierarchy",
      });
    }
  };

  const loadManagementLevels = async () => {
    try {
      const levels = await volunteerCoordinatorService.getManagementLevels();
      dispatch({
        type: "SET_MANAGEMENT_LEVELS",
        payload: levels,
      });
    } catch (error) {
      dispatch({
        type: "LOAD_FAILURE",
        payload:
          error instanceof Error
            ? error.message
            : "Failed to load management levels",
      });
    }
  };

  const loadSpecializations = async () => {
    try {
      const specializations =
        await volunteerCoordinatorService.getSpecializations();
      dispatch({
        type: "SET_SPECIALIZATIONS",
        payload: specializations,
      });
    } catch (error) {
      dispatch({
        type: "LOAD_FAILURE",
        payload:
          error instanceof Error
            ? error.message
            : "Failed to load specializations",
      });
    }
  };

  const loadAvailableManagers = async () => {
    try {
      const managers = await volunteerCoordinatorService.getAvailableManagers();
      dispatch({
        type: "SET_AVAILABLE_MANAGERS",
        payload: managers,
      });
    } catch (error) {
      dispatch({
        type: "LOAD_FAILURE",
        payload:
          error instanceof Error
            ? error.message
            : "Failed to load available managers",
      });
    }
  };

  const toggleCoordinatorStatus = async (coordinatorId: number) => {
    try {
      await volunteerCoordinatorService.toggleCoordinatorStatus(coordinatorId);

      // Toggle the status in state
      const coordinator = state.coordinators.find(
        (c) => c.coordinatorId === coordinatorId
      );
      if (coordinator) {
        dispatch({
          type: "UPDATE_COORDINATOR",
          payload: {
            coordinatorId,
            updates: { isActive: !coordinator.isActive },
          },
        });
      }
    } catch (error) {
      dispatch({
        type: "LOAD_FAILURE",
        payload:
          error instanceof Error
            ? error.message
            : "Failed to toggle coordinator status",
      });
      throw error;
    }
  };

  const assignManager = async (coordinatorId: number, managerId: number) => {
    try {
      await volunteerCoordinatorService.assignManager(coordinatorId, managerId);

      // Find manager name for UI update
      const manager = state.availableManagers.find(
        (m) => m.coordinatorId === managerId
      );
      dispatch({
        type: "UPDATE_COORDINATOR",
        payload: {
          coordinatorId,
          updates: {
            managerCoordinatorId: managerId,
            managerCoordinatorName: manager?.fullName,
          },
        },
      });
    } catch (error) {
      dispatch({
        type: "LOAD_FAILURE",
        payload:
          error instanceof Error ? error.message : "Failed to assign manager",
      });
      throw error;
    }
  };

  const removeManager = async (coordinatorId: number) => {
    try {
      await volunteerCoordinatorService.removeManager(coordinatorId);

      dispatch({
        type: "UPDATE_COORDINATOR",
        payload: {
          coordinatorId,
          updates: {
            managerCoordinatorId: undefined,
            managerCoordinatorName: undefined,
          },
        },
      });
    } catch (error) {
      dispatch({
        type: "LOAD_FAILURE",
        payload:
          error instanceof Error ? error.message : "Failed to remove manager",
      });
      throw error;
    }
  };

  const setFilters = (filters: Partial<VolunteerCoordinatorFilterDto>) => {
    dispatch({
      type: "SET_FILTERS",
      payload: filters,
    });
  };

  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const setCurrentCoordinator = (
    coordinator: VolunteerCoordinatorDto | null
  ) => {
    dispatch({
      type: "SET_CURRENT_COORDINATOR",
      payload: coordinator,
    });
  };

  // Auto-load data when filters change
  useEffect(() => {
    // Only load coordinators if user is authenticated and has organization role
    if (isAuthenticated && user?.role === "organization") {
      loadCoordinators();
    }
  }, [state.filters, isAuthenticated, user?.role]);

  const contextValue: VolunteerCoordinatorContextType = {
    ...state,
    loadCoordinators,
    loadCoordinatorById,
    createCoordinator,
    updateCoordinator,
    deleteCoordinator,
    loadStats,
    loadHierarchy,
    loadManagementLevels,
    loadSpecializations,
    loadAvailableManagers,
    toggleCoordinatorStatus,
    assignManager,
    removeManager,
    setFilters,
    resetFilters,
    clearError,
    setCurrentCoordinator,
  };

  return (
    <VolunteerCoordinatorContext.Provider value={contextValue}>
      {children}
    </VolunteerCoordinatorContext.Provider>
  );
};
