export type ExecuteRecaptcha =
  | ((action?: string) => Promise<string>)
  | undefined;

export function canBypassRecaptchaLocally(): boolean {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_RECAPTCHA_BYPASS_LOCAL !== "true" ||
    typeof window === "undefined"
  ) {
    return false;
  }

  return ["localhost", "127.0.0.1", "::1"].includes(
    window.location.hostname
  );
}

export async function getRecaptchaToken(
  executeRecaptcha: ExecuteRecaptcha,
  action: string
): Promise<string | undefined> {
  if (canBypassRecaptchaLocally()) return undefined;

  if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    throw new Error("Brak konfiguracji NEXT_PUBLIC_RECAPTCHA_SITE_KEY.");
  }

  if (!executeRecaptcha) {
    throw new Error("reCAPTCHA nie jest jeszcze gotowa. Spróbuj ponownie.");
  }

  return executeRecaptcha(action);
}
