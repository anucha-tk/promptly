export const useApi = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchWithAuth = async <T>(url: string, options: any = {}) => {
    let token: string | null = null;
    if (import.meta.client) {
      const nuxtApp = useNuxtApp();
      const auth = (
        nuxtApp as {
          $fbAuth?: { currentUser: { getIdToken(forceRefresh?: boolean): Promise<string> } | null };
        }
      ).$fbAuth;
      const user = auth?.currentUser ?? null;
      // Force refresh so server always gets a valid token (avoids expired token 401)
      token = user ? await user.getIdToken(true) : null;
    }
    return $fetch<T>(url, {
      ...options,
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  };
  return {
    fetchWithAuth,
  };
};
