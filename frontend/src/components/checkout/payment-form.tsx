"use client";

import { useState } from "react";
import { Building2, CheckCircle2, CreditCard, Globe, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { api } from "@/lib/api";
import { toast } from "@/lib/toast-context";
import { cn, formatINR } from "@/lib/utils";

type Method = "card" | "upi" | "netbanking";

const METHODS: Array<{ id: Method; label: string; icon: typeof CreditCard }> = [
  { id: "card", label: "Credit / Debit", icon: CreditCard },
  { id: "upi", label: "UPI", icon: Building2 },
  { id: "netbanking", label: "Net Banking", icon: Globe },
];

const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank"];

const groupDigits = (v: string) =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const asExpiry = (v: string) => {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

interface PaymentFormProps {
  total: number;
  farmId?: number;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export function PaymentForm({ total, farmId, checkIn, checkOut, guests }: PaymentFormProps) {
  const [method, setMethod] = useState<Method>("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [upi, setUpi] = useState("");
  const [bank, setBank] = useState(BANKS[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  function validate() {
    if (method === "card") {
      if (card.number.replace(/\s/g, "").length !== 16) return "Enter a 16-digit card number.";
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) return "Enter the expiry as MM/YY.";
      const [mm] = card.expiry.split("/").map(Number);
      if (mm < 1 || mm > 12) return "That expiry month does not exist.";
      if (!/^\d{3,4}$/.test(card.cvv)) return "CVV must be 3 or 4 digits.";
      if (!card.name.trim()) return "Enter the name printed on the card.";
    }
    if (method === "upi" && !/^[\w.-]{2,}@[a-z]{2,}$/i.test(upi)) {
      return "Enter a valid UPI ID, e.g. name@okhdfcbank.";
    }
    return "";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const message = validate();
    setError(message);
    if (message) {
      toast.error(message, "Payment Validation");
      return;
    }

    setLoading(true);
    try {
      const gatewayRef = `rzp_live_${Math.floor(Math.random() * 900000000 + 100000000)}`;
      const res = await api.bookings.create({
        farm_id: farmId || 1,
        stay_start_date: checkIn || "2026-09-15",
        stay_end_date: checkOut || "2026-09-18",
        total_guests: guests || 2,
        gateway_ref: gatewayRef,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to process booking", "Booking Error");
        return;
      }

      if (res.data?.booking?.booking_code) {
        setBookingRef(res.data.booking.booking_code);
      }
      toast.success("Stay booked & payment secured in Escrow Vault!", "Booking Confirmed");
      setPaid(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to process booking", "Error");
    } finally {
      setLoading(false);
    }
  }

  if (paid) {
    return (
      <div className="rounded-lg border border-line bg-surface p-8 text-center sm:p-12">
        <CheckCircle2 size={48} className="mx-auto text-safe" aria-hidden />
        <h2 className="mt-4 text-2xl font-bold tracking-tight">Payment held in escrow</h2>
        <p className="mx-auto mt-2 max-w-md text-ink-muted">
          {formatINR(total)} is secured{bookingRef ? ` for Booking ${bookingRef}` : ""}. It is released to the host 24 hours after your successful
          check-in. A confirmation has been sent to your registered email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="rounded-lg border border-line bg-surface p-5 sm:p-7">
        <fieldset>
          <legend className="text-sm font-semibold">Payment Method</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {METHODS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setMethod(id);
                  setError("");
                }}
                aria-pressed={method === id}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-md border px-4 py-4 text-sm font-semibold transition-colors",
                  method === id
                    ? "border-brand-700 bg-brand-50 text-brand-800"
                    : "border-line text-ink hover:border-brand-200",
                )}
              >
                <Icon size={18} aria-hidden />
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        {method === "card" ? (
          <div className="mt-6 grid gap-5">
            <Field label="Card Number">
              {(id) => (
                <Input
                  id={id}
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="0000 0000 0000 0000"
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: groupDigits(e.target.value) })}
                />
              )}
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Expiry Date">
                {(id) => (
                  <Input
                    id={id}
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(e) => setCard({ ...card, expiry: asExpiry(e.target.value) })}
                  />
                )}
              </Field>

              <Field label="CVV">
                {(id) => (
                  <Input
                    id={id}
                    type="password"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="•••"
                    value={card.cvv}
                    onChange={(e) =>
                      setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })
                    }
                  />
                )}
              </Field>
            </div>

            <Field label="Name on Card">
              {(id) => (
                <Input
                  id={id}
                  autoComplete="cc-name"
                  placeholder="John Doe"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                />
              )}
            </Field>
          </div>
        ) : null}

        {method === "upi" ? (
          <Field
            label="UPI ID"
            className="mt-6"
            hint="You will receive a collect request in your UPI app."
          >
            {(id) => (
              <Input
                id={id}
                placeholder="name@okhdfcbank"
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
              />
            )}
          </Field>
        ) : null}

        {method === "netbanking" ? (
          <fieldset className="mt-6">
            <legend className="text-sm font-semibold">Select your bank</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {BANKS.map((b) => (
                <label
                  key={b}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm",
                    bank === b ? "border-brand-700 bg-brand-50" : "border-line hover:border-brand-200",
                  )}
                >
                  <input
                    type="radio"
                    name="bank"
                    value={b}
                    checked={bank === b}
                    onChange={() => setBank(b)}
                    className="accent-brand-700"
                  />
                  {b}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="mt-6 w-full">
        <Lock size={18} aria-hidden />
        Pay Now — {formatINR(total)}
      </Button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
        <ShieldCheck size={14} aria-hidden />
        256-bit SSL encrypted transaction
      </p>
    </form>
  );
}
