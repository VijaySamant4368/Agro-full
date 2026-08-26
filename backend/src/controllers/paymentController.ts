import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { computeBookingQuote, createBookingWithEscrow } from "../services/bookingService.js";
import { createRazorpayOrder, verifyRazorpaySignature } from "../services/paymentService.js";
import { ENV } from "../config/env.js";

export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { farm_id, stay_start_date, stay_end_date } = req.body;

  if (!farm_id || !stay_start_date || !stay_end_date) {
    res.status(400).json({ success: false, error: "farm_id, stay_start_date, and stay_end_date are required" });
    return;
  }

  const quote = await computeBookingQuote(farm_id, stay_start_date, stay_end_date);

  const order = await createRazorpayOrder({
    amountInRupees: quote.total_charged,
    receipt: `AGS-${Date.now()}`,
    notes: {
      farm_id: String(farm_id),
      guest_id: String(req.user?.id || ""),
      stay_start_date,
      stay_end_date,
    },
  });

  res.status(200).json({
    success: true,
    data: {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: ENV.RAZORPAY_KEY_ID,
      quote,
    },
  });
};

export const verifyAndCreateBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const guest_id = req.user?.id;
  if (!guest_id) {
    res.status(401).json({ success: false, error: "Access token missing or invalid" });
    return;
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    farm_id,
    stay_start_date,
    stay_end_date,
    total_guests,
    cab_pickup_location,
    cab_pincode,
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400).json({ success: false, error: "razorpay_order_id, razorpay_payment_id, and razorpay_signature are required" });
    return;
  }

  if (!farm_id || !stay_start_date || !stay_end_date) {
    res.status(400).json({ success: false, error: "farm_id, stay_start_date, and stay_end_date are required" });
    return;
  }

  const isValid = verifyRazorpaySignature({
    order_id: razorpay_order_id,
    payment_id: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!isValid) {
    res.status(400).json({ success: false, error: "Payment verification failed. Signature mismatch." });
    return;
  }

  const result = await createBookingWithEscrow({
    guest_id,
    farm_id,
    stay_start_date,
    stay_end_date,
    total_guests: total_guests || 1,
    gateway_ref: razorpay_payment_id,
    razorpay_order_id,
    cab_pickup_location,
    cab_pincode,
  });

  res.status(201).json({ success: true, data: result });
};
