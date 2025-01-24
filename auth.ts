import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import prisma from '@lib/prisma';
import { validateLoginKey } from '@lib/loginKeyUtils'; 

// Define the User type for NextAuth
interface User {
  id: string;
}

// Function to fetch the user from the database
async function getUser(login_key: string): Promise<User | null> {
  try {
    if (!login_key) {
        throw new Error("Login key is required");
      }

    const user = await prisma.judge.findUnique({
      where: { login_key },
    });

    if (user) {
      return {
        id: user.id.toString(),
      };
    } else {
      console.log("Judge not found or invalid key");
      return null;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials: Record<string, any>) {
        const { login_key } = credentials as { login_key: string };

        // Validate the login key
        const loginError = validateLoginKey(login_key);

        if (loginError) {
          console.log('Invalid login key format:', loginError);
          return null;
        }

        // Fetch user from the database
        try {
          const user = await getUser(login_key);

          if (!user) {
            console.log('User not found');
            return null;
          }

          // Return the user object on successful authentication
          return user;
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      },
    }),
  ],
});
