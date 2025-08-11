import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  console.log("DEBUG: ProtectedRoute state:", {
    isAuthenticated,
    isLoading,
    userRole: user?.role,
    requireAuth,
    allowedRoles,
    currentPath: location.pathname,
    currentURL: window.location.href,
    allowedRolesCount: allowedRoles?.length || 0,
  });

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    console.log("DEBUG: Redirecting to login - not authenticated");
    console.log("DEBUG: Current URL:", window.location.href);
    console.log("DEBUG: Current path:", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && user) {
    console.log("DEBUG: User role:", user.role);
    console.log("DEBUG: Allowed roles:", allowedRoles);
    console.log("DEBUG: Role check result:", allowedRoles.includes(user.role));

    if (!allowedRoles.includes(user.role)) {
      console.log("DEBUG: Redirecting to unauthorized - insufficient role");
      console.log("DEBUG: User role:", user.role);
      console.log("DEBUG: Required roles:", allowedRoles);
      console.log("DEBUG: Current URL:", window.location.href);
      // Don't pass location state when user lacks permissions to avoid redirect loops
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}
