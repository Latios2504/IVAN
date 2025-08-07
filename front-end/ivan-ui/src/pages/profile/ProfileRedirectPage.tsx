import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProfileRedirectPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    // Redirect to role-specific profile page
    switch (user.role) {
      case "volunteer":
        navigate("/profile/volunteer");
        break;
      case "organization":
        navigate("/profile/organization");
        break;
      case "partner":
        navigate("/profile/partner");
        break;
      case "coordinator":
        navigate("/profile/coordinator");
        break;
      case "admin":
        navigate("/profile/admin");
        break;
      default:
        navigate("/");
        break;
    }
  }, [user, isAuthenticated, navigate]);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
