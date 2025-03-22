import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { InactiveAccountError, InvalidEmailPasswordError } from "./utils/error";
import { sendRequest } from "./utils/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let res = await sendRequest({
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
          body: {
            ...credentials,
          },
        });

        if (res.statusCode === 201) {
          if (res?.data?.user) {
            let user = res.data.user;
            return {
              _id: user?._id,
              email: user?.email,
              name: user?.name,
              accessToken: res?.access_token,
            };
          }
        } else if (+res.statusCode === 401) {
          throw new InvalidEmailPasswordError();
        } else if (res.statusCode === 400) {
          throw new InactiveAccountError();
        } else {
          throw new Error("Something went wrong");
        }
      },
    }),
  ], //  By default, the `id` property does not exist on `token` or `session`. See the [TypeScript](https://authjs.dev/getting-started/typescript) on how to add it.
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = {
          _id: user._id,
          email: user.email,
          name: user.name,
          id: user.id,
          accessToken: user.accessToken, // ✅ Thêm accessToken vào token
        };
      }
      return token;
    },
    session({ session, token }) {
      session.user = token.user; // ✅ Ensuring correct type
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
});
