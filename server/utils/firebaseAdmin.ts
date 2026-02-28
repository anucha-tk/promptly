import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export const initAdmin = () => {
  const apps = getApps();
  const existing = apps[0];
  if (existing) {
    return existing;
  }

  const saData = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!saData) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT is missing in .env');
  }

  try {
    const serviceAccount = JSON.parse(saData);

    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    return initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
  } catch (error: unknown) {
    console.error(
      'Firebase Admin Initialization Failed:',
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
};

export const getAdminAuth = () => getAuth(initAdmin());
export const getAdminFirestore = () => getFirestore(initAdmin());
