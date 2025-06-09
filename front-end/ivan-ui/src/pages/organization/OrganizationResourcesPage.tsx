import { useState } from "react";
import {
  Package,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Eye,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrganizationResource {
  id: string;
  name: string;
  type: "venue" | "equipment" | "funding" | "expertise" | "materials";
  description: string;
  availability: "available" | "reserved" | "maintenance" | "unavailable";
  quantity?: number;
  unit?: string;
  estimatedValue?: number;
  location?: string;
  contactPerson?: string;
  contactPhone?: string;
  lastUsed?: string;
  nextAvailable?: string;
  conditions?: string;
}

interface ResourceFormData {
  name: string;
  type: OrganizationResource["type"];
  description: string;
  quantity: number;
  unit: string;
  estimatedValue: number;
  location: string;
  contactPerson: string;
  contactPhone: string;
  conditions: string;
}

const mockResources: OrganizationResource[] = [
  {
    id: "1",
    name: "Hội trường A",
    type: "venue",
    description: "Hội trường lớn, sức chứa 200 người, có âm thanh và máy chiếu",
    availability: "available",
    quantity: 1,
    unit: "phòng",
    estimatedValue: 2000000,
    location: "Tầng 2, Tòa nhà A",
    contactPerson: "Nguyễn Văn A",
    contactPhone: "0901234567",
    conditions: "Cần đặt trước 1 tuần",
  },
  {
    id: "2",
    name: "Máy tính xách tay",
    type: "equipment",
    description: "Máy tính xách tay Dell Latitude, cấu hình mạnh",
    availability: "reserved",
    quantity: 10,
    unit: "chiếc",
    estimatedValue: 15000000,
    location: "Kho thiết bị",
    contactPerson: "Trần Thị B",
    contactPhone: "0912345678",
    lastUsed: "2024-12-10",
    nextAvailable: "2024-12-20",
    conditions: "Cần kiểm tra trước khi sử dụng",
  },
  {
    id: "3",
    name: "Quỹ hỗ trợ sự kiện",
    type: "funding",
    description: "Ngân sách hỗ trợ cho các hoạt động tình nguyện",
    availability: "available",
    quantity: 50000000,
    unit: "VND",
    estimatedValue: 50000000,
    contactPerson: "Lê Văn C",
    contactPhone: "0923456789",
    conditions: "Tối đa 5 triệu VND/sự kiện",
  },
  {
    id: "4",
    name: "Đào tạo kỹ năng mềm",
    type: "expertise",
    description: "Chuyên gia đào tạo kỹ năng giao tiếp và làm việc nhóm",
    availability: "available",
    quantity: 1,
    unit: "khóa học",
    contactPerson: "Phạm Thị D",
    contactPhone: "0934567890",
    conditions: "Lịch cần được sắp xếp trước 2 tuần",
  },
];

export default function OrganizationResourcesPage() {
  const [resources] = useState<OrganizationResource[]>(mockResources);
  const [selectedTab, setSelectedTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] =
    useState<OrganizationResource | null>(null);
  const [formData, setFormData] = useState<ResourceFormData>({
    name: "",
    type: "equipment",
    description: "",
    quantity: 1,
    unit: "",
    estimatedValue: 0,
    location: "",
    contactPerson: "",
    contactPhone: "",
    conditions: "",
  });

  const getAvailabilityBadge = (
    availability: OrganizationResource["availability"]
  ) => {
    switch (availability) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Có sẵn</Badge>;
      case "reserved":
        return <Badge className="bg-yellow-100 text-yellow-800">Đã đặt</Badge>;
      case "maintenance":
        return <Badge className="bg-blue-100 text-blue-800">Bảo trì</Badge>;
      case "unavailable":
        return <Badge className="bg-red-100 text-red-800">Không có sẵn</Badge>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: OrganizationResource["type"]) => {
    switch (type) {
      case "venue":
        return <MapPin className="h-4 w-4" />;
      case "equipment":
        return <Package className="h-4 w-4" />;
      case "funding":
        return <DollarSign className="h-4 w-4" />;
      case "expertise":
        return <Users className="h-4 w-4" />;
      case "materials":
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: OrganizationResource["type"]) => {
    switch (type) {
      case "venue":
        return "Địa điểm";
      case "equipment":
        return "Thiết bị";
      case "funding":
        return "Tài trợ";
      case "expertise":
        return "Chuyên môn";
      case "materials":
        return "Vật liệu";
      default:
        return "Khác";
    }
  };

  const filteredResources = resources.filter((resource) => {
    if (selectedTab === "all") return true;
    return resource.type === selectedTab;
  });

  const handleCreateResource = () => {
    console.log("Tạo tài nguyên:", formData);
    setIsCreateDialogOpen(false);
    // Reset form
    setFormData({
      name: "",
      type: "equipment",
      description: "",
      quantity: 1,
      unit: "",
      estimatedValue: 0,
      location: "",
      contactPerson: "",
      contactPhone: "",
      conditions: "",
    });
  };

  const handleViewResource = (resource: OrganizationResource) => {
    setSelectedResource(resource);
    setIsViewDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getTotalValue = () => {
    return resources.reduce(
      (sum, resource) => sum + (resource.estimatedValue || 0),
      0
    );
  };

  const getAvailableResources = () => {
    return resources.filter((resource) => resource.availability === "available")
      .length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Quản lý tài nguyên</h1>
            <p className="text-gray-600 mt-2">
              Quản lý các tài nguyên có sẵn của tổ chức
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm tài nguyên
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng tài nguyên
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resources.length}</div>
              <p className="text-xs text-muted-foreground">
                Tất cả tài nguyên có sẵn
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Có sẵn</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {getAvailableResources()}
              </div>
              <p className="text-xs text-muted-foreground">Sẵn sàng sử dụng</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Giá trị ước tính
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(getTotalValue())}
              </div>
              <p className="text-xs text-muted-foreground">
                Tổng giá trị tài nguyên
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Đang sử dụng
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resources.filter((r) => r.availability === "reserved").length}
              </div>
              <p className="text-xs text-muted-foreground">Đã được đặt trước</p>
            </CardContent>
          </Card>
        </div>

        {/* Resource Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="venue">Địa điểm</TabsTrigger>
            <TabsTrigger value="equipment">Thiết bị</TabsTrigger>
            <TabsTrigger value="funding">Tài trợ</TabsTrigger>
            <TabsTrigger value="expertise">Chuyên môn</TabsTrigger>
            <TabsTrigger value="materials">Vật liệu</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách tài nguyên</CardTitle>
                <CardDescription>
                  {filteredResources.length} tài nguyên được tìm thấy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên tài nguyên</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Giá trị</TableHead>
                      <TableHead>Người liên hệ</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{resource.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {resource.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(resource.type)}
                            <span className="text-sm">
                              {getTypeName(resource.type)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {resource.quantity} {resource.unit}
                        </TableCell>
                        <TableCell>
                          {getAvailabilityBadge(resource.availability)}
                        </TableCell>
                        <TableCell>
                          {resource.estimatedValue
                            ? formatCurrency(resource.estimatedValue)
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm font-medium">
                              {resource.contactPerson}
                            </div>
                            <div className="text-sm text-gray-500">
                              {resource.contactPhone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewResource(resource)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Xem
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Sửa
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Resource Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm tài nguyên mới</DialogTitle>
              <DialogDescription>
                Thêm tài nguyên mới vào danh sách của tổ chức
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên tài nguyên</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Nhập tên tài nguyên"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Loại tài nguyên</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: OrganizationResource["type"]) =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="venue">Địa điểm</SelectItem>
                      <SelectItem value="equipment">Thiết bị</SelectItem>
                      <SelectItem value="funding">Tài trợ</SelectItem>
                      <SelectItem value="expertise">Chuyên môn</SelectItem>
                      <SelectItem value="materials">Vật liệu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Mô tả chi tiết về tài nguyên"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Số lượng</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        quantity: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Đơn vị</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, unit: e.target.value }))
                    }
                    placeholder="chiếc, phòng, VND..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Giá trị (VND)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.estimatedValue}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        estimatedValue: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Vị trí</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    placeholder="Vị trí hoặc nơi bảo quản"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Người phụ trách</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactPerson: e.target.value,
                      }))
                    }
                    placeholder="Tên người phụ trách"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Số điện thoại</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactPhone: e.target.value,
                      }))
                    }
                    placeholder="0901234567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conditions">Điều kiện sử dụng</Label>
                  <Input
                    id="conditions"
                    value={formData.conditions}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        conditions: e.target.value,
                      }))
                    }
                    placeholder="Cần đặt trước, giới hạn sử dụng..."
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleCreateResource}>Thêm tài nguyên</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Resource Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedResource?.name}</DialogTitle>
              <DialogDescription>
                Chi tiết thông tin tài nguyên
              </DialogDescription>
            </DialogHeader>
            {selectedResource && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Loại tài nguyên
                    </Label>
                    <p className="text-sm text-gray-600">
                      {getTypeName(selectedResource.type)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Trạng thái</Label>
                    <div className="mt-1">
                      {getAvailabilityBadge(selectedResource.availability)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Số lượng</Label>
                    <p className="text-sm text-gray-600">
                      {selectedResource.quantity} {selectedResource.unit}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Giá trị ước tính
                    </Label>
                    <p className="text-sm text-gray-600">
                      {selectedResource.estimatedValue
                        ? formatCurrency(selectedResource.estimatedValue)
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Mô tả</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedResource.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Vị trí</Label>
                    <p className="text-sm text-gray-600">
                      {selectedResource.location || "Không có"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Người phụ trách
                    </Label>
                    <p className="text-sm text-gray-600">
                      {selectedResource.contactPerson || "Không có"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Số điện thoại</Label>
                    <p className="text-sm text-gray-600">
                      {selectedResource.contactPhone || "Không có"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Điều kiện sử dụng
                    </Label>
                    <p className="text-sm text-gray-600">
                      {selectedResource.conditions || "Không có"}
                    </p>
                  </div>
                </div>
                {selectedResource.lastUsed && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Lần sử dụng cuối
                      </Label>
                      <p className="text-sm text-gray-600">
                        {selectedResource.lastUsed}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Có sẵn trở lại
                      </Label>
                      <p className="text-sm text-gray-600">
                        {selectedResource.nextAvailable || "Chưa xác định"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Đóng
              </Button>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
