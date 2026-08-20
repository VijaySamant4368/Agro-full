import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { FarmCard } from "@/components/home/farm-card";
import { HeroSearch } from "@/components/home/hero-search";
import { ButtonLink } from "@/components/ui/button";
import { api } from "@/lib/api";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : (v ?? ""));

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = {
    state: one(params.state),
    district: one(params.district),
    subDistrict: one(params.subDistrict),
    checkIn: one(params.checkIn),
    checkOut: one(params.checkOut),
  };

  const farms = await api.farms.list({
    state: query.state || undefined,
    district: query.district || undefined,
    subdistrict: query.subDistrict || undefined,
  });
  const filtered = Boolean(query.state || query.district || query.subDistrict);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate">
        <Image
          src="https://picsum.photos/seed/agrosafe-hero/1920/1080"
          alt=""
          fill
          priority
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-brand-900/70" />

        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Explore Rural India, Safely.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
            Discover authenticated agrotourism experiences with real-time safety metrics and
            environmental landslide monitoring.
          </p>

          <div className="mt-10 text-left">
            <HeroSearch initial={query} />
          </div>
        </div>
      </section>

      {/* Listings */}
      <section id="farmstays" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Verified Farmstays
            </h2>
            <p className="mt-2 text-ink-muted">
              {filtered
                ? `${farms.length} ${farms.length === 1 ? "stay" : "stays"} matching your search.`
                : "Top-rated agricultural experiences with current safety status."}
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:underline"
          >
            View All Destinations <ArrowRight size={16} />
          </Link>
        </div>

        {farms.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {farms.map((farm) => (
              <FarmCard key={farm.slug} farm={farm} />
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-lg border border-dashed border-line p-10 text-center text-ink-muted">
            No farmstays match that area yet. Try a wider search.
          </p>
        )}
      </section>

      {/* Monitoring banner */}
      <section className="bg-brand-800 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-start gap-4">
            <ShieldCheck size={36} className="shrink-0" aria-hidden />
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Active Monitoring Enabled</h2>
              <p className="mt-1 text-white/90">
                Our Safety Matrix monitors local soil stability and weather patterns 24/7.
              </p>
            </div>
          </div>

          <ButtonLink href="/live" variant="light" size="md" className="shrink-0">
            View Live Safety Map
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
