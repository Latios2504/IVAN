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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bot,
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Play,
  CheckCircle,
  XCircle,
  TrendingUp,
  Settings,
  Loader2,
  BarChart3,
} from "lucide-react";
import CustomInstructionBuilder from "@/components/admin/ai-custom-instructions/CustomInstructionBuilder";
import TestingPlayground from "@/components/admin/ai-custom-instructions/TestingPlayground";

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
            err instanceof Error ? err.message : "Failed to load instructions"
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
        onValueChange={(value) => setActiveTab(value as any)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Tạo mới
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
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Tổng Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <TrendingUp className="h-4 w-4 text-green-500 ml-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Đang hoạt động
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.active}
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Không hoạt động
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-gray-500">
                    {stats.inactive}
                  </div>
                  <XCircle className="h-4 w-4 text-gray-400 ml-2" />
                </div>
              </CardContent>
            </Card>
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
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Đang tải...
                </div>
              )}

              {/* Empty State */}
              {!loading && instructions.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chưa có instructions nào
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Tạo instruction đầu tiên để bắt đầu
                  </p>
                  <Button onClick={() => setActiveTab("builder")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo instruction đầu tiên
                  </Button>
                </div>
              )}

              {/* Instructions Table */}
              {!loading && instructions.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên</TableHead>
                      <TableHead>System Prompt</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="w-[100px]">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInstructions.map((instruction) => (
                      <TableRow key={instruction.instructionId}>
                        <TableCell className="font-medium">
                          {instruction.instructionName}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {instruction.systemPrompt}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              instruction.isActive ? "default" : "secondary"
                            }
                          >
                            {instruction.isActive ? "Hoạt động" : "Tạm dừng"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(instruction.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedInstruction(instruction);
                                  setActiveTab("testing");
                                }}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Kiểm tra
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={async () => {
                                  try {
                                    await aiInstructionsDataService.delete(
                                      instruction.instructionId
                                    );
                                    // Refresh data
                                    const result =
                                      await aiInstructionsDataService.getAll();
                                    setInstructions(result);
                                  } catch (err) {
                                    setError(
                                      err instanceof Error
                                        ? err.message
                                        : "Failed to delete instruction"
                                    );
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Builder Tab */}
        <TabsContent value="builder">
          <Card>
            <CardHeader>
              <CardTitle>Tạo AI Instruction mới</CardTitle>
              <CardDescription>
                Tạo hướng dẫn tùy chỉnh cho AI Assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomInstructionBuilder
                onSave={async (data) => {
                  try {
                    await aiInstructionsDataService.create(data);
                    // Refresh data
                    const result = await aiInstructionsDataService.getAll();
                    setInstructions(result);
                    setActiveTab("overview");
                  } catch (err) {
                    setError(
                      err instanceof Error
                        ? err.message
                        : "Failed to create instruction"
                    );
                  }
                }}
                onCancel={() => setActiveTab("overview")}
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
    </div>
  );
};

function AIInstructionsManagementPageNew() {
  return <AIInstructionsManagementPageContent />;
}

export default AIInstructionsManagementPageNew;
