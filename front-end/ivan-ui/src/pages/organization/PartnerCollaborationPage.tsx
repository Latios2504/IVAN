import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { partnerCollaborationService } from "@/services/partnerCollaborationService";
import type {
  CollaborationViewList,
  CollaborationDetailDto,
  PartnerCollaborationCreateDto,
  PartnerCollaborationUpdateDto,
  CollaborationType,
  Partner,
} from "@/types/partnerCollaboration";
import type { PagedResultDto } from "@/types/common";

export default function PartnerCollaborationPage() {
  // Data states
  const [collaborations, setCollaborations] = useState<CollaborationViewList[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCollaboration, setSelectedCollaboration] =
    useState<CollaborationDetailDto | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [createForm, setCreateForm] = useState<PartnerCollaborationCreateDto>({
    organizationId: 0,
    partnerId: 0,
    typeId: 0,
    collaborationName: "",
    description: "",
    objectives: "",
    startDate: "",
    endDate: "",
    status: "Đang thương thảo",
    budget: 0,
    currency: "VND",
  });

  const [editForm, setEditForm] = useState<PartnerCollaborationUpdateDto>({
    collaborationId: 0,
    collaborationName: "",
    description: "",
    objectives: "",
    startDate: "",
    endDate: "",
    status: "Đang thương thảo",
    budget: 0,
    currency: "VND",
  });

  // Lookup data
  const [collaborationTypes, setCollaborationTypes] = useState<
    CollaborationType[]
  >([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loadingLookupData, setLoadingLookupData] = useState(false);

  // Data fetching functions
  const loadCollaborations = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await partnerCollaborationService.getList(
        currentPage,
        pageSize
      );
      setCollaborations(result.items);
      setTotalPages(result.totalPages || Math.ceil(result.totalCount / pageSize));
      setTotalItems(result.totalCount);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load collaborations";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadLookupData = async () => {
    try {
      setLoadingLookupData(true);
      const [typesResult, partnersResult] = await Promise.all([
        partnerCollaborationService.getCollaborationTypes(),
        partnerCollaborationService.getPartnersForSelection(),
      ]);
      setCollaborationTypes(typesResult);
      setPartners(partnersResult);
    } catch (err) {
      console.error("Failed to load lookup data:", err);
      toast.error("Failed to load form data");
    } finally {
      setLoadingLookupData(false);
    }
  };

  const loadCollaborationDetail = async (id: number) => {
    try {
      const detail = await partnerCollaborationService.getCollaborationDetail(id);
      setSelectedCollaboration(detail);
      setIsDetailDialogOpen(true);
    } catch (err) {
      toast.error("Failed to load collaboration details");
    }
  };

  // Event handlers
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !createForm.collaborationName ||
      !createForm.partnerId ||
      !createForm.typeId
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      await partnerCollaborationService.createCollaboration(createForm);
      toast.success("Collaboration created successfully!");
      setIsCreateDialogOpen(false);
      resetCreateForm();
      loadCollaborations();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create collaboration";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCollaboration = async (id: number) => {
    if (!confirm("Are you sure you want to delete this collaboration?")) return;

    try {
      await partnerCollaborationService.deleteCollaboration(id);
      toast.success("Collaboration deleted successfully!");
      loadCollaborations();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete collaboration";
      toast.error(errorMessage);
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      organizationId: 0,
      partnerId: 0,
      typeId: 0,
      collaborationName: "",
      description: "",
      objectives: "",
      startDate: "",
      endDate: "",
      status: "Đang thương thảo",
      budget: 0,
      currency: "VND",
    });
  };

  // Filter collaborations based on search term
  const filteredCollaborations = collaborations.filter(
    (collaboration) =>
      collaboration.collaborationName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      collaboration.partnerName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      collaboration.typeName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status badge component
  const getStatusBadge = (status?: string) => {
    const statusMap: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      "Đang thương thảo": { variant: "outline", label: "Đang thương thảo" },
      "Đã ký kết": { variant: "default", label: "Đã ký kết" },
      "Đang thực hiện": { variant: "secondary", label: "Đang thực hiện" },
      "Hoàn thành": { variant: "default", label: "Hoàn thành" },
      "Đã hủy": { variant: "destructive", label: "Đã hủy" },
    };

    const statusInfo = statusMap[status || ""] || {
      variant: "outline",
      label: status || "Không xác định",
    };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  // Load data on component mount
  useEffect(() => {
    loadCollaborations();
    loadLookupData();
  }, [currentPage]);

  // Handle search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        loadCollaborations();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  if (loading && collaborations.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error && collaborations.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadCollaborations}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Quản lý Hợp tác Đối tác</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2">
          <Input
            placeholder="Tìm kiếm hợp tác..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm hợp tác mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleCreateSubmit}>
              <DialogHeader>
                <DialogTitle>Thêm hợp tác đối tác mới</DialogTitle>
                <DialogDescription>
                  Tạo quan hệ hợp tác mới với đối tác.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="partner">Đối tác *</Label>
                  <Select
                    value={createForm.partnerId.toString()}
                    onValueChange={(value) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        partnerId: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn đối tác" />
                    </SelectTrigger>
                    <SelectContent>
                      {partners.map((partner) => (
                        <SelectItem
                          key={partner.partnerId}
                          value={partner.partnerId.toString()}
                        >
                          {partner.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Loại hợp tác *</Label>
                  <Select
                    value={createForm.typeId.toString()}
                    onValueChange={(value) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        typeId: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại hợp tác" />
                    </SelectTrigger>
                    <SelectContent>
                      {collaborationTypes.map((type) => (
                        <SelectItem
                          key={type.typeId}
                          value={type.typeId.toString()}
                        >
                          {type.typeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Tên hợp tác *</Label>
                  <Input
                    id="name"
                    value={createForm.collaborationName}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        collaborationName: e.target.value,
                      }))
                    }
                    placeholder="Nhập tên hợp tác"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={createForm.description}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Mô tả chi tiết về hợp tác"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Ngày bắt đầu</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={createForm.startDate}
                      onChange={(e) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">Ngày kết thúc</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={createForm.endDate}
                      onChange={(e) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Tạo hợp tác
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách hợp tác đối tác</CardTitle>
          <CardDescription>
            Quản lý tất cả các hợp tác với các đối tác của tổ chức.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && collaborations.length === 0 ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên hợp tác</TableHead>
                    <TableHead>Đối tác</TableHead>
                    <TableHead>Loại hợp tác</TableHead>
                    <TableHead>Ngày bắt đầu</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCollaborations.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        {searchTerm
                          ? "Không tìm thấy hợp tác nào phù hợp"
                          : "Chưa có hợp tác nào"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCollaborations.map((collaboration) => (
                      <TableRow key={collaboration.collaborationId}>
                        <TableCell className="font-medium">
                          {collaboration.collaborationName}
                        </TableCell>
                        <TableCell>{collaboration.partnerName}</TableCell>
                        <TableCell>{collaboration.typeName}</TableCell>
                        <TableCell>
                          {collaboration.startDate
                            ? new Date(
                                collaboration.startDate
                              ).toLocaleDateString("vi-VN")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(collaboration.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                loadCollaborationDetail(
                                  collaboration.collaborationId
                                )
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // TODO: Implement edit functionality
                                toast.info(
                                  "Chức năng chỉnh sửa đang được phát triển"
                                );
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteCollaboration(
                                  collaboration.collaborationId
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {(currentPage - 1) * pageSize + 1} đến{" "}
                    {Math.min(currentPage * pageSize, totalItems)} của{" "}
                    {totalItems} hợp tác
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết hợp tác</DialogTitle>
          </DialogHeader>
          {selectedCollaboration && (
            <div className="grid gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Tên hợp tác
                </Label>
                <p className="text-sm">
                  {selectedCollaboration.collaborationName}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Đối tác
                </Label>
                <p className="text-sm">{selectedCollaboration.partnerName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Loại hợp tác
                </Label>
                <p className="text-sm">{selectedCollaboration.typeName}</p>
              </div>
              {selectedCollaboration.description && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Mô tả
                  </Label>
                  <p className="text-sm">{selectedCollaboration.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Ngày bắt đầu
                  </Label>
                  <p className="text-sm">
                    {selectedCollaboration.startDate
                      ? new Date(
                          selectedCollaboration.startDate
                        ).toLocaleDateString("vi-VN")
                      : "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Ngày kết thúc
                  </Label>
                  <p className="text-sm">
                    {selectedCollaboration.endDate
                      ? new Date(
                          selectedCollaboration.endDate
                        ).toLocaleDateString("vi-VN")
                      : "-"}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Trạng thái
                </Label>
                <div className="mt-1">
                  {getStatusBadge(selectedCollaboration.status)}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
