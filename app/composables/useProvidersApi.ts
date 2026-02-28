import type { CreateProviderInput, ProviderSummary } from '~shared/schemas/provider';

export function useProvidersApi() {
  const { fetchWithAuth } = useApi();

  const createProvider = (body: CreateProviderInput) =>
    fetchWithAuth<ProviderSummary>('/api/providers', {
      method: 'POST',
      body,
    });

  return {
    createProvider,
  };
}
