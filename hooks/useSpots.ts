"use client";

import { useState, useEffect } from "react";

export interface Spot {
  id: string;
  title: string;
  lat: number;
  lng: number;
  distanceKm: number;
  hasEvCharging: boolean;
  chargerType?: string | null;
  rating: number;
  pricePerHour?: number;
  isAvailable: boolean;
  isDisabledByHost?: boolean;
  currentBookingId?: string;
  basePrice: number;
  locationType: 'normal' | 'hotspot';
}

const DEFAULT_SPOTS: Spot[] = [
  { id: "1", title: "Mysuru Palace Gate 1", lat: 12.3052, lng: 76.6552, distanceKm: 0.5, hasEvCharging: true, chargerType: "DC Fast 60kW", rating: 4.9, isAvailable: true, basePrice: 50, locationType: 'hotspot', isDisabledByHost: false },
  { id: "2", title: "Devaraja Market South", lat: 12.3117, lng: 76.6508, distanceKm: 1.2, hasEvCharging: false, rating: 4.5, isAvailable: true, basePrice: 40, locationType: 'hotspot', isDisabledByHost: false },
  { id: "3", title: "Chamundi Hill Entrance", lat: 12.2753, lng: 76.6713, distanceKm: 5.0, hasEvCharging: true, chargerType: "Level 2 AC", rating: 4.7, isAvailable: true, basePrice: 30, locationType: 'normal', isDisabledByHost: false },
  { id: "4", title: "Agrahara Circle Parking", lat: 12.3000, lng: 76.6500, distanceKm: 1.0, hasEvCharging: true, chargerType: "Level 2 AC", rating: 4.3, isAvailable: true, basePrice: 35, locationType: 'normal', isDisabledByHost: false },
  { id: "5", title: "Siddhartha Layout G1", lat: 12.3000, lng: 76.6750, distanceKm: 2.8, hasEvCharging: false, rating: 4.6, isAvailable: true, basePrice: 20, locationType: 'normal', isDisabledByHost: false },
  { id: "6", title: "Gokulam 3rd Stage", lat: 12.3300, lng: 76.6350, distanceKm: 3.5, hasEvCharging: true, chargerType: "DC Fast 30kW", rating: 4.8, isAvailable: true, basePrice: 45, locationType: 'normal', isDisabledByHost: false },
  { id: "7", title: "Vontikoppal Temple Sq", lat: 12.3250, lng: 76.6400, distanceKm: 2.5, hasEvCharging: false, rating: 4.2, isAvailable: true, basePrice: 25, locationType: 'normal', isDisabledByHost: false },
  { id: "8", title: "Jayanagar 4th Main", lat: 12.2850, lng: 76.6400, distanceKm: 3.2, hasEvCharging: true, chargerType: "Level 2 AC", rating: 4.5, isAvailable: true, basePrice: 30, locationType: 'normal', isDisabledByHost: false },
  { id: "9", title: "Vijayanagar Water Tank", lat: 12.3350, lng: 76.6150, distanceKm: 5.5, hasEvCharging: true, chargerType: "DC Fast 120kW", rating: 4.9, isAvailable: true, basePrice: 55, locationType: 'normal', isDisabledByHost: false },
  { id: "10", title: "Kuvempunagar Complex", lat: 12.2900, lng: 76.6250, distanceKm: 4.0, hasEvCharging: false, rating: 4.4, isAvailable: true, basePrice: 20, locationType: 'normal', isDisabledByHost: false },
  { id: "11", title: "Yadavagiri Station Rd", lat: 12.3200, lng: 76.6300, distanceKm: 2.0, hasEvCharging: true, chargerType: "Level 2 AC", rating: 4.7, isAvailable: true, basePrice: 35, locationType: 'normal', isDisabledByHost: false },
  { id: "12", title: "Lalitha Mahal Grounds", lat: 12.2950, lng: 76.6850, distanceKm: 4.5, hasEvCharging: true, chargerType: "DC Fast 50kW", rating: 4.8, isAvailable: true, basePrice: 40, locationType: 'hotspot', isDisabledByHost: false },
  { id: "13", title: "Mysuru Junction West", lat: 12.3160, lng: 76.6430, distanceKm: 0.8, hasEvCharging: true, chargerType: "Level 2 AC", rating: 4.6, isAvailable: true, basePrice: 45, locationType: 'hotspot', isDisabledByHost: false },
  { id: "14", title: "Bannimantap Parade", lat: 12.3380, lng: 76.6580, distanceKm: 3.8, hasEvCharging: false, rating: 4.3, isAvailable: true, basePrice: 30, locationType: 'normal', isDisabledByHost: false },
  { id: "15", title: "Saraswathipuram Park", lat: 12.2950, lng: 76.6350, distanceKm: 2.2, hasEvCharging: true, chargerType: "Level 2 AC", rating: 4.7, isAvailable: true, basePrice: 35, locationType: 'normal', isDisabledByHost: false },
  { id: "16", title: "Bamboo Bazar Market", lat: 12.3220, lng: 76.6580, distanceKm: 1.5, hasEvCharging: false, rating: 4.1, isAvailable: true, basePrice: 30, locationType: 'normal', isDisabledByHost: false },
  { id: "17", title: "Hebbal Industrial Area", lat: 12.3650, lng: 76.6120, distanceKm: 7.2, hasEvCharging: true, chargerType: "DC Fast 100kW", rating: 4.9, isAvailable: true, basePrice: 60, locationType: 'normal', isDisabledByHost: false }
];

