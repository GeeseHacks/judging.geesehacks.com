import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      console.log("Next URL: ", nextUrl.pathname);
      
      const isOnLoginOrSignUp = nextUrl.pathname.startsWith('/login');

      if (isLoggedIn && isOnLoginOrSignUp) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      else if (isLoggedIn || (!isLoggedIn && isOnLoginOrSignUp)) {
        return true;
      }

      return Response.redirect(new URL('/login', nextUrl));
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
