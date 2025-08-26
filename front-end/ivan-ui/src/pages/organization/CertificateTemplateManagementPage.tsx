import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Users,
  Eye,
  Pencil,
  Trash2,
  Copy,
  Building2,
  Calendar,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { certificateTemplateService } from "@/services/certificateTemplateService";
import type { CertificateTemplateViewModel } from "@/types/certificate";
import CreateCertificateTemplateModal from "@/components/organization/certificate-template/CreateCertificateTemplateModal";
import EditCertificateTemplateModal from "@/components/organization/certificate-template/EditCertificateTemplateModal";
import DeleteCertificateTemplateDialog from "@/components/organization/certificate-template/DeleteCertificateTemplateDialog";
import PreviewCertificateTemplateModal from "@/components/organization/certificate-template/PreviewCertificateTemplateModal";
import BulkActionsModal from "@/components/organization/certificate-template/BulkActionsModal";

// Mock current user - replace with actual auth context
const getCurrentUser = () => ({
  userId: 1,
  role: "organization", // organization, admin
  organizationId: 12, // Updated to match your database data
  name: "Organization Admin",
});

export default function CertificateTemplateManagementPage() {
  const currentUser = getCurrentUser();
  const isAdmin = currentUser.role === "admin";

  // State management
  const [templates, setTemplates] = useState<CertificateTemplateViewModel[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(
    isAdmin ? "all-templates" : "my-templates"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(50); // Increased to handle more templates
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<number[]>([]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedTab]);

  // Load templates from API
  const loadTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      if (selectedTab === "my-templates" && !isAdmin) {
        // Organization templates - use filter endpoint (backend auto-sets organizationId)
        const filterModel = {
          pageNumber: currentPage,
          pageSize: pageSize,
          searchTerm: debouncedSearchTerm.trim() || undefined,
        };
        response =
          await certificateTemplateService.getFilteredCertificateTemplates(
            filterModel
          );
      } else if (selectedTab === "my-templates" && isAdmin) {
        // Admin viewing organization-filtered templates - use filter endpoint
        const filterModel = {
          pageNumber: currentPage,
          pageSize: pageSize,
          searchTerm: debouncedSearchTerm.trim() || undefined,
        };
        response =
          await certificateTemplateService.getFilteredCertificateTemplates(
            filterModel
          );
      } else {
        // All templates (for admin) with search
        if (debouncedSearchTerm.trim()) {
          // Use filter endpoint for search (admin sees all because backend doesn't set organizationId for admin)
          const filterModel = {
            pageNumber: currentPage,
            pageSize: pageSize,
            searchTerm: debouncedSearchTerm.trim(),
          };
          response =
            await certificateTemplateService.getFilteredCertificateTemplates(
              filterModel
            );
        } else {
          // Use general endpoint for all templates
          response = await certificateTemplateService.getCertificateTemplates(
            currentPage,
            pageSize
          );
        }
      }

      setTemplates(response.items);
      setTotalPages(
        response.totalPages || Math.ceil(response.totalCount / pageSize)
      );

      // Debug logging to see what we're getting
      console.log("API Response:", {
        itemCount: response.items?.length,
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        pageNumber: response.pageNumber,
        pageSize: response.pageSize,
        selectedTab,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load templates";
      setError(errorMessage);
      toast.error("Không thể tải danh sách mẫu chứng chỉ");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, selectedTab, debouncedSearchTerm, isAdmin]);

  // Load templates on component mount and when filters change
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // Calculate statistics (using server-filtered templates)
  const getTemplateStats = () => {
    if (!templates || !Array.isArray(templates)) {
      return { total: 0, active: 0, myTemplates: 0 };
    }

    const total = templates.length;
    const active = templates.filter((t) => t.isActive).length;
    const myTemplates = templates.length;

    return { total, active, myTemplates };
  };

  const stats = getTemplateStats();

  // Handle template creation
  const handleCreateTemplate = () => {
    setIsCreateModalOpen(true);
  };

  // Handle successful template creation
  const handleTemplateCreated = () => {
    setIsCreateModalOpen(false);
    toast.success("Tạo mẫu chứng chỉ thành công!");
    loadTemplates(); // Reload the templates list
  };

  // Handle template editing
  const handleEditTemplate = (templateId: number) => {
    setSelectedTemplateId(templateId);
    setIsEditModalOpen(true);
  };

  // Handle template duplication
  const handleDuplicateTemplate = async (
    template: CertificateTemplateViewModel
  ) => {
    try {
      await certificateTemplateService.duplicateTemplate(
        template.templateId,
        `${template.templateName} (Bản sao)`
      );
      toast.success(`Đã sao chép mẫu "${template.templateName}" thành công!`);
      loadTemplates(); // Reload the templates list
    } catch (error) {
      toast.error("Không thể sao chép mẫu chứng chỉ");
    }
  };

  // Handle template deletion
  const handleDeleteTemplate = (templateId: number, templateName: string) => {
    setSelectedTemplateId(templateId);
    setSelectedTemplateName(templateName);
    setIsDeleteDialogOpen(true);
  };

  // Handle template preview
  const handlePreviewTemplate = (templateId: number) => {
    setSelectedTemplateId(templateId);
    setIsPreviewModalOpen(true);
  };

  // Handle successful operations
  const handleOperationSuccess = () => {
    loadTemplates(); // Reload the templates list
    setSelectedTemplateIds([]); // Clear selection
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: number, checked: boolean) => {
    if (checked) {
      setSelectedTemplateIds((prev) => [...prev, templateId]);
    } else {
      setSelectedTemplateIds((prev) => prev.filter((id) => id !== templateId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked && templates && Array.isArray(templates)) {
      setSelectedTemplateIds(templates.map((t) => t.templateId));
    } else {
      setSelectedTemplateIds([]);
    }
  };

  // Handle bulk actions
  const handleBulkActions = () => {
    if (selectedTemplateIds.length > 0) {
      setIsBulkActionsOpen(true);
    }
  };

  // Get selected templates
  const selectedTemplates =
    templates && Array.isArray(templates)
      ? templates.filter((t) => selectedTemplateIds.includes(t.templateId))
      : [];

  // Get template type display info
  const getTemplateTypeInfo = (templateType?: string) => {
    const types = {
      Participation: { label: "Tham gia", color: "bg-blue-100 text-blue-800" },
      Achievement: {
        label: "Thành tích",
        color: "bg-green-100 text-green-800",
      },
      Completion: {
        label: "Hoàn thành",
        color: "bg-purple-100 text-purple-800",
      },
      Recognition: {
        label: "Ghi nhận",
        color: "bg-orange-100 text-orange-800",
      },
      Custom: { label: "Tùy chỉnh", color: "bg-gray-100 text-gray-800" },
    };

    return (
      types[templateType as keyof typeof types] || {
        label: templateType || "Không xác định",
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 p-6 bg-gradient-to-r from-purple-100/80 via-pink-100/80 to-rose-100/80 dark:from-purple-900/50 dark:via-pink-900/50 dark:to-rose-900/50 rounded-xl border border-purple-200/50 dark:border-purple-800/50 shadow-lg backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-2">
            Quản lý Mẫu Chứng chỉ
          </h1>
          <p className="text-purple-700 dark:text-purple-300">
            Tạo và quản lý các mẫu chứng chỉ cho tổ chức của bạn
          </p>
        </div>
        <Button
          className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg"
          onClick={handleCreateTemplate}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tạo mẫu mới
        </Button>
      </div>

      {/* Search and Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/50 dark:via-purple-950/50 dark:to-pink-950/50 rounded-lg border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-500 dark:text-indigo-400" />
          <Input
            placeholder="Tìm kiếm mẫu chứng chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 dark:bg-gray-900/80 border-indigo-200 dark:border-indigo-700 focus:border-indigo-400 dark:focus:border-indigo-500"
          />
        </div>

        {/* Bulk Actions */}
        {selectedTemplateIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Đã chọn {selectedTemplateIds.length} mẫu
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkActions}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Thao tác hàng loạt
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTemplateIds([])}
            >
              Bỏ chọn
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 border-blue-200/50 dark:border-blue-800/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Tổng mẫu
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {stats.total}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Tất cả mẫu
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/50 dark:via-emerald-950/50 dark:to-teal-950/50 border-green-200/50 dark:border-green-800/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">
              Đang hoạt động
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.active}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Mẫu có thể sử dụng
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/50 dark:via-amber-950/50 dark:to-yellow-950/50 border-orange-200/50 dark:border-orange-800/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">
              {isAdmin ? "Mẫu hiện tại" : "Mẫu của tổ chức"}
            </CardTitle>
            <Building2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.myTemplates}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              {isAdmin ? "Hiển thị" : "Mẫu riêng"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <Card className="mb-6 bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 dark:from-red-950/50 dark:via-rose-950/50 dark:to-pink-950/50 border-red-200/50 dark:border-red-800/50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={loadTemplates}
                className="ml-auto border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
              >
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates Tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-6"
      >
        <TabsList
          className={`grid w-full ${
            isAdmin ? "grid-cols-2" : "grid-cols-1"
          } bg-gradient-to-r from-purple-100 via-violet-100 to-indigo-100 dark:from-purple-900/50 dark:via-violet-900/50 dark:to-indigo-900/50 border border-purple-200/50 dark:border-purple-800/50 shadow-sm`}
        >
          {!isAdmin && (
            <TabsTrigger
              value="my-templates"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-200 data-[state=active]:to-violet-200 dark:data-[state=active]:from-purple-800 dark:data-[state=active]:to-violet-800 data-[state=active]:text-purple-900 dark:data-[state=active]:text-purple-100"
            >
              Mẫu của tổ chức
            </TabsTrigger>
          )}
          {isAdmin && (
            <>
              <TabsTrigger
                value="my-templates"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-200 data-[state=active]:to-violet-200 dark:data-[state=active]:from-purple-800 dark:data-[state=active]:to-violet-800 data-[state=active]:text-purple-900 dark:data-[state=active]:text-purple-100"
              >
                Mẫu theo tổ chức
              </TabsTrigger>
              <TabsTrigger
                value="all-templates"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-200 data-[state=active]:to-blue-200 dark:data-[state=active]:from-indigo-800 dark:data-[state=active]:to-blue-800 data-[state=active]:text-indigo-900 dark:data-[state=active]:text-indigo-100"
              >
                Tất cả mẫu
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <Card className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/50 dark:via-gray-950/50 dark:to-zinc-950/50 border-slate-200/50 dark:border-slate-800/50 shadow-lg">
            <CardContent className="pt-6">
              {loading ? (
                <div className="text-center py-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 animate-spin text-blue-600 dark:text-blue-400" />
                  <p className="text-blue-700 dark:text-blue-300 font-medium">
                    Đang tải...
                  </p>
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 dark:from-gray-950/50 dark:via-slate-950/50 dark:to-zinc-950/50 rounded-lg border border-gray-200/50 dark:border-gray-800/50">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Chưa có mẫu chứng chỉ
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Bắt đầu bằng cách tạo mẫu chứng chỉ đầu tiên
                  </p>
                  <Button
                    onClick={handleCreateTemplate}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo mẫu mới
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Header with select all */}
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4 bg-gradient-to-r from-slate-100/50 via-gray-100/50 to-zinc-100/50 dark:from-slate-900/50 dark:via-gray-900/50 dark:to-zinc-900/50 rounded-t-lg px-4 py-3">
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={
                          templates.length > 0 &&
                          selectedTemplateIds.length === templates.length
                        }
                        onCheckedChange={(checked) =>
                          handleSelectAll(checked as boolean)
                        }
                        className="border-slate-400 dark:border-slate-600"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Chọn tất cả ({templates.length} mẫu)
                      </span>
                    </div>
                  </div>

                  {/* Templates list */}
                  <div className="space-y-3">
                    {templates.map((template) => {
                      const typeInfo = getTemplateTypeInfo(
                        template.templateType
                      );
                      const isSelected = selectedTemplateIds.includes(
                        template.templateId
                      );

                      return (
                        <div
                          key={template.templateId}
                          className={`border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-gradient-to-r from-white via-slate-50 to-gray-50 dark:from-slate-900/50 dark:via-slate-800/50 dark:to-gray-900/50 hover:shadow-lg hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:via-indigo-950/30 dark:hover:to-purple-950/30 transition-all duration-200 ${
                            isSelected
                              ? "ring-2 ring-blue-500 dark:ring-blue-400 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) =>
                                  handleTemplateSelect(
                                    template.templateId,
                                    checked as boolean
                                  )
                                }
                                className="border-slate-400 dark:border-slate-600"
                              />

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                                    {template.templateName}
                                  </h3>
                                  <Badge
                                    className={`text-xs ${typeInfo.color} border border-current/20`}
                                    variant="secondary"
                                  >
                                    {typeInfo.label}
                                  </Badge>
                                  {template.isDefault && (
                                    <Badge
                                      className="text-xs bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/50 dark:to-amber-900/50 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700"
                                      variant="secondary"
                                    >
                                      Mặc định
                                    </Badge>
                                  )}
                                  <Badge
                                    className={`text-xs border ${
                                      template.isActive
                                        ? "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700"
                                        : "bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-900/50 dark:to-slate-900/50 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                                    }`}
                                    variant="secondary"
                                  >
                                    {template.isActive
                                      ? "Hoạt động"
                                      : "Tạm dừng"}
                                  </Badge>
                                </div>

                                {template.description && (
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                                    {template.description}
                                  </p>
                                )}

                                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                  <div className="flex items-center gap-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 px-2 py-1 rounded border border-blue-200/50 dark:border-blue-800/50">
                                    <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                    <span className="text-blue-700 dark:text-blue-300">
                                      {template.createdAt
                                        ? new Date(
                                            template.createdAt
                                          ).toLocaleDateString("vi-VN")
                                        : "N/A"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 px-2 py-1 rounded border border-purple-200/50 dark:border-purple-800/50">
                                    <User className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                    <span className="text-purple-700 dark:text-purple-300">
                                      ID: {template.templateId}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handlePreviewTemplate(template.templateId)
                                }
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleEditTemplate(template.templateId)
                                }
                                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-950/30 dark:hover:to-emerald-950/30 border border-transparent hover:border-green-200 dark:hover:border-green-800 transition-all duration-200"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDuplicateTemplate(template)
                                }
                                className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 dark:hover:from-orange-950/30 dark:hover:to-amber-950/30 border border-transparent hover:border-orange-200 dark:hover:border-orange-800 transition-all duration-200"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteTemplate(
                                    template.templateId,
                                    template.templateName
                                  )
                                }
                                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 dark:hover:from-red-950/30 dark:hover:to-rose-950/30 border border-transparent hover:border-red-200 dark:hover:border-red-800 transition-all duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900/30 dark:via-gray-900/30 dark:to-zinc-900/30 px-4 py-3 rounded-b-lg">
                      <div className="text-sm text-slate-600 dark:text-slate-400 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 px-3 py-1 rounded border border-blue-200/50 dark:border-blue-800/50">
                        <span className="text-blue-700 dark:text-blue-300 font-medium">
                          Trang {currentPage} / {totalPages}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                          className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30 hover:border-blue-300 dark:hover:border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          Trước
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30 hover:border-blue-300 dark:hover:border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          Sau
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Certificate Template Modal */}
      <CreateCertificateTemplateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleTemplateCreated}
      />

      {/* Edit Certificate Template Modal */}
      <EditCertificateTemplateModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={handleOperationSuccess}
        templateId={selectedTemplateId}
      />

      {/* Delete Certificate Template Dialog */}
      <DeleteCertificateTemplateDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSuccess={handleOperationSuccess}
        templateId={selectedTemplateId}
        templateName={selectedTemplateName}
      />

      {/* Preview Certificate Template Modal */}
      <PreviewCertificateTemplateModal
        open={isPreviewModalOpen}
        onOpenChange={setIsPreviewModalOpen}
        templateId={selectedTemplateId}
      />

      {/* Bulk Actions Modal */}
      <BulkActionsModal
        open={isBulkActionsOpen}
        onOpenChange={setIsBulkActionsOpen}
        onSuccess={handleOperationSuccess}
        selectedTemplates={selectedTemplates}
      />
    </div>
  );
}
