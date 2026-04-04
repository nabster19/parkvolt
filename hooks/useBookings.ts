"use client";

import { useState, useEffect } from 'react';

export interface Booking {
  id: string;
  slotId: string;
  startTime: number;
  endTime: number;
  actualEndTime?: number;
  status: "active" | "completed";
  pricePaid: number;
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('parkvolt_bookings');
    if (saved) setBookings(JSON.parse(saved));
  }, []);

  const createBooking = (slotId: string, durationHours: number, price: number) => {
    const start = Date.now();
    const end = start + (durationHours * 60 * 60 * 1000);
    const newBooking: Booking = {
      id: Math.random().toString(36).substring(7),
      slotId,
      startTime: start,
      endTime: end,
      status: "active",
      pricePaid: price
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem('parkvolt_bookings', JSON.stringify(updated));
    return newBooking;
  };

  const endBooking = (bookingId: string) => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, actualEndTime: Date.now(), status: "completed" as const };
      }
      return b;
    });
    setBookings(updated);
    localStorage.setItem('parkvolt_bookings', JSON.stringify(updated));
  };

  const getActiveBooking = () => {
    return bookings.find(b => b.status === "active");
  };

  return { bookings, createBooking, endBooking, getActiveBooking };
}
