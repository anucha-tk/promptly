import { z } from 'zod';

/** Body for POST /api/bookings. clientUid is optional; server fills from token. */
export const createBookingSchema = z
  .object({
    providerId: z.string().min(1, 'Provider is required'),
    slotStart: z.coerce.date(),
    slotEnd: z.coerce.date(),
    clientUid: z.string().optional(),
  })
  .refine((data) => data.slotEnd > data.slotStart, {
    message: 'slotEnd must be after slotStart',
    path: ['slotEnd'],
  });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

const bookingStatusEnum = z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']);

/** Response shape for a booking (create or get). */
export const bookingResponseSchema = z.object({
  id: z.string(),
  clientUid: z.string(),
  providerId: z.string(),
  slotStart: z.coerce.date(),
  slotEnd: z.coerce.date(),
  status: bookingStatusEnum,
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type BookingResponse = z.infer<typeof bookingResponseSchema>;

/** Status only, for PATCH body. */
export const bookingStatusSchema = bookingStatusEnum;
export type BookingStatus = z.infer<typeof bookingStatusSchema>;
