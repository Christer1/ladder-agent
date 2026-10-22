// Typed API functions for the identify endpoints. Each one starts the assistance session.
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { ApiSuccess } from '@/types/api.types';
import type {
  IdentifyBvnAndNinRequest,
  IdentifyBvnRequest,
  IdentifyLadderIdRequest,
  IdentifyNinRequest,
  IdentifyResponse,
} from '../types/identity.types';

async function identify<T>(path: string, payload: T): Promise<IdentifyResponse> {
  const res = await apiClient.post<ApiSuccess<IdentifyResponse>>(path, payload);
  return res.data.data;
}

export const identifyBvn = (payload: IdentifyBvnRequest) =>
  identify(ENDPOINTS.identify.bvn, payload);

export const identifyNin = (payload: IdentifyNinRequest) =>
  identify(ENDPOINTS.identify.nin, payload);

export const identifyBvnAndNin = (payload: IdentifyBvnAndNinRequest) =>
  identify(ENDPOINTS.identify.bvnAndNin, payload);

export const identifyLadderId = (payload: IdentifyLadderIdRequest) =>
  identify(ENDPOINTS.identify.ladderId, payload);
