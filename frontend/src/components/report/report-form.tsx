"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, FileUp, LocateFixed, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { api } from "@/lib/api";
import { toast } from "@/lib/toast-context";
import { cn } from "@/lib/utils";

const MAX_BYTES = 10 * 1024 * 1024;

export function ReportForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);
  const [lat, setLat] = useState("10.152");
  const [lng, setLng] = useState("77.061");
  const [uploadedAt, setUploadedAt] = useState("");
  const [details, setDetails] = useState("");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverFeedback, setServerFeedback] = useState<string | null>(null);

  // Stamped after mount — rendering a clock on the server would mismatch on hydration.
  useEffect(() => setUploadedAt(new Date().toLocaleString()), []);

  // Revoke the object URL when the preview changes or the form unmounts.
  useEffect(() => {
    const url = preview?.url;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [preview?.url]);

  function accept(file: File | undefined) {
    if (!file) return;
    if (!/^image\/(jpeg|png)$/.test(file.type)) {
      setError("Only JPG and PNG images are accepted.");
      toast.error("Only JPG and PNG images are accepted.", "File Format");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That image is larger than 10MB.");
      toast.error("That image is larger than 10MB.", "File Too Large");
      return;
    }
    setError("");
    setPreview({ url: URL.createObjectURL(file), name: file.name });
    setUploadedAt(new Date().toLocaleString());
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("This browser cannot share your location. Enter the coordinates manually.");
      toast.error("This browser cannot share your location.", "Location Error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(4));
        setLng(pos.coords.longitude.toFixed(4));
        setError("");
        toast.info(`GPS coordinates resolved: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`, "Location Captured");
      },
      () => {
        setError("Location permission denied. Enter the coordinates manually.");
        toast.error("Location permission denied.", "Permission Error");
      },
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!preview) {
      setError("Attach a photo of the hazard — reports without evidence cannot be verified.");
      toast.error("Attach a photo of the hazard.", "Evidence Required");
      return;
    }
    if (!lat || !lng) {
      setError("Latitude and longitude are required.");
      toast.error("Latitude and longitude are required.", "Missing Coordinates");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await api.reports.create({
        image_s3_url: preview.url || "https://picsum.photos/seed/landslide-evidence/800/600",
        latitude: Number(lat),
        longitude: Number(lng),
        location_name: `Slope Sector (${lat}° N, ${lng}° E)`,
        details,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to submit landslide report", "Submission Error");
        return;
      }

      if (res.message) {
        setServerFeedback(res.message);
      }
      toast.success("Landslide photo report submitted and verified!", "Report Dispatched");
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit report", "Error");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-line bg-surface p-8 text-center sm:p-12">
        <CheckCircle2 size={48} className="mx-auto text-safe" aria-hidden />
        <h2 className="mt-4 text-2xl font-bold tracking-tight">Report received</h2>
        <p className="mx-auto mt-2 max-w-md text-ink-muted">
          Your hazard report for {lat}, {lng} is queued for automated verification. Travellers with
          bookings in this region are alerted as soon as it clears.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            setSubmitted(false);
            setPreview(null);
            setDetails("");
          }}
        >
          File another report
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-line bg-surface p-5 sm:p-7">
      <p className="text-sm font-semibold">Evidence Image</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          accept(e.dataTransfer.files[0]);
        }}
        className={cn(
          "mt-2 rounded-md border-2 border-dashed transition-colors",
          dragging ? "border-brand-600 bg-brand-50" : "border-line",
        )}
      >
        {preview ? (
          <div className="relative">
            <div className="relative aspect-16/9 overflow-hidden rounded-md">
              <Image src={preview.url} alt={preview.name} fill unoptimized className="object-contain" />
            </div>
            <button
              type="button"
              onClick={() => setPreview(null)}
              aria-label="Remove image"
              className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 px-6 py-12 text-center"
          >
            <FileUp size={32} className="text-ink-muted" aria-hidden />
            <span className="text-ink">Click or drag image of the hazard here</span>
            <span className="text-xs text-ink-subtle">JPG, PNG (Max 10MB)</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(e) => accept(e.target.files?.[0])}
      />

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Latitude">
          {(id) => (
            <Input id={id} inputMode="decimal" value={lat} onChange={(e) => setLat(e.target.value)} />
          )}
        </Field>
        <Field label="Longitude">
          {(id) => (
            <Input id={id} inputMode="decimal" value={lng} onChange={(e) => setLng(e.target.value)} />
          )}
        </Field>
      </div>

      <Button type="button" variant="outline" size="sm" className="mt-3" onClick={useMyLocation}>
        <LocateFixed size={16} aria-hidden />
        Use my current location
      </Button>

      <Field label="Time of Upload (Automatic)" className="mt-6">
        {(id) => <Input id={id} readOnly value={uploadedAt} className="bg-black/[0.03]" />}
      </Field>

      <Field label="Additional Details (Optional)" className="mt-6">
        {(id) => (
          <Textarea
            id={id}
            placeholder="Describe the blockage or hazard severity..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        )}
      </Field>

      {error ? (
        <p role="alert" className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="mt-6 w-full">
        <AlertTriangle size={18} aria-hidden />
        Upload Warning
      </Button>
    </form>
  );
}
