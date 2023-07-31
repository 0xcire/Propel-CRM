import { ProfileContent } from '../components';
import { Authentication, DeleteAccount, UserInfo } from '../components';

export function Profile(): JSX.Element {
  return (
    <>
      <div className='grid h-full w-full place-items-center xl:flex-1'>
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
