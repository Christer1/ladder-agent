// Screen 7 "/details": banner, Personal Information, Additional Information, Continue → /complete.
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BackButton } from '@/components/layout/BackButton';
import { Button, Input, Spinner } from '@/components/ui';
import { ROUTES } from '@/config/routes';
import { formatDisplayDate } from '@/lib/utils/date';
import { useAssistanceStore } from '@/store/assistance.store';
import { useAssistanceDetails } from '../hooks/useAssistanceDetails';
import { useConfirmDetails } from '../hooks/useConfirmDetails';
import {
  residentialAddressSchema,
  type ResidentialAddressFormValues,
} from '../schemas/details.schema';
import type { AssistanceDetails } from '../types/details.types';
import { DetailField } from './DetailField';
import { FoundBanner } from './FoundBanner';

const SECTION_HEADING_CLASSES = 'text-[19px] leading-7 font-semibold text-text-heading';

/** Drops fields the record has no value for. */
const presentFields = (fields: Array<[label: string, value: string | null]>) =>
  fields.filter((field): field is [string, string] => Boolean(field[1]));

function DetailsForm({ details }: { details: AssistanceDetails }) {
  const router = useRouter();
  const markConfirmed = useAssistanceStore((state) => state.markConfirmed);
  const confirmDetails = useConfirmDetails();
  const [formError, setFormError] = useState<string | null>(null);
  const needsAddress = details.residentialAddress === null;
  const personalFields = presentFields([
    ['Full name', details.fullName],
    ['Date of birth', formatDisplayDate(details.dateOfBirth)],
    ['Gender', details.gender],
    ['Phone number', details.phoneNumber],
    ['Email address', details.email],
  ]);
  const additionalFields = presentFields([
    ['State of origin', details.stateOfOrigin],
    ['State of residence', details.stateOfResidence],
    ['Town', details.town],
    ['Residential address', details.residentialAddress],
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResidentialAddressFormValues>({
    resolver: needsAddress ? zodResolver(residentialAddressSchema) : undefined,
    mode: 'onTouched',
    defaultValues: { residentialAddress: '' },
  });

  const onSubmit = (values: ResidentialAddressFormValues) => {
    setFormError(null);
    confirmDetails.mutate(needsAddress ? { residentialAddress: values.residentialAddress } : {}, {
      onSuccess: () => {
        markConfirmed();
        router.push(ROUTES.COMPLETE);
      },
      onError: (error) => setFormError(error.message),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-1 flex-col">
      <section aria-labelledby="personal-heading" className="mt-6">
        <h2 id="personal-heading" className={SECTION_HEADING_CLASSES}>
          Personal Information
        </h2>
        <dl className="mt-4 flex flex-col gap-4">
          {personalFields.map(([label, value]) => (
            <DetailField key={label} label={label} value={value} tone="muted" />
          ))}
        </dl>
      </section>

      <section aria-labelledby="additional-heading" className="mt-8">
        <h2 id="additional-heading" className={SECTION_HEADING_CLASSES}>
          Additional Information
        </h2>
        {additionalFields.length > 0 && (
          <dl className="mt-4 flex flex-col gap-4">
            {additionalFields.map(([label, value]) => (
              <DetailField key={label} label={label} value={value} />
            ))}
          </dl>
        )}
        {needsAddress && (
          <div className="mt-4">
            <Input
              label="Residential address"
              labelClassName="text-[15px] text-text-muted"
              placeholder="House number, street, city"
              autoComplete="street-address"
              readOnly={confirmDetails.isPending}
              error={errors.residentialAddress?.message}
              {...register('residentialAddress')}
            />
          </div>
        )}
      </section>

      <div aria-live="polite">
        {formError && (
          <p role="alert" className="mt-6 text-sm text-danger">
            {formError}
          </p>
        )}
      </div>

      {/* Pinned to the bottom on mobile. */}
      <div className="mt-auto pt-10 md:mt-10 md:pt-0">
        <Button
          type="submit"
          disabled={needsAddress && !isValid}
          isLoading={confirmDetails.isPending}
        >
          Continue
        </Button>
      </div>
    </form>
  );
}

export function DetailsReview() {
  const {
    data: details,
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
  } = useAssistanceDetails();

  return (
    <div className="flex flex-1 flex-col px-6 pt-5 pb-8 lg:justify-center lg:py-16">
      <div className="flex items-center gap-4">
        <BackButton href={ROUTES.WELCOME} />
        <h1 className="text-[22px] leading-8 font-semibold text-text-heading">Your Details</h1>
      </div>

      {details ? (
        <>
          <div className="mt-5">
            <FoundBanner />
          </div>
          <DetailsForm details={details} />
        </>
      ) : isPending ? (
        <div className="flex flex-1 items-center justify-center py-20 text-primary-600">
          <Spinner label="Loading your details" className="[&_svg]:size-8" />
        </div>
      ) : (
        isError && (
          <div role="alert" className="mt-10 flex flex-col items-start gap-4">
            <p className="text-[15px] text-text-body">{error.message}</p>
            <Button
              variant="secondary"
              onClick={() => void refetch()}
              isLoading={isRefetching}
              className="w-auto"
            >
              Try again
            </Button>
          </div>
        )
      )}
    </div>
  );
}
