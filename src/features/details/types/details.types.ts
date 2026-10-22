// Types for GET /assistance/details and POST /assistance/confirm.

export type AssistanceDetails = {
  fullName: string;
  /** ISO YYYY-MM-DD. */
  dateOfBirth: string;
  phoneNumber: string;
  email: string | null;
  /** null when Ladder has no address on file; the user types it instead. */
  residentialAddress: string | null;
};

export type ConfirmDetailsRequest = {
  residentialAddress?: string;
};
