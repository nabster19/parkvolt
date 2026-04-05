"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "parkvolt_user_bookings";

export interface Booking {
  id: string;
  userId: string;
  slotId: string;
  startTime?: number; // Actual arrival time
  scheduledStartTime: number; // For reference
  scheduledEndTime: number; // When they intended to end
  endTime?: number; // Actual end time (stopwatch stop)
  bookingStatus: "confirmed" | "active" | "completed" | "cancelled";
  isCharging: boolean;
  pricePaid: number; // Pre-paid amount
  finalCost?: number; // Calculated at end
  coinsEarned?: number;
}

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (e) { console.error("Bad bookings state", e); }
    }
  }, []);

  const createBooking = (slotId: string, durationHours: number, pricePaid: number, isCharging: boolean = false, customStartTime?: number) => {
    const scheduledStart = customStartTime || Date.now();
    const scheduledEnd = scheduledStart + (durationHours * 3600 * 1000);
    
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      userId: "user-1",
      slotId,
      scheduledStartTime: scheduledStart,
      scheduledEndTime: scheduledEnd,
      bookingStatus: "confirmed",
      isCharging,
      pricePaid
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newBooking;
  };

  const startParking = (bookingId: string) => {
    const now = Date.now();
    const updated = bookings.map(b => {
      if (b.id === bookingId && b.bookingStatus === "confirmed") {
        return {
          ...b,
          bookingStatus: "active" as const,
          startTime: now,
        };
      }
      return b;
    });

    setBookings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated.find(b => b.id === bookingId);
  };

  const endBooking = (bookingId: string, basePricePerHour: number, chargingFeePerHour: number = 0) => {
    const now = Date.now();
    const bIdx = bookings.findIndex(b => b.id === bookingId);
    if (bIdx === -1) return { earned: 0 };

    const booking = bookings[bIdx];
    const actualStartTime = booking.startTime || booking.scheduledStartTime;
    const durationMs = now - actualStartTime;
    const durationHours = durationMs / (3600 * 1000);
    
    // Pricing logic: totalCost = parkingPrice * duration + (optional chargingPrice * duration)
    const finalCost = (basePricePerHour + chargingFeePerHour) * durationHours;
    
    const unusedMs = booking.scheduledEndTime - now;
    const earnedCoins = unusedMs > 60000 ? Math.floor(unusedMs / 60000) : 0;

    const updated = [...bookings];
    updated[bIdx] = { 
      ...booking, 
      bookingStatus: "completed", 
      endTime: now,
      finalCost,
      coinsEarned: earnedCoins 
    };
    
    setBookings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    return { earned: earnedCoins, booking: updated[bIdx], finalCost };
  };

  const getActiveBooking = () => {
    return bookings.find(b => b.bookingStatus === "active" || b.bookingStatus === "confirmed");
  };

  return { bookings, createBooking, startParking, endBooking, getActiveBooking };
};
