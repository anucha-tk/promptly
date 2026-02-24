<script setup lang="ts">
const { $fbAuth, $fbFirestore } = useNuxtApp();

onMounted(() => {
  console.log('Firebase Auth Instance:', $fbAuth);
  console.log('Firestore Instance:', $fbFirestore);
});
</script>
<template>
  <NuxtPage />
</template>
