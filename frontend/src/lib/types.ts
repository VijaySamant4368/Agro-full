export type SafetyStatus = "safe" | "moderate" | "high";

export interface Farm {
  id?: number;
  slug: string;
  name: string;
  location: string;
  state: string;
  district: string;
  subDistrict: string;
  category: string;
  pricePerNight: number;
  safety: SafetyStatus;
  host: string;
  hostId?: string | number;
  summary: string;
  images: string[];
  amenities: string[];
  cancellationPolicy: string;
  emergencyContact: string;
  regionalGuidelines: string;
  latitude?: number;
  longitude?: number;
  usesFallbackCoords?: boolean;
}

export interface Booking {
  id: string;
  farmSlug: string;
  farmName: string;
  location: string;
  image: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: "upcoming" | "completed" | "cancelled";
  escrowStatus?: "Held_In_Escrow" | "Released_To_Host" | "Refunded_To_Guest";
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}

export interface LandslideReport {
  id: string;
  location: string;
  lat: number;
  lng: number;
  severity: "Low" | "Medium" | "High" | "Critical";
  reportedAt: string;
  status: string;
  cnnConfidenceScore?: number;
  uploadedBy?: string;
  imageS3Url?: string;
}

export type WarningSource = "Automated_CNN" | "Manual_Host";
export type WarningStatus = "Active" | "Expired" | "Revoked";

export interface Warning {
  id: string;
  warningSource: WarningSource;
  reportId?: string;
  hostId?: string;
  farmSlug?: string;
  farmName?: string;
  epicenterLat: number;
  epicenterLng: number;
  impactRadiusKm: number;
  issuedAt: string;
  expiresAt: string;
  status: WarningStatus;
  severity: "Low" | "Medium" | "High" | "Critical";
  title: string;
  description: string;
  affectedFarmsCount: number;
  affectedBookingsCount: number;
}

export interface PaymentTransactionLog {
  id: string;
  paymentId: string;
  transactionType: "Charge" | "Payout" | "Refund";
  amount: number;
  gatewayRef: string;
  processedAt: string;
  note: string;
}

export interface BookingStatusLog {
  id: string;
  previousStatus: string;
  newStatus: string;
  reason: string;
  changedAt: string;
}

export interface PaymentEscrow {
  paymentId: string;
  bookingId: string;
  farmName: string;
  farmSlug: string;
  guestName: string;
  stayAmount: number;
  platformFee: number;
  totalCharged: number;
  escrowStatus: "Awaiting_Funds" | "Held_In_Escrow" | "Released_To_Host" | "Refunded_To_Guest";
  gatewayRef: string;
  stayStartDate: string;
  stayEndDate: string;
  transactions: PaymentTransactionLog[];
  statusHistory: BookingStatusLog[];
}

export interface MonthlySafetyRecord {
  month: number;
  monthName: string;
  year: number;
  district: string;
  state: string;
  safetyRating: "Safe" | "Moderate" | "High Risk";
  rainfallMm: number;
  soilStabilityIndex: number; // 0 - 100
  historicalLandslidesCount: number;
  activeOverrideAlert?: boolean;
}

export interface NotificationLog {
  id: string;
  userId: string;
  userRole: "guest" | "host";
  warningId?: string;
  relatedBookingId?: string;
  notificationType: "Push" | "Email" | "SMS";
  title: string;
  messageContent: string;
  isRead: boolean;
  dispatchedAt: string;
  severity?: "info" | "warning" | "emergency";
}

export interface StaticGeoReference {
  state: string;
  district: string;
  subDistrict: string;
  centerLatitude: number;
  centerLongitude: number;
}
