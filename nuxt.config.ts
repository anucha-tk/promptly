import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  modules: ['nuxt-vuefire', 'shadcn-nuxt'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  alias: {
    '@': fileURLToPath(new URL('./app', import.meta.url)),
  },
  css: ['./app/assets/css/main.css'],
  vite: {
    // @ts-expect-error tailwindcss is a valid plugin
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
    },
  },
  vuefire: {
    auth: {
      enabled: true,
      ssr: true,
    },
    config: {
      // แนะนำให้ใช้ prefix NUXT_PUBLIC_ ตาม runtimeConfig เพื่อความสอดคล้อง
      apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
    },
    // เพิ่มส่วนนี้เพื่อแก้ SSR Admin SDK Warning
    admin: {
      serviceAccount: process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT
        ? JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT)
        : process.env.GOOGLE_APPLICATION_CREDENTIALS, // ใส่ path ไปยังไฟล์ .json
    },
  },
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui',
  },
});
