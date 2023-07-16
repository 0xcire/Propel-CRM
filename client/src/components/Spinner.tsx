type SpinnerProps = {
  variant: keyof typeof VariantMap;
};

const VariantMap = {
  xs: 'loading-xs',
  sm: 'loading-sm',
  md: 'loading-md',
  lg: 'loading-lg',
};

export const Spinner = ({ variant }: SpinnerProps): JSX.Element => {
  const modifier = VariantMap[variant];

  return <span className={`loading loading-spinner ${modifier}`}></span>;
};