export function useSpots() {
  const [spots, setSpots] = useState<Spot[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('parkvolt_spots');
    if (saved) {
      setSpots(JSON.parse(saved));
    } else {
      setSpots(DEFAULT_SPOTS);
      localStorage.setItem('parkvolt_spots', JSON.stringify(DEFAULT_SPOTS));
    }
  }, []);

  const addSpot = (newSpot: Omit<Spot, 'id' | 'distanceKm' | 'rating' | 'isAvailable' | 'basePrice' | 'locationType' | 'isDisabledByHost'>) => {
    const spot: Spot = {
      ...newSpot,
      id: Math.random().toString(36).substring(7),
      distanceKm: 2.5,
      rating: 5.0,
      isAvailable: true,
      isDisabledByHost: false,
      currentBookingId: undefined,
      basePrice: (newSpot as any).pricePerHour || 30,
      locationType: 'normal'
    };

    const updated = [spot, ...spots];
    setSpots(updated);
    localStorage.setItem('parkvolt_spots', JSON.stringify(updated));
    return spot;
  };

  const updateSpot = (updatedSpot: Spot) => {
    const updated = spots.map(s => s.id === updatedSpot.id ? updatedSpot : s);
    setSpots(updated);
    localStorage.setItem('parkvolt_spots', JSON.stringify(updated));
  };

  const toggleSpotStatus = (id: string) => {
    const spot = spots.find(s => s.id === id);
    if (spot) {
      updateSpot({ ...spot, isDisabledByHost: !spot.isDisabledByHost });
    }
  };

  const removeSpot = (id: string) => {
    const updated = spots.filter(s => s.id !== id);
    setSpots(updated);
    localStorage.setItem('parkvolt_spots', JSON.stringify(updated));
  };

  const setSpotAvailability = (id: string, available: boolean, bookingId?: string) => {
    const updated = spots.map(s => {
      if (s.id === id) {
        return { ...s, isAvailable: available, currentBookingId: bookingId };
      }
      return s;
    });
    setSpots(updated);
    localStorage.setItem('parkvolt_spots', JSON.stringify(updated));
  };

  return { spots, addSpot, removeSpot, setSpotAvailability, updateSpot, toggleSpotStatus };
}
