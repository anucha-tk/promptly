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
    return;
  }

  try {
    const decodedToken = await getAdminAuth().verifyIdToken(token);

    event.context.user = decodedToken;
    event.context.uid = decodedToken.uid;
  } catch (error: unknown) {
    sendErrorResp(401, error instanceof Error ? error.message : 'Unauthorized');
  }
});
