import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export const initAdmin = () => {
  // 1. ถ้ามี App อยู่แล้วให้ใช้ตัวเดิม (Singleton)
  if (getApps().length > 0) {
    return getApp();
  }

  const saData = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!saData) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT is missing in .env');
  }

  try {
    // 2. ตรวจสอบว่า JSON สตริงสมบูรณ์ไหม
    const serviceAccount = JSON.parse(saData);

    // 3. ปรับแต่งเรื่อง Private Key (สำคัญมาก)
    // บางครั้งการก๊อปปี้ \n ใน .env ทำให้ SDK อ่านค่าไม่ได้
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
