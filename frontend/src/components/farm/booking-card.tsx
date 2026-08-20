"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { quote } from "@/lib/pricing";
import type { Farm } from "@/lib/types";
import { formatINR, nightsBetween } from "@/lib/utils";

interface Props {
  farm: Farm;
  defaults: { checkIn: string; checkOut: string };
}

export function BookingCard({ farm, defaults }: Props) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(defaults.checkIn);
  const [checkOut, setCheckOut] = useState(defaults.checkOut);
  const [guests, setGuests] = useState(2);

  const nights = nightsBetween(checkIn, checkOut);
  // Same quote the checkout page charges — the two must never disagree.
  const { stay, serviceFee, taxes, total } = quote(farm.pricePerNight, nights);

  function book() {
    const params = new URLSearchParams({
      farm: farm.slug,
      checkIn,
      checkOut,
      guests: String(guests),
    });
    router.push(`/checkout?${params}`);
  }

  return (
    <aside className="rounded-lg border border-line bg-surface p-5 sm:p-6 lg:sticky lg:top-24">
      <p className="flex items-baseline justify-between">
        <span className="text-3xl font-extrabold tracking-tight">
          {formatINR(farm.pricePerNight)}
        </span>
        <span className="text-ink-muted">/ night</span>
      </p>

      <div className="mt-5 grid grid-cols-2 rounded-md border border-line">
        <Field label="Check-in" className="border-r border-line p-3">
          {(id) => (
            <Input
              id={id}
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="border-0 px-0 py-0"
            />
          )}
        </Field>
        <Field label="Check-out" className="p-3">
          {(id) => (
            <Input
              id={id}
              type="date"
              min={checkIn || undefined}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="border-0 px-0 py-0"
            />
          )}
        </Field>
      </div>

      <Field label="Guests" className="mt-3 rounded-md border border-line p-3">
        {(id) => (
          <Select
            id={id}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="border-0 px-0 py-0"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </Select>
        )}
      </Field>

      <dl className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-muted">
            {formatINR(farm.pricePerNight)} × {nights} {nights === 1 ? "night" : "nights"}
          </dt>
          <dd className="font-medium">{formatINR(stay)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-muted">Service Fee</dt>
          <dd className="font-medium">{formatINR(serviceFee)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-muted">Taxes &amp; Fees</dt>
          <dd className="font-medium">{formatINR(taxes)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-line pt-3">
          <dt className="text-xl font-bold">Total Price</dt>
          <dd className="text-2xl font-extrabold">{formatINR(total)}</dd>
        </div>
      </dl>

      <Button
        onClick={book}
        disabled={nights === 0}
        size="lg"
        className="mt-5 w-full flex-col gap-0.5"
      >
        <span>Book &amp; Hold in Escrow</span>
        <span className="text-[10px] font-medium tracking-wider text-white/80 uppercase">
          Safe transaction guaranteed
        </span>
      </Button>

      {nights === 0 ? (
        <p className="mt-2 text-center text-xs text-danger">
          Pick a check-out date after your check-in date.
        </p>
      ) : null}

      <p className="mt-5 flex gap-2 rounded-md border-l-4 border-brand-700 bg-black/[0.03] p-3 text-xs text-ink-muted">
        <ShieldCheck size={16} className="mt-px shrink-0 text-brand-700" aria-hidden />
        Your payment is held securely and only released to the host after your successful stay.
      </p>

      <p className="mt-5 border-t border-line pt-5 text-sm font-bold">Hosted by {farm.host}</p>
    </aside>
  );
}
