import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import { aiInstructionsService } from "@/services/aiInstructionsService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type {
  AiCustomInstructionDTO,
  AiCustomInstructionCreateDTO,
  AiCustomInstructionUpdateDTO,
  InstructionFormData,
  InstructionFilters,
} from "@/types/ai";

// State interface
interface AIInstructionsState {
  instructions: AiCustomInstructionDTO[];
  filteredInstructions: AiCustomInstructionDTO[];
  loading: boolean;
  error: string | null;

  // Filters and search
  filters: InstructionFilters;
  searchQuery: string;

  // Statistics
  stats: {
    total: number;
    active: number;
    inactive: number;
    recentlyModified: number;
  };

  // Modal states
  modals: {
    preview: {
      isOpen: boolean;
      data: InstructionFormData | AiCustomInstructionDTO | null;
    };
    builder: {
      isOpen: boolean;
      data: AiCustomInstructionCreateDTO | null;
    };
    testing: {
      isOpen: boolean;
      instruction: AiCustomInstructionDTO | null;
    };
    editing: {
      isOpen: boolean;
      instruction: AiCustomInstructionDTO | null;
    };
  };

  // View mode
  viewMode: "overview" | "builder" | "preview" | "testing";
}

// Action types
type AIInstructionsAction =
  | { type: "LOAD_START" }
  | {
      type: "LOAD_SUCCESS";
      payload: { instructions: AiCustomInstructionDTO[] };
    }
  | { type: "LOAD_FAILURE"; payload: string }
  | { type: "SET_FILTERS"; payload: Partial<InstructionFilters> }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "FILTER_INSTRUCTIONS" }
  | { type: "SET_STATS"; payload: AIInstructionsState["stats"] }
  | { type: "SET_VIEW_MODE"; payload: AIInstructionsState["viewMode"] }
  | {
      type: "OPEN_PREVIEW";
      payload: InstructionFormData | AiCustomInstructionDTO;
    }
  | { type: "OPEN_BUILDER"; payload?: AiCustomInstructionCreateDTO }
  | { type: "OPEN_TESTING"; payload: AiCustomInstructionDTO }
  | { type: "OPEN_EDITING"; payload: AiCustomInstructionDTO }
  | { type: "CLOSE_ALL_MODALS" }
  | { type: "ADD_INSTRUCTION"; payload: AiCustomInstructionDTO }
  | {
      type: "UPDATE_INSTRUCTION";
      payload: { id: number; updates: Partial<AiCustomInstructionDTO> };
    }
  | { type: "REMOVE_INSTRUCTION"; payload: number }
  | { type: "CLEAR_ERROR" };

// Initial state
const initialState: AIInstructionsState = {
  instructions: [],
  filteredInstructions: [],
  loading: false,
  error: null,
  filters: {},
  searchQuery: "",
  stats: {
    total: 0,
    active: 0,
    inactive: 0,
    recentlyModified: 0,
  },
  modals: {
    preview: { isOpen: false, data: null },
    builder: { isOpen: false, data: null },
    testing: { isOpen: false, instruction: null },
    editing: { isOpen: false, instruction: null },
  },
  viewMode: "overview",
};

