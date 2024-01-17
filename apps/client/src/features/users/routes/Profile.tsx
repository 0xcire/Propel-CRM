import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { ProfileContent } from '../components/Layout/ProfileContent';
import { Authentication } from '../components/Authentication';
import { DeleteAccount } from '../components/DeleteAccount';
import { UserInfo } from '../components/UserInfo';

export function Profile(): JSX.Element {
  useIdleTimeout();
  return (
    <>
      <div className='grid h-screen w-full place-items-center xl:flex-1'>
        <ProfileContent>
          <UserInfo />
        </ProfileContent>

        <ProfileContent>
          <Authentication />
        </ProfileContent>

        <ProfileContent>
          <DeleteAccount />
        </ProfileContent>
      </div>
    </>
  );
}
