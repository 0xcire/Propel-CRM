// contacts
// listings
// tasks
// analytics
// ...?

import { Menu } from 'lucide-react';
import { NavContent } from './NavContent';
import {
  Sheet,
  SheetContent,
  // SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

export function Navbar({ name }: { name: string }): JSX.Element {
  return (
    <>
      {/* <div className='md:hidden'> */}
      <Sheet>
        <SheetTrigger className='absolute left-5 top-5 xl:hidden'>
          <Menu />
        </SheetTrigger>
        <SheetContent
          side='left'
          className='w-[300px] xl:hidden'
        >
          <SheetHeader>
            <SheetTitle className='mx-auto text-2xl'>Propel CRM</SheetTitle>
          </SheetHeader>
          <NavContent name={name} />
        </SheetContent>
      </Sheet>
      {/* </div> */}
      <NavContent
        name={name}
        className='hidden xl:flex'
      />
    </>
  );
}
