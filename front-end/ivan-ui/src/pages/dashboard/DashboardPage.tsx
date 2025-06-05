import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/auth";
import VolunteerDashboard from "./VolunteerDashboard";
import OrganizationDashboard from "./OrganizationDashboard";
import CoordinatorDashboard from "./CoordinatorDashboard";
import AdminDashboard from "./AdminDashboard";
import PartnerDashboard from "./PartnerDashboard";

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`}
              />
              <AvatarFallback className="text-lg">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Chào mừng, {user.fullName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-white ${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button asChild variant="outline">
              <Link to="/profile">Chỉnh sửa hồ sơ</Link>
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Hành động nhanh</CardTitle>
              <CardDescription>
                Các tính năng chính dành cho{" "}
                {getRoleLabel(user.role).toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.role === "volunteer" && (
                  <>
                    <Button asChild className="h-20 flex-col space-y-1">
                      <Link to="/events">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Tìm hoạt động</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-20 flex-col space-y-1"
                    >
                      <Link to="/my-registrations">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <span>Đăng ký của tôi</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-20 flex-col space-y-1"
                    >
                      <Link to="/my-schedule">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Lịch trình</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-20 flex-col space-y-1"
                    >
                      <Link to="/organizations">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        <span>Khám phá tổ chức</span>
                      </Link>
                    </Button>
                  </>
                )}

                {user.role === "organization" && (
                  <>
                    <Button asChild className="h-20 flex-col space-y-1">
                      <Link to="/create-event">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span>Tạo hoạt động</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-20 flex-col space-y-1"
                    >
                      <Link to="/my-events">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Quản lý hoạt động</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-20 flex-col space-y-1"
                    >
                      <Link to="/volunteers">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span>Tìm tình nguyện viên</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-20 flex-col space-y-1"
                    >
                      <Link to="/registrations">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                          />
                        </svg>
                        <span>Quản lý đăng ký</span>
                      </Link>
                    </Button>
                  </>
                )}

                {user.role === "admin" && (
                  <>
                    <Button asChild className="h-20 flex-col space-y-1">
                      <Link to="/admin/users">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                          />
                        </svg>
                        <span>Quản lý người dùng</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-20 flex-col space-y-1"
                    >
                      <Link to="/admin/organizations">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        <span>Xác thực tổ chức</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-20 flex-col space-y-1"
                    >
                      <Link to="/admin/events">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Kiểm duyệt hoạt động</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-20 flex-col space-y-1"
                    >
                      <Link to="/admin/reports">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        <span>Báo cáo thống kê</span>
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê nhanh</CardTitle>
              <CardDescription>Tổng quan hoạt động của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.role === "volunteer" && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Hoạt động đã tham gia
                      </span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Giờ tình nguyện
                      </span>
                      <span className="font-semibold">48h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Đăng ký chờ duyệt
                      </span>
                      <span className="font-semibold">2</span>
                    </div>
                  </>
                )}

                {user.role === "organization" && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Hoạt động đã tạo
                      </span>
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Tình nguyện viên
                      </span>
                      <span className="font-semibold">156</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Đăng ký mới
                      </span>
                      <span className="font-semibold">23</span>
                    </div>
                  </>
                )}

                {user.role === "admin" && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Tổng người dùng
                      </span>
                      <span className="font-semibold">1,234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Tổ chức chờ duyệt
                      </span>
                      <span className="font-semibold">5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Hoạt động mới
                      </span>
                      <span className="font-semibold">18</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Cập nhật mới nhất về tài khoản của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Chào mừng bạn đến với IVAN!
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Hãy hoàn thiện hồ sơ để bắt đầu tham gia các hoạt động tình
                    nguyện
                  </p>
                </div>
                <span className="text-xs text-gray-500">Vừa xong</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
