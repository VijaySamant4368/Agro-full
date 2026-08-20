import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-subtle transition-colors hover:border-brand-200 focus:border-brand-600";

export function Label({ className, children, ...rest }: ComponentProps<"label">) {
  return (
    <label className={cn("block text-sm font-semibold text-ink", className)} {...rest}>
      {children}
    </label>
  );
}

export function Hint({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-xs text-ink-subtle">{children}</p>;
}

interface FieldProps {
  label: string;
  /** Overrides the id derived from the label — pass it when two fields share a label. */
  id?: string;
  hint?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: (id: string) => ReactNode;
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Label + control + hint, wired together by id. Works in server and client components. */
export function Field({ label, id: idProp, hint, action, className, children }: FieldProps) {
  const id = idProp ?? slug(label);
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        {action}
      </div>
      <div className="mt-1.5">{children(id)}</div>
      {hint ? <Hint>{hint}</Hint> : null}
    </div>
  );
}

export function Input({ className, ...rest }: ComponentProps<"input">) {
  return <input className={cn(control, className)} {...rest} />;
}

export function Textarea({ className, ...rest }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-28 resize-y", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: ComponentProps<"select">) {
  return (
    <select className={cn(control, "appearance-none bg-white pr-8", className)} {...rest}>
      {children}
    </select>
  );
}
