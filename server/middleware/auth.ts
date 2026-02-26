import { getAdminAuth } from '../utils/firebaseAdmin';
import { sendErrorResp } from '../utils/response';

export default defineEventHandler(async (event) => {
  // 1. กรองให้รันเฉพาะ path ที่ขึ้นต้นด้วย /api
  if (!event.path.startsWith('/api')) {
    return;
  }

  const publicRoutes = ['/api/health', '/api/dev-token'];
  if (publicRoutes.includes(event.path)) return;

  const authHeader = getRequestHeader(event, 'authorization');
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : getRequestHeader(event, 'x-firebase-token');

  if (!token) {
    sendErrorResp(401, 'Missing auth token');
    return;
  }

  try {
    const auth = getAdminAuth();
    const decodedToken = await auth.verifyIdToken(token);

    event.context.user = decodedToken;
    event.context.uid = decodedToken.uid;
  } catch (error: unknown) {
    // Log for debugging (token invalid, expired, or FIREBASE_SERVICE_ACCOUNT wrong/missing)
    console.error(
      '[auth middleware] verifyIdToken failed:',
      error instanceof Error ? error.message : String(error)
    );
    sendErrorResp(401, 'Unauthorized');
  }
});
