"use client";

import { Building2, CreditCard, Landmark, Wallet } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";

export interface PaymentMethod {
  id: string;
  kind: "card" | "upi";
  label: string;
  sub: string;
}

export interface Bank {
  name: string;
  ifsc: string;
  account: string;
}

interface Props {
  methods: PaymentMethod[];
  bank: Bank;
  onRemoveMethod: (id: string) => void;
  onAddMethod: () => void;
  onBankChange: (next: Bank) => void;
}

export function FinancialDetails({
  methods,
  bank,
  onRemoveMethod,
  onAddMethod,
  onBankChange,
}: Props) {
  const set = (key: keyof Bank) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onBankChange({ ...bank, [key]: e.target.value });

  return (
    <Card>
      <CardHeader title="Financial Details" icon={<Wallet size={22} />} />
      <CardBody>
        <h3 className="flex items-center gap-2 text-sm font-bold">
          <CreditCard size={16} className="text-ink-muted" aria-hidden />
          Saved Payment Methods (Guest)
        </h3>

        {methods.length > 0 ? (
          <ul className="mt-3 divide-y divide-line rounded-md border border-line bg-black/[0.02]">
            {methods.map((m) => (
              <li key={m.id} className="flex items-center gap-3 p-4">
                {m.kind === "card" ? (
                  <CreditCard size={20} className="shrink-0 text-ink-muted" aria-hidden />
                ) : (
                  <Building2 size={20} className="shrink-0 text-ink-muted" aria-hidden />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.label}</p>
                  <p className="text-xs text-ink-subtle">{m.sub}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveMethod(m.id)}
                  className="text-sm font-semibold text-danger hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-md border border-dashed border-line p-6 text-center text-sm text-ink-muted">
            No saved payment methods.
          </p>
        )}

        <button
          type="button"
          onClick={onAddMethod}
          className="mt-3 text-sm font-bold text-brand-700 hover:underline"
        >
          + Add New Payment Method
        </button>

        <h3 className="mt-8 flex items-center gap-2 text-sm font-bold">
          <Landmark size={16} className="text-ink-muted" aria-hidden />
          Bank Account Details (Host)
        </h3>

        <div className="mt-3 grid gap-5 sm:grid-cols-2">
          <Field label="Bank Name">
            {(id) => <Input id={id} value={bank.name} onChange={set("name")} />}
          </Field>
          <Field label="IFSC Code">
            {(id) => (
              <Input
                id={id}
                value={bank.ifsc}
                onChange={(e) => onBankChange({ ...bank, ifsc: e.target.value.toUpperCase() })}
              />
            )}
          </Field>
        </div>

        <Field
          label="Account Number"
          className="mt-5"
          hint="Payouts are processed weekly directly to this account."
        >
          {(id) => (
            <Input
              id={id}
              inputMode="numeric"
              value={bank.account}
              onChange={(e) => onBankChange({ ...bank, account: e.target.value.replace(/\D/g, "") })}
            />
          )}
        </Field>
      </CardBody>
    </Card>
  );
}
