// Zod schemas: BVN or NIN, BVN and NIN, Ladder ID. Date of birth is typed as "DD / MM / YYYY".
import { z } from 'zod';
import { displayToIsoDate, parseIsoDate } from '@/lib/utils/date';

/** Minimum age, same as Ladder Web. Confirm with product. */
export const MIN_AGE = 18;
export const ID_NUMBER_LENGTH = 11;

/** Same alphabet as ladder-backend/src/common/utils/ladder-id.ts (no 0/O/1/I/L). */
export const LADDER_ID_PATTERN = /^LID-[2-9A-HJKMNP-Z]{4}-[2-9A-HJKMNP-Z]{4}$/;

function ageOn(dateOfBirth: Date, today: Date): number {
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > dateOfBirth.getMonth() ||
    (today.getMonth() === dateOfBirth.getMonth() && today.getDate() >= dateOfBirth.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

const dateOfBirth = z
  .string()
  .min(1, 'Enter your date of birth')
  .superRefine((value, ctx) => {
    const iso = displayToIsoDate(value);
    const date = iso ? parseIsoDate(iso) : null;
    const today = new Date();
    if (!date) {
      ctx.addIssue({ code: 'custom', message: 'Enter a valid date (DD / MM / YYYY)' });
    } else if (date >= today) {
      ctx.addIssue({ code: 'custom', message: 'Date of birth must be in the past' });
    } else if (ageOn(date, today) < MIN_AGE) {
      ctx.addIssue({
        code: 'custom',
        message: `You must be at least ${MIN_AGE} to open an account`,
      });
    }
  });

const idNumber = (label: string) =>
  z
    .string()
    .regex(
      new RegExp(`^\\d{${ID_NUMBER_LENGTH}}$`),
      `Enter your ${ID_NUMBER_LENGTH}-digit ${label}`,
    );

export const bvnOrNinSchema = z.discriminatedUnion('idType', [
  z.object({ idType: z.literal('bvn'), idNumber: idNumber('BVN'), dateOfBirth }),
  z.object({ idType: z.literal('nin'), idNumber: idNumber('NIN'), dateOfBirth }),
]);

export type BvnOrNinFormValues = z.infer<typeof bvnOrNinSchema>;

export const bvnAndNinSchema = z.object({
  bvn: idNumber('BVN'),
  nin: idNumber('NIN'),
  dateOfBirth,
});

export type BvnAndNinFormValues = z.infer<typeof bvnAndNinSchema>;

export const ladderIdSchema = z.object({
  ladderId: z
    .string()
    .trim()
    .toUpperCase()
    .regex(LADDER_ID_PATTERN, 'Enter your Ladder ID, e.g. LID-7F3A-9K2D'),
});

export type LadderIdFormValues = z.infer<typeof ladderIdSchema>;
