import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  MoreHorizontal,
  ChevronDown,
  Building2,
  Calendar,
  Clock,
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý Mẫu Chứng chỉ
          </h1>
          <p className="text-gray-600">
            Tạo và quản lý các mẫu chứng chỉ cho tổ chức của bạn
          </p>
        </div>
        <Button className="mt-4 md:mt-0" onClick={handleCreateTemplate}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo mẫu mới
        </Button>
      </div>

      {/* Search and Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm mẫu chứng chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng mẫu</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Tất cả mẫu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang hoạt động
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <p className="text-xs text-muted-foreground">Mẫu có thể sử dụng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isAdmin ? "Mẫu hiện tại" : "Mẫu của tổ chức"}
            </CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.myTemplates}
            </div>
            <p className="text-xs text-muted-foreground">
              {isAdmin ? "Hiển thị" : "Mẫu riêng"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={loadTemplates}
                className="ml-auto"
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
          className={`grid w-full ${isAdmin ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {!isAdmin && (
            <TabsTrigger value="my-templates">Mẫu của tổ chức</TabsTrigger>
          )}
          {isAdmin && (
            <>
              <TabsTrigger value="my-templates">Mẫu theo tổ chức</TabsTrigger>
              <TabsTrigger value="all-templates">Tất cả mẫu</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 animate-spin" />
                  <p>Đang tải...</p>
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chưa có mẫu chứng chỉ
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Bắt đầu bằng cách tạo mẫu chứng chỉ đầu tiên
                  </p>
                  <Button onClick={handleCreateTemplate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo mẫu mới
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Header with select all */}
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={
                          templates.length > 0 &&
                          selectedTemplateIds.length === templates.length
                        }
                        onCheckedChange={(checked) =>
                          handleSelectAll(checked as boolean)
                        }
                      />
                      <span className="text-sm font-medium">
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
                          className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                            isSelected ? "ring-2 ring-blue-500" : ""
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
                              />

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                                    {template.templateName}
                                  </h3>
                                  <Badge
                                    className={`text-xs ${typeInfo.color}`}
                                    variant="secondary"
                                  >
                                    {typeInfo.label}
                                  </Badge>
                                  {template.isDefault && (
                                    <Badge
                                      className="text-xs bg-yellow-100 text-yellow-800"
                                      variant="secondary"
                                    >
                                      Mặc định
                                    </Badge>
                                  )}
                                  <Badge
                                    className={`text-xs ${
                                      template.isActive
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                    variant="secondary"
                                  >
                                    {template.isActive
                                      ? "Hoạt động"
                                      : "Tạm dừng"}
                                  </Badge>
                                </div>

                                {template.description && (
                                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                    {template.description}
                                  </p>
                                )}

                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {template.createdAt
                                      ? new Date(
                                          template.createdAt
                                        ).toLocaleDateString("vi-VN")
                                      : "N/A"}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    ID: {template.templateId}
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
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleEditTemplate(template.templateId)
                                }
                                className="text-green-600 hover:text-green-700"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDuplicateTemplate(template)
                                }
                                className="text-orange-600 hover:text-orange-700"
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
                                className="text-red-600 hover:text-red-700"
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
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        Trang {currentPage} / {totalPages}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          Trước
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
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
