<script setup lang="ts">
import { collection, query, where } from 'firebase/firestore';

// 1. เข้าถึง Firestore instance
const db = useFirestore();
// 2. ดึง User ปัจจุบัน (Reactive)
const user = useCurrentUser();

// 3. สร้าง Query (จะทำงานเมื่อ user ล็อกอินแล้ว)
const bookingsQuery = computed(() => {
  if (!user.value) return null;
  return query(collection(db, 'bookings'), where('clientUid', '==', user.value.uid));
});

// 4. Bind ข้อมูลแบบ Real-time
const bookings = useCollection(bookingsQuery);
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">My Bookings</h1>

    <div v-if="!user" class="p-6 bg-amber-50 border border-amber-200 rounded-lg text-center">
      <p class="text-amber-800 font-medium">Please log in to see your bookings.</p>
      <NuxtLink
        to="/login"
        class="inline-block mt-4 px-5 py-2.5 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition"
      >
        Sign in
      </NuxtLink>
    </div>

    <div v-else>
      <div v-if="bookings.length === 0" class="py-10 text-center border-2 border-dashed rounded">
        <p class="text-gray-500">No bookings found. Add one in Firebase Console to test!</p>
      </div>

      <div class="grid gap-4">
        <div
          v-for="booking in bookings"
          :key="booking.id"
          class="p-4 border rounded-lg shadow-sm flex justify-between items-center bg-white"
        >
          <div>
            <p class="font-semibold text-lg">{{ booking.clientDisplayName || 'Anonymous' }}</p>
            <p class="text-sm text-gray-500">{{ booking.slotStart?.toDate().toLocaleString() }}</p>
          </div>
          <div class="flex items-center gap-4">
            <span
              class="px-3 py-1 rounded-full text-xs font-medium uppercase"
              :class="
                booking.status === 'confirmed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              "
            >
              {{ booking.status }}
            </span>
            <NuxtLink
              :to="`/bookings/${booking.id}`"
              class="text-blue-600 hover:text-blue-800 font-medium"
            >
              Details →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
