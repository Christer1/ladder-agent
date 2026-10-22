// useMutation wrapper around details.api.confirmDetails.
import { useMutation } from '@tanstack/react-query';
import type { ApiError } from '@/lib/api/errors';
import { confirmDetails } from '../api/details.api';
import type { ConfirmDetailsRequest } from '../types/details.types';

export function useConfirmDetails() {
  return useMutation<void, ApiError, ConfirmDetailsRequest>({ mutationFn: confirmDetails });
}
