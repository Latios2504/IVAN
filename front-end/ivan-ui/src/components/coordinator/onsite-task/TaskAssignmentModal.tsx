import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  UserMinus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskStatusBadge from "../../volunteer/onsite-task/TaskStatusBadge";
import type { OnSiteTaskDto } from "@/types/onSiteTask";

// Mock volunteer interface - replace with actual volunteer type
interface Volunteer {
  volunteerId: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  skills?: string[];
  experience?: string;
  availability?: string;
  isAssigned?: boolean;
  assignmentDate?: string;
}

interface TaskAssignmentModalProps {
  task: OnSiteTaskDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (taskId: number, volunteerIds: number[]) => Promise<void>;
  onUnassign: (taskId: number, volunteerIds: number[]) => Promise<void>;
  loading?: boolean;
}

const TaskAssignmentModal: React.FC<TaskAssignmentModalProps> = ({
  task,
  open,
  onOpenChange,
  onAssign,
  onUnassign,
  loading = false,
}) => {
  // Mock volunteers data - replace with actual API call
  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    {
      volunteerId: 1,
      fullName: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phoneNumber: "0123456789",
      skills: ["Tổ chức sự kiện", "Giao tiếp"],
      experience: "2 năm kinh nghiệm tình nguyện",
      availability: "Cuối tuần",
    },
    {
      volunteerId: 2,
      fullName: "Trần Thị B",
      email: "tranthib@email.com",
      phoneNumber: "0987654321",
      skills: ["Y tế", "Sơ cứu"],
      experience: "3 năm kinh nghiệm y tế",
      availability: "Linh hoạt",
    },
    {
      volunteerId: 3,
      fullName: "Lê Văn C",
      email: "levanc@email.com",
      skills: ["Kỹ thuật", "Âm thanh"],
      experience: "1 năm kinh nghiệm kỹ thuật",
      availability: "Buổi tối",
    },
  ]);

  // Mock assigned volunteers - replace with actual API call to get assigned volunteers
  const [assignedVolunteers, setAssignedVolunteers] = useState<Volunteer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [selectedVolunteers, setSelectedVolunteers] = useState<number[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [activeTab, setActiveTab] = useState<"available" | "assigned">(
    "available"
  );

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setSearchTerm("");
      setSkillFilter("all");
      setAvailabilityFilter("all");
      setSelectedVolunteers([]);
      setActiveTab("available");
      // TODO: Load assigned volunteers from API
      setAssignedVolunteers([]);
    }
  }, [open]);

  // Get available volunteers (not assigned to this task)
  const availableVolunteers = volunteers.filter(
    (volunteer) =>
      !assignedVolunteers.some((av) => av.volunteerId === volunteer.volunteerId)
  );

  // Filter volunteers based on search and filters
  const filterVolunteers = (volunteerList: Volunteer[]) => {
    return volunteerList.filter((volunteer) => {
      const matchesSearch =
        volunteer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSkill =
        skillFilter === "all" ||
        (volunteer.skills &&
          volunteer.skills.some((skill) =>
            skill.toLowerCase().includes(skillFilter.toLowerCase())
          ));

      const matchesAvailability =
        availabilityFilter === "all" ||
        volunteer.availability === availabilityFilter;

      return matchesSearch && matchesSkill && matchesAvailability;
    });
  };

  const filteredAvailableVolunteers = filterVolunteers(availableVolunteers);
  const filteredAssignedVolunteers = filterVolunteers(assignedVolunteers);

  // Get unique skills for filter
  const allSkills = volunteers.flatMap((v) => v.skills || []);
  const uniqueSkills = [...new Set(allSkills)];

  const handleAssignVolunteer = async (volunteerId: number) => {
    setIsAssigning(true);
    try {
      await onAssign(task.taskId, [volunteerId]);
      // Move volunteer from available to assigned
      const volunteer = volunteers.find((v) => v.volunteerId === volunteerId);
      if (volunteer) {
        setAssignedVolunteers((prev) => [...prev, volunteer]);
      }
    } catch (error) {
      console.error("Error assigning volunteer:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassignVolunteer = async (volunteerId: number) => {
    setIsAssigning(true);
    try {
      await onUnassign(task.taskId, [volunteerId]);
      // Remove volunteer from assigned list
      setAssignedVolunteers((prev) =>
        prev.filter((v) => v.volunteerId !== volunteerId)
      );
    } catch (error) {
      console.error("Error unassigning volunteer:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleBulkAssign = async () => {
    if (selectedVolunteers.length === 0) return;

    setIsAssigning(true);
    try {
      await onAssign(task.taskId, selectedVolunteers);
      // Move selected volunteers to assigned list
      const volunteersToAssign = volunteers.filter((v) =>
        selectedVolunteers.includes(v.volunteerId)
      );
      setAssignedVolunteers((prev) => [...prev, ...volunteersToAssign]);
      setSelectedVolunteers([]);
    } catch (error) {
      console.error("Error bulk assigning volunteers:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleBulkUnassign = async () => {
    if (selectedVolunteers.length === 0) return;

    setIsAssigning(true);
    try {
      await onUnassign(task.taskId, selectedVolunteers);
      // Remove selected volunteers from assigned list
      setAssignedVolunteers((prev) =>
        prev.filter((v) => !selectedVolunteers.includes(v.volunteerId))
      );
      setSelectedVolunteers([]);
    } catch (error) {
      console.error("Error bulk unassigning volunteers:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  const toggleVolunteerSelection = (volunteerId: number) => {
    setSelectedVolunteers((prev) =>
      prev.includes(volunteerId)
        ? prev.filter((id) => id !== volunteerId)
        : [...prev, volunteerId]
    );
  };

  const selectAllVolunteers = (volunteerList: Volunteer[]) => {
    const volunteerIds = volunteerList.map((v) => v.volunteerId);
    setSelectedVolunteers(volunteerIds);
  };

  const clearSelection = () => {
    setSelectedVolunteers([]);
  };

  const formatDateTime = (dateTime?: string) => {
    if (!dateTime) return "Chưa xác định";
    return new Date(dateTime).toLocaleString("vi-VN");
  };

  const getAssignmentStatus = () => {
    const assigned = assignedVolunteers.length;
    const required = task.requiredVolunteers || 0;

    if (assigned === 0) {
      return { color: "text-red-600", text: "Chưa phân công", icon: XCircle };
    } else if (assigned < required) {
      return {
        color: "text-yellow-600",
        text: "Thiếu người",
        icon: AlertCircle,
      };
    } else {
      return { color: "text-green-600", text: "Đủ người", icon: CheckCircle };
    }
  };

  const status = getAssignmentStatus();
  const StatusIcon = status.icon;

  const VolunteerCard: React.FC<{
    volunteer: Volunteer;
    isAssigned: boolean;
  }> = ({ volunteer, isAssigned }) => (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={selectedVolunteers.includes(volunteer.volunteerId)}
            onCheckedChange={() =>
              toggleVolunteerSelection(volunteer.volunteerId)
            }
          />
          <div>
            <h4 className="font-medium">{volunteer.fullName}</h4>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Mail className="w-3 h-3" />
              <span>{volunteer.email}</span>
            </div>
            {volunteer.phoneNumber && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Phone className="w-3 h-3" />
                <span>{volunteer.phoneNumber}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {isAssigned ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleUnassignVolunteer(volunteer.volunteerId)}
              disabled={isAssigning}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <UserMinus className="w-4 h-4 mr-1" />
              Hủy phân công
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => handleAssignVolunteer(volunteer.volunteerId)}
              disabled={isAssigning}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Phân công
            </Button>
          )}
        </div>
      </div>

      {volunteer.skills && volunteer.skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {volunteer.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      )}

      {volunteer.experience && (
        <p className="text-sm text-muted-foreground">
          <strong>Kinh nghiệm:</strong> {volunteer.experience}
        </p>
      )}

      {volunteer.availability && (
        <p className="text-sm text-muted-foreground">
          <strong>Khả năng tham gia:</strong> {volunteer.availability}
        </p>
      )}

      {isAssigned && volunteer.assignmentDate && (
        <p className="text-sm text-green-600">
          <strong>Được phân công:</strong>{" "}
          {formatDateTime(volunteer.assignmentDate)}
        </p>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl text-orange-700 dark:text-orange-300">
              Phân công tình nguyện viên
            </DialogTitle>
            <DialogDescription className="text-orange-600 dark:text-orange-400">
              Quản lý phân công tình nguyện viên cho nhiệm vụ: {task.taskName}
            </DialogDescription>
          </DialogHeader>

          {/* Task Summary */}
          <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Thời gian</p>
                  <p className="text-sm font-medium">
                    {formatDateTime(task.startTime)} -{" "}
                    {formatDateTime(task.endTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Địa điểm</p>
                  <p className="text-sm font-medium">{task.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Tình nguyện viên
                  </p>
                  <p className="text-sm font-medium">
                    {assignedVolunteers.length} / {task.requiredVolunteers}{" "}
                    người
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusIcon className={`w-4 h-4 ${status.color}`} />
                <div>
                  <p className="text-xs text-muted-foreground">Trạng thái</p>
                  <p className={`text-sm font-medium ${status.color}`}>
                    {status.text}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "available"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("available")}
            >
              Tình nguyện viên khả dụng ({filteredAvailableVolunteers.length})
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "assigned"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("assigned")}
            >
              Đã phân công ({filteredAssignedVolunteers.length})
            </button>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Lọc theo kỹ năng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả kỹ năng</SelectItem>
                  {uniqueSkills.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={availabilityFilter}
                onValueChange={setAvailabilityFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Lọc theo khả năng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="available">Có thể tham gia</SelectItem>
                  <SelectItem value="busy">Bận</SelectItem>
                  <SelectItem value="partial">Tham gia một phần</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedVolunteers.length > 0 && (
              <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Đã chọn {selectedVolunteers.length} tình nguyện viên
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={clearSelection}>
                    Bỏ chọn
                  </Button>
                  {activeTab === "available" && assignedVolunteers && (
                    <Button
                      size="sm"
                      onClick={handleBulkAssign}
                      disabled={isAssigning}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Phân công tất cả
                    </Button>
                  )}
                  {activeTab === "assigned" && assignedVolunteers && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleBulkUnassign}
                      disabled={isAssigning}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <UserMinus className="w-4 h-4 mr-1" />
                      Hủy phân công tất cả
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Volunteer List */}
          <ScrollArea className="flex-1 max-h-96">
            <div className="space-y-4">
              {activeTab === "available" && (
                <>
                  {filteredAvailableVolunteers.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {filteredAvailableVolunteers.length} tình nguyện viên
                        khả dụng
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          selectAllVolunteers(filteredAvailableVolunteers)
                        }
                      >
                        Chọn tất cả
                      </Button>
                    </div>
                  )}

                  {filteredAvailableVolunteers.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-muted-foreground">
                        {availableVolunteers.length === 0
                          ? "Tất cả tình nguyện viên đã được phân công"
                          : "Không tìm thấy tình nguyện viên phù hợp"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredAvailableVolunteers.map((volunteer) => (
                        <VolunteerCard
                          key={volunteer.volunteerId}
                          volunteer={volunteer}
                          isAssigned={false}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === "assigned" && (
                <>
                  {filteredAssignedVolunteers.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {filteredAssignedVolunteers.length} tình nguyện viên đã
                        phân công
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          selectAllVolunteers(filteredAssignedVolunteers)
                        }
                      >
                        Chọn tất cả
                      </Button>
                    </div>
                  )}

                  {filteredAssignedVolunteers.length === 0 ? (
                    <div className="text-center py-8">
                      <UserMinus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-muted-foreground">
                        {assignedVolunteers.length === 0
                          ? "Chưa có tình nguyện viên nào được phân công"
                          : "Không tìm thấy tình nguyện viên phù hợp"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredAssignedVolunteers.map((volunteer) => (
                        <VolunteerCard
                          key={volunteer.volunteerId}
                          volunteer={volunteer}
                          isAssigned={true}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Tổng: {assignedVolunteers.length} / {task.requiredVolunteers} tình
              nguyện viên
            </div>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default TaskAssignmentModal;
