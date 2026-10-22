// Typed API functions for the assistance session (status, end).
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { ApiSuccess } from '@/types/api.types';
import type { AssistanceStatus } from '../types/session.types';

export async function getStatus(): Promise<AssistanceStatus> {
  const res = await apiClient.get<ApiSuccess<AssistanceStatus>>(ENDPOINTS.session.status);
  return res.data.data;
}

export async function endSession(): Promise<void> {
  await apiClient.post<ApiSuccess<Record<string, never>>>(ENDPOINTS.session.end);
}
