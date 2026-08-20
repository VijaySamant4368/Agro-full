export type UserType = "guest" | "host" | "admin";

export interface User {
  id: number;
  user_type: UserType;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  phone_number?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Farm {
  id: number;
  slug: string;
  host_id: number;
  title: string;
  description: string;
  state: string;
  district: string;
  subdistrict?: string;
  category: string;
  latitude?: number;
  longitude?: number;
  uses_fallback_coords: boolean;
  nightly_rate: number;
  images: string[];
  amenities: string[];
  cancellation_policy?: string;
  emergency_contact?: string;
  regional_guidelines?: string;
  created_at: string;
  updated_at: string;
}

export type BookingStatus = "Pending" | "Confirmed" | "Active" | "Completed" | "Cancelled";
export type EscrowStatus = "Awaiting_Funds" | "Held_In_Escrow" | "Released_To_Host" | "Refunded_To_Guest";

export interface Booking {
  id: number;
  booking_code: string;
  guest_id: number;
  farm_id: number;
  stay_start_date: string;
  stay_end_date: string;
  total_guests: number;
  current_status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface LandslideReport {
  id: number;
  report_code: string;
  uploaded_by_user_id?: number;
  image_s3_url: string;
  latitude: number;
  longitude: number;
  location_name?: string;
  details?: string;
  report_time: string;
  cnn_confidence_score: number;
  processing_status: "Pending" | "Processed" | "Rejected";
  severity: "Low" | "Medium" | "High" | "Critical";
}

export type WarningSource = "Automated_CNN" | "Manual_Host";
export type WarningStatus = "Active" | "Expired" | "Revoked";

export interface Warning {
  id: number;
  warning_code: string;
  warning_source: WarningSource;
  report_id?: number;
  farm_id?: number;
  host_id?: number;
  title: string;
  description?: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  epicenter_lat: number;
  epicenter_lng: number;
  impact_radius_km: number;
  issued_at: string;
  expires_at: string;
  status: WarningStatus;
}

export interface Payment {
  id: number;
  payment_code: string;
  booking_id: number;
  stay_amount: number;
  platform_fee: number;
  total_charged: number;
  escrow_status: EscrowStatus;
  gateway_ref?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransactionLog {
  id: number;
  payment_id: number;
  transaction_type: "Charge" | "Payout" | "Refund";
  payment_gateway_ref: string;
  amount: number;
  note?: string;
  processed_at: string;
}

export interface BookingStatusLog {
  id: number;
  booking_id: number;
  previous_status: string;
  new_status: string;
  reason: string;
  changed_at: string;
}

export interface NotificationLog {
  id: number;
  user_id: number;
  warning_id?: number;
  related_booking_id?: number;
  notification_type: "Push" | "Email" | "SMS";
  title: string;
  message_content: string;
  is_read: boolean;
  severity?: "info" | "warning" | "emergency";
  dispatched_at: string;
}

export interface StaticGeoReference {
  id: number;
  state: string;
  district: string;
  subdistrict?: string;
  center_latitude: number;
  center_longitude: number;
}

export interface MonthlySafeMatrix {
  id: number;
  state: string;
  district: string;
  year: number;
  month: number;
  safety_rating: "Safe" | "Moderate" | "High Risk";
  rainfall_mm: number;
  soil_stability_index: number;
  historical_landslides_count: number;
  last_updated: string;
}
