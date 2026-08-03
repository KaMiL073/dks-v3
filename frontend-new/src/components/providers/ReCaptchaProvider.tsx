"use client";

import React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function ReCaptchaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const bypassRecaptcha =
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_RECAPTCHA_BYPASS_LOCAL === "true";
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (bypassRecaptcha) {
    return <>{children}</>;
  }

  if (!siteKey) {
    console.error("Missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY");
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
