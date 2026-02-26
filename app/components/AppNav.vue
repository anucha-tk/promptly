<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const { user, logout } = useAuth();
const route = useRoute();

const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 });
const isSm = breakpoints.smaller('md');

const navItems = computed(() => {
  const base = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];
  if (user.value) {
    base.splice(1, 0, { label: 'Booking', to: '/bookings' });
  }
  return base;
});

function isActive(to: string) {
  if (to === '/') return route.path === '/';
  return route.path.startsWith(to);
}
</script>

<template>
  <header
    class="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
  >
    <div class="flex h-14 items-center justify-between px-4">
      <NuxtLink to="/" class="flex items-center gap-2 font-semibold">
        <span class="text-foreground">CleanSync</span>
      </NuxtLink>

      <!-- sm: drawer -->
      <div v-if="isSm" class="flex items-center gap-2 md:hidden">
        <Drawer>
          <DrawerTrigger as-child>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 5h16" />
                <path d="M4 12h16" />
                <path d="M4 19h16" />
              </svg>
            </Button>
          </DrawerTrigger>
          <DrawerContent class="w-[280px] max-w-[85vw]">
            <DrawerHeader>
              <DrawerTitle>Menu</DrawerTitle>
            </DrawerHeader>
            <nav class="flex flex-col gap-1 px-4 pb-6">
              <DrawerClose
                v-for="item in navItems"
                :key="item.to"
                as-child
                class="[&>button]:w-full [&>button]:justify-start"
              >
                <NuxtLink
                  :to="item.to"
                  :class="
                    cn(
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive(item.to)
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                    )
                  "
                >
                  {{ item.label }}
                </NuxtLink>
              </DrawerClose>
              <div class="my-2 border-t border-border" />
              <template v-if="user">
                <DrawerClose as-child class="[&>button]:w-full [&>button]:justify-start">
                  <Button variant="ghost" class="w-full justify-start" @click="logout()">
                    Sign out
                  </Button>
                </DrawerClose>
              </template>
              <template v-else>
                <DrawerClose as-child>
                  <NuxtLink to="/register">
                    <Button variant="outline" class="w-full">Sign up</Button>
                  </NuxtLink>
                </DrawerClose>
                <DrawerClose as-child>
                  <NuxtLink to="/login">
                    <Button variant="default" class="w-full">Sign in</Button>
                  </NuxtLink>
                </DrawerClose>
              </template>
            </nav>
          </DrawerContent>
        </Drawer>
      </div>

      <!-- md/lg: horizontal menu -->
      <nav v-else class="flex items-center gap-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="
            cn(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive(item.to)
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
            )
          "
        >
          {{ item.label }}
        </NuxtLink>
        <template v-if="user">
          <Button variant="ghost" size="sm" class="ml-2" @click="logout()"> Sign out </Button>
        </template>
        <template v-else>
          <NuxtLink to="/register">
            <Button variant="outline" size="sm" class="ml-2">Sign up</Button>
          </NuxtLink>
          <NuxtLink to="/login">
            <Button size="sm" class="ml-2">Sign in</Button>
          </NuxtLink>
        </template>
      </nav>
    </div>
  </header>
</template>
