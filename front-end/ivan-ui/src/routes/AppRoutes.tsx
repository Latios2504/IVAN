import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { UserRole } from "@/types/auth";

// Lazy loading pages
const HomePage = lazy(() => import("@/pages/home/HomePage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("@/pages/auth/ForgotPasswordPage")
);
const PasswordResetPage = lazy(() => import("@/pages/auth/PasswordResetPage"));
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const VolunteersPage = lazy(() => import("@/pages/volunteers/VolunteersPage"));
const OrganizationsPage = lazy(
  () => import("@/pages/organizations/OrganizationsPage")
);
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"));
const EventsPage = lazy(() => import("@/pages/events/EventsPage"));
const AdminPage = lazy(() => import("@/pages/admin/AdminPage"));
const CompanyPage = lazy(() => import("@/pages/company/CompanyPage"));
const OrganizationManagementPage = lazy(
  () => import("@/pages/organization/OrganizationManagementPage")
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
        <Route path="/organizations" element={<OrganizationsPage />} />
        <Route path="/events" element={<EventsPage />} />{" "}
        {/* Protected routes */}
        <Route
          path="/company"
          element={
            <ProtectedRoute allowedRoles={[UserRole.VOLUNTEER]}>
              <CompanyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization/management"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ORGANIZATION]}>
              <OrganizationManagementPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
