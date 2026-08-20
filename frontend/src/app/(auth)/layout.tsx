import type { ReactNode } from "react";
import { AuthHeader } from "@/components/layout/auth-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthHeader />
      <div className="flex flex-1 items-center justify-center px-4 py-14 sm:py-20">{children}</div>
      <SiteFooter />
    </>
  );
}
