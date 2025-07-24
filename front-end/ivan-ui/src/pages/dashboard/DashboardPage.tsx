import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/auth";
import VolunteerDashboard from "../volunteer/VolunteerDashboard";
import OrganizationDashboard from "../organization/OrganizationDashboard";
import CoordinatorDashboard from "../coordinator/CoordinatorDashboard";
import AdminDashboard from "../admin/AdminDashboard";
import PartnerDashboard from "../partner/PartnerDashboard";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy thông tin người dùng
          </h2>
          <p className="text-gray-600">Vui lòng đăng nhập lại</p>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case UserRole.VOLUNTEER:
      return <VolunteerDashboard />;
    case UserRole.ORGANIZATION:
      return <OrganizationDashboard />;
    case UserRole.COORDINATOR:
      return <CoordinatorDashboard />;
    case UserRole.ADMIN:
      return <AdminDashboard />;
    case UserRole.PARTNER:
      return <PartnerDashboard />;
    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Vai trò không hợp lệ
            </h2>
            <p className="text-gray-600">
              Vai trò "{user.role}" không được hỗ trợ
            </p>
          </div>
        </div>
      );
  }
}
