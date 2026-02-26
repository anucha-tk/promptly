<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { loginSchema, type LoginInput } from '../schemas/auth';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const route = useRoute();
const { login, isPending, error: authError } = useAuth();

const form = useForm<LoginInput>({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: { email: '', password: '' },
});

const redirectTo = computed(() => {
  const redirect = route.query.redirect;
  return typeof redirect === 'string' ? redirect : '/bookings';
});

const onSubmit = form.handleSubmit(async (values) => {
  const { email, password } = values as LoginInput;
  const user = await login(String(email), String(password));
  if (user) {
    await navigateTo(redirectTo.value, { replace: true });
  }
});
</script>

<template>
  <div class="container flex flex-1 flex-col items-center justify-center px-4 py-12">
    <div class="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
      <h1 class="text-2xl font-bold tracking-tight text-foreground">Sign in</h1>
      <p class="mt-1 text-sm text-muted-foreground">Use your email and password.</p>

      <form class="mt-6 space-y-4" @submit="onSubmit">
        <FormField v-slot="{ field, handleChange, handleBlur }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                :model-value="field.value"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                :disabled="isPending"
                @update:model-value="handleChange"
                @blur="handleBlur"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ field, handleChange, handleBlur }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                :model-value="field.value"
                type="password"
                autocomplete="current-password"
                placeholder="••••••••"
                :disabled="isPending"
                @update:model-value="handleChange"
                @blur="handleBlur"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

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
