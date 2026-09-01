import { supabase, safeInsert } from "../config/supabase.js";
import { Farm, StaticGeoReference } from "../types/index.js";
import { getBookedGuestsForRange } from "./bookingService.js";

const DEFAULT_MAX_GUESTS = 10;

// Hardcoded default center coordinates, used when a farm has no GPS and the
// static_geo_reference table has no match for its state/district/subdistrict.
const DEFAULT_GEO_REFS: StaticGeoReference[] = [
  { id: 1, state: "Uttarakhand", district: "Nainital", subdistrict: "Ramgarh", center_latitude: 29.426, center_longitude: 79.552 },
  { id: 2, state: "Uttarakhand", district: "Nainital", subdistrict: "Bhimtal", center_latitude: 29.351, center_longitude: 79.554 },
  { id: 3, state: "Uttarakhand", district: "Chamoli", subdistrict: "Joshimath", center_latitude: 30.556, center_longitude: 79.563 },
  { id: 4, state: "Kerala", district: "Wayanad", subdistrict: "Meppadi", center_latitude: 11.551, center_longitude: 76.131 },
  { id: 5, state: "Kerala", district: "Wayanad", subdistrict: "Kalpetta", center_latitude: 11.611, center_longitude: 76.082 },
  { id: 6, state: "Rajasthan", district: "Jaipur", subdistrict: "Amer", center_latitude: 26.985, center_longitude: 75.851 },
  { id: 7, state: "Arunachal Pradesh", district: "Lower Subansiri", subdistrict: "Ziro", center_latitude: 27.564, center_longitude: 93.834 },
];

export const getGeoFallback = async (state: string, district: string, subdistrict?: string) => {
  let query = supabase
    .from("static_geo_reference")
    .select("*")
    .ilike("state", state)
    .ilike("district", district);

  if (subdistrict) {
    query = query.ilike("subdistrict", subdistrict);
  }

  const { data } = await query.limit(1).maybeSingle();
  if (data) return data;

  const fallback = DEFAULT_GEO_REFS.find(
    (g) =>
      g.state.toLowerCase() === state.toLowerCase() &&
      g.district.toLowerCase() === district.toLowerCase() &&
      (!subdistrict || (g.subdistrict && g.subdistrict.toLowerCase() === subdistrict.toLowerCase()))
  );

  return fallback || { center_latitude: 28.6139, center_longitude: 77.209 };
};

export const listAllFarms = async (filters: {
  state?: string;
  district?: string;
  subdistrict?: string;
  category?: string;
  host_id?: number;
}) => {
  let query = supabase.from("farms").select("*, users(first_name, last_name, email, phone_number)");
  if (filters.host_id) query = query.eq("host_id", filters.host_id);
  if (filters.state) query = query.ilike("state", filters.state);
  if (filters.district) query = query.ilike("district", filters.district);
  if (filters.subdistrict) query = query.ilike("subdistrict", filters.subdistrict);
  if (filters.category) query = query.eq("category", filters.category);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
};

export const getFarmBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("farms")
    .select("*, users(id, first_name, last_name, email, phone_number)")
    .eq("slug", slug)
    .single();
  if (error || !data) throw new Error("Farmstay not found");
  return data;
};

/** How many seats are left on this farm for a given stay window. */
export const getFarmAvailability = async (
  farm_id: number,
  stay_start_date: string,
  stay_end_date: string
) => {
  const { data: farm, error } = await supabase.from("farms").select("max_guests").eq("id", farm_id).single();
  if (error || !farm) throw new Error("Farmstay not found");

  const maxGuests = farm.max_guests ?? DEFAULT_MAX_GUESTS;
  const bookedGuests = await getBookedGuestsForRange(farm_id, stay_start_date, stay_end_date);

  return { maxGuests, bookedGuests, availableSeats: Math.max(0, maxGuests - bookedGuests) };
};

/** Farmer-only: update the seat capacity on their own listing. */
export const updateFarmCapacity = async (hostId: number, slug: string, max_guests: number) => {
  if (!Number.isFinite(max_guests) || max_guests < 1) {
    const err: any = new Error("max_guests must be a positive number.");
    err.status = 400;
    throw err;
  }

  const { data: farm, error: fErr } = await supabase.from("farms").select("id, host_id").eq("slug", slug).single();
  if (fErr || !farm) throw new Error("Farmstay not found");

  if (farm.host_id !== hostId) {
    const err: any = new Error("You can only edit your own farmstay listings.");
    err.status = 403;
    throw err;
  }

  const { data: updated, error } = await supabase
    .from("farms")
    .update({ max_guests: Math.floor(max_guests), updated_at: new Date().toISOString() })
    .eq("id", farm.id)
    .select("*, users(first_name, last_name, email, phone_number)")
    .single();

  if (error) throw new Error(error.message);
  return updated;
};

export const createFarmListing = async (
  hostId: number,
  data: {
    title: string;
    description: string;
    state: string;
    district: string;
    subdistrict?: string;
    category?: string;
    nightly_rate: number;
    max_guests?: number;
    latitude?: number;
    longitude?: number;
    images?: string[];
    amenities?: string[];
    cancellation_policy?: string;
    emergency_contact?: string;
    regional_guidelines?: string;
  }
) => {
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.floor(Math.random() * 900 + 100);

  let lat = data.latitude;
  let lng = data.longitude;
  let usesFallback = false;

  // If host didn't provide GPS coordinates, fetch center coordinates from Static Geo Reference (CFD Host flow)
  if (!lat || !lng) {
    const geo = await getGeoFallback(data.state, data.district, data.subdistrict);
    lat = geo.center_latitude;
    lng = geo.center_longitude;
    usesFallback = true;
  }

  const farmPayload = {
    slug,
    host_id: hostId,
    title: data.title,
    description: data.description,
    state: data.state,
    district: data.district,
    subdistrict: data.subdistrict,
    category: data.category || "Organic Farm",
    latitude: lat,
    longitude: lng,
    uses_fallback_coords: usesFallback,
    nightly_rate: data.nightly_rate,
    max_guests: data.max_guests && data.max_guests > 0 ? Math.floor(data.max_guests) : DEFAULT_MAX_GUESTS,
    images: data.images && data.images.length > 0 ? data.images : ["https://picsum.photos/seed/" + slug + "/900/600"],
    amenities: data.amenities || ["Organic Farm", "Safety Monitoring", "Escrow Protection"],
    cancellation_policy: data.cancellation_policy || "Full refund 48h prior. 100% refund on disaster alerts.",
    emergency_contact: data.emergency_contact,
    regional_guidelines: data.regional_guidelines,
  };

  const { data: newFarm, error } = await safeInsert<Farm>("farms", farmPayload);
  if (error) throw new Error(error.message);
  return newFarm;
};
