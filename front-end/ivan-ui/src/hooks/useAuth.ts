import { useState, useEffect, useCallback } from "react";
import { authService } from "@/services/authService";
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthState,
} from "@/types/auth";

let globalAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

let stateListeners: Set<(state: AuthState) => void> = new Set();

const notifyStateChange = () => {
  stateListeners.forEach((listener) => listener(globalAuthState));
};

const updateGlobalState = (updates: Partial<AuthState>) => {
  globalAuthState = { ...globalAuthState, ...updates };
  notifyStateChange();
};

let authInitialized = false;

const initializeAuth = async () => {
  if (authInitialized) {
    console.log("DEBUG: Auth already initialized, skipping");
    return;
  }

  console.log("DEBUG: Starting auth initialization");
  authInitialized = true;

  const token = localStorage.getItem("authToken");
  console.log("DEBUG: Initializing auth, token exists:", !!token);
  console.log(
    "DEBUG: Token value:",
    token ? token.substring(0, 20) + "..." : "null"
  );
  console.log("DEBUG: Current URL:", window.location.href);

  if (token) {
    try {
      authService.setToken(token);
      const user = await authService.getCurrentUser();
      console.log("DEBUG: Successfully got current user:", user);
      updateGlobalState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.log("DEBUG: Failed to get current user:", error);
      localStorage.removeItem("authToken");
      authService.setToken(null);
      updateGlobalState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  } else {
    console.log("DEBUG: No token found, setting loading to false");
    updateGlobalState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }
};
initializeAuth();

export const useAuth = () => {
  const [state, setState] = useState(globalAuthState);

  useEffect(() => {
    const listener = (newState: AuthState) => {
      console.log("DEBUG: Auth state updated:", newState);
      setState(newState);
    };
    stateListeners.add(listener);
    setState(globalAuthState);

    return () => {
      stateListeners.delete(listener);
    };
  }, []);

  const login = useCallback(
    async (credentials: LoginRequest): Promise<User> => {
      try {
        updateGlobalState({ isLoading: true, error: null });

        const { user, token } = await authService.login(credentials);

        localStorage.setItem("authToken", token);

        updateGlobalState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return user;
      } catch (error: any) {
        updateGlobalState({
          error: error.message || "Login failed",
          isLoading: false,
        });
        throw error;
      }
    },
    []
  );

  const register = useCallback(async (data: RegisterRequest): Promise<void> => {
    try {
      updateGlobalState({ isLoading: true, error: null });
      await authService.register(data);
      updateGlobalState({ isLoading: false, error: null });
    } catch (error: any) {
      updateGlobalState({
        error: error.message || "Registration failed",
        isLoading: false,
      });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    authService.setToken(null);

    updateGlobalState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const user = await authService.getCurrentUser();
      updateGlobalState({ user, error: null });
    } catch (error: any) {
      updateGlobalState({
        error: error.message || "Failed to refresh user data",
      });
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    updateGlobalState({ error: null });
  }, []);

  const updateUser = useCallback(
    async (updates: Partial<User>): Promise<void> => {
      if (globalAuthState.user) {
        updateGlobalState({
          user: { ...globalAuthState.user, ...updates },
        });

        try {
          await refreshUser();
        } catch (error: any) {
          updateGlobalState({
            error: error.message || "Failed to sync user data",
          });
        }
      }
    },
    []
  );

  return {
    ...state,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
    clearError,
  };
};
