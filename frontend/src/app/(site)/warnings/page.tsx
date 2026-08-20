"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertOctagon,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Compass,
  Cpu,
  Filter,
  Flame,
  MapPin,
  PhoneCall,
  Radio,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Warning } from "@/lib/types";
import { cn } from "@/lib/utils";

const SEVERITY_BADGES: Record<string, string> = {
  Critical: "bg-red-100 text-red-800 border-red-300",
  High: "bg-orange-100 text-orange-800 border-orange-300",
  Medium: "bg-amber-100 text-amber-800 border-amber-300",
  Low: "bg-emerald-100 text-emerald-800 border-emerald-300",
};

export default function WarningsFeedPage() {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("Active");

  useEffect(() => {
    async function loadWarnings() {
      const data = await api.warnings.list(filterStatus);
      setWarnings(data);
    }
    loadWarnings();
  }, [filterStatus]);

  const filteredWarnings = warnings.filter((w) => {
    const matchSeverity = filterSeverity === "all" || w.severity === filterSeverity;
    const matchSource = filterSource === "all" || w.warningSource === filterSource;
    const matchStatus = filterStatus === "all" || w.status === filterStatus;
    return matchSeverity && matchSource && matchStatus;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Hazard Warnings & Advisories
          </h1>
          <p className="mt-1 text-ink-muted max-w-2xl">
            Real-time regional safety alerts. Affected farmstays and bookings automatically receive escrow protections.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href="/report" variant="outline" size="md" className="gap-2 border-danger text-danger hover:bg-danger/5">
            <AlertTriangle size={16} />
            Report Landslide Photo
          </ButtonLink>
          <ButtonLink href="/host/warnings/new" variant="primary" size="md" className="gap-2">
            <Radio size={16} />
            Host Broadcast
          </ButtonLink>
        </div>
      </div>

      {/* Emergency Hotline Bar */}
      <div className="mt-8 rounded-xl border border-red-200 bg-gradient-to-r from-red-500/10 via-amber-500/10 to-transparent p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-danger text-white">
            <PhoneCall size={18} />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-danger tracking-wide">
              Himalayan Disaster Emergency Response Helplines
            </p>
            <p className="text-sm font-semibold text-ink">
              Uttarakhand State Control Room: 1070 | NDRF Toll-Free: 1078 | BRO Highway Clearance: 1800-180-5555
            </p>
          </div>
        </div>
        <ButtonLink href="/safety" variant="outline" size="sm" className="shrink-0 bg-surface">
          View Matrix Safety Check
        </ButtonLink>
      </div>

      {/* Filters Bar */}
      <Card className="mt-8 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-ink-subtle flex items-center gap-1">
              <Filter size={14} /> Filter Feed:
            </span>

            {/* Status Filter */}
            <div className="flex rounded-lg border border-line p-1 bg-canvas">
              {["Active", "Expired", "all"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all",
                    filterStatus === status ? "bg-surface shadow-xs text-ink" : "text-ink-muted hover:text-ink"
                  )}
                >
                  {status === "all" ? "All Statuses" : status}
                </button>
              ))}
            </div>

            {/* Source Filter */}
            <div className="flex rounded-lg border border-line p-1 bg-canvas">
              {[
                { id: "all", label: "All Sources" },
                { id: "Automated_CNN", label: "🤖 Automated CNN" },
                { id: "Manual_Host", label: "🏡 Host Manual" },
              ].map((src) => (
                <button
                  key={src.id}
                  onClick={() => setFilterSource(src.id)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-semibold transition-all",
                    filterSource === src.id ? "bg-surface shadow-xs text-ink" : "text-ink-muted hover:text-ink"
                  )}
                >
                  {src.label}
                </button>
              ))}
            </div>

            {/* Severity Filter */}
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <p className="text-xs text-ink-muted">
            Showing <strong>{filteredWarnings.length}</strong> warning records
          </p>
        </div>
      </Card>

      {/* Warnings List */}
      <div className="mt-8 space-y-6">
        {filteredWarnings.map((warning) => (
          <Card
            key={warning.id}
            className={cn(
              "p-6 border-l-4 transition-all hover:shadow-md",
              warning.severity === "Critical"
                ? "border-l-danger bg-red-50/20"
                : warning.severity === "High"
                ? "border-l-orange-500 bg-orange-50/10"
                : warning.severity === "Medium"
                ? "border-l-amber-500"
                : "border-l-safe"
            )}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-ink-subtle">{warning.id}</span>
                  <span
                    className={cn(
                      "rounded-md border px-2.5 py-0.5 text-xs font-semibold",
                      SEVERITY_BADGES[warning.severity]
                    )}
                  >
                    {warning.severity} Severity
                  </span>

                  <span className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700 flex items-center gap-1">
                    {warning.warningSource === "Automated_CNN" ? (
                      <>
                        <Cpu size={12} className="text-indigo-600" /> Automated Verification
                      </>
                    ) : (
                      <>
                        <Users size={12} className="text-emerald-700" /> Host Broadcast
                      </>
                    )}
                  </span>

                  {warning.status === "Active" ? (
                    <span className="rounded-md bg-red-100 text-danger border border-red-200 px-2 py-0.5 text-[11px] font-bold">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="rounded-md bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 text-[11px] font-medium">
                      CLEARED
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold tracking-tight text-ink">{warning.title}</h2>

                <p className="text-sm text-ink-muted leading-relaxed">{warning.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-ink-subtle pt-2">
                  <span className="flex items-center gap-1 font-mono">
                    <MapPin size={14} className="text-danger" /> Epicenter: {warning.epicenterLat}° N, {warning.epicenterLng}° E
                  </span>
                  <span className="flex items-center gap-1">
                    <Compass size={14} /> Blast Radius: <strong>{warning.impactRadiusKm} km</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> Issued: {warning.issuedAt}
                  </span>
                  <span className="flex items-center gap-1 text-ink-muted">
                    Expires: {warning.expiresAt}
                  </span>
                </div>
              </div>

              {/* Impact Box */}
              <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 lg:border-l border-line pt-4 lg:pt-0 lg:pl-6 shrink-0">
                <div className="text-left lg:text-right">
                  <p className="text-xs text-ink-subtle uppercase font-semibold">Impacted Zone</p>
                  <p className="text-sm font-extrabold text-ink">
                    {warning.affectedFarmsCount} Farmstays • {warning.affectedBookingsCount} Bookings
                  </p>
                  <p className="text-[11px] text-safe font-medium">100% Escrow Refund Protected</p>
                </div>

                <div className="flex gap-2">
                  {warning.farmSlug && (
                    <ButtonLink href={`/farms/${warning.farmSlug}`} variant="outline" size="sm">
                      View Farm
                    </ButtonLink>
                  )}
                  <ButtonLink href="/escrow" variant="primary" size="sm">
                    Escrow Status
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredWarnings.length === 0 && (
          <Card className="p-12 text-center">
            <CheckCircle2 size={40} className="mx-auto text-safe" />
            <h3 className="mt-3 text-lg font-bold">No Warnings Match Your Filter</h3>
            <p className="mt-1 text-xs text-ink-muted">Try switching between Active / Expired or All Sources.</p>
          </Card>
        )}
      </div>

      {/* DFD / CFD Educational Guide */}
      <div className="mt-16 rounded-xl border border-line bg-surface p-8">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <ShieldAlert size={20} className="text-brand-700" /> How AgroSafe Warning Dispatch Operates (CFD / DFD Pipeline)
        </h3>
        <div className="mt-6 grid gap-6 md:grid-cols-3 text-xs leading-relaxed text-ink-muted">
          <div className="rounded-lg border border-line p-4 bg-canvas/40">
            <p className="font-bold text-ink text-sm flex items-center gap-1.5">
              <Cpu size={16} className="text-indigo-600" /> 1. CNN Image Inference
            </p>
            <p className="mt-2">
              Citizen landslide reports undergo automated visual classification. Reports scoring above the 0.70 confidence threshold automatically generate an active warning record in DB.
            </p>
          </div>
          <div className="rounded-lg border border-line p-4 bg-canvas/40">
            <p className="font-bold text-ink text-sm flex items-center gap-1.5">
              <Users size={16} className="text-emerald-700" /> 2. Verified Host Triggers
            </p>
            <p className="mt-2">
              Local farmstay hosts have direct operational authority to issue manual hazard broadcasts. The system cross-references nearby properties within the specified radius.
            </p>
          </div>
          <div className="rounded-lg border border-line p-4 bg-canvas/40">
            <p className="font-bold text-ink text-sm flex items-center gap-1.5">
              <Sparkles size={16} className="text-amber-600" /> 3. Escrow Safeguard
            </p>
            <p className="mt-2">
              Active warnings trigger an instant lock on affected stays. Guests can cancel with a single tap for a 100% full refund directly from the AgroSafe Escrow Vault.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
