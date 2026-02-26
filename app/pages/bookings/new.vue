<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { createBookingSchema, type CreateBookingInput } from '~shared/schemas/booking';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// @ts-expect-error Nuxt resolves named middleware at build time; types expect NavigationGuard
definePageMeta({ middleware: ['auth'] });

const { createBooking } = useBookingsApi();
const isPending = ref(false);
const apiError = ref<string | null>(null);

const form = useForm<CreateBookingInput>({
  validationSchema: toTypedSchema(createBookingSchema),
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
      (err?.statusCode === 409 ? 'This slot is already booked.' : 'Failed to create booking.');
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
      ← Back to bookings
    </NuxtLink>

    <div class="mx-auto max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
      <h1 class="text-2xl font-bold tracking-tight text-foreground">New booking</h1>
      <p class="mt-1 text-sm text-muted-foreground">Choose provider and time slot.</p>

      <form class="mt-6 space-y-4" @submit="onSubmit">
        <FormField v-slot="{ field, handleChange, handleBlur }" name="providerId">
          <FormItem>
            <FormLabel>Provider ID</FormLabel>
            <FormControl>
              <Input
                :model-value="field.value"
                type="text"
                placeholder="e.g. provider-1"
                :disabled="isPending"
                @update:model-value="handleChange"
                @blur="handleBlur"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ field, handleChange, handleBlur }" name="slotStart">
          <FormItem>
            <FormLabel>Slot start</FormLabel>
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
            <FormLabel>Slot end</FormLabel>
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
          {{ isPending ? 'Creating…' : 'Create booking' }}
        </Button>
      </form>
    </div>
  </div>
</template>
