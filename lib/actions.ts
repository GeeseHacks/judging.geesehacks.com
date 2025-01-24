'use server';

import { signIn } from '../auth';
import { AuthError } from 'next-auth';

export async function authenticate(login_key: string) {
  try {
    await signIn('credentials', {redirectTo: '/dashboard', login_key: login_key});
    return {}; // No error means success
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };;
        default:
          return { error: "Something unexpected occured" };;
      }
    }
    console.log(error);
    throw error;
  }
}
