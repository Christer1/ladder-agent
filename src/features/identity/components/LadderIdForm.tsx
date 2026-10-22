// Screen 4 "/ladder-id": enter a Ladder ID, Verify. Success opens the liveness check.
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BackButton } from '@/components/layout/BackButton';
import { Button, Input } from '@/components/ui';
import { ROUTES } from '@/config/routes';
import { useIdentifyLadderId } from '../hooks/useIdentify';
import { ladderIdSchema, type LadderIdFormValues } from '../schemas/identity.schema';
import { resolveIdentityError } from '../utils/identity-error';
import { IdCardIllustration } from './IdCardIllustration';

export function LadderIdForm() {
  const router = useRouter();
  const identify = useIdentifyLadderId();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<LadderIdFormValues>({
    resolver: zodResolver(ladderIdSchema),
    mode: 'onTouched',
    defaultValues: { ladderId: '' },
  });

  const onSubmit = ({ ladderId }: LadderIdFormValues) => {
    setFormError(null);
    identify.mutate(
      { ladderId },
      {
        onSuccess: () => router.push(ROUTES.LIVENESS),
        onError: (error) => {
          const resolved = resolveIdentityError(error);
          if (resolved.field === 'ladderId') {
            setError('ladderId', { type: 'server', message: resolved.message });
          } else {
            setFormError(resolved.message);
          }
        },
      },
    );
  };

  return (
    <div className="flex flex-1 flex-col px-6 pt-5 pb-8 lg:justify-center lg:py-16">
      <BackButton href={ROUTES.WELCOME} />

      <IdCardIllustration className="mx-auto mt-5" />

      <div className="mt-8 text-center">
        <h1 className="text-[22px] leading-8 font-semibold text-text-heading">
          Verify your Ladder ID
        </h1>
        <p className="mx-auto mt-3 max-w-[300px] text-[15px] leading-[22px] text-text-muted">
          Enter the Ladder ID you used during registration. This helps us find your details and
          verify your identity.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-9">
        <Input
          label="Ladder ID"
          labelClassName="text-[15px] font-medium text-text-heading"
          placeholder="e.g. LID-7F3A-9K2D"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={13}
          readOnly={identify.isPending}
          error={errors.ladderId?.message}
          className="uppercase placeholder:normal-case"
          {...register('ladderId')}
        />

        <div aria-live="polite">
          {formError && (
            <p role="alert" className="mt-4 text-sm text-danger">
              {formError}
            </p>
          )}
        </div>

        <Button type="submit" disabled={!isValid} isLoading={identify.isPending} className="mt-5">
          Verify
        </Button>
      </form>
    </div>
  );
}
