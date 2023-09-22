import { PageHeader } from '@/components/Layout/PageHeader';
import { AddContact } from '../AddContact';

export function ContactPage(): JSX.Element {
  return (
    <>
      <div className='flex h-full w-full flex-1 flex-col p-10'>
        <PageHeader text='Contacts'>
          <AddContact />
        </PageHeader>
        <div className='h-full pt-10'>
          <div className='relative flex h-full flex-col rounded-md border shadow-md'>
            <div className='absolute flex h-full w-full flex-col px-4'>
              <p>hey :D</p>
            </div>
          </div>
        </div>
      </div>
      {/* <Outlet /> */}
    </>
  );
}
