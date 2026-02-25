<script setup lang="ts">
const { $fbAuth, $fbFirestore } = useNuxtApp();
const breakpoints = useAppBreakpoints();
const isLg = breakpoints.greater('lg');
const containerClass = isLg ? 'max-w-7xl mx-auto px-4 md:px-6 lg:px-8' : '';

onMounted(() => {
  console.log('Firebase Auth Instance:', $fbAuth);
  console.log('Firestore Instance:', $fbFirestore);
});
</script>
<template>
  <div :class="containerClass">
    <AppNav />
    <main class="flex-1 mx-auto">
      <NuxtPage />
    </main>
  </div>
</template>
