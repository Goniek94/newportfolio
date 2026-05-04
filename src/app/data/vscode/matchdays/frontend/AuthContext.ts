export const authContextCode = `"use client";

/**
 * Global authentication state.
 * Tokens live in HTTP-Only cookies (set by backend), never in localStorage.
 * We keep an "isLoggedIn" flag in localStorage purely to skip the /me call
 * for anonymous users — avoids unnecessary 401s on every page load.
 */

import React, {
  createContext, useContext, useState, useEffect, useCallback,
} from "react";
import { authApi } from "@/lib/api";
import { clearAuthData, setAuthData } from "@/lib/api/config";
import type { UserData, ApiResponse } from "@/lib/api/config";
import type { RegisterData } from "@/lib/api/auth";
import { logger } from "@/lib/logger";

interface AuthContextValue {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (emailOrUsername: string, password: string) => Promise<ApiResponse<UserData>>;
  register: (userData: RegisterData) => Promise<ApiResponse<UserData>>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<UserData | null>;

  hasRole: (role: string | string[]) => boolean;
  isAdmin: boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogoutCleanup = useCallback(() => {
    clearAuthData();
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn");
    }
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  /**
   * On mount: skip /me if no session flag (guests),
   * otherwise verify with backend via HTTP-only cookie.
   */
  const initializeAuth = useCallback(async () => {
    try {
      const hasSessionFlag =
        typeof window !== "undefined" &&
        localStorage.getItem("isLoggedIn") === "true";

      if (!hasSessionFlag) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const response = await authApi.checkAuth();

      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        setAuthData(response.data);
        if (typeof window !== "undefined") {
          localStorage.setItem("isLoggedIn", "true");
        }
      } else {
        handleLogoutCleanup();
      }
    } catch (err: unknown) {
      const status = (err as { status?: number; response?: { status?: number } })?.status
        ?? (err as { response?: { status?: number } })?.response?.status;
      // 401 = not logged in — don't spam the console
      if (status !== 401) {
        logger.warn("Auth initialization failed", "AuthContext", err);
      }
      handleLogoutCleanup();
    } finally {
      setIsLoading(false);
    }
  }, [handleLogoutCleanup]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (emailOrUsername: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authApi.login({ emailOrUsername, password });

      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        setAuthData(response.data);
        if (typeof window !== "undefined") {
          localStorage.setItem("isLoggedIn", "true");
        }
      }

      return response;
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || "Login failed. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authApi.register(userData);

      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        setAuthData(response.data);
        if (typeof window !== "undefined") {
          localStorage.setItem("isLoggedIn", "true");
        }
      }

      return response;
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || "Registration failed. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
    } finally {
      // Always clean up local state — even if API call fails
      handleLogoutCleanup();
      setError(null);
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<UserData | null> => {
    try {
      const response = await authApi.checkAuth();
      if (response.success && response.data) {
        setUser(response.data);
        setAuthData(response.data);
        return response.data;
      }
      handleLogoutCleanup();
      return null;
    } catch {
      handleLogoutCleanup();
      return null;
    }
  };

  const hasRole = (requiredRole: string | string[]): boolean => {
    if (!user?.role) return false;
    return Array.isArray(requiredRole)
      ? requiredRole.includes(user.role)
      : user.role === requiredRole;
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
    hasRole,
    isAdmin: hasRole("admin"),
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
`;
