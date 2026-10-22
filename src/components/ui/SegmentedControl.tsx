// Two-or-more option toggle (BVN | NIN). A radiogroup with arrow-key support. Presentational only.
'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils/cn';

type SegmentedControlProps<T extends string> = {
  label: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
};

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
  className,
}: SegmentedControlProps<T>) {
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (fromIndex: number, step: number) => {
    const nextIndex = (fromIndex + step + options.length) % options.length;
    onChange(options[nextIndex].value);
    buttonsRef.current[nextIndex]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        'flex h-[46px] rounded-segment border border-border bg-surface-subtle',
        className,
      )}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(element) => {
              buttonsRef.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                move(index, 1);
              } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                move(index, -1);
              }
            }}
            className={cn(
              '-m-px flex-1 rounded-segment text-sm font-semibold transition-colors disabled:cursor-not-allowed',
              isSelected
                ? 'bg-primary-600 text-white'
                : 'font-normal text-text-strong hover:text-primary-600',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
