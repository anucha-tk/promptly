/**
 * Ensures the default Firebase app exists before VueFire/composables run.
 * Runs on both server and client so useFirestore() / useCurrentUser() never
 * see "default Firebase app does not exist" during SSR or before firebase.client.ts.
 * 0. prefix makes this run first among app plugins.
 */
import { initializeApp, getApps } from 'firebase/app';

export default defineNuxtPlugin(() => {
  if (getApps().length > 0) return;
  const config = useRuntimeConfig().public;
  initializeApp({
    apiKey: config.firebaseApiKey as string,
    authDomain: config.firebaseAuthDomain as string,
    projectId: config.firebaseProjectId as string,
    storageBucket: config.firebaseStorageBucket as string,
    messagingSenderId: config.firebaseMessagingSenderId as string,
    appId: config.firebaseAppId as string,
  });
});
