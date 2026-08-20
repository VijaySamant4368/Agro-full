import { AlertTriangle, CheckCircle2, OctagonAlert } from "lucide-react";
import type { SafetyStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const SAFETY = {
  safe: {
    label: "Safe",
    banner: "Region safe — no active alerts",
    chip: "bg-white text-brand-700 border-brand-500",
    bar: "bg-safe text-white",
    Icon: CheckCircle2,
  },
  moderate: {
    label: "Moderate Risk",
    banner: "Moderate risk — check conditions before travel",
    chip: "bg-white text-amber-700 border-amber-400",
    bar: "bg-warn text-white",
    Icon: AlertTriangle,
  },
  high: {
    label: "High Risk",
    banner: "High risk — travel advisory in effect",
    chip: "bg-white text-red-700 border-red-400",
    bar: "bg-danger text-white",
    Icon: OctagonAlert,
  },
} as const satisfies Record<SafetyStatus, unknown>;

export function SafetyBadge({ status, className }: { status: SafetyStatus; className?: string }) {
  const { label, chip, Icon } = SAFETY[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm",
        chip,
        className,
      )}
    >
      <Icon size={14} aria-hidden />
      {label}
    </span>
  );
}

export function SafetyBar({ status }: { status: SafetyStatus }) {
  const { banner, bar, Icon } = SAFETY[status];
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 rounded-md px-4 py-3 text-center text-sm font-semibold tracking-wide uppercase",
        bar,
      )}
      role="status"
    >
      <Icon size={18} aria-hidden />
      {banner}
    </div>
  );
}
