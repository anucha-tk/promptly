<script setup lang="ts">
const { $fbAuth, $fbFirestore } = useNuxtApp();

onMounted(() => {
  console.log('Firebase Auth Instance:', $fbAuth);
  console.log('Firestore Instance:', $fbFirestore);
});
</script>
<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-3xl font-bold underline text-amber-300">Hello World</h1>
  </div>
</template>
