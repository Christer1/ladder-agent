// Shared Input with a visible label. Presentational only: no API calls, no feature imports.
'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils/cn';

type InputProps = React.ComponentProps<'input'> & {
  label: string;
  /** Interactive element inside the right edge, e.g. the calendar button. */
  rightElement?: React.ReactNode;
  /** Error text under the field. Pass `isInvalid` instead to only colour the border. */
  error?: string;
  /** Shown below the error text, e.g. the Get Help card. */
  errorAction?: React.ReactNode;
  isInvalid?: boolean;
  labelClassName?: string;
};

export function Input({
  label,
  rightElement,
  error,
  errorAction,
  isInvalid,
  id,
  className,
  labelClassName,
  'aria-describedby': ariaDescribedBy,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const describedBy = [error ? errorId : null, ariaDescribedBy].filter(Boolean).join(' ');

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={inputId} className={cn('text-base text-text-strong', labelClassName)}>
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error || isInvalid ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={cn(
            'h-[52px] w-full rounded-input border border-border bg-surface px-4 text-base text-text-strong transition-colors outline-none placeholder:text-text-muted',
            'focus:border-primary-600 focus-visible:outline-none aria-invalid:border-danger',
            rightElement && 'pr-14',
            className,
          )}
          {...props}
        />
        {rightElement && (
          <span className="absolute top-1/2 right-2 flex -translate-y-1/2">{rightElement}</span>
        )}
      </div>
      {error && (
        <div className="-mt-1.5 flex flex-col gap-3">
          <p id={errorId} className="text-xs leading-5 text-danger">
            {error}
          </p>
          {errorAction}
        </div>
      )}
    </div>
  );
}
