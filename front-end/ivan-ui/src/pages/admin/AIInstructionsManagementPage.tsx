import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { aiInstructionsService } from "@/services/aiInstructionsService";
import type {
  AiCustomInstructionDTO,
  AiCustomInstructionCreateDTO,
  AiCustomInstructionUpdateDTO,
} from "@/types/ai";
import { UserRole } from "@/types/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/common/StatsCard";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import {
  DataTable,
  type TableColumn,
  type TableAction,
} from "@/components/common/DataTable";
import {
  Bot,
  Plus,
  Search,
  Trash2,
  Play,
  CheckCircle,
  XCircle,
  TrendingUp,
  Settings,
  BarChart3,
  Eye,
} from "lucide-react";
import CustomInstructionBuilder from "@/components/admin/ai-custom-instructions/CustomInstructionBuilder";
import TestingPlayground from "@/components/admin/ai-custom-instructions/TestingPlayground";
import InstructionPreview from "@/components/admin/ai-custom-instructions/InstructionPreview";

const AIInstructionsManagementPageContent: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  // Service adapter for AI Instructions
  const aiInstructionsDataService = {
    getAll: async (): Promise<AiCustomInstructionDTO[]> => {
      return await aiInstructionsService.getAllInstructions();
    },
    create: async (
      data: AiCustomInstructionCreateDTO
    ): Promise<AiCustomInstructionDTO> => {
      return await aiInstructionsService.createInstruction(data);
    },
    update: async (
      id: number | string,
      data: AiCustomInstructionUpdateDTO
    ): Promise<AiCustomInstructionDTO> => {
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;
      return await aiInstructionsService.updateInstruction(numericId, data);
    },
    delete: async (id: number | string): Promise<void> => {
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;
      return await aiInstructionsService.deleteInstruction(numericId);
    },
  };

  // Simple state management
  const [instructions, setInstructions] = useState<AiCustomInstructionDTO[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local UI state (much simpler than complex context state)
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "builder" | "testing"
  >("overview");
  const [selectedInstruction, setSelectedInstruction] =
    useState<AiCustomInstructionDTO | null>(null);
  const [previewInstruction, setPreviewInstruction] =
    useState<AiCustomInstructionDTO | null>(null);

  // Load data on mount
  useEffect(() => {
    if (isAdmin) {
      const loadInstructions = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await aiInstructionsDataService.getAll();
          setInstructions(result);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Không thể tải danh sách hướng dẫn"
          );
        } finally {
          setLoading(false);
        }
      };

      loadInstructions();
    }
  }, [isAdmin]);

  // Filter data locally
  const filteredInstructions = instructions.filter(
    (instruction: AiCustomInstructionDTO) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        instruction.instructionName.toLowerCase().includes(query) ||
        instruction.systemPrompt.toLowerCase().includes(query) ||
        instruction.behaviorInstructions?.toLowerCase().includes(query)
      );
    }
  );

  // Calculate stats locally
  const stats = {
    total: instructions.length,
    active: instructions.filter((i: AiCustomInstructionDTO) => i.isActive)
      .length,
    inactive: instructions.filter((i: AiCustomInstructionDTO) => !i.isActive)
      .length,
  };

  // Table columns definition
  const columns: TableColumn<AiCustomInstructionDTO>[] = [
    {
      key: "instructionName",
      header: "Tên",
      render: (value) => <div className="font-medium">{value}</div>,
    },
    {
      key: "systemPrompt",
      header: "System Prompt",
      render: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "behaviorInstructions",
      header: "Hướng dẫn hành vi",
      render: (value) => (
        <div className="max-w-xs" title={value}>
          <div className="truncate">
            {value
              ? value.replace(/\n/g, " • ").substring(0, 100) +
                (value.length > 100 ? "..." : "")
              : "Không có"}
          </div>
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Trạng thái",
      render: (value) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Hoạt động" : "Tạm dừng"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      render: (value) => new Date(value).toLocaleDateString("vi-VN"),
    },
  ];

  // Table actions
  const actions: TableAction<AiCustomInstructionDTO>[] = [
    {
      label: "Xem trước",
      icon: <Eye />,
      onClick: (instruction) => setPreviewInstruction(instruction),
      variant: "default",
    },
    {
      label: "Kiểm tra",
      icon: <Play />,
      onClick: (instruction) => {
        setSelectedInstruction(instruction);
        setActiveTab("testing");
      },
      variant: "outline",
    },
    {
      label: "Chỉnh sửa",
      icon: <Settings />,
      onClick: (instruction) => {
        setSelectedInstruction(instruction);
        setActiveTab("builder");
      },
      variant: "outline",
    },
    {
      label: "Xóa",
      icon: <Trash2 />,
      onClick: async (instruction) => {
        try {
          await aiInstructionsDataService.delete(instruction.instructionId);
          const result = await aiInstructionsDataService.getAll();
          setInstructions(result);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Không thể xóa hướng dẫn"
          );
        }
      },
      variant: "destructive",
    },
  ];

  // Auth check
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Bot className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Truy cập bị từ chối
          </h2>
          <p className="text-gray-600">
            Bạn cần quyền admin để truy cập trang quản lý AI Instructions.
          </p>
        </div>
      </div>
    );
  }

  // ✅ SIMPLE: Error handling
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Đã xảy ra lỗi
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-2">
            <Button onClick={() => setError(null)}>Thử lại</Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reload
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🤖 Quản lý AI Instructions
        </h1>
        <p className="text-gray-600">
          Quản lý các hướng dẫn tùy chỉnh cho AI Assistant
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          // Clear selected instruction when switching to create new mode
          if (value === "builder" && activeTab !== "builder") {
            setSelectedInstruction(null);
          }
          setActiveTab(value as any);
        }}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {selectedInstruction ? "Chỉnh sửa" : "Tạo mới"}
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Kiểm tra
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Tổng Instructions"
              value={stats.total}
              icon={TrendingUp}
            />
            <StatsCard
              title="Đang hoạt động"
              value={stats.active}
              icon={CheckCircle}
            />
            <StatsCard
              title="Không hoạt động"
              value={stats.inactive}
              icon={XCircle}
            />
          </div>

          {/* Search and Controls */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Danh sách Instructions</CardTitle>
                <Button onClick={() => setActiveTab("builder")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo mới
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm instructions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Loading State */}
              {loading && <LoadingState loading={true} />}

              {/* Empty State */}
              {!loading && instructions.length === 0 && (
                <EmptyState
                  icon={Bot}
                  title="Chưa có instructions nào"
                  description="Tạo instruction đầu tiên để bắt đầu"
                  show={true}
                />
              )}

              {/* Instructions Table */}
              {!loading && instructions.length > 0 && (
                <DataTable
                  data={filteredInstructions}
                  columns={columns}
                  actions={actions}
                  loading={false}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Builder Tab */}
        <TabsContent value="builder">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedInstruction
                  ? "Chỉnh sửa AI Instruction"
                  : "Tạo AI Instruction mới"}
              </CardTitle>
              <CardDescription>
                {selectedInstruction
                  ? "Chỉnh sửa hướng dẫn tùy chỉnh cho AI Assistant"
                  : "Tạo hướng dẫn tùy chỉnh cho AI Assistant"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomInstructionBuilder
                editingInstruction={selectedInstruction || undefined}
                onSave={async (data) => {
                  try {
                    if (selectedInstruction) {
                      // Update existing instruction
                      await aiInstructionsDataService.update(
                        selectedInstruction.instructionId,
                        data as AiCustomInstructionUpdateDTO
                      );
                    } else {
                      // Create new instruction
                      await aiInstructionsDataService.create(
                        data as AiCustomInstructionCreateDTO
                      );
                    }
                    // Refresh data
                    const result = await aiInstructionsDataService.getAll();
                    setInstructions(result);
                    setSelectedInstruction(null);
                    setActiveTab("overview");
                  } catch (err) {
                    setError(
                      err instanceof Error
                        ? err.message
                        : selectedInstruction
                        ? "Không thể cập nhật hướng dẫn"
                        : "Không thể tạo hướng dẫn mới"
                    );
                  }
                }}
                onCancel={() => {
                  setSelectedInstruction(null);
                  setActiveTab("overview");
                }}
                onPreview={() => {}}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testing Tab */}
        <TabsContent value="testing">
          <Card>
            <CardHeader>
              <CardTitle>Kiểm tra AI Instruction</CardTitle>
              <CardDescription>
                Test instruction với các query mẫu
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedInstruction ? (
                <TestingPlayground
                  instruction={selectedInstruction}
                  onClose={() => {
                    setSelectedInstruction(null);
                    setActiveTab("overview");
                  }}
                />
              ) : (
                <div className="text-center py-12">
                  <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Chọn instruction để kiểm tra
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Quay lại tab Tổng quan và chọn một instruction để kiểm tra
                    hoạt động
                  </p>
                  <Button onClick={() => setActiveTab("overview")}>
                    Về trang tổng quan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      {previewInstruction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-auto">
            <InstructionPreview
              data={previewInstruction}
              onClose={() => setPreviewInstruction(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

function AIInstructionsManagementPageNew() {
  return <AIInstructionsManagementPageContent />;
}

export default AIInstructionsManagementPageNew;
