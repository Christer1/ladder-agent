// useMutation wrapper around session.api.endSession. Always clears local state, even if the call fails.
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiError } from '@/lib/api/errors';
import { useAssistanceStore } from '@/store/assistance.store';
import { endSession } from '../api/session.api';

export function useEndSession() {
  const queryClient = useQueryClient();
  const reset = useAssistanceStore((state) => state.reset);

  return useMutation<void, ApiError, void>({
    mutationFn: endSession,
    onSettled: () => {
      queryClient.clear();
      reset();
    },
  });
}
