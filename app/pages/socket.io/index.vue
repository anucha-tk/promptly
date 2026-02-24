<template>
  <div class="p-4 text-center text-gray-500">
    No Socket.IO server at this path. If you see this, a browser extension or dev tool may be
    probing for Socket.IO.
  </div>
</template>

<script setup lang="ts">
// Catches /socket.io and /socket.io/ so Vue Router doesn't warn "No match found".
// The app does not run a Socket.IO server; these requests often come from browser extensions.
definePageMeta({
  layout: false,
});
</script>
