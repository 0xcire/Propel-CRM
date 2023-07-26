import { ProfileContent } from '../components';
import { Authentication, DeleteAccount, UserInfo } from '../components';

// TODO: create user/email form component
// ?? VerifyPasswordDialog
// TODO: create password form component
// ??

// TODO: add password valiation schema that can be shared across

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
