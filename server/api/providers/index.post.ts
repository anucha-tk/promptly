import {
  createProviderSchema,
  type CreateProviderInput,
  type ProviderSummary,
} from '~shared/schemas/provider';
import { getAdminFirestore } from '../../utils/firebaseAdmin';
import { requireUser } from '../../utils/getCurrentUser';
import { sendErrorResp } from '../../utils/response';

export default defineEventHandler(async (event): Promise<ProviderSummary> => {
  requireUser(event);

  const body = await readBody(event);
  const parsed = createProviderSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>;
    const first = Object.values(msg).flat().find(Boolean);
    sendErrorResp(400, first ?? 'Validation failed');
  }
  const payload = parsed.data as CreateProviderInput;

  const db = getAdminFirestore();
  const ref = db.collection('providers').doc();

  await ref.set({
    displayName: payload.displayName.trim(),
    ...(payload.email?.trim() ? { email: payload.email.trim() } : {}),
  });

  const response: ProviderSummary = {
    id: ref.id,
    displayName: payload.displayName.trim(),
  };
  setResponseStatus(event, 201);
  return response;
});
