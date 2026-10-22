// Zod schema for the residential address, used only when the backend has none on file.
import { z } from 'zod';

export const residentialAddressSchema = z.object({
  residentialAddress: z
    .string()
    .trim()
    .min(5, 'Enter your residential address')
    .max(200, 'Use 200 characters or fewer'),
});

export type ResidentialAddressFormValues = z.infer<typeof residentialAddressSchema>;
