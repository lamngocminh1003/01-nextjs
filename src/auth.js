import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// Your own logic for dealing with plaintext password strings; be careful!
import { ZodError } from "zod";
import { signInSchema } from "./lib/zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          console.log("credentials", credentials);

          let user = null;

          // Simulate fetching user from database
          user = {
            _id: "123",
            username: "lamngocminh1003@gmail.com",
            email: "lamngocminh1003@gmail.com",
            password: "$2a$10$abcdefg1234567890hijklmnopqrstuvwxyz", // Example hashed password
            isVerify: "123",
            type: "123",
            role: "123",
          };
          if (!user) {
            // No user found, so this is their first attempt to login
            // Optionally, this is also the place you could do a user registration
            throw new Error("Invalid credentials.");
          }

          // return user object with their profile data
          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            console.log("error", error);

            return null;
          }
        }
      },
    }),
  ],
});
