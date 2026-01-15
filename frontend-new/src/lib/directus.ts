// import { createDirectus, rest, staticToken } from "@directus/sdk";

// const directusUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
// const apiKey = process.env.SERVICE_USER_TOKEN || "";

// export const directus = createDirectus(directusUrl)
//   .with(staticToken(apiKey))
//   .with(rest({ cache: "no-store" }));

// import { createDirectus, rest } from '@directus/sdk';

// export const directus = createDirectus(
//   process.env.NEXT_PUBLIC_BACKEND_URL as string
// ).with(rest({
//   auth: {
//     staticToken: process.env.SERVICE_USER_TOKEN as string,
//   },
// }));


import { createDirectus, rest, staticToken } from "@directus/sdk";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
const TOKEN = process.env.SERVICE_USER_TOKEN!;

export const directus = createDirectus(BACKEND_URL)
  .with(staticToken(TOKEN))
  .with(rest());