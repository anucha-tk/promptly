<script setup lang="ts">
import { collection, query } from 'firebase/firestore';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import {
  createAvailabilitySchema,
  type CreateAvailabilityInput,
} from '~shared/schemas/availability';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

definePageMeta({ middleware: ['auth'] });

const db = useFirestore();
const { createAvailability } = useAvailabilityApi();
const isPending = ref(false);
const apiError = ref<string | null>(null);

const providersQuery = computed(() => query(collection(db, 'providers')));
const providers = useCollection(providersQuery);

const form = useForm<CreateAvailabilityInput>({
  validationSchema: toTypedSchema(createAvailabilitySchema),
  initialValues: {
    providerId: '',
    slotStart: new Date(),
    slotEnd: new Date(Date.now() + 60 * 60 * 1000),
  },
});

const onSubmit = form.handleSubmit(async (values) => {
  isPending.value = true;
  apiError.value = null;
  try {
    await createAvailability({
      providerId: values.providerId,
      slotStart:
        values.slotStart instanceof Date ? values.slotStart : new Date(values.slotStart as string),
      slotEnd: values.slotEnd instanceof Date ? values.slotEnd : new Date(values.slotEnd as string),
    });
    form.resetForm();
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } };
    apiError.value = err?.data?.message ?? 'เพิ่มช่วงว่างไม่สำเร็จ';
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
      <h1 class="text-2xl font-bold tracking-tight text-foreground">เพิ่มช่วงเวลาที่ว่าง</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        กำหนดช่วงเวลาที่ผู้ให้บริการรับจอง ลูกค้าจะเห็นและเลือกได้ตอนจอง
      </p>

      <form class="mt-6 space-y-4" @submit="onSubmit">
        <FormField v-slot="{ field, handleChange, handleBlur }" name="providerId">
          <FormItem>
            <FormLabel>ผู้ให้บริการ</FormLabel>
            <FormControl>
              <select
                :value="field.value"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="isPending"
                @change="handleChange(($event.target as HTMLSelectElement).value)"
                @blur="handleBlur"
              >
                <option value="">เลือกผู้ให้บริการ</option>
                <option v-for="p in providers ?? []" :key="p.id" :value="p.id">
                  {{ p.displayName ?? p.id }}
                </option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ field, handleChange, handleBlur }" name="slotStart">
          <FormItem>
            <FormLabel>เวลาเริ่ม</FormLabel>
            <FormControl>
              <Input
                :model-value="
                  field.value instanceof Date
                    ? field.value.toISOString().slice(0, 16)
                    : (field.value ?? '')
                "
                type="datetime-local"
                :disabled="isPending"
                @update:model-value="(v) => handleChange(v ? new Date(v) : undefined)"
                @blur="handleBlur"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ field, handleChange, handleBlur }" name="slotEnd">
          <FormItem>
            <FormLabel>เวลาสิ้นสุด</FormLabel>
            <FormControl>
              <Input
                :model-value="
                  field.value instanceof Date
                    ? field.value.toISOString().slice(0, 16)
                    : (field.value ?? '')
                "
                type="datetime-local"
                :disabled="isPending"
                @update:model-value="(v) => handleChange(v ? new Date(v) : undefined)"
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
          {{ isPending ? 'กำลังเพิ่ม…' : 'เพิ่มช่วงว่าง' }}
        </Button>
      </form>

      <p v-if="(providers ?? []).length === 0" class="mt-4 text-muted-foreground text-sm">
        ยังไม่มีผู้ให้บริการในระบบ
        <NuxtLink to="/providers/new" class="text-primary underline-offset-4 hover:underline">
          สร้างผู้ให้บริการก่อน
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
