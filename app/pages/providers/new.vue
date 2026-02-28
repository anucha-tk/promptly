<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { createProviderSchema, type CreateProviderInput } from '~shared/schemas/provider';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

definePageMeta({ middleware: ['auth'] });

const { createProvider } = useProvidersApi();
const isPending = ref(false);
const apiError = ref<string | null>(null);

const form = useForm<CreateProviderInput>({
  validationSchema: toTypedSchema(createProviderSchema),
  initialValues: {
    displayName: '',
    email: '',
  },
});

const onSubmit = form.handleSubmit(async (values) => {
  isPending.value = true;
  apiError.value = null;
  try {
    const created = await createProvider({
      displayName: values.displayName,
      email: values.email?.trim() || undefined,
    });
    await navigateTo(`/bookings/new`, {
      replace: true,
      query: { created: created.id },
    });
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } };
    apiError.value = err?.data?.message ?? 'สร้างผู้ให้บริการไม่สำเร็จ';
  } finally {
    isPending.value = false;
  }
});
</script>

<template>
  <div class="px-4 py-8">
    <NuxtLink
      to="/bookings"
      class="text-muted-foreground hover:text-foreground mb-4 inline-block text-sm"
    >
      ← กลับไปการจอง
    </NuxtLink>

    <div class="mx-auto max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
      <h1 class="text-2xl font-bold tracking-tight text-foreground">เพิ่มผู้ให้บริการ</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        สร้างรายการผู้ให้บริการใหม่ เพื่อให้ลูกค้าเลือกตอนจอง
      </p>

      <form class="mt-6 space-y-4" @submit="onSubmit">
        <FormField v-slot="{ field, handleChange, handleBlur }" name="displayName">
          <FormItem>
            <FormLabel>ชื่อผู้ให้บริการ</FormLabel>
            <FormControl>
              <Input
                :model-value="field.value"
                type="text"
                placeholder="เช่น คลินิกหมอสมชาย"
                :disabled="isPending"
                @update:model-value="handleChange"
                @blur="handleBlur"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ field, handleChange, handleBlur }" name="email">
          <FormItem>
            <FormLabel>อีเมล (ไม่บังคับ)</FormLabel>
            <FormControl>
              <Input
                :model-value="field.value"
                type="email"
                placeholder="provider@example.com"
                :disabled="isPending"
                @update:model-value="handleChange"
                @blur="handleBlur"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <p v-if="apiError" class="text-destructive text-sm">
          {{ apiError }}
        </p>

        <Button type="submit" class="w-full" :disabled="isPending">
          {{ isPending ? 'กำลังสร้าง…' : 'สร้างผู้ให้บริการ' }}
        </Button>
      </form>
    </div>
  </div>
</template>
