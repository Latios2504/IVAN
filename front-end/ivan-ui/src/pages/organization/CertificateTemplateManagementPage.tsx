import { useState, useEffect } from "react";
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
import {
  FileText,
  Plus,
  Search,
  Edit,
  Copy,
  Eye,
  Trash2,
  Loader2,
  AlertCircle,
  Settings,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { certificateTemplateService } from "@/services/certificateTemplateService";
import type { CertificateTemplateViewModel } from "@/types/certificate";
import CreateCertificateTemplateModal from "@/components/organization/certificate-template/CreateCertificateTemplateModal";

// Mock current user - replace with actual auth context
const getCurrentUser = () => ({
  userId: 1,
  role: "organization", // organization, admin
  organizationId: 123,
  name: "Organization Admin",
});

export default function CertificateTemplateManagementPage() {
  // State management
  const [templates, setTemplates] = useState<CertificateTemplateViewModel[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("my-templates");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(12);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const currentUser = getCurrentUser();
  const isAdmin = currentUser.role === "admin";

  // Load templates from API
  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      if (selectedTab === "my-templates" && !isAdmin) {
        // Organization templates
        response = await certificateTemplateService.getTemplatesByOrganization(
          currentUser.organizationId!,
          currentPage,
          pageSize
        );
      } else if (selectedTab === "default-templates") {
        // Default/System templates
        response = await certificateTemplateService.getDefaultTemplates(
          currentPage,
          pageSize
        );
      } else {
        // All templates (for admin)
        response = await certificateTemplateService.getCertificateTemplates(
          currentPage,
          pageSize
        );
      }

      setTemplates(response.items);
      setTotalPages(
        response.totalPages || Math.ceil(response.totalCount / pageSize)
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load templates";
      setError(errorMessage);
      toast.error("Không thể tải danh sách mẫu chứng chỉ");
    } finally {
      setLoading(false);
    }
  };

  // Load templates on component mount and when filters change
  useEffect(() => {
    loadTemplates();
  }, [currentPage, pageSize, selectedTab]);

  // Filter templates based on search term
  const filteredTemplates = templates.filter(
    (template) =>
      template.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.templateType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const getTemplateStats = () => {
    const total = templates.length;
    const active = templates.filter((t) => t.isActive).length;
    const myTemplates = templates.filter(
      (t) => t.organizationId === currentUser.organizationId
    ).length;
    const defaultTemplates = templates.filter((t) => t.isDefault).length;

    return { total, active, myTemplates, defaultTemplates };
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
    // TODO: Open edit template modal
    toast.info(`Chỉnh sửa mẫu ${templateId} sẽ được triển khai`);
  };

  // Handle template duplication
  const handleDuplicateTemplate = (template: CertificateTemplateViewModel) => {
    // TODO: Duplicate template logic
    toast.info(`Sao chép mẫu "${template.templateName}" sẽ được triển khai`);
  };

  // Handle template deletion
  const handleDeleteTemplate = (templateId: number, templateName: string) => {
    // TODO: Add confirmation dialog and delete logic
    toast.info(`Xóa mẫu "${templateName}" sẽ được triển khai`);
  };

  // Handle template preview
  const handlePreviewTemplate = (templateId: number) => {
    // TODO: Open template preview modal
    toast.info(`Xem trước mẫu ${templateId} sẽ được triển khai`);
  };

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

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm mẫu chứng chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

        {!isAdmin && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mẫu của tôi</CardTitle>
              <Settings className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.myTemplates}
              </div>
              <p className="text-xs text-muted-foreground">Tự tạo</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mẫu hệ thống</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.defaultTemplates}
            </div>
            <p className="text-xs text-muted-foreground">Mẫu mặc định</p>
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
          className={`grid w-full ${isAdmin ? "grid-cols-3" : "grid-cols-2"}`}
        >
          {!isAdmin && (
            <TabsTrigger value="my-templates">Mẫu của tôi</TabsTrigger>
          )}
          <TabsTrigger value="default-templates">Mẫu hệ thống</TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="all-templates">Tất cả mẫu</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedTab === "my-templates" && "Mẫu chứng chỉ của tôi"}
                {selectedTab === "default-templates" && "Mẫu hệ thống"}
                {selectedTab === "all-templates" && "Tất cả mẫu chứng chỉ"}
              </CardTitle>
              <CardDescription>
                {selectedTab === "my-templates" &&
                  "Quản lý các mẫu chứng chỉ do tổ chức của bạn tạo"}
                {selectedTab === "default-templates" &&
                  "Sử dụng các mẫu chứng chỉ có sẵn của hệ thống"}
                {selectedTab === "all-templates" &&
                  "Quản lý tất cả mẫu chứng chỉ trong hệ thống"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Đang tải mẫu chứng chỉ...
                  </span>
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchTerm
                      ? "Không tìm thấy mẫu"
                      : "Chưa có mẫu chứng chỉ"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm
                      ? "Thử thay đổi từ khóa tìm kiếm"
                      : "Tạo mẫu chứng chỉ đầu tiên cho tổ chức của bạn"}
                  </p>
                  {!searchTerm && selectedTab === "my-templates" && (
                    <Button onClick={handleCreateTemplate}>
                      <Plus className="mr-2 h-4 w-4" />
                      Tạo mẫu đầu tiên
                    </Button>
                  )}
                </div>
              )}

              {/* Templates Grid */}
              {!loading && filteredTemplates.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => {
                    const typeInfo = getTemplateTypeInfo(template.templateType);
                    const isOwned =
                      template.organizationId === currentUser.organizationId;
                    const canEdit = isAdmin || isOwned;

                    return (
                      <Card
                        key={template.templateId}
                        className="hover:shadow-lg transition-shadow duration-200"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-1">
                                {template.templateName}
                              </CardTitle>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={typeInfo.color}>
                                  {typeInfo.label}
                                </Badge>
                                {template.isDefault && (
                                  <Badge variant="outline">Hệ thống</Badge>
                                )}
                                {!template.isActive && (
                                  <Badge variant="destructive">Tạm dừng</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <CardDescription className="text-sm line-clamp-2">
                            {template.description || "Không có mô tả"}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Template Details */}
                          <div className="space-y-2 text-sm text-gray-600">
                            {template.requiredFields && (
                              <div>
                                <span className="font-medium">
                                  Trường bắt buộc:{" "}
                                </span>
                                <span className="text-xs">
                                  {certificateTemplateService
                                    .parseRequiredFields(
                                      template.requiredFields
                                    )
                                    .slice(0, 3)
                                    .join(", ")}
                                  {certificateTemplateService.parseRequiredFields(
                                    template.requiredFields
                                  ).length > 3 && "..."}
                                </span>
                              </div>
                            )}

                            {template.createdAt && (
                              <div>
                                <span className="font-medium">Tạo: </span>
                                {new Date(
                                  template.createdAt
                                ).toLocaleDateString("vi-VN")}
                              </div>
                            )}

                            {template.updatedAt &&
                              template.updatedAt !== template.createdAt && (
                                <div>
                                  <span className="font-medium">
                                    Cập nhật:{" "}
                                  </span>
                                  {new Date(
                                    template.updatedAt
                                  ).toLocaleDateString("vi-VN")}
                                </div>
                              )}
                          </div>

                          {/* Status Indicator */}
                          <div className="flex items-center gap-2 text-sm">
                            {template.isActive ? (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span>Đang hoạt động</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-red-600">
                                <XCircle className="h-4 w-4" />
                                <span>Tạm dừng</span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handlePreviewTemplate(template.templateId)
                              }
                              className="flex-1"
                            >
                              <Eye className="mr-1 h-4 w-4" />
                              Xem
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDuplicateTemplate(template)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>

                            {canEdit && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleEditTemplate(template.templateId)
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}

                            {canEdit && !template.isDefault && (
                              <Button
                                variant="outline"
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
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {!loading && filteredTemplates.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Trang {currentPage} / {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Sau
                    </Button>
                  </div>
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
    </div>
  );
}
