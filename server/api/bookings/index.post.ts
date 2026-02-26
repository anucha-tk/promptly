import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import {
  createBookingSchema,
  type CreateBookingInput,
  type BookingResponse,
} from '~shared/schemas/booking';
import { getAdminFirestore } from '../../utils/firebaseAdmin';
import { requireUser } from '../../utils/getCurrentUser';
import { sendErrorResp } from '../../utils/response';

export default defineEventHandler(async (event): Promise<BookingResponse> => {
  const user = requireUser(event);
  if (!user) return undefined as never;

  const body = await readBody(event);
  const parsed = createBookingSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>;
    const first = Object.values(msg).flat().find(Boolean);
    sendErrorResp(400, first ?? 'Validation failed');
  }
  const payload = parsed.data as CreateBookingInput;
  const clientUid = payload.clientUid ?? (event.context.uid as string);

  const db = getAdminFirestore();
  const bookingsRef = db.collection('bookings');
  const slotStartTs = Timestamp.fromDate(payload.slotStart);
  const slotEndTs = Timestamp.fromDate(payload.slotEnd);

  const newRef = bookingsRef.doc();

  try {
    await db.runTransaction(async (transaction) => {
      const q = bookingsRef
        .where('providerId', '==', payload.providerId)
        .where('slotStart', '<', slotEndTs);
      const snapshot = await transaction.get(q);
      for (const doc of snapshot.docs) {
        const d = doc.data();
        const existingEnd = d.slotEnd as Timestamp;
        if (existingEnd && existingEnd.toDate() > payload.slotStart) {
          sendErrorResp(409, 'This slot is already booked');
        }
      }
      transaction.set(newRef, {
        clientUid,
        providerId: payload.providerId,
        slotStart: slotStartTs,
        slotEnd: slotEndTs,
        status: 'pending',
        createdAt: FieldValue.serverTimestamp(),
      });
    });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'statusCode' in e) throw e;
    sendErrorResp(503, e instanceof Error ? e.message : 'Booking failed');
  }

  const response: BookingResponse = {
    id: newRef.id,
    clientUid,
    providerId: payload.providerId,
    slotStart: payload.slotStart,
    slotEnd: payload.slotEnd,
    status: 'pending',
    createdAt: new Date(),
  };
  setResponseStatus(event, 201);
  return response;
});
