<script setup lang="ts">
import { collection, query, where } from 'firebase/firestore';

// @ts-expect-error Nuxt resolves named middleware at build time; types expect NavigationGuard
definePageMeta({ middleware: ['auth'] });

const db = useFirestore();
const user = useCurrentUser();

const bookingsQuery = computed(() => {
  if (!user.value) return null;
  return query(collection(db, 'bookings'), where('clientUid', '==', user.value.uid));
});

const bookings = useCollection(bookingsQuery);

function formatSlot(value: unknown): string {
  if (!value) return '—';
  const d =
    typeof value === 'object' && value !== null && 'toDate' in value
      ? (value as { toDate(): Date }).toDate()
      : value instanceof Date
        ? value
        : null;
  return d ? d.toLocaleString() : '—';
}

function statusClass(status: string): string {
  const map: Record<string, string> = {
    pending: 'bg-muted text-muted-foreground',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-muted text-muted-foreground',
    cancelled: 'bg-destructive/10 text-destructive',
  };
  return map[status] ?? 'bg-muted text-muted-foreground';
}
</script>

<template>
  <div class="px-4 py-8">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-3xl font-bold tracking-tight text-foreground">My Bookings</h1>
      <NuxtLink v-if="user" to="/bookings/new">
        <Button>New booking</Button>
      </NuxtLink>
    </div>

    <div
      v-if="!user"
      class="mt-6 rounded-lg border border-border bg-card p-6 text-center shadow-sm"
    >
      <p class="font-medium text-foreground">Please log in to see your bookings.</p>
      <NuxtLink to="/login" class="mt-4 inline-block">
        <Button>Sign in</Button>
      </NuxtLink>
    </div>

    <template v-else>
      <div
        v-if="!bookings?.length"
        class="mt-6 rounded-lg border-2 border-dashed border-border py-12 text-center"
      >
        <p class="text-muted-foreground">No bookings yet.</p>
        <NuxtLink to="/bookings/new" class="mt-4 inline-block">
          <Button>Create your first booking</Button>
        </NuxtLink>
      </div>

      <div v-else class="mt-6 grid gap-4">
        <div
          v-for="booking in bookings"
          :key="booking.id"
          class="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="min-w-0">
            <p class="font-semibold text-foreground">
              {{ booking.clientDisplayName ?? 'Anonymous' }}
            </p>
            <p class="text-muted-foreground text-sm">
              {{ formatSlot(booking.slotStart) }}
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <span
              class="inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase"
              :class="statusClass(booking.status ?? 'pending')"
            >
              {{ booking.status ?? 'pending' }}
            </span>
            <NuxtLink :to="`/bookings/${booking.id}`">
              <Button variant="outline" size="sm"> Details → </Button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
