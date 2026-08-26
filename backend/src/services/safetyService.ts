import { supabase } from "../config/supabase.js";
import { haversineDistanceKm } from "./warningService.js";
import { MonthlySafeMatrix } from "../types/index.js";

export const getAnnualMatrixForDistrict = async (district: string, year = 2026) => {
  const { data, error } = await supabase
    .from("monthly_safe_matrix")
    .select("*")
    .ilike("district", district)
    .eq("year", year)
    .order("month", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

export const evaluateSafetyStatus = async (params: {
  state: string;
  district: string;
  latitude?: number;
  longitude?: number;
  date?: string;
}) => {
  const targetDate = params.date ? new Date(params.date) : new Date();
  const month = targetDate.getMonth() + 1;
  const year = targetDate.getFullYear();

  // 1. Fetch base rating from Monthly Safe Matrix (CFD Step 1)
  const { data: baseRecord } = await supabase
    .from("monthly_safe_matrix")
    .select("*")
    .ilike("district", params.district)
    .eq("year", year)
    .eq("month", month)
    .maybeSingle<MonthlySafeMatrix>();

  const baseRating = baseRecord ? baseRecord.safety_rating : "Safe";

  // 2. Query DB for active real-time warnings (CFD Step 2)
  const { data: activeWarnings } = await supabase.from("warnings").select("*").eq("status", "Active");

  // 3. Check proximity to epicenter if coordinates provided
  let nearbyAlert: any = null;
  if (params.latitude && params.longitude && activeWarnings) {
    for (const w of activeWarnings) {
      const dist = haversineDistanceKm(
        params.latitude,
        params.longitude,
        w.epicenter_lat,
        w.epicenter_lng
      );
      if (dist <= w.impact_radius_km) {
        nearbyAlert = { ...w, distanceKm: parseFloat(dist.toFixed(2)) };
        break;
      }
    }
  }

  // 4. Overridden final output (CFD Step 3)
  const isOverridden = !!nearbyAlert;
  const finalSafety = isOverridden ? "high" : baseRating.toLowerCase() === "high risk" ? "high" : baseRating.toLowerCase();

  return {
    location: `${params.district}, ${params.state}`,
    month,
    year,
    baseMatrixRating: baseRating,
    rainfall_mm: baseRecord?.rainfall_mm || 0,
    soil_stability_index: baseRecord?.soil_stability_index || 100,
    isRealtimeOverridden: isOverridden,
    activeWarning: nearbyAlert,
    finalSafetyStatus: finalSafety,
  };
};
