// Maps an identify error to where it is shown and whether Get Help sits beside it (rules.md §7).
import type { ApiError } from '@/lib/api/errors';

export const MISMATCH_MESSAGE = 'Information mismatch.';

/** "Information mismatch. Check your BVN and date of birth." */
export const mismatchMessage = (fields: string) => `${MISMATCH_MESSAGE} Check your ${fields}.`;

export type IdentityErrorField = 'bvn' | 'nin' | 'dateOfBirth' | 'ladderId';

export type ResolvedIdentityError = {
  /**
   * The backend can't say which value was wrong (by design), so the form marks every field it
   * sent and explains under the last one.
   */
  isMismatch: boolean;
  /** null: show under the form instead of a field. */
  field: IdentityErrorField | null;
  message: string;
  /** The user may not fix this by retyping, so offer Get Help beside the message. */
  showsHelp: boolean;
};

const KNOWN_FIELDS: readonly string[] = ['bvn', 'nin', 'dateOfBirth', 'ladderId'];

export function resolveIdentityError(error: ApiError): ResolvedIdentityError {
  switch (error.code) {
    case 'INFORMATION_MISMATCH':
      return { isMismatch: true, field: null, message: MISMATCH_MESSAGE, showsHelp: true };
    case 'LADDER_ID_NOT_FOUND':
      return { isMismatch: false, field: 'ladderId', message: error.message, showsHelp: true };
  }

  const [fieldName, messages] = Object.entries(error.fieldErrors)[0] ?? [];
  if (fieldName && KNOWN_FIELDS.includes(fieldName)) {
    return {
      isMismatch: false,
      field: fieldName as IdentityErrorField,
      message: messages?.[0] ?? error.message,
      showsHelp: false,
    };
  }
  return { isMismatch: false, field: null, message: error.message, showsHelp: false };
}
