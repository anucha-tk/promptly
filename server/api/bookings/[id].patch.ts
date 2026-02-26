import type { Timestamp } from 'firebase-admin/firestore';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import {
  bookingStatusSchema,
  type BookingResponse,
  type BookingStatus,
} from '../../../shared/schemas/booking';
import { getAdminFirestore } from '../../utils/firebaseAdmin';
import { requireUser } from '../../utils/getCurrentUser';
import { sendErrorResp } from '../../utils/response';

const patchBodySchema = z.object({
  status: bookingStatusSchema,
});

const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['in_progress', 'cancelled'],
  in_progress: ['completed'],
  completed: [],
  cancelled: [],
};

export default defineEventHandler(async (event): Promise<BookingResponse> => {
  const user = requireUser(event);
  if (!user) return undefined as never;

  const id = getRouterParam(event, 'id');
  if (!id) {
    sendErrorResp(400, 'Booking ID is required');
  }

  const body = await readBody(event);
  const parsed = patchBodySchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>;
    const first = Object.values(msg).flat().find(Boolean);
    sendErrorResp(400, first ?? 'Validation failed');
  }
  const { status: newStatus } = parsed.data;
  const uid = event.context.uid as string;

  const db = getAdminFirestore();
  const bookingRef = db.collection('bookings').doc(id);

  let updated: BookingResponse;

  try {
    await db.runTransaction(async (transaction) => {
      const snap = await transaction.get(bookingRef);
      if (!snap.exists) {
        sendErrorResp(404, 'Booking not found');
      }
      const data = snap.data()!;
      const clientUid = data.clientUid as string;
      const providerId = data.providerId as string;
      const currentStatus = (data.status as BookingStatus) ?? 'pending';

      if (uid !== clientUid && uid !== providerId) {
        sendErrorResp(403, 'You may not update this booking');
      }

      const allowed = ALLOWED_TRANSITIONS[currentStatus];
      if (!allowed?.includes(newStatus)) {
        sendErrorResp(409, `Cannot transition from ${currentStatus} to ${newStatus}`);
      }

      const updateData: Record<string, unknown> = {
        status: newStatus,
        updatedAt: FieldValue.serverTimestamp(),
      };
      transaction.update(bookingRef, updateData);

      const slotStart = data.slotStart as Timestamp;
      const slotEnd = data.slotEnd as Timestamp;
      const createdAt = data.createdAt as Timestamp | undefined;

      updated = {
        id: snap.id,
        clientUid,
        providerId,
        slotStart: slotStart?.toDate?.() ?? new Date(),
        slotEnd: slotEnd?.toDate?.() ?? new Date(),
        status: newStatus,
        createdAt: createdAt?.toDate?.(),
        updatedAt: new Date(),
      };
    });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'statusCode' in e) throw e;
    sendErrorResp(503, e instanceof Error ? e.message : 'Update failed');
  }

  setResponseStatus(event, 200);
  return updated!;
});
