import bcrypt from "bcryptjs";
import { supabase, isLiveSupabaseConfigured, safeInsert } from "../config/supabase.js";
import { User } from "../types/index.js";

// CLI-only. Not wired to any Express route — run directly on the server host.
// Usage: npm run create-admin -- <email> <password> <firstName> <lastName> [phone]
async function createAdmin() {
  const [, , email, password, firstName, lastName, phone] = process.argv;

  if (!email || !password || !firstName || !lastName) {
    console.error("Usage: npm run create-admin -- <email> <password> <firstName> <lastName> [phone]");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  if (!isLiveSupabaseConfigured()) {
    console.error("Live Supabase credentials not found. Set them in .env before creating an admin.");
    process.exit(1);
  }

  const lowerEmail = email.toLowerCase().trim();

  const { data: existing } = await supabase.from("users").select("id").eq("email", lowerEmail).single();
  if (existing) {
    console.error(`Email already registered: ${lowerEmail}`);
    process.exit(1);
  }

  const password_hash = await bcrypt.hash(password, 10);

  const { data: created, error } = await safeInsert<User>("users", {
    user_type: "admin",
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    email: lowerEmail,
    password_hash,
    phone_number: phone?.trim() || null,
    is_verified: true,
  });

  if (error || !created) {
    console.error("Failed to create admin:", error?.message || "Unknown error");
    process.exit(1);
  }

  console.log("Admin account created:");
  console.log(`   ID: ${created!.id}`);
  console.log(`   Email: ${created!.email}`);
  console.log(`   Name: ${created!.first_name} ${created!.last_name}`);
}

createAdmin().catch((err) => {
  console.error("Unexpected error:", err.message || err);
  process.exit(1);
});
