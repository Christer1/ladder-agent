// useQuery wrapper around session.api.getStatus.
import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '@/lib/api/errors';
import { getStatus } from '../api/session.api';
import type { AssistanceStatus } from '../types/session.types';

export const sessionQueryKeys = {
  all: ['session'] as const,
  status: ['session', 'status'] as const,
};

export function useAssistanceStatus() {
  return useQuery<AssistanceStatus, ApiError>({
    queryKey: sessionQueryKeys.status,
    queryFn: getStatus,
  });
}
