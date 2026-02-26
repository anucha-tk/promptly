<script setup lang="ts">
import { doc } from 'firebase/firestore';

const route = useRoute();
const db = useFirestore();

const bookingRef = computed(() => doc(db, 'bookings', route.params.id as string));
const { data: booking, pending, error } = useDocument(bookingRef);

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
  <div class="container px-4 py-8">
    <NuxtLink
      to="/bookings"
      class="text-muted-foreground hover:text-foreground mb-4 inline-block text-sm"
    >
      ← Back to bookings
    </NuxtLink>

    <div v-if="pending" class="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
      <p class="text-muted-foreground">Loading booking…</p>
    </div>

    <div
      v-else-if="error"
      class="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center"
    >
      <p class="text-destructive font-medium">Error loading booking.</p>
      <NuxtLink to="/bookings" class="mt-3 inline-block">
        <Button variant="outline" size="sm">Back to list</Button>
      </NuxtLink>
    </div>

    <div
      v-else-if="!booking"
      class="rounded-lg border border-border bg-card p-8 text-center shadow-sm"
    >
      <p class="text-muted-foreground">Booking not found.</p>
      <NuxtLink to="/bookings" class="mt-3 inline-block">
        <Button variant="outline" size="sm">Back to list</Button>
      </NuxtLink>
    </div>

    <div v-else class="rounded-lg border border-border bg-card shadow-sm">
      <div class="border-b border-border p-4">
        <h1 class="text-2xl font-bold tracking-tight text-foreground">Booking {{ booking.id }}</h1>
        <span
          class="mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase"
          :class="statusClass(booking.status ?? 'pending')"
        >
          {{ booking.status ?? 'pending' }}
        </span>
      </div>
      <dl class="grid gap-4 p-4 sm:grid-cols-2">
        <div>
          <dt class="text-muted-foreground text-sm">Client</dt>
          <dd class="font-medium text-foreground">
            {{ booking.clientDisplayName ?? booking.clientUid ?? '—' }}
          </dd>
        </div>
        <div>
          <dt class="text-muted-foreground text-sm">Provider ID</dt>
          <dd class="font-medium text-foreground">
            {{ booking.providerId ?? '—' }}
          </dd>
        </div>
        <div>
          <dt class="text-muted-foreground text-sm">Slot start</dt>
          <dd class="font-medium text-foreground">
            {{ formatSlot(booking.slotStart) }}
          </dd>
        </div>
        <div>
          <dt class="text-muted-foreground text-sm">Slot end</dt>
          <dd class="font-medium text-foreground">
            {{ formatSlot(booking.slotEnd) }}
          </dd>
        </div>
        <div v-if="booking.createdAt">
          <dt class="text-muted-foreground text-sm">Created</dt>
          <dd class="font-medium text-foreground">
            {{ formatSlot(booking.createdAt) }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>
