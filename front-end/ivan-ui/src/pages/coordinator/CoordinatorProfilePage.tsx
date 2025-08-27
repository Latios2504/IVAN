import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { toast } from "sonner";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Settings,
  ClipboardList,
  BarChart3,
  Users,
  Clock,
  Edit,
  Camera,
  Award,
  Target,
  Save,
  X,
} from "lucide-react";
import { volunteerCoordinatorService } from "@/services/volunteerCoordinatorService";
import type { VolunteerCoordinatorDto, UpdateVolunteerCoordinatorDto } from "@/types/volunteerCoordinator";



export default function CoordinatorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<VolunteerCoordinatorDto | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState<UpdateVolunteerCoordinatorDto>({
    employeeId: "",
    position: "",
    department: "",
    responsibilities: "",
    hireDate: "",
    endDate: "",
    salary: undefined,
    managerId: undefined,
    isActive: true,
    notes: "",
  });
  const [availableManagers, setAvailableManagers] = useState<VolunteerCoordinatorDto[]>([]);

  // Determine if viewing current user's profile or someone else's
  const targetUserId = id ? parseInt(id, 10) : user?.id;
  const isCurrentUser = !id || user?.id === targetUserId;

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    loadCoordinatorProfile();
  }, [isAuthenticated, user, navigate, targetUserId]);

  const loadCoordinatorProfile = async () => {
    try {
      setLoading(true);
      let coordinatorData: VolunteerCoordinatorDto;
      
      if (targetUserId) {
        coordinatorData = await volunteerCoordinatorService.getCoordinatorByUserId(targetUserId);
      } else {
        throw new Error("Không tìm thấy thông tin người dùng");
      }
      
      setProfile(coordinatorData);
      
      // Initialize edit form with current data
      setEditForm({
        employeeId: coordinatorData.employeeId || "",
        position: coordinatorData.position || "",
        department: coordinatorData.department || "",
        responsibilities: coordinatorData.responsibilities || "",
        hireDate: coordinatorData.hireDate || "",
        endDate: coordinatorData.endDate || "",
        salary: coordinatorData.salary,
        managerId: coordinatorData.managerId,
        isActive: coordinatorData.isActive ?? true,
        notes: coordinatorData.notes || "",
      });
      
      // Load available managers if user has organization
      if (coordinatorData.organizationId) {
        try {
          const managers = await volunteerCoordinatorService.getAvailableManagers(coordinatorData.organizationId);
          setAvailableManagers(managers);
        } catch (error) {
          console.warn("Failed to load managers:", error);
        }
      }
    } catch (error) {
      console.error("Failed to load coordinator profile:", error);
      toast.error("Không thể tải thông tin hồ sơ điều phối viên");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!profile) return;
    
    try {
      setIsUpdating(true);
      
      // Validate form data
      const validationErrors = volunteerCoordinatorService.validateCoordinatorData(editForm);
      if (validationErrors.length > 0) {
        toast.error(`Lỗi xác thực: ${validationErrors.join(", ")}`);
        return;
      }
      
      const updatedCoordinator = await volunteerCoordinatorService.updateCoordinator(
        profile.coordinatorId,
        editForm
      );
      
      setProfile(updatedCoordinator);
      setIsEditModalOpen(false);
      
      toast.success("Cập nhật hồ sơ điều phối viên thành công");
    } catch (error) {
      console.error("Failed to update coordinator:", error);
      toast.error("Không thể cập nhật hồ sơ điều phối viên");
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditModal = () => {
    if (profile) {
      setEditForm({
        employeeId: profile.employeeId || "",
        position: profile.position || "",
        department: profile.department || "",
        responsibilities: profile.responsibilities || "",
        hireDate: profile.hireDate || "",
        endDate: profile.endDate || "",
        salary: profile.salary,
        managerId: profile.managerId,
        isActive: profile.isActive ?? true,
        notes: profile.notes || "",
      });
    }
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy hồ sơ</h2>
          <p className="text-gray-600">Hồ sơ điều phối viên không tồn tại hoặc đã bị xóa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-indigo-200 dark:border-indigo-800/50">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-800/50 dark:via-purple-800/50 dark:to-pink-800/50 rounded-full flex items-center justify-center border-2 border-indigo-200 dark:border-indigo-700/50">
                  {profile.user?.avatar ? (
                    <img
                      src={profile.user.avatar}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-indigo-600 dark:text-indigo-300" />
                  )}
                </div>
                {isCurrentUser && (
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {profile.user?.fullName || "Chưa cập nhật"}
                  </h1>
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-800/50 dark:to-purple-800/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/50"
                  >
                    <Briefcase className="w-3 h-3 mr-1" />
                    Điều phối viên
                  </Badge>
                  {profile.isActive && (
                    <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      Đang hoạt động
                    </Badge>
                  )}
                </div>
                <p className="text-indigo-600 dark:text-indigo-300">
                  {profile.position} tại {profile.organizationName}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-indigo-600 dark:text-indigo-300">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {profile.user?.email || "Chưa cập nhật"}
                  </div>
                  {profile.user?.phoneNumber && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {profile.user.phoneNumber}
                    </div>
                  )}
                  {profile.hireDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Tham gia từ {new Date(profile.hireDate).getFullYear()}
                    </div>
                  )}
                  {profile.employeeId && (
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {profile.employeeId}
                    </div>
                  )}
                </div>
              </div>

              {isCurrentUser && (
                <Button 
                  onClick={openEditModal}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg transition-all duration-300"
                >
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa hồ sơ
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-1 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border border-indigo-200 dark:border-indigo-800/50">
            <TabsTrigger value="info" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-800/50 dark:hover:to-purple-800/50 transition-all duration-300">Thông tin</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-indigo-200 dark:border-indigo-800/50">
                <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/30 dark:to-purple-900/30">
                  <CardTitle className="text-indigo-700 dark:text-indigo-300">Thông tin cá nhân</CardTitle>
                  <CardDescription className="text-indigo-600 dark:text-indigo-400">
                    Thông tin cơ bản của điều phối viên
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Họ và tên</p>
                      <p className="text-gray-600">{profile.user?.fullName || "Chưa cập nhật"}</p>
                    </div>
                  </div>
                  {profile.employeeId && (
                    <div className="flex items-center space-x-3">
                      <Briefcase className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Mã nhân viên</p>
                        <p className="text-gray-600">{profile.employeeId || "Chưa cập nhật"}</p>
                      </div>
                    </div>
                  )}
                  {profile.hireDate && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Ngày tuyển dụng</p>
                        <p className="text-gray-600">
                          {profile.hireDate ? new Date(profile.hireDate).toLocaleDateString('vi-VN') : "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-gray-500" />
                    <div>
                        <p className="text-sm font-medium">Chức vụ</p>
                        <p className="text-gray-600">{profile.position || "Chưa cập nhật"}</p>
                      </div>
                  </div>
                  {profile.department && (
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Phòng ban</p>
                        <p className="text-gray-600">{profile.department || "Chưa cập nhật"}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-indigo-200 dark:border-indigo-800/50">
                <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/30 dark:to-purple-900/30">
                  <CardTitle className="text-indigo-700 dark:text-indigo-300">Thông tin liên hệ</CardTitle>
                  <CardDescription className="text-indigo-600 dark:text-indigo-400">
                    Thông tin liên lạc và tổ chức
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-gray-600">{profile.user?.email || "Chưa cập nhật"}</p>
                    </div>
                  </div>
                  {profile.user?.phoneNumber && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Số điện thoại</p>
                        <p className="text-gray-600">{profile.user?.phoneNumber || "Chưa cập nhật"}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Tổ chức</p>
                      <p className="text-gray-600">
                        {profile.organizationName || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                  {profile.updatedAt && (
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Cập nhật lần cuối</p>
                        <p className="text-gray-600">
                          {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString('vi-VN') : "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.salary && (
                    <div className="flex items-center space-x-3">
                      <Briefcase className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Lương</p>
                        <p className="text-gray-600">
                          {profile.salary.toLocaleString("vi-VN")} VNĐ
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-indigo-200 dark:border-indigo-800/50">
                <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/30 dark:to-purple-900/30">
                  <CardTitle className="text-indigo-700 dark:text-indigo-300">Thống kê hoạt động</CardTitle>
                  <CardDescription className="text-indigo-600 dark:text-indigo-400">
                    Số liệu về hiệu suất làm việc
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Trạng thái</span>
                    <Badge variant={profile.isActive ? "default" : "secondary"}>
                      {profile.isActive ? "Đang hoạt động" : "Không hoạt động"}
                    </Badge>
                  </div>
                  {profile.createdAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Ngày tạo</span>
                      <Badge variant="outline">
                        {new Date(profile.createdAt).toLocaleDateString("vi-VN")}
                      </Badge>
                    </div>
                  )}
                  {profile.manager && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Quản lý bởi</span>
                      <Badge variant="outline">
                        {profile.manager.fullName}
                      </Badge>
                    </div>
                  )}
                  {profile.endDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Ngày kết thúc</span>
                      <Badge variant="outline">
                        {new Date(profile.endDate).toLocaleDateString("vi-VN")}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Responsibilities */}
              <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-indigo-200 dark:border-indigo-800/50">
                <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/30 dark:to-purple-900/30">
                  <CardTitle className="text-indigo-700 dark:text-indigo-300">Trách nhiệm</CardTitle>
                  <CardDescription className="text-indigo-600 dark:text-indigo-400">
                    Mô tả công việc và trách nhiệm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {profile.responsibilities || "Chưa có mô tả trách nhiệm"}
                  </p>
                  {profile.notes && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-2">Ghi chú:</p>
                      <p className="text-gray-600 whitespace-pre-wrap text-sm">
                        {profile.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>


        </Tabs>

        {/* Edit Profile Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Chỉnh sửa hồ sơ điều phối viên
              </DialogTitle>
              <DialogDescription>
                Cập nhật thông tin công việc và trách nhiệm của điều phối viên
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Mã nhân viên</Label>
                  <Input
                    id="employeeId"
                    value={editForm.employeeId || ""}
                    onChange={(e) => setEditForm({ ...editForm, employeeId: e.target.value })}
                    placeholder="Nhập mã nhân viên"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Chức vụ</Label>
                  <Input
                    id="position"
                    value={editForm.position || ""}
                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                    placeholder="Nhập chức vụ"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Phòng ban</Label>
                  <Input
                    id="department"
                    value={editForm.department || ""}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    placeholder="Nhập phòng ban"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Lương (VNĐ)</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={editForm.salary || ""}
                    onChange={(e) => setEditForm({ ...editForm, salary: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Nhập mức lương"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hireDate">Ngày tuyển dụng</Label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={editForm.hireDate || ""}
                    onChange={(e) => setEditForm({ ...editForm, hireDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Ngày kết thúc</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={editForm.endDate || ""}
                    onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="managerId">Quản lý</Label>
                  <Select
                    value={editForm.managerId?.toString() || "none"}
                    onValueChange={(value) => setEditForm({ ...editForm, managerId: value === "none" ? undefined : Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn người quản lý" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không có</SelectItem>
                      {availableManagers.map((manager) => (
                        <SelectItem key={manager.coordinatorId} value={manager.coordinatorId.toString()}>
                          {manager.user?.fullName || `Coordinator ${manager.coordinatorId}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isActive">Trạng thái</Label>
                  <Select
                    value={editForm.isActive?.toString() || "true"}
                    onValueChange={(value) => setEditForm({ ...editForm, isActive: value === "true" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Đang hoạt động</SelectItem>
                      <SelectItem value="false">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibilities">Trách nhiệm</Label>
                <Textarea
                  id="responsibilities"
                  value={editForm.responsibilities || ""}
                  onChange={(e) => setEditForm({ ...editForm, responsibilities: e.target.value })}
                  placeholder="Mô tả trách nhiệm và công việc"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  value={editForm.notes || ""}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Ghi chú thêm"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isUpdating}
              >
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
              <Button
                type="button"
                onClick={handleEditSubmit}
                disabled={isUpdating}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                {isUpdating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isUpdating ? "Đang cập nhật..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
