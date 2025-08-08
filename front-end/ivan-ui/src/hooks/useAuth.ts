// Replace AuthContext with a custom hook
import { useState, useEffect, useCallback } from "react";
import { authService } from "@/services/authService";
import type { User, LoginRequest, RegisterRequest } from "@/types/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Singleton pattern for auth state
let authState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

let listeners: Set<() => void> = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

const updateAuthState = (updates: Partial<AuthState>) => {
  authState = { ...authState, ...updates };
  notifyListeners();
};

export const useAuth = () => {
  const [state, setState] = useState(authState);

  useEffect(() => {
    const listener = () => setState({ ...authState });
    listeners.add(listener);

    // Initialize auth state
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const user = await authService.getCurrentUser();
          updateAuthState({ user, isAuthenticated: true, isLoading: false });
        } catch {
          localStorage.removeItem("token");
          updateAuthState({ isLoading: false });
        }
      } else {
        updateAuthState({ isLoading: false });
      }
    };

    initAuth();

    return () => {
      listeners.delete(listener);
    };
  }, []);

  const login = useCallback(
    async (credentials: LoginRequest): Promise<User> => {
      try {
        updateAuthState({ isLoading: true, error: null });
        const { user } = await authService.login(credentials);
        updateAuthState({ user, isAuthenticated: true, isLoading: false });
        return user;
      } catch (error: any) {
        updateAuthState({ error: error.message, isLoading: false });
        throw error;
      }
    },
    []
  );

  const register = useCallback(async (data: RegisterRequest): Promise<void> => {
    try {
      updateAuthState({ isLoading: true, error: null });
      await authService.register(data);
      updateAuthState({ isLoading: false });
    } catch (error: any) {
      updateAuthState({ error: error.message, isLoading: false });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    updateAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const user = await authService.getCurrentUser();
      updateAuthState({ user });
    } catch (error: any) {
      updateAuthState({ error: error.message });
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    updateAuthState({ error: null });
  }, []);

  const updateUser = useCallback(
    async (updates: Partial<User>): Promise<void> => {
      try {
        // Update the user locally first
        if (authState.user) {
          updateAuthState({ user: { ...authState.user, ...updates } });
        }

        // Optionally refresh from server to get the latest data
        await refreshUser();
      } catch (error: any) {
        updateAuthState({ error: error.message });
        throw error;
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
