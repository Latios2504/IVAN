import { useState, useEffect, createContext, type ReactNode } from "react";
import type {
  User,
  AuthState,
  LoginCredentials,
  RegisterData,
} from "@/types/auth";
import type { VolunteerProfile, OrganizationProfile } from "@/types/profile";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState((prev) => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // TODO: Replace with actual API call
      console.log("Login credentials:", credentials);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data based on email
      let role: "volunteer" | "organization" | "admin";
      let profile: VolunteerProfile | OrganizationProfile | undefined =
        undefined;
      if (credentials.email.includes("admin")) {
        role = "admin";
        // No profile for admin users
      } else if (credentials.email.includes("org")) {
        role = "organization";
        profile = {
          profileId: 1,
          firstName: "Tổ chức",
          lastName: "ABC",
          fullName: "Tổ chức ABC",
          bio: "Tổ chức hoạt động trong lĩnh vực giáo dục và xã hội",
          isProfileComplete: true,
          location: {
            addressLine1: "123 Đường ABC, Quận 1",
            city: "TP.HCM",
            province: "TP.HCM",
            country: "Việt Nam",
          },
          phoneNumber: "0123456789",
          organizationName: "Tổ chức ABC",
          organizationType: "NGO",
          organizationDescription:
            "Tổ chức hoạt động trong lĩnh vực giáo dục và xã hội",
          website: "https://org-abc.com",
          contactPersonName: "Nguyễn Văn B",
          contactPersonTitle: "Giám đốc",
          focusAreas: ["Giáo dục", "Xã hội"],
          isVerified: true,
          verificationDocuments: [],
          isPublic: true,
          allowDirectContact: true,
          autoApproveVolunteers: false,
        } as OrganizationProfile;
      } else {
        role = "volunteer";
        profile = {
          profileId: 2,
          firstName: "Nguyễn",
          lastName: "Văn A",
          fullName: "Nguyễn Văn A",
          bio: "Tôi là một tình nguyện viên nhiệt tình với niềm đam mê giúp đỡ cộng đồng.",
          isProfileComplete: true,
          location: {
            city: "TP.HCM",
            province: "TP.HCM",
            country: "Việt Nam",
          },
          phoneNumber: "0123456789",
          dateOfBirth: "1995-01-01",
          occupation: "Sinh viên",
          emergencyContactName: "Nguyễn Văn B",
          emergencyContactPhone: "0987654321",
          emergencyContactRelationship: "Anh/Chị",
          availabilityNotes: "Cuối tuần và tối thứ 2-6",
          preferredVolunteerTypes: "Giáo dục, Môi trường, Chăm sóc trẻ em",
          totalVolunteerHours: 120,
          volunteerRank: "Tình nguyện viên tích cực",
          joinedDate: new Date().toISOString(),
          willingToTravel: true,
          hasTransportation: false,
          preferredWorkingHours: "Tối và cuối tuần",
          languagesSpoken: "Tiếng Việt, Tiếng Anh",
          skills: ["Giảng dạy", "Tiếng Anh", "Tổ chức sự kiện"],
        } as VolunteerProfile;
      }
      const mockUser: User = {
        id: 1,
        email: credentials.email,
        fullName:
          role === "volunteer"
            ? "Nguyễn Văn A"
            : role === "organization"
            ? "Tổ chức ABC"
            : "Admin User",
        role: role,
        isActive: true,
        isEmailVerified: true,
        profile,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("user", JSON.stringify(mockUser));

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // TODO: Replace with actual API call
      console.log("Registration data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Auto-login after successful registration
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      let profile: VolunteerProfile | OrganizationProfile | undefined;
      if (data.role === "organization") {
        profile = {
          profileId: Date.now(),
          firstName: data.firstName,
          lastName: data.lastName,
          fullName: fullName,
          bio: data.organizationDescription || "Tổ chức mới tham gia",
          isProfileComplete: false,
          location: {
            addressLine1: data.address,
            city: data.city,
            province: data.state,
            country: data.country || "Việt Nam",
            postalCode: data.postalCode,
          },
          phoneNumber: data.phoneNumber,
          organizationName: data.organizationName || fullName,
          organizationType: data.organizationType || "NGO",
          organizationDescription: data.organizationDescription,
          website: data.website,
          contactPersonName: fullName,
          contactPersonTitle: "Đại diện",
          focusAreas: data.focusAreas || [],
          isVerified: false,
          verificationDocuments: [],
          isPublic: true,
          allowDirectContact: true,
          autoApproveVolunteers: false,
        } as OrganizationProfile;
      } else if (data.role === "volunteer") {
        profile = {
          profileId: Date.now(),
          firstName: data.firstName,
          lastName: data.lastName,
          fullName: fullName,
          bio: "",
          isProfileComplete: false,
          location: {
            city: data.city,
            province: data.state,
            country: data.country || "Việt Nam",
          },
          phoneNumber: data.phoneNumber,
          dateOfBirth: data.dateOfBirth,
          emergencyContactName: data.emergencyContactName,
          emergencyContactPhone: data.emergencyContactPhone,
          emergencyContactRelationship: "Người liên hệ khẩn cấp",
          availabilityNotes: data.availability?.join(", "),
          preferredVolunteerTypes: data.interests?.join(", "),
          totalVolunteerHours: 0,
          volunteerRank: "Người mới",
          joinedDate: new Date().toISOString(),
          willingToTravel: false,
          hasTransportation: false,
          skills: data.skills || [],
        } as VolunteerProfile;
      }
      const mockUser: User = {
        id: Date.now(),
        email: data.email,
        fullName: fullName,
        role: data.role,
        isActive: true,
        isEmailVerified: false, // New registrations need email verification
        profile,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("user", JSON.stringify(mockUser));

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setAuthState((prev) => ({
        ...prev,
        user: updatedUser,
      }));
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // TODO: Replace with actual API call to refresh user data
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
