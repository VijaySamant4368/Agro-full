import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase, isLiveSupabaseConfigured, safeInsert } from "../config/supabase.js";
import { ENV } from "../config/env.js";
import { User, UserType } from "../types/index.js";

// Valid precomputed bcrypt hashes for demo accounts ("password123")
const DEMO_PASSWORD_HASH = bcrypt.hashSync("password123", 10);

// In-memory mock storage fallback for local development if Supabase keys not set yet
let mockUsers: User[] = [];

export const registerUser = async (data: {
  user_type: UserType;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number?: string;
}) => {
  const password_hash = await bcrypt.hash(data.password, 10);

  if (isLiveSupabaseConfigured()) {
    const { data: newUser, error } = await safeInsert<User>("users", {
      user_type: data.user_type,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email.toLowerCase(),
      password_hash,
      phone_number: data.phone_number,
      is_verified: data.user_type === "guest",
    });

    if (error) {
      if (error.code === "23505" && String(error.message).includes("users_email")) {
        throw new Error("Email already registered");
      }
      throw new Error(error.message || "Failed to register user in database");
    }

    if (newUser) {
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, user_type: newUser.user_type },
        ENV.JWT_SECRET,
        { expiresIn: ENV.JWT_EXPIRES_IN as any }
      );
      return { user: newUser, token };
    }
  }

  // Fallback in-memory
  const existing = mockUsers.find((u) => u.email === data.email.toLowerCase());
  if (existing) throw new Error("Email already registered");

  const newUser: User = {
    id: mockUsers.length + 1,
    user_type: data.user_type,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email.toLowerCase(),
    password_hash,
    phone_number: data.phone_number,
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockUsers.push(newUser);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, user_type: newUser.user_type },
    ENV.JWT_SECRET,
    { expiresIn: ENV.JWT_EXPIRES_IN as any }
  );
  return { user: newUser, token };
};

export const loginUser = async (data: { email: string; password: string }) => {
  let user: User | null = null;
  const lowerEmail = data.email.toLowerCase();

  if (isLiveSupabaseConfigured()) {
    try {
      const { data: dbUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", lowerEmail)
        .single();

      if (dbUser) {
        user = dbUser;
      }
    } catch (err) {
      console.warn("Supabase user query failed, falling back to memory store:", err);
    }
  }

  // Fallback to in-memory users if not in Supabase
  if (!user) {
    user = mockUsers.find((u) => u.email === lowerEmail) || null;
  }

  if (!user) throw new Error("Invalid email or password");

  const match = await bcrypt.compare(data.password, user.password_hash);
  if (!match) throw new Error("Invalid email or password");

  const token = jwt.sign(
    { id: user.id, email: user.email, user_type: user.user_type },
    ENV.JWT_SECRET,
    { expiresIn: ENV.JWT_EXPIRES_IN as any }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      user_type: user.user_type,
      phone_number: user.phone_number,
      is_verified: user.is_verified,
    },
    token,
  };
};
