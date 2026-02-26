import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';

/**
 * Auth composable (store-like): current user, login, register, logout.
 * User state comes from Firebase; VueFire's useCurrentUser() stays in sync.
 * Only uses Firebase Auth on client (plugin provides $fbAuth).
 */
export function useAuth() {
  const user = import.meta.client ? useCurrentUser() : ref<User | null>(null);
  const isPending = ref(false);
  const error = ref<string | null>(null);

  function getAuthInstance() {
    if (!import.meta.client) return null;
    return (
      (useNuxtApp() as { $fbAuth?: ReturnType<typeof import('firebase/auth').getAuth> }).$fbAuth ??
      null
    );
  }

  const login = async (email: string, password: string): Promise<User | null> => {
    const auth = getAuthInstance();
    if (!auth) return null;
    isPending.value = true;
    error.value = null;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (e: unknown) {
      const message =
        e && typeof e === 'object' && 'code' in e
          ? (e as { code: string }).code === 'auth/invalid-credential'
            ? 'Invalid email or password.'
            : ((e as { message?: string }).message ?? 'Login failed.')
          : 'Login failed.';
      error.value = message;
      return null;
    } finally {
      isPending.value = false;
    }
  };

  const register = async (email: string, password: string): Promise<User | null> => {
    const auth = getAuthInstance();
    if (!auth) return null;
    isPending.value = true;
    error.value = null;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (e: unknown) {
      const message =
        e && typeof e === 'object' && 'code' in e
          ? (e as { code: string }).code === 'auth/email-already-in-use'
            ? 'This email is already registered.'
            : ((e as { message?: string }).message ?? 'Sign up failed.')
          : 'Sign up failed.';
      error.value = message;
      return null;
    } finally {
      isPending.value = false;
    }
  };

  const logout = async () => {
    const auth = getAuthInstance();
    if (!auth) return;
    isPending.value = true;
    error.value = null;
    try {
      await firebaseSignOut(auth);
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Logout failed.';
    } finally {
      isPending.value = false;
    }
  };

  return {
    user,
    isPending: readonly(isPending),
    error: readonly(error),
    login,
    register,
    logout,
  };
}
