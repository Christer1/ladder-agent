// Maps an identify error to the field it belongs to and whether Get Help should appear (rules.md §7).
import type { ApiError } from '@/lib/api/errors';

export const MISMATCH_MESSAGE = 'Information mismatch.';

export type IdentityErrorField = 'bvn' | 'nin' | 'dateOfBirth' | 'ladderId';

export type ResolvedIdentityError = {
  /** null: show under the form instead of a field. */
  field: IdentityErrorField | null;
  message: string;
  /** The user can't fix this by retyping, so offer Get Help. */
  showsHelp: boolean;
};

const KNOWN_FIELDS: readonly string[] = ['bvn', 'nin', 'dateOfBirth', 'ladderId'];

export function resolveIdentityError(error: ApiError): ResolvedIdentityError {
  switch (error.code) {
    case 'INFORMATION_MISMATCH':
      return { field: 'dateOfBirth', message: MISMATCH_MESSAGE, showsHelp: true };
    case 'BVN_NOT_FOUND':
      return { field: 'bvn', message: error.message, showsHelp: false };
    case 'NIN_NOT_FOUND':
      return { field: 'nin', message: error.message, showsHelp: false };
    case 'BVN_NIN_MISMATCH':
      return { field: 'nin', message: error.message, showsHelp: true };
    case 'LADDER_ID_NOT_FOUND':
      return { field: 'ladderId', message: error.message, showsHelp: false };
  }

  const [fieldName, messages] = Object.entries(error.fieldErrors)[0] ?? [];
  if (fieldName && KNOWN_FIELDS.includes(fieldName)) {
    return {
      field: fieldName as IdentityErrorField,
      message: messages?.[0] ?? error.message,
      showsHelp: false,
    };
  }
  return { field: null, message: error.message, showsHelp: false };
}
