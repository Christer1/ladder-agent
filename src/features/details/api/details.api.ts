// Typed API functions: getDetails (after liveness only), confirmDetails.
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { ApiSuccess } from '@/types/api.types';
import type { AssistanceDetails, ConfirmDetailsRequest } from '../types/details.types';

export async function getDetails(): Promise<AssistanceDetails> {
  const res = await apiClient.get<ApiSuccess<AssistanceDetails>>(ENDPOINTS.details.me);
  return res.data.data;
}

export async function confirmDetails(payload: ConfirmDetailsRequest): Promise<void> {
  await apiClient.post<ApiSuccess<Record<string, never>>>(ENDPOINTS.details.confirm, payload);
}
