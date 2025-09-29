// import axios from "axios";

// const backend = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // np. http://localhost/backend
//   timeout: 2000,
// });

// // 🔒 Token tylko na serwerze!
// backend.interceptors.request.use((config) => {
//   if (typeof window === "undefined") {
//     const token = process.env.SERVICE_USER_TOKEN;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }
//   return config;
// });

// export default backend;

import axios from "axios";

const backend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // np. http://directus:8055
  timeout: 2000,
  headers: {
    Authorization: `Bearer ${process.env.SERVICE_USER_TOKEN}`,
  },
});

export default backend;
