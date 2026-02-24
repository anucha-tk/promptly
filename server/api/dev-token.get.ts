import { getAdminAuth } from '../utils/firebaseAdmin';

export default defineEventHandler(async () => {
  if (!import.meta.dev) return { error: 'Not allowed' };

  const testUid = process.env.FIREBASE_TEST_UID;
  if (!testUid) {
    throw createError({ statusCode: 500, statusMessage: 'FIREBASE_TEST_UID is not set' });
  }

  try {
    const customToken = await getAdminAuth().createCustomToken(testUid);

    return {
      instruction: 'Copy the customToken and exchange it for an idToken using Identity Toolkit',
      customToken: customToken,
      exchangeUrl: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=[YOUR_WEB_API_KEY]`,
    };
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: String(e) };
  }
});
