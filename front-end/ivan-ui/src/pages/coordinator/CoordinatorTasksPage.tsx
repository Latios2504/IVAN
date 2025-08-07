import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Calendar,
  Building,
  FileText,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Mock data for coordinator dashboard
const mockCoordinatorData = {
  assignedOrganizations: [
    {
      id: "org_001",
      name: "Quỹ Tấm Lòng Việt",
      activeEvents: 3,
      volunteers: 45,
      pendingTasks: 2,
    },
    {
      id: "org_002",
      name: "Hội Chữ thập đỏ Việt Nam",
      activeEvents: 5,
      volunteers: 68,
      pendingTasks: 1,
    },
  ],
  tasks: [
    {
      id: "task_001",
      title: "Phê duyệt sự kiện 'Dạy máy tính cho trẻ em'",
      organizationName: "Quỹ Tấm Lòng Việt",
      priority: "high",
      status: "pending",
      dueDate: "2024-06-08",
      description: "Xem xét và phê duyệt sự kiện mới được tạo",
    },
    {
      id: "task_002",
      title: "Phân bổ tình nguyện viên cho sự kiện khẩn cấp",
      organizationName: "Hội Chữ thập đỏ Việt Nam",
      priority: "urgent",
      status: "in_progress",
      dueDate: "2024-06-07",
      description: "Hỗ trợ phân bổ tình nguyện viên cho hoạt động cứu trợ",
    },
    {
      id: "task_003",
      title: "Báo cáo hoạt động tháng 5",
      organizationName: "Quỹ Tấm Lòng Việt",
      priority: "medium",
      status: "completed",
      dueDate: "2024-06-05",
      description: "Tổng hợp báo cáo hoạt động tình nguyện tháng 5",
    },
  ],
  upcomingEvents: [
    {
      id: "evt_001",
      title: "Khám sức khỏe miễn phí",
      organizationName: "Hội Chữ thập đỏ Việt Nam",
      date: "2024-06-08",
      volunteersNeeded: 15,
      volunteersRegistered: 12,
      status: "needs_approval",
    },
    {
      id: "evt_002",
      title: "Dạy máy tính cho trẻ em",
      organizationName: "Quỹ Tấm Lòng Việt",
      date: "2024-06-10",
      volunteersNeeded: 8,
      volunteersRegistered: 8,
      status: "approved",
    },
  ],
  stats: {
    totalOrganizations: 2,
    totalVolunteers: 113,
    activeEvents: 8,
    completedTasksThisMonth: 12,
    pendingTasks: 3,
    overdueTasks: 0,
  },
};

export default function CoordinatorTasksPage() {
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "in_progress":
        return "Đang thực hiện";
      case "pending":
        return "Chờ xử lý";
      case "overdue":
        return "Quá hạn";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Điều phối viên - Quản lý nhiệm vụ
        </h1>
        <p className="text-gray-600">
          Quản lý các nhiệm vụ và tổ chức được phân công
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổ chức phụ trách
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCoordinatorData.stats.totalOrganizations}
            </div>
            <p className="text-xs text-muted-foreground">Đang hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nhiệm vụ chờ xử lý
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCoordinatorData.stats.pendingTasks}
            </div>
            <p className="text-xs text-muted-foreground">Cần xử lý ngay</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sự kiện đang quản lý
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCoordinatorData.stats.activeEvents}
            </div>
            <p className="text-xs text-muted-foreground">Sự kiện hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hiệu suất tháng này
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCoordinatorData.stats.completedTasksThisMonth}
            </div>
            <p className="text-xs text-muted-foreground">Nhiệm vụ hoàn thành</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tasks">Nhiệm vụ</TabsTrigger>
          <TabsTrigger value="organizations">Tổ chức</TabsTrigger>
          <TabsTrigger value="events">Sự kiện</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách nhiệm vụ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCoordinatorData.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      setSelectedTask(task.id === selectedTask ? null : task.id)
                    }
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(task.status)}
                          <h3 className="font-semibold">{task.title}</h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority === "urgent"
                              ? "Khẩn cấp"
                              : task.priority === "high"
                              ? "Cao"
                              : task.priority === "medium"
                              ? "Trung bình"
                              : "Thấp"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {task.organizationName}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Hạn: {formatDate(task.dueDate)}</span>
                          <span>Trạng thái: {getStatusText(task.status)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {task.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline">
                              Từ chối
                            </Button>
                            <Button size="sm">Phê duyệt</Button>
                          </>
                        )}
                        {task.status === "in_progress" && (
                          <Button size="sm">Hoàn thành</Button>
                        )}
                      </div>
                    </div>

                    {selectedTask === task.id && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-700">
                          {task.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockCoordinatorData.assignedOrganizations.map((org) => (
              <Card key={org.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {org.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-blue-600">
                        {org.activeEvents}
                      </div>
                      <div className="text-xs text-gray-500">Sự kiện</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-green-600">
                        {org.volunteers}
                      </div>
                      <div className="text-xs text-gray-500">
                        Tình nguyện viên
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-orange-600">
                        {org.pendingTasks}
                      </div>
                      <div className="text-xs text-gray-500">Nhiệm vụ chờ</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1">
                      Xem chi tiết
                    </Button>
                    <Button className="flex-1">Quản lý</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sự kiện sắp tới cần phê duyệt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCoordinatorData.upcomingEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {event.organizationName}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📅 {formatDate(event.date)}</span>
                          <span>
                            👥 {event.volunteersRegistered}/
                            {event.volunteersNeeded}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.status === "needs_approval" ? (
                          <Badge variant="secondary">Chờ phê duyệt</Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800">
                            Đã phê duyệt
                          </Badge>
                        )}
                        <Button size="sm">Xem chi tiết</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
