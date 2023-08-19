// Form
// mode - Sign In | Sign Up

import { verifyPassword, name, username, signUpPassword } from "@/config";

// FormInput {control}
//
type AuthFormProps = {
  mode: 'create' | 'update'
}

const signInSchema = z.object({
  email: z.string().email(),
  password: verifyPassword,
});

const signUpSchema = z.object({
  name: name,
  username: username,
  email: z.string().email(),
  password: signUpPassword,
});

export function AuthForm({ mode }: AuthFormProps): JSX.Element {
  return (
    <div>
      <p>hey</p>
    </div>
  )
}
