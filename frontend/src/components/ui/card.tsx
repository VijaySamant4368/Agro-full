import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children, ...rest }: ComponentProps<"div">) {
  return (
    <div className={cn("rounded-lg border border-line bg-surface", className)} {...rest}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  icon?: ReactNode;
  className?: string;
}

export function CardHeader({ title, icon, className }: CardHeaderProps) {
  return (
    <div className={cn("flex items-center gap-2 border-b border-line px-5 py-4 sm:px-7", className)}>
      {icon ? <span className="text-brand-700">{icon}</span> : null}
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
    </div>
  );
}

export function CardBody({ className, children, ...rest }: ComponentProps<"div">) {
  return (
    <div className={cn("p-5 sm:p-7", className)} {...rest}>
      {children}
    </div>
  );
}
