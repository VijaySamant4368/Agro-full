import { supabase, isLiveSupabaseConfigured, safeInsert } from "../config/supabase.js";
import { Farm, StaticGeoReference } from "../types/index.js";

const mockGeoRefs: StaticGeoReference[] = [
  { id: 1, state: "Uttarakhand", district: "Nainital", subdistrict: "Ramgarh", center_latitude: 29.426, center_longitude: 79.552 },
  { id: 2, state: "Uttarakhand", district: "Nainital", subdistrict: "Bhimtal", center_latitude: 29.351, center_longitude: 79.554 },
  { id: 3, state: "Uttarakhand", district: "Chamoli", subdistrict: "Joshimath", center_latitude: 30.556, center_longitude: 79.563 },
  { id: 4, state: "Kerala", district: "Wayanad", subdistrict: "Meppadi", center_latitude: 11.551, center_longitude: 76.131 },
  { id: 5, state: "Kerala", district: "Wayanad", subdistrict: "Kalpetta", center_latitude: 11.611, center_longitude: 76.082 },
  { id: 6, state: "Rajasthan", district: "Jaipur", subdistrict: "Amer", center_latitude: 26.985, center_longitude: 75.851 },
  { id: 7, state: "Arunachal Pradesh", district: "Lower Subansiri", subdistrict: "Ziro", center_latitude: 27.564, center_longitude: 93.834 },
];

let mockFarms: Farm[] = [];

export const getGeoFallback = async (state: string, district: string, subdistrict?: string) => {
  if (isLiveSupabaseConfigured()) {
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
  }

  const fallback = mockGeoRefs.find(
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
  if (isLiveSupabaseConfigured()) {
    let query = supabase.from("farms").select("*, users(first_name, last_name, email, phone_number)");
    if (filters.host_id) query = query.eq("host_id", filters.host_id);
    if (filters.state) query = query.ilike("state", filters.state);
    if (filters.district) query = query.ilike("district", filters.district);
    if (filters.subdistrict) query = query.ilike("subdistrict", filters.subdistrict);
    if (filters.category) query = query.eq("category", filters.category);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  return mockFarms.filter((f) => {
    if (filters.host_id && f.host_id !== filters.host_id) return false;
    if (filters.state && f.state.toLowerCase() !== filters.state.toLowerCase()) return false;
    if (filters.district && f.district.toLowerCase() !== filters.district.toLowerCase()) return false;
    if (filters.subdistrict && f.subdistrict?.toLowerCase() !== filters.subdistrict.toLowerCase()) return false;
    if (filters.category && f.category !== filters.category) return false;
    return true;
  });
};

export const getFarmBySlug = async (slug: string) => {
  if (isLiveSupabaseConfigured()) {
    const { data, error } = await supabase
      .from("farms")
      .select("*, users(id, first_name, last_name, email, phone_number)")
      .eq("slug", slug)
      .single();
    if (error || !data) throw new Error("Farmstay not found");
    return data;
  }

  const farm = mockFarms.find((f) => f.slug === slug);
  if (!farm) throw new Error("Farmstay not found");
  return farm;
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
    images: data.images && data.images.length > 0 ? data.images : ["https://picsum.photos/seed/" + slug + "/900/600"],
    amenities: data.amenities || ["Organic Farm", "Safety Monitoring", "Escrow Protection"],
    cancellation_policy: data.cancellation_policy || "Full refund 48h prior. 100% refund on disaster alerts.",
    emergency_contact: data.emergency_contact,
    regional_guidelines: data.regional_guidelines,
  };

  if (isLiveSupabaseConfigured()) {
    const { data: newFarm, error } = await safeInsert<Farm>("farms", farmPayload);
    if (error) throw new Error(error.message);
    return newFarm;
  }

  const newFarm: Farm = {
    id: mockFarms.length + 1,
    ...farmPayload,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockFarms.push(newFarm);
  return newFarm;
};
