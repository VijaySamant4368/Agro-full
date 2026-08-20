import { supabase, isLiveSupabaseConfigured, safeInsert } from "../config/supabase.js";
import { Payment, PaymentTransactionLog, BookingStatusLog } from "../types/index.js";

let mockEscrows: any[] = [];

export const getEscrowLedger = async () => {
  if (isLiveSupabaseConfigured()) {
    const { data, error } = await supabase
      .from("payments")
      .select("*, bookings(*, farms(title, slug), users(first_name, last_name, email)), payment_transaction_log(*)")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  return mockEscrows;
};

export const releaseEscrowToHost = async (paymentId: number, note?: string) => {
  const payoutRef = `payout_bank_${Math.floor(Math.random() * 900000 + 100000)}`;

  if (isLiveSupabaseConfigured()) {
    // 1. Update Payment status
    const { data: payment, error: pErr } = await supabase
      .from("payments")
      .update({ escrow_status: "Released_To_Host" })
      .eq("id", paymentId)
      .select("*, bookings(id)")
      .single();

    if (pErr) throw new Error(pErr.message);

    // 2. Log transaction
    await safeInsert("payment_transaction_log", {
      payment_id: paymentId,
      transaction_type: "Payout",
      payment_gateway_ref: payoutRef,
      amount: payment.stay_amount,
      note: note || "Stay completed safely without incidents. Escrow payout disbursed to Host account.",
    });

    // 3. Update Booking status to Completed
    if (payment.bookings?.id) {
      await supabase
        .from("bookings")
        .update({ current_status: "Completed" })
        .eq("id", payment.bookings.id);

      await safeInsert("booking_status_log", {
        booking_id: payment.bookings.id,
        previous_status: "Active",
        new_status: "Completed",
        reason: "Guest checkout confirmed. Payout triggered via AgroSafe Lifecycle Pipeline.",
      });
    }

    return payment;
  }

  const escrow = mockEscrows.find((e) => e.id === paymentId);
  if (!escrow) throw new Error("Escrow record not found");

  escrow.escrowStatus = "Released_To_Host";
  escrow.transactions.push({
    id: escrow.transactions.length + 1,
    transaction_type: "Payout",
    amount: escrow.stay_amount,
    payment_gateway_ref: payoutRef,
    note: note || "Stay completed safely without incidents. Escrow payout disbursed to Host account.",
    processed_at: new Date().toISOString(),
  });

  return escrow;
};

export const refundEscrowToGuest = async (paymentId: number, reason?: string) => {
  const refundRef = `rfnd_auto_${Math.floor(Math.random() * 900000 + 100000)}`;

  if (isLiveSupabaseConfigured()) {
    // 1. Update Payment status
    const { data: payment, error: pErr } = await supabase
      .from("payments")
      .update({ escrow_status: "Refunded_To_Guest" })
      .eq("id", paymentId)
      .select("*, bookings(id)")
      .single();

    if (pErr) throw new Error(pErr.message);

    // 2. Log transaction (100% full refund)
    await safeInsert("payment_transaction_log", {
      payment_id: paymentId,
      transaction_type: "Refund",
      payment_gateway_ref: refundRef,
      amount: payment.total_charged,
      note: reason || "100% Emergency Disaster Safeguard Refund processed back to guest card.",
    });

    // 3. Update Booking status to Cancelled
    if (payment.bookings?.id) {
      await supabase
        .from("bookings")
        .update({ current_status: "Cancelled" })
        .eq("id", payment.bookings.id);

      await safeInsert("booking_status_log", {
        booking_id: payment.bookings.id,
        previous_status: "Confirmed",
        new_status: "Cancelled",
        reason: reason || "Active Landslide Warning in district. Automated 100% Escrow Refund Guarantee triggered.",
      });
    }

    return payment;
  }

  const escrow = mockEscrows.find((e) => e.id === paymentId);
  if (!escrow) throw new Error("Escrow record not found");

  escrow.escrowStatus = "Refunded_To_Guest";
  escrow.transactions.push({
    id: escrow.transactions.length + 1,
    transaction_type: "Refund",
    amount: escrow.total_charged,
    payment_gateway_ref: refundRef,
    note: reason || "100% Emergency Disaster Safeguard Refund processed back to guest card.",
    processed_at: new Date().toISOString(),
  });

  return escrow;
};
