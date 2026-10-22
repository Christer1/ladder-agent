// Shared Button. Presentational only: no API calls, no feature imports.
import { cn } from '@/lib/utils/cn';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = React.ComponentProps<'button'> & {
  /** primary: partner-coloured pill (Continue, Verify). secondary: outlined pill (Cancel). */
  variant?: ButtonVariant;
  isLoading?: boolean;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-100 disabled:text-white',
  secondary:
    'border-[1.5px] border-primary-600 bg-transparent text-primary-600 hover:bg-primary-50 disabled:border-primary-100 disabled:text-primary-200',
};

export const buttonClasses = (variant: ButtonVariant = 'primary', className?: string) =>
  cn(
    'inline-flex h-14 w-full items-center justify-center gap-2 rounded-pill px-6 text-lg font-semibold transition-colors disabled:cursor-not-allowed',
    VARIANT_CLASSES[variant],
    className,
  );

export function Button({
  variant = 'primary',
  isLoading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={buttonClasses(variant, cn(isLoading && 'disabled:bg-primary-600', className))}
      {...props}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}
