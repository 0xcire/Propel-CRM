import { extractInitials } from '@/utils/name';
import { Avatar as Wrapper, AvatarFallback } from './ui/avatar';

export function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}): JSX.Element {
  const initials = extractInitials(name);
  return (
    <Wrapper className={className}>
      <AvatarFallback>{initials}</AvatarFallback>
    </Wrapper>
  );
}
