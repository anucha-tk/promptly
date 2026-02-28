<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { registerSchema, type RegisterInput } from '../schemas/auth';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const route = useRoute();
const { register, isPending, error: authError } = useAuth();

const form = useForm<RegisterInput>({
  validationSchema: toTypedSchema(registerSchema),
  initialValues: { email: '', password: '', confirmPassword: '' },
});

const redirectTo = computed(() => {
  const redirect = route.query.redirect;
  if (typeof redirect === 'string' && redirect.startsWith('/')) return redirect;
  return '/bookings';
});

const onSubmit = form.handleSubmit(async (values) => {
  const { email, password } = values as RegisterInput;
  const user = await register(String(email), String(password));
  if (user) {
    await navigateTo(redirectTo.value, { replace: true });
  }
});
</script>

<template>
  <div class="flex flex-1 flex-col items-center justify-center px-4 py-12">
    <div class="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
      <h1 class="text-2xl font-bold tracking-tight text-foreground">สมัครสมาชิก</h1>
      <p class="mt-1 text-sm text-muted-foreground">สร้างบัญชีด้วยอีเมลของคุณ</p>

      <form class="mt-6 space-y-4" @submit="onSubmit">
        <FormField v-slot="{ field, handleChange, handleBlur }" name="email">
          <FormItem>
            <FormLabel>อีเมล</FormLabel>
            <FormControl>
              <Input
                :model-value="field.value"
                type="email"
                autocomplete="email"
                placeholder="คุณ@ตัวอย่าง.com"
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
            <FormLabel>รหัสผ่าน</FormLabel>
            <FormControl>
              <Input
                :model-value="field.value"
                type="password"
                autocomplete="new-password"
                placeholder="••••••••"
                :disabled="isPending"
                @update:model-value="handleChange"
                @blur="handleBlur"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ field, handleChange, handleBlur }" name="confirmPassword">
          <FormItem>
            <FormLabel>ยืนยันรหัสผ่าน</FormLabel>
            <FormControl>
              <Input
                :model-value="field.value"
                type="password"
                autocomplete="new-password"
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
          {{ isPending ? 'กำลังสร้างบัญชี…' : 'สมัครสมาชิก' }}
        </Button>
      </form>

      <p class="mt-6 text-center text-sm text-muted-foreground">
        มีบัญชีอยู่แล้ว?
        <NuxtLink
          :to="
            '/login' +
            (route.query.redirect
              ? '?redirect=' + encodeURIComponent(String(route.query.redirect))
              : '')
          "
          class="text-primary underline-offset-4 hover:underline"
        >
          เข้าสู่ระบบ
        </NuxtLink>
      </p>
      <p class="mt-2 text-center text-sm text-muted-foreground">
        <NuxtLink to="/" class="text-primary underline-offset-4 hover:underline">
          กลับหน้าแรก
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
