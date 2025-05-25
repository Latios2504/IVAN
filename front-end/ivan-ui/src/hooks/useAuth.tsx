import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import type {
  User,
  AuthState,
  LoginCredentials,
  RegisterData,
} from "@/types/auth";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

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
      let role: string;
      let profile = {};

      if (credentials.email.includes("admin")) {
        role = "admin";
        profile = {
          name: "Admin User",
          phone: "0123456789",
        };
      } else if (credentials.email.includes("org")) {
        role = "organization";
        profile = {
          name: "Tổ chức ABC",
          type: "Tổ chức phi chính phủ",
          description: "Tổ chức hoạt động trong lĩnh vực giáo dục và xã hội",
          verified: true,
          contactInfo: {
            phone: "0123456789",
            website: "https://org-abc.com",
            address: "123 Đường ABC, Quận 1, TP.HCM",
          },
        };
      } else {
        role = "volunteer";
        profile = {
          firstName: "Nguyễn",
          lastName: "Văn A",
          dateOfBirth: "1995-01-01",
          address: "456 Đường XYZ, Quận 2, TP.HCM",
          bio: "Tôi là một tình nguyện viên nhiệt tình với niềm đam mê giúp đỡ cộng đồng.",
          skills: ["Giảng dạy", "Tiếng Anh", "Tổ chức sự kiện"],
          interests: ["Giáo dục", "Môi trường", "Chăm sóc trẻ em"],
        };
      }

      const mockUser: User = {
        id: "1",
        email: credentials.email,
        fullName:
          role === "volunteer"
            ? "Nguyễn Văn A"
            : role === "organization"
            ? "Tổ chức ABC"
            : "Admin User",
        role: role as any,
        isActive: true,
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
      let profile = {};

      if (data.role === "organization") {
        profile = {
          name: data.fullName,
          type: "Tổ chức phi chính phủ",
          description: "Tổ chức mới tham gia",
          verified: false,
          contactInfo: {
            phone: "",
            website: "",
            address: "",
          },
        };
      } else if (data.role === "volunteer") {
        const nameParts = data.fullName.split(" ");
        profile = {
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          dateOfBirth: "",
          address: "",
          bio: "",
          skills: [],
          interests: [],
        };
      }

      const mockUser: User = {
        id: "1",
        email: data.email,
        fullName: data.fullName,
        role: data.role as any,
        isActive: true,
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

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
