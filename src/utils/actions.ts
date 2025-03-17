"use server";
import { signIn } from "@/auth";

export async function authenticate(email: string, password: string) {
  try {
    const r = await signIn("credentials", {
      username: email,
      password: password,
    });
    return r;
  } catch (error) {
    return { error: "Incorrect username or password" };
    // if (error.cause.err instanceof InvalidLoginError) {
    // } else {
    //   throw new Error("Failed to authenticate");
    // }
  }
}
