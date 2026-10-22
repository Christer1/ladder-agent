// useMutation wrappers around the identify API functions. Success refreshes the session status.
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionQueryKeys } from '@/features/session';
import type { ApiError } from '@/lib/api/errors';
import { identifyBvn, identifyBvnAndNin, identifyLadderId, identifyNin } from '../api/identity.api';
import type {
  IdentifyBvnAndNinRequest,
  IdentifyBvnRequest,
  IdentifyLadderIdRequest,
  IdentifyNinRequest,
  IdentifyResponse,
} from '../types/identity.types';

function useIdentifyMutation<TRequest>(
  mutationFn: (payload: TRequest) => Promise<IdentifyResponse>,
) {
  const queryClient = useQueryClient();

  return useMutation<IdentifyResponse, ApiError, TRequest>({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionQueryKeys.status }),
  });
}

export const useIdentifyBvn = () => useIdentifyMutation<IdentifyBvnRequest>(identifyBvn);
export const useIdentifyNin = () => useIdentifyMutation<IdentifyNinRequest>(identifyNin);
export const useIdentifyBvnAndNin = () =>
  useIdentifyMutation<IdentifyBvnAndNinRequest>(identifyBvnAndNin);
export const useIdentifyLadderId = () =>
  useIdentifyMutation<IdentifyLadderIdRequest>(identifyLadderId);
