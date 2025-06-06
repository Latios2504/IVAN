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
        // No profile for admin users      } else if (credentials.email.includes("org")) {
        role = "organization";
        profile = {
          profileId: "org-1",
          userId: "1",
          firstName: "Tổ chức",
          lastName: "ABC",
          fullName: "Tổ chức ABC",
          phoneNumber: "0123456789",
          location: {
            addressLine1: "123 Đường ABC, Quận 1, TP.HCM",
            city: "TP.HCM",
            province: "TP.HCM",
            country: "Vietnam",
            postalCode: "70000",
          },
          isVerified: true,
          avatarUrl: null,
          organizationName: "Tổ chức ABC",
          organizationType: "NGO",
          description: "Tổ chức hoạt động trong lĩnh vực giáo dục và xã hội",
          website: "https://org-abc.com",
          focusAreas: ["Education", "Social"],
          organizationSize: "medium",
          foundedYear: 2020,
          taxId: "0123456789",
          registrationNumber: "REG123456",
          socialLinks: {
            facebook: "",
            twitter: "",
            linkedin: "",
            instagram: "",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as OrganizationProfile;
      } else {
        role = "volunteer";
        profile = {
          profileId: "vol-1",
          userId: "1",
          firstName: "Nguyễn",
          lastName: "Văn A",
          fullName: "Nguyễn Văn A",
          phoneNumber: "0123456789",
          location: {
            addressLine1: "456 Đường XYZ",
            city: "TP.HCM",
            province: "TP.HCM",
            country: "Vietnam",
            postalCode: "70000",
          },
          isVerified: false,
          avatarUrl: null,
          bio: "Tôi là một tình nguyện viên nhiệt tình với niềm đam mê giúp đỡ cộng đồng.",
          skills: ["Giảng dạy", "Tiếng Anh", "Tổ chức sự kiện"],
          interests: ["Giáo dục", "Môi trường", "Chăm sóc trẻ em"],
          availability: ["weekend", "evening"],
          totalVolunteerHours: 0,
          volunteerRank: "Bronze",
          dateOfBirth: "1995-01-01",
          gender: "other",
          occupation: "",
          company: "",
          education: "",
          languages: ["Vietnamese", "English"],
          emergencyContact: {
            name: "Nguyễn Văn B",
            relationship: "Anh/Chị",
            phoneNumber: "0987654321",
          },
          socialLinks: {
            facebook: "",
            twitter: "",
            linkedin: "",
            instagram: "",
          },
          preferences: {
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
            weeklyDigest: true,
            eventReminders: true,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
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
        updatedAt: new Date().toISOString(),
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
          id: Date.now().toString(),
          userId: Date.now().toString(),
          organizationName: data.organizationName || fullName,
          description: data.organizationDescription || "Tổ chức mới tham gia",
          website: data.website,
          industry: "Social",
          size: "small" as const,
          location: {
            address: data.address || "",
            city: data.city || "",
            state: data.state || "",
            country: data.country || "Vietnam",
            zipCode: data.postalCode,
          },
          contactInfo: {
            phoneNumber: data.phoneNumber,
            email: data.email,
          },
          verification: {
            isVerified: false,
            documents: [],
          },
          settings: {
            isPublic: true,
            allowDirectContact: true,
            autoApproveVolunteers: false,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as OrganizationProfile;
      } else if (data.role === "volunteer") {
        profile = {
          id: Date.now().toString(),
          userId: Date.now().toString(),
          bio: "",
          skills: data.skills || [],
          experience: "",
          availability: data.availability || [],
          location: {
            city: data.city || "",
            state: data.state || "",
            country: data.country || "Vietnam",
          },
          phoneNumber: data.phoneNumber,
          dateOfBirth: data.dateOfBirth,
          emergencyContact:
            data.emergencyContactName && data.emergencyContactPhone
              ? {
                  name: data.emergencyContactName,
                  relationship: "Emergency Contact",
                  phoneNumber: data.emergencyContactPhone,
                }
              : undefined,
          socialMedia: {},
          preferences: {
            emailNotifications: true,
            smsNotifications: false,
            volunteerTypes: data.interests || [],
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
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
        updatedAt: new Date().toISOString(),
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
