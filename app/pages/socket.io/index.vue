<template>
  <div class="p-4 text-center text-gray-500">
    ไม่มี Socket.IO server ที่ path นี้ ถ้าคุณเห็นข้อความนี้ อาจเป็นจาก extension หรือ dev tool
    ที่กำลังตรวจหา Socket.IO
  </div>
</template>

<script setup lang="ts">
// Catches /socket.io and /socket.io/ so Vue Router doesn't warn "No match found".
// The app does not run a Socket.IO server; these requests often come from browser extensions.
definePageMeta({
  layout: false,
});
</script>
