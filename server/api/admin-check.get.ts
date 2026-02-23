export default defineEventHandler(() => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }

  try {
    initAdmin();
    return {
      ok: true,
      admin: true,
      serviceAccountFound: !!process.env.FIREBASE_SERVICE_ACCOUNT,
      message:
        'Firebase Admin SDK initialized. Enable Firestore and/or Auth in Google Cloud Console when you need them.',
    };
  } catch (error: unknown) {
    console.error('Admin Check Error:', error);
    const message = error instanceof Error ? error.message : String(error);
    throw createError({
      statusCode: 500,
      statusMessage: message,
    });
  }
});
