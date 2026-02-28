<template>
  <div class="flex flex-col">
    <!-- Hero -->
    <section class="flex flex-col items-center gap-8 px-4 py-16 text-center md:py-24 lg:py-32">
      <div class="mx-auto max-w-3xl space-y-4">
        <h1
          class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          บริการตาม demand
          <span class="text-primary">ทำได้ถูกต้อง</span>
        </h1>
        <p class="text-muted-foreground text-lg md:text-xl">
          จอง ติดตาม และจัดการบริการในที่เดียว พร้อมระบบยืนยันตัวตนและธุรกรรมการจองที่เชื่อถือได้
        </p>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-4">
        <NuxtLink to="/bookings">
          <Button size="lg" class="shadow-md"> ดูการจอง </Button>
        </NuxtLink>
        <NuxtLink v-if="!user" to="/login">
          <Button variant="outline" size="lg"> เข้าสู่ระบบ </Button>
        </NuxtLink>
      </div>
    </section>

    <!-- Features strip -->
    <section class="border-t border-border bg-muted/30">
      <div class="grid gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-3 md:py-16">
        <div class="flex flex-col gap-2 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 class="font-semibold text-foreground">ระบบเดียว</h3>
          <p class="text-muted-foreground text-sm">
            Logic อยู่ใน Nitro ไม่แยก API โปรเจกต์เดียว deploy ครั้งเดียว
          </p>
        </div>
        <div class="flex flex-col gap-2 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 class="font-semibold text-foreground">จองแบบอะตอมมิก</h3>
          <p class="text-muted-foreground text-sm">
            ใช้ Firestore transaction ป้องกันการจองซ้อนและ race condition
          </p>
        </div>
        <div
          class="flex flex-col gap-2 rounded-lg border border-border bg-card p-6 shadow-sm sm:col-span-2 md:col-span-1"
        >
          <h3 class="font-semibold text-foreground">ยืนยันตัวตน</h3>
          <p class="text-muted-foreground text-sm">
            ทุก request ที่ต้องล็อกอินจะตรวจสอบ token ที่ server
          </p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="px-4 py-12 md:py-16">
      <div
        class="mx-auto max-w-2xl rounded-xl border border-border bg-card p-8 text-center shadow-sm md:p-10"
      >
        <h2 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          พร้อมเริ่มต้นแล้ว?
        </h2>
        <p class="mt-2 text-muted-foreground">เข้าสู่ระบบหรือสร้างบัญชีเพื่อจัดการการจอง</p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/login">
            <Button>เข้าสู่ระบบ</Button>
          </NuxtLink>
          <NuxtLink to="/about">
            <Button variant="outline">เกี่ยวกับเรา</Button>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth();
</script>
