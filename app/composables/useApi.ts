import { getAuth } from 'firebase/auth';

export const useApi = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchWithAuth = async <T>(url: string, options: any = {}) => {
    const auth = getAuth();
    const user = auth.currentUser;

    const token = user ? await user.getIdToken() : null;
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
