import { createClient } from "@supabase/supabase-js";
import { ENV } from "./env.js";

// Check if credentials are real or placeholder and DB mode is active
export const isLiveSupabaseConfigured = () => {
  if (ENV.DB_MODE === "mock") return false;
  return (
    ENV.SUPABASE_URL.startsWith("https://") &&
    !ENV.SUPABASE_URL.includes("placeholder-project") &&
    !ENV.SUPABASE_ANON_KEY.includes("placeholder")
  );
};

// Create standard Supabase Client with service role if available for backend operations
export const supabase = createClient(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_SERVICE_ROLE_KEY && !ENV.SUPABASE_SERVICE_ROLE_KEY.includes("placeholder")
    ? ENV.SUPABASE_SERVICE_ROLE_KEY
    : ENV.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

/**
 * Robust Supabase insert helper that detects PostgreSQL sequence lags on seeded tables
 * and handles array vs single results safely without PGRST116 errors.
 */
export async function safeInsert<T = any>(
  table: string,
  payload: Record<string, any>
): Promise<{ data: T | null; error: any }> {
  try {
    let res = await supabase.from(table).insert(payload).select();

    // If duplicate key on primary key sequence collision
    if (res.error && res.error.code === "23505" && String(res.error.message).includes("_pkey")) {
      const { data: maxRows } = await supabase.from(table).select("id").order("id", { ascending: false }).limit(1);
      const nextId = (maxRows && maxRows.length > 0 && maxRows[0].id ? Number(maxRows[0].id) : 0) + 1;
      res = await supabase.from(table).insert({ ...payload, id: nextId }).select();
    }

    if (res.error) {
      return { data: null, error: res.error };
    }

    const item = Array.isArray(res.data) && res.data.length > 0 ? (res.data[0] as T) : null;
    return { data: item, error: null };
  } catch (err: any) {
    return { data: null, error: { message: err.message || "Database insert error" } };
  }
}
