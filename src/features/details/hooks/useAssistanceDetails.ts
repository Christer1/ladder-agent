// useQuery wrapper around details.api.getDetails. Short gcTime: personal data leaves memory soon after use.
import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '@/lib/api/errors';
import { getDetails } from '../api/details.api';
import type { AssistanceDetails } from '../types/details.types';

export const detailsQueryKeys = {
  me: ['details'] as const,
};

export function useAssistanceDetails() {
  return useQuery<AssistanceDetails, ApiError>({
    queryKey: detailsQueryKeys.me,
    queryFn: getDetails,
    staleTime: Infinity,
    gcTime: 60_000,
  });
}
