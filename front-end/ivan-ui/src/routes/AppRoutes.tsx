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
const PublicPartnersPage = lazy(
  () => import("@/pages/public/PublicPartnersPage")
);
const PublicVolunteersPage = lazy(
  () => import("@/pages/public/PublicVolunteersPage")
);

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
const EventManagementPage = lazy(
  () => import("@/pages/organization/EventManagementPage")
);
const CertificateManagementPage = lazy(
  () => import("@/pages/organization/CertificateManagementPage")
);
const CertificateTemplateManagementPage = lazy(
  () => import("@/pages/organization/CertificateTemplateManagementPage")
);
const VolunteerCertificatesPage = lazy(
  () => import("@/pages/volunteer/VolunteerCertificatesPage")
);
const OrganizationReportsPage = lazy(
  () => import("@/pages/organization/OrganizationReportsPage")
);
const OrganizationCoordinatorRequestPage = lazy(
  () => import("@/pages/organization/OrganizationCoordinatorRequestPage")
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
const UserManagementPage = lazy(
  () => import("@/pages/admin/UserManagementPage")
);
const AIInstructionsManagementPage = lazy(
  () => import("@/pages/admin/AIInstructionsManagementPage")
);
const SupportRequestManagementPage = lazy(
  () => import("@/pages/admin/SupportRequestManagementPage")
);
const ModerationManagementPage = lazy(
  () => import("@/pages/admin/ModerationManagementPage")
);
const EventRegistrationPage = lazy(
  () => import("@/pages/organization/EventRegistrationPage")
);
const EventFeedbackManagementPage = lazy(
  () => import("@/pages/organization/EventFeedbackManagementPage")
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

const VolunteerEventRegistrationPage = lazy(
  () => import("@/pages/volunteer/VolunteerEventRegistrationPage")
);

const MyEventRegistrationsPage = lazy(
  () => import("@/pages/volunteer/MyEventRegistrationsPage")
);

// Support Request pages
const CreateSupportRequestPage = lazy(
  () => import("@/pages/public/CreateSupportRequestPage")
);
const SupportRequestHistoryPage = lazy(
  () => import("@/pages/user/SupportRequestHistoryPage")
);

// Profile pages
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
        {/* Combined layout routes */}
        <Route path="/organizations" element={<PublicOrganizationsPage />} />
        <Route
          path="/organizations/:id"
          element={<PublicOrganizationsPage />}
        />
        <Route path="/partners" element={<PublicPartnersPage />} />
        <Route path="/partners/:id" element={<PublicPartnersPage />} />
        <Route path="/events" element={<PublicEventsPage />} />
        <Route path="/events/:id" element={<PublicEventsPage />} />
        <Route path="/volunteers" element={<PublicVolunteersPage />} />
        <Route path="/volunteers/:id" element={<PublicVolunteersPage />} />
        {/* Support Request routes */}
        <Route
          path="/support-request/create"
          element={<CreateSupportRequestPage />}
        />
        {/* Protected routes - Role-specific dashboards */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />
        {/* Support Request History - for authenticated users */}
        <Route
          path="/support-request/history"
          element={
            <ProtectedRoute>
              <SupportRequestHistoryPage />
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
          path="/volunteer/profile"
          element={
            <ProtectedRoute allowedRoles={[UserRole.VOLUNTEER]}>
              <VolunteerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization/profile"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ORGANIZATION]}>
              <OrganizationProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/partner/profile"
          element={
            <ProtectedRoute allowedRoles={[UserRole.PARTNER]}>
              <PartnerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coordinator/profile"
          element={
            <ProtectedRoute allowedRoles={[UserRole.COORDINATOR]}>
              <CoordinatorProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminProfilePage />
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
          path="/volunteer/events/:eventId/register"
          element={
            <ProtectedRoute allowedRoles={[UserRole.VOLUNTEER]}>
              <VolunteerEventRegistrationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer/my-registrations"
          element={
            <ProtectedRoute allowedRoles={[UserRole.VOLUNTEER]}>
              <MyEventRegistrationsPage />
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
          path="/organization/certificates"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ORGANIZATION]}>
              <CertificateManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization/certificate-templates"
          element={
            <ProtectedRoute
              allowedRoles={[UserRole.ORGANIZATION, UserRole.ADMIN]}
            >
              <CertificateTemplateManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/certificate-templates"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <CertificateTemplateManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer/certificates"
          element={
            <ProtectedRoute allowedRoles={[UserRole.VOLUNTEER]}>
              <VolunteerCertificatesPage />
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
          path="/organization/event-feedback"
          element={
            <ProtectedRoute
              allowedRoles={[UserRole.ORGANIZATION, UserRole.COORDINATOR]}
            >
              <EventFeedbackManagementPage />
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/admin/support-requests"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <SupportRequestManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/moderation"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <ModerationManagementPage />
            </ProtectedRoute>
          }
        />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
