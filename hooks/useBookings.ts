"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "parkvolt_user_bookings";

export interface Booking {
  id: string;
  userId: string;
  slotId: string;
  startTime: number;
  endTime: number;
  actualEndTime?: number;
  status: "active" | "completed" | "cancelled";
  pricePaid: number;
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

  const createBooking = (slotId: string, durationHours: number, pricePaid: number, customStartTime?: number) => {
    const start = customStartTime || Date.now();
    const end = start + (durationHours * 3600 * 1000);
    
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      userId: "user-1",
      slotId,
      startTime: start,
      endTime: end,
      status: "active",
      pricePaid
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newBooking;
  };

  const endBooking = (bookingId: string) => {
    const now = Date.now();
    const bIdx = bookings.findIndex(b => b.id === bookingId);
    if (bIdx === -1) return { earned: 0 };

    const booking = bookings[bIdx];
    const unusedMs = booking.endTime - now;
    const earnedCoins = unusedMs > 60000 ? Math.floor(unusedMs / 60000) : 0;

    const updated = [...bookings];
    updated[bIdx] = { 
      ...booking, 
      status: "completed", 
      actualEndTime: now,
      coinsEarned: earnedCoins 
    };
    
    setBookings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    return { earned: earnedCoins, booking: updated[bIdx] };
  };

  const getActiveBooking = () => {
    return bookings.find(b => b.status === "active");
  };

  return { bookings, createBooking, endBooking, getActiveBooking };
};
