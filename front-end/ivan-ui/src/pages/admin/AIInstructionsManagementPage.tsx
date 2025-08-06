import React from "react";
import {
  AIInstructionsProvider,
  useAIInstructions,
} from "@/context/AIInstructionsContext";
import { useAuth } from "@/hooks/useAuth";
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
import CustomInstructionBuilder from "@/components/ai/CustomInstructionBuilder";
import InstructionPreview from "@/components/ai/InstructionPreview";
import TestingPlayground from "@/components/ai/TestingPlayground";
import { LoadingState } from "@/components/common/LoadingState";
import type { AiCustomInstructionDTO } from "@/types/ai";

/**
 * AI Instructions Management Page Content (using AIInstructionsContext)
 * Clean implementation following the established context pattern
 */
const AIInstructionsManagementPageContent: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  const {
    instructions,
    filteredInstructions,
    loading,
    error,
    stats,
    filters,
    searchQuery,
    viewMode,
    modals,
    setSearchQuery,
    setFilters,
    setViewMode,
    openPreview,
    openBuilder,
    openTesting,
    openEditing,
    closeAllModals,
    createInstruction,
    updateInstruction,
    deleteInstruction,
    toggleInstructionStatus,
    clearError,
  } = useAIInstructions();

  // Check if current user is admin
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

  // Handle errors
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Lỗi tải dữ liệu
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={clearError}>Thử lại</Button>
        </div>
      </div>
    );
  }

  // Render overview content
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng Instructions
            </CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.recentlyModified} trong tuần qua
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang hoạt động
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0
                ? Math.round((stats.active / stats.total) * 100)
                : 0}
              % tổng số
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Không hoạt động
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.inactive}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0
                ? Math.round((stats.inactive / stats.total) * 100)
                : 0}
              % tổng số
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cập nhật gần đây
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.recentlyModified}
            </div>
            <p className="text-xs text-muted-foreground">7 ngày qua</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm và Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên, system prompt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select
              value={filters.isActive?.toString() || "all"}
              onValueChange={(value) =>
                setFilters({
                  isActive: value === "all" ? undefined : value === "true",
                })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="true">Đang hoạt động</SelectItem>
                <SelectItem value="false">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setFilters({})}
              className="whitespace-nowrap"
            >
              <Filter className="mr-2 h-4 w-4" />
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Danh sách AI Instructions</CardTitle>
            <CardDescription>
              Quản lý và cấu hình các hướng dẫn AI cho hệ thống
            </CardDescription>
          </div>
          <Button onClick={() => openBuilder()} className="gap-2">
            <Plus className="h-4 w-4" />
            Tạo mới
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingState loading={true} />
          ) : filteredInstructions.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Không có AI Instructions
              </h3>
              <p className="text-muted-foreground mb-6">
                Chưa có hướng dẫn AI nào được tạo hoặc không khớp với bộ lọc
              </p>
              <Button onClick={() => openBuilder()} className="gap-2">
                <Plus className="h-4 w-4" />
                Tạo AI Instruction đầu tiên
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Cập nhật</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstructions.map((instruction) => (
                  <TableRow key={instruction.instructionId}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {instruction.instructionName}
                        </div>
                        <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                          {instruction.systemPrompt}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={instruction.isActive ? "default" : "secondary"}
                      >
                        {instruction.isActive ? (
                          <>
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Hoạt động
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-1 h-3 w-3" />
                            Tạm dừng
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(instruction.createdAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(instruction.updatedAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => openPreview(instruction)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openTesting(instruction)}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Kiểm tra
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openEditing(instruction)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              toggleInstructionStatus(instruction.instructionId)
                            }
                          >
                            {instruction.isActive ? (
                              <>
                                <PowerOff className="mr-2 h-4 w-4" />
                                Tạm dừng
                              </>
                            ) : (
                              <>
                                <Power className="mr-2 h-4 w-4" />
                                Kích hoạt
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              deleteInstruction(instruction.instructionId)
                            }
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
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
    </div>
  );

  // Main render based on view mode
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý AI Instructions
          </h1>
          <p className="text-muted-foreground">
            Tạo và quản lý các hướng dẫn tùy chỉnh cho AI
          </p>
        </div>
      </div>

      <Tabs
        value={viewMode}
        onValueChange={(value) => setViewMode(value as any)}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="builder">
            <Settings className="mr-2 h-4 w-4" />
            Tạo mới
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="mr-2 h-4 w-4" />
            Xem trước
          </TabsTrigger>
          <TabsTrigger value="testing">
            <Play className="mr-2 h-4 w-4" />
            Kiểm tra
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">{renderOverview()}</TabsContent>

        <TabsContent value="builder">
          <Card>
            <CardHeader>
              <CardTitle>Tạo AI Instruction mới</CardTitle>
              <CardDescription>
                Thiết lập hướng dẫn tùy chỉnh cho AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomInstructionBuilder
                onSave={async (data) => {
                  await createInstruction(data);
                  setViewMode("overview");
                }}
                onPreview={(data) => openPreview(data)}
                onCancel={() => setViewMode("overview")}
                initialData={modals.builder.data || undefined}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Xem trước AI Instruction</CardTitle>
            </CardHeader>
            <CardContent>
              {modals.preview.data ? (
                <InstructionPreview
                  data={modals.preview.data}
                  onClose={() => {
                    closeAllModals();
                    setViewMode("overview");
                  }}
                />
              ) : (
                <div className="text-center py-12">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Chọn instruction để xem
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Quay lại tab Tổng quan và chọn một instruction để xem chi
                    tiết
                  </p>
                  <Button onClick={() => setViewMode("overview")}>
                    Về trang tổng quan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing">
          <Card>
            <CardHeader>
              <CardTitle>Kiểm tra AI Instruction</CardTitle>
            </CardHeader>
            <CardContent>
              {modals.testing.instruction ? (
                <TestingPlayground
                  instruction={modals.testing.instruction}
                  onClose={() => {
                    closeAllModals();
                    setViewMode("overview");
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
                  <Button onClick={() => setViewMode("overview")}>
                    Về trang tổng quan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals would be handled by the components themselves */}
    </div>
  );
};

/**
 * Main AI Instructions Management Page with Provider
 */
export default function AIInstructionsManagementPage() {
  return (
    <AIInstructionsProvider>
      <AIInstructionsManagementPageContent />
    </AIInstructionsProvider>
  );
}
