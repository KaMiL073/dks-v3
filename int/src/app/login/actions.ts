"use server";
import { cookies } from "next/headers";

type LoginState = { error?: string; success?: boolean } | undefined;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const res = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return { error: "Niepoprawne dane logowania." };

    const { data } = await res.json();
    const jar = await cookies();

    jar.set("access_token", data.access_token || "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    jar.set("refresh_token", data.refresh_token || "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return { success: true };
  } catch (e) {
    console.error("loginAction error:", e);
    return { error: "Wystąpił błąd. Spróbuj ponownie." };
  }
}