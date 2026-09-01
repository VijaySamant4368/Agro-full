/** Single source of truth for fee maths shared by the booking card and checkout. */
export const SERVICE_FEE_PER_NIGHT = 150;
export const TAX_RATE = 0.12;

export interface Quote {
  nights: number;
  stay: number;
  serviceFee: number;
  taxes: number;
  total: number;
}

/** Priced per night, per person. */
export function quote(pricePerNight: number, nights: number, guests: number = 1): Quote {
  const stay = pricePerNight * nights * Math.max(1, guests);
  const serviceFee = SERVICE_FEE_PER_NIGHT * nights;
  const taxes = Math.round(stay * TAX_RATE);
  return { nights, stay, serviceFee, taxes, total: stay + serviceFee + taxes };
}
