"use client";

import { useEffect, useState } from "react";
import {
  Clock,
  CloudRain,
  CloudSun,
  Droplets,
  Gauge,
  Radio,
  ShieldAlert,
  Sun,
  Thermometer,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

type StationData = {
  id: string;
  name: string;
  temperature: string;
  humidity: string;
  pressure: string;
  rain: string;
  lightLux: string;
  weather: string;
  systemStatus: "Working" | "Degraded" | "Offline";
  landslideRisk: "Low" | "Moderate" | "High" | "Critical";
  district: string;
  state: string;
};

const STATIONS: Record<string, StationData> = {
  "parashar-mandi": {
    id: "IITM-ACS-01",
    name: "Parashar, Mandi, India",
    district: "Mandi",
    state: "Himachal Pradesh",
    temperature: "16.1 °C",
    humidity: "78 %",
    pressure: "1007 Pa",
    rain: "0 mm",
    lightLux: "—",
    weather: "broken clouds",
    systemStatus: "Working",
    landslideRisk: "Low",
  },
  "kamand-mandi": {
    id: "IITM-ACS-02",
    name: "Kamand Campus, Mandi, India",
    district: "Mandi",
    state: "Himachal Pradesh",
    temperature: "18.4 °C",
    humidity: "72 %",
    pressure: "1012 Pa",
    rain: "2 mm",
    lightLux: "420 lux",
    weather: "scattered clouds",
    systemStatus: "Working",
    landslideRisk: "Low",
  },
  "joshimath-chamoli": {
    id: "IITM-ACS-03",
    name: "Joshimath, Chamoli, Uttarakhand",
    district: "Chamoli",
    state: "Uttarakhand",
    temperature: "12.8 °C",
    humidity: "86 %",
    pressure: "985 Pa",
    rain: "14 mm",
    lightLux: "180 lux",
    weather: "light rain & fog",
    systemStatus: "Working",
    landslideRisk: "Moderate",
  },
  "meppadi-wayanad": {
    id: "IITM-ACS-04",
    name: "Meppadi, Wayanad, Kerala",
    district: "Wayanad",
    state: "Kerala",
    temperature: "22.5 °C",
    humidity: "92 %",
    pressure: "1004 Pa",
    rain: "28 mm",
    lightLux: "95 lux",
    weather: "heavy monsoon rain",
    systemStatus: "Working",
    landslideRisk: "High",
  },
  "ramgarh-nainital": {
    id: "IITM-ACS-05",
    name: "Ramgarh, Nainital, Uttarakhand",
    district: "Nainital",
    state: "Uttarakhand",
    temperature: "15.3 °C",
    humidity: "68 %",
    pressure: "1009 Pa",
    rain: "0 mm",
    lightLux: "650 lux",
    weather: "clear sky",
    systemStatus: "Working",
    landslideRisk: "Low",
  },
};

export default function SafetyCheckPage() {
  const [selectedStationKey, setSelectedStationKey] = useState("parashar-mandi");
  const [currentStation, setCurrentStation] = useState(STATIONS["parashar-mandi"]);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDateStr, setCurrentDateStr] = useState("");
  const [formattedTimestamp, setFormattedTimestamp] = useState("");

  // Live ticking clock matching design
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);

      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const dayName = days[now.getDay()];
      const dayNum = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();
      setCurrentDateStr(`${dayName}, ${dayNum} ${monthName} ${year} • IST`);

      const yy = String(year).slice(-2);
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(dayNum).padStart(2, "0");
      setFormattedTimestamp(`${yy}-${mm}-${dd} ${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const queryBackendStationSafety = async (key: string) => {
    const st = STATIONS[key];
    if (!st) return;

    try {
      const res = await api.safety.query({
        district: st.district,
        state: st.state,
      });

      if (res?.finalSafetyStatus) {
        const riskMap: Record<string, "Low" | "Moderate" | "High" | "Critical"> = {
          safe: "Low",
          moderate: "Moderate",
          high: "High",
          "high risk": "High",
          critical: "Critical",
        };
        const mappedRisk = riskMap[res.finalSafetyStatus.toLowerCase()] || st.landslideRisk;
        setCurrentStation({
          ...st,
          landslideRisk: mappedRisk,
          rain: res.rainfall_mm ? `${res.rainfall_mm} mm` : st.rain,
        });
        return;
      }
    } catch (err) {
      console.warn("Safety query error:", err);
    }
    setCurrentStation(st);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStationKey(e.target.value);
  };

  const handleStationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    queryBackendStationSafety(selectedStationKey);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Brand Hero Command Center Banner */}
      <section className="relative overflow-hidden bg-brand-900 text-white border-t-4 border-brand-500 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="relative mx-auto max-w-7xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Title */}
          <div className="space-y-2.5">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
              Weather & Sensor Stations
            </h1>

            <p className="text-sm sm:text-base text-brand-100/90 max-w-xl">
              Real-time environmental telemetry and local hazard metrics.
            </p>
          </div>

          {/* Digital Live Clock & Station Counter */}
          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <div className="text-left md:text-right">
              <p className="font-mono text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                {currentTime || "09:52:29"}
              </p>
              <p className="text-xs sm:text-sm font-medium text-brand-200 mt-1">
                {currentDateStr || "Tuesday, 18 Aug 2026 • IST"}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl bg-brand-800/80 border border-brand-700 px-4 py-2 text-sm text-white">
              <span className="font-extrabold text-lg text-emerald-400">5</span>
              <span className="font-medium text-brand-100">Active Stations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Select Location Card */}
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleStationSubmit} className="space-y-3">
            <label
              htmlFor="station-select"
              className="block text-xs font-bold uppercase tracking-wider text-ink-subtle"
            >
              SELECT LOCATION
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full">
                <select
                  id="station-select"
                  value={selectedStationKey}
                  onChange={handleSelectChange}
                  className="w-full appearance-none rounded-lg border border-line bg-canvas px-4 py-3 text-sm font-semibold text-ink focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700 cursor-pointer"
                >
                  <option value="parashar-mandi">Parashar, Mandi, India</option>
                  <option value="kamand-mandi">Kamand Campus, Mandi, India</option>
                  <option value="joshimath-chamoli">Joshimath, Chamoli, Uttarakhand</option>
                  <option value="meppadi-wayanad">Meppadi, Wayanad, Kerala</option>
                  <option value="ramgarh-nainital">Ramgarh, Nainital, Uttarakhand</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-ink-muted">
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 rounded-lg bg-brand-700 hover:bg-brand-800 transition-colors px-8 py-3 text-sm font-bold text-white shadow-xs"
              >
                Submit
              </button>
            </div>
          </form>
        </Card>

        {/* Telemetry Sensor Metrics Grid (9 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: DATE / TIME */}
          <Card className="p-6 text-center flex flex-col items-center justify-center">
            <Clock className="size-8 text-brand-700" strokeWidth={1.75} />
            <p className="mt-3 text-xs font-bold uppercase tracking-wider text-ink-subtle">
              DATE / TIME
            </p>
            <p className="mt-2 text-xl font-extrabold text-ink font-mono tracking-tight">
              {formattedTimestamp || "18-08-26 09:50:51"}
            </p>
          </Card>

          {/* Card 2: TEMPERATURE */}
          <Card className="p-6 text-center flex flex-col items-center justify-center">
            <Thermometer className="size-8 text-brand-700" strokeWidth={1.75} />
            <p className="mt-3 text-xs font-bold uppercase tracking-wider text-ink-subtle">
              TEMPERATURE (°C)
            </p>
            <p className="mt-2 text-2xl font-extrabold text-ink tracking-tight">
              {currentStation.temperature}
            </p>
          </Card>

          {/* Card 3: HUMIDITY */}
          <Card className="p-6 text-center flex flex-col items-center justify-center">
            <Droplets className="size-8 text-brand-700" strokeWidth={1.75} />
            <p className="mt-3 text-xs font-bold uppercase tracking-wider text-ink-subtle">
              HUMIDITY (%)
            </p>
            <p className="mt-2 text-2xl font-extrabold text-ink tracking-tight">
              {currentStation.humidity}
            </p>
          </Card>

          {/* Card 4: PRESSURE */}
          <Card className="p-6 text-center flex flex-col items-center justify-center">
            <Gauge className="size-8 text-brand-700" strokeWidth={1.75} />
            <p className="mt-3 text-xs font-bold uppercase tracking-wider text-ink-subtle">
              PRESSURE (PA)
            </p>
            <p className="mt-2 text-2xl font-extrabold text-ink tracking-tight">
              {currentStation.pressure}
            </p>
          </Card>

          {/* Card 5: RAIN (MM) */}
          <Card className="p-6 text-center flex flex-col items-center justify-center">
            <CloudRain className="size-8 text-brand-700" strokeWidth={1.75} />
            <p className="mt-3 text-xs font-bold uppercase tracking-wider text-ink-subtle">
              RAIN (MM)
            </p>
            <p className="mt-2 text-2xl font-extrabold text-ink tracking-tight">
              {currentStation.rain}
            </p>
          </Card>

          {/* Card 6: LIGHT (LUX) */}
          <Card className="p-6 text-center flex flex-col items-center justify-center">
            <Sun className="size-8 text-brand-700" strokeWidth={1.75} />
            <p className="mt-3 text-xs font-bold uppercase tracking-wider text-ink-subtle">
              LIGHT (LUX)
            </p>
            <p className="mt-2 text-2xl font-extrabold text-ink tracking-tight">
              {currentStation.lightLux}
            </p>
          </Card>

          {/* Card 7: WEATHER */}
          <Card className="p-6 text-center flex flex-col items-center justify-center">
            <CloudSun className="size-8 text-brand-700" strokeWidth={1.75} />
            <p className="mt-3 text-xs font-bold uppercase tracking-wider text-ink-subtle">
              WEATHER
            </p>
            <p className="mt-2 text-xl font-extrabold text-ink tracking-tight">
              {currentStation.weather}
            </p>
          </Card>

          {/* Card 8: SYSTEM STATUS */}
          <Card className="p-6 text-center flex flex-col items-center justify-center">
            <Radio className="size-8 text-brand-700" strokeWidth={1.75} />
            <p className="mt-3 text-xs font-bold uppercase tracking-wider text-ink-subtle">
              SYSTEM STATUS
            </p>
            <div className="mt-2.5">
              <span className="inline-block rounded-md bg-brand-50 text-brand-800 border border-brand-200 px-3.5 py-1 text-xs font-semibold">
                {currentStation.systemStatus}
              </span>
            </div>
          </Card>

          {/* Card 9: LANDSLIDE RISK */}
          <Card className="p-6 text-center flex flex-col items-center justify-center sm:col-span-2 lg:col-span-1">
            <ShieldAlert className="size-8 text-brand-700" strokeWidth={1.75} />
            <p className="mt-3 text-xs font-bold uppercase tracking-wider text-ink-subtle">
              RISK LEVEL
            </p>
            <div className="mt-2.5">
              <span
                className={cn(
                  "inline-block rounded-md px-4 py-1 text-xs font-semibold border",
                  currentStation.landslideRisk === "Low"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : currentStation.landslideRisk === "Moderate"
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-red-50 text-danger border-red-200"
                )}
              >
                {currentStation.landslideRisk}
              </span>
            </div>
          </Card>
        </div>

        {/* Info Attribution Note */}
        <div className="rounded-xl border border-line bg-surface p-4 text-center text-xs text-ink-muted">
          Telemetry feeds monitored continuously via local weather stations.
        </div>
      </main>
    </div>
  );
}
