import Image from "next/image";
import { MapPin, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Quote } from "@/lib/pricing";
import type { Farm } from "@/lib/types";
import { formatINR } from "@/lib/utils";

interface Props {
  farm: Farm;
  quote: Quote;
  guests: number;
  dateRange: string;
}

export function OrderSummary({ farm, quote, guests, dateRange }: Props) {
  const rows = [
    { label: "Dates", value: dateRange },
    { label: "Guests", value: `${guests} ${guests === 1 ? "Guest" : "Guests"}` },
    { label: "Subtotal", value: formatINR(quote.stay) },
    { label: "Service Fee", value: formatINR(quote.serviceFee) },
    { label: "Taxes & Fees", value: formatINR(quote.taxes) },
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="relative aspect-16/9">
          <Image
            src={farm.images[0]}
            alt={farm.name}
            fill
            sizes="(max-width: 1024px) 100vw, 380px"
            className="object-cover"
          />
        </div>

        <div className="p-5">
          <h2 className="text-lg font-bold tracking-tight">{farm.name}</h2>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-muted">
            <MapPin size={16} aria-hidden />
            {farm.location}
          </p>

          <dl className="mt-4 divide-y divide-line text-sm">
            {rows.map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4 py-3">
                <dt className="text-ink-muted">{label}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 py-3">
              <dt className="font-bold">Total</dt>
              <dd className="font-bold">{formatINR(quote.total)}</dd>
            </div>
          </dl>
        </div>
      </Card>

      <Card className="flex gap-3 p-5">
        <ShieldCheck size={24} className="shrink-0 text-brand-800" aria-hidden />
        <div>
          <h3 className="font-bold">Payment held in Escrow</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Your funds are held securely and only released to the host 24 hours after your
            successful check-in.
          </p>
        </div>
      </Card>
    </div>
  );
}
