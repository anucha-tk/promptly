import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';

/**
 * Auth composable (store-like): current user, login, logout.
 * User state comes from Firebase; VueFire's useCurrentUser() stays in sync.
 */
export function useAuth() {
  const user = useCurrentUser();
  const isPending = ref(false);
  const error = ref<string | null>(null);

  const login = async (email: string, password: string): Promise<User | null> => {
    isPending.value = true;
    error.value = null;
    try {
      const auth = getAuth();
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

  const logout = async () => {
    isPending.value = true;
    error.value = null;
    try {
      const auth = getAuth();
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
    logout,
  };
}
