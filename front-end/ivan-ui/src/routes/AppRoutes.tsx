import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ProtectedRoute } from "@/components/layout";
import { UserRole } from "@/types/auth";

// Lazy loading pages
const HomePage = lazy(() => import("@/pages/home/HomePage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("@/pages/auth/ForgotPasswordPage")
);
const PasswordResetPage = lazy(() => import("@/pages/auth/PasswordResetPage"));
const ChangePasswordPage = lazy(
  () => import("@/pages/auth/ChangePasswordPage")
);
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const VolunteersPage = lazy(
  () => import("@/pages/volunteer/VolunteersListPage")
);
const PublicOrganizationsPage = lazy(
  () => import("@/pages/public/PublicOrganizationsPage")
);
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"));
const PublicEventsPage = lazy(() => import("@/pages/public/PublicEventsPage"));
const AdminPage = lazy(() => import("@/pages/admin/AdminPage"));
const PublicPartnersPage = lazy(
  () => import("@/pages/public/PublicPartnersPage")
);
const OrganizationManagementPage = lazy(
  () => import("@/pages/organization/OrganizationManagementPage")
);
const EventManagementPage = lazy(
  () => import("@/pages/organization/EventManagementPage")
);
const VolunteerManagementPage = lazy(
  () => import("@/pages/organization/VolunteerManagementPage")
);
const CertificateManagementPage = lazy(
  () => import("@/pages/organization/CertificateManagementPage")
);
const OrganizationReportsPage = lazy(
  () => import("@/pages/organization/OrganizationReportsPage")
);
const OrganizationCoordinatorRequestPage = lazy(
  () => import("@/pages/organization/OrganizationCoordinatorRequestPage")
);
const OrganizationResourcesPage = lazy(
  () => import("@/pages/organization/OrganizationResourcesPage")
);
const OrganizationAnalyticsPage = lazy(
  () => import("@/pages/organization/OrganizationAnalyticsPage")
);
const CoordinatorSchedulePage = lazy(
  () => import("@/pages/organization/CoordinatorSchedulePage")
);
const CoordinatorTaskManagementPage = lazy(
  () => import("@/pages/organization/CoordinatorTaskManagementPage")
);
const PartnerCollaborationPage = lazy(
  () => import("@/pages/organization/PartnerCollaborationPage")
);
const NotificationManagementPage = lazy(
  () => import("@/pages/organization/NotificationManagementPage")
);
const OrganizationProfileManagementPage = lazy(
  () => import("@/pages/organization/OrganizationProfileManagementPage")
);
const AdminOrganizationListPage = lazy(
  () => import("@/pages/admin/organization/AdminOrganizationListPage")
);
const SupportRequestManagementPage = lazy(
  () => import("@/pages/support/SupportRequestManagementPage")
);
const PartnerProfileManagementPage = lazy(
  () => import("@/pages/partner/PartnerProfileManagementPage")
);
const AdminPartnerListPage = lazy(
  () => import("@/pages/admin/partner/AdminPartnerListPage")
);
const UserManagementPage = lazy(
  () => import("@/pages/admin/UserManagementPage")
);
const AdminNotificationManagementPage = lazy(
  () => import("@/pages/admin/AdminNotificationManagementPage")
);
const AIInstructionsManagementPage = lazy(
  () => import("@/pages/admin/AIInstructionsManagementPage")
);

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />{" "}
        <Route path="/volunteers" element={<VolunteersPage />} />
        <Route path="/organizations" element={<PublicOrganizationsPage />} />
        <Route path="/partners" element={<PublicPartnersPage />} />
        <Route path="/events" element={<PublicEventsPage />} />
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/organization/management"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ORGANIZATION]}>
              <OrganizationManagementPage />
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/organization/events"
          element={
            <ProtectedRoute
              allowedRoles={[UserRole.ORGANIZATION, UserRole.COORDINATOR]}
            >
              <EventManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization/volunteers"
          element={
            <ProtectedRoute
              allowedRoles={[UserRole.ORGANIZATION, UserRole.COORDINATOR]}
            >
              <VolunteerManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization/certificates"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ORGANIZATION]}>
              <CertificateManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization/reports"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ORGANIZATION]}>
              <OrganizationReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization/coordinators"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ORGANIZATION]}>
              <OrganizationCoordinatorRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization/resources"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ORGANIZATION]}>
              <OrganizationResourcesPage />
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/organization/analytics"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ORGANIZATION]}>
              <OrganizationAnalyticsPage />
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/organization/coordinator-schedule"
          element={
            <ProtectedRoute
              allowedRoles={[UserRole.ORGANIZATION, UserRole.COORDINATOR]}
            >
              <CoordinatorSchedulePage />
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/organization/coordinator-tasks"
          element={
            <ProtectedRoute
              allowedRoles={[UserRole.ORGANIZATION, UserRole.COORDINATOR]}
            >
              <CoordinatorTaskManagementPage />
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/organization/partners"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ORGANIZATION]}>
              <PartnerCollaborationPage />
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/organization/notifications"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ORGANIZATION]}>
              <NotificationManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization/profile"
          element={
            <ProtectedRoute
              allowedRoles={[UserRole.ORGANIZATION, UserRole.ADMIN]}
            >
              <OrganizationProfileManagementPage />
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/admin/organizations"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminOrganizationListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/admin/partners"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminPartnerListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminNotificationManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ai-instructions"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AIInstructionsManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/partner/profile"
          element={
            <ProtectedRoute allowedRoles={[UserRole.PARTNER, UserRole.ADMIN]}>
              <PartnerProfileManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <SupportRequestManagementPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
