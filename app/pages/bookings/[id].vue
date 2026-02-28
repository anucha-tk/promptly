<script setup lang="ts">
import type { BookingStatus } from '~shared/schemas/booking';
import { doc } from 'firebase/firestore';

// @ts-expect-error Nuxt resolves named middleware at build time; types expect NavigationGuard
definePageMeta({ middleware: ['auth'] });

const route = useRoute();
const db = useFirestore();
const user = useCurrentUser();
const { updateBookingStatus } = useBookingsApi();

const bookingRef = computed(() => doc(db, 'bookings', route.params.id as string));
const { data: booking, pending, error } = useDocument(bookingRef);

const providerRef = computed(() => {
  const pid = booking.value?.providerId;
  return typeof pid === 'string' && pid ? doc(db, 'providers', pid) : null;
});
const { data: provider } = useDocument(providerRef);

const statusUpdatePending = ref(false);
const statusError = ref<string | null>(null);

const allowedNextStatuses = computed((): BookingStatus[] => {
  const status = (booking.value?.status as BookingStatus) ?? 'pending';
  const map: Record<BookingStatus, BookingStatus[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['in_progress', 'cancelled'],
    in_progress: ['completed'],
    completed: [],
    cancelled: [],
  };
  return map[status] ?? [];
});

const canUpdateStatus = computed(() => {
  if (!user.value || !booking.value) return false;
  const uid = user.value.uid;
  return uid === booking.value.clientUid || uid === booking.value.providerId;
});

async function setStatus(newStatus: BookingStatus) {
  const id = route.params.id as string;
  statusError.value = null;
  statusUpdatePending.value = true;
  try {
    await updateBookingStatus(id, newStatus);
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } };
    statusError.value = err?.data?.message ?? 'อัปเดตสถานะไม่สำเร็จ';
  } finally {
    statusUpdatePending.value = false;
  }
}

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

const statusLabels: Record<string, string> = {
  pending: 'รอดำเนินการ',
  confirmed: 'ยืนยันแล้ว',
  in_progress: 'กำลังดำเนินการ',
  completed: 'เสร็จสิ้น',
  cancelled: 'ยกเลิก',
};
function statusLabel(status: string): string {
  return statusLabels[status] ?? status;
}
</script>

<template>
  <div class="px-4 py-8">
    <NuxtLink
      to="/bookings"
      class="text-muted-foreground hover:text-foreground mb-4 inline-block text-sm"
    >
      ← กลับไปรายการจอง
    </NuxtLink>

    <div v-if="pending" class="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
      <p class="text-muted-foreground">กำลังโหลดการจอง…</p>
    </div>

    <div
      v-else-if="error"
      class="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center"
    >
      <p class="text-destructive font-medium">โหลดการจองไม่สำเร็จ</p>
      <NuxtLink to="/bookings" class="mt-3 inline-block">
        <Button variant="outline" size="sm">กลับไปรายการ</Button>
      </NuxtLink>
    </div>

    <div
      v-else-if="!booking"
      class="rounded-lg border border-border bg-card p-8 text-center shadow-sm"
    >
      <p class="text-muted-foreground">ไม่พบการจอง</p>
      <NuxtLink to="/bookings" class="mt-3 inline-block">
        <Button variant="outline" size="sm">กลับไปรายการ</Button>
      </NuxtLink>
    </div>

    <div v-else class="rounded-lg border border-border bg-card shadow-sm">
      <div class="border-b border-border p-4">
        <h1 class="text-2xl font-bold tracking-tight text-foreground">การจอง {{ booking.id }}</h1>
        <span
          class="mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase"
          :class="statusClass(booking.status ?? 'pending')"
        >
          {{ statusLabel(booking.status ?? 'pending') }}
        </span>
      </div>
      <dl class="grid gap-4 p-4 sm:grid-cols-2">
        <div>
          <dt class="text-muted-foreground text-sm">ผู้จอง</dt>
          <dd class="font-medium text-foreground">
            {{ booking.clientDisplayName ?? booking.clientUid ?? '—' }}
          </dd>
        </div>
        <div>
          <dt class="text-muted-foreground text-sm">ผู้ให้บริการ</dt>
          <dd class="font-medium text-foreground">
            {{
              (provider as { displayName?: string } | null)?.displayName ??
              booking.providerId ??
              '—'
            }}
          </dd>
        </div>
        <div>
          <dt class="text-muted-foreground text-sm">เวลาเริ่ม</dt>
          <dd class="font-medium text-foreground">
            {{ formatSlot(booking.slotStart) }}
          </dd>
        </div>
        <div>
          <dt class="text-muted-foreground text-sm">เวลาสิ้นสุด</dt>
          <dd class="font-medium text-foreground">
            {{ formatSlot(booking.slotEnd) }}
          </dd>
        </div>
        <div v-if="booking.createdAt">
          <dt class="text-muted-foreground text-sm">สร้างเมื่อ</dt>
          <dd class="font-medium text-foreground">
            {{ formatSlot(booking.createdAt) }}
          </dd>
        </div>
      </dl>

      <div v-if="canUpdateStatus && allowedNextStatuses.length" class="border-t border-border p-4">
        <p class="text-muted-foreground text-sm font-medium">อัปเดตสถานะ</p>
        <p v-if="statusError" class="text-destructive mt-1 text-sm">{{ statusError }}</p>
        <div class="mt-2 flex flex-wrap gap-2">
          <Button
            v-for="next in allowedNextStatuses"
            :key="next"
            variant="outline"
            size="sm"
            :disabled="statusUpdatePending"
            @click="setStatus(next)"
          >
            {{
              next === 'cancelled'
                ? 'ยกเลิก'
                : next === 'in_progress'
                  ? 'กำลังดำเนินการ'
                  : next === 'completed'
                    ? 'เสร็จสิ้น'
                    : next === 'confirmed'
                      ? 'ยืนยัน'
                      : statusLabel(next)
            }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
