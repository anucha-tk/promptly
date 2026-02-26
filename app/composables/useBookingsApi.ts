import type { CreateBookingInput, BookingResponse, BookingStatus } from '~shared/schemas/booking';

/**
 * Type-safe API for bookings. Use with useApi().fetchWithAuth.
 * Shared types from ~shared/schemas/booking keep client and server in sync.
 */
export function useBookingsApi() {
  const { fetchWithAuth } = useApi();
  const base = '/api/bookings';

  const createBooking = (body: CreateBookingInput) =>
    fetchWithAuth<BookingResponse>(base, {
      method: 'POST',
      body,
    });

  const updateBookingStatus = (id: string, status: BookingStatus) =>
    fetchWithAuth<BookingResponse>(`${base}/${id}`, {
      method: 'PATCH',
      body: { status },
    });

  return {
    createBooking,
    updateBookingStatus,
  };
}
