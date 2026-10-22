// Screen 3 "/bvn-and-nin": BVN, NIN and date of birth, Continue. Not designed: reuses the BVN or NIN layout.
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GetHelpButton } from '@/components/layout/GetHelpButton';
import { Button, Input } from '@/components/ui';
import { ROUTES } from '@/config/routes';
import type { ApiError } from '@/lib/api/errors';
import { displayToIsoDate } from '@/lib/utils/date';
import { useIdentifyBvnAndNin } from '../hooks/useIdentify';
import {
  ID_NUMBER_LENGTH,
  bvnAndNinSchema,
  type BvnAndNinFormValues,
} from '../schemas/identity.schema';
import { mismatchMessage, resolveIdentityError } from '../utils/identity-error';
import { DateOfBirthField } from './DateOfBirthField';
import { IdentityScreen } from './IdentityScreen';

const digitsOnly = (value: string) => value.replace(/\D/g, '').slice(0, ID_NUMBER_LENGTH);

const MISMATCH_TEXT = mismatchMessage('BVN, NIN and date of birth');

export function BvnAndNinForm() {
  const router = useRouter();
  const identify = useIdentifyBvnAndNin();
  // A number and the date of birth didn't match, or the BVN and NIN are different people.
  // Every field is marked: we can't say which one is wrong.
  const [isMismatch, setIsMismatch] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  // Opens the help chat about this failure.
  const [helpReference, setHelpReference] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<BvnAndNinFormValues>({
    resolver: zodResolver(bvnAndNinSchema),
    mode: 'onTouched',
    defaultValues: { bvn: '', nin: '', dateOfBirth: '' },
  });

  // A server answer (e.g. "Information mismatch.") is about the whole entry, so any edit clears it.
  const clearServerErrors = () => {
    (['bvn', 'nin', 'dateOfBirth'] as const).forEach((name) => {
      if (errors[name]?.type === 'server') clearErrors(name);
    });
    setIsMismatch(false);
    setFormError(null);
  };

  const handleError = (error: ApiError) => {
    const resolved = resolveIdentityError(error);
    setHelpReference(resolved.helpReference);
    if (resolved.isMismatch) {
      setIsMismatch(true);
    } else if (resolved.field && resolved.field !== 'ladderId') {
      setError(resolved.field, { type: 'server', message: resolved.message });
    } else {
      setFormError(resolved.message);
    }
  };

  const onSubmit = ({ bvn, nin, dateOfBirth: displayDate }: BvnAndNinFormValues) => {
    const dateOfBirth = displayToIsoDate(displayDate);
    if (!dateOfBirth) return;
    setFormError(null);
    identify.mutate(
      { bvn, nin, dateOfBirth },
      { onSuccess: () => router.push(ROUTES.LIVENESS), onError: handleError },
    );
  };

  return (
    <IdentityScreen title="BVN and NIN">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-7">
          {(['bvn', 'nin'] as const).map((name) => {
            const label = name.toUpperCase();
            return (
              <Controller
                key={name}
                control={control}
                name={name}
                render={({ field }) => (
                  <Input
                    label={label}
                    placeholder={`Enter your ${ID_NUMBER_LENGTH}-digit ${label}`}
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={ID_NUMBER_LENGTH}
                    readOnly={identify.isPending}
                    error={errors[name]?.message}
                    isInvalid={isMismatch}
                    {...field}
                    onChange={(event) => {
                      clearServerErrors();
                      field.onChange(digitsOnly(event.target.value));
                    }}
                  />
                )}
              />
            );
          })}
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field }) => (
              <DateOfBirthField
                name={field.name}
                value={field.value}
                onChange={(value) => {
                  clearServerErrors();
                  field.onChange(value);
                }}
                onBlur={field.onBlur}
                disabled={identify.isPending}
                error={errors.dateOfBirth?.message ?? (isMismatch ? MISMATCH_TEXT : undefined)}
                errorAction={
                  isMismatch && !errors.dateOfBirth ? (
                    <GetHelpButton reference={helpReference} />
                  ) : undefined
                }
              />
            )}
          />
        </div>

        <div aria-live="polite">
          {isMismatch && <p className="sr-only">{MISMATCH_TEXT}</p>}
          {formError && (
            <p role="alert" className="mt-6 text-sm text-danger">
              {formError}
            </p>
          )}
        </div>

        <Button type="submit" disabled={!isValid} isLoading={identify.isPending} className="mt-10">
          Continue
        </Button>
      </form>
    </IdentityScreen>
  );
}
