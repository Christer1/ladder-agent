// "DD / MM / YYYY" text field with a calendar button that opens the native date picker.
// Typing is masked as you go; the form keeps the display text and converts it to ISO on submit.
'use client';

import { useRef } from 'react';
import { Input } from '@/components/ui';
import { isoToDisplayDate, displayToIsoDate, maskDateInput, todayIsoDate } from '@/lib/utils/date';

type DateOfBirthFieldProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
};

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.5 10h17M8 3v4M16 3v4M8 13.5h.01M12 13.5h.01M16 13.5h.01M8 17h.01M12 17h.01M16 17h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DateOfBirthField({
  name,
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: DateOfBirthFieldProps) {
  const pickerRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    const picker = pickerRef.current;
    if (!picker) return;
    picker.max = todayIsoDate();
    picker.value = displayToIsoDate(value) ?? '';
    try {
      picker.showPicker();
    } catch {
      // Older browsers: the visible text field still works.
      picker.focus();
    }
  };

  return (
    <Input
      label="Date of birth"
      name={name}
      placeholder="DD / MM / YYYY"
      inputMode="numeric"
      autoComplete="bday"
      maxLength={14}
      value={value}
      disabled={disabled}
      error={error}
      onChange={(event) => onChange(maskDateInput(event.target.value))}
      onBlur={onBlur}
      rightElement={
        <span className="relative flex">
          <button
            type="button"
            onClick={openPicker}
            disabled={disabled}
            aria-label="Choose date from a calendar"
            className="flex size-10 items-center justify-center rounded-full text-text-muted transition-colors hover:text-text-strong disabled:cursor-not-allowed"
          >
            <CalendarIcon />
          </button>
          <input
            ref={pickerRef}
            type="date"
            tabIndex={-1}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0"
            onChange={(event) => {
              onChange(isoToDisplayDate(event.target.value));
              onBlur();
            }}
          />
        </span>
      }
    />
  );
}
