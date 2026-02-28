import { Timestamp } from 'firebase-admin/firestore';
import {
  createAvailabilitySchema,
  type CreateAvailabilityInput,
  type AvailabilityDoc,
} from '~shared/schemas/availability';
import { getAdminFirestore } from '../../utils/firebaseAdmin';
import { requireUser } from '../../utils/getCurrentUser';
import { sendErrorResp } from '../../utils/response';

export default defineEventHandler(async (event): Promise<AvailabilityDoc> => {
  requireUser(event);

  const body = await readBody(event);
  const parsed = createAvailabilitySchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>;
    const first = Object.values(msg).flat().find(Boolean);
    sendErrorResp(400, first ?? 'Validation failed');
  }
  const payload = parsed.data as CreateAvailabilityInput;

  const db = getAdminFirestore();
  const ref = db.collection('availability').doc();

  const slotStartTs = Timestamp.fromDate(payload.slotStart);
  const slotEndTs = Timestamp.fromDate(payload.slotEnd);

  await ref.set({
    providerId: payload.providerId,
    slotStart: slotStartTs,
    slotEnd: slotEndTs,
  });

  const response: AvailabilityDoc = {
    id: ref.id,
    providerId: payload.providerId,
    slotStart: payload.slotStart,
    slotEnd: payload.slotEnd,
  };
  setResponseStatus(event, 201);
  return response;
});
