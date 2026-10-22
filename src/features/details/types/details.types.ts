// Types for GET /assistance/details and POST /assistance/confirm.
// Fields other than name and date of birth are null when the record has no value.

export type AssistanceDetails = {
  fullName: string;
  /** ISO YYYY-MM-DD. */
  dateOfBirth: string;
  gender: string | null;
  phoneNumber: string | null;
  email: string | null;
  stateOfOrigin: string | null;
  stateOfResidence: string | null;
  town: string | null;
  /** null when there is no address on file; the user types it instead. */
  residentialAddress: string | null;
};

export type ConfirmDetailsRequest = {
  residentialAddress?: string;
};
