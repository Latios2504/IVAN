import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type {
  User,
  UserRole,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";
import { authService } from "@/services/authService";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "UPDATE_USER"; payload: Partial<User> };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "AUTH_LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          // Set token in apiClient first
          authService.setToken(token);
          const user = await authService.getCurrentUser();
          dispatch({ type: "AUTH_SUCCESS", payload: user });
        } else {
          dispatch({ type: "AUTH_LOGOUT" });
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        localStorage.removeItem("authToken");
        dispatch({ type: "AUTH_LOGOUT" });
      }
    };

    initializeAuth();
  }, []);
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await authService.login(credentials); // Store token in localStorage
      localStorage.setItem("authToken", response.token);

      dispatch({ type: "AUTH_SUCCESS", payload: response.user });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });
      await authService.register(data);

      // Auto-login after successful registration
      await login({ email: data.email, password: data.password });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem("authToken");
    dispatch({ type: "AUTH_LOGOUT" });
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const user = await authService.getCurrentUser();
      dispatch({ type: "AUTH_SUCCESS", payload: user });
    } catch (error) {
      console.error("Failed to refresh user:", error);
      logout();
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    try {
      dispatch({ type: "UPDATE_USER", payload: updates });
      // Optionally sync with backend
      await refreshUser();
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  };

  const clearError = (): void => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
