/**
 * Protects routes that require a signed-in user.
 * Redirects to /login?redirect=<fullPath> when not authenticated.
 * Runs only on client so Firebase Auth state is available.
 */
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;

  const user = useCurrentUser();
  if (user.value) return;

  const redirect = '/login?redirect=' + encodeURIComponent(to.fullPath);
  return navigateTo(redirect);
});
