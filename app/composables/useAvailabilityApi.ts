import type { CreateAvailabilityInput, AvailabilityDoc } from '~shared/schemas/availability';

export function useAvailabilityApi() {
  const { fetchWithAuth } = useApi();

  const createAvailability = (body: CreateAvailabilityInput) =>
    fetchWithAuth<AvailabilityDoc>('/api/availability', {
      method: 'POST',
      body,
    });

  return {
    createAvailability,
  };
}
