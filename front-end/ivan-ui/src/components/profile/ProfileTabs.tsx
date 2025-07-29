import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Settings,
  Shield,
  Award,
  Calendar,
  Users,
  Building2,
  FileText,
  BarChart3,
  History,
  Star,
  MapPin,
} from "lucide-react";

interface ProfileTabsProps {
  role: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isCurrentUser?: boolean;
  className?: string;
}

export default function ProfileTabs({
  role,
  activeTab = "info",
  onTabChange,
  isCurrentUser = false,
  className,
}: ProfileTabsProps) {
  const getTabsForRole = () => {
    const baseTabs = [
      {
        value: "info",
        label: "Thông tin chung",
        icon: <User className="w-4 h-4" />,
        description: "Thông tin cơ bản và liên hệ",
      },
    ];

    switch (role) {
      case "volunteer":
        return [
          ...baseTabs,
          {
            value: "skills",
            label: "Kỹ năng",
            icon: <Star className="w-4 h-4" />,
            description: "Kỹ năng và chuyên môn",
          },
          {
            value: "activity",
            label: "Hoạt động",
            icon: <Calendar className="w-4 h-4" />,
            description: "Lịch sử tham gia sự kiện",
          },
          {
            value: "certificates",
            label: "Chứng chỉ",
            icon: <Award className="w-4 h-4" />,
            description: "Chứng chỉ và thành tích",
          },
          ...(isCurrentUser
            ? [
                {
                  value: "settings",
                  label: "Cài đặt",
                  icon: <Settings className="w-4 h-4" />,
                  description: "Cài đặt tài khoản",
                },
              ]
            : []),
        ];

      case "organization":
        return [
          ...baseTabs,
          {
            value: "events",
            label: "Sự kiện",
            icon: <Calendar className="w-4 h-4" />,
            description: "Sự kiện đã tổ chức",
          },
          {
            value: "volunteers",
            label: "Tình nguyện viên",
            icon: <Users className="w-4 h-4" />,
            description: "Quản lý tình nguyện viên",
          },
          {
            value: "stats",
            label: "Thống kê",
            icon: <BarChart3 className="w-4 h-4" />,
            description: "Báo cáo và thống kê",
          },
          ...(isCurrentUser
            ? [
                {
                  value: "verification",
                  label: "Xác thực",
                  icon: <Shield className="w-4 h-4" />,
                  description: "Trạng thái xác thực",
                },
                {
                  value: "settings",
                  label: "Cài đặt",
                  icon: <Settings className="w-4 h-4" />,
                  description: "Cài đặt tổ chức",
                },
              ]
            : []),
        ];

      case "partner":
        return [
          ...baseTabs,
          {
            value: "collaborations",
            label: "Hợp tác",
            icon: <Building2 className="w-4 h-4" />,
            description: "Lịch sử hợp tác",
          },
          {
            value: "projects",
            label: "Dự án",
            icon: <FileText className="w-4 h-4" />,
            description: "Dự án đã thực hiện",
          },
          ...(isCurrentUser
            ? [
                {
                  value: "verification",
                  label: "Xác thực",
                  icon: <Shield className="w-4 h-4" />,
                  description: "Trạng thái xác thực",
                },
                {
                  value: "settings",
                  label: "Cài đặt",
                  icon: <Settings className="w-4 h-4" />,
                  description: "Cài đặt đối tác",
                },
              ]
            : []),
        ];

      case "coordinator":
        return [
          ...baseTabs,
          {
            value: "tasks",
            label: "Nhiệm vụ",
            icon: <FileText className="w-4 h-4" />,
            description: "Nhiệm vụ được giao",
          },
          {
            value: "schedule",
            label: "Lịch trình",
            icon: <Calendar className="w-4 h-4" />,
            description: "Lịch làm việc",
          },
          {
            value: "performance",
            label: "Hiệu suất",
            icon: <BarChart3 className="w-4 h-4" />,
            description: "Đánh giá hiệu suất",
          },
          ...(isCurrentUser
            ? [
                {
                  value: "settings",
                  label: "Cài đặt",
                  icon: <Settings className="w-4 h-4" />,
                  description: "Cài đặt cá nhân",
                },
              ]
            : []),
        ];

      case "admin":
        return [
          ...baseTabs,
          {
            value: "system",
            label: "Hệ thống",
            icon: <Settings className="w-4 h-4" />,
            description: "Quản lý hệ thống",
          },
          {
            value: "logs",
            label: "Nhật ký",
            icon: <History className="w-4 h-4" />,
            description: "Lịch sử hoạt động",
          },
          {
            value: "permissions",
            label: "Quyền hạn",
            icon: <Shield className="w-4 h-4" />,
            description: "Quản lý quyền",
          },
        ];

      default:
        return baseTabs;
    }
  };

  const tabs = getTabsForRole();

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 h-auto p-1 bg-gray-100">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
