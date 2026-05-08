"use server";

import { cookies } from "next/headers";

export async function logoutAction() {
  const cookieStore = await cookies();

  const cookiesToDelete = [
    "session",
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.csrf-token",
    "__Secure-next-auth.csrf-token",
    "authjs.session-token",
    "__Secure-authjs.session-token",
    "authjs.csrf-token",
    "__Secure-authjs.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
    "authjs.callback-url",
    "__Secure-authjs.callback-url",
  ];

  for (const cookieName of cookiesToDelete) {
    cookieStore.delete(cookieName);
  }

  return { success: true };
}