// Reducer
function aiInstructionsReducer(
  state: AIInstructionsState,
  action: AIInstructionsAction
): AIInstructionsState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, loading: true, error: null };

    case "LOAD_SUCCESS":
      return {
        ...state,
        loading: false,
        instructions: action.payload.instructions,
        error: null,
      };

    case "LOAD_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
      };

    case "FILTER_INSTRUCTIONS":
      const { instructions, filters, searchQuery } = state;
      let filtered = [...instructions];

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (instruction) =>
            instruction.instructionName?.toLowerCase().includes(query) ||
            instruction.systemPrompt?.toLowerCase().includes(query) ||
            instruction.behaviorInstructions?.toLowerCase().includes(query)
        );
      }

      // Apply filters
      if (filters.isActive !== undefined) {
        filtered = filtered.filter(
          (instruction) => instruction.isActive === filters.isActive
        );
      }

      if (filters.searchQuery) {
        // This is handled above in the search query section
      }

      return {
        ...state,
        filteredInstructions: filtered,
      };

    case "SET_STATS":
      return {
        ...state,
        stats: action.payload,
      };

    case "SET_VIEW_MODE":
      return {
        ...state,
        viewMode: action.payload,
      };

    case "OPEN_PREVIEW":
      return {
        ...state,
        modals: {
          ...state.modals,
          preview: { isOpen: true, data: action.payload },
        },
      };

    case "OPEN_BUILDER":
      return {
        ...state,
        modals: {
          ...state.modals,
          builder: { isOpen: true, data: action.payload || null },
        },
      };

    case "OPEN_TESTING":
      return {
        ...state,
        modals: {
          ...state.modals,
          testing: { isOpen: true, instruction: action.payload },
        },
      };

    case "OPEN_EDITING":
      return {
        ...state,
        modals: {
          ...state.modals,
          editing: { isOpen: true, instruction: action.payload },
        },
      };

    case "CLOSE_ALL_MODALS":
      return {
        ...state,
        modals: {
          preview: { isOpen: false, data: null },
          builder: { isOpen: false, data: null },
          testing: { isOpen: false, instruction: null },
          editing: { isOpen: false, instruction: null },
        },
      };

    case "ADD_INSTRUCTION":
      const newInstructions = [action.payload, ...state.instructions];
      return {
        ...state,
        instructions: newInstructions,
        stats: {
          ...state.stats,
          total: state.stats.total + 1,
          active: action.payload.isActive
            ? state.stats.active + 1
            : state.stats.active,
        },
      };

    case "UPDATE_INSTRUCTION":
      const updatedInstructions = state.instructions.map((instruction) =>
        instruction.instructionId === action.payload.id
          ? { ...instruction, ...action.payload.updates }
          : instruction
      );
      return {
        ...state,
        instructions: updatedInstructions,
      };

    case "REMOVE_INSTRUCTION":
      const remainingInstructions = state.instructions.filter(
        (instruction) => instruction.instructionId !== action.payload
      );
      return {
        ...state,
        instructions: remainingInstructions,
        stats: {
          ...state.stats,
          total: state.stats.total - 1,
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
}

// Context interface
interface AIInstructionsContextType extends AIInstructionsState {
  // Data loading
  loadInstructions: () => Promise<void>;
  loadInstructionById: (id: number) => Promise<AiCustomInstructionDTO | null>;
  refreshInstructions: () => Promise<void>;

  // CRUD operations
  createInstruction: (
    data: AiCustomInstructionCreateDTO
  ) => Promise<AiCustomInstructionDTO>;
  updateInstruction: (
    id: number,
    data: AiCustomInstructionUpdateDTO
  ) => Promise<void>;
  deleteInstruction: (id: number) => Promise<void>;
  toggleInstructionStatus: (id: number) => Promise<void>;

  // Filtering and search
  setFilters: (filters: Partial<InstructionFilters>) => void;
  resetFilters: () => void;
  setSearchQuery: (query: string) => void;
  applyFilters: () => void;

  // Modal management
  openPreview: (data: InstructionFormData | AiCustomInstructionDTO) => void;
  openBuilder: (data?: AiCustomInstructionCreateDTO) => void;
  openTesting: (instruction: AiCustomInstructionDTO) => void;
  openEditing: (instruction: AiCustomInstructionDTO) => void;
  closeAllModals: () => void;

  // View management
  setViewMode: (mode: AIInstructionsState["viewMode"]) => void;

  // Utility
  clearError: () => void;
  calculateStats: () => void;
}

// Create context
const AIInstructionsContext = createContext<
  AIInstructionsContextType | undefined
>(undefined);

// Provider component
interface AIInstructionsProviderProps {
  children: ReactNode;
}

export const AIInstructionsProvider: React.FC<AIInstructionsProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(aiInstructionsReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Data loading functions
  const loadInstructions = async () => {
    try {
      dispatch({ type: "LOAD_START" });
      const instructions = await aiInstructionsService.getInstructions(true);
      dispatch({ type: "LOAD_SUCCESS", payload: { instructions } });
      calculateStatsFromInstructions(instructions);
      // Auto-apply filters after loading
      setTimeout(() => dispatch({ type: "FILTER_INSTRUCTIONS" }), 0);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load AI instructions";
      dispatch({ type: "LOAD_FAILURE", payload: errorMessage });
      toast.error("Không thể tải danh sách hướng dẫn AI");
    }
  };

  const loadInstructionById = async (
    id: number
  ): Promise<AiCustomInstructionDTO | null> => {
    try {
      // For now, find in loaded instructions or reload all
      let instruction = state.instructions.find((i) => i.instructionId === id);
      if (!instruction) {
        // If not found, reload all instructions and try again
        await loadInstructions();
        instruction = state.instructions.find((i) => i.instructionId === id);
      }
      return instruction || null;
    } catch (error) {
      console.error("Failed to load instruction:", error);
      toast.error("Không thể tải hướng dẫn AI");
      return null;
    }
  };

  const refreshInstructions = async () => {
    await loadInstructions();
  };

  // CRUD operations
  const createInstruction = async (
    data: AiCustomInstructionCreateDTO
  ): Promise<AiCustomInstructionDTO> => {
    try {
      const newInstruction = await aiInstructionsService.createInstruction(
        data
      );
      dispatch({ type: "ADD_INSTRUCTION", payload: newInstruction });
      toast.success("Tạo hướng dẫn AI thành công");
      return newInstruction;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create instruction";
      toast.error("Không thể tạo hướng dẫn AI");
      throw new Error(errorMessage);
    }
  };

  const updateInstruction = async (
    id: number,
    data: AiCustomInstructionUpdateDTO
  ) => {
    try {
      await aiInstructionsService.updateInstruction(id, data);
      dispatch({ type: "UPDATE_INSTRUCTION", payload: { id, updates: data } });
      toast.success("Cập nhật hướng dẫn AI thành công");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update instruction";
      toast.error("Không thể cập nhật hướng dẫn AI");
      throw new Error(errorMessage);
    }
  };

  const deleteInstruction = async (id: number) => {
    try {
      await aiInstructionsService.adminDeleteInstruction(id);
      dispatch({ type: "REMOVE_INSTRUCTION", payload: id });
      toast.success("Xóa hướng dẫn AI thành công");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete instruction";
      toast.error("Không thể xóa hướng dẫn AI");
      throw new Error(errorMessage);
    }
  };

  const toggleInstructionStatus = async (id: number) => {
    try {
      const instruction = state.instructions.find(
        (i) => i.instructionId === id
      );
      if (!instruction) return;

      // Use the service's toggle method instead of update
      await aiInstructionsService.toggleInstructionStatus(
        id,
        !instruction.isActive
      );

      // Update local state
      dispatch({
        type: "UPDATE_INSTRUCTION",
        payload: {
          id,
          updates: {
            isActive: !instruction.isActive,
          } as Partial<AiCustomInstructionDTO>,
        },
      });

      toast.success(
        `Đã ${!instruction.isActive ? "kích hoạt" : "vô hiệu hóa"} hướng dẫn AI`
      );
    } catch (error) {
      console.error("Failed to toggle instruction status:", error);
      toast.error("Không thể thay đổi trạng thái hướng dẫn AI");
    }
  };

  // Filtering and search
  const setFilters = (filters: Partial<InstructionFilters>) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
    // Auto-apply filters when they change
    setTimeout(() => dispatch({ type: "FILTER_INSTRUCTIONS" }), 0);
  };

  const resetFilters = () => {
    dispatch({ type: "SET_FILTERS", payload: {} });
    dispatch({ type: "SET_SEARCH_QUERY", payload: "" });
    setTimeout(() => dispatch({ type: "FILTER_INSTRUCTIONS" }), 0);
  };

  const setSearchQuery = (query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
    // Auto-apply filters when search changes
    setTimeout(() => dispatch({ type: "FILTER_INSTRUCTIONS" }), 0);
  };

  const applyFilters = () => {
    dispatch({ type: "FILTER_INSTRUCTIONS" });
  };

  // Modal management
  const openPreview = (data: InstructionFormData | AiCustomInstructionDTO) => {
    dispatch({ type: "OPEN_PREVIEW", payload: data });
  };

  const openBuilder = (data?: AiCustomInstructionCreateDTO) => {
    dispatch({ type: "OPEN_BUILDER", payload: data });
  };

  const openTesting = (instruction: AiCustomInstructionDTO) => {
    dispatch({ type: "OPEN_TESTING", payload: instruction });
  };

  const openEditing = (instruction: AiCustomInstructionDTO) => {
    dispatch({ type: "OPEN_EDITING", payload: instruction });
  };

  const closeAllModals = () => {
    dispatch({ type: "CLOSE_ALL_MODALS" });
  };

  // View management
  const setViewMode = (mode: AIInstructionsState["viewMode"]) => {
    dispatch({ type: "SET_VIEW_MODE", payload: mode });
  };

  // Utility functions
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const calculateStats = () => {
    calculateStatsFromInstructions(state.instructions);
  };

  const calculateStatsFromInstructions = (
    instructions: AiCustomInstructionDTO[]
  ) => {
    const total = instructions.length;
    const active = instructions.filter((i) => i.isActive).length;
    const inactive = total - active;

    // Calculate recently modified (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentlyModified = instructions.filter(
      (i) => new Date(i.updatedAt || i.createdAt) > weekAgo
    ).length;

    dispatch({
      type: "SET_STATS",
      payload: { total, active, inactive, recentlyModified },
    });
  };

  // Auto-load data when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      loadInstructions();
    }
  }, [isAuthenticated, user?.role]);

  // Auto-apply filters when instructions change
  useEffect(() => {
    if (state.instructions.length > 0) {
      dispatch({ type: "FILTER_INSTRUCTIONS" });
    }
  }, [state.instructions, state.filters, state.searchQuery]);

  const contextValue: AIInstructionsContextType = {
    ...state,
    loadInstructions,
    loadInstructionById,
    refreshInstructions,
    createInstruction,
    updateInstruction,
    deleteInstruction,
    toggleInstructionStatus,
    setFilters,
    resetFilters,
    setSearchQuery,
    applyFilters,
    openPreview,
    openBuilder,
    openTesting,
    openEditing,
    closeAllModals,
    setViewMode,
    clearError,
    calculateStats,
  };

  return (
    <AIInstructionsContext.Provider value={contextValue}>
      {children}
    </AIInstructionsContext.Provider>
  );
};

// Hook to use context
export const useAIInstructions = (): AIInstructionsContextType => {
  const context = useContext(AIInstructionsContext);
  if (context === undefined) {
    throw new Error(
      "useAIInstructions must be used within an AIInstructionsProvider"
    );
  }
  return context;
};

// Helper selectors
export const aiInstructionsSelectors = {
  hasInstructions: (instructions: AiCustomInstructionDTO[]) =>
    instructions.length > 0,
  getActiveInstructions: (instructions: AiCustomInstructionDTO[]) =>
    instructions.filter((i) => i.isActive),
  getInactiveInstructions: (instructions: AiCustomInstructionDTO[]) =>
    instructions.filter((i) => !i.isActive),
  getInstructionById: (instructions: AiCustomInstructionDTO[], id: number) =>
    instructions.find((i) => i.instructionId === id),
  getInstructionsByCategory: (
    instructions: AiCustomInstructionDTO[],
    searchTerm: string
  ) =>
    instructions.filter(
      (i) =>
        i.instructionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.systemPrompt.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  getRecentInstructions: (
    instructions: AiCustomInstructionDTO[],
    days: number = 7
  ) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return instructions.filter((i) => new Date(i.createdAt) > cutoff);
  },
};
