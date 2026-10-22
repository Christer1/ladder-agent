// useMutation wrapper around liveness.api.submitLiveness. Success refreshes the session status.
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionQueryKeys } from '@/features/session';
import type { ApiError } from '@/lib/api/errors';
import { submitLiveness } from '../api/liveness.api';
import type { SubmitLivenessRequest, SubmitLivenessResponse } from '../types/liveness.types';

export function useSubmitLiveness() {
  const queryClient = useQueryClient();

  return useMutation<SubmitLivenessResponse, ApiError, SubmitLivenessRequest>({
    mutationFn: submitLiveness,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionQueryKeys.status }),
  });
}
