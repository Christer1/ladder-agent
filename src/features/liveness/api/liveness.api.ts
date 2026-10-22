// Typed API function for the liveness upload.
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { ApiSuccess } from '@/types/api.types';
import type { SubmitLivenessRequest, SubmitLivenessResponse } from '../types/liveness.types';

export async function submitLiveness({
  selfie,
}: SubmitLivenessRequest): Promise<SubmitLivenessResponse> {
  const body = new FormData();
  body.append('selfie', selfie, 'selfie.jpg');

  const res = await apiClient.post<ApiSuccess<SubmitLivenessResponse>>(ENDPOINTS.liveness, body);
  return res.data.data;
}
