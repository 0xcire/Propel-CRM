import { Avatar as Wrapper, AvatarFallback } from './ui/avatar';

export function Avatar({ name }: { name: string }): JSX.Element {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
  return (
    <Wrapper>
      <AvatarFallback>{initials}</AvatarFallback>
    </Wrapper>
  );
}
