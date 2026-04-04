import { Spot } from "@/hooks/useSpots";

export interface PricingBreakdown {
  basePrice: number;
  demandFactor: number;
  timeFactor: number;
  locationFactor: number;
  scarcityFactor: number;
  evExtra: number;
  discount: number;
  pricePerHour: number;
  totalPrice: number;
}

export function calculateDynamicPrice(
  spot: Spot,
  useCharging: boolean,
  duration: number,
  startTimeStr: string, // "HH:MM"
  allSpots: Spot[]
): PricingBreakdown {
  const basePrice = spot.basePrice || 30;

  // 1. Time Factor (Peak Hours: 8-11 AM, 5-9 PM)
  const hour = parseInt(startTimeStr.split(":")[0]);
  const isPeak = (hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 21);
  const timeFactor = isPeak ? 1.2 : 1.0;

  // 2. Location Factor
  const locationFactor = spot.locationType === 'hotspot' ? 1.3 : 1.0;

  // 3. Demand/Scarcity Factor (Based on available spots nearby)
  const nearbySpots = allSpots.filter(s => 
    Math.abs(s.lat - spot.lat) < 0.05 && Math.abs(s.lng - spot.lng) < 0.05
  );
  const availableNearby = nearbySpots.filter(s => s.isAvailable).length;
  const scarcityFactor = availableNearby <= 3 ? 1.2 : 1.0;

  // 4. Simulated Demand Factor
  // If this specific spot is high rated, we assume high demand
  const demandFactor = spot.rating >= 4.8 ? 1.2 : 1.0;

  // 5. EV Charging Extra (Fixed ₹20 if used)
  const evExtra = useCharging ? 20 : 0;

  // 6. Duration Discount
  // If > 2 hours, apply 15% discount on the subtotal
  const rawPricePerHour = basePrice * timeFactor * locationFactor * scarcityFactor * demandFactor;
  const subtotal = (rawPricePerHour * duration) + evExtra;
  const discount = duration > 2 ? (subtotal * 0.15) : 0;

  const totalPrice = Math.max(20, Math.ceil(subtotal - discount)); // Min threshold ₹20
  const finalPricePerHour = Math.ceil(totalPrice / duration);

  return {
    basePrice,
    demandFactor,
    timeFactor,
    locationFactor,
    scarcityFactor,
    evExtra,
    discount: Math.floor(discount),
    pricePerHour: finalPricePerHour,
    totalPrice
  };
}
