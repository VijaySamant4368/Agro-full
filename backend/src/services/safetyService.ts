import { supabase, isLiveSupabaseConfigured } from "../config/supabase.js";
import { haversineDistanceKm } from "./warningService.js";
import { MonthlySafeMatrix } from "../types/index.js";

const mockMatrix: MonthlySafeMatrix[] = [
  { id: 1, state: "Uttarakhand", district: "Nainital", year: 2026, month: 8, safety_rating: "High Risk", rainfall_mm: 410, soil_stability_index: 40, historical_landslides_count: 12, last_updated: new Date().toISOString() },
  { id: 2, state: "Uttarakhand", district: "Chamoli", year: 2026, month: 8, safety_rating: "High Risk", rainfall_mm: 490, soil_stability_index: 34, historical_landslides_count: 18, last_updated: new Date().toISOString() },
  { id: 3, state: "Kerala", district: "Wayanad", year: 2026, month: 8, safety_rating: "High Risk", rainfall_mm: 710, soil_stability_index: 36, historical_landslides_count: 19, last_updated: new Date().toISOString() },
  { id: 4, state: "Uttarakhand", district: "Nainital", year: 2026, month: 10, safety_rating: "Safe", rainfall_mm: 25, soil_stability_index: 91, historical_landslides_count: 0, last_updated: new Date().toISOString() },
  { id: 5, state: "Uttarakhand", district: "Chamoli", year: 2026, month: 10, safety_rating: "Safe", rainfall_mm: 30, soil_stability_index: 90, historical_landslides_count: 1, last_updated: new Date().toISOString() },
];

export const getAnnualMatrixForDistrict = async (district: string, year = 2026) => {
  if (isLiveSupabaseConfigured()) {
    const { data, error } = await supabase
      .from("monthly_safe_matrix")
      .select("*")
      .ilike("district", district)
      .eq("year", year)
      .order("month", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  }

  return mockMatrix.filter((m) => m.district.toLowerCase() === district.toLowerCase());
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
  let baseRecord: MonthlySafeMatrix | null = null;
  if (isLiveSupabaseConfigured()) {
    const { data } = await supabase
      .from("monthly_safe_matrix")
      .select("*")
      .ilike("district", params.district)
      .eq("year", year)
      .eq("month", month)
      .maybeSingle();
    baseRecord = data;
  } else {
    baseRecord =
      mockMatrix.find(
        (m) =>
          m.district.toLowerCase() === params.district.toLowerCase() &&
          m.month === month
      ) || null;
  }

  const baseRating = baseRecord ? baseRecord.safety_rating : "Safe";

  // 2. Query DB for active real-time warnings (CFD Step 2)
  let activeWarnings: any[] = [];
  if (isLiveSupabaseConfigured()) {
    const { data } = await supabase.from("warnings").select("*").eq("status", "Active");
    if (data) activeWarnings = data;
  } else {
    activeWarnings = [
      {
        id: 1,
        title: "NH-7 Joshimath Sector Debris Flow",
        severity: "High",
        epicenter_lat: 30.55,
        epicenter_lng: 79.56,
        impact_radius_km: 15,
      },
    ];
  }

  // 3. Check proximity to epicenter if coordinates provided
  let nearbyAlert: any = null;
  if (params.latitude && params.longitude) {
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
