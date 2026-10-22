// Screen 2 "/bvn-or-nin": BVN | NIN toggle, 11-digit number, date of birth, Continue.
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GetHelpButton } from '@/components/layout/GetHelpButton';
import { Button, Input, SegmentedControl } from '@/components/ui';
import { ROUTES } from '@/config/routes';
import type { ApiError } from '@/lib/api/errors';
import { displayToIsoDate } from '@/lib/utils/date';
import { useIdentifyBvn, useIdentifyNin } from '../hooks/useIdentify';
import {
  ID_NUMBER_LENGTH,
  bvnOrNinSchema,
  type BvnOrNinFormValues,
} from '../schemas/identity.schema';
import { mismatchMessage, resolveIdentityError } from '../utils/identity-error';
import { DateOfBirthField } from './DateOfBirthField';
import { IdentityScreen } from './IdentityScreen';

type IdType = BvnOrNinFormValues['idType'];

const ID_TYPE_OPTIONS: ReadonlyArray<{ value: IdType; label: string }> = [
  { value: 'bvn', label: 'BVN' },
  { value: 'nin', label: 'NIN' },
];

const digitsOnly = (value: string) => value.replace(/\D/g, '').slice(0, ID_NUMBER_LENGTH);

export function BvnOrNinForm() {
  const router = useRouter();
  const identifyBvn = useIdentifyBvn();
  const identifyNin = useIdentifyNin();
  // The number and date of birth didn't match a record. Both fields are marked: we can't say which.
  const [isMismatch, setIsMismatch] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  // Opens the help chat about this failure.
  const [helpReference, setHelpReference] = useState<string | null>(null);
  const isPending = identifyBvn.isPending || identifyNin.isPending;

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<BvnOrNinFormValues>({
    resolver: zodResolver(bvnOrNinSchema),
    mode: 'onTouched',
    defaultValues: { idType: 'bvn', idNumber: '', dateOfBirth: '' },
  });

  const idType = useWatch({ control, name: 'idType' });
  const idLabel = idType === 'bvn' ? 'BVN' : 'NIN';

  const changeIdType = (next: IdType) => {
    if (next === idType) return;
    setValue('idType', next);
    setValue('idNumber', '');
    clearErrors();
    setIsMismatch(false);
    setFormError(null);
  };

  // A server answer (e.g. "Information mismatch.") is about the whole entry, so any edit clears it.
  const clearServerErrors = () => {
    if (errors.dateOfBirth?.type === 'server') clearErrors('dateOfBirth');
    if (errors.idNumber?.type === 'server') clearErrors('idNumber');
    setIsMismatch(false);
    setFormError(null);
  };

  const handleError = (error: ApiError) => {
    const resolved = resolveIdentityError(error);
    setHelpReference(resolved.helpReference);
    if (resolved.isMismatch) {
      setIsMismatch(true);
    } else if (resolved.field === 'dateOfBirth') {
      setError('dateOfBirth', { type: 'server', message: resolved.message });
    } else if (resolved.field === 'bvn' || resolved.field === 'nin') {
      setError('idNumber', { type: 'server', message: resolved.message });
    } else {
      setFormError(resolved.message);
    }
  };

  const onSubmit = (values: BvnOrNinFormValues) => {
    const dateOfBirth = displayToIsoDate(values.dateOfBirth);
    if (!dateOfBirth) return;
    setFormError(null);
    const callbacks = { onSuccess: () => router.push(ROUTES.LIVENESS), onError: handleError };

    if (values.idType === 'bvn') {
      identifyBvn.mutate({ bvn: values.idNumber, dateOfBirth }, callbacks);
    } else {
      identifyNin.mutate({ nin: values.idNumber, dateOfBirth }, callbacks);
    }
  };

  return (
    <IdentityScreen title="BVN or NIN">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <SegmentedControl
          label="Identifier"
          options={ID_TYPE_OPTIONS}
          value={idType}
          onChange={changeIdType}
          disabled={isPending}
        />

        <div className="mt-10 flex flex-col gap-7">
          <Controller
            control={control}
            name="idNumber"
            render={({ field }) => (
              <Input
                label={idLabel}
                placeholder={`Enter your ${ID_NUMBER_LENGTH}-digit ${idLabel}`}
                inputMode="numeric"
                autoComplete="off"
                maxLength={ID_NUMBER_LENGTH}
                readOnly={isPending}
                error={errors.idNumber?.message}
                isInvalid={isMismatch}
                {...field}
                onChange={(event) => {
                  clearServerErrors();
                  field.onChange(digitsOnly(event.target.value));
                }}
              />
            )}
          />
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
                disabled={isPending}
                error={
                  errors.dateOfBirth?.message ??
                  (isMismatch ? mismatchMessage(`${idLabel} and date of birth`) : undefined)
                }
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
          {isMismatch && (
            <p className="sr-only">{mismatchMessage(`${idLabel} and date of birth`)}</p>
          )}
          {formError && (
            <p role="alert" className="mt-6 text-sm text-danger">
              {formError}
            </p>
          )}
        </div>

        <Button type="submit" disabled={!isValid} isLoading={isPending} className="mt-10">
          Continue
        </Button>
      </form>
    </IdentityScreen>
  );
}
