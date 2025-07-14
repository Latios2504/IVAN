import React, { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Play,
  Power,
  PowerOff,
  BarChart3,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  Settings,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/auth";
import CustomInstructionBuilder from "@/components/ai/CustomInstructionBuilder";
import InstructionPreview from "@/components/ai/InstructionPreview";
import TestingPlayground from "@/components/ai/TestingPlayground";
import type {
  AiCustomInstructionDTO,
  AiCustomInstructionCreateDTO,
  AiCustomInstructionUpdateDTO,
  InstructionFormData,
  InstructionFilters,
  InstructionPerformanceDTO,
} from "@/types/ai";
import { aiInstructionsService } from "@/services/api/aiInstructionsService";

type ViewMode = "overview" | "builder" | "preview" | "testing";

export default function AIInstructionsManagementPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN; // Use the enum constant
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [instructions, setInstructions] = useState<AiCustomInstructionDTO[]>(
    []
  );
  const [filteredInstructions, setFilteredInstructions] = useState<
    AiCustomInstructionDTO[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<InstructionFilters>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [previewData, setPreviewData] = useState<
    InstructionFormData | AiCustomInstructionDTO | null
  >(null);
  const [editingInstruction, setEditingInstruction] =
    useState<AiCustomInstructionDTO | null>(null);
  const [testingInstruction, setTestingInstruction] =
    useState<AiCustomInstructionDTO | null>(null);
  const [builderData, setBuilderData] =
    useState<AiCustomInstructionCreateDTO | null>(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    avgQuality: 0,
    totalQueries: 0,
  });

  // Load instructions on component mount
  useEffect(() => {
    loadInstructions();
  }, []);

  // Filter instructions when search or filters change
  useEffect(() => {
    // Ensure instructions is an array before filtering
    if (!Array.isArray(instructions)) {
      setFilteredInstructions([]);
      return;
    }

    let filtered = instructions;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (instruction) =>
          instruction.instructionName.toLowerCase().includes(query) ||
          instruction.systemPrompt.toLowerCase().includes(query) ||
          instruction.behaviorInstructions?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filters.isActive !== undefined) {
      filtered = filtered.filter(
        (instruction) => instruction.isActive === filters.isActive
      );
    }

    // Default filter
    if (filters.isDefault !== undefined) {
      filtered = filtered.filter(
        (instruction) => instruction.isDefault === filters.isDefault
      );
    }

    setFilteredInstructions(filtered);
  }, [instructions, searchQuery, filters]);

  const loadInstructions = async () => {
    try {
      setLoading(true);
      // Use role-based data loading
      const data = await aiInstructionsService.getInstructions(isAdmin);

      // Ensure data is an array before setting state
      const instructionsArray = Array.isArray(data) ? data : [];
      setInstructions(instructionsArray);

      // Calculate stats
      const activeCount = instructionsArray.filter((i) => i.isActive).length;

      setStats({
        total: instructionsArray.length,
        active: activeCount,
        avgQuality: 4.2, // Mock data - TODO: Add real performance metrics
        totalQueries: 1247, // Mock data - TODO: Add real performance metrics
      });
    } catch (error) {
      console.error("Failed to load instructions:", error);
      // Set empty array on error to prevent filter/map errors
      setInstructions([]);
      setStats({
        total: 0,
        active: 0,
        avgQuality: 0,
        totalQueries: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Add performance metrics loading function as specified in the documentation
  const loadPerformance = async (instructionId: number) => {
    try {
      const performance = await aiInstructionsService.getInstructionPerformance(instructionId);
      
      // Update stats with real performance data
      setStats(prevStats => ({
        ...prevStats,
        avgQuality: performance.averageResponseQuality,
        totalQueries: performance.totalQueries,
      }));
      
      console.log("Performance metrics loaded:", performance);
      return performance;
    } catch (error) {
      console.error("Failed to load performance metrics:", error);
      throw error;
    }
  };

  const handleCreateInstruction = async (
    data: AiCustomInstructionCreateDTO
  ) => {
    try {
      await aiInstructionsService.createInstruction(data);
      await loadInstructions();
      setViewMode("overview");
      setBuilderData(null);
    } catch (error) {
      console.error("Failed to create instruction:", error);
      throw error;
    }
  };

  const handleUpdateInstruction = async (
    data: AiCustomInstructionUpdateDTO
  ) => {
    if (!editingInstruction) return;

    try {
      await aiInstructionsService.updateInstruction(
        editingInstruction.instructionId,
        data
      );
      await loadInstructions();
      setViewMode("overview");
      setEditingInstruction(null);
    } catch (error) {
      console.error("Failed to update instruction:", error);
      throw error;
    }
  };

  const handleSaveInstruction = async (
    data: AiCustomInstructionCreateDTO | AiCustomInstructionUpdateDTO
  ) => {
    if (editingInstruction) {
      // It's an update - add isActive field
      const updateData: AiCustomInstructionUpdateDTO = {
        ...data,
        isActive: "isActive" in data ? data.isActive : true,
      };
      await handleUpdateInstruction(updateData);
    } else {
      // It's a create
      await handleCreateInstruction(data as AiCustomInstructionCreateDTO);
    }
  };

  const handleDeleteInstruction = async (instructionId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa hướng dẫn AI này?")) return;

    try {
      await aiInstructionsService.adminDeleteInstruction(instructionId);
      await loadInstructions();
    } catch (error) {
      console.error("Failed to delete instruction:", error);
    }
  };

  const handleToggleStatus = async (instruction: AiCustomInstructionDTO) => {
    try {
      await aiInstructionsService.toggleInstructionStatus(
        instruction.instructionId,
        !instruction.isActive
      );
      await loadInstructions();
    } catch (error) {
      console.error("Failed to toggle instruction status:", error);
    }
  };

  const handleSelectTemplate = (template: AiCustomInstructionCreateDTO) => {
    setBuilderData(template);
    setViewMode("builder");
  };

  const handlePreviewFormData = (formData: InstructionFormData) => {
    setPreviewData(formData);
  };

  const handleEditInstruction = (instruction: AiCustomInstructionDTO) => {
    setEditingInstruction(instruction);
    setViewMode("builder");
  };

  const handleTestInstruction = (instruction: AiCustomInstructionDTO) => {
    setTestingInstruction(instruction);
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getStatusBadge = (instruction: AiCustomInstructionDTO) => {
    if (instruction.isDefault) {
      return (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200"
        >
          Template
        </Badge>
      );
    }
    if (instruction.isActive) {
      return (
        <Badge
          variant="default"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Hoạt động
        </Badge>
      );
    }
    return <Badge variant="secondary">Tạm dừng</Badge>;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng hướng dẫn
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Đang hoạt động
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.active}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Chất lượng TB
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgQuality}/5
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-cyan-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng queries
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalQueries}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm hướng dẫn AI..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  isActive: value === "all" ? undefined : value === "active",
                }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Tạm dừng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Instructions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách Hướng dẫn AI</CardTitle>
            <Button
              onClick={() => {
                setBuilderData({
                  instructionName: "",
                  systemPrompt: "",
                  behaviorInstructions: "",
                  dataAccessRules: "",
                });
                setViewMode("builder");
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tạo mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên hướng dẫn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Cập nhật</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(filteredInstructions) &&
                filteredInstructions.length > 0 ? (
                  filteredInstructions.map((instruction) => (
                    <TableRow key={instruction.instructionId}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">
                            {instruction.instructionName}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {instruction.systemPrompt.substring(0, 100)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(instruction)}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(instruction.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(instruction.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => setPreviewData(instruction)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleTestInstruction(instruction)}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Test hướng dẫn
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleEditInstruction(instruction)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(instruction)}
                            >
                              {instruction.isActive ? (
                                <>
                                  <PowerOff className="h-4 w-4 mr-2" />
                                  Tạm dừng
                                </>
                              ) : (
                                <>
                                  <Power className="h-4 w-4 mr-2" />
                                  Kích hoạt
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                handleDeleteInstruction(
                                  instruction.instructionId
                                )
                              }
                              disabled={instruction.isDefault}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      {loading
                        ? "Đang tải..."
                        : "Không có dữ liệu hướng dẫn AI"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý Hướng dẫn AI
          </h1>
          <p className="text-gray-600 mt-1">
            Tùy chỉnh hành vi và chuyên môn của AI assistant
          </p>
        </div>

        {viewMode !== "overview" && (
          <Button
            variant="outline"
            onClick={() => {
              setViewMode("overview");
              setBuilderData(null);
              setEditingInstruction(null);
            }}
          >
            ← Quay về danh sách
          </Button>
        )}
      </div>

      {/* Content based on view mode */}
      {viewMode === "overview" && renderOverview()}

      {viewMode === "builder" && (
        <CustomInstructionBuilder
          initialData={builderData || undefined}
          editingInstruction={editingInstruction || undefined}
          onSave={handleSaveInstruction}
          onPreview={handlePreviewFormData}
          onCancel={() => {
            setViewMode("overview");
            setBuilderData(null);
            setEditingInstruction(null);
          }}
        />
      )}

      {/* Modals */}
      {previewData && (
        <InstructionPreview
          data={previewData}
          onClose={() => setPreviewData(null)}
        />
      )}

      {testingInstruction && (
        <TestingPlayground
          instruction={testingInstruction}
          onClose={() => setTestingInstruction(null)}
        />
      )}
    </div>
  );
}
