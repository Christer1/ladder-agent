// Typed API functions for the help chat. Messages are read from Firestore (help-chat.connection.ts).
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { ApiSuccess } from '@/types/api.types';
import type { StartHelpChatRequest, StartHelpChatResponse } from '../types/help-chat.types';

/** Opens the chat for a help reference (or reopens it), with the preset message already sent. */
export async function startHelpChat(payload: StartHelpChatRequest): Promise<StartHelpChatResponse> {
  const res = await apiClient.post<ApiSuccess<StartHelpChatResponse>>(
    ENDPOINTS.helpChat.start,
    payload,
  );
  return res.data.data;
}

/** Ladder's reply arrives in Firestore. idToken proves this browser owns the chat. */
export async function sendHelpChatMessage(
  chatId: string,
  text: string,
  idToken: string,
): Promise<void> {
  await apiClient.post<ApiSuccess<Record<string, never>>>(
    ENDPOINTS.helpChat.messages(chatId),
    { text },
    { headers: { Authorization: `Bearer ${idToken}` } },
  );
}
