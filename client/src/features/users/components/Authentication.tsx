import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { SubmitButton } from '@/components';
import { useUpdateAccount } from '../hooks/useUpdateAccount';
import { useUser } from '@/lib/react-query-auth';

const PasswordSchema = z.object({
  verifyPassword: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});

type PasswordFields = z.infer<typeof PasswordSchema>;

export function Authentication(): JSX.Element {
  const user = useUser();
  // let id: number;
  // if (user.data) {
  //   id = user.data.id;
  // }
  // const {id} = user.data;
  const { mutate, isLoading } = useUpdateAccount();

  const passwordForm = useForm<PasswordFields>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      verifyPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: PasswordFields): void {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // const data = Object.keys(values).map((key) => {
    //   if (user.data) {
    //     return values[key];
    //   }
    // });
    console.log(typeof values);
    // if (user.data) {
    //   mutate({ id, values });
    // }
  }
  return (
    <>
      <Typography variant='h3'>Password and Authentication</Typography>

      {/* TODO: verify old password with stored. new and confirm need to match to enable submit btn */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>Change Password</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  Enter your current password and your new password.
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <FormField
                  control={passwordForm.control}
                  name='verifyPassword'
                  render={({ field }): JSX.Element => (
                    <FormItem>
                      <FormLabel>Old Password</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            placeholder='password123'
                            {...field}
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name='password'
                  render={({ field }): JSX.Element => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            placeholder='password123'
                            {...field}
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name='confirmPassword'
                  render={({ field }): JSX.Element => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            placeholder='password123'
                            {...field}
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                {/* TODO: change disabled if new and confirm are matching */}
                <SubmitButton
                  isLoading={false}
                  disabled={false}
                  text='Save Changes'
                />
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
