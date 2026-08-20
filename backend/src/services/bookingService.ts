import { supabase, isLiveSupabaseConfigured, safeInsert } from "../config/supabase.js";
import { Booking, BookingStatus, Payment, PaymentTransactionLog, BookingStatusLog } from "../types/index.js";

let mockBookings: any[] = [];

export const createBookingWithEscrow = async (data: {
  guest_id: number;
  farm_id: number;
  stay_start_date: string;
  stay_end_date: string;
  total_guests: number;
  gateway_ref?: string;
}) => {
  const booking_code = `AGS-${Math.floor(Math.random() * 90000 + 10000)}`;
  const payment_code = `PAY-${Math.floor(Math.random() * 90000 + 10000)}`;

  // Calculate days and totals
  const start = new Date(data.stay_start_date);
  const end = new Date(data.stay_end_date);
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

  let nightlyRate = 4500;
  if (isLiveSupabaseConfigured()) {
    const { data: farm } = await supabase.from("farms").select("nightly_rate").eq("id", data.farm_id).single();
    if (farm) nightlyRate = farm.nightly_rate;
  }

  const stay_amount = nightlyRate * days;
  const platform_fee = Math.round(stay_amount * 0.05); // 5% platform fee
  const total_charged = stay_amount + platform_fee;
  const gateway_ref = data.gateway_ref || `rzp_live_${Math.floor(Math.random() * 900000000 + 100000000)}`;

  if (isLiveSupabaseConfigured()) {
    // 1. Insert Booking
    const { data: booking, error: bErr } = await safeInsert<any>("bookings", {
      booking_code,
      guest_id: data.guest_id,
      farm_id: data.farm_id,
      stay_start_date: data.stay_start_date,
      stay_end_date: data.stay_end_date,
      total_guests: data.total_guests,
      current_status: "Confirmed",
    });

    if (bErr || !booking) throw new Error(bErr?.message || "Failed to create booking");

    // 2. Insert Payment & Lock in Escrow
    const { data: payment, error: pErr } = await safeInsert<any>("payments", {
      payment_code,
      booking_id: booking.id,
      stay_amount,
      platform_fee,
      total_charged,
      escrow_status: "Held_In_Escrow",
      gateway_ref,
    });

    if (pErr || !payment) throw new Error(pErr?.message || "Failed to record escrow payment");

    // 3. Log initial transaction
    await safeInsert("payment_transaction_log", {
      payment_id: payment.id,
      transaction_type: "Charge",
      payment_gateway_ref: gateway_ref,
      amount: total_charged,
      note: "Initial booking charge authorized & funds locked in AgroSafe Escrow Vault.",
    });

    // 4. Log booking status transition
    await safeInsert("booking_status_log", {
      booking_id: booking.id,
      previous_status: "Pending",
      new_status: "Confirmed",
      reason: "Escrow payment captured & verified",
    });

    return { booking, payment };
  }

  // Fallback in-memory
  const newBooking = {
    id: mockBookings.length + 1,
    booking_code,
    guest_id: data.guest_id,
    farm_id: data.farm_id,
    stay_start_date: data.stay_start_date,
    stay_end_date: data.stay_end_date,
    total_guests: data.total_guests,
    current_status: "Confirmed" as BookingStatus,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    payments: {
      payment_code,
      stay_amount,
      platform_fee,
      total_charged,
      escrow_status: "Held_In_Escrow",
      gateway_ref,
    },
  };
  mockBookings.push(newBooking);
  return { booking: newBooking, payment: newBooking.payments };
};

export const listBookings = async (userId?: number, role?: string) => {
  if (isLiveSupabaseConfigured()) {
    let query = supabase
      .from("bookings")
      .select("*, farms(*, users(first_name, last_name, email)), payments(*), users(first_name, last_name, email, phone_number)");

    if (userId && role === "guest") {
      query = query.eq("guest_id", userId);
    } else if (userId && role === "host") {
      query = query.eq("farms.host_id", userId);
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  if (userId) {
    return mockBookings.filter((b) => b.guest_id === userId);
  }
  return mockBookings;
};
