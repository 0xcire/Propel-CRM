import { twMerge } from 'tailwind-merge';

type SpinnerProps = {
  variant?: keyof typeof VariantMap;
  className?: string;
  fillContainer?: boolean;
};

const VariantMap = {
  xs: 'loading-xs',
  sm: 'loading-sm',
  md: 'loading-md',
  lg: 'loading-lg',
};

export const Spinner = ({
  variant = 'xs',
  className,
  fillContainer,
}: SpinnerProps): JSX.Element => {
  const modifier = VariantMap[variant];

  if (fillContainer) {
    return (
      <div
        className={twMerge(
          `grid h-full w-full place-items-center ${modifier}`,
          className
        )}
      >
        <span className={`loading loading-spinner ${modifier}`}></span>
      </div>
    );
  }
  return <span className={`loading loading-spinner ${modifier}`}></span>;
};
