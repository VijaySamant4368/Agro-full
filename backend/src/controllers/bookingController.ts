import { Response } from "express";
import { createBookingWithEscrow, listBookings } from "../services/bookingService.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export const createBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const guest_id = req.user?.id || 7; // Default guest Arjun if unauthenticated demo
  const { farm_id, stay_start_date, stay_end_date, total_guests, gateway_ref } = req.body;

  if (!farm_id || !stay_start_date || !stay_end_date) {
    res.status(400).json({ success: false, error: "farm_id, stay_start_date, and stay_end_date are required" });
    return;
  }

  const result = await createBookingWithEscrow({
    guest_id,
    farm_id,
    stay_start_date,
    stay_end_date,
    total_guests: total_guests || 1,
    gateway_ref,
  });

  res.status(201).json({ success: true, data: result });
};

export const getBookings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const role = req.user?.user_type;
  const bookings = await listBookings(userId, role);
  res.status(200).json({ success: true, count: bookings.length, data: bookings });
};
