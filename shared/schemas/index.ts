/**
 * Barrel export for shared Zod schemas and types.
 * Server and client import from ~shared/schemas or ~shared/schemas/booking etc.
 */
export {
  createBookingSchema,
  availabilitySlotSchema,
  bookingResponseSchema,
  bookingStatusSchema,
  type CreateBookingInput,
  type AvailabilitySlot,
  type BookingResponse,
  type BookingStatus,
} from './booking';

export { providerSummarySchema, type ProviderSummary } from './provider';
