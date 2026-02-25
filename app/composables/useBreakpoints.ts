import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

/**
 * Reactive viewport breakpoints aligned with Tailwind (sm: 640px, md: 768px, lg: 1024px).
 * Use for responsive UI: e.g. show drawer on sm, navigation menu on md/lg.
 *
 * @see ARCHITECT_CONTEXT.mdc — Responsive breakpoints
 */
export function useAppBreakpoints() {
  return useBreakpoints(breakpointsTailwind, {
    // SSR: avoid hydration mismatch; assume desktop on server
    ssrWidth: 1024,
  });
}
