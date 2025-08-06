import { aiInstructionsService } from "@/services/aiInstructionsService";
import { useData } from "@/hooks/useData";
import type {
  AiCustomInstructionDTO,
  AiCustomInstructionCreateDTO,
  AiCustomInstructionUpdateDTO,
} from "@/types/ai";

/**
 * Service adapter for AI Instructions to work with useData hook
 * Adapts the existing aiInstructionsService to the useData service interface
 */
export const aiInstructionsDataService = {
  /**
   * Get all AI instructions - adapted for useData
   */
  getAll: async (): Promise<AiCustomInstructionDTO[]> => {
    // For now, assume admin access (we can make this dynamic later)
    return await aiInstructionsService.getInstructions(true);
  },

  /**
   * Create new instruction - adapted for useData
   */
  create: async (
    data: AiCustomInstructionCreateDTO
  ): Promise<AiCustomInstructionDTO> => {
    return await aiInstructionsService.createInstruction(data);
  },

  /**
   * Update instruction - adapted for useData
   */
  update: async (
    id: number | string,
    data: AiCustomInstructionUpdateDTO
  ): Promise<AiCustomInstructionDTO> => {
    const numericId = typeof id === "string" ? parseInt(id, 10) : id;
    return await aiInstructionsService.updateInstruction(numericId, data);
  },

  /**
   * Delete instruction - adapted for useData
   */
  delete: async (id: number | string): Promise<void> => {
    const numericId = typeof id === "string" ? parseInt(id, 10) : id;
    return await aiInstructionsService.adminDeleteInstruction(numericId);
  },
};

/**
 * Hook for AI Instructions data management using useData
 * This replaces the complex AIInstructionsContext with a simple hook
 *
 * Usage:
 * const instructions = useAiInstructionsData();
 *
 * useEffect(() => {
 *   instructions.loadAll();
 * }, []);
 *
 * return (
 *   <div>
 *     {instructions.loading && <Spinner />}
 *     {instructions.data.map(item => ...)}
 *     <button onClick={() => instructions.create(newData)}>Create</button>
 *   </div>
 * );
 */
export function useAiInstructionsData() {
  return useData<
    AiCustomInstructionDTO,
    AiCustomInstructionCreateDTO,
    AiCustomInstructionUpdateDTO
  >(aiInstructionsDataService, {
    successMessages: {
      create: "Tạo AI Instruction thành công",
      update: "Cập nhật AI Instruction thành công",
      delete: "Xóa AI Instruction thành công",
    },
  });
}
