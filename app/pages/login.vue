<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { loginSchema } from '../schemas/auth';
import { cn } from '@/lib/utils';

const route = useRoute();
const { login, isPending, error: authError } = useAuth();

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: { email: '', password: '' },
});

const { value: emailValue, errorMessage: emailError } = useField('email');
const { value: passwordValue, errorMessage: passwordError } = useField('password');

const redirectTo = computed(() => {
  const redirect = route.query.redirect;
  return typeof redirect === 'string' ? redirect : '/bookings';
});

const onSubmit = handleSubmit(async (payload) => {
  const user = await login(payload.email, payload.password);
  if (user) {
    await navigateTo(redirectTo.value, { replace: true });
  }
});
</script>

<template>
  <div class="flex flex-1 flex-col items-center justify-center px-4 py-12">
    <div class="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
      <h1 class="text-2xl font-bold tracking-tight text-foreground">Sign in</h1>
      <p class="mt-1 text-sm text-muted-foreground">Use your email and password.</p>

      <form class="mt-6 space-y-4" @submit="onSubmit">
        <div class="space-y-2">
          <label for="login-email" class="text-sm font-medium leading-none text-foreground">
            Email
          </label>
          <input
            id="login-email"
            v-model="emailValue"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            :class="
              cn(
                'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                emailError && 'border-destructive focus-visible:ring-destructive'
              )
            "
            :disabled="isPending"
          />
          <p v-if="emailError" class="text-destructive text-xs">
            {{ emailError }}
          </p>
        </div>

        <div class="space-y-2">
          <label for="login-password" class="text-sm font-medium leading-none text-foreground">
            Password
          </label>
          <input
            id="login-password"
            v-model="passwordValue"
            type="password"
            autocomplete="current-password"
            placeholder="••••••••"
            :class="
              cn(
                'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                passwordError && 'border-destructive focus-visible:ring-destructive'
              )
            "
            :disabled="isPending"
          />
          <p v-if="passwordError" class="text-destructive text-xs">
            {{ passwordError }}
          </p>
        </div>

        <p v-if="authError" class="text-destructive text-sm">
          {{ authError }}
        </p>

        <Button type="submit" class="w-full" :disabled="isPending">
          {{ isPending ? 'Signing in…' : 'Sign in' }}
        </Button>
      </form>

      <p class="mt-6 text-center text-sm text-muted-foreground">
        <NuxtLink to="/" class="text-primary underline-offset-4 hover:underline">
          Back to home
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
