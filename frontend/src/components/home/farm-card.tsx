import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { SafetyBadge } from "@/components/ui/safety-badge";
import type { Farm } from "@/lib/types";
import { formatINR } from "@/lib/utils";

export function FarmCard({ farm }: { farm: Farm }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition-shadow hover:shadow-md">
      <div className="relative aspect-4/3">
        <Image
          src={farm.images[0]}
          alt={farm.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
        <SafetyBadge status={farm.safety} className="absolute top-3 right-3" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold tracking-tight">
            <Link href={`/farms/${farm.slug}`} className="hover:text-brand-700">
              {farm.name}
            </Link>
          </h3>
          <p className="shrink-0 text-sm font-bold text-brand-700">
            {formatINR(farm.pricePerNight)}
            <span className="font-medium text-ink-muted">/night</span>
          </p>
        </div>

        <p className="mt-2 text-sm text-ink-muted">
          {farm.location} • {farm.category}
        </p>

        <ButtonLink
          href={`/farms/${farm.slug}`}
          variant="outline"
          size="md"
          className="mt-5 w-full"
        >
          View Itinerary
        </ButtonLink>
      </div>
    </article>
  );
}
