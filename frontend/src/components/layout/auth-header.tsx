"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ButtonLink } from "@/components/ui/button";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/safety", label: "Safety Matrix" },
  { href: "/report", label: "Report Landslide" },
];

function AuthHeaderContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "guest";
  const isHost = role === "host";

  return (
    <header className="border-b border-line bg-canvas">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-brand-700">
          AgroSafe Travel
        </Link>

        {/* Center links - exact 3 links from Login&Signup.png */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink transition-colors hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right role switcher buttons */}
        <div className="flex items-center gap-3">
          {isHost ? (
            <ButtonLink
              href="/login?role=guest"
              variant="outline"
              size="sm"
              className="border-brand-700 text-brand-700 hover:bg-brand-50"
            >
              Switch to Guest
            </ButtonLink>
          ) : (
            <ButtonLink
              href="/login?role=host"
              variant="outline"
              size="sm"
              className="border-brand-700 text-brand-700 hover:bg-brand-50"
            >
              Switch to Host
            </ButtonLink>
          )}

          <ButtonLink href={isHost ? "/login?role=host" : "/login?role=guest"} size="sm">
            {isHost ? "Host Login" : "Login"}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

export function AuthHeader() {
  return (
    <Suspense
      fallback={
        <header className="border-b border-line bg-canvas">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-xl font-extrabold tracking-tight text-brand-700">
              AgroSafe Travel
            </Link>
          </div>
        </header>
      }
    >
      <AuthHeaderContent />
    </Suspense>
  );
}
