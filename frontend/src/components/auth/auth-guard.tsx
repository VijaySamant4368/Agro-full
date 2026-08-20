"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, token, isLoading, isAuthenticated, isHost } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [deniedRoleMessage, setDeniedRoleMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;

    // Public routes that do not require login
    const isPublicRoute = pathname.startsWith("/login");

    if (!isAuthenticated) {
      if (!isPublicRoute) {
        // Redirect unauthenticated user to login
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
      return;
    }

    // Authenticated user checks
    if (isPublicRoute) {
      // Already logged in, redirect away from login
      if (isHost) {
        router.replace("/host");
      } else {
        router.replace("/");
      }
      return;
    }

    // Role-based route protection
    // Only hosts can access /host and /host/*
    if (pathname.startsWith("/host") && !isHost) {
      setDeniedRoleMessage("Access restricted: This area requires an authenticated Farm Host account.");
      const timer = setTimeout(() => {
        router.replace("/");
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setDeniedRoleMessage(null);
    }
  }, [isLoading, isAuthenticated, isHost, pathname, router]);

  // Loading state while checking JWT token
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="size-12 rounded-full border-4 border-brand-200 border-t-brand-700 animate-spin" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-ink">Verifying Security Session...</p>
          <p className="text-xs text-ink-muted">Validating encrypted token credentials</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on login page, render nothing while redirecting
  if (!isAuthenticated && !pathname.startsWith("/login")) {
    return null;
  }

  // If guest attempting to access host route, show access restriction banner while redirecting
  if (deniedRoleMessage) {
    return (
      <div className="mx-auto max-w-xl my-16 px-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center space-y-4 shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-100 text-danger">
            <ShieldAlert size={30} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-950">Host Authorization Required</h2>
            <p className="mt-2 text-sm text-red-800">{deniedRoleMessage}</p>
          </div>
          <p className="text-xs text-red-700/80">Redirecting to traveler home...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
