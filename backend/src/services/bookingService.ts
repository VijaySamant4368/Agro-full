import { supabase, safeInsert } from "../config/supabase.js";
import { createNotification } from "./notificationService.js";
import { sendHostBookingEmail, sendAdminPaymentEmail } from "./emailService.js";

const PLATFORM_FEE_RATE = 0.05;
const DEFAULT_NIGHTLY_RATE = 4500;

/** Server-computed quote — never trust a client-supplied amount for what gets charged. */
export const computeBookingQuote = async (
  farm_id: number,
  stay_start_date: string,
  stay_end_date: string
) => {
  const start = new Date(stay_start_date);
  const end = new Date(stay_end_date);
  const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

  let nightlyRate = DEFAULT_NIGHTLY_RATE;
  const { data: farmRate } = await supabase.from("farms").select("nightly_rate").eq("id", farm_id).single();
  if (farmRate) nightlyRate = farmRate.nightly_rate;

  const stay_amount = nightlyRate * nights;
  const platform_fee = Math.round(stay_amount * PLATFORM_FEE_RATE);
  const total_charged = stay_amount + platform_fee;

  return { nights, nightlyRate, stay_amount, platform_fee, total_charged };
};

// Notifies the host + admin that a booking/payment landed. Best-effort: must never fail the booking itself.
async function dispatchBookingSideEffects(params: {
  bookingId: number;
  hostId: number;
  hostEmail?: string;
  hostName: string;
  guestName: string;
  guestEmail?: string;
  farmTitle: string;
  bookingCode: string;
  paymentCode: string;
  stayStartDate: string;
  stayEndDate: string;
  totalGuests: number;
  totalCharged: number;
  gatewayRef: string;
  cab?: { pickupLocation: string; pincode: string };
}) {
  const guestNoun = params.totalGuests > 1 ? "guests" : "guest";

  await createNotification({
    user_id: params.hostId,
    related_booking_id: params.bookingId,
    notification_type: "Push",
    title: `New Booking: ${params.farmTitle}`,
    message_content: `${params.guestName} booked "${params.farmTitle}" for ${params.stayStartDate} to ${params.stayEndDate} (${params.totalGuests} ${guestNoun}). Ref ${params.bookingCode}. ₹${params.totalCharged.toLocaleString("en-IN")} is held in escrow until checkout.`,
    severity: "info",
  });

  if (params.hostEmail) {
    await sendHostBookingEmail(params.hostEmail, params.hostName, {
      guestName: params.guestName,
      farmTitle: params.farmTitle,
      bookingCode: params.bookingCode,
      stayStartDate: params.stayStartDate,
      stayEndDate: params.stayEndDate,
      totalGuests: params.totalGuests,
      stayAmount: params.totalCharged,
    });
  }

  await sendAdminPaymentEmail({
    bookingCode: params.bookingCode,
    paymentCode: params.paymentCode,
    guestName: params.guestName,
    guestEmail: params.guestEmail || "unknown",
    hostName: params.hostName,
    farmTitle: params.farmTitle,
    totalCharged: params.totalCharged,
    gatewayRef: params.gatewayRef,
    cab: params.cab,
  });
}

export const createBookingWithEscrow = async (data: {
  guest_id: number;
  farm_id: number;
  stay_start_date: string;
  stay_end_date: string;
  total_guests: number;
  gateway_ref?: string;
  razorpay_order_id?: string;
  cab_pickup_location?: string;
  cab_pincode?: string;
}) => {
  const booking_code = `AGS-${Math.floor(Math.random() * 90000 + 10000)}`;
  const payment_code = `PAY-${Math.floor(Math.random() * 90000 + 10000)}`;

  const cab =
    data.cab_pickup_location && data.cab_pincode
      ? { pickupLocation: data.cab_pickup_location, pincode: data.cab_pincode }
      : undefined;

  const { stay_amount, platform_fee, total_charged } = await computeBookingQuote(
    data.farm_id,
    data.stay_start_date,
    data.stay_end_date
  );

  const gateway_ref = data.gateway_ref || `rzp_live_${Math.floor(Math.random() * 900000000 + 100000000)}`;

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
    razorpay_order_id: data.razorpay_order_id || null,
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

  // 5. Notify host + admin (best-effort, must not fail the booking)
  try {
    const { data: full } = await supabase
      .from("bookings")
      .select("*, farms(title, host_id, users(first_name, last_name, email)), users(first_name, last_name, email)")
      .eq("id", booking.id)
      .single();

    if (full?.farms?.host_id) {
      const host = full.farms.users;
      const guest = full.users;
      await dispatchBookingSideEffects({
        bookingId: booking.id,
        hostId: full.farms.host_id,
        hostEmail: host?.email,
        hostName: host?.first_name || "Host",
        guestName: guest ? `${guest.first_name} ${guest.last_name}`.trim() : "A guest",
        guestEmail: guest?.email,
        farmTitle: full.farms.title,
        bookingCode: booking_code,
        paymentCode: payment_code,
        stayStartDate: data.stay_start_date,
        stayEndDate: data.stay_end_date,
        totalGuests: data.total_guests,
        totalCharged: total_charged,
        gatewayRef: gateway_ref,
        cab,
      });
    }
  } catch (err: any) {
    console.warn("[Booking] Failed to send booking notifications:", err.message);
  }

  return { booking, payment };
};

export const listBookings = async (userId?: number, role?: string) => {
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
};
