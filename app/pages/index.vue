<template>
  <div class="flex flex-col">
    <!-- Hero -->
    <section class="flex flex-col items-center gap-8 px-4 py-16 text-center md:py-24 lg:py-32">
      <div class="mx-auto max-w-3xl space-y-4">
        <h1
          class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          On-demand service,
          <span class="text-primary">done right</span>
        </h1>
        <p class="text-muted-foreground text-lg md:text-xl">
          Book, track, and manage services in one place. CleanSync keeps everything in sync with
          zero-trust auth and reliable transactions.
        </p>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-4">
        <NuxtLink to="/bookings">
          <Button size="lg" class="shadow-md"> View bookings </Button>
        </NuxtLink>
        <NuxtLink v-if="!user" to="/login">
          <Button variant="outline" size="lg"> Sign in </Button>
        </NuxtLink>
      </div>
    </section>

    <!-- Features strip -->
    <section class="border-t border-border bg-muted/30">
      <div class="grid gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-3 md:py-16">
        <div class="flex flex-col gap-2 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 class="font-semibold text-foreground">Single engine</h3>
          <p class="text-muted-foreground text-sm">
            All logic in Nitro; no separate API. One repo, one deploy.
          </p>
        </div>
        <div class="flex flex-col gap-2 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 class="font-semibold text-foreground">Atomic bookings</h3>
          <p class="text-muted-foreground text-sm">
            Firestore transactions prevent double-booking and race conditions.
          </p>
        </div>
        <div
          class="flex flex-col gap-2 rounded-lg border border-border bg-card p-6 shadow-sm sm:col-span-2 md:col-span-1"
        >
          <h3 class="font-semibold text-foreground">Zero-trust auth</h3>
          <p class="text-muted-foreground text-sm">
            Every protected request validates the token on the server.
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
          Ready to get started?
        </h2>
        <p class="mt-2 text-muted-foreground">
          Sign in or create an account to manage your bookings.
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/login">
            <Button>Sign in</Button>
          </NuxtLink>
          <NuxtLink to="/about">
            <Button variant="outline">About us</Button>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth();
</script>
