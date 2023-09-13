// reference: https://ui.shadcn.com/docs/components/typography

import { twMerge } from 'tailwind-merge';

type TypographyProps = {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  children: string | Array<string>;
  className?: string;
};

export const Typography = ({
  variant,
  children,
  className,
}: TypographyProps): JSX.Element => {
  switch (variant) {
    case 'h1':
      return (
        <h1
          className={twMerge(
            'scroll-m-20 text-4xl font-black tracking-tight lg:text-5xl',
            className
          )}
        >
          {children}
        </h1>
      );
    case 'h2':
      return (
        <h2
          className={twMerge(
            'scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0',
            className
          )}
        >
          {children}
        </h2>
      );
    case 'h3':
      return (
        <h3
          className={twMerge(
            'scroll-m-20 text-2xl font-bold tracking-tight',
            className
          )}
        >
          {children}
        </h3>
      );
    case 'h4':
      return (
        <h4
          className={twMerge(
            'scroll-m-20 text-xl font-bold tracking-tight',
            className
          )}
        >
          {children}
        </h4>
      );
    case 'p':
      return <p className={twMerge('leading-7', className)}>{children}</p>;
  }
};
