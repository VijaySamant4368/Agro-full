"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building,
  CheckCircle2,
  DollarSign,
  FileCheck,
  Locate,
  MapPin,
  Shield,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { LOCATIONS, STATES, districtsOf, subDistrictsOf } from "@/lib/data/locations";
import { getGeoCenter } from "@/lib/data/farms";
import { api } from "@/lib/api";
import { toast } from "@/lib/toast-context";
import { SafetyBadge } from "@/components/ui/safety-badge";
import { formatINR, cn } from "@/lib/utils";

const AMENITY_OPTIONS = [
  "Organic Farming Experience",
  "Rural Connect Wi-Fi",
  "Safety Monitoring & Sensors",
  "Local Kumaoni/Kerala Meals",
  "Guided Nature Walks",
  "Escrow Protection",
  "Solar Powered",
  "Resident Livestock",
  "Tea/Spice Plantation Tour",
];

const CATEGORIES = [
  "Organic Farm",
  "Spice Garden",
  "Floral Fields",
  "Paddy Fields",
  "Tea & Cardamom",
  "Himalayan Orchard",
  "Permaculture Retreat",
];

export default function NewFarmPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Organic Farm");
  const [state, setState] = useState(STATES[0]);
  const [district, setDistrict] = useState(districtsOf(STATES[0])[0] || "");
  const [subDistrict, setSubDistrict] = useState(
    subDistrictsOf(STATES[0], districtsOf(STATES[0])[0] || "")[0] || ""
  );
  const [nightlyRate, setNightlyRate] = useState("4200");
  const [summary, setSummary] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "Organic Farming Experience",
    "Rural Connect Wi-Fi",
    "Safety Monitoring & Sensors",
    "Escrow Protection",
  ]);

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [usesFallback, setUsesFallback] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Auto-sync fallback coordinates from Static Geo JSON
  useEffect(() => {
    if (state && district) {
      const center = getGeoCenter(state, district, subDistrict);
      setLat(center.centerLatitude.toFixed(3));
      setLng(center.centerLongitude.toFixed(3));
      setUsesFallback(true);
    }
  }, [state, district, subDistrict]);

  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleStateChange = (newState: string) => {
    setState(newState);
    const firstDistrict = districtsOf(newState)[0] || "";
    setDistrict(firstDistrict);
    const firstSub = subDistrictsOf(newState, firstDistrict)[0] || "";
    setSubDistrict(firstSub);
  };

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const firstSub = subDistrictsOf(state, newDist)[0] || "";
    setSubDistrict(firstSub);
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = "Farmstay name is required.";
    if (!summary.trim() || summary.length < 20)
      err.summary = "Provide a summary of at least 20 characters.";
    if (!nightlyRate || Number(nightlyRate) <= 0)
      err.nightlyRate = "Valid nightly price is required.";
    if (!emergencyContact.trim())
      err.emergencyContact = "Local emergency contact or caretaker info is required.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields accurately.", "Validation Error");
      return;
    }

    try {
      const res = await api.farms.create({
        title: name,
        description: summary,
        state,
        district,
        subdistrict: subDistrict,
        category,
        nightly_rate: Number(nightlyRate),
        latitude: lat ? Number(lat) : undefined,
        longitude: lng ? Number(lng) : undefined,
        amenities: selectedAmenities,
        emergency_contact: emergencyContact,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to create farmstay listing", "Listing Error");
        return;
      }

      toast.success(`"${name}" published to AgroSafe network!`, "Farmstay Listed");
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to publish listing", "Error");
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Card className="p-10">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-brand-50 text-safe ring-8 ring-brand-50/50">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Farmstay Published Successfully!
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
            <strong>{name}</strong> is now registered in the AgroSafe database.
            It has been connected to the regional Hazard Safety Matrix and Escrow Protection Gateway.
          </p>

          <div className="mt-6 rounded-lg border border-line bg-canvas/60 p-4 text-left text-xs text-ink-muted space-y-1">
            <p><strong>Location:</strong> {subDistrict}, {district}, {state}</p>
            <p><strong>Coordinates:</strong> {lat}° N, {lng}° E {usesFallback && "(Auto-resolved from Static Geo Reference)"}</p>
            <p><strong>Nightly Rate:</strong> {formatINR(Number(nightlyRate))}</p>
            <p><strong>Initial Safety Status:</strong> <span className="text-safe font-semibold">Safe (Matrix Verified)</span></p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/host" variant="primary" size="md">
              Return to Host Dashboard
            </ButtonLink>
            <ButtonLink href="/" variant="outline" size="md">
              View on Homepage
            </ButtonLink>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-6">
        <ButtonLink href="/host" variant="outline" size="sm" className="gap-1 text-xs">
          <ArrowLeft size={14} /> Back to Host Dashboard
        </ButtonLink>
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Left Form */}
        <div className="lg:col-span-7">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              List a New Farmstay
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Enter your property details. Coordinates will automatically connect to safety alerts and bookings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <Card className="p-6 space-y-5">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Building size={18} className="text-brand-700" /> Basic Information
              </h2>

              <Field label="Farmstay Title / Name">
                {(id) => (
                  <Input
                    id={id}
                    placeholder="e.g. Pine Ridge Organic Orchard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                )}
              </Field>
              {errors.name && <p className="text-xs text-danger">{errors.name}</p>}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Farmstay Category">
                  {(id) => (
                    <Select id={id} value={category} onChange={(e) => setCategory(e.target.value)}>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </Select>
                  )}
                </Field>

                <Field label="Nightly Price (INR)">
                  {(id) => (
                    <Input
                      id={id}
                      type="number"
                      min="500"
                      step="100"
                      value={nightlyRate}
                      onChange={(e) => setNightlyRate(e.target.value)}
                    />
                  )}
                </Field>
              </div>
              {errors.nightlyRate && <p className="text-xs text-danger">{errors.nightlyRate}</p>}

              <Field label="Summary & Farm Experience">
                {(id) => (
                  <Textarea
                    id={id}
                    rows={4}
                    placeholder="Describe your agricultural property, crops harvested, daily guest activities, and mountain views..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  />
                )}
              </Field>
              {errors.summary && <p className="text-xs text-danger">{errors.summary}</p>}
            </Card>

            {/* Cascading Geo Location */}
            <Card className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <MapPin size={18} className="text-brand-700" /> Location & Region
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="State">
                  {(id) => (
                    <Select id={id} value={state} onChange={(e) => handleStateChange(e.target.value)}>
                      {STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </Select>
                  )}
                </Field>

                <Field label="District">
                  {(id) => (
                    <Select id={id} value={district} onChange={(e) => handleDistrictChange(e.target.value)}>
                      {districtsOf(state).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </Select>
                  )}
                </Field>

                <Field label="Sub-District / Block">
                  {(id) => (
                    <Select id={id} value={subDistrict} onChange={(e) => setSubDistrict(e.target.value)}>
                      {subDistrictsOf(state, district).map((sd) => (
                        <option key={sd} value={sd}>{sd}</option>
                      ))}
                    </Select>
                  )}
                </Field>
              </div>

              <div className="rounded-lg border border-line bg-canvas/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-ink-muted">Coordinates (Used by Warning Dispatcher)</p>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((pos) => {
                          setLat(pos.coords.latitude.toFixed(4));
                          setLng(pos.coords.longitude.toFixed(4));
                          setUsesFallback(false);
                        });
                      }
                    }}
                    className="text-xs font-medium text-brand-700 hover:underline flex items-center gap-1"
                  >
                    <Locate size={12} /> Auto-Detect My GPS
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-ink-subtle">Latitude (° N)</label>
                    <Input
                      value={lat}
                      onChange={(e) => {
                        setLat(e.target.value);
                        setUsesFallback(false);
                      }}
                      className="mt-1 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-ink-subtle">Longitude (° E)</label>
                    <Input
                      value={lng}
                      onChange={(e) => {
                        setLng(e.target.value);
                        setUsesFallback(false);
                      }}
                      className="mt-1 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Amenities */}
            <Card className="p-6 space-y-4">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Sparkles size={18} className="text-brand-700" /> Amenities & Features
              </h2>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {AMENITY_OPTIONS.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2.5 rounded-lg border border-line p-3 text-xs font-medium cursor-pointer hover:bg-canvas/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(item)}
                      onChange={() => toggleAmenity(item)}
                      className="rounded border-line text-brand-700 focus:ring-brand-600 size-4"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </Card>

            {/* Safety & Emergency Contacts */}
            <Card className="p-6 space-y-4">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Shield size={18} className="text-brand-700" /> Safety & Emergency Protocol
              </h2>
              <Field label="Emergency Contact & Local Caretaker Details">
                {(id) => (
                  <Input
                    id={id}
                    placeholder="e.g. Caretaker Anand: +91-9876543210. Nearest hospital 8km away."
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                  />
                )}
              </Field>
              {errors.emergencyContact && <p className="text-xs text-danger">{errors.emergencyContact}</p>}
            </Card>

            <Button type="submit" size="lg" className="w-full gap-2">
              <FileCheck size={18} /> Publish Farmstay to Safety Network
            </Button>
          </form>
        </div>

        {/* Right Live Preview */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-subtle">
              Live Guest Card Preview
            </p>

            <Card className="overflow-hidden border-2 border-brand-500/20 shadow-md">
              <div className="relative aspect-16/10 w-full bg-slate-100">
                <div className="flex size-full items-center justify-center bg-gradient-to-br from-brand-800 to-brand-950 text-white p-6 text-center">
                  <div>
                    <Building size={32} className="mx-auto text-brand-200" />
                    <p className="mt-2 font-bold text-sm">{name || "Your Farmstay Name"}</p>
                    <p className="text-xs text-brand-200">{category}</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <SafetyBadge status="safe" />
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-700 uppercase tracking-wide">
                    {category}
                  </span>
                  <span className="text-sm font-extrabold text-ink">
                    {formatINR(Number(nightlyRate) || 0)} <span className="text-xs font-normal text-ink-muted">/ night</span>
                  </span>
                </div>

                <h3 className="mt-2 text-lg font-bold">
                  {name || "Apple Blossom Retreat"}
                </h3>

                <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
                  <MapPin size={14} className="shrink-0" />
                  {subDistrict || "Sub-District"}, {district || "District"} — {state || "State"}
                </p>

                <p className="mt-3 text-xs text-ink-muted line-clamp-3">
                  {summary || "Your farmstay description and experience highlights will appear here..."}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-3">
                  {selectedAmenities.slice(0, 4).map((a) => (
                    <span key={a} className="rounded-md bg-canvas px-2 py-0.5 text-[10px] font-medium text-ink-muted">
                      {a}
                    </span>
                  ))}
                  {selectedAmenities.length > 4 && (
                    <span className="rounded-md bg-canvas px-2 py-0.5 text-[10px] font-medium text-ink-muted">
                      +{selectedAmenities.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </Card>

            <div className="rounded-lg border border-line bg-surface p-4 text-xs text-ink-muted space-y-2">
              <p className="font-semibold text-ink">🛡️ AgroSafe Guarantee for Hosts:</p>
              <ul className="list-disc list-inside space-y-1 text-ink-subtle">
                <li>Automatic risk assessment on the 12-month Himalayan Matrix.</li>
                <li>Stay amounts locked in Escrow Vault at time of guest booking.</li>
                <li>Ability to issue instant emergency warnings in case of inclement weather.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
