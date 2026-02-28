<script setup lang="ts">
import { collection, orderBy, query, where } from 'firebase/firestore';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { createBookingSchema, type CreateBookingInput } from '~shared/schemas/booking';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

definePageMeta({ middleware: ['auth'] });

const db = useFirestore();
const { createBooking } = useBookingsApi();
const isPending = ref(false);
const apiError = ref<string | null>(null);
const selectedProviderId = ref('');
const selectedSlotIndex = ref<number | ''>('');

const providersQuery = computed(() => query(collection(db, 'providers')));
const providers = useCollection(providersQuery);

const availabilityQuery = computed(() => {
  if (!selectedProviderId.value) return null;
  return query(
    collection(db, 'availability'),
    where('providerId', '==', selectedProviderId.value),
    orderBy('slotStart', 'asc')
  );
});
const availability = useCollection(availabilityQuery);

const form = useForm<CreateBookingInput>({
  validationSchema: toTypedSchema(createBookingSchema),
  initialValues: {
    providerId: '',
    slotStart: new Date(),
    slotEnd: new Date(Date.now() + 60 * 60 * 1000),
  },
});

function formatSlotDisplay(value: unknown): string {
  if (!value) return '—';
  const d =
    typeof value === 'object' && value !== null && 'toDate' in value
      ? (value as { toDate(): Date }).toDate()
      : value instanceof Date
        ? value
        : null;
  return d ? d.toLocaleString() : '—';
}

function onProviderChange(value: string) {
  selectedProviderId.value = value;
  selectedSlotIndex.value = '';
  form.setFieldValue('providerId', value);
}

function onProviderInput(payload: string | number) {
  const v = String(payload);
  form.setFieldValue('providerId', v);
  selectedProviderId.value = v;
}

function onSlotChange(indexStr: string) {
  const index = indexStr === '' ? -1 : parseInt(indexStr, 10);
  selectedSlotIndex.value = indexStr === '' ? '' : index;
  const slots = availability.value ?? [];
  const slot = index >= 0 && index < slots.length ? slots[index] : null;
  if (slot?.slotStart != null && slot?.slotEnd != null) {
    const start =
      typeof slot.slotStart?.toDate === 'function'
        ? slot.slotStart.toDate()
        : new Date(slot.slotStart);
    const end =
      typeof slot.slotEnd?.toDate === 'function' ? slot.slotEnd.toDate() : new Date(slot.slotEnd);
    form.setFieldValue('slotStart', start);
    form.setFieldValue('slotEnd', end);
  }
}

const onSubmit = form.handleSubmit(async (values) => {
  isPending.value = true;
  apiError.value = null;
  try {
    const body = {
      providerId: values.providerId,
      slotStart:
        values.slotStart instanceof Date ? values.slotStart : new Date(values.slotStart as string),
      slotEnd: values.slotEnd instanceof Date ? values.slotEnd : new Date(values.slotEnd as string),
    };
    const created = await createBooking(body);
    await navigateTo(`/bookings/${created.id}`, { replace: true });
  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; statusCode?: number };
    apiError.value =
      err?.data?.message ??
      (err?.statusCode === 409 ? 'ช่วงเวลานี้ถูกจองแล้ว' : 'สร้างการจองไม่สำเร็จ');
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
      ← กลับไปรายการจอง
    </NuxtLink>

    <div class="mx-auto max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
      <h1 class="text-2xl font-bold tracking-tight text-foreground">จองใหม่</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        เลือกผู้ให้บริการและช่วงเวลา (หรือเลือกจากช่วงที่ว่าง)
      </p>

      <form class="mt-6 space-y-4" @submit="onSubmit">
        <FormField v-slot="{ field, handleBlur }" name="providerId">
          <FormItem>
            <FormLabel>ผู้ให้บริการ</FormLabel>
            <FormControl>
              <select
                v-if="(providers ?? []).length > 0"
                :value="selectedProviderId"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="isPending"
                @change="onProviderChange(($event.target as HTMLSelectElement).value)"
              >
                <option value="">เลือกผู้ให้บริการ</option>
                <option v-for="p in providers" :key="p.id" :value="p.id">
                  {{ p.displayName ?? p.id }}
                </option>
              </select>
              <Input
                v-else
                :model-value="field.value"
                type="text"
                placeholder="เช่น provider-1 (ยังไม่มีผู้ให้บริการในระบบ)"
                :disabled="isPending"
                @update:model-value="onProviderInput"
                @blur="handleBlur"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div v-if="selectedProviderId" class="space-y-2">
          <label
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >ช่วงเวลาที่ว่าง</label
          >
          <select
            :value="selectedSlotIndex"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="isPending"
            @change="onSlotChange(($event.target as HTMLSelectElement).value)"
          >
            <option value="">เลือกช่วงเวลา (หรือกรอกด้านล่าง)</option>
            <option
              v-for="(slot, i) in availability ?? []"
              :key="(slot as { id?: string }).id ?? i"
              :value="i"
            >
              {{ formatSlotDisplay((slot as { slotStart?: unknown }).slotStart) }} –
              {{ formatSlotDisplay((slot as { slotEnd?: unknown }).slotEnd) }}
            </option>
          </select>
          <p v-if="availability?.length === 0" class="text-muted-foreground text-xs">
            ไม่มีช่วงว่างสำหรับผู้ให้บริการนี้ กรอกเวลาด้านล่าง
          </p>
        </div>

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
          {{ isPending ? 'กำลังสร้าง…' : 'สร้างการจอง' }}
        </Button>
      </form>
    </div>
  </div>
</template>
