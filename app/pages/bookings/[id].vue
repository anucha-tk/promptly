<script setup lang="ts">
import { doc } from 'firebase/firestore';

const route = useRoute();
const db = useFirestore();

// ดึง Document ตาม ID จาก URL Params
const bookingDoc = useDocument(doc(db, 'bookings', route.params.id as string));

const { data: booking, pending, error } = bookingDoc;
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="booking">
    <h1 class="text-xl">Booking Detail: {{ booking.id }}</h1>
    <pre>{{ booking }}</pre>
  </div>
  <div v-else-if="error">Error loading booking.</div>
</template>
