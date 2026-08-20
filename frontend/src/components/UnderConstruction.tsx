"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Construction, ArrowLeft, Home, Compass } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";

interface UnderConstructionProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export function UnderConstruction({
  title = "Page Under Construction",
  description = "We are actively building this feature. Please check back soon!",
  showBackButton = true,
  showHomeButton = true,
}: UnderConstructionProps) {
  const pathname = usePathname();
  const [currentUrl, setCurrentUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, [pathname]);

  const displayPath = currentUrl || pathname || "this page";

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-12 sm:px-6">
      <Card className="w-full p-8 text-center sm:p-10">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-8 ring-amber-50/50">
          <Construction className="size-8 animate-bounce" aria-hidden="true" />
        </div>

        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {title}
        </h1>

        <p className="mt-2 text-sm text-ink-muted sm:text-base">
          {description}
        </p>

        <div className="mt-6 rounded-lg border border-line bg-canvas/60 p-3 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
            Target Route / URL
          </p>
          <p className="mt-1 break-all font-mono text-xs text-brand-700 sm:text-sm font-medium">
            {displayPath}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {showBackButton && (
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.history.back();
                }
              }}
              className="gap-2"
            >
              <ArrowLeft className="size-4" />
              Go Back
            </Button>
          )}

          {showHomeButton && (
            <ButtonLink href="/" variant="primary" size="md" className="gap-2">
              <Home className="size-4" />
              Return to Home
            </ButtonLink>
          )}
        </div>
      </Card>
    </div>
  );
}

export default UnderConstruction;
