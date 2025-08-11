import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { UserRole } from "@/types/auth";

// Lazy loading pages
const HomePage = lazy(() => import("@/pages/public/HomePage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("@/pages/auth/ForgotPasswordPage")
);
const PasswordResetPage = lazy(() => import("@/pages/auth/PasswordResetPage"));
const ChangePasswordPage = lazy(
  () => import("@/pages/auth/ChangePasswordPage")
);
const NotFoundPage = lazy(() => import("@/pages/public/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("@/pages/public/UnauthorizedPage"));
const PublicOrganizationsPage = lazy(
  () => import("@/pages/public/PublicOrganizationsPage")
);
const PublicEventsPage = lazy(() => import("@/pages/public/PublicEventsPage"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const OrganizationDashboard = lazy(
  () => import("@/pages/organization/OrganizationDashboard")
);
const PartnerDashboard = lazy(() => import("@/pages/partner/PartnerDashboard"));
const VolunteerDashboard = lazy(
  () => import("@/pages/volunteer/VolunteerDashboard")
);
const CoordinatorDashboard = lazy(
  () => import("@/pages/coordinator/CoordinatorDashboard")
);
const PublicPartnersPage = lazy(
  () => import("@/pages/public/PublicPartnersPage")
);
const PublicOrganizationDetailPage = lazy(
  () => import("@/pages/public/PublicOrganizationDetailPage")
);
const PublicEventDetailPage = lazy(
  () => import("@/pages/public/PublicEventDetailPage")
);
const PublicPartnerDetailPage = lazy(
  () => import("@/pages/public/PublicPartnerDetailPage")
);
const PublicVolunteersPage = lazy(
  () => import("@/pages/public/PublicVolunteersPage")
);
const PublicVolunteerDetailPage = lazy(
  () => import("@/pages/public/PublicVolunteerDetailPage")
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
const VolunteerScheduleManagementPage = lazy(
  () => import("@/pages/coordinator/VolunteerScheduleManagementPage")
);
const VolunteerSchedulePage = lazy(
  () => import("@/pages/volunteer/VolunteerSchedulePage")
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
const UserManagementPage = lazy(
  () => import("@/pages/admin/UserManagementPage")
);
const AIInstructionsManagementPage = lazy(
  () => import("@/pages/admin/AIInstructionsManagementPage")
);
const EventRegistrationPage = lazy(
  () => import("@/pages/organization/EventRegistrationPage")
);
const VolunteerCoordinatorManagementPage = lazy(
  () => import("@/pages/organization/VolunteerCoordinatorManagementPage")
);
const OnSiteTaskManagementPage = lazy(
  () => import("@/pages/coordinator/OnSiteTaskManagementPage")
);
const CoordinatorTasksPage = lazy(
  () => import("@/pages/coordinator/CoordinatorTasksPage")
);
const MyOnSiteTasksPage = lazy(
  () => import("@/pages/volunteer/MyOnSiteTasksPage")
);

// Profile pages
const ProfileRedirectPage = lazy(
  () => import("@/pages/profile/ProfileRedirectPage")
);
const VolunteerProfilePage = lazy(
  () => import("@/pages/volunteer/VolunteerProfilePage")
);
const OrganizationProfilePage = lazy(
  () => import("@/pages/organization/OrganizationProfilePage")
);
const PartnerProfilePage = lazy(
  () => import("@/pages/partner/PartnerProfilePage")
);
const CoordinatorProfilePage = lazy(
  () => import("@/pages/coordinator/CoordinatorProfilePage")
);
const AdminProfilePage = lazy(() => import("@/pages/admin/AdminProfilePage"));

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
        <Route path="/password-reset" element={<PasswordResetPage />} />
        <Route path="/organizations" element={<PublicOrganizationsPage />} />
        <Route
          path="/organizations/:id"
          element={<PublicOrganizationDetailPage />}
        />
        <Route path="/partners" element={<PublicPartnersPage />} />
        <Route path="/partners/:id" element={<PublicPartnerDetailPage />} />
        <Route path="/events" element={<PublicEventsPage />} />
        <Route path="/events/:id" element={<PublicEventDetailPage />} />
        <Route path="/volunteers" element={<PublicVolunteersPage />} />
        <Route path="/volunteers/:id" element={<PublicVolunteerDetailPage />} />
        {/* Protected routes - Role-specific dashboards */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />
        {/* Error pages */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        {/* Role-specific dashboard routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ORGANIZATION]}>
              <OrganizationDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/partner"
          element={
            <ProtectedRoute allowedRoles={[UserRole.PARTNER]}>
              <PartnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer"
          element={
            <ProtectedRoute allowedRoles={[UserRole.VOLUNTEER]}>
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coordinator"
          element={
            <ProtectedRoute allowedRoles={[UserRole.COORDINATOR]}>
              <CoordinatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coordinator/schedule"
          element={
            <ProtectedRoute allowedRoles={[UserRole.COORDINATOR]}>
              <VolunteerScheduleManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coordinator/onsite-tasks"
          element={
            <ProtectedRoute allowedRoles={[UserRole.COORDINATOR]}>
              <OnSiteTaskManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coordinator/my-tasks"
          element={
            <ProtectedRoute allowedRoles={[UserRole.COORDINATOR]}>
              <CoordinatorTasksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer/schedule"
          element={
            <ProtectedRoute allowedRoles={[UserRole.VOLUNTEER]}>
              <VolunteerSchedulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer/my-tasks"
          element={
            <ProtectedRoute allowedRoles={[UserRole.VOLUNTEER]}>
              <MyOnSiteTasksPage />
            </ProtectedRoute>
          }
        />
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
          path="/organization/volunteer-coordinators"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ORGANIZATION]}>
              <VolunteerCoordinatorManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization/event-registrations"
          element={
            <ProtectedRoute
              allowedRoles={[UserRole.ORGANIZATION, UserRole.COORDINATOR]}
            >
              <EventRegistrationPage />
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
          path="/organization/volunteer-schedule"
          element={
            <ProtectedRoute allowedRoles={[UserRole.COORDINATOR]}>
              <VolunteerScheduleManagementPage />
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/organization/coordinator-tasks"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ORGANIZATION]}>
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
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/admin/ai-instructions"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AIInstructionsManagementPage />
            </ProtectedRoute>
          }
        />
        {/* Profile routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileRedirectPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/volunteer/:id"
          element={
            <ProtectedRoute>
              <VolunteerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/volunteer"
          element={
            <ProtectedRoute allowedRoles={[UserRole.VOLUNTEER]}>
              <VolunteerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/organization/:id"
          element={
            <ProtectedRoute>
              <OrganizationProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/organization"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ORGANIZATION]}>
              <OrganizationProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/partner/:id"
          element={
            <ProtectedRoute>
              <PartnerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/partner"
          element={
            <ProtectedRoute allowedRoles={[UserRole.PARTNER]}>
              <PartnerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/coordinator/:id"
          element={
            <ProtectedRoute>
              <CoordinatorProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/coordinator"
          element={
            <ProtectedRoute allowedRoles={[UserRole.COORDINATOR]}>
              <CoordinatorProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/admin/:id"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/admin"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminProfilePage />
            </ProtectedRoute>
          }
        />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
