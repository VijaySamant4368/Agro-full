"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export interface AuthUser {
  id: number | string;
  email: string;
  user_type: "guest" | "host";
  first_name: string;
  last_name: string;
  name: string;
  phone_number?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isHost: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  register: (userData: {
    user_type: "guest" | "host";
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number?: string;
  }) => Promise<{ success: boolean; error?: string; user?: AuthUser; requiresVerification?: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string): any | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and verify authentication on mount
  useEffect(() => {
    function initAuth() {
      try {
        const storedToken = localStorage.getItem("agrosafe_token");
        const storedUser = localStorage.getItem("agrosafe_user");

        if (storedToken) {
          setToken(storedToken);
          // Sync cookie for SSR / middleware
          document.cookie = `agrosafe_token=${storedToken}; path=/; max-age=604800; SameSite=Lax`;

          let parsedUser: AuthUser | null = null;

          if (storedUser) {
            try {
              const u = JSON.parse(storedUser);
              const first_name = u.first_name || (u.name ? u.name.split(" ")[0] : "User");
              const last_name = u.last_name || (u.name ? u.name.split(" ").slice(1).join(" ") : "");
              const user_type = (u.user_type || u.role || "guest") as "guest" | "host";

              parsedUser = {
                id: u.id || 1,
                email: u.email,
                user_type,
                first_name,
                last_name,
                name: `${first_name} ${last_name}`.trim(),
                phone_number: u.phone_number,
              };
            } catch {
              // ignore
            }
          }

          if (!parsedUser) {
            const decoded = parseJwt(storedToken);
            if (decoded) {
              parsedUser = {
                id: decoded.id || 1,
                email: decoded.email,
                user_type: decoded.user_type || "guest",
                first_name: decoded.user_type === "host" ? "Rohit" : "Arjun",
                last_name: decoded.user_type === "host" ? "Bisht" : "Verma",
                name: decoded.user_type === "host" ? "Rohit Bisht" : "Arjun Verma",
              };
            }
          }

          setUser(parsedUser);
        } else {
          setUser(null);
          setToken(null);
          document.cookie = "agrosafe_token=; path=/; max-age=0";
        }
      } catch (err) {
        console.warn("Auth initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(email, password);
      if (res.success && res.token && res.user) {
        const first_name = res.user.first_name || "User";
        const last_name = res.user.last_name || "";
        const authUser: AuthUser = {
          id: res.user.id,
          email: res.user.email,
          user_type: res.user.user_type,
          first_name,
          last_name,
          name: `${first_name} ${last_name}`.trim(),
          phone_number: res.user.phone_number,
        };

        setToken(res.token);
        setUser(authUser);
        localStorage.setItem("agrosafe_token", res.token);
        localStorage.setItem("agrosafe_user", JSON.stringify(authUser));
        document.cookie = `agrosafe_token=${res.token}; path=/; max-age=604800; SameSite=Lax`;

        return { success: true, user: authUser };
      }
      return { success: false, error: res.error || "Invalid credentials" };
    } catch (err: any) {
      return { success: false, error: err.message || "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    user_type: "guest" | "host";
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(userData);
      if (res.success) {
        if (res.token && res.user) {
          const first_name = res.user.first_name || userData.first_name;
          const last_name = res.user.last_name || userData.last_name;
          const authUser: AuthUser = {
            id: res.user.id,
            email: res.user.email,
            user_type: res.user.user_type,
            first_name,
            last_name,
            name: `${first_name} ${last_name}`.trim(),
            phone_number: res.user.phone_number,
          };

          setToken(res.token);
          setUser(authUser);
          localStorage.setItem("agrosafe_token", res.token);
          localStorage.setItem("agrosafe_user", JSON.stringify(authUser));
          document.cookie = `agrosafe_token=${res.token}; path=/; max-age=604800; SameSite=Lax`;

          return { success: true, user: authUser };
        }

        return {
          success: true,
          requiresVerification: true,
          message: res.message || "Please check your email to verify your account before logging in.",
        };
      }
      return { success: false, error: res.error || "Registration failed" };
    } catch (err: any) {
      return { success: false, error: err.message || "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
    setToken(null);
    document.cookie = "agrosafe_token=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: Boolean(token && user),
        isHost: user?.user_type === "host",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
