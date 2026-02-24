// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  // 1. กรองให้รันเฉพาะ path ที่ขึ้นต้นด้วย /api
  if (!event.path.startsWith('/api')) {
    return;
  }

  // 2. ข้ามหน้า Health check หรือ Public API (ถ้ามี)
  if (event.path.startsWith('/api/health')) {
    return;
  }
  if (event.path.startsWith('/api/dev-token')) {
    return;
  }
  const authHeader = getRequestHeader(event, 'authorization');
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : getRequestHeader(event, 'x-firebase-token');

  if (!token) {
    // We don't throw 401 here yet to allow public routes (Step 2)
    return;
  }

  try {
    const decodedToken = await getAdminAuth().verifyIdToken(token);

    // Attach to context for use in Nitro handlers
    event.context.user = decodedToken;
    event.context.uid = decodedToken.uid;
  } catch (error: unknown) {
    // If a token was provided but is invalid/expired, we block the request
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: { message: error instanceof Error ? error.message : 'Invalid Firebase token' },
    });
  }
});
