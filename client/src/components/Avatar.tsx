import { Avatar as Wrapper, AvatarFallback } from './ui/avatar';

export function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}): JSX.Element {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
  return (
    <Wrapper className={className}>
      <AvatarFallback>{initials}</AvatarFallback>
    </Wrapper>
  );
}
