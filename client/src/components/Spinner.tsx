import { twMerge } from 'tailwind-merge';

type SpinnerProps = {
  variant: keyof typeof VariantMap;
  className?: string;
};

const VariantMap = {
  xs: 'loading-xs',
  sm: 'loading-sm',
  md: 'loading-md',
  lg: 'loading-lg',
};

export const Spinner = ({ variant, className }: SpinnerProps): JSX.Element => {
  const modifier = VariantMap[variant];

  return (
    <span
      className={twMerge(`loading loading-spinner ${modifier}`, className)}
    ></span>
  );
};
