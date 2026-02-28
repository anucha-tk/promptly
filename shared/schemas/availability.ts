import { z } from 'zod';

/**
 * Shape of a document in the Firestore `availability` collection.
 * Each doc represents one bookable slot offered by a provider.
 * Stored fields: providerId (string), slotStart (Timestamp), slotEnd (Timestamp).
 */
export const availabilityDocSchema = z
  .object({
    id: z.string().optional(),
    providerId: z.string(),
    slotStart: z.coerce.date(),
    slotEnd: z.coerce.date(),
  })
  .refine((data) => data.slotEnd > data.slotStart, {
    message: 'slotEnd must be after slotStart',
    path: ['slotEnd'],
  });

export type AvailabilityDoc = z.infer<typeof availabilityDocSchema>;

/** Body for POST /api/availability. */
export const createAvailabilitySchema = z
  .object({
    providerId: z.string().min(1, 'กรุณาเลือกผู้ให้บริการ'),
    slotStart: z.coerce.date(),
    slotEnd: z.coerce.date(),
  })
  .refine((data) => data.slotEnd > data.slotStart, {
    message: 'เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่ม',
    path: ['slotEnd'],
  });

export type CreateAvailabilityInput = z.infer<typeof createAvailabilitySchema>;
